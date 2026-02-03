import Link from 'next/link';
import { Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const services = [
    { name: 'Épilation Laser', href: '/epilation-laser' },
    { name: 'Cryolipolyse', href: '/cryolipolyse-minceur' },
    { name: 'Soin Hydrafacial', href: '/soin-hydrafacial' },
    { name: 'Injections & Botox', href: '/injections-esthetique' },
];

export function Header() {
    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <header className="glass rounded-full px-6 py-3 flex items-center justify-between pointer-events-auto w-full max-w-5xl transition-all duration-300 hover:bg-white/10">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className="p-2 bg-primary/20 rounded-full group-hover:bg-primary/40 transition-colors">
                        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    </div>
                    <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent group-hover:text-white transition-colors">
                        BeautyBeauté
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-8">
                    {services.map((service) => (
                        <Link
                            key={service.name}
                            href={service.href}
                            className="text-sm font-medium text-white/70 hover:text-white hover:text-glow transition-all"
                        >
                            {service.name}
                        </Link>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center space-x-4">
                    <Link href="/pro">
                        <Button
                            variant="default"
                            size="sm"
                            className="rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 transition-all font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            Vous êtes pro ?
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="top" className="w-full h-full bg-background/95 backdrop-blur-3xl border-b border-white/10 p-0">
                            <VisuallyHidden>
                                <SheetTitle>Menu de navigation</SheetTitle>
                            </VisuallyHidden>
                            <div className="flex flex-col h-full items-center justify-center space-y-8 animate-in fade-in zoom-in duration-300">
                                <Link href="/" className="flex items-center space-x-2 mb-8">
                                    <Sparkles className="h-8 w-8 text-primary" />
                                    <span className="font-bold text-3xl tracking-tight text-white">
                                        BeautyBeauté
                                    </span>
                                </Link>
                                {services.map((service) => (
                                    <Link
                                        key={service.name}
                                        href={service.href}
                                        className="text-2xl font-light text-white/80 hover:text-white hover:scale-110 transition-all"
                                    >
                                        {service.name}
                                    </Link>
                                ))}
                                <div className="pt-8">
                                    <Link href="/pro">
                                        <Button size="lg" className="rounded-full text-lg px-8 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20">
                                            Espace Professionnel
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>
        </div>
    );
}
