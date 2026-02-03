import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Snowflake, Droplets, Syringe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { services } from '@/data/services';
import { getTopCities } from '@/data/cities';
import { Hero } from '@/components/Hero';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  Snowflake,
  Droplets,
  Syringe,
};

export default function HomePage() {
  const topCities = getTopCities(8);

  return (
    <div className="bg-background min-h-screen">
      {/* Immersive Hero */}
      <Hero
        title="L'excellence de la médecine esthétique"
        description="Trouvez, comparez et réservez les meilleurs soins esthétiques près de chez vous. Une sélection exclusive de praticiens vérifiés."
        stats={[
          { value: '10k+', label: 'Praticiens' },
          { value: '4.9/5', label: 'Note moyenne' },
          { value: '100%', label: 'Vérifiés' },
        ]}
      />

      {/* Services Section with Bento/Glass Design */}
      <section className="container py-24 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
            Nos expertises
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Des technologies de pointe pour des résultats naturels. Découvrez nos soins les plus demandés.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Sparkles;
            return (
              <Link key={service.id} href={`/${service.slug}`} className="group">
                <div className="glass-card h-full p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:border-primary/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Icon className="h-24 w-24 text-primary rotate-12 transform group-hover:scale-110 transition-transform duration-700" />
                  </div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-shadow duration-500">
                      <Icon className="h-8 w-8 text-white group-hover:text-primary transition-colors duration-300" />
                    </div>

                    <h3 className="font-heading text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-200 transition-colors">
                      {service.description}
                    </p>
                  </div>

                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Top Cities - Minimalist Pills */}
      <section className="py-24 relative overflow-hidden">
        {/* Background glow for this section */}
        <div className="absolute opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="container relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Villes populaires</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">
              Retrouvez l'excellence médicale partout en France.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {topCities.map((city) => (
              <Link
                key={city.slug}
                href={`/epilation-laser/${city.slug}`}
                className="group"
              >
                <div className="px-6 py-3 rounded-full glass border border-white/5 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 flex items-center space-x-2">
                  <span className="text-white/80 font-medium group-hover:text-white transition-colors">
                    {city.name}
                  </span>
                  <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Modern CTA */}
      <section className="container py-24">
        <div className="relative rounded-[2.5rem] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-900 opacity-90" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

          <div className="relative px-8 py-20 md:p-24 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Vous êtes professionnel de santé ?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              Rejoignez la première plateforme dédiée à la médecine esthétique premium.
              Visibilité, gestion de rdv, avis vérifiés.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button size="lg" className="h-14 px-8 rounded-full bg-white text-black hover:bg-zinc-100 font-bold text-lg shadow-xl shadow-black/20 hover:scale-105 transition-transform">
                Référencer mon centre
              </Button>
              <Button variant="link" className="text-white/70 hover:text-white">
                En savoir plus sur nos offres
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
