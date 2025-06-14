// Centralized error mapping for authentication
export const authErrorMessages: Record<string, string> = {
    'auth/invalid-email': "L'indirizzo email non è valido.",
    'auth/user-disabled': 'Questo account è stato disabilitato.',
    'auth/user-not-found': 'Nessun utente trovato con queste credenziali.',
    'auth/wrong-password': 'Password errata.',
    'auth/email-already-in-use': 'Questa email è già registrata.',
    'auth/weak-password': 'La password è troppo debole.',
    'auth/too-many-requests': 'Troppi tentativi. Riprova più tardi.',
    'auth/network-request-failed': 'Errore di rete. Controlla la connessione.',
    'auth/operation-not-allowed': 'Questa operazione non è permessa.',
    'auth/popup-closed-by-user': 'La finestra di autenticazione è stata chiusa.',
    'auth/internal-error': 'Errore interno di autenticazione.',
    'auth/invalid-credential': 'Le credenziali inserite non sono valide.',
    'INVALID_LOGIN_CREDENTIALS': 'Le credenziali inserite non sono valide.',
    'EMAIL_NOT_FOUND': 'Nessun utente trovato con questa email.',
    'INVALID_PASSWORD': 'Password errata.',
    'USER_DISABLED': 'Questo account è stato disabilitato.',
    'default': 'Si è verificato un errore. Riprova.'
};

// Funzione di logging per gli errori di autenticazione
function logAuthError(error: any, userMessage: string) {
    console.error('Auth Error:', {
        timestamp: new Date().toISOString(),
        originalError: error,
        userMessage,
        errorCode: typeof error === 'object' ? error.code : typeof error === 'string' ? error : 'unknown',
    });
}

export function getAuthErrorMessage(error: { code?: string; message?: string } | string | null | undefined): string {
    if (!error) return '';
    
    let userMessage = '';
    
    if (typeof error === 'object' && error.code && authErrorMessages[error.code]) {
        userMessage = authErrorMessages[error.code];
    } else if (typeof error === 'object' && error.message && authErrorMessages[error.message]) {
        userMessage = authErrorMessages[error.message];
    } else if (typeof error === 'string' && authErrorMessages[error]) {
        userMessage = authErrorMessages[error];
    } else {
        userMessage = typeof error === 'string' ? error : authErrorMessages['default'];
    }

    // Log dell'errore
    logAuthError(error, userMessage);
    
    return userMessage;
}
