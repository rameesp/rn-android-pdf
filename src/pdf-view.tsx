import React from 'react';
import { screenDimensions } from './constants';
import ZoomableView from './zoomable-view';
import { Image } from 'react-native';

interface IPdfView {
  path: string;
}
const PdfView: React.FC<IPdfView> = ({ path = '' }) => {
  return (
    <ZoomableView>
      <Image
        resizeMode={'contain'}
        style={{
          width: screenDimensions.windowWidth,
          height: screenDimensions.windowHeight - 90,
        }}
        source={{
          uri: `file://${path}`,
        }}
      />
    </ZoomableView>
  );
};

export default React.memo(PdfView);
