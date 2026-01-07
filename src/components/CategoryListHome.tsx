import CategoryCard from './CategoryCard';

// Mock data until the API is updated
const mockCategories = [
  { id: 1, name: 'Remeras', image_url: '/imagen-general.png' },
  { id: 2, name: 'Pantalones', image_url: '/imagen-general.png' },
  { id: 3, name: 'Buzos', image_url: '/imagen-general.png' },
  { id: 4, name: 'Accesorios', image_url: '/imagen-general.png' },
];

async function getCategories() {
  // TODO: Replace with actual API call when ready
  // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`);
  // if (!res.ok) {
  //   throw new Error('Failed to fetch categories');
  // }
  // return res.json();
  return mockCategories;
}


const CategoryListHome = async () => {
  const categories = await getCategories();

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
