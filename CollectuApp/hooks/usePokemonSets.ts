import { useState, useEffect } from 'react';
import { fetchPokemonSets } from '../services/api';
import { PokemonSet } from '../types/pokemon';

interface UsePokemonSetsProps {
  user: any; // Firebase user object
  isInitialized: boolean;
}

interface UsePokemonSetsReturn {
  sets: PokemonSet[];
  isLoadingSets: boolean;
  isSetModalVisible: boolean;
  setIsSetModalVisible: (visible: boolean) => void;
  loadPokemonSets: () => Promise<void>;
}

export const usePokemonSets = ({
  user,
  isInitialized
}: UsePokemonSetsProps): UsePokemonSetsReturn => {
  const [sets, setSets] = useState<PokemonSet[]>([]);
  const [isLoadingSets, setIsLoadingSets] = useState(false);
  const [isSetModalVisible, setIsSetModalVisible] = useState(false);

  // Load Pokemon sets when initialized and user is authenticated
  useEffect(() => {
    if (isInitialized && user) {
      loadPokemonSets();
    }
  }, [isInitialized, user]);

  const loadPokemonSets = async () => {
    setIsLoadingSets(true);
    try {
      console.log('Loading Pokemon sets...');
      const setsData = await fetchPokemonSets();
      console.log('Sets data received:', setsData);
      
      // Ensure sets is always an array, even if API returns unexpected data
      if (Array.isArray(setsData)) {
        console.log('Sets data is an array with length:', setsData.length);
        setSets(setsData);
      } else {
        console.error("Unexpected data format for sets:", setsData);
        setSets([]); // Set to empty array as fallback
      }
    } catch (err) {
      console.error("Error loading Pokemon sets:", err);
      setSets([]); // Set to empty array on error
    } finally {
      setIsLoadingSets(false);
    }
  };

  return {
    sets,
    isLoadingSets,
    isSetModalVisible,
    setIsSetModalVisible,
    loadPokemonSets
  };
};