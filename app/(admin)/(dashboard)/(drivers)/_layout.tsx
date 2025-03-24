import React from 'react';
import { Stack } from 'expo-router';

const DriversLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='drivers' options={{headerShown: false}}/>
    </Stack>
  );
};

export default DriversLayout;
