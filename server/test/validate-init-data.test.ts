import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { describe, it } from 'node:test';
import { validateTelegramInitData } from '../src/validate-init-data.ts';

// Fake token for tests only — not a real bot.
const BOT_TOKEN = '123456789:TEST_ONLY_fake_token_for_unit_tests';
const NOW = new Date('2026-10-20T12:00:00Z');
const nowSeconds = Math.floor(NOW.getTime() / 1000);

/** Signs fields the same way Telegram does. */
function signInitData(fields: Record<string, string>, token = BOT_TOKEN): string {
  const dataCheckString = Object.keys(fields)
    .sort()
    .map((key) => `${key}=${fields[key]}`)
    .join('\n');
  const secretKey = createHmac('sha256', 'WebAppData').update(token).digest();
  const hash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
  return new URLSearchParams({ ...fields, hash }).toString();
}

const user = JSON.stringify({ id: 42, first_name: 'Zoë', username: 'demo_zoe' });

describe('validateTelegramInitData', () => {
  it('accepts correctly signed data', () => {
    const initData = signInitData({
      auth_date: String(nowSeconds - 60),
      query_id: 'AAE_test_query',
      user,
    });

    const result = validateTelegramInitData(initData, BOT_TOKEN, { now: NOW });

    assert.equal(result.ok, true);
    assert.ok(result.ok);
    assert.equal(result.data.user?.id, 42);
    assert.equal(result.data.user?.first_name, 'Zoë');
    assert.equal(result.data.queryId, 'AAE_test_query');
  });

  it('rejects tampered user data', () => {
    const initData = signInitData({ auth_date: String(nowSeconds - 60), user });
    const tampered = initData.replace(encodeURIComponent('"id":42'), encodeURIComponent('"id":1'));
    assert.notEqual(tampered, initData);

    const result = validateTelegramInitData(tampered, BOT_TOKEN, { now: NOW });

    assert.deepEqual(result, { ok: false, error: 'invalid_hash' });
  });

  it('rejects an injected field', () => {
    const initData = signInitData({ auth_date: String(nowSeconds - 60), user });

    const result = validateTelegramInitData(`${initData}&chat_type=private`, BOT_TOKEN, { now: NOW });

    assert.deepEqual(result, { ok: false, error: 'invalid_hash' });
  });

  it('rejects data signed by another bot', () => {
    const initData = signInitData({ auth_date: String(nowSeconds - 60), user }, '987654321:OTHER_fake_token');

    const result = validateTelegramInitData(initData, BOT_TOKEN, { now: NOW });

    assert.deepEqual(result, { ok: false, error: 'invalid_hash' });
  });

  it('rejects an expired auth_date', () => {
    const initData = signInitData({ auth_date: String(nowSeconds - 2 * 60 * 60), user });

    const result = validateTelegramInitData(initData, BOT_TOKEN, { now: NOW, maxAgeSeconds: 60 * 60 });

    assert.deepEqual(result, { ok: false, error: 'expired' });
  });

  it('rejects an auth_date in the future', () => {
    const initData = signInitData({ auth_date: String(nowSeconds + 10 * 60), user });

    const result = validateTelegramInitData(initData, BOT_TOKEN, { now: NOW });

    assert.deepEqual(result, { ok: false, error: 'auth_date_in_future' });
  });

  it('rejects data without hash', () => {
    const initData = new URLSearchParams({ auth_date: String(nowSeconds), user }).toString();

    const result = validateTelegramInitData(initData, BOT_TOKEN, { now: NOW });

    assert.deepEqual(result, { ok: false, error: 'missing_hash' });
  });

  it('fails without a bot token', () => {
    const initData = signInitData({ auth_date: String(nowSeconds), user });

    const result = validateTelegramInitData(initData, '', { now: NOW });

    assert.deepEqual(result, { ok: false, error: 'missing_bot_token' });
  });
});
