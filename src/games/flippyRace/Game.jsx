export default function flippyrace() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "600px",
        backgroundColor: "#000",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <iframe
        src="https://templerun-2.io/flippy-race.embed"
        title="Hyper Cube Challenge"
        width="100%"
        height="100%"
        allow="autoplay; fullscreen"
        allowFullScreen
        style={{
          border: "none",
          width: "100%",
          height: "100%",
          minHeight: "600px",
        }}
      />
    </div>
  );
}