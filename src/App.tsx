import React, { useState, useEffect } from 'react';

export default function App() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    area: 'Inside Dhaka',
    paymentMethod: 'Cash On Delivery',
    trxId: '',
    senderNo: ''
  });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/store-data')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setVideoUrl(data.videoUrl || null);
        if (data.products && data.products.length > 0) {
          setSelectedProduct(data.products[0]);
        }
      })
      .catch(err => console.error("Error fetching store data:", err));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (method: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        productTitle: selectedProduct.title,
        productPrice: selectedProduct.price
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setOrderSuccess(true);
        setFormData({
          name: '', phone: '', address: '', area: 'Inside Dhaka',
          paymentMethod: 'Cash On Delivery', trxId: '', senderNo: ''
        });
        setTimeout(() => setOrderSuccess(false), 5000);
      }
    });
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen">
      {/* ANNOUNCEMENT BAR */}
      <div className="bg-secondary-container text-on-secondary-container text-center py-2 px-4 text-sm font-medium tracking-wide sticky top-0 z-[60]">
        Limited Stock Available! Order yours before it's gone.
      </div>

      {/* TopNavBar */}
      <nav className="fixed top-8 w-full z-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-stone-50/70 dark:bg-stone-900/70 backdrop-blur-xl flex justify-between items-center px-8 py-4 rounded-full shadow-sm shadow-stone-200/50">
            <div className="text-2xl font-serif italic font-bold text-stone-900 dark:text-white">Book Candle BD</div>
            <div className="hidden md:flex items-center space-x-8 font-serif text-lg tracking-tight">
              <a className="text-stone-500 hover:text-stone-900 transition-colors duration-300" href="#features">Features</a>
              <a className="text-stone-500 hover:text-stone-900 transition-colors duration-300" href="#products">Products</a>
              <a className="text-stone-500 hover:text-stone-900 transition-colors duration-300" href="#faq">FAQ</a>
            </div>
            <a className="bg-primary text-on-primary px-6 py-2 rounded-full font-semibold glow-hover transition-all" href="#order">Order Now</a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-surface">
        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div className="z-10">
            <span className="inline-block px-4 py-1 rounded-full bg-primary-container/20 text-primary font-semibold text-sm mb-6">Premium Collection</span>
            <h1 className="text-6xl md:text-7xl font-headline font-bold leading-[1.1] text-on-surface mb-6 tracking-tight">
              {selectedProduct ? (
                <>Transform Your Space with <span className="italic text-primary">{selectedProduct.title}</span></>
              ) : (
                <>Welcome to <span className="italic text-primary">Book Candle BD</span></>
              )}
            </h1>
            <p className="text-xl text-on-surface-variant max-w-lg mb-10 leading-relaxed">
              {selectedProduct ? selectedProduct.description : "No products available right now. Admin, please add products via the Telegram bot!"}
            </p>
            {selectedProduct && (
              <div className="flex flex-col sm:flex-row gap-4">
                <a className="bg-primary text-on-primary px-10 py-4 rounded-xl text-lg font-semibold glow-hover transition-all text-center" href="#order">Order Now - ৳{selectedProduct.price}</a>
                <a className="border-2 border-outline-variant text-on-surface px-10 py-4 rounded-xl text-lg font-semibold hover:bg-surface-container-low transition-all text-center" href="#products">View All</a>
              </div>
            )}
            <div className="mt-8 flex items-center gap-3 text-on-surface-variant font-medium">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              Cash on Delivery Available
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl"></div>
            <div className="relative bg-surface-container-lowest p-4 rounded-lg ambient-shadow rotate-2">
              {selectedProduct ? (
                <img alt={selectedProduct.title} className="rounded-md w-full object-cover aspect-square" src={selectedProduct.image} />
              ) : (
                <div className="w-full aspect-square bg-surface-container-high rounded-md flex items-center justify-center text-on-surface-variant">
                  No Image
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO SECTION */}
      {videoUrl && (
        <section className="py-24 bg-surface-container-lowest">
          <div className="max-w-5xl mx-auto px-8 text-center">
            <h2 className="text-4xl font-headline font-bold mb-10">See It In Action</h2>
            <div className="relative rounded-2xl overflow-hidden ambient-shadow aspect-video bg-surface-container-high border-4 border-surface-variant">
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                muted
                loop
                playsInline
                src={videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="mt-4 text-on-surface-variant text-sm">
              * Note: Admin can change this video link using the /setvideo command in Telegram.
            </p>
          </div>
        </section>
      )}

      {/* SOCIAL PROOF TOAST */}
      <div className="fixed bottom-8 left-8 z-[100] animate-bounce hidden md:block">
        <div className="bg-surface-container-lowest ambient-shadow rounded-full px-6 py-3 flex items-center gap-4 border border-outline-variant/10">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-secondary-container">shopping_bag</span>
          </div>
          <div>
            <p className="text-sm font-medium">Rumana from Dhaka</p>
            <p className="text-xs text-on-surface-variant">just ordered a product!</p>
          </div>
        </div>
      </div>

      {/* DYNAMIC PRODUCTS SHOWCASE */}
      {products.length > 0 && (
        <section id="products" className="py-24 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-headline font-bold mb-4">Our Collection</h2>
              <p className="text-on-surface-variant">Select a product to order</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="group cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  <div className={`bg-surface-container-lowest rounded-lg p-6 mb-6 transition-transform duration-500 group-hover:-translate-y-4 ${selectedProduct?.id === product.id ? 'border-2 border-primary scale-105' : 'border border-transparent'}`}>
                    <img className="rounded-lg aspect-square object-cover mb-6 w-full" alt={product.title} src={product.image} />
                    <h3 className="font-headline text-xl mb-2">{product.title}</h3>
                    <p className="text-primary font-bold text-lg mb-2">৳{product.price}</p>
                    <p className="text-on-surface-variant text-sm line-clamp-2">{product.description}</p>
                    <button className="mt-4 w-full bg-primary-container/20 text-primary py-2 rounded-lg font-semibold hover:bg-primary hover:text-on-primary transition-colors">
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURES GRID */}
      <section className="py-24 bg-surface" id="features">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-surface-container-low rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">handyman</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Premium Quality</h3>
              <p className="text-sm text-on-surface-variant">Crafted with the finest materials for durability.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-surface-container-low rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">local_shipping</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
              <p className="text-sm text-on-surface-variant">Get your products delivered to your doorstep quickly.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-surface-container-low rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">support_agent</span>
              </div>
              <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
              <p className="text-sm text-on-surface-variant">We are always here to help you with your queries.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-surface-container-low rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">stars</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Aesthetic Design</h3>
              <p className="text-sm text-on-surface-variant">Beautifully designed products for your lifestyle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-surface-container-lowest" id="faq">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-headline font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-on-surface-variant">Everything you need to know about our gadgets and lamps.</p>
          </div>
          <div className="space-y-6">
            {[
              { q: "1. What is the delivery time inside and outside Dhaka?", a: "We deliver within 1-3 days inside Dhaka and 3-5 days outside Dhaka via our trusted courier partners." },
              { q: "2. Do you offer Cash on Delivery (COD)?", a: "Yes, we offer Cash on Delivery all over Bangladesh. You can also pay in advance via bKash or Nagad." },
              { q: "3. Is there any warranty on the table lamps and gadgets?", a: "Yes, we provide a 7-day replacement warranty for any manufacturing defects. Please keep the original packaging." },
              { q: "4. How long does the battery last on rechargeable lamps?", a: "Depending on the brightness level, our rechargeable table lamps and book candles typically last 6 to 8 hours on a single charge." },
              { q: "5. Are the LED lights safe for the eyes during reading?", a: "Absolutely! Our table lamps feature warm, anti-glare LED lights specifically designed to reduce eye strain during reading or working." },
              { q: "6. Do the lamps come with a charging cable?", a: "Yes, all our rechargeable gadgets and lamps come with a complimentary USB charging cable included in the box." },
              { q: "7. Can I return the product if there is an issue?", a: "Yes, if you receive a damaged or incorrect product, you can return or exchange it within 3 days of delivery." },
              { q: "8. How can I track my order?", a: "Once your order is dispatched, our delivery partner will contact you via phone or SMS with updates on your delivery status." }
            ].map((faq, index) => (
              <div key={index} className="bg-surface-container-high p-6 rounded-lg ambient-shadow border border-outline-variant/10">
                <h3 className="font-bold text-lg mb-2 text-primary">{faq.q}</h3>
                <p className="text-on-surface-variant">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ORDER PROCESS & DELIVERY INFO */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-headline font-bold mb-10">Simple 3-Step Process</h2>
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg">1</div>
                  <p className="text-xl font-medium">Select Your Product</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg">2</div>
                  <p className="text-xl font-medium">Enter Your Details Below</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg">3</div>
                  <p className="text-xl font-medium">Confirm & Wait for Delivery</p>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-lg p-10 border-2 border-primary-container/20">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                Delivery Charges
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-surface-container-high rounded-lg">
                  <span className="font-medium">Inside Dhaka</span>
                  <span className="text-xl font-bold text-primary">৳80</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-surface-container-high rounded-lg">
                  <span className="font-medium">Outside Dhaka</span>
                  <span className="text-xl font-bold text-primary">৳130</span>
                </div>
              </div>
              <p className="mt-6 text-sm text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">info</span>
                Expected delivery: 1-3 days inside Dhaka, 3-5 days outside.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE ORDER FORM & PAYMENT */}
      <section className="py-24 bg-surface" id="order">
        <div className="max-w-4xl mx-auto px-8">
          <div className="bg-surface-container-lowest p-10 rounded-lg ambient-shadow">
            <h2 className="text-3xl font-headline font-bold mb-8 text-center">Complete Your Order</h2>
            
            {orderSuccess && (
              <div className="mb-8 p-4 bg-green-100 text-green-800 rounded-lg text-center font-bold text-lg">
                ✅ Order placed successfully! We will contact you soon.
              </div>
            )}

            {!selectedProduct ? (
              <div className="text-center text-on-surface-variant p-8 bg-surface-container-low rounded-lg">
                Please select a product first to place an order.
              </div>
            ) : (
              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Selected Product Summary */}
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 flex items-center gap-4">
                  <img src={selectedProduct.image} alt={selectedProduct.title} className="w-16 h-16 object-cover rounded-md" />
                  <div>
                    <h4 className="font-bold text-lg">{selectedProduct.title}</h4>
                    <p className="text-primary font-bold">৳{selectedProduct.price}</p>
                  </div>
                </div>

                {/* Delivery Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold border-b border-outline-variant/30 pb-2">1. Shipping Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2">Full Name</label>
                      <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full rounded-lg bg-surface-container-high border-none focus:ring-2 focus:ring-primary/20 p-4" placeholder="e.g. Abdullah Al Mamun" type="text" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2">Phone Number</label>
                      <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full rounded-lg bg-surface-container-high border-none focus:ring-2 focus:ring-primary/20 p-4" placeholder="01XXX-XXXXXX" type="tel" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">Full Address</label>
                    <textarea required name="address" value={formData.address} onChange={handleInputChange} className="w-full rounded-lg bg-surface-container-high border-none focus:ring-2 focus:ring-primary/20 p-4" placeholder="House, Road, Area, Landmark" rows={3}></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">Delivery Area</label>
                    <select name="area" value={formData.area} onChange={handleInputChange} className="w-full rounded-lg bg-surface-container-high border-none focus:ring-2 focus:ring-primary/20 p-4">
                      <option value="Inside Dhaka">Inside Dhaka</option>
                      <option value="Outside Dhaka">Outside Dhaka</option>
                    </select>
                  </div>
                </div>

                {/* Payment Logic */}
                <div className="space-y-4" id="payment">
                  <h3 className="text-lg font-bold border-b border-outline-variant/30 pb-2">2. Payment Method</h3>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex-1 min-w-[120px] relative cursor-pointer">
                      <input checked={formData.paymentMethod === 'bKash'} onChange={() => handlePaymentChange('bKash')} className="sr-only peer" name="payment" type="radio" />
                      <div className="p-4 border-2 border-outline-variant rounded-lg flex flex-col items-center gap-2 transition-all peer-checked:border-primary peer-checked:bg-primary/5">
                        <span className="text-xl font-bold text-pink-600">bKash</span>
                      </div>
                    </label>
                    <label className="flex-1 min-w-[120px] relative cursor-pointer">
                      <input checked={formData.paymentMethod === 'Nagad'} onChange={() => handlePaymentChange('Nagad')} className="sr-only peer" name="payment" type="radio" />
                      <div className="p-4 border-2 border-outline-variant rounded-lg flex flex-col items-center gap-2 transition-all peer-checked:border-primary peer-checked:bg-primary/5">
                        <span className="text-xl font-bold text-orange-500 italic">Nagad</span>
                      </div>
                    </label>
                    <label className="flex-1 min-w-[120px] relative cursor-pointer">
                      <input checked={formData.paymentMethod === 'Cash On Delivery'} onChange={() => handlePaymentChange('Cash On Delivery')} className="sr-only peer" name="payment" type="radio" />
                      <div className="p-4 border-2 border-outline-variant rounded-lg flex flex-col items-center gap-2 transition-all peer-checked:border-primary peer-checked:bg-primary/5">
                        <span className="material-symbols-outlined text-primary">payments</span>
                        <span className="text-sm font-bold text-center">Cash On Delivery</span>
                      </div>
                    </label>
                  </div>

                  {/* bKash/Nagad Instructions Box */}
                  {(formData.paymentMethod === 'bKash' || formData.paymentMethod === 'Nagad') && (
                    <div className="bg-surface-container-high p-6 rounded-lg space-y-4 border border-primary-container/30">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-primary">{formData.paymentMethod} Personal:</span>
                        <span className="text-xl font-headline font-bold">01741413528</span>
                      </div>
                      <div className="text-sm text-on-surface-variant">
                        <p className="mb-2"><strong>Instructions:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Go to {formData.paymentMethod} app and select <strong>Send Money</strong>.</li>
                          <li>Enter the number <strong>01741413528</strong>.</li>
                          <li>Enter Amount <strong>৳{selectedProduct.price} + Delivery Fee</strong>.</li>
                          <li>Enter Sender Number & Transaction ID below.</li>
                        </ul>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <input required name="senderNo" value={formData.senderNo} onChange={handleInputChange} className="w-full rounded-lg bg-surface-container-lowest border-none focus:ring-2 focus:ring-primary/20 p-4" placeholder={`Sender ${formData.paymentMethod} No.`} type="text" />
                        <input required name="trxId" value={formData.trxId} onChange={handleInputChange} className="w-full rounded-lg bg-surface-container-lowest border-none focus:ring-2 focus:ring-primary/20 p-4" placeholder="Transaction ID (TrxID)" type="text" />
                      </div>
                    </div>
                  )}
                </div>

                <button className="w-full bg-primary text-on-primary py-5 rounded-xl text-xl font-bold glow-hover transition-all mt-4" type="submit">
                  Confirm Order & Pay
                </button>
                <p className="text-center text-xs text-on-surface-variant">Your data is secured with SSL encryption. Order notification will be sent to your phone.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-100 dark:bg-stone-950 w-full py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="font-serif text-xl font-bold text-stone-800 dark:text-stone-200">Book Candle BD</div>
          <div className="flex flex-wrap justify-center gap-8 font-sans text-sm tracking-wide text-stone-700 dark:text-stone-300">
            <a className="hover:text-stone-900 transition-all" href="#">Privacy Policy</a>
            <a className="hover:text-stone-900 transition-all" href="#">Terms of Service</a>
            <a className="hover:text-stone-900 transition-all" href="#">Shipping Info</a>
            <a className="hover:text-stone-900 transition-all" href="#">Contact Us</a>
          </div>
          <div className="text-stone-500 dark:text-stone-400 font-sans text-sm tracking-wide">
            © {new Date().getFullYear()} Book Candle BD. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

