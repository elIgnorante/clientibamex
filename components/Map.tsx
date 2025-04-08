import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import { useDispatch } from "react-redux";
import {
  createRoute,
  fetchRoutes,
  Route,
  updateRoute,
  deleteRoute,
} from "../app/api/routeApi";
import { ScrollView } from "react-native-gesture-handler";

interface Stop {
  latitude: number;
  longitude: number;
  name: string;
}

const RoutePlanner = () => {
  const dispatch = useDispatch();
  const mapRef = useRef<MapView>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [routeName, setRouteName] = useState("");
  const [routeDescription, setRouteDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"create" | "view">("create");
  const [routeCode] = useState("TR2R15");
  const [showSuccess, setShowSuccess] = useState(false);

  const [routes, setRoutes] = useState<Route[]>([]); // Tipar el estado como Route[]
  const [isFetchingRoutes, setIsFetchingRoutes] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null); // Ruta seleccionada
  const [isModalVisible, setIsModalVisible] = useState(false); // Controla la visibilidad del modal
  const [isUpdating, setIsUpdating] = useState(false);

  // logica para realizar operaciones en las rutas
  const loadRoutes = async () => {
    setIsFetchingRoutes(true);
    try {
      const fetchedRoutes = await fetchRoutes(dispatch); // Llama a fetchRoutes con dispatch
      setRoutes(fetchedRoutes); // Almacena las rutas en el estado
    } catch (error) {
      console.error("Error fetching routes:", error);
      Alert.alert("Error", "Failed to fetch routes. Please try again.");
    } finally {
      setIsFetchingRoutes(false);
    }
  };

  // Llama a loadRoutes al cambiar al modo "view"
  useEffect(() => {
    if (viewMode === "view") {
      loadRoutes();
    }
  }, [viewMode]);

  // Función para abrir el modal con la ruta seleccionada
  const openRouteDetails = (route: Route) => {
    setSelectedRoute(route);
    setIsModalVisible(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setSelectedRoute(null);
    setIsModalVisible(false);
  };

  // Función para actualizar la ruta
  const handleUpdateRoute = async () => {
    if (!selectedRoute) return;

    setIsUpdating(true);
    try {
      await updateRoute(selectedRoute.id!, selectedRoute, dispatch);
      Alert.alert("Success", "Route updated successfully!");
      loadRoutes(); // Recargar las rutas después de actualizar
      closeModal();
    } catch (error) {
      console.error("Error updating route:", error);
      Alert.alert("Error", "Failed to update route. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Función para eliminar la ruta
  const handleDeleteRoute = async (id: number) => {
    Alert.alert("Delete Route", "Are you sure you want to delete this route?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await deleteRoute(id, dispatch);
            Alert.alert("Success", "Route deleted successfully!");
            loadRoutes(); // Recargar las rutas después de eliminar
          } catch (error) {
            console.error("Error deleting route:", error);
            Alert.alert("Error", "Failed to delete route. Please try again.");
          }
        },
      },
    ]);
  };

  // Fin de operaciones rutas

  const initialRegion = {
    latitude: 21.885256,
    longitude: -102.291567,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const handleMapPress = (e: any) => {
    if (viewMode !== "create") return;

    const newStop: Stop = {
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
      name: `Stop ${stops.length + 1}`,
    };

    setStops([...stops, newStop]);
  };

  const traceRoute = async () => {
    if (stops.length < 2) {
      setRouteCoordinates([]);
      return;
    }

    try {
      const waypoints = stops
        .slice(1, -1)
        .map((stop) => `${stop.latitude},${stop.longitude}`)
        .join("|");

      const origin = `${stops[0].latitude},${stops[0].longitude}`;
      const destination = `${stops[stops.length - 1].latitude},${stops[stops.length - 1].longitude}`;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${waypoints}&key=${process.env.EXPO_PUBLIC_GOOGLEAPI_KEY}`
      );

      const data = await response.json();

      if (data.routes.length > 0) {
        const points = data.routes[0].overview_polyline.points;
        const coordinates = decodePolyline(points);
        setRouteCoordinates(coordinates);

        if (mapRef.current && coordinates.length > 0) {
          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }
      }
    } catch (error) {
      console.error("Error tracing route:", error);
    }
  };

  const decodePolyline = (encoded: string) => {
    const poly: { latitude: number; longitude: number }[] = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      poly.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return poly;
  };

  const saveRoute = async () => {
    if (stops.length < 2 || !routeName) return;

    setIsLoading(true);
    try {
      await createRoute(
        {
          name: routeName,
          description: routeDescription,
          stops: stops.map((stop) => ({
            name: stop.name,
            lat: stop.latitude,
            lng: stop.longitude,
          })),
        },
        dispatch
      );

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setStops([]);
      setRouteCoordinates([]);
      setRouteName("");
      setRouteDescription("");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === "create") {
      traceRoute();
    }
  }, [stops]);

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Encabezado */}
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800">Route Planner</Text>
        <Text className="text-gray-600 mt-1">
          Create routes by adding stops on the map. Once you've added all your
          stops, generate a complete route from the first to the last stop.
        </Text>
      </View>

      {/* Switch de modos */}
      <View className="flex-row border-b border-gray-200">
        <TouchableOpacity
          className={`flex-1 py-3 items-center ${viewMode === "create" ? "border-b-2 border-blue-500" : ""}`}
          onPress={() => setViewMode("create")}
        >
          <Text
            className={`font-medium ${viewMode === "create" ? "text-blue-500" : "text-gray-500"}`}
          >
            Create Route
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 items-center ${viewMode === "view" ? "border-b-2 border-blue-500" : ""}`}
          onPress={() => setViewMode("view")}
        >
          <Text
            className={`font-medium ${viewMode === "view" ? "text-blue-500" : "text-gray-500"}`}
          >
            View Routes
          </Text>
        </TouchableOpacity>
      </View>

      {showSuccess && (
        <View className="mx-4 mt-4 bg-green-100 border border-green-400 rounded-lg p-3">
          <Text className="text-green-700">¡Ruta creada correctamente!</Text>
        </View>
      )}

      {viewMode === "create" ? (
        <>
          {/* Sección de mapa con bordes redondeados */}
          <View className="p-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xl font-bold">Map</Text>
              <Text className="text-gray-600">Route Code: </Text>
            </View>

            <View className="h-[400px] rounded-xl overflow-hidden mt-2 border border-gray-200">
              <MapView
                provider={PROVIDER_DEFAULT}
                ref={mapRef}
                style={{ flex: 1 }}
                initialRegion={initialRegion}
                onPress={handleMapPress}
              >
                {stops.map((stop, index) => (
                  <Marker
                    key={`stop-${index}`}
                    coordinate={stop}
                    pinColor="#3B82F6"
                  >
                    <View className="bg-blue-500 p-2 rounded-full border-2 border-white">
                      <Text className="text-white font-bold">{index + 1}</Text>
                    </View>
                  </Marker>
                ))}

                {routeCoordinates.length > 0 && (
                  <Polyline
                    coordinates={routeCoordinates}
                    strokeColor="#3B82F6"
                    strokeWidth={4}
                  />
                )}
              </MapView>
            </View>
          </View>

          {/* Sección de Route Details con el botón Save dentro */}
          <View className="mx-4 p-4 border border-gray-200 rounded-xl mb-4">
            <Text className="text-xl font-bold mb-3">Route Details</Text>

            <Text className="text-base font-semibold text-gray-700 mb-1">
              Route Name
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Enter route name"
              value={routeName}
              onChangeText={setRouteName}
            />

            <Text className="text-base font-semibold text-gray-700 mb-1">
              Description (Optional)
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3 h-20"
              placeholder="Enter route description"
              value={routeDescription}
              onChangeText={setRouteDescription}
              multiline
            />

            {/* Botón Save dentro del recuadro */}
            <TouchableOpacity
              className="bg-blue-500 rounded-lg p-3 items-center mt-2"
              onPress={saveRoute}
              disabled={isLoading || stops.length < 2 || !routeName}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-medium">Save Route</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Sección de paradas con bordes redondeados */}
          <View className="mx-4 mb-4 p-4 border border-gray-200 rounded-xl">
            <Text className="text-xl font-bold mb-2">
              Stops ({stops.length})
            </Text>

            {stops.length === 0 ? (
              <Text className="text-gray-500 italic">
                Click on the map to add stops
              </Text>
            ) : (
              stops.map((stop, index) => (
                <View
                  key={`stop-${index}`}
                  className="flex-row items-center py-2 border-b border-gray-100"
                >
                  <View className="bg-blue-100 w-8 h-8 rounded-full items-center justify-center mr-3">
                    <Text className="text-blue-600 font-bold">{index + 1}</Text>
                  </View>
                  <Text className="flex-1">Stop {index + 1}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      const newStops = [...stops];
                      newStops.splice(index, 1);
                      setStops(newStops);
                    }}
                  >
                    <Text className="text-red-500 font-bold px-2">✕</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </>
      ) : (
        <View className="p-4">
          <Text className="text-xl font-bold mb-4">Available Routes</Text>
          {isFetchingRoutes ? (
            <ActivityIndicator size="large" color="#3B82F6" />
          ) : routes.length === 0 ? (
            <Text className="text-gray-500 italic">No routes available</Text>
          ) : (
            routes.map((route, index) => (
              <View
                key={`route-${index}`}
                className="p-4 mb-4 border border-gray-200 rounded-lg bg-white shadow-sm"
              >
                <Text className="text-lg font-bold text-gray-800">
                  {route.name}
                </Text>
                <Text className="text-gray-600">
                  {route.description || "No description provided"}
                </Text>
                <Text className="text-sm text-gray-500 mt-2">
                  Stops: {route.stops.length}
                </Text>
                <View className="flex-row justify-start gap-4">
                  <TouchableOpacity
                    className="mt-2 bg-blue-500 rounded-lg p-2 items-center"
                    onPress={() => openRouteDetails(route)}
                  >
                    <Text className="text-white font-medium">View Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="mt-2 bg-red-500 rounded-lg p-2 items-center"
                    onPress={() => handleDeleteRoute(route.id!)}
                  >
                    <Text className="text-white font-medium">Delete Route</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={closeModal}
          >
            <View className="flex-1 justify-center items-center">
              <View className="w-full bg-white rounded-lg p-6">
                <ScrollView
                  className="w-full"
                  contentContainerStyle={{ paddingBottom: 20 }}
                  keyboardShouldPersistTaps="handled"
                >
                  <Text className="text-xl font-bold mb-4">Edit Route</Text>
                  {selectedRoute && (
                    <>
                      {/* Sección de mapa con bordes redondeados */}
                      <View className="p-4">
                        <View className="flex-row justify-between items-center mb-2">
                          <Text className="text-xl font-bold">Map</Text>
                          <Text className="text-gray-600">
                            Route Code: {selectedRoute.routeId || "N/A"}
                          </Text>
                        </View>

                        <View className="h-[400px] rounded-xl overflow-hidden mt-2 border border-gray-200">
                          <MapView
                            provider={PROVIDER_DEFAULT}
                            ref={mapRef}
                            style={{ flex: 1 }}
                            initialRegion={{
                              latitude:
                                selectedRoute.stops[0]?.lat || 21.885256,
                              longitude:
                                selectedRoute.stops[0]?.lng || -102.291567,
                              latitudeDelta: 0.1,
                              longitudeDelta: 0.1,
                            }}
                            onPress={(e) => {
                              const newStop = {
                                name: `Stop ${selectedRoute.stops.length + 1}`,
                                lat: e.nativeEvent.coordinate.latitude,
                                lng: e.nativeEvent.coordinate.longitude,
                              };
                              setSelectedRoute({
                                ...selectedRoute,
                                stops: [...selectedRoute.stops, newStop],
                              });
                            }}
                          >
                            {selectedRoute.stops.map((stop, index) => (
                              <Marker
                                key={`stop-${index}`}
                                coordinate={{
                                  latitude: stop.lat,
                                  longitude: stop.lng,
                                }}
                                pinColor="#3B82F6"
                              >
                                <View className="bg-blue-500 p-2 rounded-full border-2 border-white">
                                  <Text className="text-white font-bold">
                                    {index + 1}
                                  </Text>
                                </View>
                              </Marker>
                            ))}

                            {selectedRoute.stops.length > 1 && (
                              <Polyline
                                coordinates={selectedRoute.stops.map(
                                  (stop) => ({
                                    latitude: stop.lat,
                                    longitude: stop.lng,
                                  })
                                )}
                                strokeColor="#3B82F6"
                                strokeWidth={4}
                              />
                            )}
                          </MapView>
                        </View>
                      </View>

                      {/* Sección de Route Details con el botón Save dentro */}
                      <View className="mx-4 p-4 border border-gray-200 rounded-xl mb-4">
                        <Text className="text-xl font-bold mb-3">
                          Route Details
                        </Text>

                        <Text className="text-base font-semibold text-gray-700 mb-1">
                          Route Name
                        </Text>
                        <TextInput
                          className="border border-gray-300 rounded-lg p-3 mb-3"
                          placeholder="Enter route name"
                          value={selectedRoute.name}
                          onChangeText={(text) =>
                            setSelectedRoute({ ...selectedRoute, name: text })
                          }
                        />

                        <Text className="text-base font-semibold text-gray-700 mb-1">
                          Description (Optional)
                        </Text>
                        <TextInput
                          className="border border-gray-300 rounded-lg p-3 mb-3 h-20"
                          placeholder="Enter route description"
                          value={selectedRoute.description || ""}
                          onChangeText={(text) =>
                            setSelectedRoute({
                              ...selectedRoute,
                              description: text,
                            })
                          }
                          multiline
                        />

                        {/* Botón Save dentro del recuadro */}
                        <TouchableOpacity
                          className="bg-blue-500 rounded-lg p-3 items-center mt-2"
                          onPress={async () => {
                            setIsUpdating(true);
                            try {
                              await updateRoute(
                                selectedRoute.id!,
                                selectedRoute,
                                dispatch
                              );
                              Alert.alert(
                                "Success",
                                "Route updated successfully!"
                              );
                              loadRoutes(); // Recargar las rutas después de actualizar
                              closeModal();
                            } catch (error) {
                              console.error("Error updating route:", error);
                              Alert.alert(
                                "Error",
                                "Failed to update route. Please try again."
                              );
                            } finally {
                              setIsUpdating(false);
                            }
                          }}
                          disabled={
                            isUpdating ||
                            selectedRoute.stops.length < 2 ||
                            !selectedRoute.name
                          }
                        >
                          {isUpdating ? (
                            <ActivityIndicator color="white" />
                          ) : (
                            <Text className="text-white font-medium">
                              Save Changes
                            </Text>
                          )}
                        </TouchableOpacity>
                      </View>

                      {/* Sección de paradas con bordes redondeados */}
                      <View className="mx-4 mb-4 p-4 border border-gray-200 rounded-xl">
                        <Text className="text-xl font-bold mb-2">
                          Stops ({selectedRoute.stops.length})
                        </Text>

                        {selectedRoute.stops.length === 0 ? (
                          <Text className="text-gray-500 italic">
                            Click on the map to add stops
                          </Text>
                        ) : (
                          selectedRoute.stops.map((stop, index) => (
                            <View
                              key={`stop-${index}`}
                              className="flex-row items-center py-2 border-b border-gray-100"
                            >
                              <View className="bg-blue-100 w-8 h-8 rounded-full items-center justify-center mr-3">
                                <Text className="text-blue-600 font-bold">
                                  {index + 1}
                                </Text>
                              </View>
                              <Text className="flex-1">{stop.name}</Text>
                              <TouchableOpacity
                                onPress={() => {
                                  const newStops = [...selectedRoute.stops];
                                  newStops.splice(index, 1);
                                  setSelectedRoute({
                                    ...selectedRoute,
                                    stops: newStops,
                                  });
                                }}
                              >
                                <Text className="text-red-500 font-bold px-2">
                                  ✕
                                </Text>
                              </TouchableOpacity>
                            </View>
                          ))
                        )}
                      </View>
                    </>
                  )}
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>
      )} 
    </ScrollView>
  );
};
 
export default RoutePlanner;
