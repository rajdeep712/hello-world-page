import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { Eye, Trash2, Mail, Phone, Calendar, Ruler, FileText, Loader2, MapPin, Image, X, Send, CreditCard, Truck, Package } from "lucide-react";

interface EmailSent {
  type: string;
  sent_at: string;
}

interface CustomOrderRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  preferred_size: string;
  usage_description: string;
  notes: string | null;
  shipping_address: string | null;
  reference_images: string[] | null;
  status: string;
  admin_notes: string | null;
  estimated_price: number | null;
  estimated_delivery_date: string | null;
  created_at: string;
  emails_sent: EmailSent[] | null;
}

const statusOptions = [
  { value: "pending", label: "Pending", bgColor: "bg-amber-100", textColor: "text-amber-700", borderColor: "border-amber-200" },
  { value: "under_review", label: "Under Review", bgColor: "bg-sky-100", textColor: "text-sky-700", borderColor: "border-sky-200" },
  { value: "payment_pending", label: "Payment Pending", bgColor: "bg-orange-100", textColor: "text-orange-600", borderColor: "border-orange-200" },
  { value: "payment_done", label: "Payment Done", bgColor: "bg-emerald-100", textColor: "text-emerald-700", borderColor: "border-emerald-200" },
  { value: "in_progress", label: "In Progress", bgColor: "bg-violet-100", textColor: "text-violet-700", borderColor: "border-violet-200" },
  { value: "in_delivery", label: "In Delivery", bgColor: "bg-cyan-100", textColor: "text-cyan-700", borderColor: "border-cyan-200" },
  { value: "delivered", label: "Delivered", bgColor: "bg-green-100", textColor: "text-green-700", borderColor: "border-green-200" },
  { value: "rejected", label: "Rejected", bgColor: "bg-rose-100", textColor: "text-rose-600", borderColor: "border-rose-200" },
];

const emailTemplates = [
  { value: "payment_request", label: "Request Payment", icon: CreditCard, description: "Send payment link to customer" },
  { value: "payment_confirmed", label: "Payment Confirmed", icon: Package, description: "Notify that production has started" },
  { value: "in_delivery", label: "Out for Delivery", icon: Truck, description: "Product is on its way" },
  { value: "delivered", label: "Delivered", icon: Package, description: "Order has been delivered" },
  { value: "custom", label: "Custom Message", icon: Mail, description: "Send a custom email" },
];

const AdminCustomOrders = () => {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<CustomOrderRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editData, setEditData] = useState({
    status: "",
    admin_notes: "",
    estimated_price: "",
    estimated_delivery_date: "",
  });
  const [emailType, setEmailType] = useState<string>("");
  const [customMessage, setCustomMessage] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const { data: requests, isLoading } = useQuery({
    queryKey: ["custom-order-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_order_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as CustomOrderRequest[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<Omit<CustomOrderRequest, 'emails_sent'>> & { id: string }) => {
      const { id, ...data } = updates;
      const { error } = await supabase
        .from("custom_order_requests")
        .update(data)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-order-requests"] });
      toast.success("Request updated successfully");
    },
    onError: () => {
      toast.error("Failed to update request");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("custom_order_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-order-requests"] });
      toast.success("Request deleted");
    },
    onError: () => {
      toast.error("Failed to delete request");
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async ({ requestId, imageUrl, allImages }: { requestId: string; imageUrl: string; allImages: string[] }) => {
      const urlParts = imageUrl.split('/custom-order-images/');
      if (urlParts.length < 2) throw new Error('Invalid image URL');
      const filePath = urlParts[1];

      const { error: storageError } = await supabase.storage
        .from('custom-order-images')
        .remove([filePath]);

      if (storageError) throw storageError;

      const updatedImages = allImages.filter(img => img !== imageUrl);
      const { error: dbError } = await supabase
        .from('custom_order_requests')
        .update({ reference_images: updatedImages })
        .eq('id', requestId);

      if (dbError) throw dbError;

      return { requestId, updatedImages };
    },
    onSuccess: ({ requestId, updatedImages }) => {
      queryClient.invalidateQueries({ queryKey: ["custom-order-requests"] });
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest({ ...selectedRequest, reference_images: updatedImages });
      }
      toast.success("Image deleted");
    },
    onError: (error) => {
      console.error('Error deleting image:', error);
      toast.error("Failed to delete image");
    },
  });

  const handleInlineStatusChange = async (requestId: string, newStatus: string) => {
    updateMutation.mutate({ id: requestId, status: newStatus });
  };

  const sendEmail = async () => {
    if (!selectedRequest || !emailType) return;

    if (emailType === "payment_request" && !selectedRequest.estimated_price) {
      toast.error("Please set an estimated price before sending payment request");
      return;
    }

    if (emailType === "custom" && !customMessage.trim()) {
      toast.error("Please enter a custom message");
      return;
    }

    setIsSendingEmail(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      
      const response = await fetch(
        `https://grdolasawzsrwuqhpheu.supabase.co/functions/v1/send-custom-order-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.session?.access_token}`,
          },
          body: JSON.stringify({
            customOrderId: selectedRequest.id,
            emailType,
            customMessage: emailType === "custom" ? customMessage : undefined,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send email");
      }

      toast.success("Email sent successfully");
      setEmailType("");
      setCustomMessage("");
      queryClient.invalidateQueries({ queryKey: ["custom-order-requests"] });
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send email");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const openDetail = (request: CustomOrderRequest) => {
    setSelectedRequest(request);
    setEditData({
      status: request.status,
      admin_notes: request.admin_notes || "",
      estimated_price: request.estimated_price?.toString() || "",
      estimated_delivery_date: request.estimated_delivery_date || "",
    });
    setEmailType("");
    setCustomMessage("");
    setIsDetailOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedRequest) return;

    updateMutation.mutate({
      id: selectedRequest.id,
      status: editData.status,
      admin_notes: editData.admin_notes || null,
      estimated_price: editData.estimated_price ? parseFloat(editData.estimated_price) : null,
      estimated_delivery_date: editData.estimated_delivery_date || null,
    });
    setIsDetailOpen(false);
  };

  const getStatusBadge = (status: string, showChevron = false) => {
    const option = statusOptions.find((o) => o.value === status);
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${option?.bgColor || "bg-muted"} ${option?.textColor || "text-foreground"} ${option?.borderColor || "border-border"}`}>
        {option?.label || status}
        {showChevron && (
          <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-foreground">Custom Order Requests</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage bespoke pottery requests from customers
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Requests", value: requests?.length || 0 },
          { label: "Pending", value: requests?.filter((r) => r.status === "pending" || r.status === "under_review").length || 0 },
          { label: "In Progress", value: requests?.filter((r) => r.status === "in_progress" || r.status === "payment_done").length || 0 },
          { label: "Delivered", value: requests?.filter((r) => r.status === "delivered").length || 0 },
        ].map((stat) => (
          <div key={stat.label} className="bg-card p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-serif text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Est. Price</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No custom order requests yet
                </TableCell>
              </TableRow>
            ) : (
              requests?.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{request.name}</p>
                      <p className="text-sm text-muted-foreground">{request.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{request.preferred_size}</TableCell>
                  <TableCell>
                    <Select
                      value={request.status}
                      onValueChange={(value) => handleInlineStatusChange(request.id, value)}
                    >
                      <SelectTrigger className="w-auto min-w-[150px] h-auto border-0 bg-transparent p-0 shadow-none focus:ring-0 [&>svg]:hidden">
                        <SelectValue>
                          {getStatusBadge(request.status, true)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-amber-50/95 backdrop-blur-sm border-amber-200 rounded-xl p-1 min-w-[180px]">
                        {statusOptions.map((option) => {
                          const isSelected = request.status === option.value;
                          return (
                            <SelectItem 
                              key={option.value} 
                              value={option.value}
                              className="rounded-lg px-3 py-2 cursor-pointer focus:bg-amber-100/50 data-[state=checked]:bg-transparent"
                            >
                              <div className="flex items-center gap-2">
                                {isSelected && (
                                  <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${option.bgColor} ${option.textColor} ${option.borderColor}`}>
                                  {option.label}
                                </span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {request.estimated_price
                      ? `₹${request.estimated_price.toLocaleString()}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(request.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDetail(request)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm("Delete this request?")) {
                            deleteMutation.mutate(request.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              Custom Order Request Details
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <h3 className="font-medium text-foreground">Customer Information</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="text-foreground">{selectedRequest.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${selectedRequest.email}`}
                      className="text-primary hover:underline"
                    >
                      {selectedRequest.email}
                    </a>
                  </div>
                  {selectedRequest.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{selectedRequest.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {format(new Date(selectedRequest.created_at), "PPP")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Preferred Size:</span>
                  <span className="capitalize font-medium">{selectedRequest.preferred_size}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Intended Usage:</span>
                  </div>
                  <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg">
                    {selectedRequest.usage_description}
                  </p>
                </div>

                {selectedRequest.shipping_address && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Delivery Address:</span>
                    </div>
                    <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg">
                      {selectedRequest.shipping_address}
                    </p>
                  </div>
                )}

                {selectedRequest.notes && (
                  <div>
                    <span className="text-sm text-muted-foreground">Additional Notes:</span>
                    <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg mt-2">
                      {selectedRequest.notes}
                    </p>
                  </div>
                )}

                {/* Reference Images */}
                {selectedRequest.reference_images && selectedRequest.reference_images.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Image className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Reference Images:</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedRequest.reference_images.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                            <img
                              src={imageUrl}
                              alt={`Reference ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-border hover:border-primary/50 transition-colors"
                            />
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("Delete this reference image?")) {
                                deleteImageMutation.mutate({
                                  requestId: selectedRequest.id,
                                  imageUrl,
                                  allImages: selectedRequest.reference_images || [],
                                });
                              }
                            }}
                            disabled={deleteImageMutation.isPending}
                            className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Email Actions */}
              <div className="border-t border-border pt-6 space-y-4">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Send Email to Customer
                </h3>

                {/* Show previously sent emails */}
                {selectedRequest.emails_sent && selectedRequest.emails_sent.length > 0 && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-foreground mb-2">Previously Sent Emails:</p>
                    <div className="space-y-1">
                      {selectedRequest.emails_sent.map((email, index) => {
                        const template = emailTemplates.find(t => t.value === email.type);
                        return (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {template?.label || email.type}
                              </Badge>
                            </span>
                            <span className="text-muted-foreground">
                              {format(new Date(email.sent_at), "MMM d, yyyy 'at' h:mm a")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div className="grid gap-2">
                  {emailTemplates.map((template) => {
                    const alreadySent = selectedRequest.emails_sent?.some(e => e.type === template.value);
                    return (
                      <div
                        key={template.value}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          emailType === template.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setEmailType(template.value)}
                      >
                        <template.icon className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium text-sm flex items-center gap-2">
                            {template.label}
                            {alreadySent && (
                              <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-700">
                                Sent
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">{template.description}</p>
                        </div>
                        <input
                          type="radio"
                          checked={emailType === template.value}
                          onChange={() => setEmailType(template.value)}
                          className="accent-primary"
                        />
                      </div>
                    );
                  })}
                </div>

                {emailType === "custom" && (
                  <Textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Enter your custom message..."
                    rows={4}
                  />
                )}

                {emailType === "payment_request" && !selectedRequest.estimated_price && (
                  <p className="text-sm text-destructive">
                    Please set an estimated price below before sending payment request.
                  </p>
                )}

                <Button
                  onClick={sendEmail}
                  disabled={!emailType || isSendingEmail || (emailType === "payment_request" && !selectedRequest.estimated_price)}
                  className="w-full"
                >
                  {isSendingEmail ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Email
                    </>
                  )}
                </Button>
              </div>

              {/* Admin Controls */}
              <div className="border-t border-border pt-6 space-y-4">
                <h3 className="font-medium text-foreground">Admin Controls</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={editData.status}
                      onValueChange={(value) =>
                        setEditData((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Estimated Price (₹)</Label>
                    <Input
                      type="number"
                      value={editData.estimated_price}
                      onChange={(e) =>
                        setEditData((prev) => ({ ...prev, estimated_price: e.target.value }))
                      }
                      placeholder="Enter estimated price"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Estimated Delivery Date</Label>
                  <Input
                    type="date"
                    value={editData.estimated_delivery_date}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, estimated_delivery_date: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Admin Notes (visible to customer)</Label>
                  <Textarea
                    value={editData.admin_notes}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, admin_notes: e.target.value }))
                    }
                    placeholder="Add notes for the customer..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleUpdate} disabled={updateMutation.isPending} className="flex-1">
                    {updateMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomOrders;
