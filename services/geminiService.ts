
import { GoogleGenAI, Modality } from "@google/genai";
import { decode, decodeAudioData } from "../utils/audioUtils";
import { AIVoiceName } from "../types";

// Initialize AI client only when needed to ensure API key presence
const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing");
    throw new Error("API Key not found");
  }
  // Create a new instance right before use to ensure it uses the most up-to-date key from process.env
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Map internal names to API supported prebuilt voices
const getApiVoiceName = (voiceName: AIVoiceName): string => {
  const supported = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'];
  if (voiceName === AIVoiceName.CUSTOM) return 'Zephyr';
  if (supported.includes(voiceName)) return voiceName;
  
  // For new expansion voices, we map them to variety for now 
  // until they are fully natively supported by the specific prebuilt API
  const mapping: Record<string, string> = {
    [AIVoiceName.Aura]: 'Kore',
    [AIVoiceName.Luna]: 'Puck',
    [AIVoiceName.Terra]: 'Charon',
    [AIVoiceName.Nova]: 'Fenrir',
    [AIVoiceName.Eos]: 'Zephyr'
  };
  return mapping[voiceName] || 'Kore';
};

export const generateSpeech = async (
  text: string, 
  voiceName: AIVoiceName = AIVoiceName.Kore,
  speakingRate: number = 1.0,
  pitch: number = 0
): Promise<string> => {
  try {
    const ai = getAiClient();
    const apiVoiceName = getApiVoiceName(voiceName);

    const promptText = `Přečti nahlas: ${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: promptText }] }], 
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: apiVoiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      console.error("Gemini TTS response did not contain audio data. Response state:", response.candidates?.[0]?.finishReason);
      throw new Error("No audio data received from Gemini.");
    }

    // Audio Playback Logic for instant feedback
    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const outputNode = outputAudioContext.createGain();
    
    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      outputAudioContext,
      24000,
      1,
    );

    const source = outputAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    
    // Apply speed settings to the source node
    source.playbackRate.value = speakingRate;
    
    source.connect(outputNode);
    outputNode.connect(outputAudioContext.destination);
    source.start();

    return base64Audio;

  } catch (error: any) {
    console.error("Error generating speech:", error);
    throw error;
  }
};
