<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-app-bar-title>Recherche de Paroles</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <!-- Composant de recherche -->
        <v-card class="mx-auto mb-6" max-width="800">
          <v-card-title>Rechercher une chanson</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="searchLyrics">
              <v-row>
                <v-col cols="12" md="5">
                  <v-text-field
                    v-model="searchQuery.title"
                    label="Titre de la chanson"
                    prepend-icon="mdi-music-note"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="5">
                  <v-text-field
                    v-model="searchQuery.artist"
                    label="Artiste"
                    prepend-icon="mdi-account-music"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="2" class="d-flex align-center">
                  <v-btn
                    color="primary"
                    block
                    type="submit"
                    :loading="loading"
                    :disabled="!searchQuery.title && !searchQuery.artist"
                  >
                    Rechercher
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Message d'erreur -->
        <v-alert
          v-if="error"
          type="error"
          dismissible
          class="mb-6"
          @click:close="error = ''"
        >
          {{ error }}
        </v-alert>

        <!-- Résultats de recherche -->
        <v-card v-if="searchResults.length > 0 && !selectedSong" class="mx-auto mb-6" max-width="800">
          <v-card-title>Résultats de recherche</v-card-title>
          <v-list>
            <v-list-item
              v-for="(song, index) in searchResults"
              :key="index"
              @click="selectSong(song)"
              link
            >
              <template v-slot:prepend>
                <v-icon icon="mdi-music"></v-icon>
              </template>
              <v-list-item-title>{{ song.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ song.artist }}</v-list-item-subtitle>
              <template v-slot:append>
                <v-icon icon="mdi-chevron-right"></v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- Détails de la chanson -->
        <v-card v-if="selectedSong" class="mx-auto" max-width="800">
          <v-toolbar color="primary" dark>
            <v-btn icon="mdi-arrow-left" @click="selectedSong = null"></v-btn>
            <v-toolbar-title>Détails de la chanson</v-toolbar-title>
          </v-toolbar>
          <v-card-title class="text-h5">
            {{ selectedSong.title }}
          </v-card-title>
          <v-card-subtitle>
            <div class="d-flex align-center">
              <v-icon size="small" icon="mdi-account-music" class="mr-1"></v-icon>
              {{ selectedSong.artist }}
            </div>
            <div v-if="selectedSong.album" class="d-flex align-center mt-1">
              <v-icon size="small" icon="mdi-album" class="mr-1"></v-icon>
              {{ selectedSong.album }}
            </div>
          </v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text>
            <div v-if="loading" class="text-center py-4">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <div class="mt-2">Chargement des paroles...</div>
            </div>
            <div v-else-if="selectedSong.lyrics" class="lyrics-container">
              <h3 class="mb-4">Paroles</h3>
              <div class="lyrics-text">
                {{ selectedSong.lyrics }}
              </div>
            </div>
            <div v-else class="text-center py-4">
              <v-icon size="large" icon="mdi-music-note-off" color="grey"></v-icon>
              <div class="mt-2">Paroles non disponibles</div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Message si aucun résultat -->
        <v-card v-if="searchPerformed && searchResults.length === 0 && !loading && !error" class="mx-auto text-center py-4" max-width="800">
          <v-icon size="large" icon="mdi-playlist-remove" color="grey"></v-icon>
          <div class="mt-2">Aucun résultat trouvé. Veuillez essayer une autre recherche.</div>
        </v-card>
      </v-container>
    </v-main>

    <v-footer app class="pa-0">
      <v-card flat tile width="100%" class="text-center">
        <v-card-text>
          <v-btn
            v-for="icon in ['mdi-facebook', 'mdi-twitter', 'mdi-instagram']"
            :key="icon"
            class="mx-2"
            :icon="icon"
            variant="text"
          ></v-btn>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text>
          {{ new Date().getFullYear() }} — <strong>Recherche de Paroles</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, reactive } from 'vue';

// État réactif
const searchQuery = reactive({
  title: '',
  artist: ''
});
const searchResults = ref([]);
const selectedSong = ref(null);
const loading = ref(false);
const error = ref('');
const searchPerformed = ref(false);

// Fonction de recherche
const searchLyrics = async () => {
  if (!searchQuery.title && !searchQuery.artist) {
    error.value = 'Veuillez entrer un titre de chanson ou un nom d\'artiste';
    return;
  }

  loading.value = true;
  error.value = '';
  searchPerformed.value = true;
  
  try {
    // Simulation d'appel API (à remplacer par votre API réelle)
    const response = await mockSearchAPI(searchQuery.title, searchQuery.artist);
    searchResults.value = response;
    
    if (response.length === 0) {
      // Aucun résultat trouvé
      console.log('Aucun résultat trouvé');
    }
  } catch (err) {
    error.value = 'Une erreur est survenue lors de la recherche. Veuillez réessayer.';
    console.error('Erreur de recherche:', err);
  } finally {
    loading.value = false;
  }
};

// Fonction pour sélectionner une chanson
const selectSong = async (song) => {
  selectedSong.value = { ...song };
  loading.value = true;
  
  try {
    // Simulation d'appel API pour obtenir les paroles (à remplacer par votre API réelle)
    const lyricsData = await mockGetLyricsAPI(song.id);
    selectedSong.value.lyrics = lyricsData.lyrics;
  } catch (err) {
    error.value = 'Impossible de récupérer les paroles. Veuillez réessayer.';
    console.error('Erreur de récupération des paroles:', err);
  } finally {
    loading.value = false;
  }
};

// API mock pour la démonstration (à remplacer par votre API réelle)
const mockSearchAPI = (title, artist) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Données de démonstration
      const mockData = [
        { id: 1, title: 'Shape of You', artist: 'Ed Sheeran', album: '÷ (Divide)' },
        { id: 2, title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours' },
        { id: 3, title: 'Dance Monkey', artist: 'Tones and I', album: 'The Kids Are Coming' },
        { id: 4, title: 'Someone You Loved', artist: 'Lewis Capaldi', album: 'Divinely Uninspired to a Hellish Extent' }
      ];
      
      // Filtrer les résultats en fonction de la recherche
      const results = mockData.filter(song => {
        const matchTitle = title && song.title.toLowerCase().includes(title.toLowerCase());
        const matchArtist = artist && song.artist.toLowerCase().includes(artist.toLowerCase());
        return title && artist ? (matchTitle && matchArtist) : (matchTitle || matchArtist);
      });
      
      resolve(results);
    }, 1000); // Simuler un délai réseau
  });
};

const mockGetLyricsAPI = (songId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Exemple de paroles (à remplacer par votre API réelle)
      const mockLyrics = {
        1: { lyrics: "[Exemple de paroles pour Shape of You]\n\nLes paroles complètes seraient affichées ici." },
        2: { lyrics: "[Exemple de paroles pour Blinding Lights]\n\nLes paroles complètes seraient affichées ici." },
        3: { lyrics: "[Exemple de paroles pour Dance Monkey]\n\nLes paroles complètes seraient affichées ici." },
        4: { lyrics: "[Exemple de paroles pour Someone You Loved]\n\nLes paroles complètes seraient affichées ici." }
      };
      
      resolve(mockLyrics[songId] || { lyrics: "Paroles non disponibles" });
    }, 800); // Simuler un délai réseau
  });
};
</script>

<style>
.lyrics-container {
  white-space: pre-line;
  line-height: 1.6;
}

.lyrics-text {
  font-size: 1.1rem;
  padding: 1rem 0;
}
</style>