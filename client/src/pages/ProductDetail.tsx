import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, ShoppingBag, Truck, ShieldCheck, 
  RotateCcw, ChevronRight, Heart, Share2, 
  Plus, Minus, ArrowLeft 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import SEO from '@/components/SEO';
import { apiFetch } from '@/utils/api';
import ProductCard from '@/components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await apiFetch(`${import.meta.env.VITE_API_URL}/products/${id}`);
      return response;
    },
    enabled: !!id,
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await apiFetch(`${import.meta.env.VITE_API_URL}/products`);
      return response;
    },
    enabled: !!product,
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  if (isError || !product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white">
      <h2 className="text-3xl font-display font-black text-slate-900">Product not found</h2>
      <Link to="/shop">
        <Button variant="outline" className="rounded-full px-8">Back to Shop</Button>
      </Link>
    </div>
  );

  const categoryName = typeof product.category === 'object' ? product.category.name : product.category;
  const related = products.filter((p: any) => 
    (typeof p.category === 'object' ? p.category.name : p.category) === categoryName && 
    (p._id || p.id) !== (product._id || product.id)
  ).slice(0, 4);

  const handleAdd = () => {
    const selectionString = Object.entries(selections).map(([k, v]) => `${k}: ${v}`).join(', ');
    addItem(product, quantity, selectionString);
    toast.success(`${product.name} added to your bag!`, {
      icon: <ShoppingBag className="w-4 h-4" />,
      className: "rounded-2xl font-black shadow-2xl",
    });
  };

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": allImages,
    "description": product.description,
    "brand": { "@type": "Brand", "name": "LeaseLink Solution" },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "USD",
      "price": product.price,
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || 4.5,
      "reviewCount": product.reviews || 120
    }
  };

  return (
    <main className="pt-24 pb-20 font-body bg-white min-h-screen">
      <SEO 
        title={`${product.name} | LeaseLink Solution`}
        description={product.description}
        image={product.image}
        schema={productSchema}
      />

      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 py-8">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7">
            <div className="space-y-6">
              <motion.div 
                layoutId="main-image"
                className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-50 shadow-sm"
              >
                <img 
                  src={allImages[selectedImage]} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                {product.isNew && (
                  <span className="absolute top-8 left-8 bg-primary text-white text-xs font-black uppercase tracking-[0.2em] px-6 py-2.5 rounded-full shadow-2xl">
                    New Arrival
                  </span>
                )}
                <button 
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-8 right-8 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl z-10 ${
                    isInWishlist(product._id || product.id)
                      ? 'bg-primary text-white scale-110'
                      : 'bg-white/90 backdrop-blur-md text-foreground hover:scale-110'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product._id || product.id) ? 'fill-white' : ''}`} />
                </button>
              </motion.div>

              <div className="grid grid-cols-4 gap-4">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === i ? 'border-primary p-1' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover rounded-xl" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Product Info (Sticky) */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-10">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{categoryName}</p>
                <h1 className="text-4xl md:text-5xl font-display font-black text-foreground tracking-tighter leading-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 4.5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      ))}
                      <span className="ml-2 text-sm font-bold text-slate-500">({product.reviews || 120} Reviews)</span>
                   </div>
                   <div className="h-4 w-px bg-slate-200" />
                   <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Verified Quality</span>
                   </div>
                </div>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-display font-black text-foreground tracking-tighter">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-2xl text-muted-foreground line-through font-medium decoration-primary/30 decoration-2">${product.originalPrice}</span>
                )}
              </div>

              <p className="text-slate-600 leading-relaxed font-medium text-lg">
                {product.description}
              </p>

              {/* Dynamic Variants Selector */}
              {product.variants && product.variants.length > 0 && product.variants.map((v: any, i: number) => (
                <div key={i} className="space-y-4">
                  <p className="text-xs font-black uppercase tracking-widest text-foreground">
                    {v.name}: <span className="text-muted-foreground">{selections[v.name] || 'Select'}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(v.values) ? v.values : v.values.split(',')).map((val: string) => {
                      const value = val.trim();
                      const isSelected = selections[v.name] === value;
                      return (
                        <button
                          key={value}
                          onClick={() => setSelections({...selections, [v.name]: value})}
                          className={`min-w-[60px] h-12 px-5 rounded-xl border-2 font-black transition-all duration-300 ${
                            isSelected 
                              ? 'border-primary bg-primary text-white shadow-lg' 
                              : 'border-slate-100 hover:border-slate-200 text-slate-600'
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Quantity & Actions */}
              <div className="space-y-6 pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center hover:text-primary transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-black text-lg">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center hover:text-primary transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <Button 
                    onClick={handleAdd}
                    className="flex-1 h-14 rounded-2xl text-lg font-black gap-3 shadow-2xl shadow-primary/20"
                  >
                    <ShoppingBag className="w-5 h-5" /> Add to Bag
                  </Button>
                </div>

                {/* Trust Features */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100">
                   <div className="flex flex-col items-center text-center gap-2">
                      <Truck className="w-5 h-5 text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Fast Shipping</span>
                   </div>
                   <div className="flex flex-col items-center text-center gap-2">
                      <RotateCcw className="w-5 h-5 text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">30-Day Returns</span>
                   </div>
                   <div className="flex flex-col items-center text-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Secure Checkout</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Story / Details */}
        <div className="mt-40 border-t border-slate-100 pt-32">
          <div className="grid lg:grid-cols-3 gap-20">
             <div className="lg:col-span-1">
                <h2 className="text-4xl font-display font-black text-foreground tracking-tighter mb-6">Designed with Excellence.</h2>
                <p className="text-slate-500 font-medium leading-relaxed">
                   At LeaseLink Solution, we don't just pick products; we curate experiences. This piece represents our commitment to modern aesthetics and unparalleled durability.
                </p>
             </div>
             <div className="lg:col-span-2 space-y-12">
                <div className="grid sm:grid-cols-2 gap-12">
                   <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                         <Award className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="text-lg font-black text-foreground">Premium Materials</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">Sourced from verified manufacturers who use only high-grade raw materials for lasting quality.</p>
                   </div>
                   <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                         <Star className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="text-lg font-black text-foreground">Curated Aesthetic</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">A perfect balance between form and function, designed to complement your modern lifestyle.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-40">
            <div className="flex justify-between items-end mb-12">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Discover More</p>
                <h2 className="text-3xl md:text-5xl font-display font-black text-foreground tracking-tighter">You May Also Like</h2>
              </div>
              <Link to="/shop">
                <Button variant="ghost" className="rounded-full font-black uppercase tracking-widest text-[10px] gap-2">
                  View All <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((p: any, i: number) => (
                <ProductCard key={p._id || p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

// Internal icon for materials section
const Award = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
);

export default ProductDetail;
