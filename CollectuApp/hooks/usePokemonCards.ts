import { useState, useEffect, useCallback } from "react";
import {
  fetchPokemonCards,
  searchPokemonCards,
  fetchPokemonCardsBySet,
} from "../services/api";
import { PokemonCard, PokemonSet } from "../types/pokemon";

interface UsePokemonCardsProps {
  initialPageSize?: number;
  user: any; // Firebase user object
  isInitialized: boolean;
}

interface UsePokemonCardsReturn {
  cards: PokemonCard[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  totalCount: number;
  hasMoreCards: boolean;
  selectedSet: PokemonSet | null;
  setSelectedSet: (set: PokemonSet | null) => void;
  handleSearch: () => void;
  handleSetSelect: (set: PokemonSet) => void;
  clearSetFilter: () => void;
  loadPokemonCards: (page: number, isNewSearch?: boolean) => Promise<void>;
  handleLoadMore: () => void;
  handleRefresh: () => void;
}

export const usePokemonCards = ({
  initialPageSize = 20,
  user,
  isInitialized,
}: UsePokemonCardsProps): UsePokemonCardsReturn => {
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMoreCards, setHasMoreCards] = useState(true);
  const [selectedSet, setSelectedSet] = useState<PokemonSet | null>(null);
  const pageSize = initialPageSize;

  // Effetto per gestire la ricerca con debounce
  const loadPokemonCards = useCallback(async (
    page: number,
    isNewSearch: boolean = false
  ) => {
    if (isNewSearch) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);

    try {
      let result;
      if (selectedSet) {
        // Filtra per set, e opzionalmente anche per nome/numero
        console.log(
          "Filtering by set:",
          selectedSet.setId,
          "search:",
          searchQuery.trim()
        );
        // Always pass the search query parameter, even if it's empty
        const searchParam = searchQuery.trim() !== "" ? searchQuery : undefined;
        result = await fetchPokemonCardsBySet(
          selectedSet.setId,
          pageSize,
          page,
          searchParam
        );
      } else if (searchQuery.trim() !== "") {
        // Usa la ricerca avanzata
        result = await searchPokemonCards(searchQuery, pageSize, page);
      } else {
        // Carica tutte le carte
        result = await fetchPokemonCards(pageSize, page);
      }

      setTotalCount(result.totalCount);

      if (isNewSearch) {
        setCards(result.data);
      } else {
        setCards((prevCards) => [...prevCards, ...result.data]);
      }

      // Verifica se ci sono altre carte da caricare
      setHasMoreCards(page * pageSize < result.totalCount);
      setCurrentPage(page);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch Pokemon cards"
      );
      console.error("Error fetching Pokemon cards:", err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [pageSize, searchQuery, selectedSet]);

  const handleSearch = useCallback(() => {
    // Reset dello stato e caricamento delle carte filtrate
    setCurrentPage(1);
    setCards([]);
    setHasMoreCards(true);
    loadPokemonCards(1, true);
  }, [searchQuery, selectedSet]); // Rimosso loadPokemonCards dalle dipendenze

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (isInitialized && user) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, isInitialized, user, handleSearch]);

  const handleSetSelect = useCallback((set: PokemonSet) => {
    // First set loading state to prevent flickering
    setIsLoading(true);
    // Then update the state
    setCurrentPage(1);
    setCards([]);
    setHasMoreCards(true);
    // Update selectedSet immediately
    setSelectedSet(set);

    // No need to call API directly here, the useEffect will handle it
    // when selectedSet changes
  }, []);

  const clearSetFilter = useCallback(() => {
    // First set loading state to prevent flickering
    setIsLoading(true);
    // Then update the state
    setCurrentPage(1);
    setCards([]);
    setHasMoreCards(true);
    // Update selectedSet immediately
    setSelectedSet(null);

    // No need to call API directly here, the useEffect will handle it
    // when selectedSet changes
  }, []);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMoreCards) {
      loadPokemonCards(currentPage + 1);
    }
  };

  const handleRefresh = () => {
    loadPokemonCards(1, true);
  };

  // Initial load effect
  useEffect(() => {
    if (isInitialized && user) {
      const timer = setTimeout(() => {
        loadPokemonCards(1, true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isInitialized, user, selectedSet, searchQuery, loadPokemonCards]);

  // Remove the separate search effect since we've combined it above
  useEffect(() => {
    if (isInitialized && user) {
      loadPokemonCards(1, true);
    }
  }, [isInitialized, user]); // Removed loadPokemonCards from dependencies

  return {
    cards,
    isLoading,
    isLoadingMore,
    error,
    searchQuery,
    setSearchQuery,
    currentPage,
    totalCount,
    hasMoreCards,
    selectedSet,
    setSelectedSet,
    handleSearch,
    handleSetSelect,
    clearSetFilter,
    loadPokemonCards,
    handleLoadMore,
    handleRefresh,
  };
};
