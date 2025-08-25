#!/bin/bash

set -e  # Stoppe bei Fehlern

# ------------------------------
# 1. Pfade definieren
# ------------------------------
FRONTEND_DIR=~/luli/frontend
BACKEND_DIR=~/luli/backend
DEPLOY_DIR=/var/www/meine-tonies
PM2_NAME=server

echo "🚀 LuLi Deployment gestartet..."

# ------------------------------
# 2. Frontend Build
# ------------------------------
echo "📦 Baue Angular-Frontend..."
cd $FRONTEND_DIR
npm install
npm run build:prod

echo "🧹 Lösche altes Frontend im nginx-Verzeichnis..."
sudo rm -rf $DEPLOY_DIR
sudo mkdir -p $DEPLOY_DIR

echo "📁 Kopiere neues Frontend nach nginx..."
sudo cp -r dist/*/browser/* $DEPLOY_DIR

# ------------------------------
# 3. Backend Build & Deploy
# ------------------------------
echo "🔧 Baue Backend..."
cd $BACKEND_DIR
npm install
npm run build:prod

# ------------------------------
# 4. nginx neu laden
# ------------------------------
echo "🔁 Starte nginx neu..."
sudo nginx -t && sudo systemctl reload nginx

# ------------------------------
# 5. Backend starten via PM2
# ------------------------------
echo "🚀 Starte Backend (pm2)..."
if pm2 list | grep -q $PM2_NAME; then
  pm2 restart $PM2_NAME
else
  pm2 start dist/server.js --name $PM2_NAME
fi

echo "✅ Deployment abgeschlossen!"
echo ""
echo "🔧 API Routes sind verfügbar unter:"
echo "   - /api/login"
echo "   - /api/products"
echo "   - /api/wishlist"
echo "   - /api/owned"