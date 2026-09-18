// Comprehensive Vector Boundary Polylines for Country & State/Province Administrative Borders
// Baked in at build time for high-performance 60FPS 3D vector rendering with zoom-dependent Level-of-Detail (LOD).

// 1. International Country Borders (Lines/Arcs between nations)
export const COUNTRY_BORDERS = [
  // --- NORTH AMERICA ---
  // US - Canada Border (49th parallel + Great Lakes corridor + Alaska border)
  [[-123.3, 49.0], [-117.0, 49.0], [-110.0, 49.0], [-104.0, 49.0], [-95.1, 49.0], [-95.1, 48.6], [-89.5, 48.0], [-84.3, 46.5], [-82.4, 43.0], [-79.0, 43.1], [-75.0, 45.0], [-71.5, 45.0], [-67.8, 47.4], [-67.0, 45.1]],
  // US (Alaska) - Canada (Yukon/BC)
  [[-141.0, 69.6], [-141.0, 60.3], [-135.0, 59.5], [-130.0, 55.9]],
  // US - Mexico Border
  [[-117.1, 32.5], [-114.7, 32.7], [-111.0, 31.3], [-108.2, 31.8], [-106.5, 31.8], [-104.5, 29.8], [-101.5, 29.8], [-99.5, 27.5], [-97.1, 25.9]],
  // Mexico - Guatemala / Belize
  [[-92.2, 14.5], [-91.0, 15.8], [-90.5, 17.8], [-89.1, 17.8], [-88.3, 18.5]],
  [[-89.1, 17.8], [-89.1, 15.9]],
  // Central America (Guatemala - Honduras - El Salvador - Nicaragua - Costa Rica - Panama)
  [[-89.2, 14.4], [-87.0, 13.0], [-87.0, 14.0]],
  [[-87.0, 13.0], [-85.6, 15.0]],
  [[-87.6, 13.0], [-85.0, 10.7], [-83.6, 10.9]],
  [[-83.6, 10.9], [-82.9, 8.3]],
  [[-82.9, 8.3], [-77.2, 8.1]],

  // --- SOUTH AMERICA ---
  // Colombia - Venezuela - Brazil - Ecuador - Peru - Bolivia - Chile - Argentina - Paraguay - Uruguay
  [[-77.2, 8.1], [-73.3, 9.2], [-71.3, 11.8]], // Colombia - Venezuela North
  [[-73.3, 9.2], [-67.5, 6.2], [-67.0, 1.9]], // Colombia - Venezuela South
  [[-77.5, 1.5], [-75.2, 0.1], [-70.0, -4.2]], // Colombia - Ecuador / Peru
  [[-80.2, -3.5], [-76.8, -4.0]], // Ecuador - Peru
  [[-70.0, -4.2], [-73.5, -9.0], [-69.5, -11.0], [-69.0, -16.0]], // Peru - Brazil / Bolivia
  [[-69.5, -11.0], [-65.3, -9.7], [-60.0, -16.0], [-58.0, -18.0]], // Bolivia - Brazil
  [[-60.0, 5.0], [-60.0, 1.0], [-52.0, 2.0]], // Guyana/Suriname/French Guiana - Brazil
  [[-69.0, -17.5], [-68.5, -22.0], [-67.0, -23.0]], // Chile - Bolivia
  [[-67.0, -23.0], [-70.0, -32.0], [-71.5, -42.0], [-73.0, -52.0], [-68.6, -55.0]], // Chile - Argentina Andes
  [[-62.0, -22.0], [-58.0, -20.0], [-57.5, -25.5], [-54.0, -25.5]], // Paraguay - Bolivia / Brazil
  [[-57.5, -25.5], [-58.5, -31.0], [-58.4, -34.0]], // Argentina - Paraguay / Uruguay
  [[-53.5, -31.0], [-53.5, -33.8]], // Brazil - Uruguay

  // --- EUROPE ---
  // Portugal - Spain
  [[-8.8, 41.9], [-6.2, 41.9], [-6.9, 39.7], [-7.5, 37.2]],
  // Spain - France (Pyrenees)
  [[-1.8, 43.4], [0.5, 42.8], [3.1, 42.4]],
  // France - UK (Maritime border / English Channel)
  [[-4.5, 48.5], [-1.0, 50.0], [1.5, 51.0]],
  // UK - Ireland
  [[-7.4, 55.0], [-7.5, 54.2], [-6.3, 54.1]],
  // France - Belgium - Netherlands - Germany
  [[2.5, 51.1], [4.8, 50.0], [6.0, 49.5]],
  [[3.4, 51.4], [6.0, 51.8], [7.1, 53.2]], // Netherlands - Germany
  [[6.0, 49.5], [8.0, 49.0], [7.5, 47.6]], // France - Germany (Rhine)
  // Germany - Switzerland - Austria
  [[7.6, 47.6], [8.6, 47.7], [9.5, 47.5]], // Swiss - Germany
  [[6.0, 46.2], [7.0, 46.0], [10.5, 46.5]], // France / Italy - Swiss
  [[7.0, 46.0], [12.0, 46.5], [13.7, 46.5]], // Italy - Austria / Slovenia
  // Germany - Poland - Czechia - Slovakia
  [[14.2, 53.9], [14.7, 52.0], [15.0, 50.9]], // Germany - Poland (Oder-Neisse)
  [[12.1, 50.3], [14.5, 50.9], [17.0, 50.1]], // Germany - Czechia - Poland
  [[15.0, 48.8], [17.0, 48.8], [18.8, 49.5]], // Czechia - Austria - Slovakia
  // Poland - Ukraine - Belarus - Baltic States - Russia
  [[23.5, 54.0], [23.5, 51.5], [24.0, 50.0]], // Poland - Belarus / Ukraine
  [[20.0, 54.4], [22.8, 54.4]], // Poland - Kaliningrad
  [[21.0, 55.3], [22.8, 54.4], [26.0, 56.0]], // Lithuania - Belarus / Latvia
  [[24.0, 58.0], [27.5, 58.0], [28.0, 59.4]], // Estonia - Latvia - Russia
  // Nordic borders (Norway - Sweden - Finland - Russia)
  [[12.0, 59.0], [12.5, 64.0], [20.5, 69.0]], // Norway - Sweden
  [[24.0, 65.8], [21.0, 69.0], [29.0, 69.0]], // Sweden - Finland - Norway
  [[28.0, 60.5], [30.0, 64.0], [30.0, 69.5]], // Finland - Russia
  // Ukraine - Russia - Black Sea
  [[32.0, 52.3], [35.0, 51.0], [38.5, 50.0], [40.0, 48.5], [38.0, 47.1]], // East Ukraine - Russia
  [[33.5, 46.0], [35.0, 46.0]], // Crimea Isthmus / Sea of Azov
  // Balkans & Southeastern Europe (Romania, Bulgaria, Greece, Turkey, Serbia, Hungary)
  [[20.0, 48.5], [22.8, 48.0], [27.0, 48.2], [30.0, 45.5]], // Hungary - Ukraine - Romania - Moldova
  [[22.8, 44.2], [28.6, 43.7]], // Romania - Bulgaria (Danube)
  [[23.0, 41.3], [26.0, 41.7]], // Bulgaria - Greece
  [[26.3, 41.7], [26.6, 40.8]], // Greece - Turkey (Evros)
  [[26.0, 42.0], [28.0, 42.0]], // Bulgaria - Turkey

  // --- MIDDLE EAST & NORTH AFRICA ---
  // Turkey - Syria - Iraq - Iran
  [[36.0, 36.0], [38.5, 36.8], [42.0, 37.3], [44.5, 37.1]], // Turkey - Syria / Iraq
  [[44.5, 37.1], [44.3, 39.7], [48.0, 39.0]], // Turkey / Iran - Armenia / Azerbaijan
  // Syria - Lebanon - Israel - Jordan
  [[35.8, 34.6], [36.0, 34.0], [35.5, 33.3]], // Syria - Lebanon
  [[35.1, 33.1], [35.6, 33.3], [35.8, 32.7], [35.5, 31.5], [35.0, 29.5]], // Israel / Palestine - Jordan / Syria
  [[34.2, 31.3], [34.5, 31.5], [34.9, 29.5]], // Gaza / Israel - Egypt (Sinai)
  // Iraq - Saudi Arabia - Kuwait - Iran
  [[39.0, 32.0], [42.0, 31.0], [46.5, 29.1]], // Iraq - Saudi Arabia
  [[46.5, 29.1], [48.0, 29.5], [48.4, 30.0]], // Kuwait - Saudi / Iraq
  [[45.0, 37.0], [46.0, 34.0], [48.0, 31.0], [48.6, 30.0]], // Iraq - Iran (Shatt al-Arab)
  // Arabian Peninsula (Saudi Arabia - Yemen - Oman - UAE - Qatar)
  [[50.8, 26.0], [51.5, 25.0]], // Qatar - Saudi
  [[51.5, 24.2], [55.5, 24.2], [56.3, 26.0]], // UAE - Saudi / Oman
  [[52.0, 19.0], [55.0, 20.0], [58.5, 22.0]], // Saudi - Oman
  [[43.0, 16.5], [47.0, 17.5], [52.0, 19.0]], // Saudi - Yemen
  [[52.0, 16.5], [52.0, 19.0]], // Yemen - Oman
  // North Africa (Egypt - Libya - Algeria - Morocco - Tunisia - Sudan)
  [[25.0, 31.5], [25.0, 22.0], [37.0, 22.0]], // Egypt - Libya / Sudan
  [[25.0, 22.0], [20.0, 22.0], [10.0, 22.0]], // Libya / Chad / Niger / Algeria
  [[11.5, 33.0], [9.5, 30.0], [8.0, 36.8]], // Tunisia - Libya / Algeria
  [[2.0, 35.0], [-2.0, 32.0], [-5.0, 29.0]], // Algeria - Morocco

  // --- ASIA & INDO-PACIFIC ---
  // Russia - Kazakhstan - Central Asia (Uzbekistan, Turkmenistan, Tajikistan, Kyrgyzstan)
  [[50.0, 54.0], [60.0, 55.0], [70.0, 54.0], [80.0, 51.0], [87.0, 49.0]], // Russia - Kazakhstan
  [[53.0, 42.0], [56.0, 41.0], [60.0, 38.0]], // Iran - Turkmenistan
  [[60.0, 38.0], [65.0, 35.0], [71.0, 37.0]], // Turkmenistan / Uzbekistan / Tajikistan - Afghanistan
  // Afghanistan - Pakistan (Durand Line)
  [[61.0, 31.0], [66.0, 30.0], [70.0, 33.0], [71.5, 35.5], [74.5, 37.0]],
  // Pakistan - India (International Border & LOC)
  [[68.2, 23.7], [70.5, 25.5], [72.0, 28.5], [74.5, 31.5], [74.8, 32.5], [74.2, 34.0], [77.0, 35.5]],
  // India - China (LAC / Himalaya), India - Nepal - Bhutan
  [[77.0, 35.5], [79.0, 33.0], [80.5, 31.0]], // Ladakh / Tibet
  [[80.5, 30.5], [84.0, 28.5], [88.0, 27.8]], // Nepal - India / China
  [[89.0, 27.5], [92.0, 27.8]], // Bhutan - India / China
  [[92.0, 27.8], [95.0, 28.5], [97.3, 28.0]], // Arunachal Pradesh / Tibet
  // India - Bangladesh
  [[88.0, 26.5], [89.0, 26.0], [89.8, 25.2], [92.0, 25.1], [92.3, 24.0], [91.2, 23.5], [89.0, 22.0]],
  // India - Myanmar
  [[97.3, 28.0], [95.0, 26.0], [93.5, 24.0], [92.5, 21.5]],
  // China - Russia / Mongolia
  [[87.5, 49.0], [100.0, 44.0], [115.0, 47.5], [119.0, 47.0]], // China - Mongolia South
  [[87.5, 49.0], [100.0, 51.5], [115.0, 50.0]], // Russia - Mongolia North
  [[120.0, 53.0], [125.0, 53.5], [130.0, 48.0], [135.0, 48.0], [131.0, 43.0]], // China - Russia (Amur/Ussuri)
  // China - North Korea (Yalu/Tumen Rivers) & Korea DMZ
  [[124.3, 40.0], [126.0, 41.5], [128.5, 42.0], [130.6, 42.4]], // China - North Korea
  [[126.0, 37.8], [128.5, 38.6]], // North Korea - South Korea (38th Parallel / DMZ)
  // Southeast Asia (Myanmar, Thailand, Laos, Cambodia, Vietnam, Malaysia, Indonesia)
  [[100.0, 21.5], [101.5, 21.0], [105.0, 22.5], [108.0, 21.5]], // China - Vietnam / Laos
  [[98.5, 17.0], [99.0, 14.0], [99.5, 10.0], [101.0, 6.0]], // Myanmar - Thailand
  [[100.5, 18.0], [104.0, 18.0], [105.5, 14.5]], // Thailand - Laos (Mekong)
  [[102.5, 12.0], [105.0, 14.0], [107.5, 14.0]], // Thailand - Cambodia
  [[105.0, 11.0], [106.5, 11.5], [107.5, 10.5]], // Cambodia - Vietnam
  [[100.2, 6.5], [102.0, 6.0]], // Thailand - Malaysia
  [[110.0, 1.5], [115.0, 4.0], [117.5, 4.2]], // Malaysia - Indonesia (Borneo / Kalimantan)
  [[141.0, -2.5], [141.0, -9.1]], // Indonesia - Papua New Guinea (141st meridian)

  // --- AFRICA ---
  // Sub-Saharan Africa major state boundaries
  [[3.0, 13.5], [14.0, 13.5], [14.5, 10.0], [8.5, 4.5]], // Nigeria - Niger / Chad / Cameroon
  [[12.0, -5.0], [18.0, -8.0], [24.0, -11.0], [24.0, -18.0]], // Angola - DRC - Zambia
  [[30.0, 3.5], [30.0, -1.0], [29.0, -4.5]], // DRC - Uganda - Rwanda - Burundi
  [[34.0, 4.5], [41.0, 4.0], [42.0, -1.5]], // Kenya - Ethiopia - Somalia
  [[20.0, -22.0], [20.0, -28.5], [25.0, -26.0], [29.0, -22.0], [32.0, -26.0]] // South Africa - Namibia / Botswana / Zimbabwe / Mozambique
];

// 2. State & Province Internal Boundaries (Level 2 Administrative Divisions)
export const STATE_BORDERS = [
  // --- UNITED STATES STATES ---
  // Pacific / West Coast
  [[-124.0, 46.2], [-117.0, 46.0]], // WA - OR (Columbia River)
  [[-124.2, 42.0], [-120.0, 42.0]], // OR - CA
  [[-120.0, 42.0], [-120.0, 39.0], [-114.6, 35.0], [-114.7, 32.7]], // CA - NV / AZ (Stateline & Colorado River)
  [[-117.0, 49.0], [-117.0, 46.0], [-116.0, 42.0]], // WA/OR - ID
  // Mountain West
  [[-114.0, 49.0], [-114.0, 44.5], [-111.0, 44.5], [-111.0, 42.0], [-114.0, 42.0], [-114.0, 37.0]], // ID / UT / NV
  [[-111.0, 45.0], [-104.0, 45.0]], // MT - WY
  [[-111.0, 41.0], [-104.0, 41.0]], // WY - UT / CO
  [[-109.0, 41.0], [-109.0, 37.0]], // UT - CO (Four Corners)
  [[-109.0, 37.0], [-109.0, 31.3]], // AZ - NM
  [[-109.0, 37.0], [-102.0, 37.0]], // CO - NM
  // Texas & South Central
  [[-106.5, 32.0], [-103.0, 32.0], [-103.0, 36.5], [-100.0, 36.5], [-100.0, 34.5], [-94.5, 33.5]], // NM/OK - TX
  [[-94.0, 33.5], [-94.0, 29.8]], // TX - LA (Sabine River)
  // Midwest & Great Plains
  [[-104.0, 49.0], [-104.0, 41.0]], // ND/SD/NE - MT/WY
  [[-104.0, 43.0], [-96.5, 43.0]], // ND - SD
  [[-104.0, 40.0], [-95.5, 40.0]], // NE - KS
  [[-103.0, 37.0], [-94.6, 37.0]], // KS - OK
  [[-96.5, 49.0], [-96.5, 43.5]], // MN - ND/SD (Red River)
  [[-92.0, 47.0], [-90.0, 42.5]], // MN/IA - WI (Mississippi River)
  [[-91.5, 40.5], [-91.5, 36.5], [-89.5, 36.5]], // IA/MO/AR - IL/KY/TN (Mississippi River)
  // East Coast & South
  [[-87.5, 41.7], [-84.8, 41.7]], // IL/MI - IN
  [[-84.8, 41.7], [-80.5, 41.7]], // MI - OH
  [[-85.0, 35.0], [-81.0, 35.0]], // TN - NC/GA
  [[-88.0, 35.0], [-88.0, 30.5]], // MS - AL
  [[-85.0, 31.0], [-82.0, 30.5]], // AL/GA - FL (31st parallel)
  [[-80.5, 42.0], [-80.5, 39.7], [-75.0, 39.7]], // PA (Mason-Dixon & boundaries)
  [[-79.8, 45.0], [-73.5, 45.0], [-73.5, 41.0]], // NY - VT/MA/CT

  // --- INDIA STATES & TERRITORIES ---
  // Northern Corridor (Ladakh, J&K, Himachal, Punjab, Haryana, Uttarakhand)
  [[74.0, 33.5], [76.5, 33.0], [77.5, 32.0]], // J&K - Ladakh - HP
  [[75.0, 31.5], [76.8, 30.5], [77.3, 28.6]], // Punjab - Haryana - Delhi
  [[77.5, 31.0], [79.5, 29.5], [80.5, 28.8]], // Uttarakhand - UP
  // Central & Western Hubs (Rajasthan, Gujarat, Maharashtra, MP)
  [[71.0, 27.5], [75.0, 28.0], [77.0, 27.0]], // Rajasthan - Haryana/UP
  [[70.0, 24.0], [73.5, 24.5], [75.0, 22.0]], // Gujarat - Rajasthan - MP
  [[73.0, 20.0], [76.0, 21.5], [79.0, 21.5]], // Gujarat/MP - Maharashtra
  [[77.0, 24.0], [80.0, 24.5], [82.0, 23.0]], // MP - UP / Chhattisgarh
  // Southern Peninsular (Karnataka, Tamil Nadu, Kerala, Andhra Pradesh, Telangana)
  [[74.5, 15.5], [77.0, 15.0], [78.5, 17.5]], // Goa/Karnataka - Maharashtra - Telangana
  [[77.0, 13.0], [79.5, 13.5]], // Karnataka - Andhra Pradesh
  [[76.0, 11.5], [78.0, 11.5], [79.8, 11.0]], // Kerala - Tamil Nadu - Karnataka
  [[78.0, 16.0], [80.5, 16.5]], // Telangana - Andhra Pradesh
  // Eastern & Northeastern (WB, Odisha, Bihar, Jharkhand, Assam)
  [[84.0, 27.0], [87.5, 25.5]], // Bihar - UP/WB
  [[83.5, 22.5], [86.0, 22.0], [87.0, 21.5]], // Jharkhand - Odisha - WB
  [[90.0, 26.5], [93.0, 26.5], [95.0, 27.5]], // Assam corridor

  // --- CANADIAN PROVINCES ---
  [[-120.0, 60.0], [-120.0, 49.0]], // British Columbia - Alberta
  [[-110.0, 60.0], [-110.0, 49.0]], // Alberta - Saskatchewan
  [[-102.0, 60.0], [-102.0, 49.0]], // Saskatchewan - Manitoba
  [[-95.0, 60.0], [-95.0, 49.0]], // Manitoba - Ontario
  [[-79.5, 52.0], [-79.5, 46.0]], // Ontario - Quebec

  // --- AUSTRALIAN STATES ---
  [[129.0, -11.0], [129.0, -32.0]], // Western Australia - NT / SA (129th meridian)
  [[138.0, -11.0], [138.0, -26.0], [141.0, -26.0], [141.0, -34.0], [141.0, -38.0]], // SA - QLD / NSW / VIC
  [[138.0, -26.0], [153.5, -28.0]], // Queensland - New South Wales
  [[141.0, -34.0], [150.0, -37.5]] // New South Wales - Victoria (Murray River)
];

// 3. Country Labels (Fade in when camera distance <= 215)
export const COUNTRY_LABELS_LOD = [
  { name: 'UNITED STATES', lat: 39.5, lng: -98.5 },
  { name: 'CANADA', lat: 56.0, lng: -106.0 },
  { name: 'MEXICO', lat: 23.6, lng: -102.5 },
  { name: 'BRAZIL', lat: -14.2, lng: -51.9 },
  { name: 'ARGENTINA', lat: -38.4, lng: -63.6 },
  { name: 'UNITED KINGDOM', lat: 55.3, lng: -3.4 },
  { name: 'FRANCE', lat: 46.2, lng: 2.2 },
  { name: 'GERMANY', lat: 51.1, lng: 10.4 },
  { name: 'SPAIN', lat: 40.4, lng: -3.7 },
  { name: 'ITALY', lat: 41.8, lng: 12.5 },
  { name: 'UKRAINE', lat: 48.3, lng: 31.1 },
  { name: 'RUSSIA', lat: 61.5, lng: 105.3 },
  { name: 'TURKEY', lat: 38.9, lng: 35.2 },
  { name: 'SAUDI ARABIA', lat: 23.8, lng: 45.0 },
  { name: 'IRAN', lat: 32.4, lng: 53.6 },
  { name: 'ISRAEL', lat: 31.0, lng: 34.8 },
  { name: 'EGYPT', lat: 26.8, lng: 30.8 },
  { name: 'SOUTH AFRICA', lat: -30.5, lng: 22.9 },
  { name: 'INDIA', lat: 20.5, lng: 78.9 },
  { name: 'PAKISTAN', lat: 30.3, lng: 69.3 },
  { name: 'CHINA', lat: 35.8, lng: 104.1 },
  { name: 'JAPAN', lat: 36.2, lng: 138.2 },
  { name: 'SOUTH KOREA', lat: 35.9, lng: 127.7 },
  { name: 'AUSTRALIA', lat: -25.2, lng: 133.7 },
  { name: 'INDONESIA', lat: -0.7, lng: 113.9 }
];

// 4. State / Regional Labels (Fade in when camera distance <= 175)
export const STATE_LABELS_LOD = [
  // US States
  { name: 'California', lat: 36.7, lng: -119.4 },
  { name: 'Texas', lat: 31.0, lng: -99.9 },
  { name: 'New York', lat: 43.0, lng: -75.0 },
  { name: 'Florida', lat: 27.6, lng: -81.5 },
  { name: 'Washington', lat: 47.7, lng: -120.7 },
  { name: 'Illinois', lat: 40.6, lng: -89.3 },
  // India States
  { name: 'Maharashtra', lat: 19.7, lng: 75.7 },
  { name: 'Delhi NCR', lat: 28.7, lng: 77.1 },
  { name: 'Karnataka', lat: 15.3, lng: 75.7 },
  { name: 'Tamil Nadu', lat: 11.1, lng: 78.6 },
  { name: 'Gujarat', lat: 22.2, lng: 71.1 },
  { name: 'Rajasthan', lat: 27.0, lng: 74.2 },
  { name: 'Uttar Pradesh', lat: 26.8, lng: 80.9 },
  // Canadian / Aus
  { name: 'Ontario', lat: 51.2, lng: -85.3 },
  { name: 'Quebec', lat: 52.9, lng: -73.5 },
  { name: 'New South Wales', lat: -31.8, lng: 145.6 },
  { name: 'Bavaria', lat: 48.7, lng: 11.4 },
  { name: 'Guangdong', lat: 23.3, lng: 113.2 }
];
