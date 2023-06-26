import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import styles from './style';
import PdfView from './pdf-view';
import ActionBar from './action-bar';
import LoaderScreen from './loader-screen';
import { RnAndroidPdf } from './render';

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
  const [index, setIndex] = useState(0); // current index visible on the screen
  const [totalPages, setTotalPages] = useState(0); // total pages of the pdf
  const [number, setNumber] = useState(1);

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
        setNumber(0);
        onRendering(false);
      } catch (e) {
        setNumber(0);
        setIsRendering(true);
        onError(String(e) || 'Something went wrong');
        onRendering(false);
      }
    },
    [setPdfArray, setIsRendering, onRendering, onError, totalPages, pdfArray]
  );
  /**
   * init render method will be called to clear the cache memory files created during the rendering the pdf
   */
  const initRenderer = useCallback(async () => {
    try {
      await RnAndroidPdf.initRenderer(uri);
      convertPDF(0, 10);
    } catch (error) {
      onError(`${error}`);
    }
  }, [onError, convertPDF, uri]);
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
    if (number == 0) {
      setIsRendering(true);
      isEndReached = true;
      setNumber(1);
    }
  }, [number, setIsRendering, setNumber]);
  /**
   * to show the current index viewed on the screen
   */
  const _onViewableItemsChanged = useCallback(
    ({ changed }: any) => {
      onPageChange(changed?.[0].index || 0);
      setIndex(changed?.[0].index + 1 || 0);
    },
    [onPageChange]
  );
  const _viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });
  /**
   * on End reached will set the isRendering to true to make sure loader is showing and on isRendering we will call convertPDF method
   */
  useEffect(() => {
    if (number>0 && isEndReached) {
      convertPDF(pdfArray?.length, 10);
      isEndReached = false;
    }
  }, [number, convertPDF, pdfArray?.length]);

  useEffect(() => {
    setIsRendering(true);
    initRenderer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
      />
      {isRendering && pdfArray.length <= 0 && (
        <LoaderScreen loaderMessage={loaderMessage} />
      )}
      <ActionBar
        index={index}
        number={number}
        totalPages={totalPages}
        isRendering={isRendering}
        onBackPressed={onBackPress}
        onDownloadPressed={onDownloadPress}
      />
    </View>
  );
};
export default PDF;
