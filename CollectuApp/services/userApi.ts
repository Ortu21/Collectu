import axios from "axios";

export const API_BASE_URL = "http://192.168.1.9:5193/api/public";

// Interfacce per la gestione degli utenti
export interface RegisterUserDto {
  firebaseUid: string;
  userName: string;
}

export interface UserResponseDto {
  id: number;
  userName: string;
  registrationDate: string;
}

// Funzioni per la gestione degli utenti
export const registerUser = async (data: RegisterUserDto): Promise<UserResponseDto> => {
  try {
    const response = await axios.post<UserResponseDto>(
      `${API_BASE_URL}/api/user/register`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Errore durante la registrazione');
  }
};

export const getUserById = async (id: number): Promise<UserResponseDto> => {
  try {
    const response = await axios.get<UserResponseDto>(
      `${API_BASE_URL}/api/user/${id}`
    );
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Errore nel recupero dei dati utente');
  }
}; 