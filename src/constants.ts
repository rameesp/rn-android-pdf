import { Dimensions, StatusBar } from 'react-native';

const screenHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const navbarHeight = screenHeight - windowHeight;
const statusbarHeight = StatusBar?.currentHeight || 0;
export const screenDimensions = {
  windowHeight,
  windowWidth,
  navbarHeight,
  statusbarHeight,
};
