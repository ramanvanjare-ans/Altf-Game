function GameIcon({ name, className }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <use href={`/icons.svg#${name || "Gamepad2"}`} />
    </svg>
  );
}
