class Team:
    def __init__(self, name):
        self.name = name
        self.purse = 50  # 50 Cr
        self.players = []
        self.playing_11 = []  # ✅ Store selected playing 11
        self.playing_11_positions = {}  # ✅ Store player positions (1-11)


class AuctionRoom:
    def __init__(self):
        self.teams = {}
        self.current_player = None
        self.highest_bid = 0
        self.highest_bidder = None
        self.min_bid = 0
        self.timer = 10
        self.admin = None
        self.started = False
        self.paused = False
        self.auction_ended = False   # Auction end status

    # ✅ Set room creator as admin
    def set_admin(self, username):
        if self.admin is None:
            self.admin = username

    # ✅ Add team
    def add_team(self, username):
        if username not in self.teams:
            self.teams[username] = Team(username)

    # ✅ Place bid
    def place_bid(self, username, amount):
        # 🚫 Prevent bidding if auction ended
        if self.auction_ended:
            return

        if amount > self.highest_bid:
            self.highest_bid = amount
            self.highest_bidder = username
            self.timer = 10

    # ✅ Sell player
    def sell_player(self):
        if self.highest_bidder:
            team = self.teams[self.highest_bidder]
            team.players.append({
                "name": self.current_player["name"],
                "role": self.current_player["role"],
                "price": self.highest_bid
            })
            team.purse -= self.highest_bid

        self.highest_bid = 0
        self.highest_bidder = None
        self.timer = 10

    # ✅ End Auction (Admin Only – validation in main.py)
    def end_auction(self):
        if self.auction_ended:
            return

        self.auction_ended = True

    # ✅ Set playing 11 for a team
    def set_playing_11(self, username, playing_11):
        if username in self.teams:
            self.teams[username].playing_11 = playing_11

    # ✅ Set positions for playing 11
    def set_playing_11_positions(self, username, positions):
        if username in self.teams:
            self.teams[username].playing_11_positions = positions

    # ✅ Serialize teams for summary page
    def serialize_teams(self):
        return {
            name: {
                "purse": team.purse,
                "players": team.players,
                "playing_11": team.playing_11,
                "playing_11_positions": team.playing_11_positions
            }
            for name, team in self.teams.items()
        }
