import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';
import styles from './style';
import MemoizedBackIcon from './back-icon';
import MemoizedDownloadIcon from './download-icon';
import { Pressable } from 'react-native';
interface IActionBar {
  index: number;
  totalPages: number;
  isRendering: boolean;
  onBackPressed: () => void;
  onDownloadPressed: () => void;
}
const ActionBar: React.FC<IActionBar> = ({
  index,
  totalPages,
  isRendering,
  onBackPressed,
  onDownloadPressed,
}) => {
  return (
    <View style={styles.actionContainer}>
      <Pressable onPress={onBackPressed} style={styles.actionIcon}>
        <MemoizedBackIcon />
      </Pressable>
      <View key={totalPages + ''} style={styles.row}>
        {isRendering ? (
          <ActivityIndicator color={'#000000'} />
        ) : (
          <Text style={styles.paginationText}>{index}</Text>
        )}
        <Text style={styles.paginationText}>/{totalPages}</Text>
      </View>

      <Pressable onPress={onDownloadPressed} style={styles.actionIcon}>
        <MemoizedDownloadIcon />
      </Pressable>
    </View>
  );
};

export default React.memo(ActionBar);
