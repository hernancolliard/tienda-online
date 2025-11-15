import Link from 'next/link';
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    { href: 'https://instagram.com', icon: FaInstagram },
    { href: 'https://facebook.com', icon: FaFacebook },
    { href: 'https://whatsapp.com', icon: FaWhatsapp },
  ];

  const pageLinks = [
    { href: '/about', text: 'Quiénes Somos' },
    { href: '/privacy', text: 'Política de Privacidad' },
  ];

  return (
    <footer style={{ backgroundColor: '#003049', color: '#EAE2B7' }} className="py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-center">
          
          <div className="mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} Tu Tienda Online. Todos los derechos reservados.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
            {pageLinks.map((link, index) => (
              <Link key={index} href={link.href} className="hover:text-[#F77F00] transition-colors duration-300 px-4 py-2">
                {link.text}
              </Link>
            ))}
          </div>

          <div className="flex space-x-6">
            {socialLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#F77F00] transition-colors duration-300"
                aria-label={link.href}
              >
                <link.icon size={24} />
              </a>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
