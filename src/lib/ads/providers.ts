import type { AdProvider, AdRequest, AdResult } from '@/types';

/** Lokale Entwicklung: zeigt eine klar gekennzeichnete Beispielanzeige, keine echten IDs. */
export class MockAdProvider implements AdProvider {
  readonly id = 'mock';
  isReady() { return true; }
  async show(req: AdRequest): Promise<AdResult> {
    await new Promise((r) => setTimeout(r, req.kind === 'rewarded' ? 800 : 120));
    return { shown: true, rewardGranted: req.kind === 'rewarded' };
  }
}

/** Platzhalter für Google AdSense im Web. Enthält bewusst KEINE echte Publisher-ID. */
export class WebAdProvider implements AdProvider {
  readonly id = 'web-adsense';
  constructor(private readonly clientId: string | null = null) {}
  isReady() { return Boolean(this.clientId); }
  async show(): Promise<AdResult> {
    if (!this.isReady()) return { shown: false, reason: 'not-configured' };
    return { shown: false, reason: 'not-implemented-in-mvp' };
  }
}

/** Platzhalter für Google AdMob nach dem Capacitor-Packaging. */
export class NativeAdProvider implements AdProvider {
  readonly id = 'native-admob';
  isReady() { return false; }
  async show(): Promise<AdResult> {
    return { shown: false, reason: 'native-bridge-missing' };
  }
}

export function createAdProvider(kind: 'mock' | 'web' | 'native' = 'mock'): AdProvider {
  if (kind === 'web') return new WebAdProvider(null);
  if (kind === 'native') return new NativeAdProvider();
  return new MockAdProvider();
}
