import React from 'react';
import { Stack } from "expo-router";

const AssignmentsLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="assignments" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AssignmentsLayout;