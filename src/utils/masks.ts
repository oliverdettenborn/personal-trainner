export function maskDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function maskWeight(value: string): string {
  const clean = value.replace(/\s*kg\s*$/i, "").replace(/[^\d,]/g, "");
  if (!clean) return "";
  return `${clean} kg`;
}

export function maskCm(value: string): string {
  const clean = value.replace(/\s*cm\s*$/i, "").replace(/[^\d,]/g, "");
  if (!clean) return "";
  return `${clean} cm`;
}
