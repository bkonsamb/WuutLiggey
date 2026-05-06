import { useState } from "react";

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export default function ContactPage({ onNavigate }: ContactPageProps) {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const whatsappMsg = encodeURIComponent(
    `Bonjour, je m'appelle ${formData.name || "..."} et je souhaite vous contacter via Wuut Liggey. Sujet : ${formData.subject || "..."}`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-10">
        <button onClick={() => onNavigate("home")} className="hover:text-green-600 transition-colors">Accueil</button>
        <span>›</span>
        <span className="text-gray-700">Contact</span>
      </nav>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
        <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
          Une question, une offre à publier, un partenariat ? N'hésitez pas à nous contacter.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-6">
          {[
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              label: "Adresse",
              value: "Dakar, Sénégal",
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
              label: "Email",
              value: "contact@wuut-liggey.sn",
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              ),
              label: "WhatsApp",
              value: "+221 70 000 00 00",
            },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                {icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
              </div>
            </div>
          ))}

          {/* WhatsApp Quick Contact */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-2">Contact rapide</h3>
            <p className="text-green-100 text-sm mb-4">Pour toute demande urgente, contactez-nous directement sur WhatsApp.</p>
            <a
              href={`https://wa.me/221700000000?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-white text-green-700 font-bold text-sm rounded-xl hover:bg-green-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Ouvrir WhatsApp
            </a>
          </div>

          {/* Publish offer */}
          <div className="bg-gray-900 rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-2">Publier une offre</h3>
            <p className="text-gray-400 text-sm mb-4">Vous êtes recruteur ? Publiez votre offre et atteignez des milliers de candidats qualifiés.</p>
            <a
              href={`https://wa.me/221700000000?text=${encodeURIComponent("Bonjour, je souhaite publier une offre sur Wuut Liggey")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Publier une offre d'emploi
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message envoyé !</h3>
                <p className="text-gray-500 mb-6">Nous vous répondrons dans les plus brefs délais.</p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", subject: "", message: "" }); }}
                  className="px-6 py-2.5 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom complet *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Votre nom"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-green-400 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="votre@email.com"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-green-400 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sujet *</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-green-400 focus:bg-white transition-colors"
                    >
                      <option value="">Sélectionner un sujet</option>
                      <option>Publier une offre d'emploi</option>
                      <option>Partenariat</option>
                      <option>Signaler une erreur</option>
                      <option>Question générale</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Décrivez votre demande..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-green-400 focus:bg-white transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg"
                  >
                    Envoyer le message →
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    * Champs obligatoires. Vos données ne seront pas partagées.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
