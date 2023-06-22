import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'rn-android-pdf' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
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
  const [isEndReached, setIsEndReached] = useState(false);

  /**
   * it will convert the pdf to images and save it on cache directory
   * its a promise once the conversion is done it will return an object with property outputFiles which contain array of filePath
   */
  const convertPDF = useCallback(
    async (size: number, skip: number) => {
      try {
        onRendering(true);
        let pdfs = await RnAndroidPdf.convert(uri, size, skip);
        onRendering(false);

        pdfArray.push(...(pdfs?.outputFiles as []));
        setPdfArray(pdfArray);
        setIsEndReached(pdfs?.outputFiles.length < 10);
        console.log(pdfs?.outputFiles.length);
      } catch (e) {
        onError(String(e) || 'Something went wrong');
        onRendering(false);
      }
    },
    [onError, onRendering, pdfArray, uri]
  );
  const Item = useCallback(
    ({ item }: { item: string }) => (
      <FastImage
        resizeMode={FastImage.resizeMode.contain}
        style={{ width: windowWidth, height: windowHeight }}
        source={{
          uri: `file://${item}`,
        }}
      />
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
  const _viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };
  const renderNextSet = useCallback(() => {
    convertPDF(pdfArray?.length, 10);
  }, [convertPDF, pdfArray?.length]);
  const loaderPagination = () => {
    return !isEndReached ? (
      <Text>Loading more pages</Text>
    ) : (
      <Text>No more data</Text>
    );
  };
  useEffect(() => {
    if (uri) convertPDF(0, 10);
    else onError('Invalid file path');
  }, [uri, convertPDF, onError]);
  return (
    <ReactNativeZoomableView
      maxZoom={1.5}
      minZoom={1}
      zoomStep={0.5}
      initialZoom={1}
      bindToBorders={true}
    >
      <FlatList
        data={pdfArray}
        onViewableItemsChanged={_onViewableItemsChanged}
        viewabilityConfig={_viewabilityConfig}
        onEndReachedThreshold={0.4}
        onEndReached={renderNextSet}
        renderItem={Item}
        keyExtractor={key}
        ListFooterComponent={loaderPagination}
      />
    </ReactNativeZoomableView>
  );
};
export default PdfRenderer;
