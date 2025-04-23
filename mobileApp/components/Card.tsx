import { Pressable, Text, View } from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';

export default function Card({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginVertical: 8,
      }}>
      <Text style={{ fontSize: 18, color: Colors.text }}>{title}</Text>
    </Pressable>
  );
}
