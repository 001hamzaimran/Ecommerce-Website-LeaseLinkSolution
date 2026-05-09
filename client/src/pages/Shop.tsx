import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Loader2, LayoutGrid, List, Search, Star, ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import SEO from '@/components/SEO';
import { apiFetch } from '@/utils/api';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  
  const { addItem } = useCart();

  // Sync category state with URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  // Fetch Products
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await apiFetch(`${import.meta.env.VITE_API_URL}/products`);
      return response;
    },
  });

  // Fetch Categories
  const { data: categoriesData = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiFetch(`${import.meta.env.VITE_API_URL}/categories`);
      return response;
    },
  });

  const categories = ['All', ...categoriesData.map((c: any) => c.name)];

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const filtered = useMemo(() => {
    let result = products.filter((p: any) => {
      const pCat = typeof p.category === 'object' ? p.category.name : p.category;
      if (category !== 'All' && pCat !== category) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    switch (sort) {
      case 'price-asc': result.sort((a: any, b: any) => a.price - b.price); break;
      case 'price-desc': result.sort((a: any, b: any) => b.price - a.price); break;
      case 'rating': result.sort((a: any, b: any) => b.rating - a.rating); break;
      case 'newest': result.sort((a: any, b: any) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    }
    return result;
  }, [products, category, sort, priceRange, searchQuery]);

  return (
    <main className="pt-28 pb-20 font-body min-h-screen bg-slate-50/30">
      <SEO 
        title={`${category === 'All' ? 'Shop All' : category} | LeaseLink Solution`}
        description={`Explore our ${category === 'All' ? 'full collection' : category} at LeaseLink Solution. Find premium products with swift global delivery.`}
      />
      <div className="container mx-auto px-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">Our Collection</p>
            <h1 className="font-display text-4xl md:text-6xl font-black text-foreground tracking-tighter">
              {category === 'All' ? 'Everything' : category}
            </h1>
          </motion.div>

          <div className="flex items-center gap-3">
             <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-10 rounded-2xl bg-white border-slate-200 h-12 shadow-sm" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             <Button 
               variant="outline" 
               className="rounded-2xl h-12 px-6 font-bold md:hidden shadow-sm"
               onClick={() => setShowFilters(!showFilters)}
             >
               <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
             </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-12">
          {/* Filters Sidebar */}
          <aside className={`lg:block ${showFilters ? 'block' : 'hidden'} space-y-10`}>
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Categories</h3>
              <div className="flex flex-col gap-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      category === cat 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                        : 'text-muted-foreground hover:bg-slate-100 hover:text-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Price Range</h3>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              </div>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={10000}
                step={50}
                className="w-full"
              />
            </div>

            <div className="pt-6 border-t">
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-4">Sort By</h3>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-full h-12 rounded-2xl border-slate-200 font-bold text-sm bg-white shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="featured">Featured First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="newest">New Arrivals</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {isLoadingProducts ? (
              <div className="flex flex-col items-center justify-center py-32 gap-6">
                <div className="relative">
                   <Loader2 className="w-16 h-16 animate-spin text-primary opacity-20" />
                   <Loader2 className="w-16 h-16 animate-spin text-primary absolute inset-0 [animation-delay:0.2s]" />
                </div>
                <p className="text-muted-foreground font-black uppercase tracking-widest text-xs animate-pulse">Curating your experience...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                   <p className="text-sm font-medium text-muted-foreground">
                     Showing <span className="text-foreground font-bold">{filtered.length}</span> results
                   </p>
                   <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                      <Button 
                        variant={viewType === 'grid' ? 'secondary' : 'ghost'} 
                        size="icon" 
                        className={`rounded-lg w-9 h-9 transition-all ${viewType === 'grid' ? 'shadow-sm text-primary' : 'text-muted-foreground'}`}
                        onClick={() => setViewType('grid')}
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant={viewType === 'list' ? 'secondary' : 'ghost'} 
                        size="icon" 
                        className={`rounded-lg w-9 h-9 transition-all ${viewType === 'list' ? 'shadow-sm text-primary' : 'text-muted-foreground'}`}
                        onClick={() => setViewType('list')}
                      >
                        <List className="w-4 h-4" />
                      </Button>
                   </div>
                </div>

                <div className={viewType === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-4"}>
                  <AnimatePresence>
                    {filtered.map((p: any, i: number) => (
                      viewType === 'grid' ? (
                        <ProductCard key={p._id || p.id} product={p} index={i} />
                      ) : (
                        <motion.div
                          key={p._id || p.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex flex-col sm:flex-row gap-6 p-4 bg-white rounded-3xl border border-slate-100 hover:shadow-xl transition-all group"
                        >
                          <Link to={`/product/${p._id || p.id}`} className="shrink-0 w-full sm:w-48 aspect-square rounded-2xl overflow-hidden bg-slate-50 relative">
                             <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                             {p.isNew && <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">New</span>}
                          </Link>
                          <div className="flex-1 flex flex-col justify-center space-y-3">
                             <div className="flex justify-between items-start">
                                <div>
                                   <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{typeof p.category === 'object' ? p.category.name : p.category}</p>
                                   <Link to={`/product/${p._id || p.id}`} className="text-xl font-black text-foreground hover:text-primary transition-colors tracking-tight">{p.name}</Link>
                                </div>
                                <div className="text-right">
                                   <p className="text-2xl font-black text-foreground">${p.price}</p>
                                   {p.originalPrice && <p className="text-sm text-muted-foreground line-through font-bold">${p.originalPrice}</p>}
                                </div>
                             </div>
                             <p className="text-sm text-muted-foreground line-clamp-2 font-medium leading-relaxed">{p.description}</p>
                             <div className="flex items-center gap-4 pt-2">
                                <div className="flex items-center gap-1">
                                   <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                   <span className="text-sm font-bold">{p.rating || 4.5}</span>
                                   <span className="text-xs text-muted-foreground font-medium">({p.reviews || 0} reviews)</span>
                                </div>
                                <div className="h-4 w-px bg-slate-200" />
                                <Button 
                                  onClick={() => addItem(p)}
                                  className="rounded-full h-10 px-6 gap-2 text-xs font-bold"
                                >
                                  <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                                </Button>
                             </div>
                          </div>
                        </motion.div>
                      )
                    ))}
                  </AnimatePresence>
                </div>

                {filtered.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-32 space-y-4"
                  >
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                       <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground tracking-tighter">No matches found</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto font-medium leading-relaxed">We couldn't find any products matching your current filters. Try adjusting them!</p>
                    <Button 
                      variant="outline" 
                      className="rounded-full mt-4 h-12 px-8 font-bold"
                      onClick={() => {
                        setCategory('All');
                        setPriceRange([0, 10000]);
                        setSearchQuery("");
                      }}
                    >
                      Reset All Filters
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Shop;
