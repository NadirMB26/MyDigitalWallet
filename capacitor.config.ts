import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'MyDigitalWallet',
  webDir: 'www',
plugins: {
  SocialLogin: {
    google: {
      clientId: "TU_CLIENT_ID.apps.googleusercontent.com"
    }
  }
}
};

export default config;
