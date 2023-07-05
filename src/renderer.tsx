import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  "The package 'rn-android-pdf' doesn't seem to be linked. Make sure: \n\n" +
  Platform.select({ ios: "-this package wont work on ios'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';
export const RnAndroidPdf = NativeModules.RnAndroidPdf
  ? NativeModules.RnAndroidPdf
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );
