import React from "react";
import {
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  Platform,
  ViewStyle,
} from "react-native";
import { YStack, XStack, Text, Card, Spinner } from "tamagui";
import { PokemonCard } from "../../types/pokemon";
import { CardItem } from "./CardItem";
import { Skeleton } from "./Skeleton";
// Importa gli stili glassmorphic centralizzati
import {
  getPlatformGlassmorphicStyle,
  glassmorphicCardStyles,
  glassmorphicErrorCardStyles,
  glassmorphicEmptyCardStyles,
  glassmorphicLoadingStyles,
} from "../../styles/glassmorphicStyles";

interface CardListProps {
  cards: PokemonCard[];
  isLoading: boolean; // Questo stato indica il caricamento iniziale o il refresh
  isLoadingMore: boolean;
  error: string | null;
  totalCount: number;
  onRefresh: () => void;
  onLoadMore: () => void;
  onCardPress: (card: PokemonCard) => void;
  numColumns?: number;
}

export const CardList = ({
  cards,
  isLoading,
  isLoadingMore,
  error,
  totalCount,
  onRefresh,
  onLoadMore,
  onCardPress,
  numColumns = 2,
}: CardListProps) => {
  const { width } = useWindowDimensions();

  // Definisci la dimensione desiderata per lo spazio (gap) tra le card
  const itemSpacing = 8;

  // Calcola le dimensioni ottimali per le carte in base alla larghezza dello schermo
  const getCardDimensions = () => {
    // La larghezza disponibile per le card è la larghezza totale meno il padding del container sui due lati
    const containerHorizontalPadding = 8; // Padding definito in contentContainerStyle
    const availableWidth = width - containerHorizontalPadding * 2;

    // La larghezza totale occupata dagli spazi tra le colonne è (numero di colonne - 1) * spazio tra item
    const totalSpaceBetweenColumns = itemSpacing * (numColumns - 1);

    // La larghezza disponibile per le card è la larghezza disponibile meno lo spazio totale tra le colonne, diviso per il numero di colonne
    const cardWidth = (availableWidth - totalSpaceBetweenColumns) / numColumns;

    // Altezza proporzionale per mantenere il rapporto della carta (es. 1:1.4)
    const cardHeight = cardWidth * 1.4;

    return {
      width: cardWidth,
      height: cardHeight,
    };
  };

  const cardDimensions = getCardDimensions();

  // Ottieni gli stili glassmorphic per la card item, stati di errore/vuoto/caricamento dalla centralizzazione
  const cardItemOuterGlassStyles = getPlatformGlassmorphicStyle(
    glassmorphicCardStyles,
  );
  const errorCardGlassStyles = getPlatformGlassmorphicStyle(
    glassmorphicErrorCardStyles,
  );
  const emptyCardGlassStyles = getPlatformGlassmorphicStyle(
    glassmorphicEmptyCardStyles,
  );
  const loadingGlassStyles = getPlatformGlassmorphicStyle(
    glassmorphicLoadingStyles,
  );

  // Funzione per renderizzare un singolo item, che sarà CardItem o Skeleton a seconda dello stato di caricamento della lista
  const renderItem = ({
    item,
    index,
  }: {
    item: PokemonCard | number;
    index: number;
  }) => {
    const itemDelay = index * 50;
    const isSkeletonItem = typeof item === "number";

    return (
      // Applica gli stili glassmorphic centralizzati al contenitore esterno della card item
      <TouchableOpacity
        key={isSkeletonItem ? `skeleton-${index}` : item.id} // Chiave univoca
        style={[
          {
            flex: 1,
            ...cardItemOuterGlassStyles, // Applica gli stili glassmorphic di base per la card item
            elevation: 3, // Mantieni elevazione specifica se diversa dalla base
            width: cardDimensions.width, // Imposta la larghezza calcolata
            // Applica marginBottom per lo spazio tra le righe (tranne l'ultima)
            marginBottom: itemSpacing,
            // borderRadius, borderWidth, borderColor, backdropFilter, boxShadow/elevation sono inclusi in cardItemOuterGlassStyles
          },
        ]}
        onPress={
          isSkeletonItem ? undefined : () => onCardPress(item as PokemonCard)
        }
        disabled={isSkeletonItem} // Disabilita il touch sugli skeleton
      >
        {isSkeletonItem ? (
          // Se è uno skeleton item (solo quando isLoading è true)
          <Animated.View style={{ opacity: 1 }}>
            {/* Skeleton gestisce i propri stili, ma può usare le dimensioni calcolate */}
            <Skeleton
              variant="card"
              cardDimensions={cardDimensions}
              animationDelay={itemDelay}
            />
          </Animated.View>
        ) : (
          // Se è un CardItem (solo quando isLoading è false)
          // CardItem gestirà i propri stili interni (immagine e info) separatamente
          <CardItem
            card={item as PokemonCard}
            onPress={onCardPress}
            cardDimensions={cardDimensions}
            animationDelay={itemDelay}
          />
        )}
      </TouchableOpacity>
    );
  };

  // Genera un array di numeri per gli skeleton
  const generateSkeletonData = () => {
    // Genera abbastanza skeleton per riempire un po' lo schermo iniziale
    const skeletonCount = numColumns * 5; // Mostra circa 5 righe di skeleton
    return Array.from({ length: skeletonCount }, (_, i) => i);
  };

  const skeletonData = generateSkeletonData();

  // Footer component per il loading più cards
  const ListFooterComponent = () => (
    <XStack
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      }}
    >
      {/* Mostra lo spinner per il caricamento di più carte solo quando la lista NON è nello stato di caricamento iniziale */}
      {!isLoading && isLoadingMore && (
        // Applica gli stili glassmorphic centralizzati all'indicatore di caricamento del footer
        <YStack
          style={{
            padding: 12, // Mantieni padding specifici
            flexDirection: "row" as const, // Mantieni direzione layout
            alignItems: "center" as const, // Mantieni allineamento
            gap: 8, // Mantieni gap specifico
            ...loadingGlassStyles, // Applica gli stili glassmorphic di base per il caricamento
            // backgroundColor, borderWidth, borderColor, borderRadius, backdropFilter, boxShadow/elevation sono inclusi
          }}
        >
          <Spinner size="small" color="rgba(255, 255, 255, 0.7)" />
          <Text
            color="rgba(255, 255, 255, 0.7)"
            fontSize={14}
            style={{
              textShadowColor: "rgba(255, 255, 255, 0.1)",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 8,
            }}
          >
            Loading more cards...
          </Text>
        </YStack>
      )}
    </XStack>
  );

  // Style per definire lo spazio orizzontale tra le colonne
  const columnWrapperStyle: ViewStyle = {
    justifyContent: "space-between",
    gap: itemSpacing, // Usa la prop gap per lo spazio tra le colonne (React Native 0.71+)
  };

  // Gestione degli stati di errore e lista vuota
  if (error) {
    return (
      <YStack
        flex={1}
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        {/* Applica gli stili glassmorphic centralizzati alla card di errore */}
        <Card
          style={{
            alignItems: "center",
            padding: 24, // Mantieni padding specifici
            maxWidth: 320, // Mantieni max width
            width: "100%", // Mantieni larghezza
            ...errorCardGlassStyles, // Applica gli stili glassmorphic di base per la card di errore
            // backgroundColor, borderWidth, borderColor, borderRadius, backdropFilter, boxShadow/elevation sono inclusi
          }}
        >
          <Text
            fontSize={18}
            color="rgba(255, 59, 48, 0.9)"
            fontWeight="bold"
            style={{
              textAlign: "center",
              marginBottom: 8,
              textShadowColor: "rgba(255, 59, 48, 0.3)",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 8,
            }}
          >
            ⚠️ Error
          </Text>
          <Text
            fontSize={14}
            color="rgba(255, 255, 255, 0.8)"
            style={{
              textAlign: "center",
              marginBottom: 16,
              lineHeight: 20,
            }}
          >
            {error}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "rgba(255, 59, 48, 0.8)",
              borderRadius: 8,
              padding: 12,
              alignItems: "center",
              width: 120,
              borderWidth: 1,
              borderColor: "rgba(255, 59, 48, 0.3)",
              ...(Platform.OS === "web" && {
                backdropFilter: "blur(15px)",
                WebkitBackdropFilter: "blur(15px)",
                boxShadow: "0 4px 16px 0 rgba(255, 59, 48, 0.3)",
              }),
              ...(Platform.OS !== "web" && {
                elevation: 4,
                shadowColor: "#FF3B30",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
              }),
            }}
            onPress={onRefresh}
          >
            <Text
              color="#fff"
              fontSize={16}
              fontWeight="bold"
              style={{
                textShadowColor: "rgba(255, 255, 255, 0.3)",
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 8,
              }}
            >
              Retry
            </Text>
          </TouchableOpacity>
        </Card>
      </YStack>
    );
  }

  if (!isLoading && cards.length === 0) {
    return (
      <YStack
        flex={1}
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        {/* Applica gli stili glassmorphic centralizzati alla card di stato vuoto */}
        <Card
          style={{
            alignItems: "center",
            padding: 32, // Mantieni padding specifici
            maxWidth: 320, // Mantieni max width
            width: "100%", // Mantieni larghezza
            ...emptyCardGlassStyles, // Applica gli stili glassmorphic di base per la card vuota
            // backgroundColor, borderWidth, borderColor, borderRadius, backdropFilter, boxShadow/elevation sono inclusi
          }}
        >
          <Text
            fontSize={48}
            style={{
              marginBottom: 16,
              opacity: 0.6,
            }}
          >
            📦
          </Text>
          <Text
            fontSize={18}
            color="rgba(255, 255, 255, 0.8)"
            fontWeight="bold"
            style={{
              textAlign: "center",
              marginBottom: 8,
              textShadowColor: "rgba(255, 255, 255, 0.1)",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 8,
            }}
          >
            No cards found
          </Text>
          <Text
            fontSize={14}
            color="rgba(255, 255, 255, 0.6)"
            style={{
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            Try adjusting your search or filters
          </Text>
        </Card>
      </YStack>
    );
  }

  // Usa una variabile per determinare i dati da passare alla FlatList:
  // se isLoading è true, usa i dati degli skeleton; altrimenti, usa i dati delle carte.
  const listData = isLoading ? skeletonData : cards;

  return (
    <YStack flex={1}>
      <FlatList
        data={listData} // Usa listData (skeleton o carte reali)
        numColumns={numColumns}
        key={`list-${numColumns}`} // Chiave per forzare il re-render quando cambiano le colonne
        renderItem={renderItem} // Usa la funzione renderItem unificata
        keyExtractor={(item, index) =>
          isLoading
            ? `skeleton-${index}`
            : `${(item as PokemonCard).id}-${index}`
        } // Chiave univoca basata sul tipo di item e stato di caricamento
        // contentContainerStyle con padding sui bordi
        contentContainerStyle={{ padding: itemSpacing }}
        columnWrapperStyle={columnWrapperStyle} // Applica lo stile per lo spazio tra le colonne
        onRefresh={onRefresh}
        refreshing={isLoading} // Usa isLoading per l'indicatore di refresh nativo
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5} // Carica quando mancano 50% della vista
        ListFooterComponent={ListFooterComponent}
        // Disabilita lo scrolling iniziale mentre carica gli skeleton per evitare interazioni premature
        scrollEnabled={!isLoading}
        removeClippedSubviews={true} // Ottimizzazione per liste lunghe
        maxToRenderPerBatch={10} // Ottimizzazione del rendering
        updateCellsBatchingPeriod={50} // Ottimizzazione del rendering
        initialNumToRender={numColumns * 3} // Renderizza un numero iniziale di item sufficiente a riempire lo schermo
        windowSize={numColumns * 5} // Dimensioni della finestra di rendering
      />
    </YStack>
  );
};
