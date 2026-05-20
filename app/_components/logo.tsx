type Props = {
  size?: number;
  className?: string;
  withWordmark?: boolean;
  wordmarkClassName?: string;
};

export function LogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="OneTime"
    >
      <defs>
        <linearGradient id="ot-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="40" height="40" rx="11" fill="url(#ot-grad)" />

      {/* Ring (open at top-right, like a time slot waiting to be filled) */}
      <path
        d="M 20 8
           A 12 12 0 1 0 32 20"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Dot marking the open slot */}
      <circle cx="32" cy="20" r="2.2" fill="white" />

      {/* Inner hour hand pointing up-right (10:10-ish friendly pose) */}
      <path
        d="M 20 20 L 20 13"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 20 20 L 25 23"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

export default function Logo({
  size = 36,
  className = "",
  withWordmark = true,
  wordmarkClassName = "font-bold text-lg tracking-tight",
}: Props) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={size} />
      {withWordmark && (
        <span className={wordmarkClassName}>
          One<span className="text-indigo-600">Time</span>
        </span>
      )}
    </span>
  );
}
