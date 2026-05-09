import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Eye, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: any;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const productId = product._id || product.id;
  const categoryName = typeof product.category === 'object' ? product.category.name : product.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-[2rem] bg-slate-50 aspect-[4/5] mb-6 shadow-sm hover:shadow-xl transition-all duration-500">
        <Link to={`/product/${productId}`} className="block h-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-primary text-white text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg">
              New
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-white/90 backdrop-blur-md text-foreground text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg">
              Save ${ (product.originalPrice - product.price).toFixed(0) }
            </span>
          )}
        </div>
        {/* Wishlist Heart */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
            isInWishlist(productId) 
              ? 'bg-primary text-white shadow-xl scale-110' 
              : 'bg-white/90 backdrop-blur-md text-foreground hover:scale-110 shadow-lg'
          }`}
        >
          <Heart className={`w-4 h-4 ${isInWishlist(productId) ? 'fill-white' : ''}`} />
        </button>

        {/* Action Overlay */}
        <div className="absolute inset-x-4 bottom-4 flex gap-2 translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
          <Button 
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="flex-1 rounded-2xl h-12 gap-2 font-bold shadow-xl"
          >
            <ShoppingBag className="w-4 h-4" /> Add to Cart
          </Button>
          <Link to={`/product/${productId}`}>
            <Button size="icon" variant="secondary" className="rounded-2xl h-12 w-12 bg-white/90 backdrop-blur-md shadow-xl hover:bg-white">
              <Eye className="w-4 h-4 text-foreground" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="px-2 space-y-2">
        <div className="flex justify-between items-start">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 font-body">{categoryName}</p>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-bold text-foreground/60">{product.rating || 4.5}</span>
          </div>
        </div>
        
        <Link to={`/product/${productId}`}>
          <h3 className="font-display text-lg font-black text-foreground hover:text-primary transition-colors line-clamp-1 tracking-tight">{product.name}</h3>
        </Link>

        <div className="flex items-baseline gap-2 font-body">
          <span className="text-xl font-black text-foreground">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through font-bold">${product.originalPrice}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
