import { Provider } from '@angular/core';
import { BrowserDemoPlatform } from './browser-demo.platform';
import { MESSENGER_PLATFORM, MessengerPlatform } from './messenger-platform';
import { TelegramPlatform } from './telegram.platform';

/**
 * The Telegram SDK is loaded in index.html and creates `window.Telegram.WebApp` in any browser,
 * so a non-empty initData is what tells us we are running inside the messenger.
 */
export function detectPlatform(win: Window = window): MessengerPlatform {
  const telegram = win.Telegram?.WebApp;
  if (telegram?.initData) {
    return new TelegramPlatform(telegram);
  }
  return new BrowserDemoPlatform();
}

export function provideMessengerPlatform(): Provider {
  return { provide: MESSENGER_PLATFORM, useFactory: () => detectPlatform() };
}
