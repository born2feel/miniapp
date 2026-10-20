import { InjectionToken } from '@angular/core';

export type PlatformName = 'telegram' | 'browser';

export type ColorScheme = 'light' | 'dark';

/** Theme colors in Telegram themeParams terms — the shared format for all adapters. */
export interface ThemeColors {
  bg_color?: string;
  secondary_bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  destructive_text_color?: string;
}

export interface PlatformTheme {
  scheme: ColorScheme;
  colors: ThemeColors;
}

export type HapticType = 'light' | 'success' | 'error';

/**
 * A single contract over the messenger SDK. Components and services depend only on it
 * and do not know whether the app runs inside Telegram or in a regular browser.
 */
export interface MessengerPlatform {
  readonly name: PlatformName;
  /** Human-readable name for the UI ("Telegram", "Demo mode"). */
  readonly label: string;

  /** Tell the messenger the UI is ready (hides the native loader). */
  ready(): void;
  /** Expand the mini app to full height. */
  expand(): void;
  getTheme(): PlatformTheme;
  /** Subscribe to theme changes. Returns an unsubscribe function. */
  onThemeChange(callback: (theme: PlatformTheme) => void): () => void;

  /** Ask the user for their phone number. `null` means the user declined. */
  requestPhone(): Promise<string | null>;
  /** Open a chat with `username` and prefill the message text. */
  openChat(username: string, text: string): void;
  /** Open an external link (messenger in-app browser or a new tab). */
  openLink(url: string): void;

  showBackButton(callback: () => void): void;
  hideBackButton(): void;
  haptic(type?: HapticType): void;
}

export const MESSENGER_PLATFORM = new InjectionToken<MessengerPlatform>('MESSENGER_PLATFORM');

/**
 * External links also come from the API (reviewLinks), so only https: is allowed —
 * no `javascript:`, `data:` or other schemes.
 */
export function isSafeExternalUrl(url: string): boolean {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}

/** Telegram username: 5–32 characters, Latin letters, digits and underscores. */
export function isValidUsername(username: string): boolean {
  return /^[A-Za-z0-9_]{5,32}$/.test(username);
}

/** Normalizes a number to +7XXXXXXXXXX (messengers return it in different formats). */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('8')) {
    return `+7${digits.slice(1)}`;
  }
  return `+${digits}`;
}
