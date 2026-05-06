import { Job } from "../types/job";
import AdBanner from "../components/AdBanner";

interface JobDetailPageProps {
  job: Job;
  relatedJobs: Job[];
  onNavigate: (page: string, jobId?: string) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function renderMarkdown(text: string): string {
  return text
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-900 mt-8 mb-3">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-gray-800 mt-6 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/^- (.+)$/gm, '<li class="flex items-start gap-2 text-gray-600 text-sm leading-relaxed"><span class="text-green-500 mt-1 shrink-0">▸</span><span>$1</span></li>')
    .replace(/(<li[\s\S]*?<\/li>\n?)+/g, (match) => `<ul class="space-y-2 my-3 ml-1">${match}</ul>`)
    .replace(/\n\n/g, '</p><p class="text-gray-600 text-sm leading-relaxed my-3">')
    .replace(/^(?!<[hul])(.+)$/gm, (line) => line ? `<p class="text-gray-600 text-sm leading-relaxed my-3">${line}</p>` : "");
}

const categoryColors: Record<string, string> = {
  "Informatique & Tech": "bg-blue-50 text-blue-700 border-blue-100",
  "Marketing & Communication": "bg-purple-50 text-purple-700 border-purple-100",
  "Finance & Comptabilité": "bg-amber-50 text-amber-700 border-amber-100",
  "BTP & Génie Civil": "bg-orange-50 text-orange-700 border-orange-100",
  "Santé & Médical": "bg-rose-50 text-rose-700 border-rose-100",
  "Vente & Commerce": "bg-cyan-50 text-cyan-700 border-cyan-100",
  "Juridique & Droit": "bg-indigo-50 text-indigo-700 border-indigo-100",
  "Logistique & Transport": "bg-teal-50 text-teal-700 border-teal-100",
  "Éducation & Formation": "bg-lime-50 text-lime-700 border-lime-100",
};

export default function JobDetailPage({ job, relatedJobs, onNavigate }: JobDetailPageProps) {
  const catColor = categoryColors[job.category] ?? "bg-gray-100 text-gray-700 border-gray-200";
  const typeColor = job.type === "CDI" ? "bg-green-50 text-green-700 border-green-100" : "bg-yellow-50 text-yellow-700 border-yellow-100";
  const whatsappMsg = encodeURIComponent(
    `Bonjour, je souhaite postuler à l'offre "${job.title}" chez ${job.company} via Wuut Liggey.`
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <button onClick={() => onNavigate("home")} className="hover:text-green-600 transition-colors">
          Accueil
        </button>
        <span>›</span>
        <button onClick={() => onNavigate("home")} className="hover:text-green-600 transition-colors">
          Offres d'emploi
        </button>
        <span>›</span>
        <span className="text-gray-700 font-medium truncate max-w-xs">{job.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <article className="flex-1 min-w-0">
          {/* Hero Image */}
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8 shadow-lg">
            <img
              src={job.image}
              alt={job.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border bg-white/90 backdrop-blur-sm ${catColor}`}>
                  {job.category}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border bg-white/90 backdrop-blur-sm ${typeColor}`}>
                  {job.type}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                {job.title}
              </h1>
            </div>
          </div>

          {/* Company Info Bar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center text-green-600 font-bold text-lg">
                  {job.company.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base">{job.company}</p>
                  <p className="text-sm text-gray-500">{job.category}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Publié le {formatDate(job.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {job.salary}
                </span>
              </div>
            </div>
          </div>

          {/* Ad Banner */}
          <AdBanner format="horizontal" className="mb-8" />

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mb-8">
            <div
              className="prose-custom"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(job.description) }}
            />
          </div>

          {/* Tags */}
          {job.tags.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
              <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Compétences clés</h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-8">
            <p className="text-sm font-semibold text-gray-700 mb-3">Partager cette offre</p>
            <div className="flex gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Offre d'emploi : ${job.title} chez ${job.company} au Sénégal`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-xl hover:bg-green-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                LinkedIn
              </a>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-300 transition-colors"
              >
                Copier le lien
              </button>
            </div>
          </div>

          {/* Related Jobs */}
          {relatedJobs.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-5">Offres similaires</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedJobs.slice(0, 4).map((rJob) => (
                  <button
                    key={rJob.id}
                    onClick={() => { onNavigate("job", rJob.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="text-left bg-white rounded-xl border border-gray-100 shadow-sm hover:border-green-200 hover:shadow-md transition-all p-4 group"
                  >
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 line-clamp-1">{rJob.title}</p>
                    <p className="text-xs text-green-600 mt-0.5">{rJob.company}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-400">{rJob.location.split(",")[0]}</span>
                      <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">{rJob.type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Apply CTA */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-1">Intéressé(e) par ce poste ?</h3>
              <p className="text-sm text-gray-500 mb-5">Postulez directement via WhatsApp ou par email.</p>
              <a
                href={`https://wa.me/221700000000?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Postuler via WhatsApp
              </a>
              <a
                href="mailto:candidatures@wuut-liggey.sn"
                className="flex items-center justify-center gap-2 w-full py-3 mt-3 border border-gray-200 hover:border-green-400 text-gray-700 hover:text-green-700 font-semibold text-sm rounded-xl transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Envoyer un email
              </a>
            </div>

            {/* Job Summary Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Résumé du poste</h3>
              <dl className="space-y-3">
                {[
                  { label: "Entreprise", value: job.company, icon: "🏢" },
                  { label: "Localisation", value: job.location, icon: "📍" },
                  { label: "Type de contrat", value: job.type, icon: "📋" },
                  { label: "Salaire", value: job.salary, icon: "💰" },
                  { label: "Secteur", value: job.category, icon: "🏷️" },
                  { label: "Date de publication", value: formatDate(job.date), icon: "📅" },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <span className="text-base">{icon}</span>
                    <div>
                      <dt className="text-xs text-gray-400 font-medium">{label}</dt>
                      <dd className="text-sm text-gray-800 font-semibold mt-0.5">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            {/* Ad */}
            <AdBanner format="rectangle" />

            {/* Back button */}
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2 w-full justify-center py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              ← Retour aux offres
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
