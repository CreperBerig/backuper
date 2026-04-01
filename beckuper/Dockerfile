# Web interface
FROM node:20-alpine AS frontend
WORKDIR /app/client
COPY ["beckuper/ClientApp/package*.json", "./"]
RUN npm install
COPY ["beckuper/ClientApp/", "./"]
RUN npm run build

# Base
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 9090

# Backend
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["beckuper/beckuper.csproj", "beckuper/"]
RUN dotnet restore "./beckuper/beckuper.csproj"
COPY . .
WORKDIR "/src/beckuper"
RUN dotnet build "./beckuper.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./beckuper.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=frontend /app/client/dist ./wwwroot
ENTRYPOINT ["dotnet", "beckuper.dll"]