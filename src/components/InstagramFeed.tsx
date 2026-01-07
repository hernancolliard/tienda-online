import Image from 'next/image';
import Link from 'next/link';

interface InstagramPost {
  id: number;
  image_url: string;
  caption: string | null;
  post_link: string | null;
  created_at: string;
}

async function getInstagramPosts(): Promise<InstagramPost[]> {
  try {
    const res = await fetch(`/api/instagram`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      return [];
    }
    return res.json();
  } catch (error) {
    console.error('FETCH_INSTAGRAM_POSTS_ERROR:', error);
    return [];
  }
}

const InstagramFeed = async () => {
  const posts = await getInstagramPosts();

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-primary-text">
          Síguenos en Instagram
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts.map((post) => (
            <Link href={post.post_link || '#'} key={post.id} target="_blank" rel="noopener noreferrer" className="relative aspect-square w-full overflow-hidden group">
              <Image
                src={post.image_url}
                alt={post.caption || 'Instagram post'}
                fill
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm text-center p-2 hidden sm:block">
                  {post.caption ? post.caption.substring(0, 50) + (post.caption.length > 50 ? '...' : '') : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link 
            href="https://www.instagram.com/tu_usuario_instagram" // TODO: Change to actual Instagram profile URL
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-orange text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-mango transition duration-300 ease-in-out transform hover:scale-105"
          >
            Ver más en Instagram
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
