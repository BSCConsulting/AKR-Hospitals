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

  // Floating variant is rendered via FloatingDock to avoid FAB collisions.
  return null;
}
