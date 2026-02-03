import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Mentions Légales | BeautyBeauté',
    description: 'Mentions légales du site BeautyBeauté - Annuaire de médecine esthétique',
};

export default function MentionsLegalesPage() {
    return (
        <div className="bg-background min-h-screen pt-32 pb-20">
            <div className="container max-w-4xl">
                <div className="glass p-8 md:p-12 rounded-3xl border border-white/5">
                    <h1 className="text-4xl font-bold text-white mb-8">Mentions Légales</h1>

                    <div className="prose prose-invert max-w-none space-y-8 text-zinc-300">
                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Éditeur du site</h2>
                            <p>
                                Le site BeautyBeauté est édité par la société BeautyBeauté SAS.<br />
                                Siège social : Paris, France<br />
                                Email : contact@beautybeaute.fr
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Hébergement</h2>
                            <p>
                                Ce site est hébergé par Vercel Inc.<br />
                                440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Propriété intellectuelle</h2>
                            <p>
                                L'ensemble du contenu de ce site (textes, images, logos, etc.) est protégé
                                par le droit d'auteur. Toute reproduction, même partielle, est interdite
                                sans autorisation préalable.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Responsabilité</h2>
                            <p>
                                BeautyBeauté s'efforce de fournir des informations exactes et à jour,
                                mais ne peut garantir l'exactitude, la complétude ou l'actualité des
                                informations diffusées sur ce site. Les utilisateurs utilisent ces
                                informations sous leur seule responsabilité.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Contact</h2>
                            <p>
                                Pour toute question concernant ces mentions légales, vous pouvez nous
                                contacter à l'adresse : contact@beautybeaute.fr
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
