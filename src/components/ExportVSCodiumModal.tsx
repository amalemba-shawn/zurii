import React, { useState } from 'react';
import { Download, Copy, Check, Code2, X, Terminal, ExternalLink } from 'lucide-react';

interface ExportVSCodiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportVSCodiumModal: React.FC<ExportVSCodiumModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadFile = async () => {
    try {
      const response = await fetch('/src/FarmPasscodeLogin.tsx');
      let text = '';
      if (response.ok) {
        text = await response.text();
      } else {
        // Fallback
        text = `// FarmPasscodeLogin.tsx\n// Check repository src/FarmPasscodeLogin.tsx`;
      }
      const blob = new Blob([text], { type: 'text/typescript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'FarmPasscodeLogin.tsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Error handling
    }
  };

  const handleCopyCode = async () => {
    try {
      const response = await fetch('/src/FarmPasscodeLogin.tsx');
      let text = '';
      if (response.ok) {
        text = await response.text();
      }
      if (text) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Clipboard fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#131E17] border border-white/10 rounded-2xl shadow-2xl p-6 text-white overflow-hidden space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#223528] border border-emerald-500/20 text-emerald-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Export to VSCodium
              </h3>
              <p className="text-xs text-white/50">
                Integrate this TypeScript JSX passcode login into your VSCodium project.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Download / Copy Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleDownloadFile}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#376343] hover:bg-[#437752] text-white text-xs font-medium transition-all shadow-md active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download FarmPasscodeLogin.tsx</span>
          </button>

          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-medium transition-all active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Full TSX Code'}</span>
          </button>
        </div>

        {/* 3 Step Setup Guide */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            Setup in VSCodium (3 Quick Steps)
          </h4>

          {/* Step 1 */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-xs font-medium text-white">
              <span>1. Open VSCodium & Install Dependency</span>
              <span className="text-[10px] font-mono text-white/40">Terminal</span>
            </div>
            <p className="text-[11px] text-white/50">
              In your VSCodium integrated terminal (<kbd className="px-1 py-0.5 rounded bg-white/10 text-[10px]">Ctrl + `</kbd> or <kbd className="px-1 py-0.5 rounded bg-white/10 text-[10px]">Cmd + `</kbd>):
            </p>
            <pre className="font-mono text-xs bg-black/60 p-2 rounded text-emerald-300 select-all overflow-x-auto">
              npm install lucide-react
            </pre>
          </div>

          {/* Step 2 */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-xs font-medium text-white">
              <span>2. Place File in your Project</span>
              <span className="text-[10px] font-mono text-white/40">File Tree</span>
            </div>
            <p className="text-[11px] text-white/50">
              Create a new file in your components folder:
            </p>
            <pre className="font-mono text-xs bg-black/60 p-2 rounded text-white/80 select-all">
              src/components/FarmPasscodeLogin.tsx
            </pre>
          </div>

          {/* Step 3 */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-xs font-medium text-white">
              <span>3. Import and Render</span>
              <span className="text-[10px] font-mono text-white/40">Usage</span>
            </div>
            <pre className="font-mono text-xs bg-black/60 p-2 rounded text-emerald-200 select-all overflow-x-auto">
{`import { FarmPasscodeLogin } from './components/FarmPasscodeLogin';

export default function LoginPage() {
  return (
    <FarmPasscodeLogin
      farmName="SOLUM AGRONOMICS"
      stationName="Field Terminal 04"
      onUnlock={(op) => console.log('Welcome', op.name)}
    />
  );
}`}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
          <span>Works with Vite, Next.js, Remix, and Create React App</span>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
