import { StarIcon } from '@heroicons/react/24/solid';

interface Testimonial {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/testimonials`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      return []; // Don't throw, just return empty
    }
    return res.json();
  } catch (error) {
    console.error('FETCH_TESTIMONIALS_ERROR:', error);
    return [];
  }
}

const Testimonials = async () => {
  const testimonials = await getTestimonials();

  if (testimonials.length === 0) {
    return null; // Don't render if no testimonials
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-primary-text">
          Lo que dicen nuestros clientes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col">
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4 flex-grow">"{testimonial.comment}"</p>
              <p className="font-bold text-right text-primary-text">- {testimonial.user_name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
