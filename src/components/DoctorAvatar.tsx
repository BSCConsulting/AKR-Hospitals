interface DoctorAvatarProps {
  name: string;
  photo?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { className: 'w-10 h-10 text-sm', px: 40 },
  md: { className: 'w-14 h-14 text-base', px: 56 },
  lg: { className: 'w-16 h-16 text-lg', px: 64 },
} as const;

/** Real photo when we have one, otherwise initials — never a generated face. */
export default function DoctorAvatar({ name, photo, className = '', size = 'md' }: DoctorAvatarProps) {
  const dim = sizeMap[size];
  const initials = name
    .replace(/^Dr\.\s*/i, '')
    .split(/\s+/)
    .filter((part) => part.length > 1)
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className={`relative ${dim.className} rounded-full overflow-hidden bg-gradient-to-br from-teal-50 to-sky-100 border-2 border-white shadow-md shadow-slate-900/5 ring-1 ring-slate-200/80 shrink-0 flex items-center justify-center font-bold text-teal-800 ${className}`}
      aria-hidden
    >
      {photo ? (
        <img
          src={photo}
          alt=""
          width={dim.px}
          height={dim.px}
          className="w-full h-full object-cover object-top"
          loading="lazy"
          decoding="async"
        />
      ) : (
        initials
      )}
    </div>
  );
}
