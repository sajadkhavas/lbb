const NAMES: Record<string, string> = {
  "#0A0A0A": "مشکی",
  "#000000": "مشکی",
  "#FFFFFF": "سفید",
  "#F5F5F5": "سفید",
  "#E30613": "قرمز",
  "#FF0000": "قرمز",
  "#808080": "طوسی",
  "#9E9E9E": "طوسی",
  "#1F3A5F": "سرمه‌ای",
  "#1E3A5F": "سرمه‌ای",
};

export function colorName(hex: string): string {
  return NAMES[hex.toUpperCase()] ?? hex;
}
