export default function NextBirthday({ data }) {
  if (!data) return null;

  return (
    <div className=" subheading bg-(--background) p-4 rounded-lg border text-(--secondary)">  
      <h3 className="font-semibold mb-3"> Next Birthday In</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center  ">
        {["days", "hours", "minutes", "seconds"].map((k) => (
          <div key={k} className="bg-(--background) text-(--secondary) rounded-sm shadow p-2 border border-(--border)">
            <div className="text-xl font-bold">{data[k]}</div>
            <div className="text-xs">{k}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
