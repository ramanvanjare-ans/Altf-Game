export default function EscapeRoad() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "600px",
        position: "relative",
        touchAction: "none",
      }}
    >
      <iframe
        src="https://templerun-2.io/escape-road-city-2.embed"
        title="escaperoad"
        allow="autoplay; fullscreen; accelerometer; gyroscope; magnetometer"
        allowFullScreen
        style={{
          width: "100%",
          height: "100%",
          minHeight: "600px",
          border: "none",
          borderRadius: "12px"
        }}
      />
    </div>
  );
}