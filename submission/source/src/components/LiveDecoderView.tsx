import React, { useState } from 'react';
import { Upload, Eye, Zap, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';

export const LiveDecoderView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [model, setModel] = useState<string>('gemini-3.1-flash-lite');
  const [isDecoding, setIsDecoding] = useState<boolean>(false);
  const [extractedData, setExtractedData] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setErrorMsg(null);
      setExtractedData(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunDecoder = async () => {
    if (!previewUrl) return;

    setIsDecoding(true);
    setErrorMsg(null);
    setExtractedData(null);

    try {
      const res = await fetch('/api/decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: previewUrl,
          mimeType: selectedFile?.type || 'image/jpeg',
          model,
          billId: selectedFile?.name.replace(/\.[^/.]+$/, '') || 'USER_UPLOAD',
        }),
      });

      const data = await res.json();
      if (res.ok && data.extracted) {
        setExtractedData(data.extracted);
      } else {
        setErrorMsg(data.error || 'Extraction failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error connecting to /api/decode');
    } finally {
      setIsDecoding(false);
    }
  };

  const handleCopy = () => {
    if (!extractedData) return;
    navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-400" />
              <h2 className="text-lg font-bold text-slate-100">
                Live Gemini Vision Utility Bill Decoder
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Test live multimodal extraction on any K-Electric, LESCO, or IESCO bill using the competition-approved <code className="text-amber-300">gemini-3.1-flash-lite</code> or <code className="text-amber-300">gemini-3.5-flash-lite</code> model.
            </p>
          </div>

          {/* Model Switcher */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-slate-400 font-medium">Model:</span>
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
              {['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite'].map((m) => (
                <button
                  key={m}
                  onClick={() => setModel(m)}
                  className={`px-3 py-1 text-xs font-mono font-medium rounded transition-all ${
                    model === m
                      ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Upload and Preview */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 font-mono flex items-center gap-2">
            <Upload className="w-4 h-4 text-amber-400" />
            Upload Bill Image (.png / .jpg)
          </h3>

          <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl p-6 text-center cursor-pointer relative bg-slate-950/40 transition-colors">
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="space-y-2 pointer-events-none">
              <Upload className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-300 font-medium">
                Click or drag bill image here
              </p>
              <p className="text-[11px] text-slate-500">
                Supports KE, LESCO, and IESCO bills
              </p>
            </div>
          </div>

          {previewUrl && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> Preview: {selectedFile?.name}
                </span>
                <span>{(Number(selectedFile?.size || 0) / 1024).toFixed(1)} KB</span>
              </div>
              <div className="max-h-[360px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center p-2">
                <img
                  src={previewUrl}
                  alt="Bill Preview"
                  className="max-h-[340px] w-auto object-contain rounded"
                />
              </div>

              <button
                onClick={handleRunDecoder}
                disabled={isDecoding}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isDecoding ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin text-slate-400" />
                    Extracting Level 1 JSON with {model}...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Decode Bill with {model}
                  </>
                )}
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Right: Extracted JSON Result */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100 font-mono">
                  Extracted Level 1 JSON Output
                </h3>
                {extractedData && (
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Schema Valid
                  </span>
                )}
              </div>

              {extractedData && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  Copy JSON
                </button>
              )}
            </div>

            {extractedData ? (
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-200/90 overflow-x-auto max-h-[500px]">
                {JSON.stringify(extractedData, null, 2)}
              </pre>
            ) : (
              <div className="h-[460px] rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center justify-center text-center p-6 space-y-2 text-slate-500">
                <Zap className="w-8 h-8 text-slate-600" />
                <p className="text-xs font-medium text-slate-400">
                  No extraction run yet
                </p>
                <p className="text-[11px] max-w-sm">
                  Upload a bill image on the left and click Decode Bill to trigger the server-side Gemini Vision model.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
