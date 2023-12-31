import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import styles from './style';
import PdfView from './pdf-view';
import ActionBar from './action-bar';
import LoaderScreen from './loader-screen';
import { RnAndroidPdf } from './render';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { screenDimensions } from './constants';
import { rnPdfRendererStorage } from './storage';

interface IPdfRenderer {
  uri: string;
  loaderMessage: string;
  onError: (error: string) => void;
  onPageChange: (index: number) => void;
  onBackPress: () => void;
  onDownloadPress: () => void;
  onMeasurePages: (totalPages: number) => void;
  defaultImage?: number;
  isActionBarEnabled?: boolean;
  screenHeight?: number;
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
const PDF: React.FC<IPdfRenderer> = ({
  uri,
  loaderMessage,
  isActionBarEnabled = true,
  onError,
  onPageChange,
  onBackPress,
  onDownloadPress,
  onMeasurePages,
  screenHeight,
}) => {
  const [pdfArray, setPdfArray] = useState<String[]>([]); //array of pdf location from string
  const [page, setPage] = useState<number>(0); // current index visible on the screen
  const [totalPages, setTotalPages] = useState<number>(0); // total pages of the pdf

  //if action bar is enabled it will minus the action bar height from actual screen height
  const screenHeightCalculated = useMemo(
    () =>
      screenHeight
        ? screenHeight
        : isActionBarEnabled
        ? screenDimensions.windowHeight -
          (64 + screenDimensions.statusbarHeight + 6)
        : screenDimensions.windowHeight - screenDimensions.statusbarHeight,
    [screenHeight, isActionBarEnabled]
  );

  /**
   * init render method will be called to clear the cache memory files created during the rendering the pdf
   */
  const initRenderer = async () => {
    if (uri?.length) {
      try {
        rnPdfRendererStorage?.clearAll(); //clearing the mmkv storage
        let item = await RnAndroidPdf?.initRenderer(uri); //initializing the renderer
        const array = new Array(Number(item?.total_pages || 0)).fill('');

        onMeasurePages(Number(item?.total_pages || 0));
        setPdfArray(array);
        setTotalPages(item?.total_pages || 0);
      } catch (error) {
        onError(`${error || 'Something went wrong'}`);
      }
    } else {
      onError('Empty uri');
    }
  };
  /**
   * rendered item by flat-list
   */
  const Item = useCallback(({ index }: { index: number }) => {
    return <PdfView screenHeight={screenHeightCalculated} index={index} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /**
   * key rendered by flat-list
   */
  const key = useCallback((_item: String, _index: number) => _index + '', []);
  const _onViewableItemsChanged = useCallback(
    ({ changed }) => {
      onPageChange(changed?.[0].index || 0);
      setPage(changed?.[0].index + 1 || 0);
    },
    [onPageChange]
  );
  const _viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

  useEffect(() => {
    initRenderer();
    return () => {
      rnPdfRendererStorage?.clearAll();
      RnAndroidPdf?.closeRenderer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getItemLayout = useCallback(
    (
      _data: ArrayLike<String> | null | undefined,
      index: number
    ): { length: number; offset: number; index: number } => {
      return {
        length: screenHeightCalculated,
        offset: screenHeightCalculated * index,
        index,
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        {totalPages ? (
          <FlatList
            data={pdfArray || []}
            contentContainerStyle={styles.listContainer}
            onViewableItemsChanged={_onViewableItemsChanged}
            viewabilityConfig={_viewConfigRef.current}
            maxToRenderPerBatch={10}
            initialNumToRender={1}
            windowSize={5}
            renderItem={Item}
            keyExtractor={key}
            removeClippedSubviews={true}
            getItemLayout={getItemLayout}
          />
        ) : (
          <LoaderScreen loaderMessage={loaderMessage} />
        )}
        {isActionBarEnabled && (
          <ActionBar
            index={page}
            totalPages={totalPages}
            onBackPressed={onBackPress}
            onDownloadPressed={onDownloadPress}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};
export default PDF;
