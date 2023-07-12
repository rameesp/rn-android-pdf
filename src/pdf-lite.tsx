import { View, FlatList } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './style';
import PdfView from './pdf-view';
import LoaderScreen from './loader-screen';
import { RnAndroidPdf } from './render';
import type { pdfItemType } from './@types';

interface IPDFLite {
  uri: string;
  loaderMessage: string;
  onRendering: (loading: boolean) => void;
  onError: (error: string) => void;
}
let isEndReached = false;

const PDFLite: React.FC<IPDFLite> = ({
  uri,
  loaderMessage,
  onRendering,
  onError,
}: any) => {
  const [pdfArray, setPdfArray] = useState([]); //array of pdf location from string
  const [isRendering, setIsRendering] = useState(false); //if the pages are being rendered this variable is used as an indicator
  /**
   * it will convert the pdf to images and save it on cache directory
   * its a promise once the conversion is done it will return an object with property outputFiles which contain array of filePath
   */
  const convertPDF = useCallback(
    async (size: number, skip: number) => {
      try {
        let pdfs = await RnAndroidPdf?.convert(size, skip);

        setPdfArray((prePdfArray) => [...prePdfArray, ...(pdfs as [])]);
        setIsRendering(false);
        onRendering(false);
      } catch (e) {
        setIsRendering(true);
        onError(String(e || 'Something went wrong'));
        onRendering(false);
      }
    },
    [setPdfArray, setIsRendering, onRendering, onError]
  );
  /**
   * init render method will be called to clear the cache memory files created during the rendering the pdf
   */
  const initRenderer = useCallback(async () => {
    if (uri.length > 0) {
      try {
        await RnAndroidPdf?.initRenderer(uri);
        convertPDF(0, 10);
      } catch (error) {
        onError(`${error || 'Something went wrong'}`);
      }
    } else {
      onError('Empty url');
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
    (item: { page: string; path: string }) => item?.path,
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
  return (
    <View style={styles.container}>
      <FlatList
        data={pdfArray}
        contentContainerStyle={styles.listContainer}
        onEndReachedThreshold={0}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        maximumZoomScale={4}
        removeClippedSubviews={true}
        minimumZoomScale={1}
        onEndReached={onListEndReached}
        renderItem={Item}
        keyExtractor={key}
      />
      {isRendering && (
        <LoaderScreen
          loaderMessage={loaderMessage}
          loaderStyle={styles.loaderOpacity}
        />
      )}
    </View>
  );
};

export default PDFLite;
