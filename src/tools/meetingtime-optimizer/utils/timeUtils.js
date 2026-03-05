export function calculateOverlap(people) {
  let start = 0;
  let end = 1440;

  for (let p of people) {
    if (!p.start || !p.end) return "Fill all times";

    const s = toMinutes(p.start);
    const e = toMinutes(p.end);

    if (s >= e) return "Invalid time range";

    start = Math.max(start, s);
    end = Math.min(end, e);
  }

  if (start >= end) return "No overlapping time found";

  return `Best time: ${fromMinutes(start)} - ${fromMinutes(end)}`;
}

function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
