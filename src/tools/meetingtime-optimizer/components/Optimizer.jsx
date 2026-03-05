"use client";

import { useState } from "react";

const timezones = Intl.supportedValuesOf("timeZone");

// ✅ CORRECT UTC CONVERSION
function getUTCMinutes(time, timezone) {
  const [hh, mm] = time.split(":").map(Number);

  const date = new Date();

  const zoned = new Date(
    date.toLocaleString("en-US", { timeZone: timezone })
  );

  zoned.setHours(hh, mm, 0, 0);

  const utcMs = zoned.getTime() - zoned.getTimezoneOffset() * 60000;
  const utc = new Date(utcMs);

  return utc.getUTCHours() * 60 + utc.getUTCMinutes();
}

export default function Optimizer() {
  const [participants, setParticipants] = useState([
    { name: "", timezone: "", start: "09:00", end: "17:00" },
  ]);

  const [result, setResult] = useState("");

  const update = (i, key, value) => {
    const copy = [...participants];
    copy[i][key] = value;
    setParticipants(copy);
  };

  const addParticipant = () => {
    setParticipants([
      ...participants,
      { name: "", timezone: "", start: "09:00", end: "17:00" },
    ]);
  };

  const calculate = () => {
    if (participants.some((p) => !p.timezone)) {
      setResult("❌ Please select all timezones");
      return;
    }

    let globalStart = 0;
    let globalEnd = 1440;

    for (const p of participants) {
      let start = getUTCMinutes(p.start, p.timezone);
      let end = getUTCMinutes(p.end, p.timezone);

      if (end <= start) end += 1440;

      globalStart = Math.max(globalStart, start);
      globalEnd = Math.min(globalEnd, end);
    }

    if (globalStart >= globalEnd) {
      setResult("❌ No common overlapping time found");
      return;
    }

    const h = Math.floor(globalStart / 60) % 24;
    const m = globalStart % 60;

    setResult(
      `✅ Best Meeting Time (UTC): ${String(h).padStart(
        2,
        "0"
      )}:${String(m).padStart(2, "0")}`
    );
  };

  return (
    <section className="w-full bg-(--background) text-(--foreground) pb-20 px-6 " id="optimizer">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="heading text-(--foreground) md:text-5xl mb-4">Meeting Time Optimizer</h2>
          <p className="description">
            Find the best overlapping meeting time for global teams instantly.
          </p>
        </div>

        {/* Participants */}
        <div className="space-y-6">
          {participants.map((p, i) => (
            <div
              key={i}
              className="
                bg-(--card)
                border border-(--border)
                rounded-2xl
                p-6
                grid
                grid-cols-1 md:grid-cols-4
                gap-4
              "
            >
              {/* Name */}
              <input
                placeholder="Name"
                value={p.name}
                onChange={(e) => update(i, "name", e.target.value)}
                className="
                  px-4 py-2 rounded-xl
                  bg-(--background)
                  border border-(--border)
                  focus:outline-none
                  focus:ring-2 focus:ring-(--primary)
                "
              />

              {/* Timezone */}
              <select
                value={p.timezone}
                onChange={(e) => update(i, "timezone", e.target.value)}
                className="
                  px-4 py-2 rounded-xl
                  bg-(--background)
                  border border-(--border)
                  focus:outline-none
                  focus:ring-2 focus:ring-(--primary)
                "
              >
                <option value="">Select Timezone</option>
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>

              {/* Start */}
              <input
                type="time"
                value={p.start}
                onChange={(e) => update(i, "start", e.target.value)}
                className="
                  px-4 py-2 rounded-xl
                  bg-(--background)
                  border border-(--border)
                  focus:outline-none
                  focus:ring-2 focus:ring-(--primary)
                "
              />

              {/* End */}
              <input
                type="time"
                value={p.end}
                onChange={(e) => update(i, "end", e.target.value)}
                className="
                  px-4 py-2 rounded-xl
                  bg-(--background)
                  border border-(--border)
                  focus:outline-none
                  focus:ring-2 focus:ring-(--primary)
                "
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={addParticipant}
            className="
              flex-1
              px-6 py-3
              rounded-xl
              border border-(--border)
              bg-(--card)
              hover:bg-(--muted)
              transition
            "
          >
            + Add Participant
          </button>

          <button
            onClick={calculate}
            className="
              flex-1
              px-6 py-3
              rounded-xl
              bg-(--primary)
              text-(--primary-foreground)
              font-semibold
              hover:opacity-90
              transition
            "
          >
            Find Best Time
          </button>
        </div>

        {/* Result */}
        {result && (
          <div
            className="
              mt-10
              p-6
              rounded-2xl
              text-center
              font-semibold
              bg-(--card)
              border border-(--border)
              text-(--foreground)
            "
          >
            {result}
          </div>
        )}
      </div>
    </section>
  );
}
