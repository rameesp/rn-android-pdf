import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { NativeModules, Platform } from 'react-native';
import styles from './style';
import PdfView from './pdf-view';
import ActionBar from './action-bar';
import LoaderScreen from './loader-screen';

const LINKING_ERROR =
  `The package 'rn-android-pdf' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: `-this package wont work on ios'\n`, default: '' }) +
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

interface IPdfRenderer {
  uri: string;
  onRendering: (loading: boolean) => void;
  onError: (error: string) => void;
  onPageChange: (index: number) => void;
}
type pdfItemType = { page: string; path: string; total_pages: string };
/**
 *
 * @param uri local file path of pdf , provide the file after downloading the file
 * @param color background color for the flat list container default value if white
 * @param onRendering loader while rendering the pdf
 * @param onError invoked on error
 * @param onPageChange on page change it will show the current index
 * @returns
 */
let isEndReached = false;
const PdfRenderer: React.FC<IPdfRenderer> = ({
  uri,
  onRendering,
  onError,
  onPageChange,
}) => {
  const [pdfArray, setPdfArray] = useState([]); //array of pdf location from string
  const [isRendering, setIsRendering] = useState(false);
  const [index, setIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  /**
   * it will convert the pdf to images and save it on cache directory
   * its a promise once the conversion is done it will return an object with property outputFiles which contain array of filePath
   */
  const convertPDF = useCallback(
    async (size: number, skip: number) => {
      try {
        onRendering(true);
        let pdfs = await RnAndroidPdf.convert(size, skip);
        if (totalPages <= 0) setTotalPages(pdfs?.[0]?.total_pages || 0);
        pdfArray.push(...(pdfs as []));
        setPdfArray(pdfArray);
        setIsRendering(false);
        onRendering(false);
      } catch (e) {
        setIsRendering(true);
        onError(String(e) || 'Something went wrong');
        onRendering(false);
      }
    },
    [setPdfArray, setIsRendering, onRendering, onError, totalPages, pdfArray]
  );
  const initRenderer = useCallback(async () => {
    try {
      await RnAndroidPdf.initRenderer(uri);
      convertPDF(0, 10);
    } catch (error) {
      onError(`${error}`);
    }
  }, [onError, convertPDF, uri]);
  const Item = useCallback(({ item }: { item: pdfItemType }) => {
    return <PdfView path={item.path || ''} />;
  }, []);
  const key = useCallback(
    (item: { page: string; path: string }) => item.path,
    []
  );
  const onListEndReached = useCallback(() => {
    if (!isRendering) {
      setIsRendering(true);
      isEndReached = true;
    }
  }, [isRendering, setIsRendering]);
  const _onViewableItemsChanged = useCallback(
    ({ changed }: any) => {
      onPageChange(changed?.[0].index || 0);
      setIndex(changed?.[0].index + 1 || 0);
    },
    [onPageChange]
  );
  const _viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });
  useEffect(() => {
    if (isRendering && isEndReached) {
      convertPDF(pdfArray?.length, 10);
      isEndReached = false;
    }
  }, [isRendering, convertPDF, pdfArray?.length]);
  useEffect(() => {
    setIsRendering(true);
    initRenderer();
  }, [setIsRendering, initRenderer]);
  return (
    <View style={styles.container}>
      <FlatList
        data={pdfArray}
        contentContainerStyle={styles.listContainer}
        onViewableItemsChanged={_onViewableItemsChanged}
        viewabilityConfig={_viewConfigRef.current}
        onEndReachedThreshold={0}
        onEndReached={onListEndReached}
        renderItem={Item}
        keyExtractor={key}
        ListEmptyComponent={<LoaderScreen />}
      />
      {isRendering && <LoaderScreen />}
      <ActionBar
        index={index}
        totalPages={totalPages}
        isRendering={isRendering}
      />
    </View>
  );
};
export default PdfRenderer;
