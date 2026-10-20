import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { TuiBlockStatus } from '@taiga-ui/layout';

@Component({
  selector: 'app-empty-state',
  imports: [TuiBlockStatus, TuiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tui-block-status>
      <tui-icon tuiSlot="top" class="icon" [icon]="icon()" />
      <h2>{{ title() }}</h2>
      <ng-content />
    </tui-block-status>
  `,
  styles: `
    .icon {
      font-size: 3rem;
      color: var(--tui-text-tertiary);
    }
  `,
})
export class EmptyStateComponent {
  readonly icon = input('@tui.inbox');
  readonly title = input.required<string>();
}
