export function canonicalUuid(value: string): string {
  const compact = value.replaceAll('-', '').toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(compact)) {
    return value;
  }
  return `${compact.slice(0, 8)}-${compact.slice(8, 12)}-${compact.slice(12, 16)}-${compact.slice(16, 20)}-${compact.slice(20)}`;
}

export function databaseUuid(value: string): string {
  return value.replaceAll('-', '').toLowerCase();
}

export function apiDate(value: string): string {
  let normalized = value.includes('T') ? value : value.replace(' ', 'T');
  normalized = normalized.replace(/(\.\d{3})\d+/, '$1');
  if (!/[zZ]|[+-]\d\d:\d\d$/.test(normalized)) {
    normalized += 'Z';
  }
  const date = new Date(normalized);
  return Number.isNaN(date.valueOf()) ? value : date.toISOString();
}
