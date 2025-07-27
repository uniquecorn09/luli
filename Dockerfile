# --- Build Frontend ---
FROM node:20 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build -- --configuration production

# --- Build Backend ---
FROM node:20 AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install         # <--- ALLE Dependencies, inkl. devDependencies!
COPY backend/ ./
RUN npm run build
# Kopiere das gebaute Frontend in den Backend-Ordner (z.B. public/)
COPY --from=frontend-build /app/frontend/dist/frontend/ /app/backend/public/

# --- Production Image ---
FROM node:20-slim
WORKDIR /app/backend
COPY --from=backend-build /app/backend /app/backend
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/src/server.js"]