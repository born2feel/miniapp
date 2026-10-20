import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiBlockStatus } from '@taiga-ui/layout';
import { SessionStore } from '../core/session.store';
import { MESSENGER_PLATFORM } from '../platform/messenger-platform';

/** Profile loading error with a Retry button. */
@Component({
  selector: 'app-error-state',
  imports: [TuiBlockStatus, TuiButton, TuiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tui-block-status role="alert">
      <tui-icon tuiSlot="top" icon="@tui.cloud-off" class="icon" />
      <h2>Something went wrong</h2>
      {{ store.error() }}
      <button tuiButton type="button" size="m" (click)="retry()">Retry</button>
    </tui-block-status>
  `,
  styles: `
    .icon {
      font-size: 3rem;
      color: var(--tui-status-negative);
    }
  `,
})
export class ErrorStateComponent {
  protected readonly store = inject(SessionStore);
  private readonly platform = inject(MESSENGER_PLATFORM);

  protected retry(): void {
    this.platform.haptic();
    void this.store.load();
  }
}
