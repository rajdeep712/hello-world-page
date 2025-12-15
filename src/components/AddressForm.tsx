import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AddressFormData } from '@/hooks/useAddresses';
import { z } from 'zod';

const addressSchema = z.object({
  label: z.string().min(1, 'Label is required').max(50),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(15),
  street: z.string().min(5, 'Street address is required').max(200),
  landmark: z.string().max(100).optional(),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  pincode: z.string().min(6, 'Pincode must be 6 digits').max(10),
  is_default: z.boolean().optional(),
});

interface AddressFormProps {
  initialData?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  submitLabel?: string;
}

export default function AddressForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Save Address',
}: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    label: initialData?.label || 'Home',
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    street: initialData?.street || '',
    landmark: initialData?.landmark || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    pincode: initialData?.pincode || '',
    is_default: initialData?.is_default || false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      addressSchema.parse(formData);
      await onSubmit(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const labelOptions = ['Home', 'Work', 'Other'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Address Label</Label>
        <div className="flex gap-2 mt-1">
          {labelOptions.map(label => (
            <Button
              key={label}
              type="button"
              variant={formData.label === label ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFormData(prev => ({ ...prev, label }))}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name of the recipient"
            disabled={loading}
          />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            disabled={loading}
          />
          {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="street">Street Address *</Label>
        <Input
          id="street"
          name="street"
          value={formData.street}
          onChange={handleChange}
          placeholder="House no., Building, Street"
          disabled={loading}
        />
        {errors.street && <p className="text-xs text-destructive mt-1">{errors.street}</p>}
      </div>

      <div>
        <Label htmlFor="landmark">Landmark (Optional)</Label>
        <Input
          id="landmark"
          name="landmark"
          value={formData.landmark}
          onChange={handleChange}
          placeholder="Near temple, mall, etc."
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            disabled={loading}
          />
          {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
        </div>

        <div>
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            disabled={loading}
          />
          {errors.state && <p className="text-xs text-destructive mt-1">{errors.state}</p>}
        </div>

        <div>
          <Label htmlFor="pincode">Pincode *</Label>
          <Input
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="6-digit pincode"
            disabled={loading}
          />
          {errors.pincode && <p className="text-xs text-destructive mt-1">{errors.pincode}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_default"
          checked={formData.is_default}
          onCheckedChange={(checked) => 
            setFormData(prev => ({ ...prev, is_default: checked as boolean }))
          }
          disabled={loading}
        />
        <Label htmlFor="is_default" className="text-sm cursor-pointer">
          Set as default address
        </Label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Saving...' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
