import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useLocalSearchParams, router } from "expo-router";
import { RootState } from "../../../store/store";
import { updateDriver } from "../../../api/driverApi";

const EditDriver = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { drivers, isLoading } = useSelector(
    (state: RootState) => state.driver
  );
  const driver = drivers?.find((d) => d.id == id);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    active: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (driver) {
      setFormData({
        username: driver.username,
        email: driver.email,
        fullName: driver.fullName,
        password: "",
        active: driver.active,
      });
    }
  }, [driver]);

  const handleSubmit = async () => {
    try {
      const driverId = Array.isArray(id) ? id[0] : id;
      if (!driverId) return;
      await updateDriver(driverId, formData, dispatch);
      router.back();
    } catch (error) {
      console.error("Error al actualizar conductor:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A55A2" />
      </View>
    );
  }

  if (!driver) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Conductor no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Editar Conductor</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput
            style={styles.input}
            value={formData.fullName}
            onChangeText={(text) =>
              setFormData({ ...formData, fullName: text })
            }
            placeholder="Ingrese nombre completo"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            style={styles.input}
            value={formData.username}
            onChangeText={(text) =>
              setFormData({ ...formData, username: text })
            }
            placeholder="Ingrese nombre de usuario"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Ingrese email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nueva Contraseña</Text>
          <TextInput
            style={styles.input}
            value={formData.password}
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
            placeholder="Ingrese nueva contraseña"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.statusToggle}
          onPress={() =>
            setFormData((prev) => ({ ...prev, active: !prev.active }))
          }
        >
          <View
            style={[styles.checkbox, formData.active && styles.checkboxActive]}
          />
          <Text style={styles.statusLabel}>Usuario Activo</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
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
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#2c3e50",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e1e8ed",
    fontSize: 16,
  },
  statusToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#4A55A2",
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: "#4A55A2",
  },
  statusLabel: {
    fontSize: 16,
    color: "#2c3e50",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#4A55A2",
  },
  cancelButton: {
    backgroundColor: "#dc2626",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#dc2626",
  },
});

export default EditDriver;
