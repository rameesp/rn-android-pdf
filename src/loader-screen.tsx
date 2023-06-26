import { View, Text } from 'react-native';
import React from 'react';
import MemoizedLoaderIcon from './loader-icon';
import styles from './style';
interface ILoaderMessage {
  loaderMessage: string;
}
const LoaderScreen: React.FC<ILoaderMessage> = ({ loaderMessage }) => {
  return (
    <View style={styles.loaderContainer}>
      <View style={styles.loaderIconContainer}>
        <MemoizedLoaderIcon />
      </View>
      <Text style={styles.loaderText}>{loaderMessage}</Text>
    </View>
  );
};

export default LoaderScreen;
