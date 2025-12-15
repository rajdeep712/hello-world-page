import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Workshop {
  id: string;
  title: string;
  description: string | null;
  price: number;
  workshop_type: string | null;
  duration: string | null;
  max_participants: number | null;
  current_participants: number | null;
  workshop_date: string | null;
  image_url: string | null;
  is_active: boolean | null;
}

interface WorkshopFormData {
  title: string;
  description: string;
  price: string;
  workshop_type: string;
  duration: string;
  max_participants: string;
  workshop_date: string;
  image_url: string;
  is_active: boolean;
}

const defaultFormData: WorkshopFormData = {
  title: '',
  description: '',
  price: '',
  workshop_type: 'group',
  duration: '2 hours',
  max_participants: '10',
  workshop_date: '',
  image_url: '',
  is_active: true,
};

const AdminWorkshops = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [formData, setFormData] = useState<WorkshopFormData>(defaultFormData);
  const queryClient = useQueryClient();

  const { data: workshops, isLoading } = useQuery({
    queryKey: ['admin-workshops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workshops')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Workshop[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: WorkshopFormData) => {
      const { error } = await supabase.from('workshops').insert({
        title: data.title,
        description: data.description || null,
        price: parseFloat(data.price),
        workshop_type: data.workshop_type,
        duration: data.duration || null,
        max_participants: parseInt(data.max_participants) || 10,
        workshop_date: data.workshop_date || null,
        image_url: data.image_url || null,
        is_active: data.is_active,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-workshops'] });
      toast.success('Workshop created successfully');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error('Failed to create workshop: ' + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: WorkshopFormData }) => {
      const { error } = await supabase
        .from('workshops')
        .update({
          title: data.title,
          description: data.description || null,
          price: parseFloat(data.price),
          workshop_type: data.workshop_type,
          duration: data.duration || null,
          max_participants: parseInt(data.max_participants) || 10,
          workshop_date: data.workshop_date || null,
          image_url: data.image_url || null,
          is_active: data.is_active,
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-workshops'] });
      toast.success('Workshop updated successfully');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error('Failed to update workshop: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('workshops').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-workshops'] });
      toast.success('Workshop deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete workshop: ' + error.message);
    },
  });

  const handleOpenCreate = () => {
    setEditingWorkshop(null);
    setFormData(defaultFormData);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (workshop: Workshop) => {
    setEditingWorkshop(workshop);
    setFormData({
      title: workshop.title,
      description: workshop.description || '',
      price: workshop.price.toString(),
      workshop_type: workshop.workshop_type || 'group',
      duration: workshop.duration || '2 hours',
      max_participants: workshop.max_participants?.toString() || '10',
      workshop_date: workshop.workshop_date ? format(new Date(workshop.workshop_date), "yyyy-MM-dd'T'HH:mm") : '',
      image_url: workshop.image_url || '',
      is_active: workshop.is_active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingWorkshop(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWorkshop) {
      updateMutation.mutate({ id: editingWorkshop.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this workshop?')) {
      deleteMutation.mutate(id);
    }
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
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl">Workshops</h2>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Workshop
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Participants</TableHead>
            <TableHead>Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workshops?.map((workshop) => (
            <TableRow key={workshop.id}>
              <TableCell className="font-medium">{workshop.title}</TableCell>
              <TableCell className="capitalize">{workshop.workshop_type}</TableCell>
              <TableCell>₹{workshop.price.toLocaleString()}</TableCell>
              <TableCell>
                {workshop.workshop_date 
                  ? format(new Date(workshop.workshop_date), 'dd MMM yyyy') 
                  : '—'}
              </TableCell>
              <TableCell>{workshop.current_participants || 0}/{workshop.max_participants || 10}</TableCell>
              <TableCell>{workshop.is_active ? 'Yes' : 'No'}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button size="icon" variant="ghost" onClick={() => handleOpenEdit(workshop)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(workshop.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {workshops?.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No workshops found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingWorkshop ? 'Edit Workshop' : 'Add Workshop'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="workshop_type">Type</Label>
                <Select
                  value={formData.workshop_type}
                  onValueChange={(value) => setFormData({ ...formData, workshop_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="group">Group</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="kids">Kids</SelectItem>
                    <SelectItem value="masterclass">Masterclass</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 2 hours"
                />
              </div>
              <div>
                <Label htmlFor="max_participants">Max Participants</Label>
                <Input
                  id="max_participants"
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="workshop_date">Date & Time</Label>
              <Input
                id="workshop_date"
                type="datetime-local"
                value={formData.workshop_date}
                onChange={(e) => setFormData({ ...formData, workshop_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingWorkshop ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminWorkshops;