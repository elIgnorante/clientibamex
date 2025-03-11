
import React from 'react';
import { Stack } from "expo-router";

const ClientLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="home-client" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ClientLayout;