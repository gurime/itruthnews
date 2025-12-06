// Categories mapping
const categories = [
  { value: "dashboard", label: "Dashboard", table: "dashboard" },

  // News
  { value: "politics", label: "Politics", table: "politics" },
  { value: "economy", label: "Economy", table: "economy" },
  { value: "crime", label: "Crime", table: "crime" },
  { value: "climate", label: "Climate", table: "climate" },
  { value: "asia", label: "Asia", table: "asia" },
  { value: "europe", label: "Europe", table: "europe" },
  { value: "africa", label: "Africa", table: "africa" },
  { value: "middle_east", label: "Middle East", table: "middle_east" },
  { value: "americas", label: "Americas", table: "americas" },
  { value: "south_america", label: "South America", table: "south_america" },

  // Business
  { value: "stocks", label: "Stocks", table: "stocks" },
  { value: "us_markets", label: "U.S. Markets", table: "us_markets" },
  { value: "pre_markets", label: "Pre-Markets", table: "pre_markets" },
  { value: "crypto", label: "Cryptocurrency", table: "crypto" },
  { value: "futures", label: "Futures & Commodities", table: "futures" },
  { value: "bonds", label: "Bonds", table: "bonds" },
  { value: "etfs", label: "ETFs", table: "etfs" },
  { value: "mutual-funds", label: "Mutual Funds", table: "mutual_funds" },
  { value: "business-leaders", label: "Business Leaders", table: "business_leaders" },

  // Opinion
  { value: "columnists", label: "Columnists", table: "columnists" },
  { value: "guest_voices", label: "Guest Voices", table: "guest_voices" }, 
  { value: "editorials", label: "Editorials", table: "editorials" },
  { value: "letters", label: "Letters to the Editor", table: "letters" },
  { value: "editorial-board", label: "The Editorial Board", table: "editorial_board" },
  { value: "opinion_politics", label: "Politics", table: "opinion_politics" },
  { value: "opinion_world", label: "World", table: "opinion_world" },
  { value: "opinion_culture", label: "Culture", table: "opinion_culture" },
  { value: "opinion_economy", label: "Economy", table: "opinion_economy" },
  { value: "opinion_technology", label: "Technology", table: "opinion_technology" },
  { value: "opinion_climate", label: "Climate", table: "opinion_climate" },
  { value: "trending_voices", label: "Trending Voices", table: "trending_voices" },
  { value: "weekend-reads", label: "Weekend Reads", table: "weekend_reads" },

  // Lifestyle - Health & Wellness
  { value: "fitness", label: "Fitness", table: "fitness" },
  { value: "nutrition", label: "Nutrition", table: "nutrition" },
  { value: "mental_health", label: "Mental Health", table: "mental_health" },
  { value: "yoga_meditation", label: "Yoga & Meditation", table: "yoga_meditation" },
  { value: "sleep", label: "Sleep", table: "sleep" },
  
  // Lifestyle - Fashion & Beauty
  { value: "beauty", label: "Beauty", table: "beauty" },
  { value: "style", label: "Style", table: "style" },
  { value: "models", label: "Models", table: "models" },
  { value: "runway", label: "Runway", table: "runway" },
  { value: "designers", label: "Designers", table: "designers" },
  { value: "accessories", label: "Accessories", table: "accessories" },
  { value: "skincare", label: "Skincare", table: "skincare" },
  { value: "makeup", label: "Makeup", table: "makeup" },
  { value: "hair", label: "Hair", table: "hair" },
  
  // Lifestyle - Family & Relationships
  { value: "family", label: "Family", table: "family" },
  { value: "parenting", label: "Parenting", table: "parenting" },
  { value: "relationships", label: "Relationships", table: "relationships" },
  { value: "weddings", label: "Weddings", table: "weddings" },
  { value: "pregnancy", label: "Pregnancy & Baby", table: "pregnancy" },
  { value: "pets", label: "Pets", table: "pets" },
  
  // Lifestyle - Food & Dining
  { value: "recipes", label: "Recipes", table: "recipes" },
  { value: "restaurants", label: "Restaurants", table: "restaurants" },
  { value: "cooking_tips", label: "Cooking Tips", table: "cooking_tips" },
  { value: "wine_spirits", label: "Wine & Spirits", table: "wine_spirits" },
  { value: "food_news", label: "Food News", table: "food_news" },
  { value: "chefs", label: "Chefs", table: "chefs" },
  
  // Lifestyle - Home & Garden
  { value: "real_estate", label: "Real Estate", table: "real_estate" },
  { value: "home_design", label: "Home Design", table: "home_design" },
  { value: "interior_design", label: "Interior Design", table: "interior_design" },
  { value: "gardening", label: "Gardening", table: "gardening" },
  { value: "diy", label: "DIY & Home Improvement", table: "diy" },
  { value: "architecture", label: "Architecture", table: "architecture" },
  
  // Lifestyle - Travel
  { value: "destinations", label: "Destinations", table: "destinations" },
  { value: "travel_tips", label: "Travel Tips", table: "travel_tips" },
  { value: "luxury_travel", label: "Luxury Travel", table: "luxury_travel" },
  { value: "budget_travel", label: "Budget Travel", table: "budget_travel" },
  { value: "adventure_travel", label: "Adventure Travel", table: "adventure_travel" },
  { value: "hotels", label: "Hotels & Resorts", table: "hotels" },
  
  // Lifestyle - Other
  { value: "cars", label: "Cars & Automotive", table: "cars" },
  { value: "luxury", label: "Luxury Living", table: "luxury" },
  { value: "shopping", label: "Shopping & Deals", table: "shopping" },
  { value: "hobbies", label: "Hobbies & Crafts", table: "hobbies" },

  // Technology
  { value: "smartphones", label: "Smartphones", table: "smartphones" },
  { value: "laptops", label: "Laptops & Computers", table: "laptops" },
  { value: "wearables", label: "Wearables", table: "wearables" },
  { value: "smart_home", label: "Smart Home", table: "smart_home" },
  { value: "audio", label: "Audio & Headphones", table: "audio" },
  { value: "artificial_intelligence", label: "Artificial Intelligence", table: "ai" },
  { value: "startups", label: "Startups", table: "startups" },
  { value: "cybersecurity", label: "Cybersecurity", table: "cybersecurity" },
  { value: "internet", label: "Internet & Social Media", table: "internet" },
  { value: "silicon_valley", label: "Silicon Valley", table: "silicon_valley" },
  { value: "reviews", label: "Product Reviews", table: "reviews" },
  { value: "buying_guides", label: "Buying Guides", table: "buying_guides" },
  { value: "how_to", label: "How-To & Tips", table: "how-to" },
  { value: "gaming", label: "Gaming", table: "gaming" },
  { value: "pc_gaming", label: "PC Gaming", table: "pc-gaming" },
  { value: "consoles", label: "Consoles", table: "consoles" },
  { value: "esports", label: "Esports", table: "esports" },

  // Sports
  { value: "football", label: "Pro Football", table: "football" },
  { value: "basketball", label: "Pro Basketball", table: "basketball" },
  { value: "baseball", label: "Baseball", table: "baseball" },
  { value: "hockey", label: "Hockey", table: "hockey" },
  { value: "soccer", label: "Soccer", table: "soccer" },
  { value: "golf", label: "Golf", table: "golf" },
  { value: "tennis", label: "Tennis", table: "tennis" },
  { value: "college_football", label: "College Football", table: "college_football" },
  { value: "college_basketball", label: "College Basketball", table: "college_basketball" },
  { value: "world_cup", label: "World Cup", table: "world_cup" },
  { value: "olympics", label: "Olympics", table: "olympics" },
  { value: "premier_league", label: "Premier League", table: "premier_league" },
  { value: "boxing", label: "Boxing & MMA", table: "boxing" },
  { value: "auto_racing", label: "Auto Racing", table: "auto_racing" },
  { value: "track_and_field", label: "Track & Field", table: "track_and_field" },
  { value: "ufc", label: "UFC", table: "ufc" },
  { value: "wwe", label: "WWE", table: "wwe" },
  { value: "sports_columns", label: "Columns", table: "sports_columns" },
  { value: "sports_podcasts", label: "Podcasts", table: "sports_podcasts" },
  { value: "sports_photos", label: "Photos", table: "sports_photos" },

  // Arts & Culture
  { value: "theater", label: "Theater", table: "theater" },
  { value: "art_design", label: "Art & Design", table: "arts_design" },
  { value: "dance", label: "Dance", table: "dance" },
  { value: "books", label: "Books", table: "books" },
  { value: "music", label: "Music", table: "music" },

  // Screen
  { value: "movies", label: "Movies", table: "movies" },
  { value: "television", label: "Television", table: "television" },
  { value: "streaming", label: "Streaming", table: "streaming" },

  // Pop Culture
  { value: "pop_music", label: "Pop Music", table: "pop_music" },
  { value: "comedy", label: "Comedy", table: "comedy" },
  { value: "arts_podcasts", label: "Podcasts", table: "arts_podcasts" },
  { value: "best_of", label: "Best of Culture", table: "best_of" },

  // Features
  { value: "critics_picks", label: "Critics' Picks", table: "critic_picks" },
  { value: "arts_reviews", label: "Reviews", table: "arts_reviews" },
  { value: "what_to_watch", label: "What to Watch", table: "what_to_watch" },
  { value: "what_to_read", label: "What to Read", table: "what_to_read" }
];

// Special Coverage - Year-round events and seasonal content
const specialCoverage = {
  0: [ // January
    { href: "/new-year", label: "New Year's" },
    { href: "/mlk-day", label: "MLK Day" },
    { href: "/inauguration", label: "Inauguration" }, // Presidential years
    { href: "/australian-open", label: "Australian Open" },
    { href: "/sundance", label: "Sundance Film Festival" },
  ],
  1: [ // February
    { href: "/black-history", label: "Black History Month" },
    { href: "/valentines-day", label: "Valentine's Day" },
    { href: "/super-bowl", label: "Super Bowl" },
    { href: "/presidents-day", label: "Presidents Day" },
    { href: "/fashion-week", label: "Fashion Week" },
    { href: "/grammys", label: "Grammy Awards" },
  ],
  2: [ // March
    { href: "/womens-history", label: "Women's History Month" },
    { href: "/st-patricks-day", label: "St. Patrick's Day" },
    { href: "/march-madness", label: "March Madness" },
    { href: "/spring-fashion", label: "Spring Fashion" },
    { href: "/sxsw", label: "SXSW" },
  ],
  3: [ // April
    { href: "/earth-day", label: "Earth Day" },
    { href: "/easter", label: "Easter" },
    { href: "/passover", label: "Passover" },
    { href: "/tax-season", label: "Tax Season" },
    { href: "/masters", label: "The Masters" },
    { href: "/coachella", label: "Coachella" },
  ],
  4: [ // May
    { href: "/asian-pacific-heritage", label: "AAPI Heritage Month" },
    { href: "/mental-health-awareness", label: "Mental Health Awareness" },
    { href: "/mothers-day", label: "Mother's Day" },
    { href: "/memorial-day", label: "Memorial Day" },
    { href: "/kentucky-derby", label: "Kentucky Derby" },
    { href: "/cannes", label: "Cannes Film Festival" },
    { href: "/summer-travel", label: "Summer Travel" },
  ],
  5: [ // June
    { href: "/pride", label: "Pride Month" },
    { href: "/juneteenth", label: "Juneteenth" },
    { href: "/fathers-day", label: "Father's Day" },
    { href: "/summer-style", label: "Summer Style" },
    { href: "/wimbledon", label: "Wimbledon" },
    { href: "/us-open-golf", label: "U.S. Open Golf" },
  ],
  6: [ // July
    { href: "/independence-day", label: "Independence Day" },
    { href: "/summer-recipes", label: "Summer Recipes" },
    { href: "/tour-de-france", label: "Tour de France" },
    { href: "/mlb-all-star", label: "MLB All-Star Game" },
    { href: "/summer-movies", label: "Summer Blockbusters" },
  ],
  7: [ // August
    { href: "/back-to-school", label: "Back to School" },
    { href: "/us-open-tennis", label: "U.S. Open Tennis" },
    { href: "/fall-fashion", label: "Fall Fashion Preview" },
    { href: "/summer-olympics", label: "Summer Olympics" }, // Olympic years
  ],
  8: [ // September
    { href: "/labor-day", label: "Labor Day" },
    { href: "/hispanic-heritage", label: "Hispanic Heritage Month" },
    { href: "/fashion-week-fall", label: "Fall Fashion Week" },
    { href: "/nfl-season", label: "NFL Season" },
    { href: "/emmys", label: "Emmy Awards" },
    { href: "/venice-film", label: "Venice Film Festival" },
  ],
  9: [ // October
    { href: "/breast-cancer-awareness", label: "Breast Cancer Awareness" },
    { href: "/halloween", label: "Halloween" },
    { href: "/world-series", label: "World Series" },
    { href: "/fall-foliage", label: "Fall Foliage" },
    { href: "/oktoberfest", label: "Oktoberfest" },
  ],
  10: [ // November
    { href: "/native-american-heritage", label: "Native American Heritage Month" },
    { href: "/veterans-day", label: "Veterans Day" },
    { href: "/thanksgiving", label: "Thanksgiving" },
    { href: "/black-friday", label: "Black Friday" },
    { href: "/cyber-monday", label: "Cyber Monday" },
    { href: "/holiday-shopping", label: "Holiday Shopping" },
    { href: "/world-cup", label: "FIFA World Cup" }, // World Cup years
  ],
  11: [ // December
    { href: "/holidays", label: "Holiday Season" },
    { href: "/hanukkah", label: "Hanukkah" },
    { href: "/christmas", label: "Christmas" },
    { href: "/kwanzaa", label: "Kwanzaa" },
    { href: "/new-years-eve", label: "New Year's Eve" },
    { href: "/winter-travel", label: "Winter Travel" },
    { href: "/year-in-review", label: "Year in Review" },
    { href: "/gift-guides", label: "Gift Guides" },
    { href: "/bowl-season", label: "College Bowl Season" },
  ],
};

const opinionCategories = ['columnists', 'guest-voices', 'editorials', 'letters', 
  'editorial-board', 'opinion-politics', 'opinion-world', 'opinion-culture', 
  'opinion-economy', 'opinion-technology', 'opinion-climate', 'trending-voices', 
  'weekend-reads'];

export { categories, specialCoverage,opinionCategories };

