import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
   appId: 'com.nadir.mydigitalwallet',
  appName: 'MyDigitalWallet',
  webDir: 'www',
plugins: {
  SocialLogin: {
    google: {
      clientId: "54339445930-3q5kn0scqub56hkeuoc42arqdmbbpuhn.apps.googleusercontent.com"
    }
  }
}
};

export default config;
