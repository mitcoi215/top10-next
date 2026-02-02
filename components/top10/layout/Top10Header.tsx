import Link from 'next/link';
import Image from 'next/image';

export default function Top10Header() {
  return (
    <div className="ni-ilfvkp">
      <Link href="/" className="ni-e2qfj">
        <Image
          src="/logo.png"
          alt="10rating"
          width={133}
          height={35}
          className="ni-1gvhhas"
          priority
        />
        <div>
          Rating
        </div>
      </Link>
    </div>
  );
}
