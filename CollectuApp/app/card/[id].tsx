import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { fetchPokemonCardById } from '../../services/api';
import { PokemonCard } from '../../types/pokemon';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [card, setCard] = useState<PokemonCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCard = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const cardData = await fetchPokemonCardById(id);
        setCard(cardData);
        setError(null);
      } catch (err) {
        console.error('Error loading card:', err);
        setError('Failed to load card details');
      } finally {
        setIsLoading(false);
      }
    };

    loadCard();
  }, [id]);

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading card details...</Text>
      </View>
    );
  }

  if (error || !card) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Card not found'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Helper function to format price
  const formatPrice = (price: number | undefined | null) => {
    if (price === undefined || price === null) return 'N/A';
    return `$${price.toFixed(2)}`;
  };

  // Function to render energy cost icons
  const renderEnergyCost = (cost: string) => {
    const energyTypes = cost.split(',').map(type => type.trim());
    return (
      <View style={styles.energyContainer}>
        {energyTypes.map((type, index) => {
          let iconName = 'circle';
          let color = '#777';
          
          // Map energy types to colors
          switch(type.toLowerCase()) {
            case 'colorless': color = '#A8A8A8'; break;
            case 'darkness': color = '#735A4A'; break;
            case 'dragon': color = '#7038F8'; break;
            case 'fairy': color = '#EE99AC'; break;
            case 'fighting': color = '#C03028'; break;
            case 'fire': color = '#F08030'; break;
            case 'grass': color = '#78C850'; break;
            case 'lightning': color = '#F8D030'; break;
            case 'metal': color = '#B8B8D0'; break;
            case 'psychic': color = '#F85888'; break;
            case 'water': color = '#6890F0'; break;
          }
          
          return (
            <View key={`${type}-${index}`} style={[styles.energyIcon, {backgroundColor: color}]}>
              <Text style={styles.energyText}>{type.charAt(0)}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header with back button and card name */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{card.name}</Text>
        {card.hp && (
          <View style={styles.hpContainer}>
            <Text style={styles.hpText}>HP {card.hp}</Text>
          </View>
        )}
      </View>
      
      {/* Card image with shadow effect */}
      <View style={styles.cardImageContainer}>
        <View style={styles.cardImageWrapper}>
          <Image 
            source={{ uri: card.largeImageUrl }} 
            style={styles.cardImage}
            resizeMode="contain"
          />
        </View>
      </View>
      
      {/* Basic card information */}
      <View style={styles.cardInfoSection}>
        <Text style={styles.sectionTitle}>Card Information</Text>
        <View style={styles.cardInfo}>
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Ionicons name="albums-outline" size={18} color="#aaa" style={styles.infoIcon} />
              <Text style={styles.infoLabel}>Set:</Text>
            </View>
            <Text style={styles.infoValue}>{card.setName || 'Unknown'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Ionicons name="pricetag-outline" size={18} color="#aaa" style={styles.infoIcon} />
              <Text style={styles.infoLabel}>Number:</Text>
            </View>
            <Text style={styles.infoValue}>{card.number || 'Unknown'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Ionicons name="star-outline" size={18} color="#aaa" style={styles.infoIcon} />
              <Text style={styles.infoLabel}>Rarity:</Text>
            </View>
            <Text style={styles.infoValue}>{card.rarity || 'Unknown'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <MaterialCommunityIcons name="cards" size={18} color="#aaa" style={styles.infoIcon} />
              <Text style={styles.infoLabel}>Type:</Text>
            </View>
            <Text style={styles.infoValue}>{card.supertype || 'Unknown'}</Text>
          </View>
          
          {card.evolvesFrom && (
            <View style={styles.infoRow}>
              <View style={styles.infoLabelContainer}>
                <MaterialCommunityIcons name="arrow-up-bold" size={18} color="#aaa" style={styles.infoIcon} />
                <Text style={styles.infoLabel}>Evolves From:</Text>
              </View>
              <Text style={styles.infoValue}>{card.evolvesFrom}</Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Attacks section */}
      {card.attacks && card.attacks.length > 0 && (
        <View style={styles.cardInfoSection}>
          <Text style={styles.sectionTitle}>Attacks</Text>
          {card.attacks.map((attack, index) => (
            <View key={`attack-${index}`} style={styles.attackContainer}>
              <View style={styles.attackHeader}>
                <View style={styles.attackNameContainer}>
                  {renderEnergyCost(attack.cost)}
                  <Text style={styles.attackName}>{attack.name}</Text>
                </View>
                {attack.damage && (
                  <Text style={styles.attackDamage}>{attack.damage}</Text>
                )}
              </View>
              <Text style={styles.attackText}>{attack.text}</Text>
            </View>
          ))}
        </View>
      )}
      
      {/* Weaknesses and Resistances */}
      <View style={styles.cardInfoSection}>
        <Text style={styles.sectionTitle}>Battle Attributes</Text>
        <View style={styles.battleAttributesContainer}>
          {/* Weaknesses */}
          <View style={styles.attributeSection}>
            <Text style={styles.attributeTitle}>Weaknesses</Text>
            {card.weaknesses && card.weaknesses.length > 0 ? (
              <View style={styles.attributeList}>
                {card.weaknesses.map((weakness, index) => (
                  <View key={`weakness-${index}`} style={styles.attributeItem}>
                    <Text style={[styles.attributeType, {color: getTypeColor(weakness.type)}]}>
                      {weakness.type}
                    </Text>
                    <Text style={styles.attributeValue}>{weakness.value}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>None</Text>
            )}
          </View>
          
          {/* Resistances */}
          <View style={styles.attributeSection}>
            <Text style={styles.attributeTitle}>Resistances</Text>
            {card.resistances && card.resistances.length > 0 ? (
              <View style={styles.attributeList}>
                {card.resistances.map((resistance, index) => (
                  <View key={`resistance-${index}`} style={styles.attributeItem}>
                    <Text style={[styles.attributeType, {color: getTypeColor(resistance.type)}]}>
                      {resistance.type}
                    </Text>
                    <Text style={styles.attributeValue}>{resistance.value}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>None</Text>
            )}
          </View>
        </View>
      </View>
      
      {/* Market Prices Section */}
      {(card.cardMarketPrices || card.tcgPlayerPrices) && (
        <View style={styles.cardInfoSection}>
          <Text style={styles.sectionTitle}>Market Prices</Text>
          
          {/* CardMarket Prices */}
          {card.cardMarketPrices && card.cardMarketPrices.priceDetails.length > 0 && (
            <View style={styles.priceSection}>
              <Text style={styles.priceSourceTitle}>CardMarket</Text>
              <Text style={styles.priceUpdated}>
                Updated: {card.cardMarketPrices.updatedAt}
              </Text>
              
              <View style={styles.priceTable}>
                {card.cardMarketPrices.priceDetails.map((detail, index) => (
                  <View key={`cm-price-${index}`} style={styles.priceRow}>
                    {detail.averageSellPrice && (
                      <View style={styles.priceItem}>
                        <Text style={styles.priceLabel}>Avg Sell</Text>
                        <Text style={styles.priceValue}>
                          {formatPrice(detail.averageSellPrice)}
                        </Text>
                      </View>
                    )}
                    
                    {detail.trendPrice && (
                      <View style={styles.priceItem}>
                        <Text style={styles.priceLabel}>Trend</Text>
                        <Text style={styles.priceValue}>
                          {formatPrice(detail.trendPrice)}
                        </Text>
                      </View>
                    )}
                    
                    {detail.low && (
                      <View style={styles.priceItem}>
                        <Text style={styles.priceLabel}>Low</Text>
                        <Text style={styles.priceValue}>
                          {formatPrice(detail.low)}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {/* TCGPlayer Prices */}
          {card.tcgPlayerPrices && card.tcgPlayerPrices.priceDetails.length > 0 && (
            <View style={styles.priceSection}>
              <Text style={styles.priceSourceTitle}>TCGPlayer</Text>
              <Text style={styles.priceUpdated}>
                Updated: {card.tcgPlayerPrices.updatedAt}
              </Text>
              
              {card.tcgPlayerPrices.priceDetails.map((detail, index) => (
                <View key={`tcg-price-${index}`} style={styles.priceDetailContainer}>
                  {detail.foilType && (
                    <Text style={styles.foilTypeText}>{detail.foilType}</Text>
                  )}
                  
                  <View style={styles.priceTable}>
                    <View style={styles.priceRow}>
                      {detail.low && (
                        <View style={styles.priceItem}>
                          <Text style={styles.priceLabel}>Low</Text>
                          <Text style={styles.priceValue}>{formatPrice(detail.low)}</Text>
                        </View>
                      )}
                      
                      {detail.mid && (
                        <View style={styles.priceItem}>
                          <Text style={styles.priceLabel}>Mid</Text>
                          <Text style={styles.priceValue}>{formatPrice(detail.mid)}</Text>
                        </View>
                      )}
                      
                      {detail.high && (
                        <View style={styles.priceItem}>
                          <Text style={styles.priceLabel}>High</Text>
                          <Text style={styles.priceValue}>{formatPrice(detail.high)}</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.priceRow}>
                      {detail.market && (
                        <View style={styles.priceItem}>
                          <Text style={styles.priceLabel}>Market</Text>
                          <Text style={styles.priceValue}>{formatPrice(detail.market)}</Text>
                        </View>
                      )}
                      
                      {detail.directLow && (
                        <View style={styles.priceItem}>
                          <Text style={styles.priceLabel}>Direct Low</Text>
                          <Text style={styles.priceValue}>{formatPrice(detail.directLow)}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
          
          {!card.cardMarketPrices && !card.tcgPlayerPrices && (
            <Text style={styles.noDataText}>No price data available</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}


// Helper function to get color based on Pokemon type
const getTypeColor = (type: string): string => {
  switch(type.toLowerCase()) {
    case 'colorless': return '#A8A8A8';
    case 'darkness': return '#735A4A';
    case 'dragon': return '#7038F8';
    case 'fairy': return '#EE99AC';
    case 'fighting': return '#C03028';
    case 'fire': return '#F08030';
    case 'grass': return '#78C850';
    case 'lightning': return '#F8D030';
    case 'metal': return '#B8B8D0';
    case 'psychic': return '#F85888';
    case 'water': return '#6890F0';
    default: return '#777';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25292e',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25292e',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ff6b6b',
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1a1d21',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16,
    flex: 1,
  },
  hpContainer: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hpText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardImageContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#333',
  },
  cardImageWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
    backgroundColor: '#444',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardImage: {
    width: 300,
    height: 420,
    backgroundColor: '#444',
  },
  cardInfoSection: {
    marginVertical: 16,
    backgroundColor: '#1a1d21',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#2c3e50',
    padding: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardInfo: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#aaa',
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
  },
  energyContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  energyIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  energyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  attackContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  attackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  attackNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attackName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  attackDamage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  attackText: {
    fontSize: 14,
    color: '#ddd',
    marginTop: 4,
  },
  battleAttributesContainer: {
    padding: 16,
    flexDirection: 'row',
  },
  attributeSection: {
    flex: 1,
  },
  attributeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  attributeList: {
    marginTop: 8,
  },
  attributeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  attributeType: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  attributeValue: {
    fontSize: 14,
    color: '#fff',
  },
  noDataText: {
    fontSize: 14,
    color: '#aaa',
    fontStyle: 'italic',
  },
  priceSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  priceSourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  priceUpdated: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 12,
  },
  priceTable: {
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceDetailContainer: {
    marginBottom: 16,
  },
  foilTypeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 8,
  },
  priceItem: {
    flex: 1,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2ecc71',
  }
});