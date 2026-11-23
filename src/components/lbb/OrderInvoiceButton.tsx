import { useState } from "react";
import { getOrder, type OrderDto } from "@/lib/backend-api";
import { fmtToman } from "@/lib/products";
import { CtaClasses } from "@/components/lbb/ui/primitives";

const escape = (value: string | number | null | undefined) =>
  String(value ?? "—").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char] ?? char,
  );

export function OrderInvoiceButton({ order }: { order: OrderDto }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (!order.paidAt) return null;

  const showInvoice = async () => {
    const preview = window.open("", "_blank");
    if (!preview) {
      setError("برای باز کردن فاکتور، اجازهٔ باز شدن پنجرهٔ جدید را بدهید.");
      return;
    }
    preview.opener = null;
    preview.document.body.textContent = "در حال دریافت فاکتور…";
    setBusy(true);
    setError("");
    try {
      const { data } = await getOrder(order.id);
      const paid = data.order;
      if (!paid.paidAt || !paid.items.length) throw new Error("Invoice unavailable");
      if (preview.closed) return;
      const money = (value: number | undefined) => (value === undefined ? "—" : fmtToman(value));
      const rows = paid.items
        .map(
          (item) =>
            `<tr><td>${escape(item.productName)}<small>${escape([item.colorName, item.sizeName].filter(Boolean).join(" / "))}</small></td><td>${escape(item.quantity)}</td><td>${escape(money(item.unitPriceToman))}</td><td>${escape(money(item.lineTotalToman))}</td></tr>`,
        )
        .join("");
      const totals = [
        ["جمع کالاها", paid.totals.subtotalToman],
        ["ارسال", paid.totals.deliveryFeeToman],
        ["بسته‌بندی", paid.totals.packagingFeeToman],
        ["تخفیف", paid.totals.discountToman],
        ["مبلغ سفارش", paid.totals.grandTotalToman],
      ]
        .map(
          ([label, amount]) =>
            `<div><dt>${escape(label)}</dt><dd>${escape(money(Number(amount)))}</dd></div>`,
        )
        .join("");
      preview.document.open();
      preview.document.write(`<!doctype html><html lang="fa" dir="rtl"><head>
        <meta charset="utf-8"><meta name="robots" content="noindex,nofollow">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>فاکتور سفارش ${escape(paid.number)} | LBB</title>
        <style>
          body{font:15px/1.8 Tahoma,Arial,sans-serif;color:#191919;background:#fff;margin:28px auto;padding:0 16px;max-width:800px}
          header{border-bottom:3px solid #e63535;padding-bottom:14px}h1{font-size:24px;margin:4px 0}
          table{width:100%;border-collapse:collapse;margin:24px 0}td,th{padding:8px 4px;text-align:right;border-bottom:1px solid #ddd}
          small{display:block;color:#555}dl{max-width:360px;margin-inline-start:auto}dl div{display:flex;justify-content:space-between;border-bottom:1px solid #ddd;padding:6px}dd{margin:0}
          button{padding:9px 16px;margin:10px 0;cursor:pointer} @media print{button{display:none}tr{break-inside:avoid}body{margin:0}}
        </style></head><body>
        <button id="save" type="button">چاپ یا ذخیره PDF</button>
        <header><strong>LBB</strong><h1>فاکتور سفارش</h1><div>شماره سفارش: ${escape(paid.number)}</div>
        <div>تاریخ پرداخت: ${escape(new Date(paid.paidAt).toLocaleString("fa-IR", { timeZone: "Asia/Tehran" }))}</div>
        <div>وضعیت پرداخت: ${escape(paid.paymentStatusLabel)}</div></header>
        <p>خریدار: ${escape(paid.recipient.fullName)}</p>
        <table><thead><tr><th>محصول</th><th>تعداد</th><th>قیمت واحد</th><th>مبلغ</th></tr></thead><tbody>${rows}</tbody></table>
        <dl>${totals}</dl></body></html>`);
      preview.document.close();
      preview.document.getElementById("save")?.addEventListener("click", () => preview.print());
    } catch {
      preview.close();
      setError("فاکتور دریافت نشد. از حساب کاربری دوباره امتحان کنید.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className={CtaClasses("line", "sm")}
        disabled={busy}
        onClick={showInvoice}
      >
        {busy ? "در حال دریافت…" : "دریافت فاکتور"}
      </button>
      {error && (
        <p className="mt-2 text-sm text-signal" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
