import '@/styles/category.css';

interface CategoryContentProps {
  content: string;
}

export default function CategoryContent({ content }: CategoryContentProps) {
  return (
    <section className="show-more__container">
      <div className="show-more__wrapper">
        <div className="show-more__content">
          <section data-role="wysiwyg">
            <div
              className="charticle__wysiwyg"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </section>
        </div>
      </div>
    </section>
  );
}
