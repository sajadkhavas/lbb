import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
      <h3 className="mb-2 text-sm font-bold">{title}</h3>
      <div className="overflow-x-auto rounded-lg border border-black/[0.06]">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              {rows[0].map((h) => (
                <th key={h} className="p-2 text-right font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(1).map((r, i) => (
              <tr key={i} className="border-t border-black/[0.06]">
                {r.map((c, j) => (
                  <td key={j} className="p-2">
                    {c}
                  </td>
                ))}
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
      <DialogContent dir="rtl" className="max-h-[85vh] max-w-[520px] overflow-y-auto" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Space Grotesk', sans-serif" }}>راهنمای سایز</DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-7 text-gray-600">
          یه متر خیاطی بردار، سینه و کمرت رو اندازه بگیر، و با جدول‌های پایین مقایسه کن. اگه بین دو سایز بودی، سایز
          بزرگ‌تر رو انتخاب کن — LBB معمولاً برش اورسایز داره.
        </p>
        <div className="flex flex-col gap-5">
          <Table title="هودی و تیشرت" rows={topsSizes} />
          <Table title="شلوار" rows={pantsSizes} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
