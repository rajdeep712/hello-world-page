import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AddressFormData } from '@/hooks/useAddresses';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

// Indian pincode validation: 6 digits, first digit 1-9
const indianPincodeRegex = /^[1-9][0-9]{5}$/;

const addressSchema = z.object({
  label: z.string().min(1, 'Label is required').max(50),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(15),
  street: z.string().min(5, 'Street address is required').max(200),
  landmark: z.string().max(100).optional(),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  pincode: z.string().regex(indianPincodeRegex, 'Enter a valid 6-digit Indian pincode'),
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
  const [customLabel, setCustomLabel] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fetchingPincode, setFetchingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  const isOtherLabel = formData.label === 'Other' || 
    (formData.label !== 'Home' && formData.label !== 'Work');

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
      // If initial label is not Home or Work, set it as custom
      if (initialData.label && initialData.label !== 'Home' && initialData.label !== 'Work') {
        setCustomLabel(initialData.label);
      }
    }
  }, [initialData]);

  // Fetch city and state when pincode changes
  useEffect(() => {
    const fetchPincodeData = async () => {
      const pincode = formData.pincode.trim();
      
      // Validate pincode format before API call
      if (!indianPincodeRegex.test(pincode)) {
        if (pincode.length === 6) {
          setPincodeError('Invalid pincode format. Must start with 1-9.');
        }
        return;
      }

      setFetchingPincode(true);
      setPincodeError('');

      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();

        if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
          const postOffice = data[0].PostOffice[0];
          setFormData(prev => ({
            ...prev,
            city: postOffice.District || postOffice.Block || '',
            state: postOffice.State || '',
          }));
          setErrors(prev => ({ ...prev, city: '', state: '' }));
        } else {
          setPincodeError('Invalid pincode. Please enter a valid 6-digit pincode.');
        }
      } catch (error) {
        console.error('Error fetching pincode data:', error);
        setPincodeError('Could not fetch location. Please enter city and state manually.');
      } finally {
        setFetchingPincode(false);
      }
    };

    const debounceTimer = setTimeout(fetchPincodeData, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData.pincode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // For pincode, only allow digits
    if (name === 'pincode') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
      setErrors(prev => ({ ...prev, [name]: '' }));
      setPincodeError('');
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleLabelSelect = (label: string) => {
    if (label === 'Other') {
      setFormData(prev => ({ ...prev, label: 'Other' }));
      setCustomLabel('');
    } else {
      setFormData(prev => ({ ...prev, label }));
      setCustomLabel('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If Other is selected, use customLabel
    const finalLabel = isOtherLabel ? customLabel.trim() : formData.label;
    
    // Validate custom label if Other is selected
    if (isOtherLabel && !customLabel.trim()) {
      setErrors(prev => ({ ...prev, customLabel: 'Please enter a name for this address' }));
      return;
    }

    const dataToSubmit = { ...formData, label: finalLabel };
    
    try {
      addressSchema.parse(dataToSubmit);
      await onSubmit(dataToSubmit);
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
              variant={
                (label === 'Other' && isOtherLabel) || formData.label === label 
                  ? 'default' 
                  : 'outline'
              }
              size="sm"
              onClick={() => handleLabelSelect(label)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom label name field when Other is selected */}
      {isOtherLabel && (
        <div>
          <Label htmlFor="customLabel">Address Name *</Label>
          <Input
            id="customLabel"
            value={customLabel}
            onChange={(e) => {
              setCustomLabel(e.target.value);
              setErrors(prev => ({ ...prev, customLabel: '' }));
            }}
            placeholder="e.g., Parents' Home, Office 2, etc."
            disabled={loading}
          />
          {errors.customLabel && (
            <p className="text-xs text-destructive mt-1">{errors.customLabel}</p>
          )}
        </div>
      )}

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
        <Label htmlFor="pincode">Pincode *</Label>
        <div className="relative">
          <Input
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="6-digit pincode"
            disabled={loading}
            maxLength={6}
          />
          {fetchingPincode && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        {errors.pincode && <p className="text-xs text-destructive mt-1">{errors.pincode}</p>}
        {pincodeError && <p className="text-xs text-destructive mt-1">{pincodeError}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            placeholder="Auto-filled from pincode"
            disabled
            readOnly
            className="bg-muted/50"
          />
          {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
        </div>

        <div>
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            placeholder="Auto-filled from pincode"
            disabled
            readOnly
            className="bg-muted/50"
          />
          {errors.state && <p className="text-xs text-destructive mt-1">{errors.state}</p>}
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
        <Button type="submit" disabled={loading || fetchingPincode} className="flex-1">
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
