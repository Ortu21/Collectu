export type PokemonCard = {
  id: string;
  name: string;
  supertype: string;
  hp?: string;
  evolvesFrom: string;
  rarity: string;
  imageUrl: string;
  setName?: string;
  relevance?: number;
};

export type PokemonCardResponse = {
  data: PokemonCard[];
  totalCount: number;
  page: number;
  pageSize: number;
  query?: string;
};