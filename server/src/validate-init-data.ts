import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Validates Telegram Mini App initData using the official algorithm:
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 *
 * 1. data_check_string — all received fields except `hash`, sorted by key,
 *    formatted as `key=value` and joined with line feeds.
 * 2. secret_key = HMAC_SHA256(key = "WebAppData", data = bot_token).
 * 3. hex(HMAC_SHA256(key = secret_key, data = data_check_string)) must equal `hash`.
 * 4. Additionally: `auth_date` must be no older than `maxAgeSeconds` and not in the future,
 *    so an intercepted string cannot be replayed.
 */

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface ValidInitData {
  authDate: Date;
  user: TelegramUser | null;
  queryId: string | null;
  /** All initData fields as-is, for logging and debugging. */
  raw: Record<string, string>;
}

export type InitDataError =
  | 'missing_bot_token'
  | 'missing_hash'
  | 'invalid_hash'
  | 'missing_auth_date'
  | 'auth_date_in_future'
  | 'expired'
  | 'invalid_user';

export type ValidationResult =
  | { ok: true; data: ValidInitData }
  | { ok: false; error: InitDataError };

export interface ValidateOptions {
  /** How many seconds initData stays fresh. Defaults to one day. */
  maxAgeSeconds?: number;
  /** Current time — needed for deterministic tests. */
  now?: Date;
}

const DEFAULT_MAX_AGE_SECONDS = 24 * 60 * 60;
/** Allowed clock skew between the server and Telegram. */
const CLOCK_SKEW_SECONDS = 60;

export function validateTelegramInitData(
  initData: string,
  botToken: string,
  options: ValidateOptions = {},
): ValidationResult {
  if (!botToken) {
    return { ok: false, error: 'missing_bot_token' };
  }

  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) {
    return { ok: false, error: 'missing_hash' };
  }
  params.delete('hash');

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const expected = createHmac('sha256', secretKey).update(dataCheckString).digest();
  const received = Buffer.from(hash, 'hex');

  // Constant-time comparison so timing does not leak information to an attacker.
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    return { ok: false, error: 'invalid_hash' };
  }

  const authDateSeconds = Number(params.get('auth_date'));
  if (!Number.isInteger(authDateSeconds) || authDateSeconds <= 0) {
    return { ok: false, error: 'missing_auth_date' };
  }

  const nowSeconds = Math.floor((options.now ?? new Date()).getTime() / 1000);
  if (authDateSeconds - nowSeconds > CLOCK_SKEW_SECONDS) {
    return { ok: false, error: 'auth_date_in_future' };
  }

  const maxAge = options.maxAgeSeconds ?? DEFAULT_MAX_AGE_SECONDS;
  if (nowSeconds - authDateSeconds > maxAge) {
    return { ok: false, error: 'expired' };
  }

  let user: TelegramUser | null = null;
  const userJson = params.get('user');
  if (userJson) {
    try {
      user = JSON.parse(userJson) as TelegramUser;
    } catch {
      return { ok: false, error: 'invalid_user' };
    }
    if (typeof user !== 'object' || user === null || !Number.isSafeInteger(user.id)) {
      return { ok: false, error: 'invalid_user' };
    }
  }

  return {
    ok: true,
    data: {
      authDate: new Date(authDateSeconds * 1000),
      user,
      queryId: params.get('query_id'),
      raw: Object.fromEntries(params.entries()),
    },
  };
}
