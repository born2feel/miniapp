import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TuiTitle } from '@taiga-ui/core';
import { TuiHeader } from '@taiga-ui/layout';

@Component({
  selector: 'app-page-header',
  imports: [TuiHeader, TuiTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header tuiHeader="h4" class="header">
      <h1 tuiTitle>
        {{ title() }}
        @if (subtitle()) {
          <span tuiSubtitle>{{ subtitle() }}</span>
        }
      </h1>
    </header>
  `,
  styles: `
    .header {
      margin-block-end: 1rem;
    }
  `,
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}
