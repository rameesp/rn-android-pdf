import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', flex: 1 },
  listContainer: {
    backgroundColor: 'white',
  },

  actionContainer: {
    height: 64,
    width: '100%',
    backgroundColor: 'white',
    elevation: 8,
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
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
});
export default styles;
