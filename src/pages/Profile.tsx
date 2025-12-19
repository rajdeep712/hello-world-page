import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Plus, Pencil, Trash2, Check, LogOut, ShoppingBag, Heart } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useAddresses, Address, AddressFormData } from '@/hooks/useAddresses';
import AddressForm from '@/components/AddressForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { addresses, loading: addressesLoading, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddresses();
  
  const [profile, setProfile] = useState<{ full_name: string; phone: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else if (!authLoading) {
      setProfileLoading(false);
    }
  }, [user, authLoading]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setProfileLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setProfile(data);
      setProfileForm({ full_name: data.full_name || '', phone: data.phone || '' });
    }
    setProfileLoading(false);
  };

  const isPhoneSet = !!profile?.phone && profile.phone.length === 10;

  const validatePhone = (phone: string): string | null => {
    if (!phone) return null; // Empty is allowed
    if (!/^\d{10}$/.test(phone)) {
      return 'Phone number must be exactly 10 digits';
    }
    return null;
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    // Client-side phone validation
    const phoneError = validatePhone(profileForm.phone);
    if (phoneError) {
      toast.error(phoneError);
      return;
    }
    
    setSavingProfile(true);
    
    // Only update phone if it's not already set
    const updateData: { full_name: string; phone?: string } = { 
      full_name: profileForm.full_name 
    };
    
    if (!isPhoneSet && profileForm.phone) {
      updateData.phone = profileForm.phone;
    }
    
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', user.id);

    if (error) {
      if (error.message.includes('Phone number')) {
        toast.error(error.message);
      } else {
        toast.error('Failed to update profile');
      }
    } else {
      toast.success('Profile updated');
      setProfile({ 
        full_name: profileForm.full_name, 
        phone: isPhoneSet ? profile.phone : profileForm.phone 
      });
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

  const getInitials = (name: string | null | undefined, email: string | undefined) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email?.charAt(0).toUpperCase() || 'U';
  };

  // Get avatar URL from Google OAuth or other providers
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <>
      <Helmet>
        <title>My Profile | Basho by Shivangi</title>
        <meta name="description" content="Manage your profile and addresses" />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 max-w-5xl relative">
          <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center"
            >
              {/* Avatar */}
              {authLoading || profileLoading ? (
                <Skeleton className="w-24 h-24 rounded-full mx-auto mb-6" />
              ) : avatarUrl ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30 mb-6 mx-auto">
                  <img 
                    src={avatarUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 mb-6">
                  <span className="font-serif text-3xl text-primary">
                    {getInitials(profile?.full_name, user?.email)}
                  </span>
                </div>
              )}

              {authLoading || profileLoading ? (
                <>
                  <Skeleton className="h-12 w-64 mx-auto mb-3" />
                  <Skeleton className="h-6 w-48 mx-auto mb-8" />
                </>
              ) : (
                <>
                  <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3">
                    {profile?.full_name || 'Welcome'}
                  </h1>
                  <p className="text-muted-foreground font-sans text-lg mb-8">
                    {user?.email}
                  </p>
                </>
              )}

              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all duration-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-8 border-y border-border/50">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex justify-center gap-8">
              <Link 
                to="/orders" 
                className="flex items-center gap-3 px-6 py-3 rounded-lg hover:bg-card transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                </div>
                <span className="font-sans text-sm text-foreground">My Orders</span>
              </Link>
              <Link 
                to="/custom-orders" 
                className="flex items-center gap-3 px-6 py-3 rounded-lg hover:bg-card transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Heart className="w-5 h-5 text-accent" />
                </div>
                <span className="font-sans text-sm text-foreground">Custom Orders</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Personal Information - Left Column */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm h-fit sticky top-28">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="font-serif text-2xl text-foreground">Personal Info</h2>
                    </div>
                    {!editingProfile && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setEditingProfile(true)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {editingProfile ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-sm font-sans text-muted-foreground">Full Name</Label>
                        <Input
                          id="full_name"
                          value={profileForm.full_name}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                          className="bg-background border-border/50 focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-sans text-muted-foreground">
                          Phone Number
                          {isPhoneSet && (
                            <span className="ml-2 text-xs text-muted-foreground/70">(cannot be changed)</span>
                          )}
                        </Label>
                        <Input
                          id="phone"
                          value={isPhoneSet ? profile.phone : profileForm.phone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setProfileForm(prev => ({ ...prev, phone: value }));
                          }}
                          placeholder="10-digit mobile number"
                          disabled={isPhoneSet}
                          className={`bg-background border-border/50 focus:border-primary ${isPhoneSet ? 'opacity-60 cursor-not-allowed' : ''}`}
                        />
                        {!isPhoneSet && profileForm.phone && profileForm.phone.length !== 10 && (
                          <p className="text-xs text-destructive">Must be exactly 10 digits</p>
                        )}
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button onClick={handleSaveProfile} disabled={savingProfile} className="flex-1">
                          {savingProfile ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setEditingProfile(false);
                            setProfileForm({ full_name: profile?.full_name || '', phone: profile?.phone || '' });
                          }}
                          className="border-border/50"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : profileLoading ? (
                    <div className="space-y-6">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-background/50">
                          <Skeleton className="w-5 h-5 rounded" />
                          <div className="flex-1">
                            <Skeleton className="h-3 w-12 mb-2" />
                            <Skeleton className="h-5 w-32" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50">
                        <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs font-sans text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                          <p className="text-foreground">{user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50">
                        <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs font-sans text-muted-foreground uppercase tracking-wider mb-1">Name</p>
                          <p className="text-foreground">{profile?.full_name || <span className="text-muted-foreground italic">Not set</span>}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50">
                        <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs font-sans text-muted-foreground uppercase tracking-wider mb-1">Phone</p>
                          <p className="text-foreground">{profile?.phone || <span className="text-muted-foreground italic">Not set</span>}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Addresses - Right Column */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-3"
              >
                <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-accent" />
                      </div>
                      <h2 className="font-serif text-2xl text-foreground">Saved Addresses</h2>
                    </div>
                    <Dialog open={showAddAddress} onOpenChange={setShowAddAddress}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                          <Plus className="w-4 h-4" />
                          Add New
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="font-serif text-2xl">Add New Address</DialogTitle>
                        </DialogHeader>
                        <AddressForm
                          onSubmit={handleAddAddress}
                          onCancel={() => setShowAddAddress(false)}
                          loading={savingAddress}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>

                  {addressesLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map(i => (
                        <div key={i} className="h-32 rounded-xl bg-background/50 animate-pulse" />
                      ))}
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-16 px-8">
                      <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-6">
                        <MapPin className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                      <p className="text-muted-foreground mb-2">No addresses saved yet</p>
                      <p className="text-sm text-muted-foreground/70">Add an address to make checkout faster</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((address, index) => (
                        <motion.div
                          key={address.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className={`relative p-6 rounded-xl transition-all duration-300 ${
                            address.is_default 
                              ? 'bg-primary/5 border-2 border-primary/30' 
                              : 'bg-background/50 border border-border/50 hover:border-border'
                          }`}
                        >
                          {address.is_default && (
                            <span className="absolute top-4 right-4 text-xs font-sans uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                              Default
                            </span>
                          )}
                          
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-3">
                                <span className="font-serif text-lg text-foreground">{address.label}</span>
                              </div>
                              <p className="font-sans font-medium text-foreground">{address.name}</p>
                              <p className="text-sm text-muted-foreground">{address.phone}</p>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {address.street}
                                {address.landmark && <span>, {address.landmark}</span>}
                                <br />
                                {address.city}, {address.state} - {address.pincode}
                              </p>
                            </div>
                            
                            <div className="flex flex-col gap-1">
                              {!address.is_default && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleSetDefault(address)}
                                  title="Set as default"
                                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                              )}
                              <Dialog open={editingAddress?.id === address.id} onOpenChange={(open) => !open && setEditingAddress(null)}>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => setEditingAddress(address)}
                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="font-serif text-2xl">Edit Address</DialogTitle>
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
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
