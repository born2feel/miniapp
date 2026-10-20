import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { MESSENGER_PLATFORM, PlatformTheme, ThemeColors } from '../platform/messenger-platform';

/** Which Taiga UI CSS variables are recolored from the messenger's theme params. */
const TAIGA_VARS: Record<keyof ThemeColors, string[]> = {
  bg_color: ['--tui-background-base', '--app-bg'],
  secondary_bg_color: ['--tui-background-base-alt', '--app-bg-secondary'],
  text_color: ['--tui-text-primary'],
  hint_color: ['--tui-text-secondary', '--tui-text-tertiary'],
  link_color: ['--tui-text-action'],
  button_color: ['--tui-background-accent-1', '--tui-background-accent-1-hover', '--tui-background-accent-1-pressed'],
  button_text_color: ['--tui-text-primary-on-accent-1'],
  destructive_text_color: ['--tui-text-negative'],
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platform = inject(MESSENGER_PLATFORM);
  private readonly theme = signal<PlatformTheme>(this.platform.getTheme());

  readonly scheme = computed(() => this.theme().scheme);

  /** Inline styles for `tui-root`: override the Taiga palette with messenger colors. */
  readonly cssVars = computed(() => {
    const vars: Record<string, string> = {};
    for (const [key, value] of Object.entries(this.theme().colors)) {
      for (const cssVar of TAIGA_VARS[key as keyof ThemeColors] ?? []) {
        if (value) {
          vars[cssVar] = value;
        }
      }
    }
    return vars;
  });

  constructor() {
    const unsubscribe = this.platform.onThemeChange((theme) => this.theme.set(theme));
    inject(DestroyRef).onDestroy(unsubscribe);
  }
}
