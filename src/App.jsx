import { useState } from "react";
import { 
  FileText, UploadCloud, Trash2, Download, Loader2, 
  CheckCircle2, ShieldAlert, LogOut, ArrowRight, 
  Zap, Lock, Check
} from "lucide-react";

/* =========================================
   PART 1: THE DASHBOARD (With 10MB Limit Logic)
   ========================================= */

const Dashboard = ({ onBack }) => {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("General Dispute");
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  // CALCULATE TOTAL SIZE (MB)
  const totalSizeMB = files.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024);
  const isOverLimit = totalSizeMB > 10;

  const handleGenerateClick = () => {
    if (files.length === 0) return alert("Please upload evidence first.");
    
    // 💰 MONEY LOGIC: If over 10MB, show Paywall
    if (isOverLimit) {
      setShowPaywall(true);
      return;
    }

    // Otherwise, generate for free
    runGeneration();
  };

  // 🚀 LIVE BACKEND CONNECTION
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
        alert("Server Error. The backend might be waking up. Please wait 30 seconds and try again.");
      }
    } catch (error) {
      alert("Network Error: Could not reach the server. Ensure the Backend is LIVE on Render.");
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
      
      {/* PAYWALL MODAL */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1121] border border-teal-500 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-teal-500/20 text-center">
            <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-teal-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">File Limit Exceeded</h2>
            <p className="text-slate-400 mb-6">
              Your files total <strong>{totalSizeMB.toFixed(1)} MB</strong>.<br/>
              The free tier is limited to 10 MB.
            </p>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Upgrade to Pro</span>
                <span className="text-xl font-bold text-teal-400">$9.99</span>
              </div>
              <ul className="text-left text-sm text-slate-400 space-y-2">
                <li className="flex gap-2"><Check className="w-4 h-4 text-teal-500"/> Upload up to 50 MB</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-teal-500"/> Priority Processing</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowPaywall(false)} className="flex-1 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 transition">Cancel</button>
              <button onClick={() => alert("Payment Integration would open here (Stripe)")} className="flex-1 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#020617] font-bold transition">Pay $9.99</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#020617]/95 backdrop-blur">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onBack}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ClaimPack <span className="text-teal-400">Pro</span></span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-sm text-slate-500 hidden sm:block">Logged in as Akrum J.</span>
             <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><LogOut className="w-5 h-5 text-slate-400" /></button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* LEFT: INPUTS */}
          <div className="lg:col-span-7 space-y-8">
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-teal-400 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-500/20 text-xs border border-teal-500/30">1</span> Case Details
              </h2>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-sm">
                <label className="block text-sm font-medium text-slate-400 mb-2">Dispute Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#0B1121] border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-teal-500 outline-none transition-all">
                  <option>General Dispute</option>
                  <option>Credit Card Fraud</option>
                  <option>Housing / Rent</option>
                  <option>Medical Insurance</option>
                </select>
                <label className="block text-sm font-medium text-slate-400 mt-6 mb-2">Summary of Events</label>
                <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="E.g. I purchased a flight on..." className="w-full h-32 bg-[#0B1121] border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-teal-500 outline-none resize-none" />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-teal-400 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-500/20 text-xs border border-teal-500/30">2</span> Evidence Upload
              </h2>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                 <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="border-2 border-dashed border-slate-700 bg-[#0B1121] rounded-xl p-10 text-center hover:border-teal-500/50 transition-colors group">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-500/10 transition-colors">
                      <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-teal-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white">Drag & Drop Evidence</h3>
                    <p className="text-sm text-slate-500 mt-2 mb-6">Images & PDFs supported</p>
                    <input type="file" multiple id="file-upload" className="hidden" onChange={(e) => e.target.files && setFiles([...files, ...Array.from(e.target.files)])} />
                    <label htmlFor="file-upload" className="cursor-pointer px-6 py-3 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700">Browse Files</label>
                 </div>
                 
                 {/* FILE LIST + SIZE INDICATOR */}
                 {files.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <div className="flex justify-between text-xs text-slate-400 px-1">
                        <span>Total Size: <span className={isOverLimit ? "text-red-400 font-bold" : "text-teal-400 font-bold"}>{totalSizeMB.toFixed(1)} MB</span> / 10 MB Free Limit</span>
                        {isOverLimit && <span className="text-red-400 flex items-center gap-1"><Lock size={12}/> Pro Required</span>}
                      </div>
                      
                      {/* PROGRESS BAR */}
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${isOverLimit ? 'bg-red-500' : 'bg-teal-500'} transition-all duration-500`} 
                          style={{ width: `${Math.min((totalSizeMB / 10) * 100, 100)}%` }}
                        ></div>
                      </div>

                      {files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-[#0B1121] border border-slate-800 rounded-lg">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-8 h-8 rounded bg-teal-500/20 flex items-center justify-center flex-shrink-0"><FileText className="w-4 h-4 text-teal-400" /></div>
                            <div className="min-w-0">
                                <p className="text-sm text-slate-300 truncate">{file.name}</p>
                                <p className="text-xs text-slate-500">{(file.size / (1024*1024)).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button onClick={() => setFiles(files.filter((_, i) => i !== idx))} className="text-slate-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                 )}
              </div>
            </section>
          </div>

          {/* RIGHT: PREVIEW */}
          <div className="lg:col-span-5 space-y-8">
            <section className="sticky top-28">
              <h2 className="text-lg font-semibold text-teal-400 flex items-center gap-2 mb-4"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-500/20 text-xs border border-teal-500/30">3</span> Review & Generate</h2>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5"><ShieldAlert className="w-32 h-32 text-teal-500" /></div>
                <h3 className="text-lg font-medium text-white mb-6">Binder Summary</h3>
                <div className="space-y-4 mb-8">
                  {['Auto-Table of Contents', 'Evidence Timestamping', 'Legal PDF Formatting'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-400">
                      <CheckCircle2 className="w-5 h-5 text-teal-500" /> <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-800 pt-6">
                  <div className="flex justify-between items-end mb-6">
                    <span className="text-slate-400">Files attached</span>
                    <span className="text-2xl font-bold text-white">{files.length}</span>
                  </div>
                  <button 
                    onClick={handleGenerateClick} 
                    disabled={isGenerating || files.length === 0} 
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 ${isOverLimit ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-teal-500 hover:bg-teal-400 text-[#020617]'}`}
                  >
                    {isGenerating ? <><Loader2 className="animate-spin" /> Compiling...</> : (isOverLimit ? <><Lock className="w-5 h-5"/> Unlock Pro to Generate</> : <><Download className="w-5 h-5" /> Generate PDF Binder</>)}
                  </button>
                  <p className="text-center text-xs text-slate-500 mt-4">Bank-level encryption • 100% Private</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

/* =========================================
   PART 2: LANDING PAGE (Marketing + Pricing)
   ========================================= */

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-teal-500/30">
      <nav className="border-b border-slate-800 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-teal-400" />
            </div>
            <span>ClaimPack</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onGetStarted} className="bg-teal-500 hover:bg-teal-400 text-[#020617] px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-teal-500/20">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="container mx-auto px-6 pt-20 pb-20 text-center max-w-5xl">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
          Win Your Disputes Faster<br />
          <span className="text-teal-400">Organize Evidence in Seconds</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12">
          Drag your screenshots and files, get a polished PDF ready to send to support, banks, or regulators.
        </p>
        <button onClick={onGetStarted} className="h-12 px-8 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#020617] font-bold text-lg flex items-center justify-center gap-2 mx-auto transition-all shadow-xl shadow-teal-500/20 hover:scale-105">
          Start Building Your Case <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* PRICING SECTION */}
      <div id="pricing" className="py-24 border-t border-slate-800 bg-[#0B1121]">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Fair Pricing</h2>
            <p className="text-slate-400">Pay only when you need more power.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* FREE PLAN */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:border-teal-500/30 transition-all">
              <h3 className="text-xl font-bold text-white mb-2">Free Starter</h3>
              <p className="text-sm text-slate-400 mb-6">For small, simple disputes</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-slate-500">/ forever</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-teal-500" /> Up to 10 MB Uploads</li>
                <li className="flex gap-3 text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-teal-500" /> 1 PDF Binder Generation</li>
                <li className="flex gap-3 text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-teal-500" /> Basic Timeline</li>
              </ul>
              <button onClick={onGetStarted} className="w-full py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-white font-bold transition-all">
                Use for Free
              </button>
            </div>

            {/* PRO PLAN */}
            <div className="bg-[#020617] border border-teal-500 rounded-2xl p-8 relative shadow-2xl shadow-teal-500/10">
              <div className="absolute top-0 right-0 transform -translate-y-1/2 mr-6 bg-teal-500 text-[#020617] text-xs font-bold px-3 py-1 rounded-full">
                Recommended
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pro Bundle</h3>
              <p className="text-sm text-slate-400 mb-6">For large cases & heavy evidence</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold text-white">$9.99</span>
                <span className="text-slate-500">/ case</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-teal-400" /> <b>Up to 50 MB Uploads</b></li>
                <li className="flex gap-3 text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-teal-400" /> Priority Processing</li>
                <li className="flex gap-3 text-sm text-slate-300"><CheckCircle2 className="w-5 h-5 text-teal-400" /> Email Support</li>
              </ul>
              <button onClick={onGetStarted} className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#020617] font-bold transition-all shadow-lg shadow-teal-500/20">
                Start Pro Case
              </button>
            </div>
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