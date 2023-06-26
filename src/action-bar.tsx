import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';
import styles from './style';
import MemoizedBackIcon from './back-icon';
import MemoizedDownloadIcon from './download-icon';
import { Pressable } from 'react-native';
interface IActionBar {
  index: number;
  totalPages: number;
  onBackPressed: () => void;
  onDownloadPressed: () => void;
  number: number;
}
const ActionBar: React.FC<IActionBar> = ({
  index,
  totalPages,
  number,
  onBackPressed,
  onDownloadPressed,
}) => {
  return (
    <View style={styles.actionContainer}>
      <Pressable onPress={onBackPressed} style={styles.actionIcon}>
        <MemoizedBackIcon />
      </Pressable>
      <View key={number + ''} style={styles.row}>
        <Text style={styles.paginationText}>
          {number === 0 ? index : <ActivityIndicator color={'#000000'} />}/
          {totalPages}
        </Text>
      </View>

      <Pressable onPress={onDownloadPressed} style={styles.actionIcon}>
        <MemoizedDownloadIcon />
      </Pressable>
    </View>
  );
};

export default React.memo(ActionBar);
