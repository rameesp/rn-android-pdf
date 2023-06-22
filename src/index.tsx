import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import { NativeModules, Platform } from 'react-native';
import styles from './style';

const LINKING_ERROR =
  `The package 'rn-android-pdf' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "-this package wont work on ios'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const RnAndroidPdf = NativeModules.RnAndroidPdf
  ? NativeModules.RnAndroidPdf
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
interface IPdfRenderer {
  uri: string;
  onRendering: (loading: boolean) => void;
  onError: (error: string) => void;
  onPageChange: (index: number) => void;
}
/**
 *
 * @param uri local file path of pdf , provide the file after downloading the file
 * @param color background color for the flat list container default value if white
 * @param onRendering loader while rendering the pdf
 * @param onError invoked on error
 * @param onPageChange on page change it will show the current index
 * @returns
 */
const PdfRenderer: React.FC<IPdfRenderer> = ({
  uri,
  onRendering,
  onError,
  onPageChange,
}) => {
  const [pdfArray, setPdfArray] = useState([]); //array of pdf location from string

  /**
   * it will convert the pdf to images and save it on cache directory
   * its a promise once the conversion is done it will return an object with property outputFiles which contain array of filePath
   */
  const convertPDF = async (size: number, skip: number) => {
    try {
      onRendering(true);
      let pdfs = await RnAndroidPdf.convert(size, skip);
      onRendering(false);

      pdfArray.push(...(pdfs?.outputFiles as []));
      setPdfArray(pdfArray);
    } catch (e) {
      onError(String(e) || 'Something went wrong');
      onRendering(false);
    }
  };
  const initRenderer = async (uri: string) => {
    try {
      await RnAndroidPdf.initRenderer(uri);
      convertPDF(0, 10);
    } catch (error) {
      onError(`${error}`);
    }
  };
  const Item = useCallback(
    ({ item }: { item: string }) => (
      <ReactNativeZoomableView
        maxZoom={2.5}
        minZoom={1}
        zoomStep={0.5}
        initialZoom={1}
        bindToBorders={true}
        disablePanOnInitialZoom={true}
        movementSensibility={3}
        contentHeight={windowHeight}
        contentWidth={windowWidth}
      >
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          style={{ width: windowWidth, height: windowHeight }}
          source={{
            uri: `file://${item}`,
          }}
        />
      </ReactNativeZoomableView>
    ),
    []
  );
  const key = useCallback((item: string) => item, []);
  const _onViewableItemsChanged = useCallback(
    ({ changed }: any) => {
      onPageChange(changed?.[0].index || 0);
    },
    [onPageChange]
  );
  const _viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });
  const renderNextSet = useCallback(() => {
    convertPDF(pdfArray?.length, 10);
  }, [convertPDF, pdfArray?.length]);
  useEffect(() => {
    initRenderer(uri);
  }, [uri]);
  return (
    <View style={{ height: windowHeight }}>
      <FlatList
        data={pdfArray}
        contentContainerStyle={styles.container}
        onViewableItemsChanged={_onViewableItemsChanged}
        viewabilityConfig={_viewConfigRef.current}
        onEndReachedThreshold={3}
        onEndReached={renderNextSet}
        renderItem={Item}
        keyExtractor={key}
      />
    </View>
  );
};
export default PdfRenderer;
