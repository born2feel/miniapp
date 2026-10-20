import {
  HapticType,
  MessengerPlatform,
  PlatformTheme,
  ThemeColors,
  isSafeExternalUrl,
  isValidUsername,
  normalizePhone,
} from './messenger-platform';

/**
 * Minimal types for the part of Telegram.WebApp the app uses.
 * Docs: https://core.telegram.org/bots/webapps
 */
interface TelegramContactResponse {
  status?: 'sent' | 'cancelled';
  responseUnsafe?: { contact?: { phone_number?: string } };
}

export interface TelegramWebApp {
  initData: string;
  colorScheme: 'light' | 'dark';
  themeParams: ThemeColors;
  ready(): void;
  expand(): void;
  onEvent(event: 'themeChanged', handler: () => void): void;
  offEvent(event: 'themeChanged', handler: () => void): void;
  requestContact(callback: (shared: boolean, response?: TelegramContactResponse) => void): void;
  openTelegramLink(url: string): void;
  openLink(url: string): void;
  BackButton: {
    show(): void;
    hide(): void;
    onClick(handler: () => void): void;
    offClick(handler: () => void): void;
  };
  HapticFeedback: {
    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
    notificationOccurred(type: 'error' | 'success' | 'warning'): void;
  };
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

export class TelegramPlatform implements MessengerPlatform {
  readonly name = 'telegram';
  readonly label = 'Telegram';

  private backHandler: (() => void) | null = null;

  constructor(private readonly webApp: TelegramWebApp) {}

  ready(): void {
    this.webApp.ready();
  }

  expand(): void {
    this.webApp.expand();
  }

  getTheme(): PlatformTheme {
    return { scheme: this.webApp.colorScheme, colors: { ...this.webApp.themeParams } };
  }

  onThemeChange(callback: (theme: PlatformTheme) => void): () => void {
    const handler = (): void => callback(this.getTheme());
    this.webApp.onEvent('themeChanged', handler);
    return () => this.webApp.offEvent('themeChanged', handler);
  }

  requestPhone(): Promise<string | null> {
    return new Promise((resolve) => {
      this.webApp.requestContact((shared, response) => {
        // The number from responseUnsafe is for UX only. The trusted contact reaches
        // the bot as a separate message, and the server verifies it (see README).
        const phone = response?.responseUnsafe?.contact?.phone_number;
        resolve(shared && phone ? normalizePhone(phone) : null);
      });
    });
  }

  openChat(username: string, text: string): void {
    if (!isValidUsername(username)) {
      return;
    }
    this.webApp.openTelegramLink(`https://t.me/${username}?text=${encodeURIComponent(text)}`);
  }

  openLink(url: string): void {
    if (isSafeExternalUrl(url)) {
      this.webApp.openLink(url);
    }
  }

  showBackButton(callback: () => void): void {
    this.hideBackButton();
    this.backHandler = callback;
    this.webApp.BackButton.onClick(callback);
    this.webApp.BackButton.show();
  }

  hideBackButton(): void {
    if (this.backHandler) {
      this.webApp.BackButton.offClick(this.backHandler);
      this.backHandler = null;
    }
    this.webApp.BackButton.hide();
  }

  haptic(type: HapticType = 'light'): void {
    if (type === 'light') {
      this.webApp.HapticFeedback.impactOccurred('light');
    } else {
      this.webApp.HapticFeedback.notificationOccurred(type);
    }
  }
}
