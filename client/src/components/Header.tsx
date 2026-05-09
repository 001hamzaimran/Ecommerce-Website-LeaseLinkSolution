import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, ChevronDown, User, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/utils/api';
import { Button } from './ui/button';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const Header = () => {
  const { items } = useCart();
  const { wishlist } = useWishlist();
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiFetch(`${import.meta.env.VITE_API_URL}/categories`);
      return res;
    }
  });

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowMegaMenu(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowMegaMenu(false);
    }, 200);
  };

  const isHome = location.pathname === '/';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-body ${
        scrolled || !isHome 
          ? 'bg-background/90 backdrop-blur-xl border-b border-border py-2 shadow-sm' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className={`w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:rotate-12`}>
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <span className={`font-display text-xl font-bold tracking-tight transition-colors ${
            scrolled || !isHome ? 'text-foreground' : 'text-white'
          }`}>
            LeaseLink Solution
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          <div 
            className="relative flex items-center h-12"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className={`flex items-center gap-1.5 text-sm font-semibold tracking-wide transition-colors ${
              scrolled || !isHome ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'
            }`}>
              Categories <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showMegaMenu ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showMegaMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 w-[480px] bg-background/95 backdrop-blur-2xl border border-border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden p-4"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat: any) => (
                      <Link 
                        key={cat._id} 
                        to={`/shop?category=${cat.name}`} 
                        className="p-3 rounded-xl hover:bg-primary/5 transition-all flex items-center gap-4 group/item"
                        onClick={() => setShowMegaMenu(false)}
                      >
                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-border overflow-hidden shadow-sm group-hover/item:shadow-md transition-all">
                            <img src={cat.image} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" alt="" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-foreground group-hover/item:text-primary transition-colors">{cat.name}</span>
                          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Browse Equipment</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-semibold tracking-wide transition-colors ${
                location.pathname === link.to 
                  ? (scrolled || !isHome ? 'text-primary' : 'text-white') 
                  : (scrolled || !isHome ? 'text-muted-foreground hover:text-foreground' : 'text-white/70 hover:text-white')
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <Link to="/wishlist" className="relative group p-2">
            <Heart className={`w-5 h-5 transition-transform group-hover:scale-110 ${
              scrolled || !isHome ? 'text-foreground' : 'text-white'
            }`} />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold shadow-lg">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative group p-2">
            <ShoppingBag className={`w-5 h-5 transition-transform group-hover:scale-110 ${
              scrolled || !isHome ? 'text-foreground' : 'text-white'
            }`} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-primary text-white text-[9px] flex items-center justify-center font-bold shadow-lg">
                {totalItems}
              </span>
            )}
          </Link>
          
          <Link to="/admin">
            <button className={`hidden md:flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
              scrolled || !isHome 
                ? 'bg-foreground text-background hover:bg-foreground/90' 
                : 'bg-white text-black hover:bg-white/90'
            }`}>
              <User className="w-3.5 h-3.5" />
              Portal
            </button>
          </Link>

          <button
            className={`md:hidden p-2 ${scrolled || !isHome ? 'text-foreground' : 'text-white'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-0 bg-background z-[60] md:hidden flex flex-col"
          >
            <div className="p-6 border-b flex justify-between items-center">
              <span className="font-display font-bold text-xl">LeaseLink Solution</span>
              <button onClick={() => setMobileOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Shop Categories</p>
                <div className="grid grid-cols-1 gap-2">
                   {categories.map((cat: any) => (
                     <Link 
                       key={cat._id} 
                       to={`/shop?category=${cat.name}`}
                       onClick={() => setMobileOpen(false)}
                       className="flex items-center gap-4 p-4 bg-secondary/50 rounded-2xl text-sm font-bold"
                     >
                       <img src={cat.image} className="w-10 h-10 rounded-xl object-cover shadow-sm" alt="" />
                       {cat.name}
                     </Link>
                   ))}
                </div>
              </div>
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Navigation</p>
                 <div className="flex flex-col gap-4">
                    {navLinks.map(link => (
                      <Link 
                        key={link.to} 
                        to={link.to} 
                        onClick={() => setMobileOpen(false)}
                        className="text-2xl font-bold text-foreground"
                      >
                        {link.label}
                      </Link>
                    ))}
                 </div>
              </div>
            </div>
            <div className="p-6 border-t">
               <Link to="/admin" onClick={() => setMobileOpen(false)}>
                 <Button className="w-full h-12 rounded-2xl text-base font-bold">Admin Portal</Button>
               </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
