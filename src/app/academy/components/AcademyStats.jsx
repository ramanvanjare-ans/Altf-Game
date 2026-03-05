export default function AcademyStats() {
  const stats = [
    { label: "Academies", value: "40+" },
    { label: "Categories", value: "12+" },
    { label: "Courses", value: "200k+" },
    { label: "Learners", value: "5M+" },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-(--border) bg-(--card) p-6 text-center"
        >
          <div className="text-2xl font-semibold">{s.value}</div>
          <div className="mt-1 text-sm text-(--muted-foreground)">{s.label}</div>
        </div>
      ))}
    </section>
  );
}
