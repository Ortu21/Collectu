import { useState, useEffect, useCallback, useRef } from "react";
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
  
  // Add missing refs
  const isLoadingRef = useRef<boolean>(false);
  const lastRequestParamsRef = useRef<string>("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadPokemonCards = useCallback(async (
    page: number,
    isNewSearch: boolean = false
  ) => {
    // Create a request signature to detect duplicate requests
    const requestSignature = JSON.stringify({
      page,
      searchQuery: searchQuery.trim(),
      setId: selectedSet?.setId || null,
      isNewSearch
    });
    
    // Enhanced duplicate request detection
    // Skip if this exact request is already in progress OR
    // if we're trying to load the same page again (prevents double loading)
    if ((isLoadingRef.current && lastRequestParamsRef.current === requestSignature) ||
        (!isNewSearch && page === currentPage)) {
      console.log("Skipping duplicate request:", requestSignature);
      return;
    }
    
    // Update loading state and request tracking
    if (isNewSearch) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);
    isLoadingRef.current = true;
    lastRequestParamsRef.current = requestSignature;

    try {
      console.log(`Fetching cards: page=${page}, isNewSearch=${isNewSearch}`);
      let result;
      
      if (selectedSet) {
        console.log(
          "Filtering by set:",
          selectedSet.setId,
          "search:",
          searchQuery.trim()
        );
        const searchParam = searchQuery.trim() !== "" ? searchQuery : undefined;
        result = await fetchPokemonCardsBySet(
          selectedSet.setId,
          pageSize,
          page,
          searchParam
        );
      } else if (searchQuery.trim() !== "") {
        result = await searchPokemonCards(searchQuery, pageSize, page);
      } else {
        result = await fetchPokemonCards(pageSize, page);
      }

      setTotalCount(result.totalCount);

      if (isNewSearch) {
        setCards(result.data);
      } else {
        setCards((prevCards) => [...prevCards, ...result.data]);
      }

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
      isLoadingRef.current = false;
    }
  }, [pageSize, searchQuery, selectedSet]);

  // Unified search handler with debounce built-in
  const handleSearch = useCallback(() => {
    // Clear any existing search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    
    setCurrentPage(1);
    // Non svuotiamo le carte durante la digitazione per evitare la pagina vuota
    // setCards([]);
    setHasMoreCards(true);
    
    // Use the timeout ref to track and cancel pending searches
    // Increased debounce time to 800ms to reduce API calls while typing
    searchTimeoutRef.current = setTimeout(() => {
      loadPokemonCards(1, true);
      searchTimeoutRef.current = null;
    }, 800); // Increased debounce for better typing experience
  }, [loadPokemonCards]);

  // Handler for set selection
  const handleSetSelect = useCallback((set: PokemonSet) => {
    // Clear any existing search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    
    setCurrentPage(1);
    setIsLoading(true); // Impostiamo lo stato di caricamento immediatamente
    setHasMoreCards(true);
    setSelectedSet(set);
    
    // Delay the API call slightly to ensure state updates are processed
    // Using a longer timeout to prevent race conditions
    searchTimeoutRef.current = setTimeout(() => {
      loadPokemonCards(1, true);
      searchTimeoutRef.current = null;
    }, 100);
  }, [loadPokemonCards]);

  // Handler for clearing set filter
  const clearSetFilter = useCallback(() => {
    // Clear any existing search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    
    setCurrentPage(1);
    setIsLoading(true); // Impostiamo lo stato di caricamento immediatamente
    setHasMoreCards(true);
    setSelectedSet(null);
    
    searchTimeoutRef.current = setTimeout(() => {
      loadPokemonCards(1, true);
      searchTimeoutRef.current = null;
    }, 100);
  }, [loadPokemonCards]);

  // Handler for loading more cards
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMoreCards && !isLoadingRef.current) {
      loadPokemonCards(currentPage + 1);
    }
  }, [currentPage, hasMoreCards, isLoadingMore, loadPokemonCards]);

  // Handler for refreshing the card list
  const handleRefresh = useCallback(() => {
    if (!isLoadingRef.current) {
      loadPokemonCards(1, true);
    }
  }, [loadPokemonCards]);

  // Single unified effect for search query changes
  useEffect(() => {
    if (isInitialized && user) {
      // Only trigger search when query changes, not on initial mount
      // This prevents duplicate API calls
      handleSearch();
    }
    
    // Cleanup function to clear any pending timeouts
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    };
  }, [searchQuery, isInitialized, user, handleSearch]);
  
  // Create a ref to track initial mount
  const isInitialMount = useRef(true);
  
  // Effect for initial load and authentication changes
  useEffect(() => {
    if (isInitialized && user && !isLoadingRef.current) {
      // Only load cards on initial mount or when auth changes
      // This prevents duplicate API calls
      if (isInitialMount.current) {
        isInitialMount.current = false;
        const timer = setTimeout(() => {
          loadPokemonCards(1, true);
        }, 100);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isInitialized, user, loadPokemonCards]);
  
  // Effect for set selection changes
  useEffect(() => {
    // This effect will run when selectedSet changes, but we handle the API call
    // directly in the handleSetSelect and clearSetFilter functions
    // This is intentionally empty to avoid duplicate API calls
  }, [selectedSet]);

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
