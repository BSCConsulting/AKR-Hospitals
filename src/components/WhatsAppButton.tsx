import WhatsAppIcon from '@/components/WhatsAppIcon';
import { WHATSAPP_OPD_INQUIRE } from '@/lib/whatsapp';

interface WhatsAppButtonProps {
  variant?: 'floating' | 'inline';
  className?: string;
  href?: string;
}

export default function WhatsAppButton({
  variant = 'floating',
  className = '',
  href = WHATSAPP_OPD_INQUIRE,
}: WhatsAppButtonProps) {
  if (variant === 'inline') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 text-xs font-medium text-[#0f7a6e] bg-[#128C7E]/10 border border-[#128C7E]/30 px-3 py-1.5 rounded-full hover:bg-[#128C7E]/15 transition-colors ${className}`}
      >
        <WhatsAppIcon className="w-3.5 h-3.5 text-[#128C7E]" />
        Chat on WhatsApp
      </a>
    );
  }

  // Floating variant is rendered via FloatingDock to avoid FAB collisions.
  return null;
}
