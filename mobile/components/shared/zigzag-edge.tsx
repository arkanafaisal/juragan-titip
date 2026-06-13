import React from 'react';
import { View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

interface ZigZagEdgeProps {
  color?: string;
  position?: 'top' | 'bottom';
}

export function ZigZagEdge({ 
  color = '#ffffff', 
  position = 'bottom',
}: ZigZagEdgeProps) {
  const height = 8;
  const widthPerTriangle = 12;
  // 60 triangles * 12 width = 720px width. Cukup untuk mengisi lebar layer device standar.
  const numTriangles = 60; 

  let points = "";
  if (position === 'bottom') {
      points += `0,0 `;
      for (let i = 0; i < numTriangles; i++) {
        points += `${i * widthPerTriangle + (widthPerTriangle / 2)},${height} `;
        points += `${(i + 1) * widthPerTriangle},0 `;
      }
  } else {
      points += `0,${height} `;
      for (let i = 0; i < numTriangles; i++) {
        points += `${i * widthPerTriangle + (widthPerTriangle / 2)},0 `;
        points += `${(i + 1) * widthPerTriangle},${height} `;
      }
  }

  return (
    <View style={{ width: '100%', height: height, overflow: 'hidden' }}>
      <Svg height={height} width="100%">
        <Polygon points={points} fill={color} />
      </Svg>
    </View>
  );
}
