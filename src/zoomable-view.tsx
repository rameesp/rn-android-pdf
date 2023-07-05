import React, { useMemo } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import styles from './style';

const ZoomableView: React.FC = ({ children }) => {
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const onGesture = useMemo(() => {
    const pan = Gesture.Pan()
      .failOffsetY([-5, 5])
      .activeOffsetX([-5, 5])
      .minPointers(2)
      .maxPointers(2)
      .onStart(() => {
        cancelAnimation(translationX);
        cancelAnimation(translationY);
        cancelAnimation(scale);
        // translationX.value = preTranslationX.value;
        // translationY.value = preTranslationY.value;
      })
      .onUpdate((e) => {
        if (scale.value > 1) {
          translationX.value = e.translationX;
          translationY.value = e.translationY;
        }
      })
      .onEnd((e) => {
        if (scale.value > 1) {
          translationX.value = e.translationX;
          translationY.value = e.translationY;
        } else {
          translationX.value = withTiming(1);
          translationY.value = withTiming(1);
        }
        // preTranslationX.value = e.translationX;
        // preTranslationY.value = e.translationY;
      });
    const pinch = Gesture.Pinch()
      .onStart(() => {
        cancelAnimation(translationX);
        cancelAnimation(translationY);
        cancelAnimation(scale);
        // scale.value = preScale.value;
      })
      .onUpdate((e) => {
        if (scale.value >= 1) {
          scale.value = savedScale.value * e.scale;
        } else {
          scale.value = withTiming(1);
        }
      })
      .onEnd((e) => {
        savedScale.value = scale.value;
        if (e.scale < 1) {
          scale.value = withTiming(1);
        }
        // preScale.value = e.scale;
      });
    const doubleTab = Gesture.Tap()
      .numberOfTaps(2)
      .onStart(() => {
        scale.value === 1
          ? (scale.value = withTiming(2))
          : (scale.value = withTiming(1));

        translationX.value = withTiming(0);
        translationY.value = withTiming(0);
      });
    return Gesture.Race(Gesture.Simultaneous(pinch, pan, doubleTab));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
        { scale: scale.value },
      ],
    };
  }, []);
  return (
    <GestureDetector gesture={onGesture}>
      <Animated.View style={[styles.zoomableContainer]}>
        <Animated.View style={[style]}>{children}</Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export default ZoomableView;
