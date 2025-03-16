import { PokemonCard, PokemonCardResponse } from '../types/pokemon';

// Modifica qui: sostituisci localhost con l'indirizzo IP del tuo computer
// Puoi trovare il tuo indirizzo IP eseguendo 'ipconfig' nel prompt dei comandi di Windows
const API_BASE_URL = 'http://192.168.1.10:5193/api/public';
// Nota: sostituisci 192.168.1.100 con il tuo indirizzo IP effettivo

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
      relevance: card.relevance
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
    };
  } catch (error) {
    console.error(`Error fetching Pokemon card with ID ${id}:`, error);
    throw error;
  }
};