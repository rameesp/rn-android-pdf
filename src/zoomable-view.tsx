import React, { useMemo } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import styles from './style';
import { screenDimensions } from './constants';
interface IZoomableView {
  screenHeight: number;
}
const ZoomableView: React.FC<IZoomableView> = ({
  screenHeight = screenDimensions.windowHeight - 90,
  children,
}) => {
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const preTranslationX = useSharedValue(0);
  const preTranslationY = useSharedValue(0);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const maxTranslateX = useSharedValue(0);
  const minTranslateX = useSharedValue(0);

  const maxTranslateY = useSharedValue(0);
  const minTranslateY = useSharedValue(0);
  const endScale = useSharedValue(1);

  const onGesture = useMemo(() => {
    /**
     * to reset the value to initial state , mainly used when the view go out of parent we
     */
    const resetEverything = () => {
      'worklet';

      scale.value = withTiming(1);
      translationX.value = withTiming(0);
      translationY.value = withTiming(0);
      preTranslationX.value = 0;
      preTranslationY.value = 0;
      savedScale.value = 1;
      maxTranslateX.value = 0;
      minTranslateX.value = 0;
      maxTranslateY.value = 0;
      minTranslateY.value = 0;
    };
    const pan = Gesture.Pan()
      .minPointers(2)
      .maxPointers(2)
      .onStart(() => {
        cancelAnimation(translationX);
        cancelAnimation(translationY);
        cancelAnimation(scale);
        translationX.value = preTranslationX?.value || 0;
        translationY.value = preTranslationY?.value || 0;
      })
      .onUpdate((e) => {
        if (scale.value > 1) {
          /**
           * Here we will calculate the maximum translate x and y value as well as the minimum translate x and y value.
           * If the next translate value is greater than the max value or less than the min value,
           * the max or min value will be the next translation value.
           **/
          maxTranslateX.value =
            (screenDimensions?.windowWidth / 2) * scale?.value -
            screenDimensions?.windowWidth / 2;
          minTranslateX.value = -maxTranslateX?.value;

          maxTranslateY.value =
            (screenHeight / 2) * scale?.value - screenHeight / 2;
          minTranslateY.value = -maxTranslateY?.value;

          const nextTranslateX = preTranslationX?.value + e?.translationX || 0;
          const nextTranslateY = preTranslationY?.value + e?.translationY || 0;

          if (nextTranslateX > maxTranslateX.value) {
            translationX.value = maxTranslateX?.value || 0;
          } else if (nextTranslateX < minTranslateX.value) {
            translationX.value = minTranslateX?.value || 0;
          } else {
            translationX.value = nextTranslateX || 0;
          }

          if (nextTranslateY > maxTranslateY?.value) {
            translationY.value = maxTranslateY?.value || 0;
          } else if (nextTranslateY < minTranslateY.value) {
            translationY.value = minTranslateY?.value || 0;
          } else {
            translationY.value = nextTranslateY || 0;
          }
        }
      })
      .onEnd(() => {
        preTranslationX.value = translationX?.value || 0;
        preTranslationY.value = translationY?.value || 0;
        maxTranslateX.value =
          (screenDimensions.windowWidth / 2) * endScale?.value -
          screenDimensions.windowWidth / 2;
        minTranslateX.value = -maxTranslateX?.value;
        /**
         * if the the view is go out of the parent we the max will become negative and min will become positive , so we reset everything to its initial value
         */

        if (maxTranslateX.value < minTranslateX.value) {
          resetEverything();
        }
      });

    const pinch = Gesture.Pinch()
      .onStart(() => {
        cancelAnimation(translationX);
        cancelAnimation(translationY);
        cancelAnimation(scale);
      })
      .onUpdate((e) => {
        if (e.numberOfPointers === 2) {
          if (scale.value >= 1 && e?.scale >= 1) {
            /**
             *  if scale is > 4 we will keep it to 4 , 4 is the maximum zoom capability
             */
            scale.value =
              (savedScale?.value * e?.scale <= 4
                ? savedScale?.value * e?.scale
                : 4) || 1;
          } else {
            scale.value = withTiming(1);
            translationX.value = withTiming(0);
            translationY.value = withTiming(0);
          }
        }
      })
      .onEnd((e) => {
        endScale.value = e?.scale || 1; // after the zooming out we will check the endScale this is to check weather the view is gone out of view or not
        savedScale.value = scale?.value || 1;
        if (scale.value < 1.1 || e?.scale < 1.1) {
          resetEverything();
        }
      });
    const doubleTab = Gesture.Tap()
      .numberOfTaps(2)
      .onStart(() => {
        scale.value === 1
          ? (scale.value = withTiming(2))
          : (scale.value = withTiming(1));

        translationX.value = withTiming(0);
        translationY.value = withTiming(0);
        preTranslationX.value = 0;
        preTranslationY.value = 0;
      });
    return Gesture.Race(Gesture.Simultaneous(pinch, pan), doubleTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translationX.value, translationY.value, scale.value]);
  const style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translationX?.value || 0 },
        { translateY: translationY?.value || 0 },
        { scale: scale?.value || 1 },
      ],
    };
  }, []);
  const memoStyle = useMemo(() => style, [style]);
  return (
    <GestureDetector gesture={onGesture}>
      <Animated.View style={[styles.zoomableContainer]}>
        <Animated.View style={[memoStyle]}>{children}</Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export default ZoomableView;
