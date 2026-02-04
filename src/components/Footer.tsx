import Link from 'next/link';
import { Sparkles, Instagram, Facebook, Twitter, Mail, MapPin } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-background border-t border-white/5 pt-20 pb-10 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

            <div className="container relative z-10 px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <div className="p-2 bg-primary/20 rounded-full group-hover:bg-primary/40 transition-colors">
                                <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white">
                                BeautyBeauté
                            </span>
                        </Link>
                        <p className="text-zinc-400 leading-relaxed">
                            La référence de la médecine esthétique en France. Trouvez et réservez vos soins en toute confiance.
                        </p>
                        <div className="flex space-x-4">
                            <SocialIcon icon={Instagram} />
                            <SocialIcon icon={Facebook} />
                            <SocialIcon icon={Twitter} />
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h3 className="font-bold text-white mb-6">Soins Populaires</h3>
                        <ul className="space-y-4">
                            <FooterLink href="/epilation-laser">Épilation Laser</FooterLink>
                            <FooterLink href="/cryolipolyse-minceur">Cryolipolyse</FooterLink>
                            <FooterLink href="/soin-hydrafacial">Hydrafacial</FooterLink>
                            <FooterLink href="/injections-esthetique">Injections</FooterLink>
                            <FooterLink href="/blog">Blog</FooterLink>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h3 className="font-bold text-white mb-6">Top Villes</h3>
                        <ul className="space-y-4">
                            <FooterLink href="/ville/paris">Paris</FooterLink>
                            <FooterLink href="/ville/lyon">Lyon</FooterLink>
                            <FooterLink href="/ville/marseille">Marseille</FooterLink>
                            <FooterLink href="/ville/bordeaux">Bordeaux</FooterLink>
                            <FooterLink href="/ville/nice">Nice</FooterLink>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="font-bold text-white mb-6">Contact</h3>
                        <div className="space-y-4 text-zinc-400">
                            <div className="flex items-start space-x-3">
                                <Mail className="h-5 w-5 text-primary mt-1" />
                                <span>contact@beautybeaute.fr</span>
                            </div>
                            <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-primary mt-1" />
                                <span>Paris, France</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-zinc-500">
                    <p>© {currentYear} BeautyBeauté. Tous droits réservés.</p>
                    <div className="flex space-x-8">
                        <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
                        <Link href="/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-zinc-400">Systèmes opérationnels</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon: Icon }: { icon: any }) {
    return (
        <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300">
            <Icon className="h-5 w-5" />
        </a>
    )
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="text-zinc-400 hover:text-primary transition-colors flex items-center group">
                <span className="w-0 group-hover:w-2 h-[1px] bg-primary mr-0 group-hover:mr-2 transition-all duration-300"></span>
                {children}
            </Link>
        </li>
    )
}
