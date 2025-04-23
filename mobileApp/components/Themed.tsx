// components/Themed.tsx
import { Text as DefaultText, View as DefaultView } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

function useThemeColor(
  props: ThemeProps,
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[`${theme}Color`];

  if (colorFromProps) {
    return colorFromProps;
  }

  return Colors[theme][colorName];
}

export function Text(props: ThemeProps & DefaultText['props']) {
  const { style, ...otherProps } = props;
  const color = useThemeColor(props, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ThemeProps & DefaultView['props']) {
  const { style, ...otherProps } = props;
  const backgroundColor = useThemeColor(props, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
