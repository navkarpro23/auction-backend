let socket = null;
let roomId = "";
let username = "";
let auctionPhase = "idle";
let currentBid = 0;
let minBid = 0;
let finalTeamsData = null; // ✅ store summary data
let upcomingPlayersList = []; // ✅ store upcoming players to remove when sold
let soldPlayerNames = new Set(); // ✅ PERMANENT tracking of sold players throughout auction

/* ================= AUDIO HELPERS ================= */

// ===== IPL INTRO AUTO START =====
window.addEventListener("load", () => {
  const intro = document.getElementById("iplIntro");

  setTimeout(() => {
    intro.classList.add("hide");
  }, 2800);

  setTimeout(() => {
    intro.style.display = "none";
  }, 3600);
});

function playSound(id) {
  const sound = document.getElementById(id);
  if (sound) {
    sound.pause();
    sound.currentTime = 0;
    sound.play().catch(e => console.log("Audio play blocked:", e));
  }
}

function stopSound(id) {
  const sound = document.getElementById(id);
  if (sound) {
    sound.pause();
    sound.currentTime = 0;
  }
}

/* ================= SCREEN HELPERS ================= */

function hideAllScreens() {
  document.getElementById("screen1").classList.add("hidden");
  document.getElementById("screenCreate").classList.add("hidden");
  document.getElementById("screenJoin").classList.add("hidden");
  document.getElementById("auctionScreen").classList.add("hidden");
  document.getElementById("playing11Screen").classList.add("hidden");
  document.getElementById("summaryScreen").classList.add("hidden");
}

function showCreate() {
  hideAllScreens();
  document.getElementById("screenCreate").classList.remove("hidden");
}

function showJoin() {
  hideAllScreens();
  document.getElementById("screenJoin").classList.remove("hidden");
}

/* ================= CREATE/JOIN ROOM ================= */

async function createRoom() {
  username = document.getElementById("createName").value.trim();
  if (!username) { alert("Enter your name"); return; }

  try {
    const res = await fetch("https://auction-app-semq.onrender.com/create-room");
    const data = await res.json();
    roomId = data.room_id;
    startAuction();
  } catch (err) { alert("Backend not running"); }
}

function joinRoom() {
  roomId = document.getElementById("joinRoomId").value.trim();
  username = document.getElementById("joinName").value.trim();
  if (!roomId || !username) { alert("Enter room code and name"); return; }
  startAuction();
}

function startAuction() {
  hideAllScreens();
  document.getElementById("auctionScreen").classList.remove("hidden");
  document.getElementById("roomCode").innerText = "Room Code: " + roomId;

  socket = new WebSocket("wss://auction-app-semq.onrender.com/ws/" + roomId + "/" + username);
  socket.onmessage = handleSocketMessage;
}

/* ================= SOCKET HANDLER ================= */

function handleSocketMessage(event) {
  const data = JSON.parse(event.data);
  const topBar = document.querySelector('.top-bar');
  const playerCard = document.querySelector('.player-card');

  // Admin Info
  if (data.type === "admin_info" && data.admin === data.you) {
    document.getElementById("adminPanel").style.display = "block";
  }

  // Team Update
  if (data.type === "team_update") {
    renderTeams(data.teams);
  }

  // New Player
  if (data.type === "new_player") {
    auctionPhase = "bidding";
    currentBid = data.bid;
    stopSound("timerTick");

    document.getElementById("player").innerText =
      `${data.player.name} (₹${data.player.base_price} Cr)`;

    document.getElementById("role").innerText = data.player.role;
    document.getElementById("status").innerText =
      `Current Bid: ₹${currentBid} Cr`;

    topBar.classList.remove('top-bar-urgent');
    playerCard.classList.remove('player-card-urgent');

    document.getElementById("bidBtn").disabled = false; // ✅ enable bidding

    updateNextBid();
  }

  // Timer
  if (data.type === "timer") {
    document.querySelectorAll(".timer")
      .forEach(el => el.innerText = `⏱️ ${data.time}s`);

    if (data.time <= 3 && data.time > 0) {
      playSound("timerTick");
      topBar.classList.add('top-bar-urgent');
      playerCard.classList.add('player-card-urgent');
    } else {
      stopSound("timerTick");
      topBar.classList.remove('top-bar-urgent');
      playerCard.classList.remove('player-card-urgent');
    }
  }

  // Bid Update
  if (data.type === "bid_update") {
    currentBid = data.amount;
    playSound("bidSound");

    topBar.classList.remove('top-bar-flash');
    void topBar.offsetWidth;
    topBar.classList.add('top-bar-flash');

    document.getElementById("status").innerText =
      `${data.bidder} bid ₹${currentBid} Cr`;

    updateNextBid();
  }

  // Sold
  if (data.type === "sold") {
    auctionPhase = "sold";
    stopSound("timerTick");
    playSound("soldSound");

    topBar.classList.remove('top-bar-urgent');
    playerCard.classList.remove('player-card-urgent');

    document.getElementById("status").innerText =
      `🏆 ${data.player.name} SOLD to ${data.buyer} for ₹${data.price} Cr`;

    renderTeams(data.teams);

    // Remove from unsold list if player was accidentally added there due to race condition
    const unsoldList = document.getElementById("unsoldPlayers");
    const unsoldItems = unsoldList.querySelectorAll("li");
    unsoldItems.forEach(item => {
      if (item.textContent.includes(data.player.name)) {
        item.remove();
      }
    });

    // Permanently track as sold to prevent re-adding
    soldPlayerNames.add(data.player.name);
    
    // Remove sold player from upcoming players list
    upcomingPlayersList = upcomingPlayersList.filter(p => p.name !== data.player.name);
    renderUpcomingPlayers(upcomingPlayersList);
  }

  // Unsold
if (data.type === "unsold") {

  document.getElementById("status").innerText =
    `❌ ${data.player.name} went UNSOLD`;

  const unsoldList = document.getElementById("unsoldPlayers");

  const li = document.createElement("li");
  li.innerText = `${data.player.name} (${data.player.role})`;

  unsoldList.appendChild(li);

  // Permanently track as unsold to prevent re-adding
  soldPlayerNames.add(data.player.name);

  // Remove unsold player from upcoming players list
  upcomingPlayersList = upcomingPlayersList.filter(p => p.name !== data.player.name);
  renderUpcomingPlayers(upcomingPlayersList);
}
if (data.type === "mode_update") {
  document.getElementById("status").innerText =
    `⏱ Auction Mode Changed: ${data.mode}`;
}


  // 🔥 AUCTION END (Updated Properly)
  if (data.type === "auction_end") {
    auctionPhase = "ended";
    stopSound("timerTick");

    // Show playing 11 selection for the user
    showPlaying11Selection(data.teams);
  }

  // WHEN ALL PLAYING 11 SUBMITTED
  if (data.type === "playing_11_complete") {
    stopSound("timerTick");
    // Hide playing 11 UI and show summary with teams
    try { document.getElementById("playing11Screen").classList.add("hidden"); } catch(e){}
    showSummaryScreenAfterPlaying11(data.teams || {});
  }

  // Chat
  if (data.type === "chat") {
    addChatMessage(data.user, data.message);
  }

  if (data.type === "upcoming_players") {
    renderUpcomingPlayers(data.players);
  }
}


/* ================= LOGIC ================= */

function getBidIncrement(bid) {
  if (bid < 5) return 0.20;
  if (bid < 10) return 0.25;
  return 0.50;
}

function updateNextBid() {
  const inc = getBidIncrement(currentBid);
  const next = (currentBid + inc).toFixed(2);
  document.getElementById("nextBid").innerText =
    `Next Bid: ₹${next} Cr (+₹${inc} Cr)`;
}

function adminAction(action) {
  socket.send(JSON.stringify({ type: "admin_action", action: action }));
}

function placeBid() {
  if (auctionPhase !== "bidding") return;
  const nextBid = +(currentBid + getBidIncrement(currentBid)).toFixed(2);
  socket.send(JSON.stringify({ type: "bid", amount: nextBid }));
}

function renderUpcomingPlayers(players) {
  // Filter out ALL sold/unsold players (permanent tracking) to prevent re-adding
  const filtered = players.filter(p => !soldPlayerNames.has(p.name));
  upcomingPlayersList = [...filtered]; // Store the filtered list
  const div = document.getElementById("upcomingPlayers");
  const countSpan = document.getElementById("upcomingCount");
  
  div.innerHTML = filtered.map(p =>
    `<div>${p.name} (${p.role})</div>`).join("");
  
  // Extra safeguard: remove any sold players that somehow made it into the DOM
  const playerDivs = div.querySelectorAll("div");
  playerDivs.forEach(playerDiv => {
    const playerName = playerDiv.textContent.split(" (")[0]; // Extract name before role
    if (soldPlayerNames.has(playerName)) {
      playerDiv.remove();
    }
  });
  
  // Update the count
  const count = div.querySelectorAll("div").length;
  countSpan.innerText = `(${count})`;
}

/* ================= PLAYING 11 SELECTION & POSITIONS (CLASSIC DRAG & DROP) ================= */

let allTeamsData = null;
let combinedPlaying11 = {}; // Store position -> player mapping
let draggedPlayerData = null;

function showPlaying11Selection(teams) {
  allTeamsData = teams;
  document.getElementById("auctionScreen").classList.add("hidden");
  document.getElementById("playing11Screen").classList.remove("hidden");

  const availablePlayersList = document.getElementById("availablePlayersList");
  availablePlayersList.innerHTML = "";

  // Get current user's players
  if (teams[username] && teams[username].players) {
    teams[username].players.forEach(player => {
      const playerCard = document.createElement("div");
      playerCard.className = "player-card draggable";
      playerCard.draggable = true;
      playerCard.dataset.playerName = player.name;
      playerCard.dataset.playerRole = player.role;
      playerCard.dataset.playerPrice = player.price;

      playerCard.innerHTML = `
        <div class="player-card-content">
          <strong>${player.name}</strong>
          <small>${player.role}</small>
          <small class="price">₹${player.price.toFixed(2)} Cr</small>
        </div>
      `;

      // Drag events
      playerCard.addEventListener("dragstart", handlePlayerDragStart);
      playerCard.addEventListener("dragend", handlePlayerDragEnd);

      availablePlayersList.appendChild(playerCard);
    });
  }

  // Setup drop zones
  document.querySelectorAll(".droppable-zone").forEach(zone => {
    zone.addEventListener("dragover", handleDragOver);
    zone.addEventListener("drop", handleDrop);
    zone.addEventListener("dragleave", handleDragLeave);
  });
}

function handlePlayerDragStart(e) {
  draggedPlayerData = {
    name: e.currentTarget.dataset.playerName,
    role: e.currentTarget.dataset.playerRole,
    price: parseFloat(e.currentTarget.dataset.playerPrice)
  };
  e.currentTarget.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
}

function handlePlayerDragEnd(e) {
  e.currentTarget.classList.remove("dragging");
  draggedPlayerData = null;
  document.querySelectorAll(".droppable-zone").forEach(zone => {
    zone.parentElement.classList.remove("drag-over");
  });
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  e.currentTarget.parentElement.classList.add("drag-over");
}

function handleDragLeave(e) {
  if (e.currentTarget === e.target) {
    e.currentTarget.parentElement.classList.remove("drag-over");
  }
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();

  const dropZone = e.currentTarget;
  const positionBox = dropZone.parentElement;
  const position = parseInt(positionBox.dataset.position);

  if (!draggedPlayerData) return;

  // If position already has a player, move it back to available players
  const existingPlayer = dropZone.querySelector(".dropped-player");
  if (existingPlayer) {
    const prevPlayerName = existingPlayer.dataset.playerName;
    const prevPlayerRole = existingPlayer.dataset.playerRole;
    const prevPlayerPrice = parseFloat(existingPlayer.dataset.playerPrice);
    
    // Add back to available players
    const availableList = document.getElementById("availablePlayersList");
    const playerCard = document.createElement("div");
    playerCard.className = "player-card draggable";
    playerCard.draggable = true;
    playerCard.dataset.playerName = prevPlayerName;
    playerCard.dataset.playerRole = prevPlayerRole;
    playerCard.dataset.playerPrice = prevPlayerPrice;
    playerCard.innerHTML = `
      <div class="player-card-content">
        <strong>${prevPlayerName}</strong>
        <small>${prevPlayerRole}</small>
        <small class="price">₹${prevPlayerPrice.toFixed(2)} Cr</small>
      </div>
    `;
    playerCard.addEventListener("dragstart", handlePlayerDragStart);
    playerCard.addEventListener("dragend", handlePlayerDragEnd);
    availableList.appendChild(playerCard);

    delete combinedPlaying11[position];
  }

  // Remove player from any other position
  Object.keys(combinedPlaying11).forEach(pos => {
    if (combinedPlaying11[pos] === draggedPlayerData.name) {
      const oldZone = document.querySelector(`.position-box[data-position="${pos}"] .droppable-zone`);
      if (oldZone) {
        oldZone.innerHTML = "";
      }
      delete combinedPlaying11[pos];
    }
  });

  // Add player to position
  combinedPlaying11[position] = draggedPlayerData.name;

  // Update UI
  dropZone.innerHTML = `
    <div class="dropped-player" data-player-name="${draggedPlayerData.name}" data-player-role="${draggedPlayerData.role}" data-player-price="${draggedPlayerData.price}">
      <div class="player-info-drop">
        <strong>${draggedPlayerData.name}</strong>
        <small>${draggedPlayerData.role}</small>
      </div>
      <button class="remove-btn" onclick="removeFromPosition(${position})">✕</button>
    </div>
  `;

  // Remove from available players
  const draggedCard = document.querySelector(`.player-card[data-player-name="${draggedPlayerData.name}"]`);
  if (draggedCard) {
    draggedCard.remove();
  }

  updatePlaying11Count();
  positionBox.classList.remove("drag-over");
}

function removeFromPosition(position) {
  const positionBox = document.querySelector(`.position-box[data-position="${position}"]`);
  const dropZone = positionBox.querySelector(".droppable-zone");
  const droppedPlayer = dropZone.querySelector(".dropped-player");

  if (droppedPlayer) {
    const playerName = droppedPlayer.dataset.playerName;
    const playerRole = droppedPlayer.dataset.playerRole;
    const playerPrice = parseFloat(droppedPlayer.dataset.playerPrice);

    // Add back to available players
    const availableList = document.getElementById("availablePlayersList");
    const playerCard = document.createElement("div");
    playerCard.className = "player-card draggable";
    playerCard.draggable = true;
    playerCard.dataset.playerName = playerName;
    playerCard.dataset.playerRole = playerRole;
    playerCard.dataset.playerPrice = playerPrice;
    playerCard.innerHTML = `
      <div class="player-card-content">
        <strong>${playerName}</strong>
        <small>${playerRole}</small>
        <small class="price">₹${playerPrice.toFixed(2)} Cr</small>
      </div>
    `;
    playerCard.addEventListener("dragstart", handlePlayerDragStart);
    playerCard.addEventListener("dragend", handlePlayerDragEnd);
    availableList.appendChild(playerCard);

    dropZone.innerHTML = "";
    delete combinedPlaying11[position];
    updatePlaying11Count();
  }
}

function updatePlaying11Count() {
  const selectedCount = Object.keys(combinedPlaying11).length;
  document.getElementById("selectedCount").innerText = selectedCount;
  
  const progressPercentage = (selectedCount / 11) * 100;
  document.getElementById("progressFill").style.width = progressPercentage + "%";

  const submitBtn = document.getElementById("submitPlaying11");
  submitBtn.disabled = selectedCount !== 11;
}

function submitCombinedPlaying11() {
  if (Object.keys(combinedPlaying11).length !== 11) {
    alert("Please select exactly 11 players!");
    return;
  }

  const finalPlaying11 = {};
  Object.entries(combinedPlaying11).forEach(([position, playerName]) => {
    finalPlaying11[playerName] = parseInt(position);
  });

  socket.send(JSON.stringify({
    type: "playing_11",
    players: Object.keys(finalPlaying11)
  }));

  socket.send(JSON.stringify({
    type: "playing_11_positions",
    positions: finalPlaying11
  }));

  // Update local allTeamsData with the playing 11 and positions before showing summary
  if (allTeamsData && allTeamsData[username]) {
    allTeamsData[username].playing_11 = Object.keys(finalPlaying11);
    allTeamsData[username].playing_11_positions = finalPlaying11;
  }

  console.log("Before showing summary, allTeamsData:", allTeamsData);
  console.log("Current user's team data:", allTeamsData[username]);
  
  document.getElementById("playing11Screen").classList.add("hidden");
  showSummaryScreenAfterPlaying11(allTeamsData);
}

function showSummaryScreenAfterPlaying11(teams) {
  document.getElementById("summaryScreen").classList.remove("hidden");

  const container = document.getElementById("summaryTeams");
  container.innerHTML = "";

  let cardIndex = 0;
  for (const [name, data] of Object.entries(teams)) {
    console.log(`Team ${name}:`, data); // Debug: log team data
    const card = document.createElement("div");
    card.className = "team-card";
    card.style.setProperty("--index", cardIndex);
    cardIndex++;

    const positions = data.playing_11_positions || {};

    // Create a sorted list of playing 11 by position
    const playing11ByPosition = [];
    for (let pos = 1; pos <= 11; pos++) {
      for (const [playerName, playerPos] of Object.entries(positions)) {
        if (playerPos === pos) {
          const player = data.players.find(p => p.name === playerName);
          if (player) {
            playing11ByPosition.push({
              position: pos,
              name: player.name,
              role: player.role,
              price: player.price
            });
          }
        }
      }
    }

    // Render only playing 11 with positions and role indicators
    const playing11Html = playing11ByPosition.map(p => {
      const roleEmoji = {
        "Batsman": "🏏",
        "Batter": "🏏",
        "Bowler": "🎯",
        "All-Rounder": "⚡",
        "Wicket-Keeper": "🧤"
      }[p.role] || "🎖";
      
      return `<li class="playing11-player">
        <span class="position-badge">${p.position}</span> ⭐ ${p.name} ${roleEmoji} – ₹${p.price.toFixed(2)} Cr
      </li>`;
    }).join("");

    const playersHtml = playing11Html || "<li>No playing 11 selected</li>";
    
    const totalSpent = (50 - data.purse).toFixed(2);
    const spendPercentage = ((totalSpent / 50) * 100).toFixed(0);

    card.innerHTML = `
      <div class="team-header">
        <div>
          <span class="team-name">${name}</span>
        </div>
        <div>
          <span class="team-purse">₹${data.purse.toFixed(2)} Cr Remaining</span>
        </div>
      </div>
      <div class="playing11-label">
        <strong>🏟️ Playing 11</strong>
        <small>💰 Spent: ₹${totalSpent} Cr (${spendPercentage}%) | Selected: ${Object.keys(positions).length}/11</small>
      </div>
      <ul class="team-players">
        ${playersHtml}
      </ul>
    `;
    container.appendChild(card);
  }
}


/* ================= TEAM RENDER ================= */
function showSummaryScreen(teams) {
  document.getElementById("auctionScreen").classList.add("hidden");
  document.getElementById("summaryScreen").classList.remove("hidden");

  const container = document.getElementById("summaryTeams");
  container.innerHTML = "";

  for (const [name, data] of Object.entries(teams)) {
    const card = document.createElement("div");
    card.className = "team-card";
    card.innerHTML = `
      <div class="team-header">
        <span class="team-name">${name}</span>
        <span class="team-purse">₹${data.purse.toFixed(2)} Cr</span>
      </div>
      <ul class="team-players">
        ${data.players.map(p => `<li>${p.name} – ₹${p.price.toFixed(2)} Cr</li>`).join("") || "<li>No players</li>"}
      </ul>
    `;
    container.appendChild(card);
  }
}

/* ================= TEAM RENDER ================= */

function renderTeams(teams) {
  const container = document.getElementById("teams");
  container.innerHTML = "";

  for (const [name, data] of Object.entries(teams)) {
    const card = document.createElement("div");
    card.className = "team-card";

    card.innerHTML = `
      <div class="team-header">
        <span class="team-name">${name}</span>
        <span class="team-purse">₹${data.purse.toFixed(2)} Cr</span>
      </div>
      <ul class="team-players">
        ${data.players.map(p =>
          `<li>${p.name} – ₹${p.price.toFixed(2)}</li>`).join("")
          || "<li>No players</li>"
        }
      </ul>
    `;

    container.appendChild(card);
  }
}

/* ================= CHAT ================= */

function sendChat() {
  const input = document.getElementById("chatInput");
  const msg = input.value.trim();
  if (!msg || !socket) return;

  socket.send(JSON.stringify({
    type: "chat",
    user: username,
    message: msg
  }));

  input.value = "";
}

function addChatMessage(user, message) {
  const box = document.getElementById("chatMessages");
  const div = document.createElement("div");
  div.className = "chat-msg";

  const nameClass = user === username
    ? "chat-user chat-you"
    : "chat-user";

  div.innerHTML = `<span class="${nameClass}">${user}:</span> ${message}`;
  box.appendChild(div);

  box.scrollTop = box.scrollHeight;
}
