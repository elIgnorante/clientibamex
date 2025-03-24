import React from 'react';
import { Stack } from "expo-router";

const DashboardLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="(routes)" options={{ headerShown: false }} />
      <Stack.Screen name="(drivers)" options={{ headerShown: false }} />
      <Stack.Screen name="(assignments)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default DashboardLayout;
