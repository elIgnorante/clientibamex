import React from 'react';
import { Stack } from "expo-router";

const DataAnalysisLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="dataAnalysis" options={{ headerShown: false }} />
    </Stack>
  );
};

export default DataAnalysisLayout;