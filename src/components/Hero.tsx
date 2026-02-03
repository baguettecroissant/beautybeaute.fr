'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from './Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Star, ShieldCheck, Users } from 'lucide-react';

interface HeroProps {
    title: string;
    description: string;
    backgroundImage?: string;
    stats?: {
        value: string;
        label: string;
    }[];
    showSearch?: boolean;
}

export function Hero({
    title,
    description,
    backgroundImage,
    stats,
    showSearch = true,
}: HeroProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        if (!searchTerm.trim()) return;

        // Basic slugify: remove accents, lowercase, replace spaces with dashes
        const slug = searchTerm
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        // Determine destination based on current path
        // If we are on a service page (e.g. /epilation-laser), keep the service
        const pathParts = pathname?.split('/').filter(Boolean) || [];
        const currentService = pathParts[0];

        const services = ['epilation-laser', 'cryolipolyse-minceur', 'soin-hydrafacial', 'injections-esthetique'];

        if (services.includes(currentService)) {
            router.push(`/${currentService}/${slug}`);
        } else {
            // Default to city page
            router.push(`/ville/${slug}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <section className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden pt-24 pb-12">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-background" />
                {/* Modern Glow Effects */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-float opacity-60" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-indigo-600/10 rounded-full blur-[100px] animate-float opacity-50" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[20%] right-[20%] w-[20%] h-[30%] bg-blue-500/10 rounded-full blur-[80px] animate-float opacity-40" style={{ animationDelay: '4s' }} />

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background" />
            </div>

            <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center space-y-8">
                <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
                    <Breadcrumbs />

                    <h1 className="mt-6 font-sans text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl">
                        {title.split(' ').map((word, i, arr) => (
                            <span key={i} className="inline hover:text-primary transition-colors duration-300 cursor-default">
                                {word}{i < arr.length - 1 ? ' ' : ''}
                            </span>
                        ))}
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg md:text-xl text-zinc-400 font-light leading-relaxed">
                        {description}
                    </p>

                    {showSearch && (
                        <div className="mt-10 w-full max-w-lg relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                            <div className="relative glass rounded-full p-2 flex items-center pr-2">
                                <div className="pl-4 text-zinc-400">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Quelle ville ? (ex: Paris, Lyon...)"
                                    className="flex-1 bg-transparent border-none text-white placeholder-zinc-500 focus:ring-0 px-4 py-2 outline-none h-12"
                                />
                                <Button
                                    size="lg"
                                    className="rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white px-8"
                                    onClick={handleSearch}
                                >
                                    <Search className="h-4 w-4 mr-2" />
                                    Rechercher
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Section - Quick Trust Indicators */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mt-12 w-full max-w-3xl">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-white/10 transition-colors duration-300 group"
                            >
                                <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300 group-hover:text-primary">
                                    {stat.value}
                                </div>
                                <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider group-hover:text-zinc-300 transition-colors">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Abstract Decorative Elements */}
                <div className="absolute top-1/2 left-10 hidden lg:block opacity-20 pointer-events-none">
                    <ShieldCheck className="h-24 w-24 text-white rotate-12" />
                </div>
                <div className="absolute bottom-20 right-10 hidden lg:block opacity-20 pointer-events-none">
                    <Star className="h-16 w-16 text-primary -rotate-12" />
                </div>
            </div>
        </section>
    );
}
