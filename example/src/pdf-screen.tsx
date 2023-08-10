import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { PDF } from 'rn-android-pdf';

const PdfScreen = () => {
  const [pdfUri, setPdfUri] = useState<string>('');
  useEffect(() => {
    convertPdfToImage();
  }, []);
  const convertPdfToImage = async () => {
    ReactNativeBlobUtil.config({
      fileCache: true,
      appendExt: 'pdf',
    })
      .fetch(
        'GET',
        'https://cdn.exampur.xyz/course_material/646ec52328b90ea7c5faa666/oBfxZtB2-25-May-2023-pdf'
      )
      .then(async (res) => {
        setPdfUri(res?.path());
      });
  };

  const onPageChange = useCallback(() => {}, []);
  const onError = useCallback(() => {}, []);
  return pdfUri?.length > 0 ? (
    <PDF
      uri={pdfUri || ''}
      loaderMessage={'Please wait while the contents are being rendered. '}
      onError={onError}
      onPageChange={onPageChange}
      isActionBarEnabled={true}
      onBackPress={() => {}}
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
};

export default PdfScreen;
