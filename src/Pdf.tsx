import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import styles from './style';
import PdfView from './pdf-view';
import ActionBar from './action-bar';
import LoaderScreen from './loader-screen';
import { RnAndroidPdf } from './render';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import type { pdfItemType } from './@types';
import { screenDimensions } from './constants';

interface IPdfRenderer {
  uri: string;
  loaderMessage: string;
  onRendering: (loading: boolean) => void;
  onError: (error: string) => void;
  onPageChange: (index: number) => void;
  onBackPress: () => void;
  onDownloadPress: () => void;
  onMeasurePages: (totalPages: number) => void;
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
let isEndReached = false;
const PDF: React.FC<IPdfRenderer> = ({
  uri,
  loaderMessage,
  onRendering,
  onError,
  onPageChange,
  onBackPress,
  onDownloadPress,
  onMeasurePages,
}) => {
  const [pdfArray, setPdfArray] = useState([]); //array of pdf location from string
  const [isRendering, setIsRendering] = useState(false); //if the pages are being rendered this variable is used as an indicator
  const [page, setPage] = useState(0); // current index visible on the screen
  const [totalPages, setTotalPages] = useState(0); // total pages of the pdf

  /**
   * it will convert the pdf to images and save it on cache directory
   * its a promise once the conversion is done it will return an object with property outputFiles which contain array of filePath
   */
  const convertPDF = useCallback(
    async (size: number, skip: number) => {
      try {
        onRendering(true);
        let pdfs = await RnAndroidPdf.convert(size, skip);
        if (totalPages <= 0) {
          setTotalPages(pdfs?.[0]?.total_pages || 0);
          onMeasurePages(pdfs?.[0]?.total_pages || 0);
        }
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
    [
      setPdfArray,
      setIsRendering,
      onRendering,
      onError,
      onMeasurePages,
      totalPages,
      pdfArray,
    ]
  );
  /**
   * init render method will be called to clear the cache memory files created during the rendering the pdf
   */
  const initRenderer = async () => {
    try {
      await RnAndroidPdf.initRenderer(uri);
      convertPDF(0, 10);
    } catch (error) {
      onError(`${error}`);
    }
  };
  /**
   * rendered item by flat-list
   */
  const Item = useCallback(({ item }: { item: pdfItemType }) => {
    return <PdfView path={item.path || ''} />;
  }, []);
  /**
   * key rendered by flat-list
   */
  const key = useCallback(
    (item: { page: string; path: string }) => item.path,
    []
  );
  /**
   * by reaching the end we will render next set of pages
   */
  const onListEndReached = useCallback(() => {
    if (!isRendering) {
      setIsRendering(true);
      isEndReached = true;
    }
  }, [isRendering, setIsRendering]);
  /**
   * to show the current index viewed on the screen
   */
  const _onViewableItemsChanged = useCallback(
    ({ changed }: any) => {
      onPageChange(changed?.[0].index || 0);
      setPage(changed?.[0].index + 1 || 0);
    },
    [onPageChange]
  );
  const _viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });
  /**
   * on End reached will set the isRendering to true to make sure loader is showing and on isRendering we will call convertPDF method
   */
  useEffect(() => {
    if (isRendering && isEndReached) {
      convertPDF(pdfArray?.length, 10);
      isEndReached = false;
    }
  }, [isRendering, convertPDF, pdfArray?.length]);

  useEffect(() => {
    setIsRendering(true);
    initRenderer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getItemLayout = useCallback(
    (
      data: ArrayLike<pdfItemType> | null | undefined,
      index: number
    ): { length: number; offset: number; index: number } => {
        /* tslint:disable:no-unused-variable */
      return {
        length: screenDimensions.windowHeight - 90,
        offset: (screenDimensions.windowHeight - 90) * index,
        index,
      };
    },
    []
  );
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <FlatList
          data={pdfArray || []}
          contentContainerStyle={styles.listContainer}
          onViewableItemsChanged={_onViewableItemsChanged}
          viewabilityConfig={_viewConfigRef.current}
          onEndReachedThreshold={0}
          onEndReached={onListEndReached}
          maxToRenderPerBatch={1}
          initialNumToRender={10}
          maximumZoomScale={4}
          minimumZoomScale={1}
          renderItem={Item}
          keyExtractor={key}
          removeClippedSubviews={true}
          getItemLayout={getItemLayout}
        />
        {isRendering && pdfArray.length <= 0 && (
          <LoaderScreen loaderMessage={loaderMessage} />
        )}
        <ActionBar
          index={page}
          totalPages={totalPages}
          isRendering={isRendering}
          onBackPressed={onBackPress}
          onDownloadPressed={onDownloadPress}
        />
      </View>
    </GestureHandlerRootView>
  );
};
export default PDF;
