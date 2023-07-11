import React from 'react';
import FastImage from 'react-native-fast-image';
import { screenDimensions } from './constants';
import ZoomableView from './zoomable-view';
interface IPdfView {
  path: string;
}
const PdfView: React.FC<IPdfView> = ({ path = '' }) => {
  return (
    <ZoomableView>
      <FastImage
        resizeMode={FastImage.resizeMode.contain}
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
