export default function Header() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* PAGE TITLE */}
      <header className="text-center mb-8">
        <h2 className="heading">Astro Rashi Finder </h2>
        <p className="text-center description ">
          Find your rashi instantly based on date of birth.
        </p>
      </header>
    </div>
  );
}
