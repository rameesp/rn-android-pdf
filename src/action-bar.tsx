import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';
import styles from './style';
import MemoizedBackIcon from './back-icon';
import MemoizedDownloadIcon from './download-icon';
interface IActionBar {
  index: number;
  totalPages: number;
  isRendering: boolean;
}
const ActionBar: React.FC<IActionBar> = ({
  index,
  totalPages,
  isRendering,
}) => {
  return (
    <View style={styles.actionContainer}>
      <View style={styles.actionIcon}>
        <MemoizedBackIcon />
      </View>

      <Text style={styles.paginationText}>
        {isRendering ? <ActivityIndicator color={'#000000'} /> : index}/
        {totalPages}
      </Text>
      <View style={styles.actionIcon}>
        <MemoizedDownloadIcon />
      </View>
    </View>
  );
};

export default ActionBar;
