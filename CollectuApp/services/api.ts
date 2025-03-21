import { PokemonCard, PokemonCardResponse, PokemonSet } from '../types/pokemon';
import { extractArray, extractObject, mapArray } from '../utils/circularReferenceHandler';

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
    
    // Log the structure of the result to debug
    console.log("API Response structure:", JSON.stringify(result).substring(0, 200));
    
    // Check if result.data exists and handle different response structures
    if (!result.data) {
      console.error("Missing data in API response:", result);
      return {
        data: [],
        totalCount: result.totalCount || 0,
        page: result.page || 1,
        pageSize: result.pageSize || 20
      };
    }
    
    // Use the utility function to safely extract the array from potentially circular references
    const cardData = extractArray(result.data, []);
    
    if (cardData.length === 0) {
      console.warn("No card data found in response");
      return {
        data: [],
        totalCount: result.totalCount || 0,
        page: result.page || 1,
        pageSize: result.pageSize || 20
      };
    }
    
    // Transform the data to match the PokemonCard type using safe access
    const transformedCards: PokemonCard[] = cardData.map((card: any) => ({
      id: card.id || '',
      name: card.name || '',
      supertype: card.supertype || "",
      hp: card.hp || "",
      evolvesFrom: card.evolvesFrom || "",
      rarity: card.rarity || "",
      largeImageUrl: card.largeImageUrl || '',
      smallImageUrl: card.smallImageUrl || '',
      setName: card.setName || "",
      number: card.number || ""
    }));

    return {
      data: transformedCards,
      totalCount: result.totalCount || 0,
      page: result.page || 1,
      pageSize: result.pageSize || 20
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
    
    // Normalize the query and prepare for elastic search
    const normalizedQuery = query.trim().toLowerCase();
    
    // Enhanced URL with elastic search capabilities
    // The backend will handle searching across name, set, and card number
    const url = `${API_BASE_URL}/cards?search=${encodeURIComponent(normalizedQuery)}&pageSize=${pageSize}&page=${page}&elasticSearch=true`;
    
    console.log("Elastic search query:", normalizedQuery);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    
    // Handle the case where data is an object with $values property (from .NET serialization)
    let cardData = result.data;
    if (!Array.isArray(result.data) && result.data.$values && Array.isArray(result.data.$values)) {
      console.log("Detected $values array structure in search results, extracting data");
      cardData = result.data.$values;
    } else if (!Array.isArray(result.data)) {
      console.error("Invalid API response structure in search results:", result);
      return {
        data: [],
        totalCount: result.totalCount || 0,
        page: result.page || 1,
        pageSize: result.pageSize || 20,
        query: normalizedQuery
      };
    }
    
    // Transform the data to match the PokemonCard type
    const transformedCards: PokemonCard[] = cardData.map((card: any) => ({
      id: card.id,
      name: card.name,
      supertype: card.supertype || "",
      hp: card.hp || "",
      evolvesFrom: card.evolvesFrom || "",
      rarity: card.rarity || "",
      largeImageUrl: card.largeImageUrl,
      smallImageUrl: card.smallImageUrl,
      setName: card.setName || "",
      number: card.number || "",
      relevance: card.relevance
    }));

    return {
      data: transformedCards,
      totalCount: result.totalCount,
      page: result.page,
      pageSize: result.pageSize,
      query: normalizedQuery
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

    // Gestione della risposta con ReferenceHandler.Preserve
    const rawData = await response.json();
    // Estrai la carta principale, ignorando i riferimenti circolari usando la utility
    // Aggiungiamo un'asserzione di tipo per far sapere a TypeScript che card è un oggetto con le proprietà che ci aspettiamo
    const card = extractObject(rawData) as {
      id: string;
      name: string;
      supertype?: string;
      hp?: string;
      evolvesFrom?: string;
      rarity?: string;
      largeImageUrl: string;
      smallImageUrl: string;
      number?: string;
      attacks?: any;
      weaknesses?: any;
      resistances?: any;
      cardMarketPrices?: any;
      tcgPlayerPrices?: any;
      set?: any;
    };
    
    if (!card) {
      throw new Error('Failed to extract card data from response');
    }
    
    // Map attacks if they exist, usando la utility per gestire i riferimenti circolari
    const attacks = mapArray(card.attacks, (attack: any) => ({
      name: attack.name || '',
      damage: attack.damage || '',
      text: attack.text || '',
      cost: attack.cost || '',
      convertedEnergyCost: attack.convertedEnergyCost || ''
    }));

    // Map weaknesses if they exist, usando la utility per gestire i riferimenti circolari
    const weaknesses = mapArray(card.weaknesses, (weakness: any) => ({
      type: weakness.type || '',
      value: weakness.value || ''
    }));

    // Map resistances if they exist, usando la utility per gestire i riferimenti circolari
    const resistances = mapArray(card.resistances, (resistance: any) => ({
      type: resistance.type || '',
      value: resistance.value || ''
    }));

    // Map CardMarket prices if they exist, usando la utility per gestire i riferimenti circolari
    const cardMarketPrices = card.cardMarketPrices ? {
      url: card.cardMarketPrices.url || '',
      updatedAt: card.cardMarketPrices.updatedAt || '',
      priceDetails: mapArray(card.cardMarketPrices.priceDetails, (detail: any) => ({
        averageSellPrice: detail.averageSellPrice,
        trendPrice: detail.trendPrice,
        suggestedPrice: detail.suggestedPrice,
        low: detail.lowPrice
        // Don't set mid and high as they're not in the CardMarket model
      }))
    } : undefined;

    // Map TCGPlayer prices if they exist, usando la utility per gestire i riferimenti circolari
    const tcgPlayerPrices = card.tcgPlayerPrices ? {
      url: card.tcgPlayerPrices.url || '',
      updatedAt: card.tcgPlayerPrices.updatedAt || '',
      priceDetails: mapArray(card.tcgPlayerPrices.priceDetails, (detail: any) => ({
        foilType: detail.foilType,
        low: detail.low,
        mid: detail.mid,
        high: detail.high,
        market: detail.market,
        directLow: detail.directLow
      }))
    } : undefined;
    
    // Gestisci il set che potrebbe avere riferimenti circolari
    const setData = card.set?.$ref ? null : card.set;
    
    return {
      id: card.id,
      name: card.name,
      supertype: card.supertype || "",
      hp: card.hp || "",
      evolvesFrom: card.evolvesFrom || "",
      rarity: card.rarity || "",
      largeImageUrl: card.largeImageUrl,
      smallImageUrl: card.smallImageUrl,
      setName: setData?.setName || "",
      number: card.number || "",
      attacks: attacks.length > 0 ? attacks : undefined,
      weaknesses: weaknesses.length > 0 ? weaknesses : undefined,
      resistances: resistances.length > 0 ? resistances : undefined,
      cardMarketPrices,
      tcgPlayerPrices
    };
  } catch (error) {
    console.error(`Error fetching Pokemon card with ID ${id}:`, error);
    throw error;
  }
};

export const fetchPokemonSets = async (): Promise<PokemonSet[]> => {
  try {
    console.log('Fetching Pokemon sets from:', `${API_BASE_URL}/sets`);
    const response = await fetch(`${API_BASE_URL}/sets`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      console.error(`HTTP error fetching sets! Status: ${response.status}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Log response headers for debugging
    const headers: Record<string, string> = {};
    response.headers.forEach((value: string, key: string) => {
      headers[key] = value;
    });
    console.log('Response headers:', headers);

    const responseText = await response.text();
    console.log('Raw response text:', responseText.substring(0, 200) + '...');
    
    // Parse the response text manually to handle potential JSON issues
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Pokemon sets response type:', typeof data);
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      return [];
    }
    
    // Ensure we're returning an array of PokemonSet objects
    // Handle different possible response structures
    let sets: PokemonSet[] = [];
    
    if (Array.isArray(data)) {
      // If the response is already an array
      console.log('Response is an array with length:', data.length);
      sets = data;
    } else if (data && typeof data === 'object') {
      // If the response is an object with a data property that's an array
      if (Array.isArray(data.data)) {
        console.log('Response has data array with length:', data.data.length);
        sets = data.data;
      } else if (data.$values && Array.isArray(data.$values)) {
        // Handle potential circular reference format
        console.log('Response has $values array with length:', data.$values.length);
        sets = data.$values;
      } else {
        // If we can't find an array, log the structure and return an empty array
        console.error('Unexpected data structure for sets:', JSON.stringify(data).substring(0, 500));
        return [];
      }
    } else {
      console.error('Unexpected data type for sets:', typeof data);
      return [];
    }
    
    // Map the data to ensure it matches the PokemonSet type
    const mappedSets = sets.map((set: any) => {
      const mappedSet = {
        setId: set.setId || set.id || '',
        setName: set.setName || set.name || '',
        series: set.series || '',
        releaseDate: set.releaseDate || '',
        logoUrl: set.logoUrl || set.images?.logo || ''
      };
      console.log('Mapped set:', mappedSet.setId, mappedSet.setName);
      return mappedSet;
    });
    
    console.log('Mapped sets count:', mappedSets.length);
    return mappedSets;
  } catch (error) {
    console.error("Error fetching Pokemon sets:", error);
    throw error;
  }
};

export const fetchPokemonCardsBySet = async (
  setId: string,
  pageSize: number = 20,
  page: number = 1,
  search?: string
): Promise<PokemonCardResponse> => {
  try {
    // Base URL with set ID filter
    let url = `${API_BASE_URL}/cards?setId=${encodeURIComponent(setId)}&pageSize=${pageSize}&page=${page}`;
    
    // Add search parameter if present and enable elastic search
    if (search && search.trim() !== '') {
      url += `&search=${encodeURIComponent(search.trim())}&elasticSearch=true`;
    }
    
    console.log("Fetching cards with URL:", url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    
    // Use the utility function to safely extract the array from potentially circular references
    const cardData = extractArray(result.data, []);
    
    if (cardData.length === 0) {
      console.warn("No card data found in response");
      return {
        data: [],
        totalCount: result.totalCount || 0,
        page: result.page || 1,
        pageSize: result.pageSize || 20,
        query: search ? search.trim() : undefined
      };
    }
    
    // Transform the data to match the PokemonCard type using safe access
    const transformedCards: PokemonCard[] = cardData.map((card: any) => ({
      id: card.id || '',
      name: card.name || '',
      supertype: card.supertype || "",
      hp: card.hp || "",
      evolvesFrom: card.evolvesFrom || "",
      rarity: card.rarity || "",
      largeImageUrl: card.largeImageUrl || '',
      smallImageUrl: card.smallImageUrl || '',
      setName: card.setName || "",
      number: card.number || "",
      relevance: card.relevance
    }));

    return {
      data: transformedCards,
      totalCount: result.totalCount || 0,
      page: result.page || 1,
      pageSize: result.pageSize || 20,
      query: result.query
    };
  } catch (error) {
    console.error("Error fetching Pokemon cards by set:", error);
    throw error;
  }
};
