/**
 * Web Speech API Utility for Native English Pronunciation
 */

export function speakEnglishWord(text: string): void {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.9; // Slightly slower for clear learning
  utterance.pitch = 1.0;

  // Try to pick an en-US voice if available
  const voices = window.speechSynthesis.getVoices();
  const enVoice = voices.find(
    (v) => v.lang.includes('en-US') || v.lang.includes('en_US') || v.lang.startsWith('en')
  );
  if (enVoice) {
    utterance.voice = enVoice;
  }

  window.speechSynthesis.speak(utterance);
}
