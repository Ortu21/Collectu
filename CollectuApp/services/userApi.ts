import axios from "axios";

export const API_BASE_URL = "http://192.168.1.10:5193/api";

// Interfacce per la gestione degli utenti
export interface RegisterUserDto {
  firebaseUid: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  emailVerified: boolean;
  phoneNumber?: string;
  providerId?: string;
  creationTime: Date;
  lastSignInTime: Date;
}

export interface UserResponseDto {
  id: number;
  userName: string;
  registrationDate: string;
}

// Funzioni per la gestione degli utenti
export const registerUser = async (
  data: RegisterUserDto,
): Promise<UserResponseDto> => {
  try {
    console.log("Tentativo di registrazione utente:", {
      ...data,
      firebaseUid: "***",
    });
    const response = await axios.post<UserResponseDto>(
      `${API_BASE_URL}/user/register`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log("Risposta registrazione:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Errore durante la registrazione:", error.response || error);
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Errore durante la registrazione");
  }
};

export const getUserById = async (id: number): Promise<UserResponseDto> => {
  try {
    const response = await axios.get<UserResponseDto>(
      `${API_BASE_URL}/api/user/${id}`,
    );
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Errore nel recupero dei dati utente");
  }
};
