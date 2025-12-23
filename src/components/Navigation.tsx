import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Shield, Package, UserCircle, Heart } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartButton } from "@/components/CartButton";
import { WishlistNavButton } from "@/components/WishlistNavButton";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo-new.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Products", path: "/products" },
  { name: "Workshops", path: "/workshops" },
  { name: "Experiences", path: "/experiences" },
  { name: "Studio", path: "/studio" },
  { name: "Contact", path: "/contact" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  
  // Refs for scroll intent detection
  const lastScrollY = useRef(0);
  const scrollBuffer = useRef<number[]>([]);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { isAdmin } = useAdmin();

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    // Configuration for refined scroll behavior
    const SCROLL_THRESHOLD = 100; // Min scroll before hiding (inner pages)
    const INTENT_SAMPLES = 5; // Samples for detecting scroll intent
    const INTENT_MIN_DELTA = 25; // Minimum cumulative upward scroll to show
    const HIDE_DELAY = 150; // Delay before hiding to prevent jitter
    const COMPACT_THRESHOLD = 200; // When to shrink navbar on inner pages
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;
      
      // Track scroll pattern for intent detection
      scrollBuffer.current.push(scrollDelta);
      if (scrollBuffer.current.length > INTENT_SAMPLES) {
        scrollBuffer.current.shift();
      }
      
      // Calculate average scroll direction (intent)
      const avgIntent = scrollBuffer.current.length > 0 
        ? scrollBuffer.current.reduce((a, b) => a + b, 0) / scrollBuffer.current.length
        : 0;
      
      // Update scrolled state for background styling
      setScrolled(currentScrollY > 50);
      
      // Compact mode for inner pages (slight shrink when scrolled)
      if (!isHomePage && currentScrollY > COMPACT_THRESHOLD) {
        setIsCompact(true);
      } else {
        setIsCompact(false);
      }
      
      // Homepage: Never hide, always visible
      if (isHomePage) {
        setIsVisible(true);
        if (hideTimeout.current) {
          clearTimeout(hideTimeout.current);
          hideTimeout.current = null;
        }
        lastScrollY.current = currentScrollY;
        return;
      }
      
      // Inner pages: Smart hide/show with intent detection
      if (currentScrollY < SCROLL_THRESHOLD) {
        // Near top: always show immediately
        setIsVisible(true);
        if (hideTimeout.current) {
          clearTimeout(hideTimeout.current);
          hideTimeout.current = null;
        }
      } else if (scrollDelta > 0 && avgIntent > 3) {
        // Scrolling down with clear intent: hide with delay (prevents jitter)
        if (!hideTimeout.current) {
          hideTimeout.current = setTimeout(() => {
            setIsVisible(false);
            hideTimeout.current = null;
          }, HIDE_DELAY);
        }
      } else if (scrollDelta < -3 && avgIntent < -INTENT_MIN_DELTA / INTENT_SAMPLES) {
        // Scrolling up with intentional motion: show immediately
        if (hideTimeout.current) {
          clearTimeout(hideTimeout.current);
          hideTimeout.current = null;
        }
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    // Initialize state
    setScrolled(window.scrollY > 50);
    setIsVisible(true);
    lastScrollY.current = window.scrollY;
    scrollBuffer.current = [];
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, [isHomePage]);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Check if link is active (for subtle indicator)
  const isActiveLink = (path: string) => {
    if (path === '/products') {
      return location.pathname === '/products' || location.pathname.startsWith('/products/');
    }
    return location.pathname === path;
  };

  return (
    <>
      <motion.header
        initial={{ y: 0, opacity: 1 }}
        animate={{ 
          y: isVisible ? 0 : -100, 
          opacity: isVisible ? 1 : 0,
          scale: isCompact && !isHomePage ? 0.97 : 1,
        }}
        transition={{ 
          duration: 0.4, 
          ease: [0.25, 0.1, 0.25, 1],
          y: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
          opacity: { duration: 0.3, ease: 'easeOut' },
          scale: { duration: 0.3, ease: 'easeOut' },
        }}
        className={`fixed z-50 inset-x-0 mx-auto max-w-5xl w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] rounded-full transition-[background-color,border-color,backdrop-filter,top,box-shadow] duration-500 ease-out ${
          scrolled
            ? "top-3 bg-parchment/90 backdrop-blur-md border border-border/40"
            : isHomePage
            ? "top-6 bg-parchment/50 backdrop-blur-[2px] border border-border/20"
            : "top-6 bg-parchment/70 backdrop-blur-[4px] border border-border/30"
        }`}
        style={{
          // Extremely subtle shadow when scrolled, or none (craft-brand aesthetic)
          boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.03)' : 'none',
        }}
      >
        <nav className={`px-4 md:px-6 flex items-center justify-between transition-all duration-300 ${
          isCompact ? 'py-1.5' : 'py-2'
        }`}>
          <Link to="/" className="flex items-center">
            <motion.img 
              src={logo} 
              alt="Basho by Shivangi" 
              className={`w-auto transition-all duration-300 ${
                isCompact ? 'h-5 md:h-6' : 'h-6 md:h-8'
              }`}
              whileHover={{ opacity: 0.8 }}
              transition={{ duration: 0.3 }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`font-sans text-sm font-medium tracking-wide transition-all duration-200 relative ${
                      isActiveLink(link.path)
                        ? "text-primary"
                        : "text-deep-clay/80 hover:text-deep-clay"
                    }`}
                  >
                    {link.name}
                    {/* Subtle active indicator - underline */}
                    {isActiveLink(link.path) && (
                      <motion.span
                        layoutId="activeNav"
                        className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-primary/70 rounded-full"
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="flex items-center gap-2 ml-4 border-l border-border/50 pl-6">
              <WishlistNavButton />
              <CartButton />
              {!loading && (
                user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full hover:bg-muted/50 transition-all duration-300"
                      >
                        <User className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                      <DropdownMenuItem className="text-muted-foreground text-xs">
                        {user.email}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                        <UserCircle className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/orders')} className="cursor-pointer">
                        <Package className="mr-2 h-4 w-4" />
                        Orders
                      </DropdownMenuItem>
                      {isAdmin && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
                            <Shield className="mr-2 h-4 w-4" />
                            Admin
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to="/auth">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-sm tracking-wide font-normal hover:bg-muted/50"
                    >
                      Sign In
                    </Button>
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <WishlistNavButton />
            <CartButton />
            {!loading && (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-card">
                    <DropdownMenuItem className="text-muted-foreground text-xs">
                      {user.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/orders')} className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      Orders
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="text-sm">
                    Sign In
                  </Button>
                </Link>
              )
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <motion.div
              className="absolute inset-0 bg-background/90 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-card border-l border-border"
            >
              <div className="p-8 pt-24">
                <ul className="space-y-6">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        className={`font-serif text-2xl transition-colors duration-300 flex items-center gap-3 ${
                          isActiveLink(link.path)
                            ? "text-primary"
                            : "text-foreground/70 hover:text-foreground"
                        }`}
                      >
                        {/* Subtle dot indicator for mobile active link */}
                        {isActiveLink(link.path) && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/70 flex-shrink-0" />
                        )}
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                  {!loading && !user && (
                    <motion.li
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navLinks.length * 0.05 }}
                      className="pt-6 border-t border-border"
                    >
                      <Link
                        to="/auth"
                        className="font-sans text-sm tracking-widest uppercase text-primary"
                      >
                        Sign In
                      </Link>
                    </motion.li>
                  )}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
