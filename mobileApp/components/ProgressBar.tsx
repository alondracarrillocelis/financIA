import { View } from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';

export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <View style={{ height: 10, backgroundColor: '#ddd', borderRadius: 10 }}>
      <View
        style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: Colors.primary,
          borderRadius: 10,
        }}
      />
    </View>
  );
}
