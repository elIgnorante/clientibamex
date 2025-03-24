import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";

const Dashboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text1}>Dashboard</Text>
      {/* Sección de Rutas */}
      <Link href="/(admin)/(dashboard)/(routes)/routes" asChild>
        <TouchableOpacity style={styles.section}>
          <Text style={styles.sectionTitle}>Routes</Text>
          <Text style={styles.sectionCount}>NULL</Text>
          <Text style={styles.sectionSubtitle}>Manage your route planning</Text>
        </TouchableOpacity>
      </Link>

      {/* Sección de Conductores */}
      <Link href="/(admin)/(dashboard)/(drivers)/drivers" asChild>
        <TouchableOpacity style={styles.section}>
          <Text style={styles.sectionTitle}>Drivers</Text>
          <Text style={styles.sectionCount}>NULL</Text>
          <Text style={styles.sectionSubtitle}>Manage your drivers</Text>
        </TouchableOpacity>
      </Link>

      {/* Sección de Asignación de Rutas */}
      <Link href="/(admin)/(dashboard)/(assignments)/assignments" asChild>
        <TouchableOpacity style={styles.section}>
          <Text style={styles.sectionTitle}>Route Assignment</Text>
          <Text style={styles.sectionCount}>NULL</Text>
          <Text style={styles.sectionSubtitle}>Assign routes to drivers</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  text1: {
    fontSize:32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
    marginVertical: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default Dashboard;
