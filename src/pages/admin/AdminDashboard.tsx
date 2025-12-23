import { useState } from 'react';
import { Package, ShoppingCart, Users, Calendar, LayoutDashboard, LogOut, Paintbrush, Sparkles, Building2, Video, ExternalLink, TrendingUp, Clock, Activity, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminWorkshops from './AdminWorkshops';
import AdminUsers from './AdminUsers';
import AdminCustomOrders from './AdminCustomOrders';
import AdminExperiences from './AdminExperiences';
import AdminCorporateInquiries from './AdminCorporateInquiries';
import AdminVideoTestimonials from './AdminVideoTestimonials';
import AdminNotifications from '@/components/admin/AdminNotifications';
import AdminStatCard from '@/components/admin/AdminStatCard';

type Tab = 'overview' | 'products' | 'orders' | 'workshops' | 'users' | 'custom-orders' | 'experiences' | 'corporate' | 'testimonials';

const tabs = [
  { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard, description: 'Dashboard overview' },
  { id: 'products' as Tab, label: 'Products', icon: Package, description: 'Manage products' },
  { id: 'orders' as Tab, label: 'Orders', icon: ShoppingCart, description: 'View orders' },
  { id: 'workshops' as Tab, label: 'Workshops', icon: Calendar, description: 'Workshop management' },
  { id: 'experiences' as Tab, label: 'Experiences', icon: Sparkles, description: 'Experience bookings' },
  { id: 'custom-orders' as Tab, label: 'Custom Orders', icon: Paintbrush, description: 'Custom requests' },
  { id: 'corporate' as Tab, label: 'Corporate', icon: Building2, description: 'Corporate inquiries' },
  { id: 'testimonials' as Tab, label: 'Testimonials', icon: Video, description: 'Video testimonials' },
  { id: 'users' as Tab, label: 'Users', icon: Users, description: 'User management' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  // Sidebar is expanded when not collapsed OR when hovered
  const isSidebarExpanded = !sidebarCollapsed || sidebarHovered;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const SidebarContent = ({ isMobile = false, isExpanded = true }: { isMobile?: boolean; isExpanded?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className={cn(
        "flex items-center gap-3 p-4 border-b border-border/50 transition-all duration-300",
        !isExpanded && !isMobile ? "justify-center" : ""
      )}>
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
          <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded || isMobile ? "opacity-100 w-auto" : "opacity-0 w-0"
        )}>
          <h1 className="font-bold text-lg text-foreground truncate">Admin</h1>
          <p className="text-xs text-muted-foreground truncate">Pottery Studio</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative',
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
              !isExpanded && !isMobile ? "justify-center px-2" : ""
            )}
          >
            <tab.icon className={cn(
              "h-5 w-5 flex-shrink-0 transition-transform",
              activeTab === tab.id ? "" : "group-hover:scale-110"
            )} />
            <div className={cn(
              "flex-1 text-left overflow-hidden transition-all duration-300",
              isExpanded || isMobile ? "opacity-100 w-auto" : "opacity-0 w-0"
            )}>
              <span className="block truncate">{tab.label}</span>
            </div>
            {!isExpanded && !isMobile && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-popover text-popover-foreground rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap border border-border">
                <div className="font-medium">{tab.label}</div>
                <div className="text-xs text-muted-foreground">{tab.description}</div>
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className={cn(
        "p-3 border-t border-border/50 space-y-2 transition-all duration-300",
        !isExpanded && !isMobile ? "px-2" : ""
      )}>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className={cn(
            "w-full justify-start gap-3 text-muted-foreground hover:text-foreground transition-all duration-300",
            !isExpanded && !isMobile ? "justify-center px-2" : ""
          )}
        >
          <ExternalLink className="h-4 w-4 flex-shrink-0" />
          <span className={cn(
            "transition-all duration-300",
            isExpanded || isMobile ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
          )}>View Site</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSignOut}
          className={cn(
            "w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300",
            !isExpanded && !isMobile ? "justify-center px-2" : ""
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span className={cn(
            "transition-all duration-300",
            isExpanded || isMobile ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
          )}>Sign Out</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden lg:flex flex-col border-r border-border/50 bg-card/50 backdrop-blur-xl transition-all duration-300 ease-in-out sticky top-0 h-screen",
          isSidebarExpanded ? "w-64" : "w-[72px]"
        )}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        <SidebarContent isExpanded={isSidebarExpanded} />
        
        {/* Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-background border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
          title={sidebarCollapsed ? "Pin sidebar open" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile/Tablet Header */}
        <header className="lg:hidden sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
          <div className="flex items-center justify-between h-14 px-4">
            <div className="flex items-center gap-3">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                  <SidebarContent isMobile />
                </SheetContent>
              </Sheet>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-foreground">Admin</span>
              </div>
            </div>
            <AdminNotifications />
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/50">
          <div className="flex-1 flex items-center justify-between h-14 px-6">
            <div>
              <h2 className="font-semibold text-foreground capitalize">
                {tabs.find(t => t.id === activeTab)?.label || 'Overview'}
              </h2>
              <p className="text-xs text-muted-foreground">
                {tabs.find(t => t.id === activeTab)?.description}
              </p>
            </div>
            <AdminNotifications />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="animate-fade-in">
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
      const [productsRes, ordersRes, workshopsRes, corporateRes, usersRes, recentOrdersRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('workshops').select('id', { count: 'exact', head: true }),
        supabase.from('corporate_inquiries').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
      ]);
      return {
        products: productsRes.count || 0,
        orders: ordersRes.count || 0,
        workshops: workshopsRes.count || 0,
        corporate: corporateRes.count || 0,
        users: usersRes.count || 0,
        recentOrders: recentOrdersRes.data || [],
      };
    },
  });

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Activity className="h-5 w-5" />
            <span className="text-sm font-medium">Dashboard Overview</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Welcome back!
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Here's what's happening with your pottery studio today. Manage your products, track orders, and keep your business thriving.
          </p>
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <AdminStatCard 
          title="Total Products" 
          value={stats?.products || 0} 
          icon={Package} 
          isLoading={isLoading}
          colorClass="text-blue-500"
        />
        <AdminStatCard 
          title="Total Orders" 
          value={stats?.orders || 0} 
          icon={ShoppingCart} 
          isLoading={isLoading}
          colorClass="text-green-500"
        />
        <AdminStatCard 
          title="Workshops" 
          value={stats?.workshops || 0} 
          icon={Calendar} 
          isLoading={isLoading}
          colorClass="text-purple-500"
        />
        <AdminStatCard 
          title="Corporate" 
          value={stats?.corporate || 0} 
          icon={Building2} 
          isLoading={isLoading}
          colorClass="text-orange-500"
        />
        <AdminStatCard 
          title="Users" 
          value={stats?.users || 0} 
          icon={Users} 
          isLoading={isLoading}
          colorClass="text-pink-500"
        />
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-green-500/10 text-green-500">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Recent Orders</h3>
                <p className="text-sm text-muted-foreground">Latest customer purchases</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-border/50">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : stats?.recentOrders && stats.recentOrders.length > 0 ? (
            stats.recentOrders.map((order: any) => (
              <div key={order.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {order.customer_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{order.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{order.order_number}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">₹{order.total_amount?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(order.created_at), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No orders yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
