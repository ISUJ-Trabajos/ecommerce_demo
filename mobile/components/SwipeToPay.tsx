import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width - 32; // padding 16 * 2
const KNOB_WIDTH = 64;
const MAX_TRANSLATE = SLIDER_WIDTH - KNOB_WIDTH - 8;

interface SwipeToPayProps {
  onConfirm: () => void;
  disabled?: boolean;
}

export default function SwipeToPay({ onConfirm, disabled = false }: SwipeToPayProps) {
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);
  const [confirmed, setConfirmed] = useState(false);

  // Animación inicial "shimmer/hint"
  React.useEffect(() => {
    if (!disabled && !confirmed) {
      translateX.value = withRepeat(
        withSequence(
          withTiming(15, { duration: 300 }),
          withTiming(0, { duration: 300 })
        ),
        3,
        false
      );
    }
  }, [disabled, confirmed, translateX]);

  const pan = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      if (disabled || confirmed) return;
      let nextTranslate = startX.value + event.translationX;
      nextTranslate = Math.max(0, Math.min(nextTranslate, MAX_TRANSLATE));
      translateX.value = nextTranslate;
    })
    .onEnd(() => {
      if (disabled || confirmed) return;

      if (translateX.value > MAX_TRANSLATE * 0.8) {
        // Confirmado
        translateX.value = withSpring(MAX_TRANSLATE);
        runOnJS(setConfirmed)(true);
        runOnJS(onConfirm)();
      } else {
        // Regresa
        translateX.value = withSpring(0);
      }
    });

  const knobStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const trackFillStyle = useAnimatedStyle(() => {
    return {
      width: translateX.value + KNOB_WIDTH / 2,
    };
  });

  const textOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - translateX.value / MAX_TRANSLATE,
    };
  });

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <Animated.View style={[styles.trackFill, trackFillStyle]} />
      <Animated.Text style={[styles.text, textOpacityStyle]}>
        {confirmed ? "Procesando..." : "Desliza para pagar"}
      </Animated.Text>

      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.knob, knobStyle]}>
          <Ionicons name="chevron-forward" size={24} color={confirmed ? Colors.success : "#fff"} />
          <Ionicons name="chevron-forward" size={24} color={confirmed ? Colors.success : "#fff"} style={{ marginLeft: -12 }} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Sleek glass look 
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', // Subtle border
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.accent,
    opacity: 1, // Matches exactly the solid block coloring form the knob
    zIndex: 0,
  },
  text: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 16,
    color: '#E5E5E5', // Soft off-white for legibility and premium feel
    position: 'absolute',
    zIndex: 1,
    letterSpacing: 0.5,
  },
  knob: {
    position: 'absolute',
    left: 0,
    width: KNOB_WIDTH,
    height: 64,
    backgroundColor: Colors.accent,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 2,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12, // Glow effect
    elevation: 8,
  },
});
