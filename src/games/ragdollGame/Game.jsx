export default function Ragdoll() {
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
        src="https://azgames.io//ragdoll-flip.embed"
        title="ragdoll"
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