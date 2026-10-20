/** English plural: plural(3, ['bonus', 'bonuses']) → 'bonuses'. */
export function plural(count: number, forms: readonly [string, string]): string {
  return Math.abs(count) === 1 ? forms[0] : forms[1];
}

/** +79990000001 → +7 999 000-00-01 */
export function formatPhone(phone: string): string {
  const match = /^\+7(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(phone);
  return match ? `+7 ${match[1]} ${match[2]}-${match[3]}-${match[4]}` : phone;
}
