import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Loader2, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import SEO from '@/components/SEO';
import { apiFetch } from '@/utils/api';

// Real Banner Images from assets/banner
import banner1 from '@/assets/banner/all-in-one-products.png';
import banner2 from '@/assets/banner/office-products.png';
import banner3 from '@/assets/banner/home-and-kitchen.png';
import banner4 from '@/assets/banner/beauty-products.png';
import banner5 from '@/assets/banner/pet-supplies.png';

const banners = [
  {
    image: banner1,
    title: "Your One-Stop Premium Marketplace",
    subtitle: "Discover curated collections from the world's best brands, delivered to your door.",
    button: "Start Shopping",
    accent: "bg-primary"
  },
  {
    image: banner2,
    title: "Elevate Your Professional Workspace",
    subtitle: "High-performance office gear and ergonomics for modern professionals.",
    button: "View Office Gear",
    accent: "bg-blue-600"
  },
  {
    image: banner3,
    title: "Craft Your Dream Home Interior",
    subtitle: "Premium home and kitchen essentials designed for elegant living.",
    button: "Shop Home Collection",
    accent: "bg-amber-600"
  },
  {
    image: banner4,
    title: "Timeless Scents & Beauty Rituals",
    subtitle: "Exclusive perfumes and wellness products for the sophisticated individual.",
    button: "Browse Beauty",
    accent: "bg-rose-500"
  },
  {
    image: banner5,
    title: "Premium Care for Your Best Friends",
    subtitle: "Top-tier pet supplies and nutrition to keep your companions happy.",
    button: "View Pet Supplies",
    accent: "bg-emerald-600"
  }
];

const testimonials = [
  { id: 1, name: "Sarah Johnson", role: "Interior Designer", text: "LeaseLink Solution has become my go-to for high-end home decor. The quality is consistently exceptional.", rating: 5 },
  { id: 2, name: "Michael Chen", role: "Tech Entrepreneur", text: "Reliable service and a curated selection. My entire office was outfitted through their marketplace.", rating: 5 },
  { id: 3, name: "Elena Rodriguez", role: "Pet Groomer", text: "The professional-grade pet supplies have made a huge difference in my daily operations.", rating: 5 }
];

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Fetch Products
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await apiFetch(`${import.meta.env.VITE_API_URL}/products`);
      return response;
    },
  });

  // Fetch Categories
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiFetch(`${import.meta.env.VITE_API_URL}/categories`);
      return response;
    },
  });

  const featured = products.filter((p: any) => p.featured).slice(0, 4);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "LeaseLink Solution",
    "url": "https://leaselinksolution.com",
    "logo": "https://leaselinksolution.com/logo.png",
    "sameAs": [
      "https://facebook.com/leaselinksolution",
      "https://instagram.com/leaselinksolution",
      "https://twitter.com/leaselinksolution"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-800-555-0199",
      "contactType": "customer service"
    }
  };

  return (
    <main className="font-body overflow-x-hidden">
      <SEO 
        title="LeaseLink Solution | Premium Retail & Marketplace"
        description="Discover curated collections of premium office products, baby essentials, home & kitchen, pet supplies, and luxury perfumes. Swift delivery and quality assured at LeaseLink Solution."
        schema={organizationSchema}
      />
      {/* Hero Banner Slider */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-10" />
              <motion.img
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ duration: 6 }}
                src={banners[currentSlide].image}
                alt="Banner"
                loading="eager"
                className="h-full w-full object-cover opacity-80"
              />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center">
          <motion.div
            key={`content-${currentSlide}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className={`w-20 h-1.5 mb-8 rounded-full ${banners[currentSlide].accent} shadow-[0_0_20px_rgba(255,255,255,0.5)]`} />
            <h1 className="font-display text-5xl md:text-8xl font-black text-white leading-[1] mb-6 drop-shadow-2xl">
              {banners[currentSlide].title}
            </h1>
            <p className="text-white/80 text-xl md:text-2xl mb-10 max-w-xl font-medium">
              {banners[currentSlide].subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop">
                <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-2xl h-16 px-10 text-lg font-bold shadow-[0_10px_30px_rgba(255,255,255,0.2)]">
                  {banners[currentSlide].button}
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="text-white border-white/20 bg-black/20 hover:bg-black/60 hover:text-white backdrop-blur-xl rounded-2xl h-16 px-10 text-lg font-bold shadow-xl transition-all">
                  About LeaseLink Solution
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-10 right-10 z-30 flex items-center gap-4">
           <button onClick={prevSlide} className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all backdrop-blur-sm">
             <ChevronLeft className="w-6 h-6" />
           </button>
           <div className="flex gap-2">
             {banners.map((_, i) => (
               <button 
                 key={i} 
                 onClick={() => setCurrentSlide(i)}
                 className={`h-1.5 transition-all duration-500 rounded-full ${currentSlide === i ? 'w-10 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'}`} 
               />
             ))}
           </div>
           <button onClick={nextSlide} className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all backdrop-blur-sm">
             <ChevronRight className="w-6 h-6" />
           </button>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-12 border-b">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 font-display text-2xl font-black italic">
             <span>PRIME QUALITY</span>
             <span>GLOBAL DELIVERY</span>
             <span>ELITE SERVICE</span>
             <span>TRUSTED SOURCE</span>
             <span>LUXURY GOODS</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Zap, title: "Swift Delivery", text: "Fast and secure worldwide shipping for all your premium essential products." },
              { icon: ShieldCheck, title: "Quality Assured", text: "Every product is hand-picked and verified for authenticity and superior quality." },
              { icon: CheckCircle2, title: "Buyer Protection", text: "Secure payments and hassle-free returns on our entire curated collection." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-8 rounded-[2.5rem] bg-white shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl md:text-6xl font-black text-foreground leading-tight tracking-tighter">Handpicked Favorites</h2>
            <p className="text-muted-foreground text-lg mt-4 font-medium italic">"Explore our most loved products across all categories."</p>
          </div>
          <Link to="/shop">
            <Button className="rounded-2xl px-10 h-16 gap-2 text-lg font-bold group shadow-lg shadow-primary/20">
              Explore All <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>
        
        {isLoadingProducts ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((p: any, i: number) => (
              <ProductCard key={p._id || p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Categories Modern Grid */}
      <section className="bg-foreground py-32 text-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-6xl font-black mb-6 tracking-tighter">Shop by Category</h2>
            <p className="text-white/50 text-xl max-w-2xl mx-auto font-medium">Explore our curated selections for your lifestyle and professional needs.</p>
          </div>

          {isLoadingCategories ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.slice(0, 6).map((cat: any, i: number) => (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative overflow-hidden rounded-[3rem] aspect-[16/10] bg-zinc-900"
                >
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute inset-0 p-10 flex flex-col justify-end items-start">
                    <h3 className="font-display text-3xl font-black mb-4 transition-colors text-white group-hover:text-white/80">{cat.name}</h3>
                    <Link to={`/shop?category=${cat.name}`}>
                      <Button variant="secondary" className="rounded-full px-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 font-bold">
                        Browse Collection
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials - Refined */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-5xl font-black mb-4 tracking-tighter">Customer Stories</h2>
            <p className="text-muted-foreground font-medium">Join thousands of satisfied shoppers who trust LeaseLink Solution.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative p-10 rounded-[3rem] border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex gap-1 mb-6 text-amber-500">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-xl font-medium text-foreground leading-relaxed mb-8 italic">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{t.name}</p>
                    <p className="text-sm text-muted-foreground font-semibold">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section - Premium Experience */}
      <section className="container mx-auto px-6 pb-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[4rem] bg-foreground p-12 md:p-24 overflow-hidden text-white shadow-2xl"
        >
          {/* Decorative Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -mr-48 -mt-48 blur-[100px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full -ml-32 -mb-32 blur-[80px]" />
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-12">
             <div className="max-w-2xl space-y-4">
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Priority Access</p>
               <h2 className="font-display text-4xl md:text-7xl font-black tracking-tighter leading-[0.9]">Stay ahead of the curve.</h2>
               <p className="text-white/50 text-xl font-medium max-w-lg mx-auto leading-relaxed">Subscribe to receive exclusive deals, new collection alerts, and LeaseLink Solution news.</p>
             </div>

             <div className="w-full max-w-xl space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="h-16 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-white/30 text-lg px-8 focus:bg-white/10 focus:border-white/20 transition-all font-bold"
                  />
                  <Button className="bg-primary text-white hover:bg-primary/90 h-16 px-12 rounded-2xl font-black text-lg whitespace-nowrap shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                    Join Now
                  </Button>
                </div>
                
                <div className="flex items-center justify-center gap-4">
                   <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-foreground bg-slate-800 flex items-center justify-center text-[8px] font-black text-white/50">
                           {i === 4 ? '+10k' : ''}
                        </div>
                      ))}
                   </div>
                   <p className="text-[10px] uppercase font-black tracking-widest text-white/30">
                     Trusted by over <span className="text-white">10,000+</span> global shoppers.
                   </p>
                </div>
             </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default Index;
