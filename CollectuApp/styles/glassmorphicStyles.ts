import { Platform, ViewStyle } from "react-native";

// Define a type for web-specific ViewStyle properties
interface WebSpecificViewStyle extends ViewStyle {
  backdropFilter?: string;
  WebkitBackdropFilter?: string;
  boxShadow?: string;
}

// Definizione del tipo per gli stili specifici della piattaforma
interface PlatformStyles {
  web: WebSpecificViewStyle; // Use the new type for web
  native: ViewStyle;
}

// Funzione helper per selezionare gli stili in base alla piattaforma corrente
export const getPlatformGlassmorphicStyle = (
  platformStyles: PlatformStyles,
): ViewStyle => {
  return Platform.select({
    ios: platformStyles.native,
    android: platformStyles.native,
    web: platformStyles.web,
    default: platformStyles.native, // Default a native se la piattaforma è sconosciuta
  });
};

// --- Stili Specifici dei Componenti ---

// Stili per una card glassmorphic generica (usati in CardList per stati di errore/vuoto/caricamento)
export const glassmorphicCardStyles: PlatformStyles = {
  web: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    backdropFilter: "blur(15px)",
    WebkitBackdropFilter: "blur(15px)",
    boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.25)",
  },
  native: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
};

// Stili per il contenitore dell'immagine all'interno di una CardItem (parte superiore della card)
export const glassmorphicImageContainerStyles: PlatformStyles = {
  web: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    borderTopLeftRadius: 12, // Raggio specifico per gli angoli superiori
    borderTopRightRadius: 12, // Raggio specifico per gli angoli superiori
    borderBottomWidth: 0, // Evita doppio bordo con la sezione info
    boxShadow: "0 2px 12px 0 rgba(0, 0, 0, 0.2)",
    // Manteniamo un colore di sfondo visibile mentre l'immagine carica (già definito sopra)
  },
  native: {
    // Rimuovi il backgroundColor duplicato qui
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: "#444",
  },
};

// Stili per il contenitore delle informazioni all'interno di una CardItem (parte inferiore della card)
export const glassmorphicInfoContainerStyles: PlatformStyles = {
  web: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    borderTopWidth: 1, // Bordo superiore per incontrare il contenitore immagine
    borderTopColor: "rgba(255, 255, 255, 0.05)",
    borderBottomLeftRadius: 12, // Raggio specifico per gli angoli inferiori
    borderBottomRightRadius: 12, // Raggio specifico per gli angoli inferiori
    borderLeftWidth: 1, // Bordi laterali per matchare la outer card
    borderRightWidth: 1, // Bordi laterali per matchare la outer card
    borderBottomWidth: 1, // Bordo inferiore per matchare la outer card
    borderColor: "rgba(255, 255, 255, 0.06)", // Colore bordo per matchare la outer card
    // Rimuovi il boxShadow duplicato qui
  },
  native: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
};

// Stili per le barre (es. SearchFilterBar, TabBar)
export const glassmorphicBarStyles: PlatformStyles = {
  web: {
    backgroundColor: "rgba(24, 24, 27, 0.6)",
    borderBottomWidth: 1, // Le barre spesso hanno un bordo specifico
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: "0 4px 24px 0 rgba(0, 0, 0, 0.3)",
  },
  native: {
    backgroundColor: "rgba(24, 24, 27, 0.6)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
  },
};

// Stili per input o elementi interattivi più piccoli all'interno di contenitori glassmorphic
export const glassmorphicInputStyles: PlatformStyles = {
  web: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  },
  native: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
  },
};

// Stili per bottoni all'interno di contenitori glassmorphic
export const glassmorphicButtonStyles: PlatformStyles = {
  web: {
    backgroundColor: "rgba(0, 122, 255, 0.8)", // Esempio colore primario
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 0.3)",
    backdropFilter: "blur(15px)",
    WebkitBackdropFilter: "blur(15px)",
    boxShadow: "0 4px 16px 0 rgba(0, 122, 255, 0.3)",
  },
  native: {
    backgroundColor: "rgba(0, 122, 255, 0.8)", // Esempio colore primario
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 0.3)",
    elevation: 4,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
};

// Stili per elementi selezionati (es. set selezionato nella SearchFilterBar)
export const glassmorphicSelectedItemStyles: PlatformStyles = {
  web: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    backdropFilter: "blur(15px)",
    WebkitBackdropFilter: "blur(15px)",
    boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.25)",
  },
  native: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
};

// Stili per il bottone di clear (es. in SearchFilterBar)
export const glassmorphicClearButtonStyles: PlatformStyles = {
  web: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 6,
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  },
  native: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 6,
  },
};

// Stili per gli stati di errore/lista vuota
export const glassmorphicErrorCardStyles: PlatformStyles = {
  web: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.3)",
    borderRadius: 16,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: "0 8px 32px 0 rgba(255, 59, 48, 0.2)",
  },
  native: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.3)",
    borderRadius: 16,
    elevation: 8,
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
  },
};

export const glassmorphicEmptyCardStyles: PlatformStyles = {
  web: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
  },
  native: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
  },
};

// Stili per gli indicatori di caricamento
export const glassmorphicLoadingStyles: PlatformStyles = {
  web: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  },
  native: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
};

// Stili per l'overlay della modale
export const glassmorphicModalOverlayStyles: PlatformStyles = {
  web: {
    backgroundColor: "rgba(10, 10, 15, 0.95)",
    backdropFilter: "blur(30px)",
    WebkitBackdropFilter: "blur(30px)",
  },
  native: {
    backgroundColor: "rgba(10, 10, 15, 0.95)",
    // Il blur nativo sull'overlay di solito è gestito diversamente o non applicato
  },
};

// Stili per il contenuto della modale (la card all'interno della modale)
export const glassmorphicModalContentStyles: PlatformStyles = {
  web: {
    backgroundColor: "rgba(24, 24, 27, 0.8)",
    borderWidth: 1, // Aggiungi bordo per consistenza
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backdropFilter: "blur(25px)",
    WebkitBackdropFilter: "blur(25px)",
    boxShadow: "0 -8px 40px 0 rgba(0, 0, 0, 0.4)",
  },
  native: {
    backgroundColor: "rgba(24, 24, 27, 0.8)",
    borderWidth: 1, // Aggiungi bordo per consistenza
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
  },
};

// Stili per gli elementi dei set all'interno della modale
export const glassmorphicSetItemStyles: PlatformStyles = {
  web: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    backdropFilter: "blur(15px)",
    WebkitBackdropFilter: "blur(15px)",
    boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.2)",
  },
  native: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
};
