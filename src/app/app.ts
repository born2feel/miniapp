import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TuiButton, TuiRoot } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { ThemeService } from './core/theme.service';
import { BrowserDemoPlatform } from './platform/browser-demo.platform';
import { MESSENGER_PLATFORM } from './platform/messenger-platform';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, TuiButton, TuiBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly theme = inject(ThemeService);
  private readonly platform = inject(MESSENGER_PLATFORM);

  /** A browser has no native Back button, so we render our own bar. */
  protected readonly demo = this.platform instanceof BrowserDemoPlatform ? this.platform : null;
  protected readonly backHandler = computed(() => this.demo?.backHandler() ?? null);
}
