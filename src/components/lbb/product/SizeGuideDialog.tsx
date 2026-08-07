import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TechLabel } from "@/components/lbb/ui/primitives";
import type { GarmentMeasurements, ModelMeasurements } from "@/lib/product-decision";

export function SizeGuideDialog({
  trigger,
  measurements,
  model,
  productName,
}: {
  trigger: React.ReactNode;
  measurements: GarmentMeasurements;
  model?: ModelMeasurements | null;
  productName: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        dir="rtl"
        className="max-h-[85dvh] w-[calc(100%-2rem)] max-w-[680px] overflow-y-auto overflow-x-hidden border-hairline bg-obsidian text-bone"
      >
        <DialogHeader>
          <TechLabel tone="signal">GARMENT MEASUREMENTS</TechLabel>
          <DialogTitle className="text-display-3 text-bone">راهنمای اندازه {productName}</DialogTitle>
          <DialogDescription className="text-sm leading-7 text-metal">
            اندازه‌ها مربوط به خود لباس هستند، نه اندازه بدن. واحد تمام اعداد این جدول سانتی‌متر است.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-x-auto border border-hairline" tabIndex={0} aria-label="جدول اندازه محصول">
          <table className="min-w-[560px] w-full text-xs">
            <caption className="sr-only">اندازه‌های تأییدشده {productName} با واحد سانتی‌متر</caption>
            <thead>
              <tr className="bg-carbon text-metal">
                <th scope="col" className="p-3 text-start font-semibold">سایز</th>
                {measurements.columns.map((column) => (
                  <th key={column.key} scope="col" className="p-3 text-start font-semibold">
                    {column.label} <span className="font-normal text-mute">(cm)</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {measurements.rows.map((row) => (
                <tr key={row.size} className="border-t border-hairline">
                  <th scope="row" className="num p-3 text-start font-bold text-bone">{row.size}</th>
                  {measurements.columns.map((column) => (
                    <td key={column.key} className="num p-3 text-metal">
                      {row.values[column.key] === null || row.values[column.key] === undefined
                        ? "—"
                        : row.values[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {model && (model.heightCm || model.wornSize) ? (
          <section aria-labelledby="model-measurements-heading" className="border-t border-hairline pt-4">
            <h3 id="model-measurements-heading" className="text-sm font-bold text-bone">اطلاعات مدل</h3>
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              {model.heightCm ? (
                <div>
                  <dt className="text-mute">قد مدل</dt>
                  <dd className="num mt-1 text-bone">{model.heightCm} cm</dd>
                </div>
              ) : null}
              {model.wornSize ? (
                <div>
                  <dt className="text-mute">سایز پوشیده‌شده</dt>
                  <dd className="num mt-1 text-bone">{model.wornSize}</dd>
                </div>
              ) : null}
            </dl>
          </section>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
