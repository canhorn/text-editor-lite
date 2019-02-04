# Stage 1 - Build C# Source
FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /source

# Install Node
ENV NODE_VERSION 11.9.0
ENV NODE_DOWNLOAD_SHA 0e872c288724e7de72eaa89d1fbc29979a60cdc8c4c0bc1ea65339328bbaaf4c
RUN curl -SL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz" --output nodejs.tar.gz \
    && echo "$NODE_DOWNLOAD_SHA nodejs.tar.gz" | sha256sum -c - \
    && tar -xzf "nodejs.tar.gz" -C /usr/local --strip-components=1 \
    && rm nodejs.tar.gz \
    && ln -s /usr/local/bin/node /usr/local/bin/nodejs

# Caches restore of package.json file
COPY client-app-ts/package*.json ./client-app-ts/
WORKDIR /source/client-app-ts
RUN npm install --only=production

# Caches restore result of csproj
WORKDIR /source
COPY *.csproj .
RUN dotnet restore

# Copies the rest of code to workspace
COPY . .

# Build source for Client Side JavaScript
WORKDIR /source/client-app-ts
RUN npm run build

# Build/Publish source for Server Side .NET Core
WORKDIR /source
RUN dotnet publish --output /app/ --configuration Release


# Stage 2 - Move all generated code into single Runtime image
FROM microsoft/dotnet:2.2-aspnetcore-runtime AS runtime
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["dotnet", "EventHorizon.CodeEditorLite.dll"]