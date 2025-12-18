import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Upload, X, Clock, Palette, Ruler, Sparkles, MapPin, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAddresses, Address, AddressFormData } from "@/hooks/useAddresses";
import { useNavigate, Link } from "react-router-dom";
import AddressForm from "@/components/AddressForm";

// Gallery images
import cuppedHandsSculpture from "@/assets/products/cupped-hands-sculpture.jpg";
import earthToneServingPlates from "@/assets/products/earth-tone-serving-plates.jpg";
import organicEdgePlatters from "@/assets/products/organic-edge-platters.jpg";
import forestGreenTeaSet from "@/assets/products/forest-green-tea-set.jpg";
import minimalistCreamMugs from "@/assets/products/minimalist-cream-mugs.jpg";
import rusticDuoMugSet from "@/assets/products/rustic-duo-mug-set.jpg";

const pastWorkGallery = [
  { image: earthToneServingPlates, title: "Custom Serving Plates", description: "Wedding gift commission" },
  { image: cuppedHandsSculpture, title: "Hand Sculpture", description: "Art collector project" },
  { image: organicEdgePlatters, title: "Custom Platters", description: "Interior designer project" },
  { image: forestGreenTeaSet, title: "Personalized Tea Set", description: "Tea ceremony enthusiast" },
  { image: minimalistCreamMugs, title: "Custom Mug Set", description: "Restaurant commission" },
  { image: rusticDuoMugSet, title: "Anniversary Mug Set", description: "10th anniversary gift" },
];

const customizationOptions = [
  { icon: Ruler, title: "Size & Dimensions", description: "From petite tea cups to large serving platters" },
  { icon: Palette, title: "Glazes & Colors", description: "Choose from our signature earthy palette or request custom colors" },
  { icon: Sparkles, title: "Surface Textures", description: "Smooth, carved, stamped, or organic wabi-sabi finishes" },
  { icon: Clock, title: "Form & Function", description: "Adapt any piece to your specific usage needs" },
];

const CustomOrders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addresses, loading: addressesLoading, addAddress, getDefaultAddress } = useAddresses();
  
  const [formData, setFormData] = useState({
    name: "",
    size: "medium",
    usage: "",
    notes: "",
  });
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set default address when addresses load
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = getDefaultAddress();
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      }
    }
  }, [addresses, selectedAddressId, getDefaultAddress]);

  // Fetch profile name
  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.full_name) {
            setFormData(prev => ({ ...prev, name: data.full_name }));
          }
        });
    }
  }, [user]);

  const getSelectedAddress = (): Address | null => {
    return addresses.find(a => a.id === selectedAddressId) || null;
  };

  const formatAddressString = (address: Address): string => {
    const parts = [
      address.street,
      address.landmark,
      address.city,
      address.state,
      address.pincode,
    ].filter(Boolean);
    return parts.join(', ');
  };

  const handleAddAddress = async (data: AddressFormData) => {
    setSavingAddress(true);
    const { data: newAddress, error } = await addAddress(data);
    if (error) {
      toast.error('Failed to add address');
    } else {
      toast.success('Address added');
      setShowAddAddress(false);
      if (newAddress) {
        setSelectedAddressId(newAddress.id);
      }
    }
    setSavingAddress(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + referenceImages.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setReferenceImages(prev => [...prev, ...files].slice(0, 5));
  };

  const removeImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to submit a custom order request");
      navigate('/auth?redirect=/products/custom');
      return;
    }

    if (!formData.name || !formData.usage) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!selectedAddressId) {
      toast.error("Please select or add a delivery address");
      return;
    }

    const selectedAddress = getSelectedAddress();

    setIsSubmitting(true);
    
    try {
      // Upload reference images to storage
      const uploadedImageUrls: string[] = [];
      
      for (const file of referenceImages) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('custom-order-images')
          .upload(fileName, file);
        
        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          continue;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('custom-order-images')
          .getPublicUrl(fileName);
        
        uploadedImageUrls.push(publicUrl);
      }

      const { error } = await supabase
        .from("custom_order_requests")
        .insert({
          user_id: user.id,
          name: formData.name.trim(),
          email: user.email || '',
          phone: selectedAddress?.phone || null,
          preferred_size: formData.size,
          usage_description: formData.usage.trim(),
          notes: formData.notes.trim() || null,
          shipping_address: selectedAddress ? formatAddressString(selectedAddress) : null,
          reference_images: uploadedImageUrls,
        });

      if (error) throw error;
      
      toast.success("Custom order request submitted! We'll contact you within 48 hours.");
      setFormData({ name: formData.name, size: "medium", usage: "", notes: "" });
      setReferenceImages([]);
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Custom Orders | Bespoke Pottery - Basho</title>
        <meta 
          name="description" 
          content="Request custom handcrafted pottery. Personalized sizes, glazes, and designs. 2-4 week turnaround for bespoke ceramic pieces." 
        />
      </Helmet>

      <div className="min-h-screen">
        <Navigation />
        <main className="pt-24">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-b from-sand to-background relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary blur-3xl" />
              <div className="absolute bottom-10 right-20 w-80 h-80 rounded-full bg-amber blur-3xl" />
            </div>
            
            <div className="container px-6 relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto text-center"
              >
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-primary">
                  Bespoke Ceramics
                </span>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mt-4">
                  Custom Orders
                </h1>
                <p className="font-sans text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
                  Every piece tells a story. Let us craft something uniquely yours — 
                  a vessel that holds not just tea, but meaning.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Process Section */}
          <section className="py-20 bg-background">
            <div className="container px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-primary">
                  Our Process
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mt-4">
                  How It Works
                </h2>
              </motion.div>

              <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                {[
                  { step: "01", title: "Share Your Vision", description: "Tell us about your dream piece and how you'll use it" },
                  { step: "02", title: "Design Discussion", description: "We'll discuss options and provide a quote within 48 hours" },
                  { step: "03", title: "Crafting", description: "Your piece is wheel-thrown, dried, glazed, and kiln-fired" },
                  { step: "04", title: "Delivery", description: "Carefully packaged and delivered to your doorstep" },
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <span className="font-serif text-2xl text-primary">{item.step}</span>
                    </div>
                    <h3 className="font-serif text-lg text-foreground mb-2">{item.title}</h3>
                    <p className="font-sans text-sm text-muted-foreground">{item.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Timeline Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mt-12 flex justify-center"
              >
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-card rounded-full border border-border">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-sans text-sm text-foreground">
                    Typical turnaround: <strong className="text-primary">2–4 weeks</strong>
                  </span>
                </div>
              </motion.div>
            </div>
          </section>

          {/* What Can Be Customized */}
          <section className="py-20 bg-card">
            <div className="container px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-primary">
                  Possibilities
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mt-4">
                  What Can Be Customized
                </h2>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {customizationOptions.map((option, index) => (
                  <motion.div
                    key={option.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-background p-6 rounded-xl border border-border hover:border-primary/30 transition-colors"
                  >
                    <option.icon className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-serif text-lg text-foreground mb-2">{option.title}</h3>
                    <p className="font-sans text-sm text-muted-foreground">{option.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Past Work Gallery */}
          <section className="py-20 bg-background">
            <div className="container px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-primary">
                  Portfolio
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mt-4">
                  Past Custom Work
                </h2>
                <p className="font-sans text-muted-foreground mt-4 max-w-xl mx-auto">
                  A glimpse into the bespoke pieces we've crafted for our clients
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {pastWorkGallery.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="group relative overflow-hidden rounded-xl"
                  >
                    <div className="aspect-square">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <h3 className="font-serif text-lg text-white">{item.title}</h3>
                      <p className="font-sans text-sm text-white/70">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Request Form */}
          <section className="py-20 bg-card">
            <div className="container px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-primary">
                  Get Started
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mt-4">
                  Request a Custom Piece
                </h2>
                <p className="font-sans text-muted-foreground mt-4 max-w-xl mx-auto">
                  Share your vision and we'll bring it to life
                </p>
              </motion.div>

              <motion.form
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onSubmit={handleSubmit}
                className="max-w-2xl mx-auto space-y-8"
              >
                {/* Login Required Notice */}
                {!user && (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
                    <p className="text-foreground mb-4">
                      Please sign in to submit a custom order request
                    </p>
                    <Button variant="terracotta" asChild>
                      <Link to="/auth?redirect=/products/custom">Sign In</Link>
                    </Button>
                  </div>
                )}

                {user && (
                  <>
                    {/* Contact Info */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user.email || ''}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          Delivery Address *
                        </Label>
                        <Dialog open={showAddAddress} onOpenChange={setShowAddAddress}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Plus className="w-4 h-4 mr-1" />
                              Add New
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Add New Address</DialogTitle>
                            </DialogHeader>
                            <AddressForm
                              initialData={{ name: formData.name }}
                              onSubmit={handleAddAddress}
                              onCancel={() => setShowAddAddress(false)}
                              loading={savingAddress}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      {addressesLoading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading addresses...
                        </div>
                      ) : addresses.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No saved addresses. Please add a delivery address.
                        </p>
                      ) : (
                        <RadioGroup
                          value={selectedAddressId || ''}
                          onValueChange={setSelectedAddressId}
                          className="space-y-3"
                        >
                          {addresses.map((address) => (
                            <label
                              key={address.id}
                              htmlFor={`addr-${address.id}`}
                              className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedAddressId === address.id 
                                  ? 'border-primary bg-primary/5' 
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <RadioGroupItem value={address.id} id={`addr-${address.id}`} className="mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{address.label}</span>
                                  {address.is_default && (
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Default</span>
                                  )}
                                </div>
                                <p className="text-sm font-medium">{address.name} • {address.phone}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatAddressString(address)}
                                </p>
                              </div>
                            </label>
                          ))}
                        </RadioGroup>
                      )}
                    </div>

                    {/* Size Selection */}
                    <div className="space-y-3">
                      <Label>Preferred Size</Label>
                      <RadioGroup
                        value={formData.size}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, size: value }))}
                        className="flex flex-wrap gap-4"
                      >
                        {[
                          { value: "small", label: "Small", desc: "Tea cups, small bowls" },
                          { value: "medium", label: "Medium", desc: "Dinner plates, vases" },
                          { value: "large", label: "Large", desc: "Platters, large pots" },
                          { value: "custom", label: "Custom", desc: "Specific dimensions" },
                        ].map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <Label htmlFor={option.value} className="cursor-pointer">
                              <span className="font-medium">{option.label}</span>
                              <span className="text-xs text-muted-foreground ml-1">({option.desc})</span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Usage */}
                    <div className="space-y-2">
                      <Label htmlFor="usage">Intended Usage *</Label>
                      <Textarea
                        id="usage"
                        name="usage"
                        value={formData.usage}
                        onChange={handleInputChange}
                        placeholder="How will you use this piece? (e.g., daily tea ceremony, serving ware for dinner parties, decorative display...)"
                        rows={3}
                        required
                      />
                    </div>

                    {/* Reference Images */}
                    <div className="space-y-3">
                      <Label>Reference Images (optional)</Label>
                      <p className="text-sm text-muted-foreground">
                        Upload up to 5 images for inspiration
                      </p>
                      
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                      >
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                        <p className="font-sans text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="font-sans text-xs text-muted-foreground mt-1">
                          PNG, JPG up to 5MB each
                        </p>
                      </div>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      {referenceImages.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-4">
                          {referenceImages.map((file, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Reference ${index + 1}`}
                                className="w-20 h-20 object-cover rounded-lg border border-border"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Any specific colors, textures, inscriptions, or details you'd like..."
                        rows={4}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      variant="terracotta" 
                      size="lg" 
                      className="w-full"
                      disabled={isSubmitting || !selectedAddressId}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      We'll respond within 48 hours with a quote and timeline
                    </p>
                  </>
                )}
              </motion.form>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CustomOrders;
