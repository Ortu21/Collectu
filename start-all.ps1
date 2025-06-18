# Avvia il backend .NET
Start-Process powershell -ArgumentList "cd '$(Join-Path $PSScriptRoot 'CardCollectionAPI')'; dotnet run"

# Avvia il frontend Expo
Start-Process powershell -ArgumentList "cd '$(Join-Path $PSScriptRoot 'CollectuAppV2')'; npx expo start"
