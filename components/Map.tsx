import React from 'react';
import { View, Text } from 'react-native';
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps';
const Map = () => {
  return (
    <View className="w-full h-full">
      {/* Encabezado con "Map" y código de ruta */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xl font-bold">Map</Text>
        <Text className="text-lg text-gray-600" >Route Code: {}</Text>
      </View>

      {/* Mapa */}
      <View className="flex-1 rounded-2xl overflow-hidden">
        <MapView
          provider={PROVIDER_DEFAULT}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 21.885256,
            longitude: -102.291567,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          mapType="standard"
          showsPointsOfInterest={false}
        />
      </View>
    </View>
  )
}
export default Map;