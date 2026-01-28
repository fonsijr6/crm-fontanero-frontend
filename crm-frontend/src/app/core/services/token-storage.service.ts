import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const TOKEN_KEY = 'crm_access_token';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get(): string | null {
    if (!this.isBrowser) return null;
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  set(token: string) {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {}
  }

  remove() {
    if (!this.isBrowser) return;
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
  }
}