import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import ProductCard from '@/components/ProductCard';

const Wishlist = () => {
  const { wishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  return (
    <main className="pt-32 pb-20 font-body bg-white min-h-screen">
      <SEO 
        title="My Wishlist | LeaseLink Solution"
        description="View and manage your favourite premium products at LeaseLink Solution."
      />

      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">My Collection</p>
            <h1 className="text-4xl md:text-6xl font-display font-black text-foreground tracking-tighter">Your Wishlist</h1>
          </div>
          {wishlist.length > 0 && (
            <Button 
              variant="ghost" 
              onClick={clearWishlist}
              className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-red-500 gap-2"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </Button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
              <Heart className="w-10 h-10 text-slate-200" />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-4 tracking-tight">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-12 max-w-sm mx-auto font-medium">
              Save your favourite items here and they'll be waiting for you whenever you're ready to shop.
            </p>
            <Link to="/shop">
              <Button size="lg" className="rounded-full h-14 px-10 font-black gap-2 shadow-2xl shadow-primary/20">
                Continue Shopping <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlist.map((product, i) => (
              <div key={product._id || product.id} className="relative">
                <ProductCard product={product} index={i} />
                <div className="mt-4">
                  <Button 
                    onClick={() => addItem(product)}
                    variant="outline" 
                    className="w-full rounded-2xl h-12 font-black gap-2 hover:bg-primary hover:text-white hover:border-primary transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" /> Move to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Wishlist;
