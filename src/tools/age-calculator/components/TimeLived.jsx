export default function TimeLived({ minutes, seconds }) {
  return (
    <div className="grid grid-cols-2 gap-4">
  {/* Minutes Card */}
  <div className="bg-(--background) p-4 rounded-lg border text-(--secondary) description ">
    <h3 className="font-semibold mb-2"> Alive in minutes</h3>
    <p className="text-2xl font-bold">
      {minutes.toLocaleString()} minutes
    </p>
  </div>

  {/* Seconds Card */}
  <div className="bg-(--background) p-4 rounded-lg border text-(--secondary) description ">
    <h3 className="font-semibold mb-2">Alive in seconds</h3>
    <p className="text-2xl font-bold">
      {seconds.toLocaleString()} seconds
    </p>
  </div>
</div>

  );
}
