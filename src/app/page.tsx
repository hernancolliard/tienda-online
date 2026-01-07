import ProductList from '@/components/ProductList';
import { db } from '@/lib/db';
import { Product } from '@/types/product';
import Hero from '@/components/Hero';
import CategoryListHome from '@/components/CategoryListHome';
import Benefits from '@/components/Benefits';
import NewArrivals from '@/components/NewArrivals';
import AboutBrand from '@/components/AboutBrand';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';
import InstagramFeed from '@/components/InstagramFeed'; // Import InstagramFeed

export const dynamic = 'force-dynamic'; // Force dynamic rendering for this page

// This is a Server Component, so we can fetch data directly.
async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { rows } = await db.query('SELECT * FROM products WHERE is_featured = true ORDER BY created_at DESC');
    return rows.map(product => ({
      ...product,
      price: parseFloat(product.price),
    }));
  } catch (error) {
    console.error('DATABASE_FETCH_ERROR (Featured):', error);
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <Hero />
      <CategoryListHome />
      
      <section id="productos-destacados" className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary-text">
            Productos Destacados
          </h2>
          <ProductList products={featuredProducts} />
        </div>
      </section>

      <Benefits />
      <NewArrivals />
      <AboutBrand />
      <Testimonials />
      <InstagramFeed /> {/* Add InstagramFeed here */}
      <Newsletter />
    </>
  );
}
