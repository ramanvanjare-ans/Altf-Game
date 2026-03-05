export default function Header() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* PAGE TITLE */}
      <header className="text-center mb-8">
        <h1 className="heading">
          Identify Any Plant Instantly
          <br />
          {/* <span className="text-(--foreground) text-2xl sm:text-3xl">
            Converter
          </span> */}
        </h1>
        <p className="description text-center mt-2 text-lg">
          Upload a picture and let our AI tell you everything about your plant —{" "}
          <br />
          <span> its name, care instructions, and more.</span>
        </p>
      </header>
    </div>
  );
}
