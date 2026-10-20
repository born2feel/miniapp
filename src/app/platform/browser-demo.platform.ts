import { signal } from '@angular/core';
import {
  HapticType,
  MessengerPlatform,
  PlatformTheme,
  isSafeExternalUrl,
  isValidUsername,
} from './messenger-platform';
import { DEMO_PHONES } from '../api/profile.mocks';

const darkQuery = (): MediaQueryList => window.matchMedia('(prefers-color-scheme: dark)');

/**
 * Running outside the messenger: a test number instead of a contact request,
 * t.me links in a new tab, theme from the OS settings.
 */
export class BrowserDemoPlatform implements MessengerPlatform {
  readonly name = 'browser';
  readonly label = 'Demo mode';

  /** The number the user "shares". Switched on the login screen. */
  readonly demoPhone = signal<string>(DEMO_PHONES[0].phone);

  /** There is no native Back button, so the app renders its own from this signal. */
  readonly backHandler = signal<(() => void) | null>(null);

  ready(): void {
    // Nothing to notify in a browser.
  }

  expand(): void {
    // The browser window is already expanded.
  }

  getTheme(): PlatformTheme {
    return { scheme: darkQuery().matches ? 'dark' : 'light', colors: {} };
  }

  onThemeChange(callback: (theme: PlatformTheme) => void): () => void {
    const query = darkQuery();
    const handler = (): void => callback(this.getTheme());
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }

  requestPhone(): Promise<string | null> {
    return Promise.resolve(this.demoPhone());
  }

  openChat(username: string, text: string): void {
    if (!isValidUsername(username)) {
      return;
    }
    this.openLink(`https://t.me/${username}?text=${encodeURIComponent(text)}`);
  }

  openLink(url: string): void {
    if (isSafeExternalUrl(url)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  showBackButton(callback: () => void): void {
    this.backHandler.set(callback);
  }

  hideBackButton(): void {
    this.backHandler.set(null);
  }

  haptic(type?: HapticType): void {
    void type;
  }
}
