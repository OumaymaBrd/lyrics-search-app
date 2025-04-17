// src/services/api.js
import axios from 'axios';

// Fonction mock pour la démonstration (à remplacer par votre API réelle)
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

export default {
  searchSongs(title, artist) {
    // Pour une application réelle, remplacez par :
    // return axios.get(`${API_BASE_URL}/search`, { params: { title, artist } });
    return mockSearchAPI(title, artist);
  },
  
  getLyrics(songId) {
    // Pour une application réelle, remplacez par :
    // return axios.get(`${API_BASE_URL}/lyrics/${songId}`);
    return mockGetLyricsAPI(songId);
  }
};