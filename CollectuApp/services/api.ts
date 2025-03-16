import { PokemonCard, PokemonCardResponse , PokemonSet} from '../types/pokemon';

export const API_BASE_URL = 'http://192.168.1.10:5193/api/public';

export const fetchPokemonCards = async (
  pageSize: number = 20,
  page: number = 1,
  search?: string
): Promise<PokemonCardResponse> => {
  try {
    let url = `${API_BASE_URL}/cards?pageSize=${pageSize}&page=${page}`;
    
    if (search && search.trim() !== '') {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    
    // Trasforma i dati per adattarli al tipo PokemonCard
    const transformedCards: PokemonCard[] = result.data.map((card: any) => ({
      id: card.id,
      name: card.name,
      supertype: card.supertype || "",
      hp: card.hp || "",
      evolvesFrom: card.evolvesFrom || "",
      rarity: card.rarity || "",
      imageUrl: card.imageUrl,
      setName: card.setName || "",
      number : card.number || ""
    }));

    return {
      data: transformedCards,
      totalCount: result.totalCount,
      page: result.page,
      pageSize: result.pageSize
    };
  } catch (error) {
    console.error("Error fetching Pokemon cards:", error);
    throw error;
  }
};

export const searchPokemonCards = async (
  query: string,
  pageSize: number = 20,
  page: number = 1
): Promise<PokemonCardResponse> => {
  try {
    if (!query || query.trim() === '') {
      return await fetchPokemonCards(pageSize, page);
    }
    
    // Assicuriamoci che la query sia normalizzata prima di inviarla
    const normalizedQuery = query.trim().toLowerCase();
    const url = `${API_BASE_URL}/cards?search=${encodeURIComponent(normalizedQuery)}&pageSize=${pageSize}&page=${page}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    
    // Trasforma i dati per adattarli al tipo PokemonCard
    const transformedCards: PokemonCard[] = result.data.map((card: any) => ({
      id: card.id,
      name: card.name,
      supertype: card.supertype || "",
      hp: card.hp || "",
      evolvesFrom: card.evolvesFrom || "",
      rarity: card.rarity || "",
      imageUrl: card.imageUrl,
      setName: card.setName || "",
      relevance: card.relevance ,
      number : card.number || ""
    }));

    return {
      data: transformedCards,
      totalCount: result.totalCount,
      page: result.page,
      pageSize: result.pageSize,
      query: result.query
    };
  } catch (error) {
    console.error("Error searching Pokemon cards:", error);
    throw error;
  }
};

export const fetchPokemonCardById = async (id: string): Promise<PokemonCard> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cards/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const card = await response.json();
    
    return {
      id: card.id,
      name: card.name,
      supertype: card.supertype || "",
      hp: card.hp || "",
      evolvesFrom: card.evolvesFrom || "",
      rarity: card.rarity || "",
      imageUrl: card.imageUrl,
      setName: card.set?.setName || "",
      number : card.number || ""
    };
  } catch (error) {
    console.error(`Error fetching Pokemon card with ID ${id}:`, error);
    throw error;
  }
};

export const fetchPokemonSets = async (): Promise<PokemonSet[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sets`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const sets = await response.json();
    return sets;
  } catch (error) {
    console.error("Error fetching Pokemon sets:", error);
    throw error;
  }
};

export const fetchPokemonCardsBySet = async (
  setId: string,
  pageSize: number = 20,
  page: number = 1
): Promise<PokemonCardResponse> => {
  try {
    const url = `${API_BASE_URL}/cards?setId=${encodeURIComponent(setId)}&pageSize=${pageSize}&page=${page}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    
    // Trasforma i dati per adattarli al tipo PokemonCard
    const transformedCards: PokemonCard[] = result.data.map((card: any) => ({
      id: card.id,
      name: card.name,
      supertype: card.supertype || "",
      hp: card.hp || "",
      evolvesFrom: card.evolvesFrom || "",
      rarity: card.rarity || "",
      imageUrl: card.imageUrl,
      setName: card.setName || "",
      number: card.number || ""
    }));

    return {
      data: transformedCards,
      totalCount: result.totalCount,
      page: result.page,
      pageSize: result.pageSize
    };
  } catch (error) {
    console.error("Error fetching Pokemon cards by set:", error);
    throw error;
  }
};