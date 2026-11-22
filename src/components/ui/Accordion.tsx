import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className = '' }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <div key={item.id} className="border border-surface-border rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
            className="w-full flex items-center justify-between p-3.5 bg-surface-raised hover:bg-surface-overlay transition text-left"
          >
            <span className="text-sm font-medium text-text-primary">{item.title}</span>
            <ChevronDown
              size={16}
              className={`text-text-muted transition-transform duration-200 ${
                openId === item.id ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openId === item.id && (
            <div className="px-3.5 pb-3.5 text-sm text-text-secondary bg-surface-base">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

