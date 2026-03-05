export default function EightBallPool() {
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
        title="8 Ball Pool"
        src="https://play.famobi.com/8ball-online/A-MINIJUEGOS"
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