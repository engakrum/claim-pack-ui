import { useState } from "react";
import { 
  FileText, UploadCloud, Trash2, Download, Loader2, 
  CheckCircle2, ShieldAlert, LogOut, ArrowRight, 
  Zap, Lock, Check, ChevronDown, ChevronUp
} from "lucide-react";

/* --- DASHBOARD COMPONENT --- */
const Dashboard = ({ onBack }) => {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("General Dispute");
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const totalSizeMB = files.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024);
  const isOverLimit = totalSizeMB > 10;

  const handleGenerateClick = () => {
    if (files.length === 0) return alert("Please upload evidence first.");
    if (isOverLimit) { setShowPaywall(true); return; }
    runGeneration();
  };

  const runGeneration = async () => {
    setIsGenerating(true);
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    formData.append('category', category);
    formData.append('summary', summary);

    try {
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
        alert("Server Error. If this is the first try, wait 60 seconds for the server to wake up, then try again.");
      }
    } catch (error) {
      alert("Network Error: Could not reach server. The backend might be sleeping (Free Tier). Please try again in 1 minute.");
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
      {/* PAYWALL */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1121] border border-teal-500 rounded-2xl p-8 max-w-md w-full text-center">
            <Lock className="w-12 h-12 text-teal-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">File Limit Exceeded</h2>
            <p className="text-slate-400 mb-6">Your files are {totalSizeMB.toFixed(1)} MB. Free limit is 10 MB.</p>
            <button className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#020617] font-bold">Upgrade for $9.99</button>
            <button onClick={() => setShowPaywall(false)} className="mt-3 text-slate-400 hover:text-white">Cancel</button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#020617]/95 backdrop-blur">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onBack}>
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center"><FileText className="w-6 h-6 text-teal-400" /></div>
            <span className="text-xl font-bold text-white">ClaimPack</span>
          </div>
          <button onClick={onBack}><LogOut className="w-5 h-5 text-slate-400" /></button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8">
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
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
               <h3 className="text-lg font-bold text-white mb-4">2. Upload Evidence</h3>
               <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="border-2 border-dashed border-slate-700 bg-[#0B1121] rounded-xl p-10 text-center hover:border-teal-500/30 transition-all">
                  <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">Drag files here</p>
                  <input type="file" multiple className="hidden" id="file-upload" onChange={(e) => e.target.files && setFiles([...files, ...Array.from(e.target.files)])} />
                  <label htmlFor="file-upload" className="block mt-4 text-teal-400 cursor-pointer">Browse Files</label>
               </div>
               {files.length > 0 && (
                 <div className="mt-4 space-y-2">
                   <div className="flex justify-between text-xs text-slate-400">
                      <span>Total: {totalSizeMB.toFixed(1)} MB / 10 MB Limit</span>
                      {isOverLimit && <span className="text-red-400 font-bold">Over Limit</span>}
                   </div>
                   <div className="h-1 bg-slate-800 rounded overflow-hidden">
                      <div className={`h-full ${isOverLimit ? 'bg-red-500' : 'bg-teal-500'}`} style={{width: `${Math.min((totalSizeMB/10)*100, 100)}%`}}></div>
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
          <div className="lg:col-span-5">
             <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4">Summary</h3>
                <div className="space-y-3 mb-8">
                   <div className="flex gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Auto-Formatting</div>
                   <div className="flex gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Evidence Indexing</div>
                   <div className="flex gap-2 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Legal PDF Output</div>
                </div>
                <button onClick={handleGenerateClick} disabled={isGenerating} className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 ${isOverLimit ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-teal-500 hover:bg-teal-400 text-[#020617]'}`}>
                   {isGenerating ? <><Loader2 className="animate-spin"/> Processing...</> : (isOverLimit ? <><Lock className="w-5 h-5"/> Unlock to Generate</> : "Generate PDF Binder")}
                </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* --- LANDING PAGE (HERO + PRICING + FAQ) --- */
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
          <button onClick={onGetStarted} className="bg-teal-500 hover:bg-teal-400 text-[#020617] px-4 py-2 rounded-lg font-bold text-sm">Get Started</button>
        </div>
      </nav>

      {/* HERO */}
      <div className="container mx-auto px-6 pt-20 pb-20 text-center max-w-5xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-teal-400 mb-8">
          <ShieldAlert className="w-3 h-3" /> Trusted by 10,000+ users
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
          Win Your Disputes Faster – <br />
          <span className="text-teal-400">Organize Evidence in Seconds</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12">
          Drag your screenshots and files, get a polished PDF ready to send to support, banks, or regulators.
        </p>
        <button onClick={onGetStarted} className="h-12 px-8 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#020617] font-bold text-lg flex items-center justify-center gap-2 mx-auto transition-all shadow-xl shadow-teal-500/20 hover:scale-105">
          Start Building Your Case <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* PRICING */}
      <div className="py-24 border-t border-slate-800 bg-[#0B1121]">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Fair Pricing</h2>
            <p className="text-slate-400">Pay only when you need more power.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-2">Free Starter</h3>
              <div className="flex items-baseline gap-1 mb-8"><span className="text-4xl font-bold text-white">$0</span><span className="text-slate-500">/ forever</span></div>
              <ul className="space-y-4 mb-8 text-slate-300 text-sm">
                 <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-teal-500" /> Up to 10 MB Uploads</li>
                 <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-teal-500" /> 1 PDF Binder Generation</li>
              </ul>
              <button onClick={onGetStarted} className="w-full py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-white font-bold">Use for Free</button>
            </div>
            <div className="bg-[#020617] border border-teal-500 rounded-2xl p-8 relative shadow-2xl shadow-teal-500/10">
              <div className="absolute top-0 right-0 transform -translate-y-1/2 mr-6 bg-teal-500 text-[#020617] text-xs font-bold px-3 py-1 rounded-full">Recommended</div>
              <h3 className="text-xl font-bold text-white mb-2">Pro Bundle</h3>
              <div className="flex items-baseline gap-1 mb-8"><span className="text-4xl font-bold text-white">$9.99</span><span className="text-slate-500">/ case</span></div>
              <ul className="space-y-4 mb-8 text-slate-300 text-sm">
                 <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-teal-400" /> <b>Up to 50 MB Uploads</b></li>
                 <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-teal-400" /> Priority Processing</li>
              </ul>
              <button onClick={onGetStarted} className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#020617] font-bold">Start Pro Case</button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ SECTION (ADDED) */}
      <div className="py-24 border-t border-slate-800 bg-[#020617]">
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
    </div>
  );
};

const App = () => {
  const [view, setView] = useState("landing");
  return view === "landing" ? <LandingPage onGetStarted={() => setView("dashboard")} /> : <Dashboard onBack={() => setView("landing")} />;
};

export default App;