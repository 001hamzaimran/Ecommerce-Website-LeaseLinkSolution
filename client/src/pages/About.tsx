import { motion } from 'framer-motion';
import { ShieldCheck, Globe, Zap, Heart, ArrowRight, Award, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import heroBanner from '@/assets/banner/all-in-one-products.png';

const stats = [
  { label: 'Global Partners', value: '150+', icon: Globe },
  { label: 'Quality Checks', value: '100%', icon: ShieldCheck },
  { label: 'Happy Shoppers', value: '10k+', icon: Users },
  { label: 'Curated Items', value: '2.5k+', icon: Star },
];

const values = [
  { 
    title: 'Global Sourcing', 
    desc: 'We partner with premium manufacturers worldwide to bring you exclusive, high-quality products that define modern living.',
    icon: Globe,
    color: 'bg-blue-50 text-blue-600'
  },
  { 
    title: 'Curated Excellence', 
    desc: 'Every item in our collection is hand-picked for its superior craftsmanship, ensuring only the best reaches your hands.',
    icon: Award,
    color: 'bg-amber-50 text-amber-600'
  },
  { 
    title: 'Customer Obsession', 
    desc: 'Our dedicated support team is available 24/7 to ensure your experience with LeaseLink is nothing short of perfect.',
    icon: Heart,
    color: 'bg-red-50 text-red-600'
  },
  { 
    title: 'Swift Logistics', 
    desc: 'Powered by a global supply chain, we guarantee fast, secure, and tracked delivery to any corner of the globe.',
    icon: Zap,
    color: 'bg-primary/5 text-primary'
  },
];

const About = () => (
  <main className="pt-32 pb-20 font-body bg-white overflow-hidden">
    <SEO 
      title="About Us | LeaseLink Solution"
      description="Learn about the LeaseLink Solution mission: redefining the global marketplace through curated excellence and premium logistics."
    />

    <div className="container mx-auto px-6">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-4xl mx-auto text-center mb-24"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">Our Story</span>
        <h1 className="font-display text-5xl md:text-8xl font-black text-foreground mb-8 tracking-tighter leading-none">
          The Art of <span className="text-primary italic">Curation.</span>
        </h1>
        <p className="text-muted-foreground leading-relaxed text-xl md:text-2xl font-medium max-w-2xl mx-auto">
          LeaseLink Solution was founded to bridge the gap between world-class craftsmanship and the modern, discerning consumer.
        </p>
      </motion.div>

      {/* Impact Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="group p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <s.icon className="w-6 h-6 text-primary" />
            </div>
            <p className="text-4xl font-black text-foreground mb-1 tracking-tighter">{s.value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Hero Image Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative rounded-[4rem] overflow-hidden mb-32 aspect-[21/9] shadow-2xl"
      >
        <img src={heroBanner} alt="LeaseLink Solution Curated Collection" className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-12 text-white">
          <p className="text-sm font-black uppercase tracking-widest mb-2">Since 2026</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter">Setting the global standard for retail excellence.</h2>
        </div>
      </motion.div>

      {/* Mission & Vision */}
      <div className="grid lg:grid-cols-2 gap-20 items-center mb-40">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl md:text-6xl font-black text-foreground mb-8 tracking-tighter">
            We don't just sell products. We sell <span className="text-primary underline underline-offset-8">standards.</span>
          </h2>
          <div className="space-y-6 text-lg text-muted-foreground font-medium leading-relaxed">
            <p>
              At LeaseLink Solution, we believe that quality should never be a luxury. Our team travels the world to find manufacturers who share our passion for detail and durability.
            </p>
            <p>
              Every product in our marketplace undergoes a rigorous 5-point inspection before it's even considered for our collection. If it doesn't meet the LeaseLink standard, it doesn't make the cut.
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-6"
        >
           <div className="space-y-6">
              <div className="aspect-square bg-slate-100 rounded-[2.5rem] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Office" />
              </div>
              <div className="aspect-[4/5] bg-primary rounded-[2.5rem] p-8 flex flex-col justify-between text-white">
                 <Star className="w-10 h-10 fill-white" />
                 <p className="text-xl font-black leading-tight tracking-tighter">Hand-picked selection for high-impact lives.</p>
              </div>
           </div>
           <div className="space-y-6 pt-12">
              <div className="aspect-[4/5] bg-slate-900 rounded-[2.5rem] p-8 flex flex-col justify-between text-white">
                 <ShieldCheck className="w-10 h-10 text-primary" />
                 <p className="text-xl font-black leading-tight tracking-tighter">Verified quality, trusted by thousands globally.</p>
              </div>
              <div className="aspect-square bg-slate-100 rounded-[2.5rem] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Business" />
              </div>
           </div>
        </motion.div>
      </div>

      {/* Value Proposition */}
      <div className="mb-40">
        <div className="text-center mb-20">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">Our Values</p>
          <h2 className="font-display text-4xl md:text-6xl font-black text-foreground tracking-tighter">The LeaseLink Code</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:shadow-2xl transition-all duration-500 group"
            >
              <div className={`w-14 h-14 rounded-2xl ${v.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <v.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-foreground mb-4 tracking-tight">{v.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-medium text-sm">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#0f172a] rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden border border-white/5"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary opacity-20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary opacity-20 blur-[120px]" />
        
        <h2 className="font-display text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight relative z-10">
          Experience the <span className="text-primary brightness-150">Standard</span> today.
        </h2>
        <p className="text-slate-300 text-xl md:text-2xl font-medium mb-12 max-w-2xl mx-auto relative z-10 opacity-80">
          Join thousands of customers who have elevated their lifestyle with our curated collections.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
          <Link to="/shop">
            <Button size="lg" className="rounded-full h-16 px-12 text-lg font-black gap-3 bg-white text-[#0f172a] hover:bg-slate-100 shadow-2xl shadow-white/10 border-none">
              Explore Collection <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="rounded-full h-16 px-12 text-lg font-black text-white border-white/20 hover:bg-white/5 bg-transparent">
              Talk to Support
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </main>
);

export default About;
