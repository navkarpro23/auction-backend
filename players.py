
#cd backend
#cdgit add
#python -m uvicorn main:app --reload

# ===== IPL OGs MODE - Legendary Players =====

ipl_ogs = [
    # Batting Legends
    {"id": 1, "name": "Sachin Tendulkar", "role": "Batsman", "base_price": 3, "Rankings": 72},
    {"id": 2, "name": "Ricky Ponting", "role": "Batsman", "base_price": 3, "Rankings": 65},
    {"id": 3, "name": "Jacques Kallis", "role": "All-Rounder", "base_price": 3, "Rankings": 86},
    {"id": 4, "name": "Kumar Sangakkara", "role": "Wicket-Keeper", "base_price": 3, "Rankings": 78},
    {"id": 5, "name": "Brian Lara", "role": "Batsman", "base_price": 3, "Rankings": 28},
    {"id": 6, "name": "Adam Gilchrist", "role": "Wicket-Keeper", "base_price": 3, "Rankings": 88},
    {"id": 7, "name": "Virender Sehwag", "role": "Batsman", "base_price": 2.5, "Rankings": 84},
    {"id": 8, "name": "Sourav Ganguly", "role": "Batsman", "base_price": 2.5, "Rankings": 70},
    {"id": 9, "name": "Yuvraj Singh", "role": "All-Rounder", "base_price": 2.5, "Rankings": 81},
    {"id": 10, "name": "Sanath Jayasuriya", "role": "All-Rounder", "base_price": 2.5, "Rankings": 74},

    # Bowling Legends
    {"id": 11, "name": "Shane Warne", "role": "Bowler", "base_price": 3, "Rankings": 85},
    {"id": 12, "name": "Brett Lee", "role": "Bowler", "base_price": 2.5, "Rankings": 76},
    {"id": 13, "name": "Lasith Malinga", "role": "Bowler", "base_price": 2.5, "Rankings": 93},
    {"id": 14, "name": "Wasim Akram", "role": "Bowler", "base_price": 3, "Rankings": 22},
    {"id": 15, "name": "Curtly Ambrose", "role": "Bowler", "base_price": 2.5, "Rankings": 0},
    {"id": 16, "name": "Muttiah Muralitharan", "role": "Bowler", "base_price": 3, "Rankings": 88},
    {"id": 17, "name": "Shaun Pollock", "role": "All-Rounder", "base_price": 2.5, "Rankings": 79},
    {"id": 18, "name": "Anil Kumble", "role": "Bowler", "base_price": 2.5, "Rankings": 83},
    {"id": 19, "name": "Javagal Srinath", "role": "Bowler", "base_price": 2, "Rankings": 0},
    {"id": 20, "name": "Zaheer Khan", "role": "Bowler", "base_price": 2, "Rankings": 80},

    # Modern IPL Legends
    {"id": 21, "name": "AB de Villiers", "role": "Batsman", "base_price": 3, "Rankings": 94},
    {"id": 22, "name": "Chris Gayle", "role": "Batsman", "base_price": 2.5, "Rankings": 96},
    {"id": 23, "name": "Dale Steyn", "role": "Bowler", "base_price": 2.5, "Rankings": 82},
    {"id": 24, "name": "Rohit Sharma", "role": "Batsman", "base_price": 3, "Rankings": 90},
    {"id": 25, "name": "Virat Kohli", "role": "Batsman", "base_price": 3, "Rankings": 97},
    {"id": 26, "name": "David Warner", "role": "Batsman", "base_price": 2.5, "Rankings": 95},
    {"id": 27, "name": "Steve Smith", "role": "Batsman", "base_price": 2.5, "Rankings": 83},
    {"id": 28, "name": "Kane Williamson", "role": "Batsman", "base_price": 2.5, "Rankings": 84},
    {"id": 29, "name": "Jasprit Bumrah", "role": "Bowler", "base_price": 2, "Rankings": 94},
    {"id": 30, "name": "Suresh Raina", "role": "Batsman", "base_price": 2, "Rankings": 89}
]


# ===== IPL 2026 MODE - Current & Future Players =====
ipl_2026 = [
{"id": 1, "name": "Aiden Markram", "role": "Batter", "base_price": 2.00, "Rankings": 88},

{"id": 2, "name": "Arshdeep Singh", "role": "Bowler", "base_price": 2.00, "Rankings": 89},

{"id": 3, "name": "Axar Patel", "role": "All-Rounder", "base_price": 2.00, "Rankings": 90},

{"id": 4, "name": "Bhuvneshwar Kumar", "role": "Bowler", "base_price": 2.00, "Rankings": 85},

{"id": 5, "name": "Hardik Pandya", "role": "All-Rounder", "base_price": 2.00, "Rankings": 94},

{"id": 6, "name": "Heinrich Klaasen", "role": "Wicket-Keeper", "base_price": 2.00, "Rankings": 91},

{"id": 7, "name": "Ishan Kishan", "role": "Wicket-Keeper", "base_price": 2.00, "Rankings": 87},

{"id": 8, "name": "Jasprit Bumrah", "role": "Bowler", "base_price": 2.00, "Rankings": 95},

{"id": 9, "name": "Jofra Archer", "role": "Bowler", "base_price": 2.00, "Rankings": 86},

{"id": 10, "name": "Jos Buttler", "role": "Wicket-Keeper", "base_price": 2.00, "Rankings": 92},

{"id": 11, "name": "Josh Hazlewood", "role": "Bowler", "base_price": 2.00, "Rankings": 90},

{"id": 12, "name": "Kagiso Rabada", "role": "Bowler", "base_price": 2.00, "Rankings": 89},

{"id": 13, "name": "KL Rahul", "role": "Wicket-Keeper", "base_price": 2.00, "Rankings": 91},

{"id": 14, "name": "Kuldeep Yadav", "role": "Bowler", "base_price": 2.00, "Rankings": 92},

{"id": 15, "name": "Lockie Ferguson", "role": "Bowler", "base_price": 2.00, "Rankings": 88},

{"id": 16, "name": "Marco Jansen", "role": "All-Rounder", "base_price": 2.00, "Rankings": 87},

{"id": 17, "name": "Marcus Stoinis", "role": "All-Rounder", "base_price": 2.00, "Rankings": 86},

{"id": 18, "name": "Mitchell Marsh", "role": "All-Rounder", "base_price": 2.00, "Rankings": 85},

{"id": 19, "name": "Mitchell Starc", "role": "Bowler", "base_price": 2.00, "Rankings": 90},

{"id": 20, "name": "Mohammad Siraj", "role": "Bowler", "base_price": 2.00, "Rankings": 89},

{"id": 21, "name": "MS Dhoni", "role": "Wicket-Keeper", "base_price": 2.00, "Rankings": 92},

{"id": 22, "name": "Nicholas Pooran", "role": "Wicket-Keeper", "base_price": 2.00, "Rankings": 90},

{"id": 23, "name": "Noor Ahmad", "role": "Bowler", "base_price": 2.00, "Rankings": 88},

{"id": 24, "name": "Pat Cummins", "role": "Bowler", "base_price": 2.00, "Rankings": 91},

{"id": 25, "name": "Phil Salt", "role": "Wicket-Keeper", "base_price": 2.00, "Rankings": 89},

{"id": 26, "name": "Rashid Khan", "role": "Bowler", "base_price": 2.00, "Rankings": 96},

{"id": 27, "name": "Ravindra Jadeja", "role": "All-Rounder", "base_price": 2.00, "Rankings": 93},

{"id": 28, "name": "Rinku Singh", "role": "Batter", "base_price": 2.00, "Rankings": 88},

{"id": 29, "name": "Rishabh Pant", "role": "Wicket-Keeper", "base_price": 2.00, "Rankings": 91},

{"id": 30, "name": "Rohit Sharma", "role": "Batter", "base_price": 2.00, "Rankings": 89}
,{"id": 31, "name": "Ruturaj Gaikwad", "Rankings": 88},
{"id": 32, "name": "Sam Curran", "Rankings": 86},
{"id": 33, "name": "Sanju Samson", "Rankings": 87},
{"id": 34, "name": "Shimron Hetmyer", "Rankings": 85},
{"id": 35, "name": "Shivam Dube", "Rankings": 87},
{"id": 36, "name": "Shreyas Iyer", "Rankings": 88},
{"id": 37, "name": "Shubman Gill", "Rankings": 92},
{"id": 38, "name": "Sunil Narine", "Rankings": 90},
{"id": 39, "name": "Suryakumar Yadav", "Rankings": 91},
{"id": 40, "name": "Tim David", "Rankings": 84},
{"id": 41, "name": "Travis Head", "Rankings": 90},
{"id": 42, "name": "Trent Boult", "Rankings": 88},
{"id": 43, "name": "Varun Chakravarthy", "Rankings": 87},
{"id": 44, "name": "Virat Kohli", "Rankings": 93},
{"id": 45, "name": "Will Jacks", "Rankings": 86},
{"id": 46, "name": "Yashasvi Jaiswal", "Rankings": 90},
{"id": 47, "name": "Yuzvendra Chahal", "Rankings": 89},

{"id": 48, "name": "Abhishek Sharma", "Rankings": 88},
{"id": 49, "name": "Avesh Khan", "Rankings": 86},
{"id": 50, "name": "Azmatullah Omarzai", "Rankings": 84},
{"id": 51, "name": "Deepak Chahar", "Rankings": 85},
{"id": 52, "name": "Dhruv Jurel", "Rankings": 85},
{"id": 53, "name": "Glenn Phillips", "Rankings": 86},
{"id": 54, "name": "Harshal Patel", "Rankings": 85},
{"id": 55, "name": "Khaleel Ahmed", "Rankings": 84},
{"id": 56, "name": "Krunal Pandya", "Rankings": 87},
{"id": 57, "name": "Mayank Yadav", "Rankings": 87},
{"id": 58, "name": "Mitchell Santner", "Rankings": 85},
{"id": 59, "name": "Prasidh Krishna", "Rankings": 86},
{"id": 60, "name": "Rajat Patidar", "Rankings": 86},
{"id": 61, "name": "Riyan Parag", "Rankings": 88},
{"id": 62, "name": "Romario Shepherd", "Rankings": 84},
{"id": 63, "name": "Rovman Powell", "Rankings": 85},
{"id": 64, "name": "Sai Sudharsan", "Rankings": 89},
{"id": 65, "name": "Shardul Thakur", "Rankings": 85},
{"id": 66, "name": "Sherfane Rutherford", "Rankings": 84},
{"id": 67, "name": "T. Natarajan", "Rankings": 88},
{"id": 68, "name": "Tilak Varma", "Rankings": 89},
{"id": 69, "name": "Tristan Stubbs", "Rankings": 87},
{"id": 70, "name": "Washington Sundar", "Rankings": 86},

{"id": 71, "name": "Allah Ghazanfar", "Rankings": 84},
{"id": 72, "name": "Brydon Carse", "Rankings": 84},
{"id": 73, "name": "Corbin Bosch", "Rankings": 83},
{"id": 74, "name": "Dewald Brevis", "Rankings": 86},
{"id": 75, "name": "Dushmantha Chameera", "Rankings": 84},
{"id": 77, "name": "Jamie Overton", "Rankings": 84},
{"id": 78, "name": "Jaydev Unadkat", "Rankings": 83},
{"id": 79, "name": "Kamindu Mendis", "Rankings": 85},
{"id": 80, "name": "Matthew Breetzke", "Rankings": 84},
{"id": 81, "name": "Mitchell Owen", "Rankings": 83},
{"id": 82, "name": "Mukesh Kumar", "Rankings": 85},
{"id": 83, "name": "Nandre Burger", "Rankings": 84},
{"id": 84, "name": "Nathan Ellis", "Rankings": 85},
{"id": 85, "name": "Nitish Rana", "Rankings": 85},
{"id": 86, "name": "Nuwan Thushara", "Rankings": 86},
{"id": 87, "name": "Rahul Tewatia", "Rankings": 86},
{"id": 88, "name": "Ryan Rickelton", "Rankings": 84},
{"id": 89, "name": "Xavier Bartlett", "Rankings": 84},
{"id": 90, "name": "Ajinkya Rahane", "Rankings": 83},
{"id": 91, "name": "Devdutt Padikkal", "Rankings": 84},
{"id": 92, "name": "Harshit Rana", "Rankings": 87},
{"id": 93, "name": "Ishant Sharma", "Rankings": 82},
{"id": 94, "name": "Jayant Yadav", "Rankings": 82},
{"id": 95, "name": "Jitesh Sharma", "Rankings": 85},
{"id": 96, "name": "Karun Nair", "Rankings": 82},
{"id": 97, "name": "Manish Pandey", "Rankings": 82},
{"id": 98, "name": "Nitish Kumar Reddy", "Rankings": 88},
{"id": 99, "name": "R. Sai Kishore", "Rankings": 85},
{"id": 100, "name": "Sandeep Sharma", "Rankings": 86}
,{"id": 101, "name": "Shahbaz Ahmed", "role": "All-Rounder", "base_price": 0.50, "Rankings": 85},
{"id": 102, "name": "Shahrukh Khan", "role": "Batter", "base_price": 0.50, "Rankings": 86},
{"id": 103, "name": "Tushar Deshpande", "role": "Bowler", "base_price": 0.50, "Rankings": 87},
{"id": 104, "name": "Umran Malik", "role": "Bowler", "base_price": 0.50, "Rankings": 85},
{"id": 105, "name": "Yash Dayal", "role": "Bowler", "base_price": 0.50, "Rankings": 86},

{"id": 106, "name": "Cameron Green", "role": "Batter", "base_price": 2.00, "Rankings": 89},
{"id": 107, "name": "David Miller", "role": "Batter", "base_price": 2.00, "Rankings": 92},
{"id": 108, "name": "Devon Conway", "role": "Batter", "base_price": 2.00, "Rankings": 91},
{"id": 109, "name": "Jake Fraser-McGurk", "role": "Batter", "base_price": 2.00, "Rankings": 88},
{"id": 110, "name": "Gus Atkinson", "role": "All-Rounder", "base_price": 2.00, "Rankings": 83},

{"id": 111, "name": "Liam Livingstone", "role": "All-Rounder", "base_price": 2.00, "Rankings": 90},
{"id": 112, "name": "Rachin Ravindra", "role": "All-Rounder", "base_price": 2.00, "Rankings": 89},
{"id": 113, "name": "Venkatesh Iyer", "role": "All-Rounder", "base_price": 2.00, "Rankings": 90},
{"id": 114, "name": "Wanindu Hasaranga", "role": "All-Rounder", "base_price": 2.00, "Rankings": 91},

{"id": 115, "name": "Ben Duckett", "role": "Wicket-Keeper", "base_price": 2.00, "Rankings": 83},
{"id": 116, "name": "Finn Allen", "role": "Wicket-Keeper", "base_price": 2.00, "Rankings": 85},
{"id": 117, "name": "Jamie Smith", "role": "Wicket-Keeper", "base_price": 2.00, "Rankings": 82},

{"id": 118, "name": "Anrich Nortje", "role": "Bowler", "base_price": 2.00, "Rankings": 90},
{"id": 119, "name": "Gerald Coetzee", "role": "Bowler", "base_price": 2.00, "Rankings": 88},
{"id": 120, "name": "Jacob Duffy", "role": "Bowler", "base_price": 2.00, "Rankings": 82},
{"id": 121, "name": "Matheesha Pathirana", "role": "Bowler", "base_price": 2.00, "Rankings": 92},
{"id": 122, "name": "Matt Henry", "role": "Bowler", "base_price": 2.00, "Rankings": 86},

{"id": 123, "name": "Akeal Hosein", "role": "Bowler", "base_price": 2.00, "Rankings": 86},
{"id": 124, "name": "Maheesh Theekshana", "role": "Bowler", "base_price": 2.00, "Rankings": 89},
{"id": 125, "name": "Mujeeb Rahman", "role": "Bowler", "base_price": 2.00, "Rankings": 88},
{"id": 126, "name": "Ravi Bishnoi", "role": "Bowler", "base_price": 2.00, "Rankings": 90},

{"id": 127, "name": "Rahmanullah Gurbaz", "role": "Wicket-Keeper", "base_price": 1.50, "Rankings": 87},
{"id": 128, "name": "Spencer Johnson", "role": "Bowler", "base_price": 1.50, "Rankings": 84},
{"id": 129, "name": "Wiaan Mulder", "role": "All-Rounder", "base_price": 1.00, "Rankings": 82},

{"id": 130, "name": "Jonny Bairstow", "role": "Wicket-Keeper", "base_price": 1.00, "Rankings": 90},
{"id": 131, "name": "Quinton De Kock", "role": "Wicket-Keeper", "base_price": 1.00, "Rankings": 92},

{"id": 132, "name": "Akash Deep", "role": "Bowler", "base_price": 1.00, "Rankings": 85},
{"id": 133, "name": "Fazalhaq Farooqi", "role": "Bowler", "base_price": 1.00, "Rankings": 87},
{"id": 134, "name": "Rahul Chahar", "role": "Bowler", "base_price": 1.00, "Rankings": 86},

{"id": 135, "name": "Prithvi Shaw", "role": "Batter", "base_price": 0.75, "Rankings": 87},
{"id": 136, "name": "Sarfaraz Khan", "role": "Batter", "base_price": 0.75, "Rankings": 83},
{"id": 137, "name": "Deepak Hooda", "role": "All-Rounder", "base_price": 0.75, "Rankings": 85},
{"id": 138, "name": "K.S. Bharat", "role": "Wicket-Keeper", "base_price": 0.75, "Rankings": 82},
{"id": 139, "name": "Shivam Mavi", "role": "Bowler", "base_price": 0.75, "Rankings": 85},

{"id": 140, "name": "Mahipal Lomror", "role": "All-Rounder", "base_price": 0.50, "Rankings": 84},
{"id": 141, "name": "Rajvardhan Hangargekar", "role": "All-Rounder", "base_price": 0.40, "Rankings": 83},
{"id": 142, "name": "Abdul Samad", "role": "All-Rounder", "base_price": 0.30, "Rankings": 86},
{"id": 143, "name": "Abhishek Porel", "role": "Wicket-Keeper", "base_price": 0.30, "Rankings": 84},
{"id": 144, "name": "Angkrish Raghuvanshi", "role": "Batter", "base_price": 0.30, "Rankings": 83},
{"id": 145, "name": "Anshul Kamboj", "role": "Bowler", "base_price": 0.30, "Rankings": 82},
{"id": 146, "name": "Arjun Tendulkar", "role": "All-Rounder", "base_price": 0.30, "Rankings": 81},
{"id": 147, "name": "Ashutosh Sharma", "role": "All-Rounder", "base_price": 0.30, "Rankings": 88},
{"id": 148, "name": "Ayush Badoni", "role": "Batter", "base_price": 0.30, "Rankings": 88},
{"id": 149, "name": "Kwena Maphaka", "role": "Bowler", "base_price": 0.30, "Rankings": 83},
{"id": 150, "name": "Musheer Khan", "role": "All-Rounder", "base_price": 0.30, "Rankings": 82},
{"id": 151, "name": "Nehal Wadhera", "role": "Batter", "base_price": 0.30, "Rankings": 87},
{"id": 152, "name": "Ramandeep Singh", "role": "All-Rounder", "base_price": 0.30, "Rankings": 86},
{"id": 153, "name": "Sameer Rizvi", "role": "All-Rounder", "base_price": 0.30, "Rankings": 84},
{"id": 154, "name": "Shashank Singh", "role": "All-Rounder", "base_price": 0.30, "Rankings": 91},
{"id": 155, "name": "Suyash Sharma", "role": "Bowler", "base_price": 0.30, "Rankings": 87},
{"id": 156, "name": "Vaibhav Suryavanshi", "role": "Batter", "base_price": 0.30, "Rankings": 80},
{"id": 157, "name": "Yash Thakur", "role": "Bowler", "base_price": 0.30, "Rankings": 86},

{"id": 158, "name": "Steve Smith", "role": "Batter", "base_price": 2.00, "Rankings": 88},
{"id": 159, "name": "Daryl Mitchell", "role": "All-Rounder", "base_price": 2.00, "Rankings": 89},
{"id": 160, "name": "Jason Holder", "role": "All-Rounder", "base_price": 2.00, "Rankings": 90},
{"id": 161, "name": "Michael Bracewell", "role": "All-Rounder", "base_price": 2.00, "Rankings": 87},
{"id": 162, "name": "Sean Abbott", "role": "All-Rounder", "base_price": 2.00, "Rankings": 85},

{"id": 163, "name": "Josh Inglis", "role": "Wicket-Keeper", "base_price": 2.00, "Rankings": 87},
{"id": 164, "name": "Shai Hope", "role": "Wicket-Keeper", "base_price": 2.00, "Rankings": 85},
{"id": 165, "name": "Tom Banton", "role": "Wicket-Keeper", "base_price": 2.00, "Rankings": 84},

{"id": 166, "name": "Adam Milne", "role": "Bowler", "base_price": 2.00, "Rankings": 88},
{"id": 167, "name": "Kyle Jamieson", "role": "Bowler", "base_price": 2.00, "Rankings": 85},
{"id": 168, "name": "Lungi Ngidi", "role": "Bowler", "base_price": 2.00, "Rankings": 87},
{"id": 169, "name": "Mustafizur Rahman", "role": "Bowler", "base_price": 2.00, "Rankings": 90},
{"id": 170, "name": "William O’Rourke", "role": "Bowler", "base_price": 2.00, "Rankings": 82},

{"id": 171, "name": "Matthew Short", "role": "All-Rounder", "base_price": 1.50, "Rankings": 86},
{"id": 172, "name": "Tim Seifert", "role": "Wicket-Keeper", "base_price": 1.50, "Rankings": 82},
{"id": 173, "name": "Umesh Yadav", "role": "Bowler", "base_price": 1.50, "Rankings": 88},
{"id": 174, "name": "Saqib Mahmood", "role": "Bowler", "base_price": 1.50, "Rankings": 83},

{"id": 175, "name": "Reeza Hendricks", "role": "Batter", "base_price": 1.00, "Rankings": 84},
{"id": 176, "name": "Ben Dwarshuis", "role": "All-Rounder", "base_price": 1.00, "Rankings": 84},
{"id": 177, "name": "Daniel Sams", "role": "All-Rounder", "base_price": 1.00, "Rankings": 86},
{"id": 178, "name": "Kusal Perera", "role": "Wicket-Keeper", "base_price": 1.00, "Rankings": 85},
{"id": 179, "name": "Waqar Salamkheil", "role": "Bowler", "base_price": 1.00, "Rankings": 82},

{"id": 180, "name": "Mayank Agarwal", "role": "Batter", "base_price": 0.75, "Rankings": 88},
{"id": 181, "name": "Rahul Tripathi", "role": "Batter", "base_price": 0.75, "Rankings": 89},
{"id": 182, "name": "Chetan Sakariya", "role": "Bowler", "base_price": 0.75, "Rankings": 86},
{"id": 183, "name": "Mahipal Lomror", "role": "All-Rounder", "base_price": 0.50, "Rankings": 84},
{"id": 184, "name": "Karn Sharma", "role": "Bowler", "base_price": 0.50, "Rankings": 85},
{"id": 185, "name": "K.M. Asif", "role": "Bowler", "base_price": 0.40, "Rankings": 82},
{"id": 186, "name": "Rajvardhan Hangargekar", "role": "All-Rounder", "base_price": 0.40, "Rankings": 83},
{"id": 187, "name": "Auqib Dar", "role": "All-Rounder", "base_price": 0.30, "Rankings": 80},
{"id": 188, "name": "Kartik Sharma", "role": "Wicket-Keeper", "base_price": 0.30, "Rankings": 79},
{"id": 189, "name": "Prashant Veer", "role": "All-Rounder", "base_price": 0.30, "Rankings": 79},
{"id": 190, "name": "Kamlesh Nagarkoti", "role": "All-Rounder", "base_price": 0.30, "Rankings": 83},
{"id": 191, "name": "Vijay Shankar", "role": "All-Rounder", "base_price": 0.30, "Rankings": 87},
{"id": 192, "name": "Kartik Tyagi", "role": "Bowler", "base_price": 0.30, "Rankings": 85},
{"id": 193, "name": "Akash Madhwal", "role": "Bowler", "base_price": 0.30, "Rankings": 90},
{"id": 194, "name": "Vidwath Kaverappa", "role": "Bowler", "base_price": 0.30, "Rankings": 83}
]
