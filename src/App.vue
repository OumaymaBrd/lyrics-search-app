<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-app-bar-title>Recherche de Paroles</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container>
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

        <!-- Formulaire de recherche -->
        <search-form 
          :loading="loading" 
          @search="searchLyrics"
        />

        <!-- Détails de la chanson ou résultats de recherche -->
        <song-details
          v-if="selectedSong"
          :song="selectedSong"
          :loading="loading"
          @back="selectedSong = null"
        />
        <search-results
          v-else
          :results="searchResults"
          :search-performed="searchPerformed"
          :loading="loading"
          @select-song="selectSong"
        />
      </v-container>
    </v-main>

    <v-footer app class="pa-0">
      <v-card flat tile width="100%" class="text-center">
        <v-card-text>
          <v-btn
            v-for="icon in ['mdi-facebook', 'mdi-twitter', 'mdi-instagram']"
            :key="icon"
            class="mx-2"
            icon
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

<script>
import SearchForm from './components/SearchForm.vue';
import SearchResults from './components/SearchResults.vue';
import SongDetails from './components/SongDetails.vue';
import api from './services/api';

export default {
  name: 'App',
  
  components: {
    SearchForm,
    SearchResults,
    SongDetails
  },
  
  data() {
    return {
      searchResults: [],
      selectedSong: null,
      loading: false,
      error: '',
      searchPerformed: false
    };
  },
  
  methods: {
    async searchLyrics(query) {
      this.loading = true;
      this.error = '';
      this.searchPerformed = true;
      this.selectedSong = null;
      
      try {
        const results = await api.searchSongs(query.title, query.artist);
        this.searchResults = results;
      } catch (err) {
        this.error = 'Une erreur est survenue lors de la recherche. Veuillez réessayer.';
        console.error('Erreur de recherche:', err);
      } finally {
        this.loading = false;
      }
    },
    
    async selectSong(song) {
      this.selectedSong = { ...song };
      this.loading = true;
      
      try {
        const lyricsData = await api.getLyrics(song.id);
        this.selectedSong.lyrics = lyricsData.lyrics;
      } catch (err) {
        this.error = 'Impossible de récupérer les paroles. Veuillez réessayer.';
        console.error('Erreur de récupération des paroles:', err);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>