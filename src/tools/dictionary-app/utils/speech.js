export const speakWord = (word) => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(word);
    speechSynthesis.speak(utterance);
  }
};
