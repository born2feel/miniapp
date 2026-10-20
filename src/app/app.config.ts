import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideEventPlugins } from '@taiga-ui/event-plugins';
import { routes } from './app.routes';
import { BackButtonService } from './core/back-button.service';
import { provideMessengerPlatform } from './platform/platform.factory';
import { MESSENGER_PLATFORM } from './platform/messenger-platform';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),
    provideEventPlugins(),
    provideRouter(routes, withComponentInputBinding()),
    provideMessengerPlatform(),
    provideAppInitializer(() => {
      const platform = inject(MESSENGER_PLATFORM);
      platform.ready();
      platform.expand();
      inject(BackButtonService).init();
    }),
  ],
};
