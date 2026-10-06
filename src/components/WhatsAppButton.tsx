import WhatsAppIcon from '@/components/WhatsAppIcon';

export const WHATSAPP_NUMBER = '919849057185';
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  'Hello AKR Hospital, I would like to inquire about OPD appointment and services.'
)}`;

interface WhatsAppButtonProps {
  variant?: 'floating' | 'inline';
  className?: string;
}

export default function WhatsAppButton({ variant = 'floating', className = '' }: WhatsAppButtonProps) {
  if (variant === 'inline') {
    return (
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 text-xs font-medium text-[#25D366] bg-[#25D366]/10 border border-[#25D366]/20 px-3 py-1.5 rounded-full hover:bg-[#25D366]/20 transition-colors ${className}`}
      >
        <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
        Chat on WhatsApp
      </a>
    );
  }

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[148px] right-4 md:bottom-[100px] md:right-6 z-40 group"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-[#25D366]/40 rounded-full blur-lg animate-pulse" />
        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] shadow-2xl shadow-[#25D366]/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          <WhatsAppIcon className="w-7 h-7 md:w-8 md:h-8 text-white" />
        </div>
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-white ring-2 ring-[#25D366] animate-pulse" />
      </div>
    </a>
  );
}
