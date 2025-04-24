import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ListingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Schermata Annunci (Listings)</Text>
      {/* Contenuto della schermata Annunci qui */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  text: {
    color: '#fff',
    fontSize: 20,
  },
});

export default ListingsScreen;