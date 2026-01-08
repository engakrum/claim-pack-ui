import { useState } from "react";
import { FileText, Download, Loader2, UploadCloud } from "lucide-react";

const App = () => {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("General Dispute");
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper to handle file selection
  const handleFileChange = (e) => {
    if (e.target.files) {
      // Convert FileList to Array
      setFiles(Array.from(e.target.files));
    }
  };

  // 🚀 CONNECTION TO YOUR LIVE BACKEND
  const handleGenerate = async () => {
    if (files.length === 0) {
      alert("Please upload at least one file.");
      return;
    }

    setIsGenerating(true);
    const formData = new FormData();
    
    // 1. Attach Files
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    // 2. Attach Data
    formData.append('category', category);
    formData.append('summary', summary);

    try {
      // 📡 TALKING TO THE CLOUD
      const response = await fetch('https://claim-pack-backend.onrender.com/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // 📥 DOWNLOAD PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ClaimPack_${category.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        alert("Success! Your binder is downloading.");
      } else {
        alert("Error: The backend rejected the files.");
      }
    } catch (error) {
      console.error(error);
      alert("Network Error: Could not reach the server.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER */}
        <header className="flex items-center gap-3 border-b border-slate-800 pb-6">
          <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center text-teal-400">
            <FileText size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">ClaimPack <span className="text-teal-400">Pro</span></h1>
        </header>

        <main className="grid md:grid-cols-2 gap-8">
          
          {/* LEFT: INPUTS */}
          <div className="space-y-6">
            
            {/* STEP 1: CATEGORY */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
              <h2 className="text-lg font-semibold mb-4 text-teal-400">1. Case Details</h2>
              
              <label className="block text-sm text-slate-400 mb-2">Dispute Type</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option>General Dispute</option>
                <option>Credit Card Fraud</option>
                <option>Insurance Claim</option>
                <option>Rent Dispute</option>
              </select>

              <label className="block text-sm text-slate-400 mt-4 mb-2">Summary (Optional)</label>
              <textarea 
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Briefly describe what happened..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 h-24 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            {/* STEP 2: UPLOAD */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
              <h2 className="text-lg font-semibold mb-4 text-teal-400">2. Evidence</h2>
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-teal-500/50 transition-colors">
                <input 
                  type="file" 
                  multiple 
                  onChange={handleFileChange} 
                  className="hidden" 
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <UploadCloud size={32} className="text-slate-500" />
                  <span className="text-slate-300 font-medium">Click to Upload Files</span>
                  <span className="text-slate-500 text-sm">JPG, PNG, PDF supported</span>
                </label>
              </div>
              
              {/* FILE LIST */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/50 p-2 rounded">
                      <FileText size={14} /> {f.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: ACTION */}
          <div className="flex flex-col">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex-1 flex flex-col justify-center items-center text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold">Ready to Generate?</h2>
                <p className="text-slate-400 text-sm">We will compile your {files.length} files into a professional legal binder.</p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || files.length === 0}
                className="w-full max-w-xs bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <><Loader2 className="animate-spin" /> Processing...</>
                ) : (
                  <><Download size={20} /> Download PDF Binder</>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;