/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PdfScreen from './pdf-screen';
export const Stack = createNativeStackNavigator();
function App(): JSX.Element {
  /**
   *  <RNAndroidPDF.PDFLite
      uri={pdfArray}
      onError={onError}
      onRendering={onRendering}
      loaderMessage="loading demo"
    />
   */
  return <PdfScreen />;
}

export default App;
