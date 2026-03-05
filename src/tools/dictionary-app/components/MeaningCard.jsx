export default function MeaningCard({ entry }) {
  return (
    <div className="p-4 bg-(--background) text-(--foreground) rounded-lg shadow mb-4 border border-(--border)">
      {entry.meanings.map((meaning, idx) => (
        <div key={idx}>
          <p className="font-semibold">{meaning.partOfSpeech}</p>
          {meaning.definitions.map((def, i) => (
            <p key={i}>{def.definition}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
