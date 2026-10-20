/** English plural: plural(3, ['bonus', 'bonuses']) → 'bonuses'. */
export function plural(count: number, forms: readonly [string, string]): string {
  return Math.abs(count) === 1 ? forms[0] : forms[1];
}

/** +15550100001 → +1 (555) 010-0001 */
export function formatPhone(phone: string): string {
  const match = /^\+1(\d{3})(\d{3})(\d{4})$/.exec(phone);
  return match ? `+1 (${match[1]}) ${match[2]}-${match[3]}` : phone;
}
