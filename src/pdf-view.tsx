import React, { useEffect, useState } from 'react';
import { screenDimensions } from './constants';
import ZoomableView from './zoomable-view';
import { Image } from 'react-native';
import { RnAndroidPdf } from './render';
import { rnPdfRendererStorage } from './storage';

interface IPdfView {
  index: number;
  screenHeight: number;
}
const PdfView: React.FC<IPdfView> = ({
  index,
  screenHeight = screenDimensions.windowHeight - 90,
}) => {
  const [pdfItem, setPdfItem] = useState(''); //single pdf item in base64 string format
  const convertSingleItem = async () => {
    //if item exists on the mmkv it will take from mmkv , in most of the case it will be available before visible page reaches there
    //also it will be helpful while scrolling back
    if (rnPdfRendererStorage.contains(`${index}`)) {
      const pdf = rnPdfRendererStorage?.getString(`${index}`) || '';
      setPdfItem(pdf);
      return;
    }
    //if its not available locally it will be rendered again
    let pdf = await RnAndroidPdf.convertSingleItem(index);
    rnPdfRendererStorage.set(`${index}`, pdf?.bmp || '');
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
