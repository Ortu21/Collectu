import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const qualities = [
  { label: "Mint", value: "mint" },
  { label: "Near Mint", value: "near_mint" },
  { label: "Excellent", value: "excellent" },
  { label: "Good", value: "good" },
  { label: "Played", value: "played" },
  { label: "Poor", value: "poor" },
];

export type CardActionProps = {
  onAdd: (qty: number, quality: string) => void;
  onRemove: (qty: number, quality: string) => void;
  disabled?: boolean;
};

export const CardAction: React.FC<CardActionProps> = ({ onAdd, onRemove, disabled }) => {
  const [qty, setQty] = useState(1);
  const [quality, setQuality] = useState("mint");

  const handleQtyChange = (text: string) => {
    const num = parseInt(text.replace(/[^0-9]/g, ""), 10);
    setQty(isNaN(num) ? 1 : Math.max(1, num));
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Quantità</Text>
        <TextInput
          style={styles.input}
          value={qty.toString()}
          onChangeText={handleQtyChange}
          keyboardType="numeric"
          editable={!disabled}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Qualità</Text>
        <View style={styles.qualityContainer}>
          {qualities.map((q) => (
            <TouchableOpacity
              key={q.value}
              style={[
                styles.qualityButton,
                quality === q.value && styles.qualityButtonSelected,
              ]}
              onPress={() => setQuality(q.value)}
              disabled={disabled}
            >
              <Text
                style={[
                  styles.qualityText,
                  quality === q.value && styles.qualityTextSelected,
                ]}
              >
                {q.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.addButton, disabled && styles.disabledButton]}
          onPress={() => onAdd(qty, quality)}
          disabled={disabled}
        >
          <Ionicons name="add-circle" size={22} color="#fff" />
          <Text style={styles.actionText}>Aggiungi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.removeButton, disabled && styles.disabledButton]}
          onPress={() => onRemove(qty, quality)}
          disabled={disabled}
        >
          <Ionicons name="remove-circle" size={22} color="#fff" />
          <Text style={styles.actionText}>Rimuovi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#23272f",
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    width: 80,
  },
  input: {
    backgroundColor: "#2c313a",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 8 : 4,
    fontSize: 16,
    flex: 1,
    marginLeft: 8,
  },
  qualityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 8,
    flex: 1,
  },
  qualityButton: {
    backgroundColor: "#2c313a",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  qualityButtonSelected: {
    backgroundColor: "#007AFF",
  },
  qualityText: {
    color: "#aaa",
    fontSize: 14,
  },
  qualityTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginHorizontal: 4,
  },
  addButton: {
    backgroundColor: "#2ecc71",
  },
  removeButton: {
    backgroundColor: "#e74c3c",
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
