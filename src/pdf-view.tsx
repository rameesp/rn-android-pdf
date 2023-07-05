import React from 'react';
import FastImage from 'react-native-fast-image';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import { screenDimensions } from './constants';
interface IPdfView {
  path: string;
}
const PdfView: React.FC<IPdfView> = ({ path = '' }) => {
  return (
    <ReactNativeZoomableView
      maxZoom={4}
      minZoom={1}
      zoomStep={0.5}
      initialZoom={1}
      bindToBorders={true}
      disablePanOnInitialZoom={true}
      movementSensibility={3}
      contentHeight={screenDimensions.windowHeight}
      contentWidth={screenDimensions.windowWidth}
    >
      <FastImage
        resizeMode={FastImage.resizeMode.contain}
        style={{
          width: screenDimensions.windowWidth,
          height: screenDimensions.windowHeight,
        }}
        source={{
          uri: `file://${path}`,
        }}
      />
    </ReactNativeZoomableView>
  );
};

export default PdfView;
