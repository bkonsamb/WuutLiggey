import { Job } from "../types/job";

interface JobCardProps {
  job: Job;
  onNavigate: (page: string, jobId?: string) => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Hier";
  if (diff < 7) return `Il y a ${diff} jours`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

const categoryColors: Record<string, string> = {
  "Informatique & Tech": "bg-blue-50 text-blue-700",
  "Marketing & Communication": "bg-purple-50 text-purple-700",
  "Finance & Comptabilité": "bg-amber-50 text-amber-700",
  "BTP & Génie Civil": "bg-orange-50 text-orange-700",
  "Santé & Médical": "bg-rose-50 text-rose-700",
  "Vente & Commerce": "bg-cyan-50 text-cyan-700",
  "Juridique & Droit": "bg-indigo-50 text-indigo-700",
  "Logistique & Transport": "bg-teal-50 text-teal-700",
  "Éducation & Formation": "bg-lime-50 text-lime-700",
};

export default function JobCard({ job, onNavigate }: JobCardProps) {
  const catColor = categoryColors[job.category] ?? "bg-gray-100 text-gray-700";
  const typeColor = job.type === "CDI" ? "bg-green-50 text-green-700" : job.type === "CDD" ? "bg-yellow-50 text-yellow-700" : "bg-blue-50 text-blue-700";

  return (
    <article
      onClick={() => onNavigate("job", job.id)}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-green-100 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={job.image}
          alt={job.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColor}`}>
            {job.type}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm bg-white/90 ${catColor}`}>
            {job.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h2 className="text-base font-bold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2 mb-1">
          {job.title}
        </h2>
        <p className="text-sm font-medium text-green-600 mb-3">{job.company}</p>
        <p className="text-sm text-gray-500 line-clamp-2 flex-1 leading-relaxed">
          {job.excerpt}
        </p>

        {/* Meta */}
        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {job.location.split(",")[0]}
            </span>
            {job.salary && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {job.salary}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400">{formatDate(job.date)}</span>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onNavigate("job", job.id); }}
          className="mt-4 w-full py-2.5 bg-green-50 hover:bg-green-600 text-green-700 hover:text-white text-sm font-semibold rounded-xl transition-all duration-200"
        >
          Voir l'offre →
        </button>
      </div>
    </article>
  );
}
