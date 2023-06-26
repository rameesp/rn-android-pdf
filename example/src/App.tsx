/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect, useState } from 'react';

import { ActivityIndicator } from 'react-native';

import ReactNativeBlobUtil from 'react-native-blob-util';
import { PDF } from 'rn-android-pdf';
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
  /**
   *  <RNAndroidPDF.PDFLite
      uri={pdfArray}
      onError={onError}
      onRendering={onRendering}
      loaderMessage="loading demo"
    />
   */
  return pdfArray?.length > 0 ? (
    <PDF
      uri={pdfArray || ''}
      loaderMessage={'Please wait while the contents are being rendered. '}
      onRendering={onRendering}
      onError={onError}
      onPageChange={onPageChange}
      onBackPress={() => {
        console.log('back');
      }}
      onDownloadPress={() => {
        console.log('download');
      }}
      onMeasurePages={(totalPages) => {
        console.log(totalPages);
      }}
    />
  ) : (
    <ActivityIndicator />
  );
}

export default App;
