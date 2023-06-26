import { View, FlatList } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './style';
import PdfView from './pdf-view';
import LoaderScreen from './loader-screen';
import { RnAndroidPdf } from './render';

let isEndReached = false;

const PDFLite = ({ uri, loaderMessage, onRendering, onError }: any) => {
  const [pdfArray, setPdfArray] = useState([]); //array of pdf location from string
  const [isRendering, setIsRendering] = useState(false); //if the pages are being rendered this variable is used as an indicator
  /**
   * it will convert the pdf to images and save it on cache directory
   * its a promise once the conversion is done it will return an object with property outputFiles which contain array of filePath
   */
  const convertPDF = useCallback(
    async (size: number, skip: number) => {
      try {
        let pdfs = await RnAndroidPdf.convert(size, skip);
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
    [setPdfArray, setIsRendering, onRendering, onError, pdfArray]
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
    if (!isRendering) {
      setIsRendering(true);
      isEndReached = true;
    }
  }, [isRendering, setIsRendering]);
  useEffect(() => {
    setIsRendering(true);
    initRenderer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View>
      <FlatList
        data={pdfArray}
        contentContainerStyle={styles.listContainer}
        onEndReachedThreshold={0}
        onEndReached={onListEndReached}
        renderItem={Item}
        keyExtractor={key}
      />
      {isRendering && <LoaderScreen loaderMessage={loaderMessage} />}
    </View>
  );
};

export default PDFLite;
