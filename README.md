# Collectu

![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/Ortu21/Collectu?utm_source=oss&utm_medium=github&utm_campaign=Ortu21%2FCollectu&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

## Descrizione
Collectu è un'applicazione per la gestione di collezioni di carte, con un backend .NET e un frontend React Native.

## Struttura del progetto
- **CardCollectionAPI**: Backend API in .NET 9
- **CollectuApp**: Frontend mobile in React Native

## Documentazione
La documentazione API è disponibile in due formati:
- **Swagger UI**: Disponibile in modalità sviluppo all'indirizzo `/swagger`
- **Documentazione generata**: [Disponibile qui](https://ortu21.github.io/Collectu/)

### Documentazione API
L'API è completamente documentata con commenti XML che vengono utilizzati per generare:
- Documentazione Swagger interattiva
- Documentazione statica tramite DocFX
- Suggerimenti IntelliSense per i consumatori dell'API

## Sviluppo
### Prerequisiti
- .NET 9.0 SDK
- Node.js e npm
- Expo CLI

### Setup del progetto
```bash
# Backend
cd CardCollectionAPI
dotnet restore
dotnet build

# Frontend
cd CollectuApp
npm install
```
