import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

const Cart = () => {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <main className="pt-32 pb-20 font-body bg-slate-50/50 min-h-screen">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">Your Selection</p>
          <h1 className="font-display text-4xl md:text-6xl font-black text-foreground tracking-tighter">Shopping Bag</h1>
        </motion.div>

        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-xl max-w-2xl mx-auto"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-3xl font-black text-foreground mb-4 tracking-tight">Your bag is empty</h2>
            <p className="text-muted-foreground mb-10 max-w-xs mx-auto font-medium">Looks like you haven't added anything to your bag yet. Let's change that!</p>
            <Link to="/shop">
              <Button className="rounded-2xl h-14 px-10 gap-2 font-bold shadow-lg">
                Start Shopping <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="popLayout">
                {items.map((item, i) => {
                  const productId = item.product._id || item.product.id;
                  return (
                    <motion.div
                      key={productId}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex flex-col sm:flex-row gap-8 p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                    >
                      <Link to={`/product/${productId}`} className="w-full sm:w-40 aspect-square rounded-2xl overflow-hidden bg-slate-50 shrink-0 relative">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </Link>
                      
                      <div className="flex-1 flex flex-col justify-between py-2">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">{typeof item.product.category === 'object' ? item.product.category.name : item.product.category}</p>
                            <h3 className="font-display text-xl font-black text-foreground hover:text-primary transition-colors tracking-tight">{item.product.name}</h3>
                          </div>
                          <button 
                            onClick={() => removeItem(productId)} 
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-8 sm:mt-0">
                          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-100">
                            <button 
                              className="w-10 h-10 rounded-xl hover:bg-white transition-colors flex items-center justify-center" 
                              onClick={() => updateQuantity(productId, item.quantity - 1)}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-10 text-center text-sm font-black">{item.quantity}</span>
                            <button 
                              className="w-10 h-10 rounded-xl hover:bg-white transition-colors flex items-center justify-center" 
                              onClick={() => updateQuantity(productId, item.quantity + 1)}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-right">
                             <p className="text-2xl font-black text-foreground tracking-tight">${item.product.price * item.quantity}</p>
                             <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">${item.product.price} each</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <aside className="space-y-6">
              <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl sticky top-32">
                <h2 className="font-display text-2xl font-black text-foreground mb-8 tracking-tighter">Summary</h2>
                <div className="space-y-4 font-medium">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span><span className="text-foreground font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-500 font-bold" : "text-foreground font-bold"}>
                      {shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="h-px bg-slate-100 my-6" />
                  <div className="flex justify-between text-2xl font-black text-foreground tracking-tighter">
                    <span>Total</span><span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link to="/checkout">
                  <Button size="lg" className="w-full rounded-2xl h-16 mt-10 gap-3 font-bold text-lg shadow-xl shadow-primary/20">
                    Process Order <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>

                <div className="mt-10 space-y-4">
                   <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground bg-slate-50 p-4 rounded-2xl">
                      <Truck className="w-5 h-5 text-primary" />
                      <span>Free delivery on orders over $200</span>
                   </div>
                   <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground bg-slate-50 p-4 rounded-2xl">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <span>Secure SSL Encrypted Checkout</span>
                   </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
