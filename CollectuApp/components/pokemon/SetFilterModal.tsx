import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ActivityIndicator, ScrollView, Image } from 'react-native';
import { PokemonSet } from '../../types/pokemon';

interface SetFilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  sets: PokemonSet[];
  isLoading: boolean;
  onSelectSet: (set: PokemonSet) => void;
}

export const SetFilterModal = ({
  isVisible,
  onClose,
  sets,
  isLoading,
  onSelectSet
}: SetFilterModalProps) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select a Set</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Loading sets...</Text>
            </View>
          ) : (
            <ScrollView style={styles.setsList}>
              {sets.map((set) => (
                <TouchableOpacity 
                  key={set.setId} 
                  style={styles.setItem}
                  onPress={() => onSelectSet(set)}
                >
                  <Image 
                    source={{ uri: set.logoUrl }} 
                    style={styles.setLogo} 
                    resizeMode="contain"
                  />
                  <View style={styles.setInfo}>
                    <Text style={styles.setName}>{set.setName}</Text>
                    <Text style={styles.setSeries}>{set.series}</Text>
                    <Text style={styles.setDate}>{set.releaseDate}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#25292e",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    fontSize: 20,
    color: "#fff",
    padding: 5,
  },
  setsList: {
    flex: 1,
  },
  setItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  setLogo: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  setInfo: {
    flex: 1,
  },
  setName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  setSeries: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 2,
  },
  setDate: {
    color: "#777",
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#aaa",
  },
});