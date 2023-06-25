import { View, Text } from 'react-native';
import React from 'react';
import MemoizedLoaderIcon from './loader-icon';
import styles from './style';

const LoaderScreen = () => {
  return (
    <View style={styles.loaderContainer}>
      <View style={styles.loaderIconContainer}>
        <MemoizedLoaderIcon />
      </View>
      <Text style={styles.loaderText}>LoaderScreen</Text>
    </View>
  );
};

export default LoaderScreen;
