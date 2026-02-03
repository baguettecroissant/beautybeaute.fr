import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Politique de Cookies | BeautyBeauté',
    description: 'Politique d\'utilisation des cookies sur le site BeautyBeauté',
};

export default function CookiesPage() {
    return (
        <div className="bg-background min-h-screen pt-32 pb-20">
            <div className="container max-w-4xl">
                <div className="glass p-8 md:p-12 rounded-3xl border border-white/5">
                    <h1 className="text-4xl font-bold text-white mb-8">Politique de Cookies</h1>

                    <div className="prose prose-invert max-w-none space-y-8 text-zinc-300">
                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Qu'est-ce qu'un cookie ?</h2>
                            <p>
                                Un cookie est un petit fichier texte stocké sur votre appareil lors
                                de votre visite sur un site web. Il permet au site de mémoriser des
                                informations sur votre visite.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Types de cookies utilisés</h2>
                            <p>
                                <strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site.<br /><br />
                                <strong>Cookies analytiques :</strong> Nous aident à comprendre comment
                                les visiteurs utilisent le site.<br /><br />
                                <strong>Cookies de préférences :</strong> Permettent de mémoriser vos choix
                                et préférences.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Gestion des cookies</h2>
                            <p>
                                Vous pouvez contrôler et supprimer les cookies à tout moment via les
                                paramètres de votre navigateur. La désactivation de certains cookies
                                peut affecter le fonctionnement du site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Durée de conservation</h2>
                            <p>
                                Les cookies restent sur votre appareil pendant une durée variable selon
                                leur type. Les cookies de session sont supprimés à la fermeture de votre
                                navigateur, tandis que les cookies persistants peuvent durer jusqu'à 13 mois.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Contact</h2>
                            <p>
                                Pour toute question relative à notre politique de cookies, contactez-nous
                                à : contact@beautybeaute.fr
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
