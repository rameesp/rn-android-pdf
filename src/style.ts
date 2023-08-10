import { StyleSheet } from 'react-native';
import { screenDimensions } from './constants';

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', flex: 1 },
  listContainer: {
    backgroundColor: '#fafafa',
  },

  actionContainer: {
    height: 64,
    width: screenDimensions.windowWidth,
    backgroundColor: 'white',
    elevation: 8,
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
  },
  paginationText: {
    color: 'black',
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
  },
  actionIcon: { height: 24, width: 24 },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
  },
  loaderIconContainer: { height: 48, width: 48, marginBottom: 12 },
  loaderText: {
    color: 'black',
  },
  row: {
    flexDirection: 'row',
  },
  loaderOpacity: { opacity: 0.8 },
  zoomableContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#e0e0e0',
    borderBottomWidth: 1,
  },
  itemContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default styles;
