interface BestOfItem {
  name: string;
  href: string;
  description: string;
}

interface BestOfListProps {
  title: string;
  items: BestOfItem[];
}

export default function BestOfList({ title, items }: BestOfListProps) {
  return (
    <div className="charticle-best-for">
      <div data-testid="best-of-products" className="css-s6uv9c">
        <h2 className="css-7uwpve">{title}</h2>
        <ul className="css-c8art6">
          {items.map((item, index) => (
            <li key={index}>
              <a
                data-testid="link"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                data-product-name={item.name}
                className="nilink css-1mqsdc6"
              >
                {item.name}
              </a>
              {' - '}
              {item.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
