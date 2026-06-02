'use client';

interface DropdownProps {
  children: React.ReactNode;
  items: { label: string; href?: string; onClick?: () => void; icon?: string }[];
}

export default function Dropdown({ children, items }: DropdownProps) {
  return (
    <div className="relative group">
      <div className="text-slate-300 hover:text-sky-400 transition-colors">
        {children}
      </div>
      <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-2">
          {items.map((item, idx) => (
            item.href ? (
              <a
                key={idx}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </a>
            ) : (
              <button
                key={idx}
                onClick={item.onClick}
                className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </button>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
