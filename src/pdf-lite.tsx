import { View, FlatList } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './style';
import PdfView from './pdf-view';
import { RnAndroidPdf } from './render';
import { rnPdfRendererStorage } from './storage';
import { screenDimensions } from './constants';

interface IPDFLite {
  uri: string;
  loaderMessage: string;
  onRendering: (loading: boolean) => void;
  onError: (error: string) => void;
}

const PDFLite: React.FC<IPDFLite> = ({ uri, onError }: any) => {
  const [pdfArray, setPdfArray] = useState([]); //array of pdf location from string

  /**
   * init render method will be called to clear the cache memory files created during the rendering the pdf
   */
  const initRenderer = async () => {
    if (uri.length) {
      try {
        rnPdfRendererStorage?.clearAll();
        let item = await RnAndroidPdf?.initRenderer(uri);
        const array = new Array(Number(item?.total_pages || '0')).fill('');
        setPdfArray(array as any);
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
    return (
      <PdfView screenHeight={screenDimensions.windowHeight} index={index} />
    );
  }, []);
  /**
   * key rendered by flat-list
   */
  const key = useCallback((_item: number, _index: number) => _index + '', []);

  useEffect(() => {
    initRenderer();
    return () => {
      rnPdfRendererStorage?.clearAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getItemLayout = useCallback(
    (
      _data: ArrayLike<number> | null | undefined,
      index: number
    ): { length: number; offset: number; index: number } => {
      return {
        length: screenDimensions.windowWidth,
        offset: screenDimensions.windowWidth * index,
        index,
      };
    },
    []
  );
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
        getItemLayout={getItemLayout}
        renderItem={Item}
        keyExtractor={key}
      />
    </View>
  );
};

export default PDFLite;
