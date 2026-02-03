import Link from 'next/link';
import { MapPin, ArrowRight, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Service, City, NearbyCity } from '@/types';
import { formatDistance } from '@/lib/geo-utils';
import { services } from '@/data/services';

interface InternalLinkingProps {
    currentService: Service;
    currentCity: City;
    nearbyCities: NearbyCity[];
}

export function InternalLinking({
    currentService,
    currentCity,
    nearbyCities,
}: InternalLinkingProps) {
    // Get other services (cross-selling)
    const otherServices = services.filter((s) => s.id !== currentService.id);

    return (
        <div className="space-y-6">
            {/* Nearby Cities - Same Service */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        {currentService.name} à proximité
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {nearbyCities.slice(0, 10).map((city) => (
                        <Link
                            key={city.slug}
                            href={`/${currentService.slug}/${city.slug}`}
                            className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted transition-colors group"
                        >
                            <span className="text-sm font-medium group-hover:text-primary transition-colors">
                                {city.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {formatDistance(city.distance)}
                            </span>
                        </Link>
                    ))}
                </CardContent>
            </Card>

            {/* Cross-Selling - Other Services in Same City */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Layers className="h-4 w-4 text-primary" />
                        Autres soins à {currentCity.name}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {otherServices.map((service) => (
                        <Link
                            key={service.id}
                            href={`/${service.slug}/${currentCity.slug}`}
                            className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted transition-colors group"
                        >
                            <span className="text-sm font-medium group-hover:text-primary transition-colors">
                                {service.name}
                            </span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                    ))}
                </CardContent>
            </Card>

            <Separator />

            {/* Sticky CTA */}
            <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
                <CardContent className="py-6 text-center space-y-3">
                    <h3 className="font-semibold text-lg">Vous êtes professionnel ?</h3>
                    <p className="text-sm text-muted-foreground">
                        Référencez votre centre sur BeautyBeauté et gagnez en visibilité.
                    </p>
                    <Link
                        href="/professionnels"
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        En savoir plus
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
