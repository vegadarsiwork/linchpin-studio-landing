type LinchpinLogoProps = {
  className?: string;
  title?: string;
};

export default function LinchpinLogo({ className, title = "Linchpin Studio" }: LinchpinLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={title}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 8h21v57h49v21H37l-15 14V8Zm22 52a12 12 0 1 0 0 24 12 12 0 0 0 0-24Z"
      />
    </svg>
  );
}
