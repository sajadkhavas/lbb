import { StatePanel, TechLabel } from "@/components/lbb/ui/primitives";
import type { ProductDecisionViewModel } from "@/lib/product-decision";

export function ProductFacts({ model }: { model: ProductDecisionViewModel }) {
  const hasDetails = Boolean(model.identity.description || model.identity.sku || model.identity.collection);
  const hasDecisionFacts = Boolean(
    model.facts.material || model.facts.fit || model.facts.fitNote || model.facts.care.length,
  );

  if (!hasDetails && !hasDecisionFacts && !model.measurements) {
    return (
      <StatePanel title="مشخصات محصول هنوز منتشر نشده است" tone="info">
        جنس، تن‌خور، نگهداری و اندازه‌ها تا زمانی که برای همین محصول تأیید نشوند نمایش داده نمی‌شوند.
      </StatePanel>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2" data-testid="pdp-product-facts">
      {hasDetails ? (
        <section aria-labelledby="pdp-details-heading" className="border-t border-hairline pt-5">
          <TechLabel tone="signal">DETAILS</TechLabel>
          <h2 id="pdp-details-heading" className="mt-2 text-xl font-bold text-bone">جزئیات</h2>
          {model.identity.description ? (
            <p className="mt-3 text-sm leading-8 text-metal">{model.identity.description}</p>
          ) : null}
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            {model.identity.collection ? (
              <div>
                <dt className="text-mute">مجموعه</dt>
                <dd className="mt-1 font-semibold text-bone">{model.identity.collection}</dd>
              </div>
            ) : null}
            {model.identity.sku ? (
              <div>
                <dt className="text-mute">کد محصول</dt>
                <dd className="num mt-1 font-semibold text-bone" dir="ltr">{model.identity.sku}</dd>
              </div>
            ) : null}
          </dl>
        </section>
      ) : null}

      {hasDecisionFacts ? (
        <section aria-labelledby="pdp-wear-heading" className="border-t border-hairline pt-5">
          <TechLabel tone="signal">WEAR / CARE</TechLabel>
          <h2 id="pdp-wear-heading" className="mt-2 text-xl font-bold text-bone">جنس، تن‌خور و نگهداری</h2>
          <dl className="mt-4 grid gap-4 text-sm">
            {model.facts.material ? (
              <div>
                <dt className="text-mute">جنس</dt>
                <dd className="mt-1 leading-7 text-bone">{model.facts.material}</dd>
              </div>
            ) : null}
            {model.facts.fit ? (
              <div>
                <dt className="text-mute">تن‌خور</dt>
                <dd className="mt-1 leading-7 text-bone">
                  {model.facts.fit}
                  {model.facts.fitNote ? ` — ${model.facts.fitNote}` : ""}
                </dd>
              </div>
            ) : null}
          </dl>
          {model.facts.care.length > 0 ? (
            <div className="mt-5">
              <h3 className="text-sm font-bold text-bone">نگهداری</h3>
              <ul className="mt-2 space-y-2 text-sm leading-7 text-metal">
                {model.facts.care.map((instruction) => (
                  <li key={instruction} className="flex gap-2">
                    <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-signal" />
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {model.measurements ? (
        <section aria-labelledby="pdp-measurements-heading" className="border-t border-hairline pt-5 lg:col-span-2">
          <TechLabel tone="signal">MEASUREMENTS / CM</TechLabel>
          <h2 id="pdp-measurements-heading" className="mt-2 text-xl font-bold text-bone">اندازه خود لباس</h2>
          <p className="mt-2 text-sm leading-7 text-metal">واحد همه اندازه‌ها سانتی‌متر است.</p>
          <div className="mt-4 overflow-x-auto border border-hairline" tabIndex={0} aria-label="اندازه‌های محصول">
            <table className="min-w-[560px] w-full text-xs">
              <thead>
                <tr className="bg-carbon text-metal">
                  <th scope="col" className="p-3 text-start">سایز</th>
                  {model.measurements.columns.map((column) => (
                    <th key={column.key} scope="col" className="p-3 text-start">
                      {column.label} (cm)
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {model.measurements.rows.map((row) => (
                  <tr key={row.size} className="border-t border-hairline">
                    <th scope="row" className="num p-3 text-start text-bone">{row.size}</th>
                    {model.measurements?.columns.map((column) => (
                      <td key={column.key} className="num p-3 text-metal">
                        {row.values[column.key] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
