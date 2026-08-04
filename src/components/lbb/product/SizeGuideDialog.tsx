import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TechLabel } from "@/components/lbb/ui/primitives";

const topsSizes = [
  ["سایز", "دور سینه (سانت)", "طول (سانت)"],
  ["XS", "86–90", "64"],
  ["S", "92–96", "66"],
  ["M", "98–102", "68"],
  ["L", "104–108", "70"],
  ["XL", "110–114", "72"],
  ["XXL", "116–120", "74"],
];

const pantsSizes = [
  ["سایز", "دور کمر (سانت)", "طول (سانت)"],
  ["S", "72–76", "100"],
  ["M", "78–82", "102"],
  ["L", "84–88", "104"],
  ["XL", "90–94", "106"],
];

function Table({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <div>
      <TechLabel tone="signal">{title}</TechLabel>
      <div className="mt-2 overflow-x-auto border border-hairline">
        <table className="w-full text-xs">
          <caption className="sr-only">جدول سایزبندی {title}</caption>
          <thead>
            <tr className="bg-carbon text-metal">
              {rows[0].map((h) => (
                <th key={h} scope="col" className="p-2.5 text-start font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(1).map((r, i) => (
              <tr key={i} className="border-t border-hairline">
                {r.map((c, j) =>
                  j === 0 ? (
                    <th key={j} scope="row" className="num p-2.5 text-start font-bold text-bone">
                      {c}
                    </th>
                  ) : (
                    <td key={j} className="num p-2.5 text-metal">
                      {c}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SizeGuideDialog({ trigger }: { trigger: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        dir="rtl"
        className="max-h-[85vh] max-w-[520px] overflow-y-auto border-hairline bg-obsidian text-bone"
      >
        <DialogHeader>
          <DialogTitle className="text-display-3 text-bone">راهنمای سایز</DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-7 text-metal">
          یک متر خیاطی بردارید، سینه و کمرتان را اندازه بگیرید و با جدول‌های زیر مقایسه کنید. اگر
          بین دو سایز بودید، سایز بزرگ‌تر را انتخاب کنید — برش‌های LBB معمولاً اورسایز هستند.
        </p>
        <div className="flex flex-col gap-6">
          <Table title="هودی و تیشرت" rows={topsSizes} />
          <Table title="شلوار" rows={pantsSizes} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
