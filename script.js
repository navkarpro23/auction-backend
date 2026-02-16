let socket = null;
let roomId = "";
let username = "";
let auctionPhase = "idle";
let currentBid = 0;
let minBid = 0;
let finalTeamsData = null; // ✅ store summary data

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
  document.getElementById("summaryScreen").classList.add("hidden"); // ✅ added
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
    const res = await fetch("http://127.0.0.1:8000/create-room");
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

  socket = new WebSocket(`ws://127.0.0.1:8000/ws/${roomId}/${username}`);
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
  }

  // Unsold
if (data.type === "unsold") {

  document.getElementById("status").innerText =
    `❌ ${data.player.name} went UNSOLD`;

  const unsoldList = document.getElementById("unsoldPlayers");

  const li = document.createElement("li");
  li.innerText = `${data.player.name} (${data.player.role})`;

  unsoldList.appendChild(li);
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
  const div = document.getElementById("upcomingPlayers");
  div.innerHTML = players.map(p =>
    `<div>${p.name} (${p.role})</div>`).join("");
}

/* ================= PLAYING 11 SELECTION & POSITIONS (COMBINED) ================= */

let allTeamsData = null;
let combinedPlaying11 = {}; // Store player -> position mapping

function showPlaying11Selection(teams) {
  allTeamsData = teams;
  document.getElementById("auctionScreen").classList.add("hidden");
  document.getElementById("playing11Screen").classList.remove("hidden");

  const playerList = document.getElementById("playerList");
  playerList.innerHTML = "";

  // Get current user's players
  if (teams[username] && teams[username].players) {
    teams[username].players.forEach(player => {
      const div = document.createElement("div");
      div.className = "player-position-item";

      div.innerHTML = `
        <div class="player-select-wrapper">
          <input type="checkbox" class="player-select" data-player="${player.name}" 
                 onchange="updateCombinedCount()">
          <span class="player-info">
            <strong>${player.name}</strong>
            <small>${player.role} - ₹${player.price.toFixed(2)} Cr</small>
          </span>
        </div>
        <div class="position-select-wrapper">
          <label>Position:</label>
          <select class="position-select" data-player="${player.name}" 
                  onchange="updateCombinedCount()" disabled>
            <option value="">--</option>
            ${Array.from({length: 11}, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("")}
          </select>
        </div>
      `;

      playerList.appendChild(div);
    });
  }
}

function updateCombinedCount() {
  const playerItems = document.querySelectorAll(".player-position-item");
  combinedPlaying11 = {};
  let selectedCount = 0;
  let positionCount = 0;
  const usedPositions = new Set();
  let allPositionsUnique = true;

  playerItems.forEach(item => {
    const checkbox = item.querySelector(".player-select");
    const positionSelect = item.querySelector(".position-select");
    const playerName = checkbox.dataset.player;

    if (checkbox.checked) {
      selectedCount++;
      positionSelect.disabled = false;

      const position = positionSelect.value;
      if (position) {
        const posNum = parseInt(position);
        
        // Check for duplicate positions
        if (usedPositions.has(posNum)) {
          allPositionsUnique = false;
        }
        usedPositions.add(posNum);
        
        combinedPlaying11[playerName] = posNum;
        positionCount++;
      }
    } else {
      positionSelect.disabled = true;
      positionSelect.value = "";
    }
  });

  document.getElementById("selectedCount").innerText = selectedCount;
  document.getElementById("positionCount").innerText = positionCount;

  // Enable submit button only if exactly 11 players selected with unique positions
  const submitBtn = document.getElementById("submitPlaying11");
  const canSubmit = selectedCount === 11 && positionCount === 11 && allPositionsUnique;
  
  submitBtn.disabled = !canSubmit;
  if (canSubmit) {
    submitBtn.classList.add("ready");
  } else {
    submitBtn.classList.remove("ready");
  }
}

function submitCombinedPlaying11() {
  // Re-validate from DOM on submit to ensure accuracy
  const playerItems = document.querySelectorAll(".player-position-item");
  const finalPlaying11 = {};
  const usedPositions = new Set();

  playerItems.forEach(item => {
    const checkbox = item.querySelector(".player-select");
    const positionSelect = item.querySelector(".position-select");
    const playerName = checkbox.dataset.player;

    if (checkbox.checked) {
      const position = positionSelect.value;
      if (position) {
        const posNum = parseInt(position);
        finalPlaying11[playerName] = posNum;
        usedPositions.add(posNum);
      }
    }
  });

  // Validate
  if (Object.keys(finalPlaying11).length !== 11) {
    alert("Please select exactly 11 players! Currently selected: " + Object.keys(finalPlaying11).length);
    return;
  }

  if (usedPositions.size !== 11) {
    alert("Please assign unique positions (1-11) to all 11 players! Unique positions: " + usedPositions.size);
    return;
  }

  // Send both playing 11 and positions to backend
  socket.send(JSON.stringify({
    type: "playing_11",
    players: Object.keys(finalPlaying11)
  }));

  socket.send(JSON.stringify({
    type: "playing_11_positions",
    positions: finalPlaying11
  }));

  // Show summary after submission
  document.getElementById("playing11Screen").classList.add("hidden");
  showSummaryScreenAfterPlaying11(allTeamsData);
}

function showSummaryScreenAfterPlaying11(teams) {
  document.getElementById("summaryScreen").classList.remove("hidden");

  const container = document.getElementById("summaryTeams");
  container.innerHTML = "";

  let cardIndex = 0;
  for (const [name, data] of Object.entries(teams)) {
    const card = document.createElement("div");
    card.className = "team-card";
    card.style.setProperty("--index", cardIndex);
    cardIndex++;

    const playing11Names = new Set(data.playing_11 || []);
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

    // Render playing 11 with positions and role indicators
    const playing11Html = playing11ByPosition.map(p => {
      const roleEmoji = {
        "Batsman": "🏏",
        "Bowler": "🎯",
        "All-Rounder": "⚡",
        "Wicket-Keeper": "🧤"
      }[p.role] || "🎖";
      
      return `<li class="playing11-player">
        <span class="position-badge">${p.position}</span> ⭐ ${p.name} ${roleEmoji} – ₹${p.price.toFixed(2)} Cr
      </li>`;
    }).join("");

    // Render bench players
    const benchPlayers = data.players.filter(p => !playing11Names.has(p.name));
    const benchHtml = benchPlayers.map(p => {
      const roleEmoji = {
        "Batsman": "🏏",
        "Bowler": "🎯",
        "All-Rounder": "⚡",
        "Wicket-Keeper": "🧤"
      }[p.role] || "🎖";
      
      return `<li class="bench-player">
        🪑 ${p.name} ${roleEmoji} – ₹${p.price.toFixed(2)} Cr
      </li>`;
    }).join("");

    const playersHtml = playing11Html + benchHtml || "<li>No players</li>";
    
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
        <strong>🏟️ Playing 11 & Bench Squad</strong>
        <small>💰 Spent: ₹${totalSpent} Cr (${spendPercentage}%) | Selected: ${Object.keys(positions).length}/11</small>
      </div>
      <ul class="team-players">
        ${playersHtml}
      </ul>
    `;
    container.appendChild(card);
  }
}

/* ================= SUMMARY SCREEN ================= */
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
