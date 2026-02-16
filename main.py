from fastapi import FastAPI, WebSocket
import random, string, asyncio, os, sys
from players import ipl_ogs, ipl_2026
from auction import AuctionRoom

from fastapi.middleware.cors import CORSMiddleware
auction_room = AuctionRoom()
auction_room.all_players = players
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rooms = {}

@app.get("/")
def home():
    return {"status": "Auction API Running"}

def generate_room_id():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@app.get("/create-room")
def create_room():
    room_id = generate_room_id()
    
    # Default to IPL 2026 mode
    shuffled_players = ipl_2026.copy()
    random.shuffle(shuffled_players)

    room = AuctionRoom()
    room.players = shuffled_players
    room.connections = []
    room.timer_task = None
    room.ended = False
    room.timer_duration = 10
    room.mode = "2026"
    room.mode_name = "IPL 2026 Mock Auction"

    rooms[room_id] = room
    return {"room_id": room_id}

async def broadcast(room, data):
    for conn in list(room.connections):
        try:
            await conn.send_json(data)
        except:
            room.connections.remove(conn)


# ✅ NEW: Proper Auction End Function
async def force_end_auction(room_id):
    room = rooms.get(room_id)
    if not room or room.auction_ended:
        return

    room.auction_ended = True
    room.ended = True

    if room.timer_task:
        room.timer_task.cancel()

    await broadcast(room, {
        "type": "auction_end",
        "teams": room.serialize_teams()
    })





async def start_next_player(room_id):
    room = rooms.get(room_id)
    if not room or room.ended or room.auction_ended:
        return

    if not room.players:
        # No players left — end auction
        await force_end_auction(room_id)
        return

    player = random.choice(room.players)
    room.players.remove(player)

    room.current_player = player
    room.highest_bid = player["base_price"]
    room.highest_bidder = None
    room.min_bid = player["base_price"]
    room.timer = room.timer_duration


    await broadcast(room, {
        "type": "new_player",
        "player": player,
        "bid": room.min_bid
    })

    await broadcast(room, {
        "type": "upcoming_players",
        "players": [
            {"name": p["name"], "role": p["role"]}
            for p in room.players
        ]
    })

    if room.timer_task:
        room.timer_task.cancel()

    room.timer_task = asyncio.create_task(auction_timer(room_id))


async def auction_timer(room_id):
    room = rooms.get(room_id)
    if not room or room.auction_ended:
        return

    try:
        while room.timer > 0:
            if room.paused or room.auction_ended:
                await asyncio.sleep(1)
                continue

            await broadcast(room, {"type": "timer", "time": room.timer})
            await asyncio.sleep(1)
            room.timer -= 1

        if room.auction_ended:
            return

        if room.highest_bidder is None:
            room.players.append(room.current_player)
            await broadcast(room, {
                "type": "unsold",
                "player": room.current_player
            })
        else:
            buyer = room.highest_bidder
            price = room.highest_bid
            player = room.current_player

            room.sell_player()

            await broadcast(room, {
                "type": "sold",
                "player": player,
                "price": price,
                "buyer": buyer,
                "teams": room.serialize_teams()
            })

        await asyncio.sleep(2)
        await start_next_player(room_id)

    except asyncio.CancelledError:
        pass


async def reset_timer(room_id):
    room = rooms.get(room_id)
    if room and room.timer_task:
        room.timer_task.cancel()
        room.timer = room.timer_duration

        room.timer_task = asyncio.create_task(auction_timer(room_id))


@app.websocket("/ws/{room_id}/{username}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, username: str):
    await websocket.accept()

    if room_id not in rooms:
        await websocket.close()
        return

    room = rooms[room_id]
    room.connections.append(websocket)
    room.add_team(username)

    if room.admin is None:
        room.set_admin(username)

    await websocket.send_json({
        "type": "admin_info",
        "admin": room.admin,
        "you": username
    })

    await websocket.send_json({
        "type": "team_update",
        "teams": room.serialize_teams()
    })

    try:
        while True:
            data = await websocket.receive_json()
            # ✅ SET AUCTION MODE (Admin only, before start)
            if data["type"] == "set_mode" and username == room.admin and not room.started:
                mode = data.get("mode", "2026")
                mode_name = data.get("mode_name", "IPL 2026 Mock Auction")
                
                # Load appropriate player list based on mode
                if mode == "ogs":
                    shuffled_players = ipl_ogs.copy()
                    room.mode = "ogs"
                    room.mode_name = "IPL OGs Auction"
                    room.all_players = ipl_ogs   # ✅ ADD THIS
                else:
                    shuffled_players = ipl_2026.copy()
                    room.mode = "2026"
                    room.mode_name = "IPL 2026 Mock Auction"
                    room.all_players = ipl_2026  # ✅ ADD THIS

                random.shuffle(shuffled_players)
                room.players = shuffled_players
                
                await broadcast(room, {
                    "type": "mode_update",
                    "mode": f"Mode: {room.mode_name}"
                })
            # ✅ ADMIN CONTROLS
            elif data["type"] == "admin_action" and username == room.admin:

                if data["action"] == "start" and not room.started:
                    room.started = True
                    await start_next_player(room_id)

                elif data["action"] == "pause":
                    room.paused = True

                elif data["action"] == "resume":
                    room.paused = False

                elif data["action"] == "skip":
                    if room.timer_task:
                        room.timer_task.cancel()
                    await start_next_player(room_id)
                    
                elif data["action"] == "rapid":
                    room.timer_duration = 5
                    await broadcast(room, {
                        "type": "mode_update",
                        "mode": "Rapid (5s)"
                    })

                elif data["action"] == "normal":
                    room.timer_duration = 10
                    await broadcast(room, {
                        "type": "mode_update",
                        "mode": "Normal (10s)"
                    })


                # ✅ NEW END AUCTION ACTION
                elif data["action"] == "end":
                    await force_end_auction(room_id)

            # ✅ BIDDING
            elif data["type"] == "bid":
                if not room.started or room.current_player is None or room.auction_ended:
                    continue

                amount = float(data["amount"])
                team = room.teams[username]

                if room.highest_bidder == username:
                    continue

                if amount <= room.highest_bid:
                    continue

                if amount > team.purse:
                    continue

                room.place_bid(username, amount)
                room.min_bid = amount
                await reset_timer(room_id)

                await broadcast(room, {
                    "type": "bid_update",
                    "amount": amount,
                    "bidder": username
                })

            # ✅ CHAT
            elif data["type"] == "chat":
                message = data.get("message", "").strip()

                if not message:
                    continue

                await broadcast(room, {
                    "type": "chat",
                    "user": username,
                    "message": message
                })

            # ✅ PLAYING 11 SELECTION
            elif data["type"] == "playing_11":
                
                playing_11 = data.get("players", [])
                print("PLAYING 11 RECEIVED:", playing_11)

                # Validate that playing_11 has exactly 11 players
                if len(playing_11) == 11:
                    room.set_playing_11(username, playing_11)
                    
                    # Broadcast updated teams
                    await broadcast(room, {
                        "type": "team_update",
                        "teams": room.serialize_teams()
                    })
                    # If ALL teams have submitted their playing 11, notify clients
                    try:
                        all_submitted = all(len(t.playing_11) == 11 for t in room.teams.values())
                    except Exception:
                        all_submitted = False

                    if all_submitted:
                        await broadcast(room, {
                            "type": "playing_11_complete",
                            "teams": room.serialize_teams()
                        })

            # ✅ PLAYING 11 POSITIONS
            elif data["type"] == "playing_11_positions":
                positions = data.get("positions", {})
                
                # Validate that all 11 positions are filled
                if len(positions) == 11:
                    room.set_playing_11_positions(username, positions)
                    
                    # Broadcast updated teams
                    await broadcast(room, {
                        "type": "team_update",
                        "teams": room.serialize_teams()
                    })
                    # Also check if all teams have submitted playing 11 and broadcast completion
                    try:
                        all_submitted = all(len(t.playing_11) == 11 for t in room.teams.values())
                    except Exception:
                        all_submitted = False

                    if all_submitted:
                        await broadcast(room, {
                            "type": "playing_11_complete",
                            "teams": room.serialize_teams()
                        })

    except Exception:
        if websocket in room.connections:
            room.connections.remove(websocket)



