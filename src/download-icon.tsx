import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { memo } from 'react';
const DownloadIcon = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 21h12M12 3v14m0 0 5-5m-5 5-5-5"
    />
  </Svg>
);
const MemoizedDownloadIcon = memo(DownloadIcon);
export default MemoizedDownloadIcon;
