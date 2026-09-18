/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_AD_PROVIDER?: 'mock' | 'web' | 'native';
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
