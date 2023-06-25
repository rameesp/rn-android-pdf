import * as React from 'react';
import Svg, { SvgProps, Circle, Path } from 'react-native-svg';
import { memo } from 'react';
const LoaderIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 26.349 26.35" {...props}>
    <Circle cx={13.792} cy={3.082} r={3.082} />
    <Circle cx={13.792} cy={24.501} r={1.849} />
    <Circle cx={6.219} cy={6.218} r={2.774} />
    <Circle cx={21.365} cy={21.363} r={1.541} />
    <Circle cx={3.082} cy={13.792} r={2.465} />
    <Circle cx={24.501} cy={13.791} r={1.232} />
    <Path d="M4.694 19.84a2.155 2.155 0 0 0 0 3.05 2.155 2.155 0 0 0 3.05 0 2.155 2.155 0 0 0 0-3.05 2.146 2.146 0 0 0-3.05 0z" />
    <Circle cx={21.364} cy={6.218} r={0.924} />
  </Svg>
);
const MemoizedLoaderIcon = memo(LoaderIcon);
export default MemoizedLoaderIcon;
