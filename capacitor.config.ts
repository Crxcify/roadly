import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.roadly.app',
  appName: 'Roadly',
  webDir: 'dist/client',
  server: {
    url: 'https://roadlyapp.lovable.app',
    cleartext: true
  }
};

export default config;
