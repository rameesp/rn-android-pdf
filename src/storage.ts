import { MMKV } from 'react-native-mmkv';

export const rnPdfRendererStorage = new MMKV({
  id: 'key@com.rnandroidpdf',
  encryptionKey: 'encryption#com.rnandroidpdf',
});
