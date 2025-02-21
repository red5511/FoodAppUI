import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'angular-foodapp',
  webDir: 'dist/angular-foodapp/browser',
  server: {
    cleartext: true,  // 👈 Allow HTTP requests
    androidScheme: 'http' // 👈 Force HTTP instead of HTTPS
  }
};

export default config;
