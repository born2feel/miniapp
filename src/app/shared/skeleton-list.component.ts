import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TuiSkeleton } from '@taiga-ui/kit';

/** Loading placeholder that mimics the shape of the screen's cards. */
@Component({
  selector: 'app-skeleton-list',
  imports: [TuiSkeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="list" aria-busy="true" aria-label="Loading">
      @for (item of items(); track item) {
        <div class="item" [style.height.px]="height()" [tuiSkeleton]="true"></div>
      }
    </div>
  `,
  styles: `
    .list {
      display: grid;
      gap: 0.75rem;
    }

    .item {
      border-radius: var(--app-radius);
    }
  `,
})
export class SkeletonListComponent {
  readonly count = input(3);
  readonly height = input(96);

  protected readonly items = computed(() => Array.from({ length: this.count() }, (_, i) => i));
}
