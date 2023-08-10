import { View, Text, ViewStyle } from 'react-native';
import React from 'react';
import MemoizedLoaderIcon from './loader-icon';
import styles from './style';
interface ILoaderMessage {
  loaderMessage: string;
  loaderStyle?: ViewStyle;
}
const LoaderScreen: React.FC<ILoaderMessage> = ({
  loaderMessage,
  loaderStyle,
}) => {
  return (
    <View style={[styles.loaderContainer, loaderStyle]}>
      <View style={styles.loaderIconContainer}>
        <MemoizedLoaderIcon />
      </View>
      <Text style={styles.loaderText}>
        {loaderMessage || 'Please wait while the contents are rendering'}
      </Text>
    </View>
  );
};

export default React.memo(LoaderScreen);
