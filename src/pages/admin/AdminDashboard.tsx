import { useState } from 'react';
import { Package, ShoppingCart, Users, Calendar, LayoutDashboard, LogOut, Paintbrush, Sparkles, Building2, Video } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminWorkshops from './AdminWorkshops';
import AdminUsers from './AdminUsers';
import AdminCustomOrders from './AdminCustomOrders';
import AdminExperiences from './AdminExperiences';
import AdminCorporateInquiries from './AdminCorporateInquiries';
import AdminVideoTestimonials from './AdminVideoTestimonials';
import AdminNotifications from '@/components/admin/AdminNotifications';

type Tab = 'overview' | 'products' | 'orders' | 'workshops' | 'users' | 'custom-orders' | 'experiences' | 'corporate' | 'testimonials';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'products' as Tab, label: 'Products', icon: Package },
    { id: 'orders' as Tab, label: 'Orders', icon: ShoppingCart },
    { id: 'workshops' as Tab, label: 'Workshops', icon: Calendar },
    { id: 'experiences' as Tab, label: 'Experiences', icon: Sparkles },
    { id: 'custom-orders' as Tab, label: 'Custom Orders', icon: Paintbrush },
    { id: 'corporate' as Tab, label: 'Corporate', icon: Building2 },
    { id: 'testimonials' as Tab, label: 'Testimonials', icon: Video },
    { id: 'users' as Tab, label: 'Users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-border sticky top-0 h-screen flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="font-serif text-xl text-primary">Admin Dashboard</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <tab.icon className="h-5 w-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => navigate('/')}>
            View Site
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-background border-b border-border sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="font-serif text-xl text-foreground capitalize">
              {activeTab === 'custom-orders' ? 'Custom Orders' : activeTab}
            </h2>
            <AdminNotifications />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="bg-background rounded-lg border border-border p-6">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'products' && <AdminProducts />}
            {activeTab === 'orders' && <AdminOrders />}
            {activeTab === 'workshops' && <AdminWorkshops />}
            {activeTab === 'experiences' && <AdminExperiences />}
            {activeTab === 'custom-orders' && <AdminCustomOrders />}
            {activeTab === 'corporate' && <AdminCorporateInquiries />}
            {activeTab === 'testimonials' && <AdminVideoTestimonials />}
            {activeTab === 'users' && <AdminUsers />}
          </div>
        </main>
      </div>
    </div>
  );
};

const OverviewTab = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [productsRes, ordersRes, workshopsRes, corporateRes, usersRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('workshops').select('id', { count: 'exact', head: true }),
        supabase.from('corporate_inquiries').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
      ]);
      return {
        products: productsRes.count || 0,
        orders: ordersRes.count || 0,
        workshops: workshopsRes.count || 0,
        corporate: corporateRes.count || 0,
        users: usersRes.count || 0,
      };
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl">Welcome to Admin Dashboard</h2>
      <p className="text-muted-foreground">
        Use the tabs above to manage products, orders, workshops, and users.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Products" icon={Package} count={stats?.products} isLoading={isLoading} color="text-blue-500" />
        <StatCard title="Orders" icon={ShoppingCart} count={stats?.orders} isLoading={isLoading} color="text-green-500" />
        <StatCard title="Workshops" icon={Calendar} count={stats?.workshops} isLoading={isLoading} color="text-purple-500" />
        <StatCard title="Corporate" icon={Building2} count={stats?.corporate} isLoading={isLoading} color="text-orange-500" />
        <StatCard title="Users" icon={Users} count={stats?.users} isLoading={isLoading} color="text-pink-500" />
      </div>
    </div>
  );
};

const StatCard = ({ 
  title, 
  icon: Icon, 
  count, 
  isLoading, 
  color 
}: { 
  title: string; 
  icon: React.ComponentType<{ className?: string }>; 
  count?: number; 
  isLoading: boolean;
  color: string;
}) => (
  <div className="bg-background rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 rounded-lg bg-muted ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="font-medium text-muted-foreground">{title}</span>
    </div>
    <p className="text-3xl font-serif text-primary">
      {isLoading ? (
        <span className="animate-pulse">...</span>
      ) : (
        count?.toLocaleString() ?? '0'
      )}
    </p>
  </div>
);

export default AdminDashboard;