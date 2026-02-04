# 🔍 Requêtes Outscraper - BeautyBeauté.fr

## Phase 1 : Top 20 Villes (80 requêtes)

### Comment utiliser Outscraper

1. Aller sur **https://outscraper.com/google-maps-scraper/**
2. Créer un compte (essai gratuit disponible)
3. Copier-coller les requêtes ci-dessous
4. Configurer : **Langue: fr**, **Pays: France**, **Limite: 100 résultats par requête**
5. Exporter en **JSON**

---

## 📋 Liste des Requêtes à Copier

### 🔹 Épilation Laser (serviceId: "laser")

```
épilation laser Paris
épilation laser Marseille
épilation laser Lyon
épilation laser Toulouse
épilation laser Nice
épilation laser Nantes
épilation laser Montpellier
épilation laser Strasbourg
épilation laser Bordeaux
épilation laser Lille
épilation laser Rennes
épilation laser Reims
épilation laser Saint-Étienne
épilation laser Le Havre
épilation laser Toulon
épilation laser Grenoble
épilation laser Dijon
épilation laser Angers
épilation laser Nîmes
épilation laser Villeurbanne
```

---

### 🔹 Cryolipolyse (serviceId: "cryo")

```
cryolipolyse Paris
cryolipolyse Marseille
cryolipolyse Lyon
cryolipolyse Toulouse
cryolipolyse Nice
cryolipolyse Nantes
cryolipolyse Montpellier
cryolipolyse Strasbourg
cryolipolyse Bordeaux
cryolipolyse Lille
cryolipolyse Rennes
cryolipolyse Reims
cryolipolyse Saint-Étienne
cryolipolyse Le Havre
cryolipolyse Toulon
cryolipolyse Grenoble
cryolipolyse Dijon
cryolipolyse Angers
cryolipolyse Nîmes
cryolipolyse Villeurbanne
```

---

### 🔹 Hydrafacial (serviceId: "hydra")

```
hydrafacial Paris
hydrafacial Marseille
hydrafacial Lyon
hydrafacial Toulouse
hydrafacial Nice
hydrafacial Nantes
hydrafacial Montpellier
hydrafacial Strasbourg
hydrafacial Bordeaux
hydrafacial Lille
hydrafacial Rennes
hydrafacial Reims
hydrafacial Saint-Étienne
hydrafacial Le Havre
hydrafacial Toulon
hydrafacial Grenoble
hydrafacial Dijon
hydrafacial Angers
hydrafacial Nîmes
hydrafacial Villeurbanne
```

---

### 🔹 Injections & Botox (serviceId: "injections")

```
injections botox Paris
injections esthétiques Marseille
médecine esthétique Lyon
injections botox Toulouse
injections acide hyaluronique Nice
médecine esthétique Nantes
injections botox Montpellier
médecine esthétique Strasbourg
injections botox Bordeaux
médecine esthétique Lille
injections esthétiques Rennes
médecine esthétique Reims
injections botox Saint-Étienne
médecine esthétique Le Havre
injections esthétiques Toulon
médecine esthétique Grenoble
injections botox Dijon
médecine esthétique Angers
injections esthétiques Nîmes
médecine esthétique Villeurbanne
```

---

## ⚙️ Configuration Outscraper Recommandée

| Paramètre | Valeur |
|-----------|--------|
| Language | `fr` |
| Region | `France` |
| Limit per query | `100` |
| Include reviews | `No` (économise des crédits) |
| Include photos | `Yes` (1 photo suffit) |
| Output format | `JSON` |

---

## 📦 Colonnes à Exporter

Assure-toi d'exporter ces colonnes :

- `name` → Nom de l'établissement
- `full_address` ou `address` → Adresse complète
- `city` → Ville
- `postal_code` → Code postal
- `latitude` → Lat
- `longitude` → Lng
- `phone` → Téléphone
- `website` → Site web
- `rating` → Note Google
- `reviews` → Nombre d'avis
- `photo` → URL de la photo principale
- `google_maps_url` ou `place_url` → Lien Google Maps

---

## 📊 Estimation des Coûts

| Métrique | Estimation |
|----------|------------|
| Requêtes | 80 |
| Résultats estimés | ~1 500 - 2 500 |
| Coût Outscraper | ~$5-10 (essai gratuit possible) |

---

## 🔄 Après l'Export

1. Télécharge les fichiers JSON
2. Place-les dans `/Users/wade/Sites/beautybeaute.fr/data/raw/`
3. Dis-moi et je créerai un script pour les fusionner dans `listings-db.json`

---

## 📝 Mapping serviceId

| Requête contient | serviceId à assigner |
|------------------|---------------------|
| "épilation laser" | `laser` |
| "cryolipolyse" | `cryo` |
| "hydrafacial" | `hydra` |
| "injections", "botox", "médecine esthétique" | `injections` |
