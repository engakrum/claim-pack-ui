import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle2, ArrowLeft, Loader2, BrainCircuit, DollarSign, Calendar } from 'lucide-react';

export default function Dashboard({ onBack }) {
  const [files, setFiles] = useState([]);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDragOver = (e) => { e.preventDefault(); };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setAnalysisResults(analysisResults.filter((_, i) => i !== index));
  };

  // 🧠 THE AI BRAIN: Ask Java to read the receipts
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisResults([]); // Reset previous results

    const newResults = [];

    // Process files one by one
    for (const file of files) {
      // Only analyze images (PDFs are hard for AI to read directly without more code)
      if (!file.type.startsWith('image/')) {
        newResults.push({ file: file.name, merchant: "PDF/Doc", date: "-", total: 0, status: "Skipped" });
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:8080/api/analyze', {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        // Add the AI's answer to our list
        newResults.push({ 
          file: file.name, 
          merchant: data.merchantName || "Unknown", 
          date: data.date || "Unknown", 
          total: data.totalAmount || 0,
          status: "Success"
        });

      } catch (error) {
        console.error("AI Failed for " + file.name, error);
        newResults.push({ file: file.name, merchant: "Error", date: "-", total: 0, status: "Failed" });
      }
    }

    setAnalysisResults(newResults);
    setIsAnalyzing(false);
  };

  // 📄 THE BINDER: Download the PDF
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const response = await fetch('http://localhost:8080/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "evidence_binder.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Backend Error!");
      }
    } catch (error) {
      alert("Network Error!");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Calculate Grand Total
  const grandTotal = analysisResults.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-6">
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2dd4bf] rounded-lg flex items-center justify-center text-[#020617] font-bold">C</div>
          <span className="font-bold text-xl">ClaimPack AI</span>
        </div>
        <div className="w-24"></div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT COLUMN: Upload Area */}
        <div className="space-y-6">
          <div className="text-left space-y-2">
            <h1 className="text-2xl font-bold text-white">1. Upload Receipts</h1>
            <p className="text-gray-400 text-sm">Upload images (JPG/PNG) for AI analysis.</p>
          </div>

          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-white/10 hover:border-[#2dd4bf]/50 hover:bg-[#1e293b]/50 rounded-2xl p-8 text-center transition-all cursor-pointer"
          >
            <input type="file" multiple onChange={handleFileSelect} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="cursor-pointer block">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-white">Click or Drag & Drop</p>
            </label>
          </div>

          {/* File List */}
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex justify-between items-center bg-[#1e293b] p-3 rounded-lg border border-white/5">
                <span className="text-sm text-gray-300 truncate w-48">{file.name}</span>
                <button onClick={() => removeFile(index)}><X className="w-4 h-4 text-gray-500 hover:text-red-400" /></button>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
             <button 
              onClick={handleAnalyze}
              disabled={files.length === 0 || isAnalyzing}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isAnalyzing ? <Loader2 className="animate-spin" /> : <BrainCircuit />}
              Analyze with AI
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Results */}
        <div className="bg-[#1e293b]/30 border border-white/5 rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <DollarSign className="text-[#2dd4bf]" /> Expense Summary
          </h2>

          {analysisResults.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p>Click "Analyze" to see the magic ✨</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analysisResults.map((result, i) => (
                <div key={i} className="bg-[#020617] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white">{result.merchant}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" /> {result.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#2dd4bf] font-bold text-lg">${result.total}</div>
                    <div className="text-[10px] text-gray-500 uppercase">{result.status}</div>
                  </div>
                </div>
              ))}

              {/* GRAND TOTAL */}
              <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                <span className="text-gray-400">Total Claim Value</span>
                <span className="text-3xl font-bold text-white">${grandTotal.toFixed(2)}</span>
              </div>
              
               <button 
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="w-full mt-4 bg-[#2dd4bf] text-[#020617] py-3 rounded-xl font-bold hover:bg-[#14b8a6] transition-all flex justify-center items-center gap-2"
              >
                {isGeneratingPdf ? <Loader2 className="animate-spin" /> : <FileText />}
                Download Binder PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}