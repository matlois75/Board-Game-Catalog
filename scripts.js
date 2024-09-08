const gameDetails = document.getElementById('gameDetails');
const gameCardContainer = document.getElementById('gameCardContainer');
const gameList = document.getElementById('gameList');
const filterContainer = document.getElementById('filterContainer');
const addGameModal = document.getElementById('addGameModal');
const removeGameBtn = document.querySelector('.remove-game-btn');
const addGameBtn = document.querySelector('.add-game-btn');
const closeModalBtn = document.querySelector('#addGameModal .close-modal-btn');
const translationCache = {};
let isRemoveMode = false;
let currentLanguage = 'en';

const games = {
  "Azul": {
    title: {
      en: "Azul",
      fr: "Azul"
    },
    image: "./images/azul.jpg",
    description: {
      en: "Azul is a tile-drafting game where players score points by strategically placing colored tiles on their player boards.",
      fr: "Azul est un jeu de pose de tuiles où les joueurs marquent des points en plaçant stratégiquement des tuiles colorées sur leurs plateaux."
    },
    playerCount: "2-4",
    playTime: "Medium",
    category: ["Strategy"],
    author: "Michael Kiesling"
  },
  "Abducktion": {
    title: {
      en: "Abducktion",
      fr: "Abducktion"
    },
    image: "./images/abducktion.jpg",
    description: {
      en: "Abducktion is a wacky party game where players try to abduct unsuspecting citizens and collect their belongings.",
      fr: "Abducktion est un jeu de société déjanté où les joueurs tentent d'enlever des citoyens sans méfiance et de collecter leurs biens."
    },
    playerCount: "3-8",
    playTime: "Quick",
    category: ["Party", "Bluffing"],
    author: "Evan & Josh's Very Special Games Co."
  },
  "Wingspan": {
    title: {
      en: "Wingspan",
      fr: "Wingspan"
    },
    image: "./images/wingspan.jpg",
    description: {
      en: "Wingspan is a bird-themed engine-building game where players attract birds to their wildlife preserves and score points based on their bird collections.",
      fr: "Wingspan est un jeu de construction de moteur sur le thème des oiseaux où les joueurs attirent des oiseaux dans leurs réserves naturelles et marquent des points en fonction de leurs collections d'oiseaux."
    },
    playerCount: "1-5",
    playTime: "Medium",
    category: ["Strategy"],
    author: "Elizabeth Hargrave"
  }
};

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
    'incomplete-info': 'Please enter both the game name and author.',
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
    "Long": "Long"
  },
  fr: {
    "site-title": "Les Jeux de Cathy",
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
    'incomplete-info': 'Veuillez saisir le nom du jeu et de l\'auteur.',
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
    "Long": "Long"
  }
};

document.addEventListener('DOMContentLoaded', async function() {
  if (!gameDetails) {
    return;
  }

  loadGameCards();
  setupFilters();

  document.querySelector('.random-game-btn').addEventListener('click', chooseRandomGame);
  
  const addGameBtn = document.querySelector('.add-game-btn');
  if (addGameBtn) {
    addGameBtn.addEventListener('click', openModal);
  }

  const addGameModalBtn = document.querySelector('#addGameBtn');
  if (addGameModalBtn) {
    addGameModalBtn.addEventListener('click', addGame);
  }

  const closeModalBtn = document.querySelector('#addGameModal .close-modal-btn');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Update this event listener
  document.addEventListener('click', handleGameDetailsClick);
  
  const closeGameDetailsBtn = gameDetails.querySelector('.close-game-details-btn');
  if (closeGameDetailsBtn) {
    closeGameDetailsBtn.addEventListener('click', closeGameDetails);
  }

  if (removeGameBtn) {
    removeGameBtn.addEventListener('click', toggleRemoveMode);
  }

  if (addGameBtn) {
    addGameBtn.addEventListener('click', openModal);
  }

  if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeModal);
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

  // Close dropdown when clicking outside
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

  // Initial language setup
  switchLanguage(currentLanguage);

  await preloadTranslations();
});

function loadGameCards(filteredGames = games) {
  gameCardContainer.innerHTML = '';
  for (const gameTitle in filteredGames) {
    const game = filteredGames[gameTitle];
    addNewGameCard(game);
  }
}

async function openGameDetails(event) {
  if (!isRemoveMode) {
    const gameCard = event.target.closest('.game-card');
    if (gameCard) {
      // Show loading indicator
      gameDetails.classList.add('loading');
      gameCard.classList.add('loading');
      gameDetails.classList.add('open');

      const gameId = gameCard.dataset.gameTitle;
      const gameData = Object.values(games).find(game => game.title[currentLanguage] === gameId);
      
      // Preload common translations if not already cached
      await preloadTranslations();

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

      // Update the UI with all translations ready
      gameDetails.querySelector('.game-details-title').textContent = gameData.title[currentLanguage];
      gameDetails.querySelector('.game-details-image').src = gameData.image;
      gameDetails.querySelector('.game-details-description').textContent = translatedDescription;
      
      gameDetails.querySelector('.game-details-info .game-details-info-item:nth-child(1) .game-details-info-label').textContent = playersLabel;
      gameDetails.querySelector('.game-details-info .game-details-info-item:nth-child(1) .game-details-info-value').textContent = gameData.playerCount;
      
      gameDetails.querySelector('.game-details-info .game-details-info-item:nth-child(2) .game-details-info-label').textContent = playTimeLabel;
      gameDetails.querySelector('.game-details-info .game-details-info-item:nth-child(2) .game-details-info-value').textContent = translatedPlayTime;
      
      gameDetails.querySelector('.game-details-info .game-details-info-item:nth-child(3) .game-details-info-label').textContent = categoryLabel;
      gameDetails.querySelector('.game-details-info .game-details-info-item:nth-child(3) .game-details-info-value').textContent = translatedCategories.join(', ');
      
      gameDetails.querySelector('.game-details-info .game-details-info-item:nth-child(4) .game-details-info-label').textContent = authorLabel;
      gameDetails.querySelector('.game-details-info .game-details-info-item:nth-child(4) .game-details-info-value').textContent = gameData.author;
      
      // Hide loading indicator
      gameDetails.classList.remove('loading');
      gameCard.classList.remove('loading');

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
  const newGameCard = `
    <div class="game-card" data-game-title="${gameData.title[currentLanguage]}">
      <img src="${gameData.image}" alt="${gameData.title[currentLanguage]}" class="w-full h-48 object-cover rounded-md">
      <div class="card-content px-4 py-2 rounded-b-md bg-gray-800 opacity-75">
        <h3 class="card-title text-white font-bold">${gameData.title[currentLanguage]}</h3>
        <div class="tags">
          ${gameData.category.map(cat => `<span class="tag">${translations[currentLanguage][cat] || cat}</span>`).join('')}
          <span class="tag">${gameData.playerCount} ${translations[currentLanguage]['players']}</span>
          <span class="tag">${translations[currentLanguage][gameData.playTime] || gameData.playTime}</span>
        </div>
      </div>
      <button class="remove-button" data-game-title="${gameData.title[currentLanguage]}">-</button>
    </div>
  `;
  gameCardContainer.innerHTML += newGameCard;
}

function setupFilters() {
  const playerCountFilter = document.getElementById('playerCountFilter');
  const playerCountValue = document.getElementById('playerCountValue');
  const gameTypeCheckboxes = document.querySelectorAll('input[name="gameType"]');
  const playTimeCheckboxes = document.querySelectorAll('input[name="playTime"]');
  const resetFiltersBtn = document.getElementById('resetFilters');

  playerCountFilter.addEventListener('input', function() {
    playerCountValue.textContent = this.value === '8' ? '8+' : this.value;
    applyFilters();
  });

  gameTypeCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
  });

  playTimeCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
  });

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
}

function applyFilters() {
  const playerCount = document.getElementById('playerCountFilter').value;
  const selectedGameTypes = Array.from(document.querySelectorAll('input[name="gameType"]:checked')).map(cb => cb.value);
  const selectedPlayTimes = Array.from(document.querySelectorAll('input[name="playTime"]:checked')).map(cb => cb.value);

  const filteredGames = Object.fromEntries(
    Object.entries(games).filter(([_, game]) => {
      const [minPlayers, maxPlayers] = game.playerCount.split('-').map(Number);
      const meetsPlayerCount = playerCount <= maxPlayers && (playerCount >= minPlayers || maxPlayers === '+');
      const meetsGameType = selectedGameTypes.length === 0 || game.category.some(cat => selectedGameTypes.includes(cat));
      const meetsPlayTime = selectedPlayTimes.length === 0 || selectedPlayTimes.includes(game.playTime);

      return meetsPlayerCount && meetsGameType && meetsPlayTime;
    })
  );

  loadGameCards(filteredGames);
}

function resetFilters() {
  document.getElementById('playerCountFilter').value = 1;
  document.getElementById('playerCountValue').textContent = '1';
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
  loadGameCards();
}

function chooseRandomGame() {
  const gameCards = gameCardContainer.querySelectorAll('.game-card');
  if (gameCards.length > 0) {
    const randomIndex = Math.floor(Math.random() * gameCards.length);
    gameCards[randomIndex].click();
  }
}

async function fetchGameInfo(gameName) {
  const apiUrl = `https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(gameName)}&type=boardgame`;

  try {
    const response = await fetch(apiUrl);
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const items = xmlDoc.getElementsByTagName('item');
    if (items.length > 0) {
      // Find the closest match
      let closestMatch = items[0];
      let closestScore = 0;
      
      for (let i = 0; i < items.length; i++) {
        const name = items[i].querySelector('name').getAttribute('value');
        const score = calculateSimilarity(gameName.toLowerCase(), name.toLowerCase());
        
        if (score > closestScore) {
          closestMatch = items[i];
          closestScore = score;
        }
      }

      const gameId = closestMatch.getAttribute('id');
      const gameData = await fetchGameDetails(gameId);
    
      // Translate the game data if the current language is French
      if (currentLanguage === 'fr') {
        try {
          gameData.title.fr = await translateText(gameData.title.en, 'FR');
          gameData.description.fr = await translateText(gameData.description.en, 'FR');
        } catch (error) {
          console.error('Translation error:', error);
          gameData.title.fr = gameData.title.en;
          gameData.description.fr = gameData.description.en;
        }
      } else {
        gameData.title.fr = gameData.title.en;
        gameData.description.fr = gameData.description.en;
      }
    
      return gameData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching game info:', error);
    return null;
  }
}

async function addGame() {
  const gameName = document.getElementById('gameName').value;
  const gameAuthor = document.getElementById('gameAuthor').value;

  if (gameName && gameAuthor) {
    try {
      const gameData = await fetchGameInfo(gameName);
      if (gameData) {
        gameData.author = gameAuthor;
        
        // Translate the author name if the current language is French
        if (currentLanguage === 'fr') {
          try {
            gameData.author = await translateText(gameData.author, 'FR');
          } catch (error) {
            console.error('Author translation error:', error);
            // Fallback to original author name if translation fails
          }
        }
        
        games[gameData.title.en] = gameData;
        addNewGameCard(gameData);
        closeModal();
        applyFilters();
      } else {
        alert(translations[currentLanguage]['game-not-found'] || 'Game not found. Please check the name and try again.');
      }
    } catch (error) {
      console.error('Error adding game:', error);
      alert(translations[currentLanguage]['fetch-error'] || 'An error occurred while fetching game data. Please try again.');
    }
  } else {
    alert(translations[currentLanguage]['incomplete-info'] || 'Please enter both the game name and author.');
  }
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
  addGameModal.style.display = 'none';
  // Remove the event listener when closing the modal
  document.removeEventListener('click', handleOutsideModalClick);
  // Clear input fields
  document.getElementById('gameName').value = '';
  document.getElementById('gameAuthor').value = '';
}

function toggleRemoveMode() {
  isRemoveMode = !isRemoveMode;
  gameCardContainer.classList.toggle('remove-mode', isRemoveMode);
  updateRemoveButtonText();

  const gameCards = gameCardContainer.querySelectorAll('.game-card');
  gameCards.forEach(card => {
    card.classList.toggle('remove-mode', isRemoveMode);
  });

  if (isRemoveMode) {
    // Add event listener to the container, not individual cards
    gameCardContainer.addEventListener('click', handleRemoveGame);
  } else {
    gameCardContainer.removeEventListener('click', handleRemoveGame);
  }
}

function handleRemoveGame(event) {
  const removeButton = event.target.closest('.remove-button');
  if (removeButton && isRemoveMode) {
    event.stopPropagation(); // Prevent opening game details
    const gameTitle = removeButton.dataset.gameTitle;
    
    // Find the game in the games object using the title in both languages
    const gameToRemove = Object.values(games).find(game => 
      game.title.en === gameTitle || game.title.fr === gameTitle
    );

    if (gameToRemove) {
      // Remove the game from the games object
      delete games[gameToRemove.title.en];
      
      // Remove the game card from the DOM
      const gameCard = removeButton.closest('.game-card');
      gameCard.remove();
    }
  }
}

function switchLanguage(lang) {
  currentLanguage = lang;
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translations[lang][key]) {
      if (element.tagName === 'INPUT' && element.type === 'text') {
        element.placeholder = translations[lang][key];
      } else {
        element.textContent = translations[lang][key];
      }
    }
  });
  
  // Update the selected language flag
  const selectedLanguageImg = document.querySelector('#selectedLanguageFlag');
  selectedLanguageImg.src = `images/${lang === 'en' ? 'us' : 'fr'}-flag.jpg`;
  selectedLanguageImg.alt = lang === 'en' ? 'English' : 'Français';

  // Update dynamic content
  document.title = translations[lang]['site-title'];
  loadGameCards(games);
  setupFilters(); // Call setupFilters here to update the filter options
  updateRemoveButtonText();
  updateGameDetails();

  // Save language preference
  localStorage.setItem('language', lang);
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