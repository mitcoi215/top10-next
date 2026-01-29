'use client';

import Link from 'next/link';

interface AuthorBioProps {
  name: string;
  avatar?: string;
  bio?: string;
  slug?: string;
}

export default function AuthorBio({ name, avatar, bio, slug }: AuthorBioProps) {
  const authorLink = slug ? `/authors/${slug}` : undefined;

  return (
    <div className="author-bio" data-testid="author-biography">
      <div className="author-header">
        <div
          className="author-avatar"
          style={{
            backgroundImage: avatar ? `url(${avatar})` : undefined,
          }}
        />
        <span className="author-label">Written by</span>
        {authorLink ? (
          <Link href={authorLink} className="author-name">
            {name}
          </Link>
        ) : (
          <span className="author-name">{name}</span>
        )}
      </div>
      {bio && <p className="author-bio-text">{bio}</p>}
      <style jsx>{`
        .author-bio {
          margin: 32px 0;
          padding: 24px;
          background-color: #f8f9fa;
          border-radius: 8px;
        }

        .author-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .author-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: #e5e7eb;
          background-size: cover;
          background-position: center;
          flex-shrink: 0;
        }

        .author-label {
          font-size: 14px;
          color: #6b7280;
        }

        .author-name {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          text-decoration: none;
        }

        .author-name:hover {
          color: #147dc2;
          text-decoration: underline;
        }

        .author-bio-text {
          font-size: 15px;
          line-height: 1.7;
          color: #4b5563;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
