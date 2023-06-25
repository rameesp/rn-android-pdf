import * as React from 'react';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';
import { memo } from 'react';
const BackIcon = () => (
  <Svg fill="none">
    <G clipPath="url(#a)">
      <Path
        fill="#333"
        d="M7.828 11H20v2H7.828l5.364 5.365-1.414 1.414L4 12l7.778-7.778 1.414 1.414L7.828 11Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
const MemoizedBackIcon = memo(BackIcon);
export default MemoizedBackIcon;
