import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-foreground text-white font-body">
    <div className="container mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link to="/" className="font-display text-2xl font-bold tracking-tight">LeaseLink Solution</Link>
          <p className="text-sm text-white/50 leading-relaxed max-w-xs">
            Your destination for premium curated collections. From office essentials to luxury perfumes, we deliver excellence to your doorstep.
          </p>
        </div>
        <div>
          <h4 className="text-[10px] font-black tracking-[0.2em] uppercase mb-6 text-white/40">Explore Categories</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="transition-transform hover:translate-x-1 duration-300"><Link to="/shop?category=Office products" className="hover:text-white transition-colors">Office Products</Link></li>
            <li className="transition-transform hover:translate-x-1 duration-300"><Link to="/shop?category=Baby products" className="hover:text-white transition-colors">Baby Essentials</Link></li>
            <li className="transition-transform hover:translate-x-1 duration-300"><Link to="/shop?category=Home and kitchen" className="hover:text-white transition-colors">Home & Kitchen</Link></li>
            <li className="transition-transform hover:translate-x-1 duration-300"><Link to="/shop?category=Pet supplies" className="hover:text-white transition-colors">Pet Supplies</Link></li>
            <li className="transition-transform hover:translate-x-1 duration-300"><Link to="/shop?category=Perfumes" className="hover:text-white transition-colors">Perfumes</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] font-black tracking-[0.2em] uppercase mb-6 text-white/40">Our Company</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="transition-transform hover:translate-x-1 duration-300"><Link to="/about" className="hover:text-white transition-colors">Our Mission</Link></li>
            <li className="transition-transform hover:translate-x-1 duration-300"><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li className="transition-transform hover:translate-x-1 duration-300"><Link to="/shop" className="hover:text-white transition-colors">Latest Arrivals</Link></li>
            <li className="transition-transform hover:translate-x-1 duration-300"><Link to="/admin" className="hover:text-white transition-colors">Partner Portal</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] font-black tracking-[0.2em] uppercase mb-6 text-white/40">Connect</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="transition-transform hover:translate-x-1 duration-300"><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
            <li className="transition-transform hover:translate-x-1 duration-300"><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
            <li className="transition-transform hover:translate-x-1 duration-300"><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
            <li className="transition-transform hover:translate-x-1 duration-300"><a href="#" className="hover:text-white transition-colors">Support Center</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/30 font-black uppercase tracking-widest">
        <span>© 2026 LeaseLink Solution E-commerce. All rights reserved.</span>
        <div className="flex gap-6">
          <span className="cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
          <span className="cursor-pointer hover:text-white transition-colors">Terms of Service</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
