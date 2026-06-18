'use client';

interface DropdownProps {
  children: React.ReactNode;
  items: { label: string; href?: string; onClick?: () => void; icon?: string }[];
}

export default function Dropdown({ children, items }: DropdownProps) {
  return (
    <div className="relative group">
      <div className="text-[#1a1a2e] hover:text-[#0071c2] transition-colors">
        {children}
      </div>
      <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-2">
          {items.map((item, idx) => (
            item.href ? (
              <a
                key={idx}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f2f6fc] hover:text-[#0071c2] transition-colors"
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </a>
            ) : (
              <button
                key={idx}
                onClick={item.onClick}
                className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f2f6fc] hover:text-[#0071c2] transition-colors"
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
