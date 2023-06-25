/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect, useState } from 'react';

import { ActivityIndicator } from 'react-native';

import ReactNativeBlobUtil from 'react-native-blob-util';
import PdfRenderer from 'rn-android-pdf';
function App(): JSX.Element {
  const [pdfArray, setPdfArray] = useState<string>('');

  const convertPdfToImage = async () => {
    ReactNativeBlobUtil.config({
      fileCache: true,
      appendExt: 'pdf',
    })
      .fetch(
        'GET',
        'https://cdn.exampur.xyz/course_material/646ec52328b90ea7c5faa666/oBfxZtB2-25-May-2023-pdf',
        {
          //some headers ..
        }
      )
      .then(async (res) => {
        console.log('Download done');
        setPdfArray(res.path());
      });
  };
  useEffect(() => {
    convertPdfToImage();
  }, []);
  const onRendering = useCallback((rendering) => {
    console.log(rendering);
  }, []);
  const onPageChange = useCallback((page: number) => {
    console.log(page);
  }, []);
  const onError = useCallback((err) => {
    console.log(err);
  }, []);
  return pdfArray?.length > 0 ? (
    <PdfRenderer
      uri={pdfArray || ''}
      onRendering={onRendering}
      onError={onError}
      onPageChange={onPageChange}
    />
  ) : (
    <ActivityIndicator />
  );
}

export default App;
