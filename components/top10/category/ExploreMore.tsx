import Link from 'next/link';

interface ExploreItem {
  title: string;
  href: string;
}

interface ExploreMoreProps {
  title: string;
  items: ExploreItem[];
}

export default function ExploreMore({ title, items }: ExploreMoreProps) {
  return (
    <section className="charticle__explore-more under-wysiwyg">
      <div className="css-1ej1u3r">
        <h3 className="css-explore-title">{title}</h3>
        <div className="css-explore-grid">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="css-explore-item"
            >
              <span className="css-explore-item-title">{item.title}</span>
              <span className="css-explore-item-cta">Explore</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
