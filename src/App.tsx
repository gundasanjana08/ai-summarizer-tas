import { useState, useRef, ChangeEvent } from 'react';
import { 
  FileText, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Trash2,
  Sparkles,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { summarizeText } from './services/geminiService';
import { SummaryResult } from './types';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSummarize = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const summary = await summarizeText(inputText);
      setResult(summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputText(content);
    };
    reader.readAsText(file);
  };

  const clearInput = () => {
    setInputText('');
    setResult(null);
    setError(null);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'negative': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-zinc-600 bg-zinc-50 border-zinc-100';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="w-full max-w-3xl mb-12 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center p-2 bg-zinc-900 rounded-2xl mb-6 shadow-xl"
        >
          <Sparkles className="w-6 h-6 text-emerald-400 mr-2" />
          <span className="text-white font-medium tracking-tight">TextSummarizer AI</span>
        </motion.div>
        <h1 className="text-4xl font-semibold text-zinc-900 tracking-tight mb-4">
          Unstructured Text to Structured Insight
        </h1>
        <p className="text-zinc-500 max-w-xl mx-auto">
          Paste your text or upload a file to extract a concise summary, key points, and sentiment analysis powered by Gemini 3 Flash.
        </p>
      </header>

      <main className="w-full max-w-3xl space-y-8">
        {/* Input Section */}
        <section className="glass rounded-3xl p-6 transition-all duration-300 focus-within:ring-2 focus-within:ring-zinc-900/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-zinc-600">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Input Text</span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors"
                title="Upload file"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button 
                onClick={clearInput}
                className="p-2 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Clear input"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept=".txt,.md,.json"
              />
            </div>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your unstructured text here..."
            className="w-full h-64 bg-transparent border-none focus:ring-0 text-zinc-800 placeholder:text-zinc-400 resize-none font-sans leading-relaxed"
          />

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSummarize}
              disabled={isLoading || !inputText.trim()}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-200
                ${isLoading || !inputText.trim() 
                  ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' 
                  : 'bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95 shadow-lg shadow-zinc-200'}
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Summarize</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start space-x-3 text-rose-700"
            >
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold">Analysis Failed</p>
                <p>{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Section */}
        <AnimatePresence>
          {result && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-2 text-zinc-900 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-semibold">Structured Summary</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Summary Card */}
                <div className="md:col-span-2 glass rounded-3xl p-6">
                  <div className="flex items-center space-x-2 text-zinc-500 mb-4">
                    <Info className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">One-Sentence Summary</span>
                  </div>
                  <p className="text-lg text-zinc-800 leading-relaxed font-medium">
                    {result.oneSentenceSummary}
                  </p>
                </div>

                {/* Sentiment Card */}
                <div className={`glass rounded-3xl p-6 border-2 ${getSentimentColor(result.sentiment).split(' ')[2]}`}>
                  <div className="flex items-center space-x-2 text-zinc-500 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider">Sentiment</span>
                  </div>
                  <div className={`inline-flex items-center px-4 py-2 rounded-xl border text-sm font-bold capitalize ${getSentimentColor(result.sentiment)}`}>
                    {result.sentiment}
                  </div>
                  {result.confidence && (
                    <div className="mt-4">
                      <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase mb-1">
                        <span>Confidence</span>
                        <span>{Math.round(result.confidence * 100)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-zinc-900 transition-all duration-1000" 
                          style={{ width: `${result.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Key Points Card */}
                <div className="md:col-span-3 glass rounded-3xl p-6">
                  <div className="flex items-center space-x-2 text-zinc-500 mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider">Key Points</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {result.keyPoints.map((point, idx) => (
                      <div key={idx} className="relative pl-8">
                        <span className="absolute left-0 top-0 text-3xl font-mono font-bold text-zinc-100 select-none">
                          0{idx + 1}
                        </span>
                        <p className="relative text-sm text-zinc-600 leading-relaxed">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 text-zinc-400 text-sm flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-4">
          <span className="px-2 py-1 bg-zinc-100 rounded text-[10px] font-bold uppercase tracking-widest">Gemini 3 Flash</span>
          <span className="px-2 py-1 bg-zinc-100 rounded text-[10px] font-bold uppercase tracking-widest">React 19</span>
          <span className="px-2 py-1 bg-zinc-100 rounded text-[10px] font-bold uppercase tracking-widest">Tailwind 4</span>
        </div>
        <p>© 2026 AI Developer Intern Task</p>
      </footer>
    </div>
  );
}
