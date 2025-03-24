import { Stack } from 'expo-router';
import React from 'react';

const RoutesLayout = () => {
  return (
    <Stack>
        <Stack.Screen name='routes' options={{ headerShown: false}}/>
    </Stack>
  );
};

export default RoutesLayout;
