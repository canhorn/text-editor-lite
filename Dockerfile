# Stage 1 - Build C# Source
FROM microsoft/dotnet:2.2-sdk AS csharp-build
WORKDIR /source

# Install Node
ENV NODE_VERSION 11.9.0
ENV NODE_DOWNLOAD_SHA 0e872c288724e7de72eaa89d1fbc29979a60cdc8c4c0bc1ea65339328bbaaf4c
RUN curl -SL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz" --output nodejs.tar.gz \
    && echo "$NODE_DOWNLOAD_SHA nodejs.tar.gz" | sha256sum -c - \
    && tar -xzf "nodejs.tar.gz" -C /usr/local --strip-components=1 \
    && rm nodejs.tar.gz \
    && ln -s /usr/local/bin/node /usr/local/bin/nodejs

# caches restore result by copying package.json file separately
COPY client-app-ts/package*.json ./client-app-ts/
WORKDIR /source/client-app-ts
RUN npm install --only=production

# caches restore result by copying csproj file separately
WORKDIR /source
COPY *.csproj .
RUN dotnet restore

# copies the rest of your code
COPY . .

WORKDIR /source/client-app-ts
RUN npm run build

WORKDIR /source
RUN dotnet publish --output /app/ --configuration Release


# Stage 3 - Move all generated code into single Runtime image
FROM microsoft/dotnet:2.2-aspnetcore-runtime AS runtime
WORKDIR /app
COPY --from=csharp-build /app .
ENTRYPOINT ["dotnet", "EventHorizon.CodeEditorLite.dll"]