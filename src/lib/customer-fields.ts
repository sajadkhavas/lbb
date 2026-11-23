export function asciiDigits(value: string) {
  return value.replace(/[۰-۹٠-٩]/g, (digit) =>
    String(digit.charCodeAt(0) - (digit >= "۰" ? 0x06f0 : 0x0660)),
  );
}

export function hasFullName(value: string) {
  return value.trim().split(/\s+/).filter((part) => /\p{L}/u.test(part)).length >= 2;
}

export function normalizePostalCode(value: string) {
  return asciiDigits(value).replace(/[\s-]+/g, "");
}

export function validPostalCode(value: string) {
  const code = normalizePostalCode(value);
  return /^[0-9]{10}$/.test(code) && !/^(\d)\1{9}$/.test(code)
    && !["1234567890", "0123456789", "0987654321", "9876543210"].includes(code);
}

export const POSTAL_CODE_ERROR = "کد پستی واقعی ۱۰ رقمی را وارد کنید.";
