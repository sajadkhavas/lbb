import { FIT_LABELS, type Product } from "@/lib/products";
import { Ruler, Shirt, Info } from "lucide-react";

/**
 * Replacement for the removed generated-review section.
 * Shows only real product data: fit register, fit note, material and care.
 */
export function FitGuide({ product: p }: { product: Product }) {
  return (
    <div dir="rtl" className="flex flex-col gap-6">
      <div className="grid gap-px bg-hairline sm:grid-cols-3">
        <Cell icon={<Shirt size={14} />} label="برش" value={FIT_LABELS[p.fit]} />
        <Cell icon={<Ruler size={14} />} label="سایزبندی" value={p.sizes.join(" · ")} />
        <Cell icon={<Info size={14} />} label="جنس" value={p.material} />
      </div>

      <div className="border-s-2 border-signal ps-4">
        <p className="tech text-metal">FIT NOTE</p>
        <p className="mt-1.5 text-sm leading-7 text-bone">{p.fitNote}</p>
      </div>

      <div>
        <p className="tech text-metal">CARE</p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {p.care.map((c) => (
            <li key={c} className="flex gap-2 text-sm leading-7 text-metal">
              <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-signal" />
              {c}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs leading-6 text-mute">
        نظرات مشتریان زمانی نمایش داده می‌شود که سیستم ثبت نظر واقعی به سایت اضافه شود. هیچ امتیاز
        یا نظری در این صفحه ساختگی نیست.
      </p>
    </div>
  );
}

function Cell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-carbon p-4">
      <span className="flex items-center gap-1.5 text-metal">
        {icon}
        <span className="tech">{label}</span>
      </span>
      <p className="mt-2 text-sm font-semibold text-bone">{value}</p>
    </div>
  );
}
