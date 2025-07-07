export default function Logo({ className = '', ...props }) {
  return (
    <img
      src="/images/optimized/hilogo.png"
      alt="CoachCritic Logo"
      width={160}
      height={48}
      className={className}
      {...props}
    />
  );
} 