import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: number;
  name: string;
  image_url: string; // Assuming this field will be added
}

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link href={`/category/${category.id}`} className="relative aspect-video w-full overflow-hidden group rounded-lg shadow-lg">
      <Image
        src={category.image_url}
        alt={`Categoría ${category.name}`}
        fill
        className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <h3 className="text-2xl font-bold text-white uppercase tracking-wider">
          {category.name}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
