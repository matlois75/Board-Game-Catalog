const gameDetails = document.getElementById('gameDetails');
const gameCardContainer = document.getElementById('gameCardContainer');
const gameList = document.getElementById('gameList');
const filterContainer = document.getElementById('filterContainer');
const addGameModal = document.getElementById('addGameModal');
const removeGameBtn = document.querySelector('.remove-game-btn');
const addGameBtn = document.querySelector('.add-game-btn');
const closeModalBtn = document.querySelector('#addGameModal .close-modal-btn');
const translationCache = {};
let filteredGames = {};
let isRemoveMode = false;
let currentLanguage = 'en';

firebase.initializeApp(firebaseConfig);
const database = firebase.database()

let isAuthenticated = false;
const auth = firebase.auth();


const translations = {
  en: {
    "site-title": "Cathy's Games",
    "what-will-we-play": "What will we play?",
    "add-game": "Add Game",
    "remove-game": "Remove Game",
    "finish-removing": "Finish Removing",
    "your-collection": "Your Collection",
    "find-your-next-game": "Find Your Next Game",
    "number-of-players": "Number of Players",
    "game-types": "Game Types",
    "play-time": "Play Time",
    "reset-filters": "Reset Filters",
    "random-choice": "RANDOM CHOICE",
    "players": "Players",
    "Quick": "Quick",
    "Medium": "Medium",
    "Long": "Long",
    "Strategy": "Strategy",
    "Party": "Party",
    "Bluffing": "Bluffing",
    "select-game-types": "Select Game Types",
    "select-play-time": "Select Play Time",
    "add-new-game": "Add New Game",
    "game-name": "Game Name",
    "author": "Author",
    "footer-text": "© 2024 Cathy's Games. All rights reserved.",
    "players-label": "Players:",
    "play-time-label": "Play Time:",
    "category-label": "Category:",
    "author-label": "Author:",
    "close": "Close",
    'game-not-found': 'Game not found. Please check the name and try again.',
    'fetch-error': 'An error occurred while fetching game data. Please try again.',
    'incomplete-info': 'Please choose a game from the list.',
    "players-label": "Players:",
    "play-time-label": "Play Time:",
    "category-label": "Category:",
    "author-label": "Author:",
    "Strategy": "Strategy",
    "Party": "Party",
    "Trivia": "Trivia",
    "Cooperative": "Cooperative",
    "Bluffing": "Bluffing",
    "Memory": "Memory",
    "Civilization": "Civilization",
    "Racing": "Racing",
    "Quick": "Quick",
    "Medium": "Medium",
    "Long": "Long",
    'game-added-success': 'Game added successfully!',
    'game-added-with-warning': 'Game added, but there might be some missing information. Please check the game details.',
    'loading': 'Loading...',
    'game-added-success': '{gameName} added successfully!',
    'game-added-with-warning': '{gameName} added successfully, but there was an issue during the process. The game information should be complete, but please check the details.',
    'game-name-label': 'Game Name:',
    'loading': 'Loading...',
    'game-added-success': '{gameName} added successfully!',
    'game-added-with-warning': '{gameName} added successfully, but there was an issue during the process. The game information should be complete, but please check the details.',
    'games-per-page': 'Games per page:',
    'any': 'Any',
    'select-game-types': 'Select Game Types',
    'select-play-time': 'Select Play Time',
    "enter-password": "Enter Password",
    "password-placeholder": "Enter password",
    "submit": "Submit",
    "incorrect-password": "Incorrect password. Please try again.",
    "add-new-game": "Add New Game",
    "game-name-label": "Game Name:",
    "game-name-placeholder": "Enter game name",
    "add-game-button": "Add Game",
    'game-removed-success': '{gameName} removed successfully!',
    "search-placeholder": "Search games...",
    "auth-required": "Authentication required to perform this action.",
    "Other": "Other",
    "add-game": "Add Game",
    "no-games-match-filters": "No games match the current filters."
  },
  fr: {
    "site-title": "Jeux de Cathy",
    "what-will-we-play": "À quoi allons-nous jouer ?",
    "add-game": "Ajouter un jeu",
    "remove-game": "Supprimer un jeu",
    "finish-removing": "Terminer la suppression",
    "your-collection": "Votre collection",
    "find-your-next-game": "Trouvez votre prochain jeu",
    "number-of-players": "Nombre de joueurs",
    "game-types": "Types de jeux",
    "play-time": "Temps de jeu",
    "reset-filters": "Réinitialiser les filtres",
    "random-choice": "CHOIX ALÉATOIRE",
    "players": "Joueurs",
    "Quick": "Rapide",
    "Medium": "Moyen",
    "Long": "Long",
    "Strategy": "Stratégie",
    "Party": "Fête",
    "Bluffing": "Bluff",
    "select-game-types": "Sélectionner les types de jeux",
    "select-play-time": "Sélectionner le temps de jeu",
    "add-new-game": "Ajouter un nouveau jeu",
    "game-name": "Nom du jeu",
    "author": "Auteur",
    "footer-text": "© 2024 Les Jeux de Cathy. Tous droits réservés.",
    "players-label": "Joueurs :",
    "play-time-label": "Temps de jeu :",
    "category-label": "Catégorie :",
    "author-label": "Auteur :",
    "close": "Fermer",
    'game-not-found': 'Jeu non trouvé. Veuillez vérifier le nom et réessayer.',
    'fetch-error': 'Une erreur s\'est produite lors de la récupération des données du jeu. Veuillez réessayer.',
    'incomplete-info': 'Veuillez saisir un jeux de la liste.',
    "players-label": "Joueurs :",
    "play-time-label": "Temps de jeu :",
    "category-label": "Catégorie :",
    "author-label": "Auteur :",
    "Strategy": "Stratégie",
    "Party": "Fête",
    "Trivia": "Quiz",
    "Cooperative": "Coopératif",
    "Bluffing": "Bluff",
    "Memory": "Mémoire",
    "Civilization": "Civilisation",
    "Racing": "Course",
    "Quick": "Rapide",
    "Medium": "Moyen",
    "Long": "Long",
    'game-added-success': 'Jeu ajouté avec succès!',
    'game-added-with-warning': 'Jeu ajouté, mais il pourrait manquer certaines informations. Veuillez vérifier les détails du jeu.',
    'loading': 'Chargement...',
    'game-added-success': '{gameName} a été ajouté avec succès !',
    'game-added-with-warning': '{gameName} a été ajouté avec succès, mais il y a eu un problème pendant le processus. Les informations du jeu devraient être complètes, mais veuillez vérifier les détails.',
    'game-name-label': 'Nom du jeu :',
    'loading': 'Chargement...',
    'game-added-success': '{gameName} a été ajouté avec succès !',
    'game-added-with-warning': '{gameName} a été ajouté avec succès, mais il y a eu un problème pendant le processus. Les informations du jeu devraient être complètes, mais veuillez vérifier les détails.',
    'games-per-page': 'Jeux par page :',
    'any': 'Tous',
    'select-game-types': 'Sélectionner les types de jeux',
    'select-play-time': 'Sélectionner le temps de jeu',
    "enter-password": "Entrez le mot de passe",
    "password-placeholder": "Entrez le mot de passe",
    "submit": "Soumettre",
    "incorrect-password": "Mot de passe incorrect. Veuillez réessayer.",
    "add-new-game": "Ajouter un nouveau jeu",
    "game-name-label": "Nom du jeu :",
    "game-name-placeholder": "Entrez le nom du jeu",
    "add-game-button": "Ajouter le jeu",
    'game-removed-success': '{gameName} supprimé avec succès !',
    "search-placeholder": "Rechercher des jeux...",
    "auth-required": "Authentification requise pour effectuer cette action.",
    "Other": "Autre",
    "add-game": "Ajouter un jeu",
    "no-games-match-filters": "Aucun jeu ne correspond aux filtres actuels."
  },
};

const categoryMapping = {
  'Strategy': ['Strategy', 'Abstract Strategy', 'Area Control', 'Economic'],
  'Party': ['Party', 'Humor', 'Word Game', 'Deduction'],
  'Trivia': ['Trivia', 'Educational', 'Quiz'],
  'Cooperative': ['Cooperative', 'Team-Based'],
  'Bluffing': ['Bluffing', 'Negotiation', 'Deception'],
  'Memory': ['Memory', 'Pattern Recognition'],
  'Civilization': ['Civilization', '4X', 'City Building'],
  'Racing': ['Racing', 'Real-time']
};

document.addEventListener('DOMContentLoaded', async function() {
  if (!gameDetails) {
    return;
  }

  const savedGames = await loadGamesFromFirebase();
  games = savedGames || {};

  setupFilters();

  document.querySelector('.random-game-btn').addEventListener('click', chooseRandomGame);
  
  if (addGameBtn) {
    addGameBtn.addEventListener('click', openModal);
  }

  const addGameModalBtn = document.querySelector('#addGameBtn');
  if (addGameModalBtn) {
    addGameModalBtn.addEventListener('click', addGame);
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  document.addEventListener('click', handleGameDetailsClick);
  
  const closeGameDetailsBtn = gameDetails.querySelector('.close-game-details-btn');
  if (closeGameDetailsBtn) {
    closeGameDetailsBtn.addEventListener('click', closeGameDetails);
  }

  if (removeGameBtn) {
    removeGameBtn.addEventListener('click', toggleRemoveMode);
  }

  const languageSelector = document.querySelector('.language-selector');
  const selectedLanguage = languageSelector.querySelector('.selected-language');
  const languageDropdown = languageSelector.querySelector('.language-dropdown');

  selectedLanguage.addEventListener('click', () => {
    languageDropdown.style.display = languageDropdown.style.display === 'block' ? 'none' : 'block';
  });

  document.querySelectorAll('.language-option').forEach(option => {
    option.addEventListener('click', () => {
      const lang = option.getAttribute('data-lang');
      switchLanguage(lang);
      languageDropdown.style.display = 'none';
    });
  });

  document.addEventListener('click', (event) => {
    if (!languageSelector.contains(event.target)) {
      languageDropdown.style.display = 'none';
    }
  });

  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage) {
    currentLanguage = savedLanguage;
  }

  document.addEventListener('click', async (event) => {
    if (!isRemoveMode && event.target.closest('.game-card')) {
      await openGameDetails(event);
    }
  });

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }

  switchLanguage(currentLanguage);

  await preloadTranslations();

  // Authentication setup
  const authButton = document.getElementById('authButton');
  const passwordModal = document.getElementById('passwordModal');
  const passwordInput = document.getElementById('passwordInput');
  const submitPassword = document.getElementById('submitPassword');
  const closePasswordModal = document.getElementById('closePasswordModal');

  authButton.addEventListener('click', openPasswordModal);
  submitPassword.addEventListener('click', checkPassword);
  closePasswordModal.addEventListener('click', closePasswordModalFunc);

  // Add event listener for pressing Enter in the password input
  passwordInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      checkPassword();
    }
  });

  // Add event listener for clicking outside the modal
  window.addEventListener('click', function(event) {
    if (event.target === passwordModal) {
      closePasswordModalFunc();
    }
  });

  updateAuthUI();

  listenForUpdates();
  loadGameCards();

  auth.onAuthStateChanged((user) => {
    isAuthenticated = !!user;
    updateAuthUI();
  });
});

function openPasswordModal() {
  const passwordModal = document.getElementById('passwordModal');
  passwordModal.style.display = 'block';
}

function closePasswordModalFunc() {
  const passwordModal = document.getElementById('passwordModal');
  const passwordInput = document.getElementById('passwordInput');
  passwordModal.style.display = 'none';
  passwordInput.value = ''; // Clear the input when closing
}

function checkPassword() {
  const passwordInput = document.getElementById('passwordInput');
  const email = "famille@jeux.com";
  const password = passwordInput.value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      isAuthenticated = true;
      updateAuthUI();
      closePasswordModalFunc();
    })
    .catch((error) => {
      alert(translations[currentLanguage]['incorrect-password']);
    });
}

function signOut() {
  auth.signOut().then(() => {
    isAuthenticated = false;
    updateAuthUI();
  }).catch((error) => {
    console.error("Sign out error", error);
  });
}

function updateAuthUI() {
  const authButton = document.getElementById('authButton');
  const addGameBtn = document.querySelector('.add-game-btn');
  const removeGameBtn = document.querySelector('.remove-game-btn');

  if (isAuthenticated) {
    authButton.innerHTML = '<i class="fas fa-lock-open"></i>';
    authButton.onclick = signOut;
    if (addGameBtn) addGameBtn.style.display = 'inline-block';
    if (removeGameBtn) removeGameBtn.style.display = 'inline-block';
  } else {
    authButton.innerHTML = '<i class="fas fa-lock"></i>';
    authButton.onclick = openPasswordModal;
    if (addGameBtn) addGameBtn.style.display = 'none';
    if (removeGameBtn) removeGameBtn.style.display = 'none';
  }
}

function loadGameCards(filteredGames = games) {
  const gameEntries = Object.entries(filteredGames);
  const totalPages = Math.max(1, Math.ceil(gameEntries.length / gamesPerPage));
  
  // Ensure currentPage is within valid range
  currentPage = Math.max(1, Math.min(currentPage, totalPages));
  
  const startIndex = (currentPage - 1) * gamesPerPage;
  const endIndex = startIndex + gamesPerPage;
  const currentGames = gameEntries.slice(startIndex, endIndex);

  gameCardContainer.innerHTML = '';
  currentGames.forEach(([_, game]) => {
    addNewGameCard(game);
  });

  updatePagination(totalPages);
  updateRemoveButtons();
}

async function openGameDetails(event) {
  if (!isRemoveMode) {
    const gameCard = event.target.closest('.game-card');
    if (gameCard) {
      // Show loading indicator
      showLoading();

      const gameId = gameCard.dataset.gameTitle;
      const gameData = Object.values(games).find(game => game.title.en === gameId);
      
      // Preload common translations if not already cached
      await preloadTranslations();

      // Format player count
      const [minPlayers, maxPlayers] = gameData.playerCount.split('-').map(Number);
      const playerCountDisplay = minPlayers === maxPlayers ? `${minPlayers}` : gameData.playerCount;

      // Prepare all translations
      const [
        playersLabel,
        playTimeLabel,
        translatedPlayTime,
        categoryLabel,
        translatedCategories,
        authorLabel,
        translatedDescription
      ] = await Promise.all([
        translateText(translations[currentLanguage]['players-label'], currentLanguage.toUpperCase()),
        translateText(translations[currentLanguage]['play-time-label'], currentLanguage.toUpperCase()),
        translateText(translations[currentLanguage][gameData.playTime] || gameData.playTime, currentLanguage.toUpperCase()),
        translateText(translations[currentLanguage]['category-label'], currentLanguage.toUpperCase()),
        Promise.all(gameData.category.map(cat => 
          translateText(translations[currentLanguage][cat] || cat, currentLanguage.toUpperCase())
        )),
        translateText(translations[currentLanguage]['author-label'], currentLanguage.toUpperCase()),
        currentLanguage === 'fr' ? translateText(gameData.description.en, 'FR') : gameData.description.en
      ]);

      // Clean and format the description
      const cleanedDescription = cleanDescription(translatedDescription);

      // Update the UI with all translations ready
      gameDetails.querySelector('.game-details-title').textContent = gameData.title[currentLanguage];
      gameDetails.querySelector('.game-details-image').src = gameData.image;
      
      // Use innerHTML and replace newlines with <br> tags
      const descriptionElement = gameDetails.querySelector('.game-details-description');
      descriptionElement.innerHTML = cleanedDescription.replace(/\n/g, '<br>');
      
      gameDetails.querySelector('.game-details-info .game-details-info-item:nth-child(1) .game-details-info-label').textContent = playersLabel;
      gameDetails.querySelector('.game-details-info .game-details-info-item:nth-child(1) .game-details-info-value').textContent = playerCountDisplay;
      
      gameDetails.querySelector('.game-details-info .game-details-info-item:nth-child(2) .game-details-info-label').textContent = playTimeLabel;
      gameDetails.querySelector('.game-details-info .game-details-info-item:nth-child(2) .game-details-info-value').textContent = translatedPlayTime;
      
      gameDetails.querySelector('.game-details-info .game-details-info-item:nth-child(3) .game-details-info-label').textContent = categoryLabel;
      gameDetails.querySelector('.game-details-info .game-details-info-item:nth-child(3) .game-details-info-value').textContent = translatedCategories.join(', ');
      
      gameDetails.querySelector('.game-details-info .game-details-info-item:nth-child(4) .game-details-info-label').textContent = authorLabel;
      gameDetails.querySelector('.game-details-info .game-details-info-item:nth-child(4) .game-details-info-value').textContent = gameData.author;
      
      hideLoading();

      gameDetails.classList.add('open');

      // Prevent the click event from immediately closing the details
      setTimeout(() => {
        document.addEventListener('click', handleOutsideClick);
      }, 0);
    }
  }
}

function closeGameDetails() {
  gameDetails.classList.remove('open');
  document.removeEventListener('click', handleOutsideClick);
  hideLoading(); // Ensure loading is hidden when closing details
}

function handleOutsideClick(event) {
  const gameDetailsContent = gameDetails.querySelector('.game-details-content');
  if (!gameDetailsContent.contains(event.target)) {
    closeGameDetails();
  }
}

function handleGameDetailsClick(event) {
  if (!isRemoveMode && event.target.closest('.game-card')) {
    openGameDetails(event);
  }
}

function addNewGameCard(gameData) {
  const [minPlayers, maxPlayers] = gameData.playerCount.split('-').map(Number);
  const playerCountDisplay = minPlayers === maxPlayers ? `${minPlayers}` : gameData.playerCount;

  const newGameCard = `
      <div class="game-card" data-game-title="${gameData.title.en}">
          <img src="${gameData.image}" alt="${gameData.title.en}" class="w-full h-48 object-cover rounded-md">
          <div class="card-content px-4 py-2 rounded-b-md bg-gray-800 opacity-75">
              <h3 class="card-title text-white font-bold">${gameData.title.en}</h3>
              <div class="tags">
                  ${gameData.category.map(cat => `<span class="tag">${translations[currentLanguage][cat] || translations[currentLanguage]['Other']}</span>`).join('')}
                  ${gameData.originalCategory ? `<span class="tag original-category">${gameData.originalCategory[currentLanguage]}</span>` : ''}
                  <span class="tag">${playerCountDisplay} ${translations[currentLanguage]['players']}</span>
                  <span class="tag">${translations[currentLanguage][gameData.playTime] || gameData.playTime}</span>
              </div>
          </div>
          <button class="remove-button" data-game-title="${gameData.title.en}">-</button>
      </div>
  `;
  gameCardContainer.insertAdjacentHTML('beforeend', newGameCard);
}

function setupFilters() {
  const playerCountFilter = document.getElementById('playerCountFilter');
  const playerCountValue = document.getElementById('playerCountValue');
  const gameTypeCheckboxes = document.querySelectorAll('input[name="gameType"]');
  const playTimeCheckboxes = document.querySelectorAll('input[name="playTime"]');
  const resetFiltersBtn = document.getElementById('resetFilters');

  playerCountFilter.addEventListener('input', function() {
    updatePlayerCountDisplay(this.value);
    applyFilters();
});

  updatePlayerCountDisplay(playerCountFilter.value);

  gameTypeCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
  });

  playTimeCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
  });

  document.querySelector('[data-translate="search-games"]').textContent = translations[currentLanguage]['search-games'];

  resetFiltersBtn.addEventListener('click', resetFilters);

  // Translate filter labels
  document.querySelector('[data-translate="number-of-players"]').textContent = translations[currentLanguage]['number-of-players'];
  document.querySelector('[data-translate="game-types"]').textContent = translations[currentLanguage]['game-types'];
  document.querySelector('[data-translate="play-time"]').textContent = translations[currentLanguage]['play-time'];
  document.querySelector('[data-translate="select-game-types"]').textContent = translations[currentLanguage]['select-game-types'];
  document.querySelector('[data-translate="select-play-time"]').textContent = translations[currentLanguage]['select-play-time'];

  // Translate game type options
  gameTypeCheckboxes.forEach(checkbox => {
    const label = checkbox.parentElement;
    const translatedText = translations[currentLanguage][checkbox.value] || checkbox.value;
    label.textContent = translatedText;
    label.insertBefore(checkbox, label.firstChild);
  });

  // Translate play time options
  playTimeCheckboxes.forEach(checkbox => {
    const label = checkbox.parentElement;
    const translatedText = translations[currentLanguage][checkbox.value] || checkbox.value;
    label.textContent = translatedText;
    label.insertBefore(checkbox, label.firstChild);
  });

  const gamesPerPageSelect = document.getElementById('gamesPerPage');
  gamesPerPageSelect.addEventListener('change', updateGamesPerPage);

  applyFilters();
}

function updatePlayerCountDisplay(value) {
  const playerCountValue = document.getElementById('playerCountValue');
  const intValue = parseInt(value);
  if (intValue === 0) {
      playerCountValue.textContent = translations[currentLanguage]['any'];
  } else if (intValue === 8) {
      playerCountValue.textContent = '8+';
  } else {
      playerCountValue.textContent = intValue;
  }
}

function applyFilters() {
  const playerCount = parseInt(document.getElementById('playerCountFilter').value);
  const selectedGameTypes = Array.from(document.querySelectorAll('input[name="gameType"]:checked')).map(cb => cb.value);
  const selectedPlayTimes = Array.from(document.querySelectorAll('input[name="playTime"]:checked')).map(cb => cb.value);
  const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();

  filteredGames = Object.fromEntries(
    Object.entries(games).filter(([_, game]) => {
      const [minPlayers, maxPlayers] = game.playerCount.split('-').map(Number);
      const meetsPlayerCount = playerCount === 0 || (playerCount >= minPlayers && (playerCount <= maxPlayers || maxPlayers === '+'));
      const meetsGameType = selectedGameTypes.length === 0 || game.category.some(cat => selectedGameTypes.includes(cat));
      const meetsPlayTime = selectedPlayTimes.length === 0 || selectedPlayTimes.includes(game.playTime);
      const meetsSearchQuery = searchQuery === '' || game.title[currentLanguage].toLowerCase().includes(searchQuery);

      return meetsPlayerCount && meetsGameType && meetsPlayTime && meetsSearchQuery;
    })
  );

  // Reset to page 1 if no games match the criteria or if search is cleared
  if (Object.keys(filteredGames).length === 0 || searchQuery === '') {
    currentPage = 1;
  }

  loadGameCards(filteredGames);
}

function resetFilters() {
  const playerCountFilter = document.getElementById('playerCountFilter');
  playerCountFilter.value = 0;
  updatePlayerCountDisplay(playerCountFilter.value);

  document.querySelectorAll('input[name="gameType"]').forEach(cb => cb.checked = false);
  document.querySelectorAll('input[name="playTime"]').forEach(cb => cb.checked = false);
  document.querySelector('[data-translate="select-game-types"]').textContent = translations[currentLanguage]['select-game-types'];
  document.querySelector('[data-translate="select-play-time"]').textContent = translations[currentLanguage]['select-play-time'];

  applyFilters();
  loadGameCards();
  updateRemoveButtons();
}

function updateRemoveButtons() {
  const gameCards = gameCardContainer.querySelectorAll('.game-card');
  gameCards.forEach(card => {
    card.classList.toggle('remove-mode', isRemoveMode);
    const removeButton = card.querySelector('.remove-button');
    if (removeButton) {
      removeButton.style.display = isRemoveMode ? 'block' : 'none';
    }
  });
}

function chooseRandomGame() {
  const filteredGameArray = Object.values(filteredGames);
  if (filteredGameArray.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredGameArray.length);
    const randomGame = filteredGameArray[randomIndex];
    openGameDetails({ target: { closest: () => ({ dataset: { gameTitle: randomGame.title[currentLanguage] } }) } });
  } else {
    showNotification(translations[currentLanguage]['no-games-match-filters'], 3000);
  }
}

async function fetchGameInfo(gameId) {
  const apiUrl = `https://boardgamegeek.com/xmlapi2/thing?id=${gameId}`;

  try {
    console.log('Fetching game info from BGG API:', apiUrl);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const name = xmlDoc.querySelector('name[type="primary"]')?.getAttribute('value');
    if (!name) {
      throw new Error('Game name not found in API response');
    }

    const description = xmlDoc.querySelector('description')?.textContent || 'No description available.';
    const minPlayers = xmlDoc.querySelector('minplayers')?.getAttribute('value');
    const maxPlayers = xmlDoc.querySelector('maxplayers')?.getAttribute('value');
    const playingTime = parseInt(xmlDoc.querySelector('playingtime')?.getAttribute('value') || '0');
    const category = xmlDoc.querySelector('link[type="boardgamecategory"]')?.getAttribute('value') || 'Unknown';
    const mappedCategory = mapCategory(category);
    const imageUrl = xmlDoc.querySelector('image')?.textContent || './images/placeholder.jpg';
    const author = xmlDoc.querySelector('link[type="boardgamedesigner"]')?.getAttribute('value') || 'Unknown';

    let translatedCategory = category;
    if (currentLanguage === 'fr') {
        try {
            translatedCategory = await translateText(category, 'FR');
        } catch (error) {
            console.error('Error translating category:', error);
            // If translation fails, we'll use the original category
        }
    }

    if (playingTime <= 30) {
      playTimeCategory = 'Quick';
    } else if (playingTime <= 60) {
      playTimeCategory = 'Medium';
    } else {
      playTimeCategory = 'Long';
    }

    const gameData = {
      title: {
        en: name,
        fr: name // Will be translated later if needed
      },
      image: imageUrl,
      description: {
        en: cleanDescription(description),
        fr: cleanDescription(description) // Will be translated later if needed
      },
      playerCount: `${minPlayers}-${maxPlayers}`,
      playTime: playTimeCategory,
      category: [mappedCategory],
      originalCategory: {
        en: category,
        fr: category // Will be translated later
      },
      author: author
    };
  
    // Translate the original category if the current language is French
    if (currentLanguage === 'fr') {
      gameData.originalCategory.fr = await translateText(category, 'FR');
    }
  
    console.log('Parsed game data:', gameData);
    return gameData;
  } catch (error) {
    console.error('Error in fetchGameInfo:', error);
    throw error; // Re-throw the error to be caught in addGame
  }
}

async function addGame() {
  if (!isAuthenticated) {
    alert(translations[currentLanguage]['auth-required']);
    return;
  }

  const gameName = gameNameInput.value;
  const gameId = gameNameInput.dataset.id;

  if (gameName && gameId) {
    // Show loading indicator
    const addButton = document.getElementById('addGameBtn');
    const originalButtonText = addButton.textContent;
    addButton.textContent = translations[currentLanguage]['loading'] || 'Loading...';
    addButton.disabled = true;

    try {
      console.log('Fetching game info for:', gameName, 'with ID:', gameId);
      const gameData = await fetchGameInfo(gameId);
      
      if (gameData) {
        games[gameData.title.en] = gameData;
        addNewGameCard(gameData);
        
        // Save games to Firebase after adding a new game
        saveGamesToFirebase();
        
        if (currentLanguage === 'fr') {
          try {
            console.log('Translating game data to French');
            gameData.title.fr = await translateText(gameData.title.en, 'FR');
            gameData.description.fr = await translateText(gameData.description.en, 'FR');
            gameData.author = await translateText(gameData.author, 'FR');
            gameData.originalCategory.fr = await translateText(gameData.originalCategory.en, 'FR');
          } catch (error) {
            console.error('Translation error:', error);
            // Continue with untranslated data if translation fails
          }
        }
        
        const successMessage = translations[currentLanguage]['game-added-success'].replace('{gameName}', gameData.title.en);
        showNotification(successMessage);
        
        closeModal();
        applyFilters();
      } else {
        throw new Error('Game data not found');
      }
    } catch (error) {
      console.error('Error in addGame function:', error);
      
      // Check if the game was actually added despite the error
      if (games[gameName] || Object.values(games).some(game => game.title.en === gameName)) {
        console.log('Game was added despite error:', gameName);
        const warningMessage = translations[currentLanguage]['game-added-with-warning'].replace('{gameName}', gameName);
        showNotification(warningMessage);
        closeModal();
        applyFilters();
      } else {
        console.log('Game was not added:', gameName);
        showNotification(translations[currentLanguage]['fetch-error'], 5000);
      }
    } finally {
      // Reset button state
      addButton.textContent = originalButtonText;
      addButton.disabled = false;
    }
  } else {
    showNotification(translations[currentLanguage]['incomplete-info'], 5000);
  }
  currentPage = 1;
  loadGameCards();
}

function calculateSimilarity(s1, s2) {
  let longer = s1;
  let shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  const longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  const costs = new Array();
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0)
        costs[j] = j;
      else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

async function fetchGameDetails(gameId) {
  const apiUrl = `https://boardgamegeek.com/xmlapi2/thing?id=${gameId}`;

  try {
    const response = await fetch(apiUrl);
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const name = xmlDoc.querySelector('name[type="primary"]').getAttribute('value');
    const description = xmlDoc.querySelector('description').textContent || 'No description available.';
    const minPlayers = xmlDoc.querySelector('minplayers').getAttribute('value');
    const maxPlayers = xmlDoc.querySelector('maxplayers').getAttribute('value');
    const playingTime = parseInt(xmlDoc.querySelector('playingtime').getAttribute('value'));
    const category = xmlDoc.querySelector('link[type="boardgamecategory"]')?.getAttribute('value') || 'Unknown';
    const imageUrl = xmlDoc.querySelector('image')?.textContent || './images/placeholder.jpg';

    // Categorize play time
    let playTimeCategory;
    if (playingTime <= 30) {
      playTimeCategory = 'Quick';
    } else if (playingTime <= 60) {
      playTimeCategory = 'Medium';
    } else {
      playTimeCategory = 'Long';
    }

    return {
      title: {
        en: name,
        fr: name // You may want to add translation logic here in the future
      },
      image: imageUrl,
      description: {
        en: description,
        fr: description // You may want to add translation logic here in the future
      },
      playerCount: `${minPlayers}-${maxPlayers}`,
      playTime: playTimeCategory,
      category: [category],
    };
  } catch (error) {
    return null;
  }
}

function openModal() {
  addGameModal.style.display = 'block';
  // Add event listener for clicking outside the modal
  setTimeout(() => {
      document.addEventListener('click', handleOutsideModalClick);
  }, 0);
}

function handleOutsideModalClick(event) {
  if (event.target === addGameModal) {
      closeModal();
  }
}

function closeModal() {
  const addGameModal = document.getElementById('addGameModal');
  if (addGameModal) {
    addGameModal.style.display = 'none';
  }
  
  // Remove the event listener when closing the modal
  document.removeEventListener('click', handleOutsideModalClick);
  
  // Clear input fields
  const gameNameInput = document.getElementById('gameName');
  if (gameNameInput) {
    gameNameInput.value = '';
    delete gameNameInput.dataset.id;
  }
  
  // Clear autocomplete results
  const autocompleteResults = document.getElementById('autocompleteResults');
  if (autocompleteResults) {
    autocompleteResults.innerHTML = '';
  }
}

function toggleRemoveMode() {
  isRemoveMode = !isRemoveMode;
  gameCardContainer.classList.toggle('remove-mode', isRemoveMode);
  updateRemoveButtonText();
  updateRemoveButtons();

  if (isRemoveMode) {
    gameCardContainer.addEventListener('click', handleRemoveGame);
  } else {
    gameCardContainer.removeEventListener('click', handleRemoveGame);
  }
}

function handleRemoveGame(event) {
  if (!isAuthenticated) {
    alert(translations[currentLanguage]['auth-required']);
    return;
  }

  const removeButton = event.target.closest('.remove-button');
  if (removeButton && isRemoveMode) {
    event.stopPropagation(); // Prevent opening game details
    const gameCard = removeButton.closest('.game-card');
    const gameTitle = gameCard.dataset.gameTitle;
    
    // Find the game in the games object using the title in both languages
    const gameToRemove = Object.values(games).find(game => game.title.en === gameTitle);

    if (gameToRemove) {
      // Remove the game from the games object
      delete games[gameToRemove.title.en];
      
      // Save games to Firebase after removing a game
      saveGamesToFirebase();
      
      // Remove the game card from the DOM
      gameCard.remove();

      // Refresh the game cards to update the layout
      applyFilters();
      
      // Show notification
      showNotification(translations[currentLanguage]['game-removed-success'].replace('{gameName}', gameTitle));
    }
  }
}

async function switchLanguage(lang) {
  currentLanguage = lang;
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translations[lang][key]) {
      if (element.tagName === 'INPUT') {
        if (element.type === 'text' || element.type === 'password') {
          element.placeholder = translations[lang][key];
        }
      } else if (element.tagName === 'BUTTON') {
        element.textContent = translations[lang][key];
      } else {
        element.textContent = translations[lang][key];
      }
    }
  });

  // Update the "Add Game" button text
  const addGameBtn = document.querySelector('.add-game-btn');
  if (addGameBtn) {
    addGameBtn.textContent = translations[lang]['add-game'];
  }

  // Update search placeholder
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.placeholder = translations[lang]['search-placeholder'] || 'Search games...';
  }
  
  // Update the selected language flag
  const selectedLanguageImg = document.querySelector('#selectedLanguageFlag');
  selectedLanguageImg.src = `images/${lang === 'en' ? 'us' : 'fr'}-flag.jpg`;
  selectedLanguageImg.alt = lang === 'en' ? 'English' : 'Français';

  // Update dynamic content
  document.title = translations[lang]['site-title'];
  
  // Translate original categories for all games before reloading cards
  await translateAllOriginalCategories();
  
  loadGameCards(games, false); // Pass false to prevent resetting to page 1
  setupFilters();
  updateRemoveButtonText();
  updateGameDetails();

  const playerCountFilter = document.getElementById('playerCountFilter');
  updatePlayerCountDisplay(playerCountFilter.value);

  // Save language preference
  localStorage.setItem('language', lang);
}

async function translateAllOriginalCategories() {
  const gamePromises = Object.values(games).map(async (game) => {
    if (!game.originalCategory) {
      game.originalCategory = { en: game.category[0], fr: game.category[0] };
    }
    if (currentLanguage === 'fr' && (!game.originalCategory.fr || game.originalCategory.fr === game.originalCategory.en)) {
      game.originalCategory.fr = await translateText(game.originalCategory.en, 'FR');
    } else if (currentLanguage === 'en' && (!game.originalCategory.en || game.originalCategory.en === game.originalCategory.fr)) {
      game.originalCategory.en = await translateText(game.originalCategory.fr, 'EN');
    }
    return game;
  });

  await Promise.all(gamePromises);
}

function updateGameDetails() {
  const gameDetailsElements = gameDetails.querySelectorAll('[data-translate]');
  gameDetailsElements.forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translations[currentLanguage][key]) {
      element.textContent = translations[currentLanguage][key];
    }
  });
}

function updateRemoveButtonText() {
  const removeGameBtn = document.querySelector('.remove-game-btn');
  if (removeGameBtn) {
    removeGameBtn.textContent = isRemoveMode ? 
      translations[currentLanguage]['finish-removing'] : 
      translations[currentLanguage]['remove-game'];
  }
}

async function translateText(text, targetLang) {
  const cacheKey = `${text}-${targetLang}`;
  
  // Check if the translation is already in the cache
  if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
  }

  // If the text is already in the target language, return it as is
  if (targetLang.toUpperCase() === 'EN' && !containsNonLatinCharacters(text)) {
      return text;
  }

  const apiUrl = 'https://api-free.deepl.com/v2/translate';
  const sourceLang = 'EN';
  const formData = new URLSearchParams();
  formData.append('auth_key', DEEPL_API_KEY);
  formData.append('text', text);
  formData.append('source_lang', sourceLang);
  formData.append('target_lang', targetLang.toUpperCase());

  try {
      const response = await fetch(apiUrl, {
          method: 'POST',
          body: formData,
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.translations[0].text;

      // Store the translation in the cache
      translationCache[cacheKey] = translatedText;

      return translatedText;
  } catch (error) {
      console.error('Translation error:', error);
      // In case of an error, return the original text and don't cache
      return text;
  }
}

// Helper function to check if a string contains non-Latin characters
function containsNonLatinCharacters(text) {
  return /[^\u0000-\u007F]/.test(text);
}

async function preloadTranslations() {
  const commonTerms = [
    'players-label', 'play-time-label', 'category-label', 'author-label',
    'Quick', 'Medium', 'Long', 'Strategy', 'Party', 'Trivia', 'Cooperative', 'Bluffing'
  ];

  await Promise.all(commonTerms.map(async (term) => {
    const key = `${term}-${currentLanguage}`;
    if (!translationCache[key]) {
      translationCache[key] = await translateText(translations[currentLanguage][term] || term, currentLanguage.toUpperCase());
    }
  }));
}

let autocompleteTimeout;
const autocompleteResults = document.getElementById('autocompleteResults');
const gameNameInput = document.getElementById('gameName');

gameNameInput.addEventListener('input', handleAutocomplete);
autocompleteResults.addEventListener('click', handleAutocompleteSelection);

function handleAutocomplete() {
    clearTimeout(autocompleteTimeout);
    const query = gameNameInput.value.trim();
    
    if (query.length < 3) {
        autocompleteResults.innerHTML = '';
        return;
    }

    autocompleteTimeout = setTimeout(() => {
        fetchAutocompleteResults(query);
    }, 300);
}

async function fetchAutocompleteResults(query) {
    const apiUrl = `https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(query)}&type=boardgame`;

    try {
        const response = await fetch(apiUrl);
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        const items = xmlDoc.getElementsByTagName('item');
        const results = Array.from(items).slice(0, 5).map(item => {
            const name = item.querySelector('name').getAttribute('value');
            const yearPublished = item.querySelector('yearpublished')?.getAttribute('value') || 'N/A';
            const id = item.getAttribute('id');
            return { name, yearPublished, id };
        });

        displayAutocompleteResults(results);
    } catch (error) {
        console.error('Error fetching autocomplete results:', error);
    }
}

function displayAutocompleteResults(results) {
    autocompleteResults.innerHTML = '';
    results.forEach(result => {
        const div = document.createElement('div');
        div.className = 'autocomplete-item';
        div.textContent = `${result.name} (${result.yearPublished})`;
        div.dataset.id = result.id;
        div.addEventListener('click', () => selectAutocompleteItem(result.name, result.id));
        autocompleteResults.appendChild(div);
    });
}

function handleAutocompleteSelection(event) {
    if (event.target.classList.contains('autocomplete-item')) {
        const name = event.target.textContent.split(' (')[0];
        const id = event.target.dataset.id;
        selectAutocompleteItem(name, id);
    }
}

function selectAutocompleteItem(name, id) {
    gameNameInput.value = name;
    gameNameInput.dataset.id = id;
    autocompleteResults.innerHTML = '';
}

function showNotification(message, duration = 3000) {
  const notification = document.getElementById('notification');
  const notificationMessage = document.getElementById('notificationMessage');
  
  notificationMessage.textContent = message;
  notification.classList.remove('hidden');
  
  setTimeout(() => {
      notification.classList.add('hidden');
  }, duration);
}

let currentPage = 1;
let gamesPerPage = 8;

function updateGamesPerPage() {
    gamesPerPage = parseInt(document.getElementById('gamesPerPage').value);
    currentPage = 1;
    loadGameCards();
}

function updatePagination(totalPages) {
  const paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = '';

  if (totalPages > 1) {
    const createPageButton = (page, text = page) => {
      const button = document.createElement('button');
      button.textContent = text;
      button.addEventListener('click', () => changePage(page));
      button.disabled = currentPage === page;
      button.classList.add('page-button');
      if (currentPage === page) button.classList.add('active');
      return button;
    };

    const createEllipsis = () => {
      const span = document.createElement('span');
      span.textContent = '...';
      span.classList.add('ellipsis');
      return span;
    };

    // Previous button
    paginationContainer.appendChild(createPageButton(currentPage - 1, 'Previous'));

    // First page
    paginationContainer.appendChild(createPageButton(1));

    // Ellipsis and middle pages
    if (totalPages > 7) {
      if (currentPage > 3) {
        paginationContainer.appendChild(createEllipsis());
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        paginationContainer.appendChild(createPageButton(i));
      }

      if (currentPage < totalPages - 2) {
        paginationContainer.appendChild(createEllipsis());
      }
    } else {
      // If 7 or fewer pages, show all
      for (let i = 2; i < totalPages; i++) {
        paginationContainer.appendChild(createPageButton(i));
      }
    }

    // Last page
    if (totalPages > 1) {
      paginationContainer.appendChild(createPageButton(totalPages));
    }

    // Next button
    paginationContainer.appendChild(createPageButton(currentPage + 1, 'Next'));
  }
}

function changePage(newPage) {
  currentPage = newPage;
  loadGameCards();
}

function mapCategory(externalCategory) {
  for (const [internalCategory, externalCategories] of Object.entries(categoryMapping)) {
    if (externalCategories.some(cat => externalCategory.toLowerCase().includes(cat.toLowerCase()))) {
      return internalCategory;
    }
  }
  return 'Other';  // Default category if no match is found
}

// Function to save games to Firebase
function saveGamesToFirebase() {
  database.ref('games').set(games);
}

// Function to load games from Firebase
function loadGamesFromFirebase() {
  return database.ref('games').once('value')
    .then((snapshot) => {
      return snapshot.val() || {};  // Return an empty object if no data
    })
    .catch((error) => {
      console.error('Error loading games from Firebase:', error);
      return {};  // Return an empty object on error
    });
}

// Add this function to listen for real-time updates
function listenForUpdates() {
  database.ref('games').on('value', (snapshot) => {
    const updatedGames = snapshot.val();
    if (updatedGames) {
      games = updatedGames;
      loadGameCards();
    }
  });
}

function handleSearch() {
  applyFilters();
}

function cleanDescription(description) {
  // Replace HTML entities with their actual characters
  const entities = {
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&#10;': '\n',
    '&nbsp;': ' '
  };
  
  // Use a regular expression to match all HTML entities, including those with spaces
  let cleanedText = description.replace(/&(?:[a-zA-Z]+|#\d+);/g, match => {
    // Remove any spaces from the match
    const cleanMatch = match.replace(/\s/g, '');
    return entities[cleanMatch] || match;
  });
  
  // Replace multiple consecutive newlines with a single one
  cleanedText = cleanedText.replace(/\n{3,}/g, '\n\n');
  
  // Remove trailing newlines, semicolons, and whitespace in any order
  cleanedText = cleanedText.replace(/(?:\s*\n*;*\s*)*$/, '');
  
  // Trim leading and trailing whitespace
  cleanedText = cleanedText.trim();
  
  return cleanedText;
}

function showLoading() {
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  const spinner = document.createElement('div');
  spinner.className = 'loading-spinner';
  overlay.appendChild(spinner);
  document.body.appendChild(overlay);
}

function hideLoading() {
  const overlay = document.querySelector('.loading-overlay');
  if (overlay) {
    overlay.remove();
  }
}