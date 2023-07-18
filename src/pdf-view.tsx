import React, { useEffect, useState } from 'react';
import { screenDimensions } from './constants';
import ZoomableView from './zoomable-view';
import { Image } from 'react-native';
import { RnAndroidPdf } from './render';
import { storage } from './storage';

interface IPdfView {
  index: number;
}
const PdfView: React.FC<IPdfView> = ({ index }) => {
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
    <ZoomableView>
      <Image
        resizeMode={'contain'}
        style={{
          width: screenDimensions.windowWidth,
          height: screenDimensions.windowHeight - 90,
        }}
        source={{
          uri: `data:image/png;base64,${pdfItem}`,
        }}
      />
    </ZoomableView>
  );
};

export default React.memo(PdfView);
