import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users, Phone, Calendar, UserCircle } from 'lucide-react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminTableWrapper from '@/components/admin/AdminTableWrapper';
import AdminEmptyState from '@/components/admin/AdminEmptyState';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string | null;
}

const AdminUsers = () => {
  const { data: profiles, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Profile[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Users"
        description="View registered customer accounts"
        icon={Users}
      />

      {profiles && profiles.length > 0 ? (
        <AdminTableWrapper>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold">Phone</TableHead>
                <TableHead className="font-semibold">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile.id} className="border-border/50 hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        {profile.full_name ? (
                          <span className="text-sm font-semibold text-primary">
                            {profile.full_name.charAt(0).toUpperCase()}
                          </span>
                        ) : (
                          <UserCircle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {profile.full_name || 'No name'}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {profile.user_id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {profile.phone ? (
                        <>
                          <Phone className="h-4 w-4" />
                          <span>{profile.phone}</span>
                        </>
                      ) : (
                        <span className="text-muted-foreground/60">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {profile.created_at 
                          ? format(new Date(profile.created_at), 'MMM d, yyyy') 
                          : '—'}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminTableWrapper>
      ) : (
        <AdminTableWrapper>
          <AdminEmptyState
            icon={Users}
            title="No users yet"
            description="When customers create accounts, they'll appear here."
          />
        </AdminTableWrapper>
      )}
    </div>
  );
};

export default AdminUsers;
