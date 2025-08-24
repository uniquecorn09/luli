# LuLi - Lucy's Tonie Collection Manager

Eine Webanwendung zur Verwaltung von Tonie-Figuren und Wunschlisten.

## 🚀 Quick Start

```bash
# Development
npm run dev

# Production Build
./deploy.sh
```

## 🔧 TODO

### 🔐 Authentication & Security
- [ ] **Backend Auth aktivieren**: Auth-Routen im Backend sichern
- [ ] **Frontend Auth Interceptor**: Bearer Token automatisch setzen
- [ ] **JWT Token Handling**: Token-Validierung und Refresh implementieren

### 🌐 Server & Deployment
- [ ] **Nginx Konfiguration**: Subdomain `meinetonies.pupsmaschine.de` einrichten
- [ ] **Hetzner Server Setup**: Domain-Konfiguration anpassen
- [ ] **SSL Certificate**: HTTPS für Subdomain konfigurieren

## 📊 DB Interactions

### Container

`podman ps`

`podman exec -it <container-id> bin/bash`

### Mongo DB

`mongosh`

`mongosh "mongodb://localhost:27017/luli"`

`use luli`

`show collections`

`db.luli.find()`

`db.luli.find().pretty()`
