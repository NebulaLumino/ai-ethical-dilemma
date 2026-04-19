'use client';
import { useState } from 'react';

const FRAMEWORKS = ['All Frameworks', 'Utilitarian', 'Deontological', 'Virtue Ethics', 'Care Ethics', 'Contractualism'];

const SAMPLE_DILEMMAS = [
  { id: 1, title: 'The Trolley Problem', scenario: 'A runaway trolley is heading toward five people tied to the tracks. You can pull a lever to divert it to a side track where there is only one person tied down. Do you pull the lever?' },
  { id: 2, title: 'The Doctor\'s Dilemma', scenario: 'A doctor has six patients who will die without organ transplants. A healthy patient comes in for a routine checkup. The doctor could harvest all six organs from the healthy patient to save the six dying patients. Should the doctor do it?' },
  { id: 3, title: 'AI in Hiring', scenario: 'Your company deploys an AI hiring tool that significantly reduces hiring bias but was trained on historical data from an industry with a history of discrimination. The AI works well, but its training data reflects past injustice.' },
  { id: 4, title: 'Whistleblower\'s Choice', scenario: 'You discover your company is illegally dumping waste in a protected wetland. Reporting it will cost 200 jobs but prevent ongoing environmental damage. Not reporting it keeps the jobs but allows continued harm.' },
];

export default function EthicalDilemma() {
  const [mode, setMode] = useState<'library' | 'custom'>('library');
  const [selectedDilemma, setSelectedDilemma] = useState<number | null>(null);
  const [customScenario, setCustomScenario] = useState('');
  const [framework, setFramework] = useState('All Frameworks');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (scenario: string) => {
    setLoading(true);
    setError('');
    setResult('');
    try {
      const prompt = `Analyze the following ethical dilemma through multiple moral frameworks:

DILEMMA: "${scenario}"
FRAMEWORK FOCUS: ${framework}

Provide a structured multi-framework analysis in this format:

## 📋 Dilemma Summary
[Brief restatement of the core ethical conflict]

## ⚖️ Framework Analysis

### Utilitarian Perspective
[What a utilitarian would prioritize — overall well-being, happiness, suffering reduction. What would they recommend and why? What are the hedonic/utility calculations?]

### Deontological Perspective
[What a deontologist would prioritize — duties, rights, rules, respect for persons. Which imperative would apply? What duties are at stake?]

### Virtue Ethics Perspective
[What a person of good character would do — what virtues (courage, honesty, compassion, justice) are in tension? What would the phronimos (practically wise person) do?]

### Care Ethics Perspective
[What relationships and responsibilities to specific people matter most. Who are the care-receivers? What does caring for them require in this situation?]

### Contractualism Perspective
[What principles could no rational person reject under conditions of fairness. What would contractors agree to? What does mutual justification require?]

## 🔄 Key Tension
[What core values are in conflict — this is not about finding the "right answer" but mapping the genuine moral conflict]

## 📖 Follow-Up: What Would Change the Recommendation?
[What facts or framings, if different, would lead different frameworks to change their conclusions]`;
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.result || 'No result returned.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🧭</span>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-teal-200 bg-clip-text text-transparent">
              Ethical Dilemma Analyzer
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Explore ethical dilemmas through multiple moral frameworks — understand how different values lead to different conclusions.
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-2 mb-6">
          {(['library', 'custom'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setResult(''); setSelectedDilemma(null); }}
              className={`px-5 py-2 rounded-lg font-medium text-sm capitalize transition-all ${mode === m ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
              {m === 'library' ? '📚 Dilemma Library' : '✍️ Custom Scenario'}
            </button>
          ))}
        </div>

        {/* Framework Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-1">Moral Framework</label>
          <select value={framework} onChange={e => setFramework(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-teal-500 focus:outline-none max-w-sm">
            {FRAMEWORKS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {mode === 'library' ? (
          <div className="space-y-4 mb-8">
            {SAMPLE_DILEMMAS.map(d => (
              <div key={d.id}
                className={`bg-gray-800/60 border rounded-xl p-5 cursor-pointer transition-all ${selectedDilemma === d.id ? 'border-teal-500' : 'border-gray-700 hover:border-teal-400'}`}
                onClick={() => { setSelectedDilemma(d.id); setCustomScenario(d.scenario); }}
              >
                <h3 className="text-lg font-bold text-teal-300 mb-2">{d.title}</h3>
                <p className="text-gray-400 text-sm">{d.scenario}</p>
              </div>
            ))}
            {selectedDilemma && (
              <button onClick={() => handleAnalyze(SAMPLE_DILEMMAS.find(d => d.id === selectedDilemma)!.scenario)}
                disabled={loading} className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 disabled:from-gray-700 text-white font-semibold py-3 rounded-xl transition-all disabled:cursor-not-allowed">
                {loading ? 'Analyzing through frameworks...' : 'Analyze This Dilemma'}
              </button>
            )}
          </div>
        ) : (
          <div>
            <textarea value={customScenario} onChange={e => setCustomScenario(e.target.value)}
              placeholder="Describe a real ethical situation you're facing or one you've imagined..."
              rows={5} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none resize-none mb-4" />
            <button onClick={() => handleAnalyze(customScenario)} disabled={loading || !customScenario.trim()}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 disabled:from-gray-700 text-white font-semibold py-3 rounded-xl transition-all disabled:cursor-not-allowed">
              {loading ? 'Analyzing through frameworks...' : 'Analyze Custom Scenario'}
            </button>
          </div>
        )}

        {error && <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6 text-red-300 text-sm">{error}</div>}

        {result && (
          <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6">
            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
