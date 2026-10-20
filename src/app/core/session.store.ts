import { Injectable, computed, inject, signal } from '@angular/core';
import { ProfileApiService, ProfileNotFoundError } from '../api/profile-api.service';
import { ClientProfileResponse } from '../api/profile.types';

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

const PHONE_STORAGE_KEY = 'beauty-club.phone';

/** Client session state: phone number and the loaded profile. */
@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly api = inject(ProfileApiService);

  private readonly phoneState = signal<string | null>(readPhone());
  private readonly profileState = signal<ClientProfileResponse | null>(null);
  private readonly statusState = signal<LoadStatus>('idle');
  private readonly errorState = signal<string | null>(null);

  readonly phone = this.phoneState.asReadonly();
  readonly profile = this.profileState.asReadonly();
  readonly status = this.statusState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly isLoading = computed(() => this.statusState() === 'loading' || this.statusState() === 'idle');
  readonly client = computed(() => this.profileState()?.client ?? null);

  /** The request we are still waiting for: guards against races on quick retries. */
  private requestId = 0;

  async signIn(phone: string): Promise<void> {
    this.phoneState.set(phone);
    writePhone(phone);
    this.profileState.set(null);
    await this.load();
  }

  /** Load the profile if the phone is known but the profile has not been fetched yet. */
  ensureLoaded(): void {
    if (this.phoneState() && this.statusState() === 'idle') {
      void this.load();
    }
  }

  async load(): Promise<void> {
    const phone = this.phoneState();
    if (!phone) {
      return;
    }

    const requestId = ++this.requestId;
    this.statusState.set('loading');
    this.errorState.set(null);

    try {
      const profile = await this.api.getProfile(phone);
      if (requestId === this.requestId) {
        this.profileState.set(profile);
        this.statusState.set('ready');
      }
    } catch (error) {
      if (requestId === this.requestId) {
        this.errorState.set(
          error instanceof ProfileNotFoundError
            ? 'We could not find a client with this number. Please contact customer care.'
            : 'Could not load your data. Check your connection and try again.',
        );
        this.statusState.set('error');
      }
    }
  }

  signOut(): void {
    this.requestId++;
    this.phoneState.set(null);
    this.profileState.set(null);
    this.statusState.set('idle');
    this.errorState.set(null);
    writePhone(null);
  }
}

function readPhone(): string | null {
  try {
    return sessionStorage.getItem(PHONE_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writePhone(phone: string | null): void {
  try {
    if (phone) {
      sessionStorage.setItem(PHONE_STORAGE_KEY, phone);
    } else {
      sessionStorage.removeItem(PHONE_STORAGE_KEY);
    }
  } catch {
    // Storage is unavailable (private mode) — the session lives until reload.
  }
}
