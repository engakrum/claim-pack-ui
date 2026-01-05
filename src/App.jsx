import React, { useState } from 'react';
import { 
  Upload, Wand2, FileText, Send, CheckCircle2, 
  Menu, X, ChevronDown, ChevronUp, Star 
} from 'lucide-react';
import Dashboard from './Dashboard';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false); // This controls the screen switch

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // --- THE SWITCH ---
  // If showDashboard is true, we hide the landing page and show the Dashboard instead
  if (showDashboard) {
    return <Dashboard onBack={() => setShowDashboard(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-[#2dd4bf] selection:text-[#020617]">
      
      {/* --- Navigation Bar --- */}
      <nav className="fixed w-full z-50 top-0 py-4 px-6 bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2dd4bf] rounded-lg flex items-center justify-center text-[#020617] font-bold">C</div>
            <span className="text-xl font-bold tracking-tight text-white">ClaimPack</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 text-sm text-gray-400 font-medium">
            <a href="#how-it-works" className="hover:text-[#2dd4bf] transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-[#2dd4bf] transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-[#2dd4bf] transition-colors">FAQ</a>
          </div>

          <div className="hidden md:flex gap-4 items-center">
            <button className="text-sm font-medium hover:text-white text-gray-300 transition-colors">Sign In</button>
            <button 
              onClick={() => setShowDashboard(true)} 
              className="bg-[#2dd4bf] text-[#020617] px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#14b8a6] transition-all shadow-lg shadow-teal-500/20"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#020617] border-b border-white/10 p-4 flex flex-col gap-4 text-center">
            <a href="#how-it-works" className="text-gray-300 py-2 hover:text-[#2dd4bf]">How It Works</a>
            <a href="#pricing" className="text-gray-300 py-2 hover:text-[#2dd4bf]">Pricing</a>
            <a href="#faq" className="text-gray-300 py-2 hover:text-[#2dd4bf]">FAQ</a>
            <button 
              onClick={() => setShowDashboard(true)}
              className="bg-[#2dd4bf] text-[#020617] px-5 py-2.5 rounded-lg font-bold"
            >
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* --- Hero Section --- */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#2dd4bf]/10 rounded-full blur-[120px] -z-10"></div>

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#2dd4bf]/20 bg-[#2dd4bf]/5 text-[#2dd4bf] text-xs font-bold uppercase tracking-wide mb-4 hover:bg-[#2dd4bf]/10 transition-colors cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-pulse"></span>
            Trusted by 10,000+ users
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-white">
            Win Your Disputes <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2dd4bf] to-blue-500">Faster</span> <br />
            Organize Evidence in <span className="text-white">Seconds</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Drag your screenshots and files, get a polished PDF ready to send to support, banks, or regulators. No legal jargon. Just organized proof.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <button 
              onClick={() => setShowDashboard(true)}
              className="bg-[#2dd4bf] text-[#020617] px-8 py-4 rounded-xl text-lg font-bold hover:bg-[#14b8a6] transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transform hover:-translate-y-1"
            >
              Start Building Your Case →
            </button>
            <button className="px-8 py-4 rounded-xl text-lg font-medium border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2 text-white">
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">▶</span> Watch Demo
            </button>
          </div>
          
          <div className="pt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2dd4bf]" /> 60-second setup</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2dd4bf]" /> Professional PDF output</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2dd4bf]" /> Bank-grade security</div>
          </div>
        </div>
        
        {/* Dashboard Preview Image Placeholder */}
        <div className="mt-20 max-w-5xl mx-auto rounded-2xl border border-white/10 bg-[#0f172a]/50 backdrop-blur-sm p-2 shadow-2xl">
           <div className="rounded-xl overflow-hidden bg-[#020617] aspect-video flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>
              <div className="text-center space-y-4 z-10 p-8">
                 <div className="w-16 h-16 bg-[#2dd4bf]/20 rounded-2xl mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <FileText className="w-8 h-8 text-[#2dd4bf]" />
                 </div>
                 <h3 className="text-2xl font-bold text-white">Interactive Dashboard Preview</h3>
                 <p className="text-gray-400">Your future uploaded files and timeline will appear here.</p>
              </div>
           </div>
        </div>
      </section>

      {/* --- How It Works --- */}
      <section id="how-it-works" className="py-24 px-6 bg-[#0f172a]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white">How It <span className="text-[#2dd4bf]">Works</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">From messy files to professional evidence binder in under 60 seconds.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { 
                icon: <Upload className="w-6 h-6" />, 
                title: "1. Upload Evidence", 
                desc: "Drag and drop screenshots, emails, receipts. We accept images, PDFs, and email exports." 
              },
              { 
                icon: <Wand2 className="w-6 h-6" />, 
                title: "2. Auto-Organize", 
                desc: "Our AI sorts files by date, extracts details like merchants/amounts, and builds a timeline." 
              },
              { 
                icon: <FileText className="w-6 h-6" />, 
                title: "3. Review & Edit", 
                desc: "Preview your organized evidence, add captions, reorder items, and choose your category." 
              },
              { 
                icon: <Send className="w-6 h-6" />, 
                title: "4. Download & Send", 
                desc: "Get a professional PDF binder with cover page and index ready to submit to banks." 
              }
            ].map((step, i) => (
              <div key={i} className="bg-[#1e293b]/50 border border-white/5 p-6 rounded-2xl hover:bg-[#1e293b] transition-all group hover:-translate-y-2">
                <div className="w-12 h-12 bg-[#2dd4bf]/10 rounded-xl flex items-center justify-center text-[#2dd4bf] mb-4 group-hover:bg-[#2dd4bf] group-hover:text-[#020617] transition-colors">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Testimonials --- */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white">Real Results from <span className="text-[#2dd4bf]">Real People</span></h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah M.", role: "Won $1,200 chargeback", text: "My bank initially denied my fraud claim. I uploaded my screenshots to ClaimPack, generated the PDF, and sent it back. Approved within 48 hours!" },
              { name: "James T.", role: "Landlord dispute resolved", text: "Documented months of maintenance requests my landlord ignored. The organized timeline made it crystal clear. Got my full deposit back." },
              { name: "Maria L.", role: "Airline compensation", text: "Flight was delayed 8 hours with no explanation. ClaimPack helped me organize all my boarding passes and communications. Got €400 in EU261 compensation." }
            ].map((t, i) => (
              <div key={i} className="bg-[#1e293b]/30 border border-white/5 p-8 rounded-2xl text-left hover:border-[#2dd4bf]/30 transition-all">
                <div className="flex gap-1 text-[#2dd4bf] mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2dd4bf]/20 flex items-center justify-center text-[#2dd4bf] font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-xs text-[#2dd4bf]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Pricing --- */}
      <section id="pricing" className="py-24 px-6 bg-[#0f172a]/30">
        <div className="max-w-3xl mx-auto text-center space-y-12">
           <div className="space-y-4">
             <h2 className="text-3xl md:text-5xl font-bold text-white">Simple, <span className="text-[#2dd4bf]">Fair Pricing</span></h2>
             <p className="text-gray-400">Preview your binder for free. Only pay when you're ready to download.</p>
           </div>

           <div className="grid md:grid-cols-2 gap-8 items-start">
             {/* Single Plan */}
             <div className="bg-[#020617] border border-white/10 p-8 rounded-2xl text-left relative overflow-hidden group hover:border-[#2dd4bf]/50 transition-all">
               <h3 className="text-xl font-bold text-white mb-2">Single Binder</h3>
               <p className="text-gray-400 text-sm mb-6">Perfect for a one-off dispute.</p>
               <div className="text-4xl font-bold text-white mb-6">$4 <span className="text-lg text-gray-500 font-normal">/ one-time</span></div>
               <button 
                 onClick={() => setShowDashboard(true)}
                 className="w-full py-3 rounded-lg border border-white/20 hover:bg-white/5 font-bold transition-all mb-8"
               >
                 Get Started
               </button>
               <ul className="space-y-3 text-sm text-gray-300">
                 <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#2dd4bf]" /> One complete evidence binder</li>
                 <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#2dd4bf]" /> Professional PDF output</li>
                 <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#2dd4bf]" /> Cover page & timeline</li>
               </ul>
             </div>

             {/* Unlimited Plan */}
             <div className="bg-[#1e293b]/50 border border-[#2dd4bf] p-8 rounded-2xl text-left relative overflow-hidden shadow-2xl shadow-teal-900/20">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#2dd4bf] text-[#020617] text-xs font-bold px-3 py-1 rounded-b-lg">MOST POPULAR</div>
               <h3 className="text-xl font-bold text-white mb-2">Unlimited</h3>
               <p className="text-gray-400 text-sm mb-6">For ongoing disputes or businesses.</p>
               <div className="text-4xl font-bold text-white mb-6">$7.99 <span className="text-lg text-gray-500 font-normal">/ month</span></div>
               <button 
                 onClick={() => setShowDashboard(true)}
                 className="w-full py-3 rounded-lg bg-[#2dd4bf] text-[#020617] hover:bg-[#14b8a6] font-bold transition-all mb-8 shadow-lg shadow-teal-500/20"
               >
                 Start Free Trial
               </button>
               <ul className="space-y-3 text-sm text-gray-300">
                 <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#2dd4bf]" /> Unlimited evidence binders</li>
                 <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#2dd4bf]" /> Priority AI processing</li>
                 <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#2dd4bf]" /> Cloud storage for files</li>
                 <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#2dd4bf]" /> Cancel anytime</li>
               </ul>
             </div>
           </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center text-white">Frequently Asked <span className="text-[#2dd4bf]">Questions</span></h2>
          <div className="space-y-4">
            {[
              { q: "Is this legal advice?", a: "No. ClaimPack is a document organization tool. We help you present your own evidence clearly, but we do not provide legal counsel." },
              { q: "What file types do you accept?", a: "We accept JPG, PNG, PDF, and screenshots from mobile or desktop." },
              { q: "Is my data secure?", a: "Yes. We use bank-grade encryption to process your files, and they are deleted from our servers after your project is complete (unless you choose the Unlimited plan for storage)." },
              { q: "Can I edit the generated PDF?", a: "Yes! You get a preview phase where you can rename files, add captions, and reorder evidence before the final PDF is generated." }
            ].map((faq, i) => (
              <div key={i} className="bg-[#1e293b]/30 border border-white/5 rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium text-white">{faq.q}</span>
                  {openFaqIndex === i ? <ChevronUp className="text-[#2dd4bf]" /> : <ChevronDown className="text-gray-500" />}
                </button>
                {openFaqIndex === i && (
                  <div className="px-6 pb-4 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-12 px-6 border-t border-white/10 text-center text-gray-500 text-sm">
        <div className="flex justify-center items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-[#2dd4bf] rounded-md flex items-center justify-center text-[#020617] font-bold text-xs">C</div>
          <span className="font-bold text-white">ClaimPack</span>
        </div>
        <div className="flex justify-center gap-6 mb-8">
          <a href="#" className="hover:text-[#2dd4bf]">Privacy Policy</a>
          <a href="#" className="hover:text-[#2dd4bf]">Terms of Service</a>
          <a href="#" className="hover:text-[#2dd4bf]">Contact</a>
        </div>
        <p>&copy; 2026 ClaimPack. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default App;