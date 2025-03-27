import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { getDrivers, deleteDriver } from "../../../api/driverApi";
import { router } from "expo-router";

const Drivers = () => {
  const dispatch = useDispatch();
  const { drivers, isLoading } = useSelector(
    (state: RootState) => state.driver
  );
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getDrivers(dispatch).finally(() => setRefreshing(false));
  }, [dispatch]);

  useEffect(() => {
    getDrivers(dispatch);
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDriver(id, dispatch);
    } catch (error) {
      console.error("Error al eliminar conductor:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Conductores</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/new")}
        >
          <Text style={styles.buttonText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A55A2" />
        </View>
      ) : (
        <ScrollView
          style={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {drivers.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No hay conductores registrados
              </Text>
            </View>
          ) : (
            drivers.map((driver) => (
              <View key={driver.id} style={styles.driverCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                      {driver.fullName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.driverInfo}>
                    <Text style={styles.driverName}>{driver.fullName}</Text>
                    <Text style={styles.driverEmail}>{driver.email}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View
                    style={[
                      styles.statusBadge,
                      driver.active
                        ? styles.statusActive
                        : styles.statusInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        driver.active
                          ? styles.statusActiveText
                          : styles.statusInactiveText,
                      ]}
                    >
                      {driver.active ? "Activo" : "Inactivo"}
                    </Text>
                  </View>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.editButton]}
                      onPress={() => router.push(`/${driver.id}`)}
                    >
                      <Text style={styles.actionButtonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDelete(driver.id)}
                    >
                      <Text style={styles.actionButtonText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  addButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
  },
  driverCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4A55A2",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  driverInfo: {
    marginLeft: 12,
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  driverEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusActive: {
    backgroundColor: "#e3fcef",
  },
  statusInactive: {
    backgroundColor: "#ffe3e3",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusActiveText: {
    color: "#0d9f6e",
  },
  statusInactiveText: {
    color: "#f05252",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: "#4A55A2",
  },
  deleteButton: {
    backgroundColor: "#dc2626",
  },
  actionButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
  },
});

export default Drivers;
