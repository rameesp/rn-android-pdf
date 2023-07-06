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
  const preTranslationX = useSharedValue(0);
  const preTranslationY = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const onGesture = useMemo(() => {
    const pan = Gesture.Pan()
      .minPointers(2)
      .maxPointers(2)
      .onStart(() => {
        cancelAnimation(translationX);
        cancelAnimation(translationY);
        cancelAnimation(scale);
        translationX.value = preTranslationX.value;
        translationY.value = preTranslationY.value;
      })
      .onUpdate((e) => {
        if (scale.value > 1) {
          translationX.value = preTranslationX?.value + e?.translationX || 0;
          translationY.value = preTranslationY?.value + e?.translationY || 0;
        }
      })
      .onEnd(() => {
        const distance = Math.sqrt(
          translationX.value ** 2 + translationY.value ** 2
        );
        console.log(distance);

        preTranslationX.value = translationX.value || 0;
        preTranslationY.value = translationY.value || 0;
      });
    const pinch = Gesture.Pinch()
      .onStart(() => {
        cancelAnimation(translationX);
        cancelAnimation(translationY);
        cancelAnimation(scale);
      })
      .onUpdate((e) => {
        if (scale.value >= 1 && e?.scale >= 1) {
          scale.value = savedScale?.value * e?.scale || 1;
        } else {
          scale.value = withTiming(1);
          translationX.value = withTiming(1);
          translationY.value = withTiming(1);
        }
      })
      .onEnd((e) => {
        savedScale.value = scale?.value || 1;
        if (e.scale < 1) {
          scale.value = withTiming(1);
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
    return Gesture.Race(Gesture.Simultaneous(pinch, pan, doubleTab));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translationX?.value || 0 },
        { translateY: translationY?.value || 0 },
        { scale: scale?.value || 1 },
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
