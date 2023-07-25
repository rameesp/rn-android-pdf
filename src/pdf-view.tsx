import React, { useEffect, useState } from 'react';
import { screenDimensions } from './constants';
import ZoomableView from './zoomable-view';
import { Image } from 'react-native';
import { RnAndroidPdf } from './render';
import { storage } from './storage';

interface IPdfView {
  index: number;
  screenHeight: number;
}
const PdfView: React.FC<IPdfView> = ({
  index,
  screenHeight = screenDimensions.windowHeight - 90,
}) => {
  const [pdfItem, setPdfItem] = useState('');
  const convertSingleItem = async () => {
    if (storage.contains(`${index}`)) {
      const pdf = storage?.getString(`${index}`) || '';
      setPdfItem(pdf);
      return;
    }
    let pdf = await RnAndroidPdf.convertSingleItem(index);
    storage.set(`${index}`, pdf?.bmp || '');
    setPdfItem(pdf?.bmp);
  };
  useEffect(() => {
    convertSingleItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);
  return (
    <ZoomableView screenHeight={screenHeight}>
      <Image
        resizeMode={'contain'}
        defaultSource={require('../src/image/loaderBg.png')}
        style={{
          width: screenDimensions.windowWidth,
          height: screenHeight,
        }}
        source={{
          uri: `data:image/png;base64,${pdfItem}`,
        }}
      />
    </ZoomableView>
  );
};

export default React.memo(PdfView);
