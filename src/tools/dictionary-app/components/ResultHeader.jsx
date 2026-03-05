export default function ResultHeader({ word, onSpeak }) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <h2 className="text-3xl font-bold">{word}</h2>
      <button onClick={() => onSpeak(word)} className="cursor-pointer">🔊 Listen</button>
    </div>
  );
}
