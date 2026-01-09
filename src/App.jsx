import { useState } from "react";
import { 
  FileText, UploadCloud, Trash2, Download, Loader2, 
  CheckCircle2, ShieldAlert, LogOut, ArrowRight, 
  Zap, Lock, ChevronDown, ChevronUp
} from "lucide-react";

/* --- DASHBOARD COMPONENT (The Tool) --- */
const Dashboard = ({ onBack }) => {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("General Dispute");
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  // 💰 MONEY LOGIC: 5 MB LIMIT
  const totalSizeMB = files.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024);
  const isOverLimit = totalSizeMB > 5; // Changed from 10 to 5 as requested

  const handleGenerateClick = () => {
    if (files.length === 0) return alert("Please upload evidence first.");
    
    // Trigger Paywall if over 5 MB
    if (isOverLimit) {
      setShowPaywall(true);
      return;
    }
    runGeneration();
  };

  const runGeneration = async () => {
    setIsGenerating(true);
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    formData.append('category', category);
    formData.append('summary', summary);

    try {
      // Connects to your live backend
      const response = await fetch('https://claim-pack-backend.onrender.com/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ClaimPack_${category.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Server Error. The backend might be waking up (Free Tier). Wait 60 seconds and try again.");
      }
    } catch (error) {
      alert("Network Error: Could not reach server. The backend is likely still building or sleeping. Please check Render Dashboard.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) setFiles([...files, ...Array.from(e.dataTransfer.files)]);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-teal-500/30 relative">
      
      {/* PAYWALL POPUP ($9.99 for > 5MB) */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1121] border border-teal-500 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
            <Lock className="w-12 h-12 text-teal-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">File Limit Exceeded</h2>
            <p className="text-slate-400 mb-6">
              Your files are <strong>{totalSizeMB.toFixed(1)} MB</strong>.<br/>
              The free limit is <strong>5 MB</strong>.
            </p>
            <button className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#020617] font-bold mb-3">
              Upgrade for $9.99
            </button>
            <button onClick={() => setShowPaywall(false)} className="text-sm text-slate-500 hover:text-white">Cancel</button>
          </div>
        </div>
      )}

      {/* DASHBOARD HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#020617]/95 backdrop-blur">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onBack}>
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center"><FileText className="w-6 h-6 text-teal-400" /></div>
            <span className="text-xl font-bold text-white">ClaimPack</span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-sm text-slate-500 hidden sm:block">Logged in as Akrum J.</span>
             <button onClick={onBack}><LogOut className="w-5 h-5 text-slate-400" /></button>
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <main className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Details */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
               <h3 className="text-lg font-bold text-white mb-4">1. Case Details</h3>
               <select className="w-full bg-[#0B1121] border border-slate-700 rounded-xl p-4 mb-4 text-white" value={category} onChange={e=>setCategory(e.target.value)}>
                 <option>General Dispute</option>
                 <option>Fraud</option>
                 <option>Housing</option>
                 <option>Travel</option>
               </select>
               <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="What happened?" className="w-full h-32 bg-[#0B1121] border border-slate-700 rounded-xl p-4 text-white focus:border-teal-500 outline-none" />
            </div>

            {/* 2. Upload */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
               <h3 className="text-lg font-bold text-white mb-4">2. Upload Evidence</h3>
               <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="border-2 border-dashed border-slate-700 bg-[#0B1121] rounded-xl p-10 text-center hover:border-teal-500/30 transition-all">
                  <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">Drag files here (Images/PDFs)</p>
                  <input type="file" multiple className="hidden" id="file-upload" onChange={(e) => e.target.files && setFiles([...files, ...Array.from(e.target.files)])} />
                  <label htmlFor="file-upload" className="block mt-4 text-teal-400 cursor-pointer font-bold">Browse Files</label>
               </div>
               
               {/* File List & Bar */}
               {files.length > 0 && (
                 <div className="mt-4 space-y-2">
                   <div className="flex justify-between text-xs text-slate-400">
                      <span>Total: {totalSizeMB.toFixed(1)} MB / 5 MB Free Limit</span>
                      {isOverLimit && <span className="text-red-400 font-bold">Over Limit ($9.99)</span>}
                   </div>
                   <div className="h-1 bg-slate-800 rounded overflow-hidden">
                      <div className={`h-full ${isOverLimit ? 'bg-red-500' : 'bg-teal-500'}`} style={{width: `${Math.min((totalSizeMB/5)*100, 100)}%`}}></div>
                   </div>
                   {files.map((f, i) => (
                     <div key={i} className="flex justify-between p-3 bg-[#0B1121] rounded border border-slate-800">
                       <span className="text-sm text-slate-300 truncate">{f.name}</span>
                       <Trash2 className="w-4 h-4 text-red-400 cursor-pointer" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} />
                     </div>
                   ))}
                 </div>
               )}
            </div>
          </div>

          {/* 3. Generate */}
          <div className="lg:col-span-5">
             <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4">Summary</h3>
                <div className="space-y-3 mb-8">
                   <div className="flex gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Auto-Formatting</div>
                   <div className="flex gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Evidence Indexing</div>
                   <div className="flex gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Legal PDF Output</div>
                </div>
                <button 
                  onClick={handleGenerateClick} 
                  disabled={isGenerating} 
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 ${isOverLimit ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-teal-500 hover:bg-teal-400 text-[#020617]'}`}
                >
                   {isGenerating ? <><Loader2 className="animate-spin"/> Processing...</> : (isOverLimit ? <><Lock className="w-5 h-5"/> Unlock to Generate</> : "Generate PDF Binder")}
                </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* --- LANDING PAGE (Marketing) --- */
const LandingPage = ({ onGetStarted }) => {
  const [openFaq, setOpenFaq] = useState(null);
  const faqs = [
    { q: "Is this legal advice?", a: "No. ClaimPack is a document organization tool. We help you format evidence, but we are not lawyers." },
    { q: "What types of disputes can I use this for?", a: "Credit card chargebacks, landlord disputes, travel refunds, insurance claims, and more." },
    { q: "Is my data secure?", a: "Yes. Files are processed securely and deleted from our servers after processing." },
    { q: "Can I edit the generated PDF?", a: "The PDF is final, but you can edit your case details here and regenerate a new one instantly." },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-teal-500/30">
      <nav className="border-b border-slate-800 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center"><FileText className="w-5 h-5 text-teal-400" /></div>
            <span>ClaimPack</span>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={onGetStarted} className="bg-teal-500 hover:bg-teal-400 text-[#020617] px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-teal-500/20">Get Started</button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="container mx-auto px-6 pt-20 pb-20 text-center max-w-5xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-teal-400 mb-8">
          <ShieldAlert className="w-3 h-3" /> Trusted by 10,000+ users
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
          Win Your Disputes Faster – <br />
          <span className="text-teal-400">Organize Evidence in Seconds</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Drag your screenshots and files, get a polished PDF ready to send to support, banks, or regulators. No legal jargon. Just organized proof.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button onClick={onGetStarted} className="h-12 px-8 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#020617] font-bold text-lg flex items-center gap-2 transition-all shadow-xl shadow-teal-500/20 hover:scale-105">
            Start Building Your Case <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="bg-[#0B1121] py-24 border-t border-slate-800">
        <div className="container mx-auto px-6">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How It <span className="text-teal-400">Works</span></h2>
              <p className="text-slate-400">From messy files to professional evidence binder in under 60 seconds</p>
           </div>
           <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: UploadCloud, title: "1. Upload Evidence", desc: "Drag and drop screenshots, emails, receipts." },
              { icon: Zap, title: "2. Auto-Organize", desc: "Our AI sorts files by date and builds a timeline." },
              { icon: FileText, title: "3. Review & Edit", desc: "Preview your binder and add captions." },
              { icon: Download, title: "4. Download & Send", desc: "Get a professional PDF ready to submit." }
            ].map((step, i) => (
              <div key={i} className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-teal-500/30 transition-all">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4">
                  <step.icon className="w-5 h-5 text-teal-400" />
                </div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING SECTION */}
      <div className="py-24 border-t border-slate-800 bg-[#020617]">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Fair Pricing</h2>
            <p className="text-slate-400">Pay only when you need more power.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-teal-500/30 transition-all">
              <h3 className="text-xl font-bold text-white mb-2">Free Starter</h3>
              <div className="flex items-baseline gap-1 mb-6"><span className="text-4xl font-bold text-white">$0</span><span className="text-slate-500">/ forever</span></div>
              <ul className="space-y-3 mb-8 text-slate-300 text-sm">
                 <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-teal-500" /> Up to 5 MB Uploads</li>
                 <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-teal-500" /> 1 PDF Binder Generation</li>
              </ul>
              <button onClick={onGetStarted} className="w-full py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-white font-bold">Use for Free</button>
            </div>
            <div className="bg-[#020617] border border-teal-500 rounded-2xl p-8 relative shadow-2xl shadow-teal-500/10">
              <div className="absolute top-0 right-0 transform -translate-y-1/2 mr-6 bg-teal-500 text-[#020617] text-xs font-bold px-3 py-1 rounded-full">Recommended</div>
              <h3 className="text-xl font-bold text-white mb-2">Pro Bundle</h3>
              <div className="flex items-baseline gap-1 mb-6"><span className="text-4xl font-bold text-white">$9.99</span><span className="text-slate-500">/ case</span></div>
              <ul className="space-y-3 mb-8 text-slate-300 text-sm">
                 <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-teal-400" /> <b>Up to 50 MB Uploads</b></li>
                 <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-teal-400" /> Priority Processing</li>
              </ul>
              <button onClick={onGetStarted} className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#020617] font-bold shadow-lg shadow-teal-500/20">Start Pro Case</button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-24 border-t border-slate-800 bg-[#0B1121]">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked <span className="text-teal-400">Questions</span></h2>
            <p className="text-slate-400">Everything you need to know about using ClaimPack</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-medium text-slate-200 hover:bg-slate-800/50 transition-colors"
                >
                  {faq.q}
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-teal-400" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-[#020617] pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center gap-2 font-bold text-xl mb-4 md:mb-0">
               <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center"><FileText className="w-5 h-5 text-teal-400" /></div>
               <span>ClaimPack</span>
            </div>
            <div className="flex gap-8 text-slate-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="text-slate-500 text-sm mt-4 md:mt-0">
              © 2026 ClaimPack. All rights reserved.
            </div>
          </div>
          <div className="text-center text-xs text-slate-600 max-w-2xl mx-auto leading-relaxed border-t border-slate-800/50 pt-8">
            ClaimPack is a document organization tool and does not provide legal advice. Consult with a qualified attorney for legal matters. Results may vary depending on your specific situation.
          </div>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  const [view, setView] = useState("landing");
  return view === "landing" ? <LandingPage onGetStarted={() => setView("dashboard")} /> : <Dashboard onBack={() => setView("landing")} />;
};

export default App;