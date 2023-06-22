import { View, Text } from 'react-native';
import React from 'react';
import styles from './style';
interface ILoader {
  statusText: string;
}
const Loader: React.FC<ILoader> = ({ statusText }) => {
  return (
    <View style={styles.loaderContainer}>
      <Text>{statusText || ''}</Text>
    </View>
  );
};

export default Loader;
