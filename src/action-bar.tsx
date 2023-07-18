import { View, Text } from 'react-native';
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
  isRendering: boolean;
}
const ActionBar: React.FC<IActionBar> = ({
  index,
  totalPages,
  onBackPressed,
  onDownloadPressed,
}) => {
  return (
    <View style={styles.actionContainer}>
      <Pressable onPress={onBackPressed} style={styles.actionIcon}>
        <MemoizedBackIcon />
      </Pressable>
      <View key={totalPages + ''} style={styles.row}>
        <Text style={styles.paginationText}>{index || 0}</Text>

        <Text style={styles.paginationText}>/{totalPages || 0}</Text>
      </View>

      <Pressable onPress={onDownloadPressed} style={styles.actionIcon}>
        <MemoizedDownloadIcon />
      </Pressable>
    </View>
  );
};

export default React.memo(ActionBar);
