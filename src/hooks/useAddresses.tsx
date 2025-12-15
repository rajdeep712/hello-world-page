import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Address {
  id: string;
  user_id: string;
  label: string;
  name: string;
  phone: string;
  street: string;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddressFormData {
  label: string;
  name: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  is_default?: boolean;
}

export function useAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = useCallback(async () => {
    if (!user) {
      setAddresses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching addresses:', error);
    } else {
      setAddresses(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const addAddress = async (addressData: AddressFormData) => {
    if (!user) return { error: new Error('Not authenticated') };

    // If this is the first address or marked as default, set it as default
    const shouldBeDefault = addresses.length === 0 || addressData.is_default;

    // If setting as default, unset other defaults first
    if (shouldBeDefault && addresses.length > 0) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert({
        user_id: user.id,
        ...addressData,
        is_default: shouldBeDefault,
      })
      .select()
      .single();

    if (!error) {
      await fetchAddresses();
    }
    return { data, error };
  };

  const updateAddress = async (id: string, addressData: Partial<AddressFormData>) => {
    if (!user) return { error: new Error('Not authenticated') };

    // If setting as default, unset other defaults first
    if (addressData.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
    }

    const { data, error } = await supabase
      .from('addresses')
      .update(addressData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (!error) {
      await fetchAddresses();
    }
    return { data, error };
  };

  const deleteAddress = async (id: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (!error) {
      await fetchAddresses();
    }
    return { error };
  };

  const setDefaultAddress = async (id: string) => {
    return updateAddress(id, { is_default: true });
  };

  const getDefaultAddress = () => {
    return addresses.find(addr => addr.is_default) || addresses[0] || null;
  };

  return {
    addresses,
    loading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress,
    refetch: fetchAddresses,
  };
}
