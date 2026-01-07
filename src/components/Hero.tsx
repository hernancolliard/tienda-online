import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center text-center text-white">
      {/* Background Image */}
      <Image
        src="/imagen-general.png"
        alt="Lookbook de indumentaria urbana"
        fill
        className="object-cover"
        priority // Pre-load the LCP image
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 p-4">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-down">
          Indumentaria urbana de calidad
        </h1>
        <p className="text-lg md:text-xl mb-8 animate-fade-in-up">
          Envíos a todo el país
        </p>
        <Link 
          href="/#productos-destacados" // Link to a section on the page for now
          className="bg-orange text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-mango transition duration-300 ease-in-out transform hover:scale-105"
        >
          Ver Colección
        </Link>
      </div>
    </section>
  );
};

export default Hero;
