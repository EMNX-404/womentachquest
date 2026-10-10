import React, { useState } from 'react';
import { Upload, X, Zap, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';

interface UploadModalProps {
  onClose: () => void;
  onDecoded?: (data: any) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ onClose, onDecoded }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [extracted, setExtracted] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setErrorMsg(null);
      setExtracted(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDecode = async () => {
    if (!previewUrl) return;

    setIsDecoding(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: previewUrl,
          mimeType: selectedFile?.type || 'image/jpeg',
          model: 'gemini-3.1-flash-lite',
          billId: selectedFile?.name.replace(/\.[^/.]+$/, '') || 'SCAN_BILL',
        }),
      });

      const data = await res.json();
      if (res.ok && data.extracted) {
        setExtracted(data.extracted);
        onDecoded?.(data.extracted);
      } else {
        setErrorMsg(data.error || 'Failed to extract bill.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Connection error');
    } finally {
      setIsDecoding(false);
    }
  };

  const handleCopy = () => {
    if (!extracted) return;
    navigator.clipboard.writeText(JSON.stringify(extracted, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#141724] border border-[#23293D] rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#21273C] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Scan Electricity Bill</h3>
              <p className="text-xs text-slate-400">
                Upload image of K-Electric, LESCO, or IESCO bill to extract data instantly.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#1C2132] hover:bg-[#252C42] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dropzone */}
            <div className="space-y-4">
              <label className="border-2 border-dashed border-[#28314B] hover:border-amber-400/50 rounded-2xl p-6 text-center cursor-pointer flex flex-col items-center justify-center bg-[#11131E] transition-all min-h-[220px]">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleFile}
                  className="hidden"
                />
                <Upload className="w-10 h-10 text-slate-500 mb-2" />
                <span className="text-sm font-bold text-slate-200">
                  {selectedFile ? selectedFile.name : 'Click to select bill image'}
                </span>
                <span className="text-xs text-slate-500 mt-1">PNG or JPG up to 10MB</span>
              </label>

              {previewUrl && (
                <div className="space-y-3">
                  <div className="rounded-xl overflow-hidden border border-[#23293D] max-h-48 flex items-center justify-center bg-black">
                    <img src={previewUrl} alt="Bill Preview" className="max-h-48 object-contain" />
                  </div>

                  <button
                    onClick={handleDecode}
                    disabled={isDecoding}
                    className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
                  >
                    {isDecoding ? (
                      <>
                        <Zap className="w-4 h-4 animate-spin text-slate-400" />
                        Extracting Bill Information...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-current" />
                        Run AI Extraction
                      </>
                    )}
                  </button>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Extracted Output */}
            <div className="p-4 rounded-2xl bg-[#0F111A] border border-[#212638] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#212638] mb-3">
                  <span className="text-xs font-bold text-slate-300 font-mono uppercase">
                    Extracted Data
                  </span>
                  {extracted && (
                    <button
                      onClick={handleCopy}
                      className="text-xs text-amber-300 hover:text-white flex items-center gap-1 font-mono font-medium"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy
                    </button>
                  )}
                </div>

                {extracted ? (
                  <pre className="text-xs font-mono text-amber-200/90 overflow-x-auto max-h-[300px]">
                    {JSON.stringify(extracted, null, 2)}
                  </pre>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center text-center text-slate-500 text-xs space-y-1">
                    <Zap className="w-6 h-6 text-slate-600 mb-1" />
                    <p className="font-medium text-slate-400">Ready to scan</p>
                    <p className="text-[11px]">Upload bill on left and click Run AI Extraction</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
