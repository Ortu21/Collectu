export type PokemonAttack = {
  name: string;
  damage?: string;
  text: string;
  cost: string;
  convertedEnergyCost: string;
};

export type PokemonWeakness = {
  type: string;
  value: string;
};

export type PokemonResistance = {
  type: string;
  value: string;
};

export type PokemonPriceDetail = {
  foilType?: string;
  low?: number;
  mid?: number;
  high?: number;
  market?: number;
  directLow?: number;
  // CardMarket specific fields
  averageSellPrice?: number;
  trendPrice?: number;
  suggestedPrice?: number;
};

export type PokemonPrice = {
  url: string;
  updatedAt: string;
  priceDetails: PokemonPriceDetail[];
};

export type PokemonCard = {
  id: string;
  name: string;
  supertype: string;
  hp?: string;
  evolvesFrom: string;
  rarity: string;
  largeImageUrl: string;
  smallImageUrl: string;
  setName?: string;
  relevance?: number;
  number?: string;
  // Additional fields for detailed view
  attacks?: PokemonAttack[];
  weaknesses?: PokemonWeakness[];
  resistances?: PokemonResistance[];
  cardMarketPrices?: PokemonPrice;
  tcgPlayerPrices?: PokemonPrice;
};

export type PokemonCardResponse = {
  data: PokemonCard[];
  totalCount: number;
  page: number;
  pageSize: number;
  query?: string;
};

export type PokemonSet = {
  setId: string;
  setName: string;
  series: string;
  releaseDate: string;
  logoUrl: string;
};