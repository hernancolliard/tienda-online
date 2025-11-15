import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-bold mb-6" style={{ color: '#003049' }}>
        Política de Privacidad
      </h1>
      <div className="space-y-4 text-gray-700">
        <p>
          En Tu Tienda Online, accesible desde tu-tienda.com, una de nuestras principales prioridades es la privacidad de nuestros visitantes. Este documento de Política de Privacidad contiene tipos de información que se recopilan y registran y cómo la usamos.
        </p>
        <h2 className="text-2xl font-semibold mt-6" style={{ color: '#D62828' }}>
          Archivos de Registro
        </h2>
        <p>
          Tu Tienda Online sigue un procedimiento estándar de uso de archivos de registro. Estos archivos registran a los visitantes cuando visitan sitios web. Todas las empresas de hosting hacen esto y forma parte del análisis de los servicios de hosting.
        </p>
        <h2 className="text-2xl font-semibold mt-6" style={{ color: '#D62828' }}>
          Cookies y Web Beacons
        </h2>
        <p>
          Como cualquier otro sitio web, Tu Tienda Online utiliza 'cookies'. Estas cookies se utilizan para almacenar información, incluidas las preferencias de los visitantes, y las páginas del sitio web a las que el visitante accedió o visitó.
        </p>
        <h2 className="text-2xl font-semibold mt-6" style={{ color: '#D62828' }}>
          Consentimiento
        </h2>
        <p>
          Al utilizar nuestro sitio web, por la presente das tu consentimiento a nuestra Política de Privacidad y aceptas sus términos.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
