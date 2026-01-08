import { useState } from "react";
// Ensure these components exist in your project structure
import { Button } from "@/components/ui/button"; 
import { FileUploadZone } from "@/components/app/FileUploadZone";
import { EvidenceTimeline } from "@/components/app/EvidenceTimeline";
import { DisputeSettings } from "@/components/app/DisputeSettings";
import { FileText, Download, LogOut, Loader2 } from "lucide-react";

// Simple Toast replacement
const toast = ({ title, description }) => alert(`${title}\n${description}`);

const App = () => {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("");
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // 🚀 THIS IS THE UPDATED CLOUD CONNECTION
  const handleGenerate = async () => {
    if (files.length === 0) {
      toast({ title: "No files", description: "Please upload evidence first." });
      return;
    }
    
    if (!category) {
      toast({ title: "Select Category", description: "Please choose a dispute category." });
      return;
    }

    setIsGenerating(true);

    const formData = new FormData();
    // 1. Attach Files
    files.forEach(f => formData.append('files', f.file));
    // 2. Attach Data
    formData.append('category', category);
    formData.append('summary', summary);

    try {
      // 3. Send to YOUR LIVE CLOUD BACKEND (Updated Link)
      const response = await fetch('https://claim-pack-backend.onrender.com/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // 4. Download PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ClaimPack_${category.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        toast({ title: "Success!", description: "Your Binder has been downloaded." });
      } else {
        toast({ title: "Error", description: "Backend rejected the files." });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Network Error", description: "Could not reach the Cloud Backend." });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
       {/* --- HEADER --- */}
      <header className="border-b bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            ClaimPack
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">Logged in as Akrum J.</span>
            <Button variant="ghost" size="icon">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* --- LEFT COLUMN: INPUTS --- */}
          <div className="lg:col-span-7 space-y-8">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">1</span>
                  Case Details
                </h2>
              </div>
              <div className="glass-card p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                <DisputeSettings 
                  category={category}
                  summary={summary}
                  onCategoryChange={setCategory}
                  onSummaryChange={setSummary}
                />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">2</span>
                Evidence Upload
              </h2>
              <div className="glass-card p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                <FileUploadZone files={files} onFilesChange={setFiles} />
              </div>
            </section>
          </div>

          {/* --- RIGHT COLUMN: PREVIEW --- */}
          <div className="lg:col-span-5 space-y-8">
             <section className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">3</span>
                Timeline Review
              </h2>
              <div className="glass-card p-6 rounded-xl border bg-card text-card-foreground shadow-sm min-h-[400px] flex flex-col">
                <div className="flex-1">
                   <EvidenceTimeline files={files} onFilesChange={setFiles} />
                </div>
                
                {/* GENERATE BUTTON */}
                <div className="pt-6 mt-6 border-t">
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || files.length === 0}
                    className="w-full bg-[#2dd4bf] hover:bg-[#14b8a6] text-[#020617] font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <><Loader2 className="animate-spin" /> Generating Binder...</>
                    ) : (
                      <><Download className="w-5 h-5" /> Generate PDF Binder</>
                    )}
                  </button>
                  <p className="text-xs text-center text-gray-400 mt-3">
                    Secure bank-grade encryption.
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