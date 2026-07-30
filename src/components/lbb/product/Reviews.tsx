import { Star } from "lucide-react";
import { reviewSummary } from "@/lib/reviews";

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} از ۵`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? "fill-[var(--lbb-red)] text-[var(--lbb-red)]" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

export function Reviews({ slug }: { slug: string }) {
  const { avg, count, reviews } = reviewSummary(slug);

  return (
    <div dir="rtl">
      <div className="mb-6 flex flex-col items-start gap-4 rounded-xl border border-black/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {avg}
          </span>
          <div>
            <Stars rating={avg} size={16} />
            <p className="mt-1 text-xs text-gray-500">بر اساس {count} نظر</p>
          </div>
        </div>
      </div>

      <ul className="flex flex-col gap-5">
        {reviews.map((r) => (
          <li key={r.id} className="border-b border-black/[0.06] pb-5 last:border-0">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-semibold">{r.author}</span>
              <span className="text-xs text-gray-400">{r.date}</span>
            </div>
            <Stars rating={r.rating} />
            <p className="mt-2 text-sm font-semibold">{r.title}</p>
            <p className="mt-1 text-sm leading-7 text-gray-600">{r.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
