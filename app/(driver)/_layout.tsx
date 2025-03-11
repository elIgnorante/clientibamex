
import React from 'react';
import { Stack } from "expo-router";

const DriverLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="home-driver" options={{ headerShown: false }} />
    </Stack>
  );
};

export default DriverLayout;