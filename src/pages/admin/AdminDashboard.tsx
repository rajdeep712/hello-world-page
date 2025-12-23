import { useState } from 'react';
import { Package, ShoppingCart, Users, Calendar, LayoutDashboard, LogOut, Paintbrush, Sparkles, Building2, Video, ChevronRight, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-muted/40 via-background to-muted/20 flex">
      {/* Sidebar */}
      <motion.aside
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
        animate={{ width: sidebarExpanded ? 256 : 80 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-gradient-to-b from-primary/5 via-background to-background border-r border-border/50 sticky top-0 h-screen flex flex-col overflow-hidden backdrop-blur-sm"
      >
        {/* Logo Area */}
        <div className="p-4 border-b border-border/30 h-[72px] flex items-center">
          <motion.div
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
            <AnimatePresence>
              {sidebarExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <h1 className="font-serif text-lg font-semibold text-foreground">Admin</h1>
                  <p className="text-xs text-muted-foreground">Dashboard</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group relative',
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/25'
                  : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              )}
            >
              <div className={cn(
                'min-w-[32px] h-8 flex items-center justify-center rounded-lg transition-colors',
                activeTab === tab.id ? 'bg-white/20' : 'bg-muted group-hover:bg-primary/10'
              )}>
                <tab.icon className="h-4 w-4" />
              </div>
              <AnimatePresence>
                {sidebarExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="font-medium text-sm whitespace-nowrap overflow-hidden"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-foreground rounded-r-full"
                />
              )}
            </motion.button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-border/30 space-y-1">
          <motion.button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-all duration-200"
          >
            <div className="min-w-[32px] h-8 flex items-center justify-center rounded-lg bg-muted">
              <ExternalLink className="h-4 w-4" />
            </div>
            <AnimatePresence>
              {sidebarExpanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-medium text-sm whitespace-nowrap"
                >
                  View Site
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <motion.button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
          >
            <div className="min-w-[32px] h-8 flex items-center justify-center rounded-lg bg-muted">
              <LogOut className="h-4 w-4" />
            </div>
            <AnimatePresence>
              {sidebarExpanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-medium text-sm whitespace-nowrap"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-40">
          <div className="px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.h2 
                key={activeTab}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-2xl font-semibold text-foreground capitalize"
              >
                {activeTab === 'custom-orders' ? 'Custom Orders' : activeTab}
              </motion.h2>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Management</span>
            </div>
            <AdminNotifications />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 overflow-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'products' && <AdminProducts />}
            {activeTab === 'orders' && <AdminOrders />}
            {activeTab === 'workshops' && <AdminWorkshops />}
            {activeTab === 'experiences' && <AdminExperiences />}
            {activeTab === 'custom-orders' && <AdminCustomOrders />}
            {activeTab === 'corporate' && <AdminCorporateInquiries />}
            {activeTab === 'testimonials' && <AdminVideoTestimonials />}
            {activeTab === 'users' && <AdminUsers />}
          </motion.div>
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

  const statCards = [
    { 
      title: 'Products', 
      icon: Package, 
      count: stats?.products, 
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-500/10 to-blue-600/5',
      trend: '+12%'
    },
    { 
      title: 'Orders', 
      icon: ShoppingCart, 
      count: stats?.orders, 
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-500/10 to-emerald-600/5',
      trend: '+8%'
    },
    { 
      title: 'Workshops', 
      icon: Calendar, 
      count: stats?.workshops, 
      gradient: 'from-violet-500 to-violet-600',
      bgGradient: 'from-violet-500/10 to-violet-600/5',
      trend: '+5%'
    },
    { 
      title: 'Corporate', 
      icon: Building2, 
      count: stats?.corporate, 
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-500/10 to-amber-600/5',
      trend: '+15%'
    },
    { 
      title: 'Users', 
      icon: Users, 
      count: stats?.users, 
      gradient: 'from-rose-500 to-rose-600',
      bgGradient: 'from-rose-500/10 to-rose-600/5',
      trend: '+23%'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">Welcome back!</h2>
          <p className="text-muted-foreground max-w-lg">
            Here's what's happening with your pottery studio today. Manage your products, track orders, and grow your business.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "relative overflow-hidden rounded-2xl bg-gradient-to-br border border-border/50 p-6 group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1",
              stat.bgGradient
            )}
          >
            {/* Background decoration */}
            <div className={cn(
              "absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl group-hover:opacity-30 transition-opacity",
              stat.gradient
            )} />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                  stat.gradient
                )}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <TrendingUp className="h-3 w-3" />
                  <span>{stat.trend}</span>
                </div>
              </div>
              
              <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-3xl font-serif font-semibold text-foreground">
                {isLoading ? (
                  <span className="inline-block w-12 h-8 bg-muted animate-pulse rounded" />
                ) : (
                  stat.count?.toLocaleString() ?? '0'
                )}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-background border border-border/50 p-6 hover:shadow-lg transition-all duration-300"
        >
          <h3 className="font-semibold text-foreground mb-2">Recent Activity</h3>
          <p className="text-sm text-muted-foreground mb-4">View latest orders and customer interactions</p>
          <Button variant="outline" size="sm" className="group">
            View Orders
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl bg-background border border-border/50 p-6 hover:shadow-lg transition-all duration-300"
        >
          <h3 className="font-semibold text-foreground mb-2">Inventory Status</h3>
          <p className="text-sm text-muted-foreground mb-4">Check product stock levels and availability</p>
          <Button variant="outline" size="sm" className="group">
            Manage Products
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl bg-background border border-border/50 p-6 hover:shadow-lg transition-all duration-300"
        >
          <h3 className="font-semibold text-foreground mb-2">Upcoming Workshops</h3>
          <p className="text-sm text-muted-foreground mb-4">Schedule and manage pottery classes</p>
          <Button variant="outline" size="sm" className="group">
            View Schedule
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
