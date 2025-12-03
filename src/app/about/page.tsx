import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-primary-text">
        Quiénes Somos
      </h1>
      <div className="space-y-4 text-lg text-primary-text">
        <p>
          Bienvenido a Tu Tienda Online, tu destino número uno para encontrar productos increíbles. Nos dedicamos a ofrecerte lo mejor de lo mejor, con un enfoque en la calidad, el servicio al cliente y la unicidad.
        </p>
        <p>
          Fundada en {new Date().getFullYear()}, hemos recorrido un largo camino desde nuestros comienzos. Cuando empezamos, nuestra pasión por la tecnología y los productos innovadores nos impulsó a iniciar nuestro propio negocio.
        </p>
        <p>
          Esperamos que disfrutes de nuestros productos tanto como nosotros disfrutamos ofreciéndotelos. Si tienes alguna pregunta o comentario, no dudes en contactarnos.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
