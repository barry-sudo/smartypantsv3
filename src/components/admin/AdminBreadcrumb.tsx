import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function AdminBreadcrumb({ items }: AdminBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-white mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <span className="mx-2 text-white/50">/</span>}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-orange transition-colors font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white/70">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
