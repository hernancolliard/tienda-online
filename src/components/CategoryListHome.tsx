import CategoryCard from './CategoryCard';

interface Category {
  id: number;
  name: string;
  image_url: string;
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`/api/categories`, {
      cache: 'no-store', // Always fetch the latest
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
    }
    
    const categories: Category[] = await res.json();
    console.log('Fetched Categories:', categories); // Log fetched categories
    return categories;
  } catch (error) {
    console.error('FETCH_CATEGORIES_ERROR:', error);
    return [];
  }
}

const CategoryListHome = async () => {
  const categories = await getCategories();

  if (categories.length === 0) {
    return null; // Don't render if no categories
  }

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary-text">
          Nuestras Categorías
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryListHome;
