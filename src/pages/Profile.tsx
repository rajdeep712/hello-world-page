import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Plus, Pencil, Trash2, Check, LogOut } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useAddresses, Address, AddressFormData } from '@/hooks/useAddresses';
import AddressForm from '@/components/AddressForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { addresses, loading: addressesLoading, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddresses();
  
  const [profile, setProfile] = useState<{ full_name: string; phone: string } | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setProfile(data);
      setProfileForm({ full_name: data.full_name || '', phone: data.phone || '' });
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSavingProfile(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: profileForm.full_name, phone: profileForm.phone })
      .eq('user_id', user.id);

    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated');
      setProfile(profileForm);
      setEditingProfile(false);
    }
    setSavingProfile(false);
  };

  const handleAddAddress = async (data: AddressFormData) => {
    setSavingAddress(true);
    const { error } = await addAddress(data);
    if (error) {
      toast.error('Failed to add address');
    } else {
      toast.success('Address added');
      setShowAddAddress(false);
    }
    setSavingAddress(false);
  };

  const handleUpdateAddress = async (data: AddressFormData) => {
    if (!editingAddress) return;
    
    setSavingAddress(true);
    const { error } = await updateAddress(editingAddress.id, data);
    if (error) {
      toast.error('Failed to update address');
    } else {
      toast.success('Address updated');
      setEditingAddress(null);
    }
    setSavingAddress(false);
  };

  const handleDeleteAddress = async (address: Address) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    const { error } = await deleteAddress(address.id);
    if (error) {
      toast.error('Failed to delete address');
    } else {
      toast.success('Address deleted');
    }
  };

  const handleSetDefault = async (address: Address) => {
    const { error } = await setDefaultAddress(address.id);
    if (error) {
      toast.error('Failed to set default address');
    } else {
      toast.success('Default address updated');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>My Profile | Basho by Shivangi</title>
        <meta name="description" content="Manage your profile and addresses" />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center">
              <h1 className="font-display text-4xl md:text-5xl text-foreground">My Profile</h1>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>

            {/* Profile Info */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                {!editingProfile && (
                  <Button variant="ghost" size="sm" onClick={() => setEditingProfile(true)}>
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {editingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={profileForm.full_name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="10-digit mobile number"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} disabled={savingProfile}>
                        {savingProfile ? 'Saving...' : 'Save'}
                      </Button>
                      <Button variant="outline" onClick={() => {
                        setEditingProfile(false);
                        setProfileForm({ full_name: profile?.full_name || '', phone: profile?.phone || '' });
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>{profile?.full_name || 'Not set'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{profile?.phone || 'Not set'}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Addresses */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Saved Addresses
                </CardTitle>
                <Dialog open={showAddAddress} onOpenChange={setShowAddAddress}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Address
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Address</DialogTitle>
                    </DialogHeader>
                    <AddressForm
                      onSubmit={handleAddAddress}
                      onCancel={() => setShowAddAddress(false)}
                      loading={savingAddress}
                    />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {addressesLoading ? (
                  <p className="text-muted-foreground">Loading addresses...</p>
                ) : addresses.length === 0 ? (
                  <p className="text-muted-foreground">No addresses saved yet</p>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`p-4 border rounded-lg ${address.is_default ? 'border-primary bg-primary/5' : 'border-border'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{address.label}</span>
                              {address.is_default && (
                                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">Default</span>
                              )}
                            </div>
                            <p className="font-medium">{address.name}</p>
                            <p className="text-sm text-muted-foreground">{address.phone}</p>
                            <p className="text-sm text-muted-foreground">
                              {address.street}
                              {address.landmark && `, ${address.landmark}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {!address.is_default && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleSetDefault(address)}
                                title="Set as default"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            <Dialog open={editingAddress?.id === address.id} onOpenChange={(open) => !open && setEditingAddress(null)}>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setEditingAddress(address)}>
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Address</DialogTitle>
                                </DialogHeader>
                                <AddressForm
                                  initialData={address}
                                  onSubmit={handleUpdateAddress}
                                  onCancel={() => setEditingAddress(null)}
                                  loading={savingAddress}
                                  submitLabel="Update Address"
                                />
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteAddress(address)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}
