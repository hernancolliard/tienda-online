import Image from 'next/image';
import Link from 'next/link';

const AboutBrand = () => {
  return (
    <section className="bg-component-bg py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-primary-text">
            <h2 className="text-3xl font-bold mb-4">Nuestra Esencia</h2>
            <p className="mb-4">
              Nacimos de la cultura urbana, para la gente que vive la calle. Cada una de nuestras prendas está diseñada para ofrecerte comodidad y estilo sin sacrificar la calidad. Somos más que una marca, somos una comunidad.
            </p>
            <p className="mb-6">
              Creemos en la autoexpresión y en el poder de la ropa para contar tu historia. Por eso, nos enfocamos en diseños únicos y materiales duraderos que te acompañen en tu día a día.
            </p>
            <Link 
              href="/about" 
              className="bg-primary-text text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition duration-300"
            >
              Conocer Más
            </Link>
          </div>
          <div className="relative h-80 rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/imagen-general.png"
              alt="Sobre la marca"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutBrand;
