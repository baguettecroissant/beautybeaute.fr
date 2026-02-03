import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Politique de Confidentialité | BeautyBeauté',
    description: 'Politique de confidentialité et protection des données personnelles de BeautyBeauté',
};

export default function ConfidentialitePage() {
    return (
        <div className="bg-background min-h-screen pt-32 pb-20">
            <div className="container max-w-4xl">
                <div className="glass p-8 md:p-12 rounded-3xl border border-white/5">
                    <h1 className="text-4xl font-bold text-white mb-8">Politique de Confidentialité</h1>

                    <div className="prose prose-invert max-w-none space-y-8 text-zinc-300">
                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Collecte des données</h2>
                            <p>
                                BeautyBeauté collecte uniquement les données nécessaires au bon
                                fonctionnement de ses services. Les données personnelles collectées
                                peuvent inclure : nom, adresse email, numéro de téléphone.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Utilisation des données</h2>
                            <p>
                                Les données collectées sont utilisées pour :<br />
                                - Répondre à vos demandes de contact<br />
                                - Améliorer nos services<br />
                                - Vous envoyer des communications si vous y avez consenti
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Protection des données</h2>
                            <p>
                                Nous mettons en œuvre des mesures de sécurité appropriées pour
                                protéger vos données personnelles contre tout accès non autorisé,
                                modification, divulgation ou destruction.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Vos droits</h2>
                            <p>
                                Conformément au RGPD, vous disposez d'un droit d'accès, de rectification,
                                de suppression et de portabilité de vos données. Pour exercer ces droits,
                                contactez-nous à : contact@beautybeaute.fr
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Cookies</h2>
                            <p>
                                Pour plus d'informations sur notre utilisation des cookies, veuillez
                                consulter notre politique de cookies.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
