import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { PokemonSet } from '../../types/pokemon';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onFilterPress: () => void;
  selectedSet: PokemonSet | null;
  onClearFilter: () => void;
  totalCount: number;
  isLoading: boolean;
}

export const SearchFilterBar = ({
  searchQuery,
  onSearchChange,
  onFilterPress,
  selectedSet,
  onClearFilter,
  totalCount,
  isLoading
}: SearchFilterBarProps) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Collection</Text>
      
      <View style={styles.filterContainer}>
        <TextInput
          style={[styles.searchInput, { flex: 1 }]}
          placeholder="Search cards..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={onFilterPress}
        >
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>
      
      {selectedSet && (
        <View style={styles.selectedSetContainer}>
          <View style={styles.selectedSetInfo}>
            <Image 
              source={{ uri: selectedSet.logoUrl }} 
              style={styles.selectedSetLogo} 
              resizeMode="contain"
            />
            <Text style={styles.selectedSetName}>{selectedSet.setName}</Text>
          </View>
          <TouchableOpacity onPress={onClearFilter} style={styles.clearFilterButton}>
            <Text style={styles.clearFilterText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.resultCountContainer}>
        {totalCount > 0 && !isLoading && (
          <Text style={styles.resultCount}>
            Found {totalCount} card{totalCount !== 1 ? "s" : ""}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  searchInput: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    width: 80,
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedSetContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  selectedSetInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  selectedSetLogo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  selectedSetName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  clearFilterButton: {
    backgroundColor: "#444",
    borderRadius: 4,
    padding: 6,
  },
  clearFilterText: {
    color: "#fff",
    fontSize: 12,
  },
  resultCountContainer: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  resultCount: {
    color: "#bbb",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    opacity: 0.9,
  },
});