import { useState } from "react";
import { FileText, UploadCloud, Trash2, Download, Loader2, CheckCircle2, Clock, ShieldAlert, LogOut } from "lucide-react";

/* --- 1. INTERNAL COMPONENTS (The "Ferrari Parts") --- */

const Button = ({ children, onClick, disabled, className = "", variant = "primary" }) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = {
    primary: "bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20",
    ghost: "hover:bg-slate-800 text-slate-400 hover:text-white",
    outline: "border border-slate-700 hover:border-teal-500 text-slate-300 hover:text-teal-400"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
};

const FileUploadZone = ({ files, onFilesChange }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) onFilesChange([...files, ...Array.from(e.dataTransfer.files)]);
  };

  return (
    <div className="space-y-4">
      <div 
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-slate-700 bg-slate-900/50 rounded-xl p-8 text-center transition-all hover:border-teal-500/50 hover:bg-slate-900/80 group"
      >
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-500/10 transition-colors">
          <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-teal-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-200">Drag & Drop Evidence</h3>
        <p className="text-sm text-slate-500 mt-2 mb-6">PDFs, Images, or Screenshots</p>
        
        <input 
          type="file" 
          multiple 
          id="file-upload" 
          className="hidden" 
          onChange={(e) => e.target.files && onFilesChange([...files, ...Array.from(e.target.files)])}
        />
        <label htmlFor="file-upload">
          <span className="cursor-pointer px-6 py-3 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors font-medium border border-slate-700">
            Browse Files
          </span>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-teal-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button 
                onClick={() => onFilesChange(files.filter((_, i) => i !== idx))}
                className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* --- 2. MAIN APP --- */

const App = () => {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("General Dispute");
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // 🚀 LIVE CLOUD CONNECTION
  const handleGenerate = async () => {
    if (files.length === 0) return alert("Please upload evidence first.");
    
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
        alert("Server Error. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Network Error: Is your internet working?");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-teal-500/30">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#020617]/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ClaimPack
            </span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-sm text-slate-500 hidden sm:block">Logged in as Akrum J.</span>
             <Button variant="ghost" className="!p-2"><LogOut className="w-5 h-5" /></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* STEP 1 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-teal-400 mb-2">
                <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center font-bold border border-teal-500/20">1</div>
                <h2 className="text-xl font-semibold text-white">Case Details</h2>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
                <label className="block text-sm font-medium text-slate-400 mb-2">Dispute Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                >
                  <option>General Dispute</option>
                  <option>Credit Card Fraud</option>
                  <option>Housing / Rent</option>
                  <option>Medical Insurance</option>
                </select>

                <label className="block text-sm font-medium text-slate-400 mt-6 mb-2">Summary of Events</label>
                <textarea 
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="E.g. I purchased a flight on..."
                  className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
            </section>

            {/* STEP 2 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-teal-400 mb-2">
                <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center font-bold border border-teal-500/20">2</div>
                <h2 className="text-xl font-semibold text-white">Evidence Upload</h2>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-sm">
                <FileUploadZone files={files} onFilesChange={setFiles} />
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 space-y-8">
            <section className="sticky top-28 space-y-6">
              <div className="flex items-center gap-3 text-teal-400 mb-2">
                <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center font-bold border border-teal-500/20">3</div>
                <h2 className="text-xl font-semibold text-white">Review & Generate</h2>
              </div>
              
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ShieldAlert className="w-24 h-24 text-teal-500" />
                </div>

                <h3 className="text-lg font-medium text-white mb-6">Binder Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <CheckCircle2 className="w-5 h-5 text-teal-500" />
                    <span>Auto-Table of Contents</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <CheckCircle2 className="w-5 h-5 text-teal-500" />
                    <span>Evidence Timestamping</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <CheckCircle2 className="w-5 h-5 text-teal-500" />
                    <span>Legal PDF Formatting</span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-6">
                  <div className="flex justify-between items-end mb-6">
                    <span className="text-slate-400">Files attached</span>
                    <span className="text-2xl font-bold text-white">{files.length}</span>
                  </div>

                  <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating || files.length === 0}
                    className="w-full py-4 text-lg"
                  >
                    {isGenerating ? (
                      <><Loader2 className="animate-spin" /> Compiling...</>
                    ) : (
                      <><Download className="w-5 h-5" /> Generate PDF Binder</>
                    )}
                  </Button>
                  <p className="text-center text-xs text-slate-500 mt-4">
                    Bank-level encryption • 100% Private
                  </p>
                </div>
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;