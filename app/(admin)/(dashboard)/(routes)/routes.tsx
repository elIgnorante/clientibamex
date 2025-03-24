import React from 'react';
import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { Link } from "expo-router";
import Map from '@/components/Map';


const Routes = () => {
  const [activeButton, setActiveButton] = useState('create'); // Estado para el botón activo
  const [showMap, setShowMap] = useState(false); // Estado para mostrar/ocultar el mapa
  const [routeName, setRouteName] = useState('');
  const [description, setDescription] = useState('');

  const handleSaveRoute = () => {
    console.log('Route saved:', { routeName, description });
  };
  
  const handleGenerateRoute = () => {
    console.log('Route generated:', { routeName, description });
  };
  return (
    <ScrollView className="flex-1 p-5 bg-gray-100">
      {/* Título y descripción */}
      <Text className="text-2xl font-bold text-gray-800 mb-2">Route Planner</Text>
      <Text className="text-base text-gray-600 mb-5">
        Create routes by adding stops on the map. Once you've added all your stops, generate a complete route from the first to the last stop.
      </Text>

      {/* Botones principales con efecto de switch */}
      <View className="bg-gray-200 rounded-lg p-2 mb-5">
        <View className="flex flex-row justify-between">
          <TouchableOpacity
            className={`flex-1 p-3 rounded-lg items-center ${
              activeButton === 'create' ? 'bg-blue-500' : 'bg-gray-200'
            }`}
            onPress={() => setActiveButton('create')}
          >
            <Text
              className={`text-base font-bold ${
                activeButton === 'create' ? 'text-white' : 'text-blue-500'
              }`}
            >
              Create Route
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 p-3 rounded-lg items-center ${
              activeButton === 'view' ? 'bg-blue-500' : 'bg-gray-200'
            }`}
            onPress={() => setActiveButton('view')}
          >
            <Text
              className={`text-base font-bold ${
                activeButton === 'view' ? 'text-white' : 'text-blue-500'
              }`}
            >
              View Routes
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón "Create New Route" con recuadro punteado */}
      <View className="border-2 border-dashed border-blue-500 rounded-lg p-10 items-center justify-center mt-5">
        <TouchableOpacity
          className="bg-green-500 p-4 rounded-lg w-[70%] items-center"
          onPress={() => setShowMap(!showMap)}
        >
          <Text className="text-white text-base font-bold">Create New Route</Text>
        </TouchableOpacity>
      </View>
      {/* Mostrar el mapa si showMap es true */}
      {showMap ? (
        <>
        <View className="h-[300px] mb-5 p-5 border-2 border-gray-300 rounded-lg mt-10">
          <Map /> 
        </View>
        
        <View className=" p-5 border-2 border-gray-300 rounded-lg  mb-5 mt-5">
        <Text className="text-xl font-bold text-gray-800 mb-4">Route Details</Text>
        
        
        <Text className="text-base font-semibold text-gray-700 mb-1">Route Name</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-4"
          placeholder="Enter route name"
          value={routeName}
          onChangeText={setRouteName}
        />
        
        
        <Text className="text-base font-semibold text-gray-700 mb-1">Description (Optional)</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-4"
          placeholder="Enter route description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        
        <View className="flex flex-row justify-between">
          <TouchableOpacity
            className="bg-blue-500 p-3 rounded-lg flex-1 mr-2 items-center"
            onPress={handleSaveRoute}
          >
            <Text className="text-white text-base font-bold">Save Route</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-green-500 p-3 rounded-lg flex-1 ml-2 items-center"
            onPress={handleGenerateRoute}
          >
            <Text className="text-white text-base font-bold">Generate Route</Text>
          </TouchableOpacity>
        </View>
      </View>
      </>
      ) : null}
    </ScrollView>
  );
};

export default Routes;
