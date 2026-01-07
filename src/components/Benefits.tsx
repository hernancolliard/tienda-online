import { TruckIcon, CreditCardIcon, ArrowPathIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

const benefits = [
  {
    name: 'Envíos a todo el país',
    icon: TruckIcon,
  },
  {
    name: 'Pagos seguros',
    icon: CreditCardIcon,
  },
  {
    name: 'Cambios fáciles',
    icon: ArrowPathIcon,
  },
  {
    name: 'Calidad premium',
    icon: CheckBadgeIcon,
  },
];

const Benefits = () => {
  return (
    <section className="bg-component-bg py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {benefits.map((benefit) => (
            <div key={benefit.name} className="flex flex-col items-center">
              <benefit.icon className="h-10 w-10 text-primary-text mb-2" />
              <p className="text-sm font-semibold text-primary-text">{benefit.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
