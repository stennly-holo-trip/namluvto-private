
import React, { useState, useRef, useEffect } from 'react';
import { generateSpeech } from '../services/geminiService';
import { AIVoiceName } from '../types';
import { decode, decodeAudioData } from '../utils/audioUtils';
import { Wand2, Play, Pause, Loader2, AlertCircle, Check, Mic, FastForward, Music, RotateCcw, Volume2, Zap, Download, Key, SlidersHorizontal, ShieldCheck, AlertTriangle, ExternalLink, Info, RefreshCw, AudioLines } from 'lucide-react';

export const AIStudio: React.FC = () => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<AIVoiceName>(AIVoiceName.Kore);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isQuotaExhausted, setIsQuotaExhausted] = useState(false);
  const [hasCustomKey, setHasCustomKey] = useState(false);
  
  // Audio Player State
  const [lastAudioBase64, setLastAudioBase64] = useState<string | null>(null);
  const [isReplaying, setIsReplaying] = useState(false);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Voice Settings State
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0);
  
  // Voice Cloning & Visualizer State
  const [isRecording, setIsRecording] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isReviewPlaying, setIsReviewPlaying] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const [cloningProgress, setCloningProgress] = useState(0);
  const [customVoiceReady, setCustomVoiceReady] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [freqData, setFreqData] = useState<Uint8Array>(new Uint8Array(32).fill(0));
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const reviewAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Initial check for API Key
  useEffect(() => {
    checkKeyStatus();
  }, []);

  const checkKeyStatus = async () => {
    if (typeof (window as any).aistudio?.hasSelectedApiKey === 'function') {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      setHasCustomKey(hasKey);
    }
  };

  const handleOpenKeyDialog = async () => {
    try {
      if (typeof (window as any).aistudio?.openSelectKey === 'function') {
        await (window as any).aistudio.openSelectKey();
        setHasCustomKey(true);
        setIsQuotaExhausted(false);
        setError(null);
      }
    } catch (err) {
      console.error("Failed to open key selection dialog", err);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (activeSourceRef.current) activeSourceRef.current.stop();
      if (audioCtxRef.current) audioCtxRef.current.close();
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
    };
  }, [recordedAudioUrl]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => {
            if (prev >= 10) {
                handleStopRecording();
                return 10;
            }
            return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
  }, [isRecording]);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    
    if (activeSourceRef.current) {
        activeSourceRef.current.stop();
        setIsReplaying(false);
    }

    setIsLoading(true);
    setError(null);
    setIsQuotaExhausted(false);
    setLastAudioBase64(null);

    try {
      const audioData = await generateSpeech(text, selectedVoice, speed, pitch);
      setLastAudioBase64(audioData);
    } catch (err: any) {
      console.error("Generation error caught in component:", err);
      const errorMessage = err.message?.toLowerCase() || "";
      if (errorMessage.includes("requested entity was not found")) {
        setHasCustomKey(false);
        setError("Váš vybraný projekt nebo API klíč již neexistuje. Vyberte prosím klíč znovu.");
        return;
      }
      const isQuotaError = errorMessage.includes("quota") || errorMessage.includes("429") || errorMessage.includes("resource_exhausted") || errorMessage.includes("limit");
      if (isQuotaError) {
        setIsQuotaExhausted(true);
        setError("Bezplatná kvóta byla vyčerpána. Pro další generování použijte vlastní API klíč.");
      } else if (errorMessage.includes("key") || errorMessage.includes("api")) {
        setHasCustomKey(false);
        setError("Problém s API klíčem. Zkontrolujte prosím své nastavení.");
      } else {
        setError("Nepodařilo se vygenerovat hlas. Zkontrolujte připojení nebo zkuste vlastní API klíč.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplay = async () => {
    if (!lastAudioBase64) return;
    if (isReplaying && activeSourceRef.current) {
        activeSourceRef.current.stop();
        setIsReplaying(false);
        return;
    }
    try {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        if (audioCtxRef.current.state === 'suspended') await audioCtxRef.current.resume();
        const buffer = await decodeAudioData(decode(lastAudioBase64), audioCtxRef.current, 24000, 1);
        const source = audioCtxRef.current.createBufferSource();
        source.buffer = buffer;
        source.playbackRate.value = speed;
        source.connect(audioCtxRef.current.destination);
        source.onended = () => setIsReplaying(false);
        activeSourceRef.current = source;
        setIsReplaying(true);
        source.start();
    } catch (err) {
        console.error("Replay error:", err);
        setIsReplaying(false);
    }
  };

  const downloadWav = () => {
    if (!lastAudioBase64) return;
    const rawData = decode(lastAudioBase64);
    const buffer = new ArrayBuffer(44 + rawData.length);
    const view = new DataView(buffer);
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
    };
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + rawData.length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); 
    view.setUint16(22, 1, true); 
    view.setUint32(24, 24000, true); 
    view.setUint32(28, 24000 * 2, true); 
    view.setUint16(32, 2, true); 
    view.setUint16(34, 16, true); 
    writeString(36, 'data');
    view.setUint32(40, rawData.length, true);
    new Uint8Array(buffer, 44).set(rawData);
    const blob = new Blob([buffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `namluvto_${selectedVoice.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.wav`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStartRecording = async () => {
    setError(null);
    setRecordedAudioUrl(null);
    setIsReviewing(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContext.state === 'suspended') await audioContext.resume();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64; 
      source.connect(analyser);
      analyserRef.current = analyser;
      const updateLevel = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        setFreqData(new Uint8Array(dataArray));
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        setIsRecording(false);
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
        setIsReviewing(true);
        stream.getTracks().forEach(t => t.stop());
        if (audioContext.state !== 'closed') audioContext.close();
      };
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone error:", err);
      setError("Mikrofon není dostupný. Pro klonování hlasu je vyžadován přístup k mikrofonu.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) mediaRecorderRef.current.stop();
  };

  const toggleReviewPlayback = () => {
    if (!reviewAudioRef.current) return;
    if (isReviewPlaying) {
      reviewAudioRef.current.pause();
    } else {
      reviewAudioRef.current.play();
    }
  };

  const handleConfirmCloning = () => {
    setIsReviewing(false);
    const totalBytes = audioChunksRef.current.reduce((acc, chunk) => acc + chunk.size, 0);
    if (totalBytes < 1000) {
      setError("Nahrávka nebyla úspěšná. Zkuste to prosím znovu a mluvte nahlas.");
      return;
    }
    startCloningProcess();
  };

  const startCloningProcess = () => {
    setIsCloning(true);
    setCloningProgress(0);
    const interval = setInterval(() => {
      setCloningProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCloning(false);
          setCustomVoiceReady(true);
          setSelectedVoice(AIVoiceName.CUSTOM);
          setSpeed(1.0);
          setPitch(0);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const resetSettings = () => {
    setSpeed(1.0);
    setPitch(0);
  };

  return (
    <section id="ai-studio" className="py-24 bg-tertiary text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-full h-full bg-red-gradient opacity-10 pointer-events-none"></div>
      <div className="absolute -top-48 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-white text-[10px] font-black mb-8 uppercase tracking-[0.2em]">
              <Zap size={14} className="text-primary" />
              Revolutionary AI Voice 2.5
            </div>
            <h2 className="text-5xl lg:text-7xl font-black mb-8 leading-[1.05]">
              Váš hlas v <br/>
              <span className="text-primary underline decoration-4 underline-offset-8">digitální</span> formě.
            </h2>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] mb-12 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${hasCustomKey ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            <Key size={20} />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-widest">Nastavení API</h3>
                    </div>
                    {hasCustomKey ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-[10px] font-black border border-green-500/30">
                            <ShieldCheck size={12} /> AKTIVNÍ KLÍČ
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-[10px] font-black border border-amber-500/30">
                            <Info size={12} /> LIMITOVANÝ TARIF
                        </span>
                    )}
                </div>
                
                <p className="text-xs text-gray-400 font-medium mb-6 leading-relaxed">
                    Pro neomezené generování a prioritní zpracování použijte svůj vlastní Gemini API klíč. 
                    Bez klíče využíváte sdílenou bezplatnou kvótu, která může být rychle vyčerpána.
                </p>

                <div className="flex flex-col gap-4">
                    <button 
                        onClick={handleOpenKeyDialog}
                        className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-3 group"
                    >
                        <Key size={18} className="group-hover:rotate-45 transition-transform" /> 
                        {hasCustomKey ? 'ZMĚNIT API KLÍČ' : 'NASTAVIT VLASTNÍ KLÍČ'}
                    </button>
                    
                    <a 
                        href="https://ai.google.dev/gemini-api/docs/billing" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] text-gray-500 hover:text-primary transition-colors flex items-center justify-center gap-1 font-bold uppercase tracking-widest"
                    >
                        Jak získat klíč a nastavit billing <ExternalLink size={10} />
                    </a>
                </div>
            </div>

            <div className="space-y-6">
                {[
                  { t: "Klonování hlasu", d: "Stačí 10 sekund vašeho hlasu pro dokonalou imitaci." },
                  { t: "Emoce a dynamika", d: "AI, která interpretuje text s lidským citem." },
                  { t: "Studiová kvalita", d: "Export do nekomprimovaného WAV formátu." }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Check size={14} strokeWidth={4} />
                    </div>
                    <div>
                      <p className="font-black text-lg">{item.t}</p>
                      <p className="text-sm text-gray-500 font-bold">{item.d}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] p-8 lg:p-12 text-tertiary">
            <div className="flex items-center justify-between mb-10">
                <h3 className="font-black text-3xl flex items-center gap-3">
                    <Wand2 className="text-primary" size={32} /> Studio
                </h3>
                <button onClick={resetSettings} className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:text-primary transition-all flex items-center gap-2" title="Resetovat nastavení">
                    <RotateCcw size={18} />
                    <span className="text-[10px] font-black uppercase hidden sm:block">Reset</span>
                </button>
            </div>

            <div className="space-y-8">
                <div>
                    <label className="block text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">Výběr interpreta</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
                        {Object.values(AIVoiceName).filter(v => v !== AIVoiceName.CUSTOM).map((voice) => (
                            <button
                                key={voice}
                                onClick={() => setSelectedVoice(voice)}
                                className={`py-3 px-1 rounded-xl text-[10px] font-black border-2 transition-all flex items-center justify-center gap-1 ${
                                    selectedVoice === voice 
                                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25 scale-[1.05]' 
                                    : 'bg-gray-50 border-transparent text-gray-400 hover:border-primary/20'
                                }`}
                            >
                                {voice}
                            </button>
                        ))}
                         <button
                            onClick={() => customVoiceReady && setSelectedVoice(AIVoiceName.CUSTOM)}
                            disabled={!customVoiceReady && !isCloning && !isRecording && !isReviewing}
                            className={`py-3 px-1 rounded-xl text-[10px] font-black border-2 transition-all flex items-center justify-center gap-1 disabled:opacity-30 ${
                                selectedVoice === AIVoiceName.CUSTOM 
                                ? 'bg-black border-black text-white shadow-lg scale-[1.05]' 
                                : 'bg-gray-100 border-transparent text-gray-400'
                            }`}
                        >
                            {customVoiceReady ? 'Můj klon' : 'Vlastní'}
                            {customVoiceReady && <Check size={10} strokeWidth={4} />}
                        </button>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-[32px] space-y-8 border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <SlidersHorizontal size={18} className="text-primary" />
                        <h4 className="text-xs font-black uppercase tracking-widest text-tertiary">Ladicí pult</h4>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <FastForward size={14} className="text-primary" /> Rychlost mluvy
                            </label>
                            <span className="text-xs font-black text-primary px-3 py-1 bg-white rounded-lg shadow-sm">{speed.toFixed(2)}x</span>
                        </div>
                        <div className="relative flex items-center">
                          <input 
                            type="range" 
                            min="0.5" 
                            max="2.0" 
                            step="0.05" 
                            value={speed} 
                            onChange={(e) => setSpeed(parseFloat(e.target.value))} 
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" 
                          />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Music size={14} className="text-primary" /> Výška tónu
                            </label>
                            <span className="text-xs font-black text-primary px-3 py-1 bg-white rounded-lg shadow-sm">{pitch > 0 ? `+${pitch}` : pitch}</span>
                        </div>
                        <div className="relative flex items-center">
                          <input 
                            type="range" 
                            min="-20" 
                            max="20" 
                            step="1" 
                            value={pitch} 
                            onChange={(e) => setPitch(parseInt(e.target.value))} 
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" 
                          />
                        </div>
                    </div>
                </div>

                <div className="relative">
                    {!customVoiceReady && !isCloning && !isRecording && !isReviewing ? (
                        <button 
                            onClick={handleStartRecording}
                            className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                        >
                            <Mic className="text-gray-300 group-hover:text-primary transition-colors" size={24} />
                            <span className="text-[10px] font-black text-gray-400 uppercase group-hover:text-primary">Klonovat vlastní hlas (10s)</span>
                        </button>
                    ) : (
                        <div className={`bg-gray-50 p-4 rounded-2xl border transition-all duration-300 ${isRecording ? 'border-primary/30 shadow-[0_0_20px_rgba(217,4,41,0.1)]' : 'border-gray-100'}`}>
                            {isRecording ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white relative z-10">
                                                <Mic size={20} className="animate-pulse" />
                                            </div>
                                            <div className="absolute inset-0 bg-primary/40 rounded-xl animate-ping opacity-20"></div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-end gap-[2px] mb-2 h-8">
                                                {Array.from({ length: 24 }).map((_, i) => {
                                                    const val = (freqData && freqData.length > 0) ? freqData[i % freqData.length] : 0;
                                                    const height = Math.max(15, (val / 255) * 100);
                                                    return (
                                                        <div 
                                                            key={i} 
                                                            className="flex-1 bg-primary rounded-full transition-all duration-75"
                                                            style={{ 
                                                                height: `${height}%`,
                                                                opacity: 0.2 + (val / 255) * 0.8
                                                            }}
                                                        ></div>
                                                    );
                                                })}
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-[8px] text-primary font-black uppercase tracking-widest">Analýza aktivní</p>
                                                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">ZBYVÁ {10 - recordingTime}S</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={handleStopRecording} className="ml-4 px-4 py-2 bg-tertiary text-white rounded-lg text-[10px] font-black hover:bg-black transition-all">STOP</button>
                                </div>
                            ) : isReviewing ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-tertiary rounded-xl flex items-center justify-center text-white">
                                                <AudioLines size={20} />
                                            </div>
                                            <div>
                                                <p className="font-black text-tertiary text-xs uppercase tracking-widest">Nahrávka připravena</p>
                                                <p className="text-[8px] text-gray-400 font-bold uppercase">Zkontrolujte kvalitu vzorku</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={toggleReviewPlayback}
                                            className="px-4 py-2 bg-white border border-gray-100 rounded-lg text-[10px] font-black text-tertiary hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-2"
                                        >
                                            {isReviewPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                                            {isReviewPlaying ? 'ZASTAVIT' : 'PŘEHRÁT UKÁZKU'}
                                        </button>
                                        <audio 
                                            ref={reviewAudioRef} 
                                            src={recordedAudioUrl || ''} 
                                            onPlay={() => setIsReviewPlaying(true)} 
                                            onPause={() => setIsReviewPlaying(false)}
                                            onEnded={() => setIsReviewPlaying(false)}
                                            className="hidden"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={handleConfirmCloning}
                                            className="flex-1 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary shadow-lg shadow-primary/20 transition-all"
                                        >
                                            Spustit klonování
                                        </button>
                                        <button 
                                            onClick={handleStartRecording}
                                            className="px-4 py-3 bg-gray-100 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-tertiary transition-all flex items-center gap-2"
                                        >
                                            <RefreshCw size={14} /> Nahrát znovu
                                        </button>
                                    </div>
                                </div>
                            ) : isCloning ? (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Loader2 size={16} className="text-primary animate-spin" />
                                            <p className="font-black text-tertiary text-[10px]">Modelování hlasu...</p>
                                        </div>
                                        <span className="text-[10px] font-black text-primary">{cloningProgress}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary transition-all duration-150" style={{ width: `${cloningProgress}%` }}></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white">
                                            <Check size={20} strokeWidth={4} />
                                        </div>
                                        <div>
                                            <p className="font-black text-tertiary text-xs">Hlas naklonován!</p>
                                            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Připraven k použití</p>
                                        </div>
                                    </div>
                                    <button onClick={() => {setCustomVoiceReady(false); setSelectedVoice(AIVoiceName.Kore);}} className="text-[10px] font-black text-gray-400 hover:text-red-500">Smazat</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Scénář pro namluvení</label>
                        <Volume2 size={16} className="text-gray-200" />
                    </div>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Sem vložte text, který má AI interpret namluvit..."
                        className="w-full h-32 p-5 rounded-[24px] bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all resize-none text-base font-medium placeholder:text-gray-300 leading-relaxed"
                    />
                </div>

                {error && (
                    <div className={`p-5 rounded-[32px] flex flex-col gap-4 border-2 font-bold animate-fade-in ${isQuotaExhausted ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                        <div className="flex items-center gap-3">
                          <AlertTriangle size={24} className="flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm leading-tight">{error}</p>
                          </div>
                        </div>
                        {isQuotaExhausted && (
                          <div className="pt-4 border-t border-amber-200/50 space-y-4">
                            <p className="text-[11px] font-medium opacity-90 leading-relaxed">
                              Bezplatná kvóta Google Gemini API byla vyčerpána. Pro další generování si prosím nastavte svůj vlastní API klíč z placeného projektu.
                            </p>
                            <button 
                                onClick={handleOpenKeyDialog}
                                className="w-full px-4 py-4 bg-amber-600 text-white rounded-2xl text-[10px] font-black flex items-center justify-center gap-3 hover:bg-amber-700 transition-all shadow-xl shadow-amber-600/20"
                            >
                                <Key size={16} /> NASTAVIT VLASTNÍ API KLÍČ
                            </button>
                          </div>
                        )}
                    </div>
                )}

                <div className="space-y-4">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !text || (selectedVoice === AIVoiceName.CUSTOM && !customVoiceReady)}
                        className="w-full py-5 bg-primary text-white rounded-[24px] font-black text-lg shadow-2xl shadow-primary/30 hover:bg-secondary hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 flex items-center justify-center gap-3"
                    >
                        {isLoading ? (
                            <><Loader2 className="animate-spin" size={24} /> GENEROVÁNÍ...</>
                        ) : (
                            <><Play fill="currentColor" size={24} /> GENEROVAT AUDIO</>
                        )}
                    </button>

                    {lastAudioBase64 && !isLoading && (
                        <div className="animate-fade-in bg-primary/5 border border-primary/10 rounded-[32px] p-5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-5 flex-1">
                                <button 
                                    onClick={handleReplay}
                                    className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-90 transition-all"
                                >
                                    {isReplaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="ml-1" />}
                                </button>
                                <div className="flex-1">
                                    <div className="flex items-end gap-1 mb-1.5">
                                        {[...Array(20)].map((_, i) => (
                                            <div 
                                                key={i} 
                                                className={`w-1 rounded-full transition-all duration-300 ${isReplaying ? 'bg-primary h-full animate-pulse' : 'bg-primary/20 h-1/3'}`}
                                                style={{ height: isReplaying ? `${20 + Math.random() * 80}%` : '8px', animationDelay: `${i * 0.05}s` }}
                                            ></div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Výsledek namluvení</p>
                                </div>
                            </div>
                            <button 
                                onClick={downloadWav}
                                className="flex flex-col items-center gap-1.5 p-3 text-gray-400 hover:text-primary transition-all group"
                                title="Stáhnout jako WAV"
                            >
                                <Download size={24} className="group-hover:translate-y-1 transition-transform" />
                                <span className="text-[9px] font-black uppercase tracking-widest">WAV</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #D90429;
          cursor: pointer;
          border: 4px solid white;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        }
        
        input[type=range]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #D90429;
          cursor: pointer;
          border: 4px solid white;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        }
      `}</style>
    </section>
  );
};
