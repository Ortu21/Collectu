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
      largeImageUrl: card.largeImageUrl,
      smallImageUrl: card.smallImageUrl,
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
    
    // Transform the data to match the PokemonCard type
    const transformedCards: PokemonCard[] = result.data.map((card: any) => ({
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
    // Estrai la carta principale, ignorando i riferimenti circolari
    const card = rawData.$values ? rawData.$values[0] : rawData;
    
    // Map attacks if they exist, gestendo la struttura con $values per i riferimenti circolari
    const attacksArray = card.attacks?.$values || card.attacks || [];
    const attacks = attacksArray.map((attack: any) => ({
      name: attack.name,
      damage: attack.damage,
      text: attack.text,
      cost: attack.cost,
      convertedEnergyCost: attack.convertedEnergyCost
    }));

    // Map weaknesses if they exist, gestendo la struttura con $values
    const weaknessesArray = card.weaknesses?.$values || card.weaknesses || [];
    const weaknesses = weaknessesArray.map((weakness: any) => ({
      type: weakness.type,
      value: weakness.value
    }));

    // Map resistances if they exist, gestendo la struttura con $values
    const resistancesArray = card.resistances?.$values || card.resistances || [];
    const resistances = resistancesArray.map((resistance: any) => ({
      type: resistance.type,
      value: resistance.value
    }));

    // Map CardMarket prices if they exist, gestendo la struttura con $values
    const cardMarketPrices = card.cardMarketPrices ? {
      url: card.cardMarketPrices.url,
      updatedAt: card.cardMarketPrices.updatedAt,
      priceDetails: (card.cardMarketPrices.priceDetails?.$values || card.cardMarketPrices.priceDetails || []).map((detail: any) => ({
        averageSellPrice: detail.averageSellPrice,
        trendPrice: detail.trendPrice,
        suggestedPrice: detail.suggestedPrice,
        low: detail.lowPrice,
        mid: null,
        high: null
      }))
    } : undefined;

    // Map TCGPlayer prices if they exist, gestendo la struttura con $values
    const tcgPlayerPrices = card.tcgPlayerPrices ? {
      url: card.tcgPlayerPrices.url,
      updatedAt: card.tcgPlayerPrices.updatedAt,
      priceDetails: (card.tcgPlayerPrices.priceDetails?.$values || card.tcgPlayerPrices.priceDetails || []).map((detail: any) => ({
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
    const response = await fetch(`${API_BASE_URL}/sets`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    // Ensure we're returning an array of PokemonSet objects
    // Handle different possible response structures
    let sets: PokemonSet[] = [];
    
    if (Array.isArray(data)) {
      // If the response is already an array
      sets = data;
    } else if (data && typeof data === 'object') {
      // If the response is an object with a data property that's an array
      if (Array.isArray(data.data)) {
        sets = data.data;
      } else if (data.$values && Array.isArray(data.$values)) {
        // Handle potential circular reference format
        sets = data.$values;
      }
    }
    
    // Map the data to ensure it matches the PokemonSet type
    return sets.map((set: any) => ({
      setId: set.setId || set.id || '',
      setName: set.setName || set.name || '',
      series: set.series || '',
      releaseDate: set.releaseDate || '',
      logoUrl: set.logoUrl || set.images?.logo || ''
    }));
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
    
    // Transform the data to match the PokemonCard type
    const transformedCards: PokemonCard[] = result.data.map((card: any) => ({
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
      query: result.query
    };
  } catch (error) {
    console.error("Error fetching Pokemon cards by set:", error);
    throw error;
  }
};
