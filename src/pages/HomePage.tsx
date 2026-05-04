import { useState, useMemo } from "react";
import { Job } from "../types/job";
import JobCard from "../components/JobCard";
import AdBanner from "../components/AdBanner";
import { CATEGORIES, LOCATIONS, CONTRACT_TYPES } from "../data/categories";

interface HomePageProps {
  jobs: Job[];
  loading: boolean;
  onNavigate: (page: string, jobId?: string) => void;
}

const JOBS_PER_PAGE = 6;

export default function HomePage({ jobs, loading, onNavigate }: HomePageProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous les secteurs");
  const [location, setLocation] = useState("Toutes les villes");
  const [contractType, setContractType] = useState("Tous les contrats");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const matchSearch =
        search === "" ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchCat = category === "Tous les secteurs" || job.category === category;
      const matchLoc = location === "Toutes les villes" || job.location.includes(location);
      const matchType = contractType === "Tous les contrats" || job.type === contractType;
      return matchSearch && matchCat && matchLoc && matchType;
    });
  }, [jobs, search, category, location, contractType]);

  const totalPages = Math.ceil(filtered.length / JOBS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE);

  const whatsappMsg = encodeURIComponent("Bonjour, je souhaite publier une offre sur Wuut Liggey");

  const handleSearch = () => setPage(1);

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 py-20 px-4 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            {jobs.length} offres disponibles au Sénégal
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
            Trouvez votre prochain<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              emploi au Sénégal
            </span>
          </h1>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Les meilleures offres d'emploi au Sénégal et en Afrique francophone, 
            mises à jour quotidiennement pour votre carrière.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
            <div className="flex-1 flex items-center gap-2 px-3">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Titre du poste, entreprise, compétence..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
              />
              {search && (
                <button onClick={() => { setSearch(""); setPage(1); }} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm rounded-xl transition-colors"
            >
              Rechercher
            </button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-100 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {[
            { icon: "💼", label: "Offres publiées", value: jobs.length + "+" },
            { icon: "🏢", label: "Entreprises", value: "50+" },
            { icon: "📍", label: "Villes", value: "8" },
            { icon: "🔄", label: "Mise à jour", value: "Quotidienne" },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-xl">{icon}</span>
              <div>
                <p className="text-sm font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <AdBanner format="horizontal" />
      </div>

      {/* Main content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Filtres</h2>
                <button
                  onClick={() => { setCategory("Tous les secteurs"); setLocation("Toutes les villes"); setContractType("Tous les contrats"); setPage(1); }}
                  className="text-xs text-green-600 hover:underline"
                >
                  Réinitialiser
                </button>
              </div>

              {/* Category */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Secteur</label>
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  className="w-full text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-green-400 transition-colors"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Location */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Localisation</label>
                <select
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                  className="w-full text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-green-400 transition-colors"
                >
                  {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>

              {/* Contract Type */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Type de contrat</label>
                <div className="space-y-2">
                  {CONTRACT_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="contract"
                        value={type}
                        checked={contractType === type}
                        onChange={(e) => { setContractType(e.target.value); setPage(1); }}
                        className="accent-green-500"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Publish CTA */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <p className="text-xs font-semibold text-green-800 mb-1">Vous recrutez ?</p>
                <p className="text-xs text-green-600 mb-3">Publiez votre offre et touchez des milliers de candidats.</p>
                <a
                  href={`https://wa.me/221700000000?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Publier via WhatsApp
                </a>
              </div>
            </div>
          </aside>

          {/* Job Grid */}
          <div className="flex-1">
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {filtered.length > 0
                    ? `${filtered.length} offre${filtered.length > 1 ? "s" : ""} trouvée${filtered.length > 1 ? "s" : ""}`
                    : "Aucune offre trouvée"}
                </h2>
                {(search || category !== "Tous les secteurs" || location !== "Toutes les villes") && (
                  <p className="text-sm text-gray-400 mt-0.5">
                    Résultats filtrés
                    {search && ` pour "${search}"`}
                    {category !== "Tous les secteurs" && ` · ${category}`}
                    {location !== "Toutes les villes" && ` · ${location}`}
                  </p>
                )}
              </div>
              <span className="text-sm text-gray-400">
                Page {page}/{totalPages || 1}
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-44 bg-gray-100" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune offre trouvée</h3>
                <p className="text-gray-400 text-sm mb-6">Essayez d'ajuster vos filtres ou votre recherche.</p>
                <button
                  onClick={() => { setSearch(""); setCategory("Tous les secteurs"); setLocation("Toutes les villes"); setContractType("Tous les contrats"); }}
                  className="px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors"
                >
                  Voir toutes les offres
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {paginated.map((job, idx) => (
                    <>
                      <JobCard key={job.id} job={job} onNavigate={onNavigate} />
                      {/* Ad after 4th card */}
                      {idx === 3 && (
                        <div className="sm:col-span-2">
                          <AdBanner format="horizontal" />
                        </div>
                      )}
                    </>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-green-400 hover:text-green-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Précédent
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-xl text-sm font-semibold transition-colors ${
                          page === p
                            ? "bg-green-500 text-white shadow-md"
                            : "border border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-600"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-green-400 hover:text-green-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Suivant →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Category Pills Section */}
      <section className="bg-gray-50 py-12 px-4 mt-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Explorez par secteur</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "💻 Informatique & Tech", cat: "Informatique & Tech" },
              { label: "📊 Finance & Comptabilité", cat: "Finance & Comptabilité" },
              { label: "📣 Marketing & Communication", cat: "Marketing & Communication" },
              { label: "🏗️ BTP & Génie Civil", cat: "BTP & Génie Civil" },
              { label: "🏥 Santé & Médical", cat: "Santé & Médical" },
              { label: "🛒 Vente & Commerce", cat: "Vente & Commerce" },
              { label: "⚖️ Juridique & Droit", cat: "Juridique & Droit" },
              { label: "🚚 Logistique & Transport", cat: "Logistique & Transport" },
              { label: "📚 Éducation & Formation", cat: "Éducation & Formation" },
            ].map(({ label, cat }) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="px-5 py-2.5 bg-white border border-gray-200 hover:border-green-400 hover:bg-green-50 text-sm text-gray-700 hover:text-green-700 font-medium rounded-full transition-all shadow-sm"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
