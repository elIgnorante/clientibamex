import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { getDrivers } from "../../../api/driverApi";
import api from "../../../api/axios";

interface Bus {
  id: string;
  busId: string;
  licensePlate: string;
  driverId?: string | null;
}

const Assignments = () => {
  const dispatch = useDispatch();
  const { drivers, isLoading } = useSelector(
    (state: RootState) => state.driver
  );
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    getDrivers(dispatch);
    fetchBuses();
  }, [dispatch]);

  const fetchBuses = async () => {
    try {
      const response = await api.get("/buses");
      setBuses(response.data);
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
  };

  const handleAssignment = async () => {
    if (!selectedDriver || !selectedBus) return;

    try {
      setLoading(true);
      await api.post("/buses/assign", {
        driverId: selectedDriver,
        busId: selectedBus,
      });
      setSuccessMessage("Conductor asignado exitosamente!");
      setSelectedDriver(null);
      setSelectedBus(null);
      fetchBuses();
    } catch (error) {
      console.error("Error assigning bus:", error);
      setSuccessMessage("Error al asignar conductor.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(null), 3000); //hide message after 3 seconds
    }
  };

  const availableDrivers = drivers.filter(
    (driver) => !buses.some((bus) => bus.driverId === driver.id)
  );

  const availableBuses = buses.filter((bus) => !bus.driverId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Asignaciones</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#4A55A2" />
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conductores Disponibles</Text>
            {availableDrivers.length === 0 ? (
              <Text style={styles.noDriversMessage}>
                No hay conductores disponibles.
              </Text>
            ) : (
              availableDrivers.map((driver) => (
                <TouchableOpacity
                  key={`driver-${driver.id}`}
                  style={[
                    styles.card,
                    selectedDriver === driver.id && styles.selectedCard,
                  ]}
                  onPress={() => setSelectedDriver(driver.id)}
                >
                  <Text style={styles.cardTitle}>{driver.fullName}</Text>
                  <Text style={styles.cardSubtitle}>{driver.email}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Autobuses Disponibles</Text>
            {availableBuses.map((bus, index) => (
              <TouchableOpacity
                key={`bus-${bus.busId}-${bus.id}-${index}`}
                style={[
                  styles.card,
                  selectedBus === bus.id && styles.selectedCard,
                ]}
                onPress={() => setSelectedBus(bus.id)}
              >
                <Text style={styles.cardTitle}>Bus ID: {bus.busId}</Text>
                <Text style={styles.cardSubtitle}>
                  Placa: {bus.licensePlate}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {successMessage && (
            <View style={styles.successMessage}>
              <Text style={styles.successMessageText}>{successMessage}</Text>
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.assignButton,
              (!selectedDriver || !selectedBus) && styles.disabledButton,
            ]}
            onPress={handleAssignment}
            disabled={!selectedDriver || !selectedBus || loading}
          >
            <Text style={styles.assignButtonText}>
              {loading ? "Asignando..." : "Asignar"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#4A55A2",
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e1e8ed",
  },
  selectedCard: {
    backgroundColor: "#e8f0fe",
    borderColor: "#4A55A2",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2c3e50",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  assignButton: {
    backgroundColor: "#4A55A2",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  assignButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  successMessage: {
    backgroundColor: "#d4edda",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  successMessageText: {
    color: "#155724",
    fontSize: 14,
  },
  noDriversMessage: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default Assignments;
