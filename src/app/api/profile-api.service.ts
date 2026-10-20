import { Injectable } from '@angular/core';
import { DEMO_ERROR_PHONE, MOCK_PROFILES } from './profile.mocks';
import { ClientProfileResponse, ProfileRequest } from './profile.types';

const MOCK_DELAY_MS = 400;

export class ProfileNotFoundError extends Error {
  constructor() {
    super('No client found with this phone number');
  }
}

/**
 * Mock of POST /api/client/profile. In a real project this would be
 * `httpClient.post<ClientProfileResponse>('/api/client/profile', request)`
 * with the messenger initData in a header for server-side verification.
 */
@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  private errorDemoAttempts = 0;

  getProfile(phone: string): Promise<ClientProfileResponse> {
    const request: ProfileRequest = { phone };

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Error screen demo: the first request fails, "Retry" loads the profile.
        if (request.phone === DEMO_ERROR_PHONE && this.errorDemoAttempts++ % 2 === 0) {
          reject(new Error('Server temporarily unavailable'));
          return;
        }
        const profile = MOCK_PROFILES[request.phone];
        if (profile) {
          resolve(structuredClone(profile));
        } else {
          reject(new ProfileNotFoundError());
        }
      }, MOCK_DELAY_MS);
    });
  }
}
