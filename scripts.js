const gameDetails = document.getElementById('gameDetails');
const gameCardContainer = document.getElementById('gameCardContainer');
const gameList = document.getElementById('gameList');
const filterContainer = document.getElementById('filterContainer');
const addGameModal = document.getElementById('addGameModal');

const games = {
  "Azul": {
    title: "Azul",
    image: "./images/azul.jpg",
    description: "Azul is a tile-drafting game where players score points by strategically placing colored tiles on their player boards.",
    playerCount: "2-4",
    playTime: "Medium",
    category: ["Strategy"],
    author: "Michael Kiesling"
  },
  "Abducktion": {
    title: "Abducktion",
    image: "./images/abducktion.jpg",
    description: "Abducktion is a wacky party game where players try to abduct unsuspecting citizens and collect their belongings.",
    playerCount: "3-8",
    playTime: "Quick",
    category: ["Party", "Bluffing"],
    author: "Evan & Josh's Very Special Games Co."
  },
  "Wingspan": {
    title: "Wingspan",
    image: "./images/wingspan.jpg",
    description: "Wingspan is a bird-themed engine-building game where players attract birds to their wildlife preserves and score points based on their bird collections.",
    playerCount: "1-5",
    playTime: "Medium",
    category: ["Strategy"],
    author: "Elizabeth Hargrave"
  }
};

document.addEventListener('DOMContentLoaded', function() {
  loadGameCards();
  setupFilters();

  document.querySelector('.random-game-btn').addEventListener('click', chooseRandomGame);
  
  const addGameBtn = document.querySelector('.add-game-btn');
  if (addGameBtn) {
    addGameBtn.addEventListener('click', openModal);
  } else {
    console.error('Add Game button not found');
  }

  const addGameModalBtn = document.querySelector('#addGameBtn');
  if (addGameModalBtn) {
    addGameModalBtn.addEventListener('click', addGame);
  } else {
    console.error('Add Game modal button not found');
  }

  const closeModalBtn = document.querySelector('#addGameModal .close-modal-btn');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  } else {
    console.error('Close modal button not found');
  }
});

function loadGameCards(filteredGames = games) {
  gameCardContainer.innerHTML = '';
  for (const gameTitle in filteredGames) {
    const game = filteredGames[gameTitle];
    addNewGameCard(game);
  }
}

function openGameDetails(gameId) {
  gameDetails.classList.add('open');
  const gameData = games[gameId];
  gameDetails.querySelector('.game-details-title').textContent = gameData.title;
  gameDetails.querySelector('.game-details-image').src = gameData.image;
  gameDetails.querySelector('.game-details-description').textContent = gameData.description;
  gameDetails.querySelector('.game-details-info .game-details-info-item:nth-child(1) .game-details-info-value').textContent = gameData.playerCount;
  gameDetails.querySelector('.game-details-info .game-details-info-item:nth-child(2) .game-details-info-value').textContent = gameData.playTime;
  gameDetails.querySelector('.game-details-info .game-details-info-item:nth-child(3) .game-details-info-value').textContent = gameData.category.join(', ');
  gameDetails.querySelector('.game-details-info .game-details-info-item:nth-child(4) .game-details-info-value').textContent = gameData.author;
}

function closeGameDetails() {
  gameDetails.classList.remove('open');
}

function addNewGameCard(gameData) {
  const newGameCard = `
    <div class="game-card" onclick="openGameDetails('${gameData.title}')">
      <img src="${gameData.image}" alt="${gameData.title}" class="w-full h-48 object-cover rounded-md">
      <div class="card-content px-4 py-2 rounded-b-md bg-gray-800 opacity-75">
        <h3 class="card-title text-white font-bold">${gameData.title}</h3>
        <div class="tags">
          ${gameData.category.map(cat => `<span class="tag">${cat}</span>`).join('')}
          <span class="tag">${gameData.playerCount} Players</span>
          <span class="tag">${gameData.playTime}</span>
        </div>
      </div>
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

async function addGame() {
  const gameName = document.getElementById('gameName').value;
  const gameAuthor = document.getElementById('gameAuthor').value;

  if (gameName && gameAuthor) {
    try {
      const gameData = await fetchGameInfo(gameName);
      if (gameData) {
        gameData.author = gameAuthor;
        games[gameData.title] = gameData;
        addNewGameCard(gameData);
        closeModal();
        applyFilters();  // Reapply filters after adding a new game
      } else {
        alert('Game not found. Please check the name and try again.');
      }
    } catch (error) {
      console.error('Error fetching game data:', error);
      alert('An error occurred while fetching game data. Please try again.');
    }
  } else {
    alert('Please enter both the game name and author.');
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
      const gameId = items[0].getAttribute('id'); // Get the first matching game
      return await fetchGameDetails(gameId); // Fetch details of that game
    }
    return null;
  } catch (error) {
    console.error('Error fetching game data:', error);
    return null;
  }
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
    const playingTime = xmlDoc.querySelector('playingtime').getAttribute('value');
    const category = xmlDoc.querySelector('link[type="boardgamecategory"]')?.getAttribute('value') || 'Unknown';
    const imageUrl = xmlDoc.querySelector('image')?.textContent || './images/placeholder.jpg'; // Use a placeholder image if not found

    return {
      title: name,
      image: imageUrl,
      description: description,
      playerCount: `${minPlayers}-${maxPlayers} Players`,
      playTime: `${playingTime} Minutes`,
      category: category,
    };
  } catch (error) {
    console.error('Error fetching game details:', error);
    return null;
  }
}

function openModal() {
  const modal = document.getElementById('addGameModal');
  if (modal) {
    modal.style.display = 'block';
  } else {
    console.error('Modal element not found');
  }
}

function closeModal() {
  const modal = document.getElementById('addGameModal');
  if (modal) {
    modal.style.display = 'none';
    // Clear input fields
    document.getElementById('gameName').value = '';
    document.getElementById('gameAuthor').value = '';
  } else {
    console.error('Modal element not found');
  }
}

function loadFilters() {
  const filterCategories = ['2 Players', '4 Players', '6 Players', 'Strategy', 'Party', 'Trivia'];
  filterCategories.forEach(category => {
    const newFilter = `
      <button class="filter" onclick="filterByCategory('${category}')">${category}</button>
    `;
    filterContainer.innerHTML += newFilter;
  });
}