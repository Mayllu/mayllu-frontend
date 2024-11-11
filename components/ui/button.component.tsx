// components/Button.tsx
import React, { forwardRef } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '@/constants';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  style?: any;
} & Omit<React.ComponentProps<typeof TouchableOpacity>, 'style'>;

const Button = forwardRef<TouchableOpacity, ButtonProps>(({
  title,
  onPress,
  loading,
  variant = 'primary',
  style,
  ...props
}, ref) => {
  return (
    <TouchableOpacity
      ref={ref}
      style={[
        styles.button,
        variant === 'secondary' ? styles.buttonSecondary : styles.buttonPrimary,
        style,
      ]}
      onPress={onPress}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.white_00 : Colors.blue_60} />
      ) : (
        <Text style={[
          styles.text,
          variant === 'secondary' ? styles.textSecondary : styles.textPrimary,
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonPrimary: {
    borderColor: Colors.blue_60,
    borderWidth: 1,
    backgroundColor: Colors.blue_60,
  },
  buttonSecondary: {
    borderColor: Colors.blue_60,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter_SemiBold',
  },
  textPrimary: {
    color: Colors.white_00,
  },
  textSecondary: {
    color: Colors.blue_60,
    fontFamily: 'Inter_Regular',
  },
});

export { Button };