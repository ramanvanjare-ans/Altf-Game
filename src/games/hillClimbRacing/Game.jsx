export default function HillClimbRacing() {
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
        id="iframehtml5"
        title="Hill Climb Racing"
        src="https://azgames.io/hill-climb-race.embed"
        allow="autoplay; fullscreen; accelerometer; gyroscope; magnetometer"
        allowFullScreen
        scrolling="no"
        style={{
          width: "100%",
          height: "100%",
          minHeight: "600px",
          border: "none",
          borderRadius: "12px",
          display: "block",
        }}
      />
    </div>
  );
}