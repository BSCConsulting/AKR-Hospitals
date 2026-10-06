import { UserRound } from 'lucide-react';

interface DoctorAvatarProps {
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-16 h-16',
};

/** Professional portrait placeholder with medical-neutral styling. */
export default function DoctorAvatar({ name, className = '', size = 'md' }: DoctorAvatarProps) {
  const seed = encodeURIComponent(name.replace(/^Dr\.\s*/i, ''));
  const src = `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=ccfbf1,e0f2fe&radius=50`;

  return (
    <div
      className={`relative ${sizeMap[size]} rounded-full overflow-hidden bg-gradient-to-br from-teal-50 to-sky-50 border-2 border-white shadow-md shadow-slate-900/5 ring-1 ring-slate-200/80 ${className}`}
    >
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.classList.remove('hidden');
        }}
      />
      <div className="hidden absolute inset-0 flex items-center justify-center bg-teal-50 text-teal-700">
        <UserRound className="w-1/2 h-1/2" strokeWidth={1.5} />
      </div>
    </div>
  );
}
