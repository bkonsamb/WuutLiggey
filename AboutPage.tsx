interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-10">
        <button onClick={() => onNavigate("home")} className="hover:text-green-600 transition-colors">Accueil</button>
        <span>›</span>
        <span className="text-gray-700">À propos</span>
      </nav>

      {/* Hero */}
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-200">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">À propos de Wuut Liggey</h1>
        <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
          <strong className="text-gray-700">Wuut Liggey</strong> — qui signifie <em>"Cherche du travail"</em> en wolof — 
          est une plateforme dédiée aux offres d'emploi au Sénégal et en Afrique francophone.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 md:p-10 mb-10 border border-green-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Notre mission</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Connecter les talents sénégalais avec les meilleures opportunités professionnelles du marché local 
          et régional. Nous croyons que chaque Sénégalais mérite un accès simple, rapide et gratuit 
          aux offres d'emploi de qualité.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Notre plateforme agrège quotidiennement les meilleures offres d'emploi au Sénégal, les reformule 
          avec soin pour vous offrir une expérience de lecture claire et professionnelle.
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: "🎯",
            title: "Pertinence",
            desc: "Seulement des offres vérifiées et pertinentes pour le marché sénégalais."
          },
          {
            icon: "🔄",
            title: "Mise à jour quotidienne",
            desc: "Les offres sont actualisées chaque jour pour vous proposer les opportunités les plus récentes."
          },
          {
            icon: "🆓",
            title: "Accès gratuit",
            desc: "La consultation des offres est et restera entièrement gratuite pour les candidats."
          },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-gray-900 rounded-3xl p-8 md:p-10 text-white mb-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Wuut Liggey en chiffres</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "500+", label: "Offres publiées" },
            { value: "50+", label: "Entreprises partenaires" },
            { value: "8", label: "Villes couvertes" },
            { value: "100%", label: "Gratuit pour les candidats" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold text-green-400">{value}</p>
              <p className="text-sm text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Comment ça fonctionne ?</h2>
        <div className="space-y-4">
          {[
            { step: "01", title: "Agrégation automatique", desc: "Nous collectons quotidiennement les meilleures offres d'emploi publiées au Sénégal via diverses sources." },
            { step: "02", title: "Reformulation qualitative", desc: "Chaque offre est reformulée pour être claire, structurée et facile à lire, sans inventer d'informations." },
            { step: "03", title: "Publication sur le site", desc: "Les offres sont publiées avec une image pertinente, optimisées pour les moteurs de recherche." },
            { step: "04", title: "Candidature directe", desc: "Les candidats peuvent postuler directement via WhatsApp ou email en quelques secondes." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-green-600 font-bold text-sm">{step}</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-10 text-white">
        <h2 className="text-2xl font-bold mb-3">Prêt à trouver votre emploi ?</h2>
        <p className="text-green-100 mb-6">Consultez nos offres d'emploi et postulez dès aujourd'hui.</p>
        <button
          onClick={() => onNavigate("home")}
          className="px-8 py-3 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors shadow-lg"
        >
          Voir les offres d'emploi →
        </button>
      </div>
    </main>
  );
}
