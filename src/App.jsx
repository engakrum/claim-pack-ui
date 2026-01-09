import { useState } from "react";
import { 
  FileText, UploadCloud, Trash2, Download, Loader2, 
  CheckCircle2, ShieldAlert, LogOut, ArrowRight, 
  Check, Menu, X, Star, Shield 
} from "lucide-react";

/* --- DASHBOARD COMPONENT (The App) --- */
const Dashboard = ({ onBack }) => {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("General Dispute");
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // 🚀 LIVE BACKEND CONNECTION
  const handleGenerate = async () => {
    if (files.length === 0) return alert("Please upload evidence first.");
    setIsGenerating(true);
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    formData.append('category', category);
    formData.append('summary', summary);

    try {
      // USING YOUR LIVE RENDER BACKEND
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
        alert("Server Error. The backend might still be restarting. Wait 1 min and try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Network Error: Could not reach the server.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) setFiles([...files, ...Array.from(e.dataTransfer.files)]);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-teal-500/30">
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
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-500/20 text-xs border border-teal-500/30">1</span> 
                Case Details
              </h2>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-sm">
                <label className="block text-sm font-medium text-slate-400 mb-2">Dispute Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#0B1121] border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-teal-500 outline-none transition-all">
                  <option>General Dispute</option>
                  <option>Credit Card Fraud</option>
                  <option>Housing / Rent</option>
                  <option>Medical Insurance</option>
                  <option>Flight Compensation</option>
                </select>
                <label className="block text-sm font-medium text-slate-400 mt-6 mb-2">Summary of Events</label>
                <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="E.g. I purchased a flight on..." className="w-full h-32 bg-[#0B1121] border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-teal-500 outline-none resize-none" />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-teal-400 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-500/20 text-xs border border-teal-500/30">2</span> 
                Evidence Upload
              </h2>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                 <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="border-2 border-dashed border-slate-700 bg-[#0B1121] rounded-xl p-10 text-center hover:border-teal-500/50 transition-colors group">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-500/10 transition-colors">
                      <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-teal-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white">Drag & Drop Evidence</h3>
                    <p className="text-sm text-slate-500 mt-2 mb-6">PDFs, Images, or Screenshots</p>
                    <input type="file" multiple id="file-upload" className="hidden" onChange={(e) => e.target.files && setFiles([...files, ...Array.from(e.target.files)])} />
                    <label htmlFor="file-upload" className="cursor-pointer px-6 py-3 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700">Browse Files</label>
                 </div>
                 {files.length > 0 && (
                    <div className="mt-6 space-y-3">
                      {files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-[#0B1121] border border-slate-800 rounded-lg">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-8 h-8 rounded bg-teal-500/20 flex items-center justify-center flex-shrink-0"><FileText className="w-4 h-4 text-teal-400" /></div>
                            <p className="text-sm text-slate-300 truncate">{file.name}</p>
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
              <h2 className="text-lg font-semibold text-teal-400 flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-500/20 text-xs border border-teal-500/30">3</span> 
                Review & Generate
              </h2>
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
                  <button onClick={handleGenerate} disabled={isGenerating || files.length === 0} className="w-full py-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#020617] font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50">
                    {isGenerating ? <><Loader2 className="animate-spin" /> Compiling...</> : <><Download className="w-5 h-5" /> Generate PDF Binder</>}
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

/* --- LANDING PAGE COMPONENT (The Marketing Face) --- */
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
            <a href="#" className="hover:text-white transition-colors">How It Works</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-slate-300 hover:text-white">Sign In</button>
            <button onClick={onGetStarted} className="bg-teal-500 hover:bg-teal-400 text-[#020617] px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-teal-500/20">
              Get Started
            </button>
          </div>
        </div>
      </nav>

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
          <button className="h-12 px-8 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-white font-medium transition-all">
            Watch Demo
          </button>
        </div>
        <div className="flex items-center justify-center gap-8 text-sm text-slate-500 mb-20">
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-500" /> 60-second setup</div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-500" /> Professional PDF output</div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4 text-teal-500" /> Bank-grade security</div>
        </div>
        
        {/* --- HOW IT WORKS SECTION (Matches Screenshot) --- */}
        <div className="py-20 border-t border-slate-800">
          <h2 className="text-3xl font-bold mb-4">How It <span className="text-teal-400">Works</span></h2>
          <p className="text-slate-400 mb-12">From messy files to professional evidence binder in under 60 seconds</p>
          <div className="grid md:grid-cols-4 gap-6 text-left">
            {[
              { icon: UploadCloud, title: "1. Upload Evidence", desc: "Drag and drop screenshots, emails, receipts." },
              { icon: Star, title: "2. Auto-Organize", desc: "Our AI sorts files by date and builds a timeline." },
              { icon: FileText, title: "3. Review & Edit", desc: "Preview your binder and add captions." },
              { icon: Download, title: "4. Download & Send", desc: "Get a professional PDF ready to submit." }
            ].map((step, i) => (
              <div key={i} className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4">
                  <step.icon className="w-5 h-5 text-teal-400" />
                </div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.desc}</p>
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