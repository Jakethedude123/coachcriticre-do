import Image from 'next/image';

export default function Logo({ className = '', ...props }) {
  return (
    <Image
      src="/images/logo_transparent.png"
      alt="CoachCritic Logo"
      width={160}
      height={48}
      className={className}
      priority
      {...props}
    />
  );
} 