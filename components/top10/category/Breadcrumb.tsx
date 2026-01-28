import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header__left">
          <div className="page-header__breadcrumb-offset">
            <ul className="breadcrumb">
              {items.map((item, index) => (
                <li key={index} title={item.label}>
                  {item.href ? (
                    <Link href={item.href} data-role="breadcrumb-link">
                      {item.label}
                    </Link>
                  ) : (
                    <span data-role="breadcrumb-link">{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
