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
    },
    SplashScreen: {
      launchShowDuration: 2000,        // cuánto dura en ms
      launchAutoHide: true,            // se oculta automáticamente
      backgroundColor: "#0d1b2a",      // fondo azul oscuro igual al header
      androidSplashResourceName: "splash",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#4caf50"          // verde igual al acento de la app
    }
  }
};

export default config;