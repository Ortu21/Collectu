import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchPokemonCards,
  searchPokemonCards,
  fetchPokemonCardsBySet,
} from "../services/api";
import { PokemonCard, PokemonSet } from "../types/pokemon";

interface UsePokemonCardsProps {
  initialPageSize?: number;
  user: any;
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

  const isLoadingRef = useRef<boolean>(false);
  const lastRequestParamsRef = useRef<string>("");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadPokemonCards = useCallback(
    async (page: number, isNewSearch: boolean = false) => {
      const requestSignature = JSON.stringify({
        page,
        searchQuery: searchQuery.trim(),
        setId: selectedSet?.setId || null,
        isNewSearch,
      });

      if (
        (isLoadingRef.current &&
          lastRequestParamsRef.current === requestSignature) ||
        (!isNewSearch && page === currentPage)
      ) {
        console.log("Skipping duplicate request:", requestSignature);
        return;
      }

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
          const searchParam =
            searchQuery.trim() !== "" ? searchQuery : undefined;
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
    },
    [pageSize, searchQuery, selectedSet]
  );

  const handleSearch = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    setCurrentPage(1);

    setHasMoreCards(true);

    searchTimeoutRef.current = setTimeout(() => {
      loadPokemonCards(1, true);
      searchTimeoutRef.current = null;
    }, 800);
  }, [loadPokemonCards]);

  const handleSetSelect = useCallback(
    (set: PokemonSet) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }

      setCurrentPage(1);
      setIsLoading(true);
      setHasMoreCards(true);
      setSelectedSet(set);

      searchTimeoutRef.current = setTimeout(() => {
        loadPokemonCards(1, true);
        searchTimeoutRef.current = null;
      }, 100);
    },
    [loadPokemonCards]
  );

  const clearSetFilter = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    setCurrentPage(1);
    setIsLoading(true);
    setHasMoreCards(true);
    setSelectedSet(null);

    searchTimeoutRef.current = setTimeout(() => {
      loadPokemonCards(1, true);
      searchTimeoutRef.current = null;
    }, 100);
  }, [loadPokemonCards]);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMoreCards && !isLoadingRef.current) {
      loadPokemonCards(currentPage + 1);
    }
  }, [currentPage, hasMoreCards, isLoadingMore, loadPokemonCards]);

  const handleRefresh = useCallback(() => {
    if (!isLoadingRef.current) {
      loadPokemonCards(1, true);
    }
  }, [loadPokemonCards]);

  useEffect(() => {
    if (user) {
      if (!isInitialMount.current) {
        handleSearch();
      }
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    };
  }, [searchQuery, user, handleSearch]);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (user && !isLoadingRef.current) {
      if (isInitialMount.current) {
        console.log("Initial mount, loading cards...");
        isInitialMount.current = false;
        const timer = setTimeout(() => {
          loadPokemonCards(1, true);
        }, 100);

        return () => clearTimeout(timer);
      }
    }
  }, [user, loadPokemonCards]);

  useEffect(() => {
    console.log("Component mounted");
    return () => {
      console.log("Component unmounted");

      isInitialMount.current = true;
    };
  }, []);

  useEffect(() => {}, [selectedSet]);

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
