// Fallback cover art for episodes that don't have a cover_url in Supabase.
// Keyed by the place-name extracted from the episode title via episodeName()
// in ./episode.js — e.g. "Culero Podcast 26 Winnepeg" -> "Winnepeg".
//
// Every URL points to a real photo on Wikimedia Commons (Wikipedia's freely
// licensed media library), resolved automatically via Wikipedia's public API
// and spot-checked to swap out a handful of cases where the naive lookup
// returned a flag or locator map instead of an actual photo (Namibia,
// Madagascar, Cyprus, Transylvania, West Berlin, Sierra Leone, Hong Kong,
// Manitoba, South Dakota, Patagonia).
//
// One episode — "Gatling" (EP 68) — isn't a real place, so it's intentionally
// left out here; it just falls back to the default record-icon art.
//
// NOTE ON LICENSING: these are Commons-hosted photos, most under Creative
// Commons Attribution/Share-Alike licenses. Hotlinking commons-hosted images
// is technically fine and stable (Wikimedia explicitly supports this as a
// public API), but the CC-BY/BY-SA licenses do require attribution if used
// beyond fair-use-style incidental display. Worth adding a quiet "Photos via
// Wikimedia Commons" credit line somewhere (e.g. site footer or About page)
// to stay clean on that front — happy to add that too if you want it.

export const CITY_ART = {
  'Ur': 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Urimki_inscription.jpg',
  'Brixton': 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Lambeth_Town_Hall_%288715334040%29.jpg',
  'Austin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Skyline_of_Austin%2C_Texas_%28cropped%29.jpg/3840px-Skyline_of_Austin%2C_Texas_%28cropped%29.jpg',
  'Gothenburg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/G%C3%B6teborg_2503_stitch_%2828573994096%29.jpg/3840px-G%C3%B6teborg_2503_stitch_%2828573994096%29.jpg',
  'NYC': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/3840px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg',
  'Namibia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Namib_desert_MODIS.jpg/3840px-Namib_desert_MODIS.jpg',
  'Madagascar': 'https://upload.wikimedia.org/wikipedia/commons/3/38/Adansonia_grandidieri_Pat_Hooper.jpg',
  'Saint Michele': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Mont-Saint-Michel_vu_du_ciel.jpg/3840px-Mont-Saint-Michel_vu_du_ciel.jpg',
  'Stockholm': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Royal_Dramatic_Theatre_Stockholm.jpg/3840px-Royal_Dramatic_Theatre_Stockholm.jpg',
  'Lisbon': 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Lisboa_-_Portugal_%2852597836992%29.jpg',
  'Greenville': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/2024-4-12-Falls_Park_Waterfall_Greenville_South_Carolina_by_Yousef_AbdulHusain.jpg/3840px-2024-4-12-Falls_Park_Waterfall_Greenville_South_Carolina_by_Yousef_AbdulHusain.jpg',
  'Cyprus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Kyrenia_01-2017_img04_view_from_castle_bastion.jpg/3840px-Kyrenia_01-2017_img04_view_from_castle_bastion.jpg',
  'Transylvannia': 'https://upload.wikimedia.org/wikipedia/commons/1/17/Castelul_Bran2.jpg',
  'Galway': 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Galway_cathedral.jpg',
  'Nice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Promenade_des_Anglais_Nice_IMG_1255.jpg/3840px-Promenade_des_Anglais_Nice_IMG_1255.jpg',
  'Duluth': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Downtown_Duluth%2C_Minnesota_Skyline_%2825406820466%29_%28cropped%29.jpg/3840px-Downtown_Duluth%2C_Minnesota_Skyline_%2825406820466%29_%28cropped%29.jpg',
  'Midnight in Cali': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Santiago_de_Cali.jpg/3840px-Santiago_de_Cali.jpg',
  'Flint': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Flint%2C_Michigan.jpg/3840px-Flint%2C_Michigan.jpg',
  'York': 'https://upload.wikimedia.org/wikipedia/commons/1/14/York_Minster_%282797690%29.jpg',
  'Topeka': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Kansas_Capitol.jpg/3840px-Kansas_Capitol.jpg',
  'Winnepeg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Winnipeg%2C_Manitoba_skyline_%28cropped%29.jpg/3840px-Winnipeg%2C_Manitoba_skyline_%28cropped%29.jpg',
  'Chernobyl': 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Administrative_center%2C_Radiation_Control_%2811383715816%29.jpg',
  'Chicago': 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Chicago_River_ferry_b.jpg',
  '(London)': 'https://upload.wikimedia.org/wikipedia/commons/6/67/London_Skyline_%28125508655%29.jpeg',
  'Barcelona': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Evening_light_over_Barcelona.jpg/3840px-Evening_light_over_Barcelona.jpg',
  'San Francisco': 'https://upload.wikimedia.org/wikipedia/commons/f/f9/San_Francisco_Downtown_Aerial%2C_August_2025.jpg',
  'Anchorage': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Anchorage%2C_Alaska_skyline.jpg/3840px-Anchorage%2C_Alaska_skyline.jpg',
  'Los Angeles': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Hollywood_sign_%288485145044%29.jpg/3840px-Hollywood_sign_%288485145044%29.jpg',
  'Cairo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Cairo_Opera_House%2C_Al_Hurriyah_Park_and_the_Nile_river_%2814797782354%29.jpg/3840px-Cairo_Opera_House%2C_Al_Hurriyah_Park_and_the_Nile_river_%2814797782354%29.jpg',
  'Istanbul': 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Historical_peninsula_and_modern_skyline_of_Istanbul.jpg',
  'Oslo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Nationaltheatret_evening.jpg/3840px-Nationaltheatret_evening.jpg',
  'Cydonia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Minoan_ruins_in_Chania%2C_Crete_001.JPG/3840px-Minoan_ruins_in_Chania%2C_Crete_001.JPG',
  'Savannah': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Savannah.tif/lossy-page1-3840px-Savannah.tif.jpg',
  'Portland': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Portland_Oregon_Aerial%2C_June_2025.jpg',
  'Delphia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Philadelphia_skyline_20240528_%28cropped_2-1%29.jpg/3840px-Philadelphia_skyline_20240528_%28cropped_2-1%29.jpg',
  'Cancun': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Cancun_Strand_Luftbild_%2822143397586%29.jpg/3840px-Cancun_Strand_Luftbild_%2822143397586%29.jpg',
  'Vienna': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Schoenbrunn_philharmoniker_2012.jpg/3840px-Schoenbrunn_philharmoniker_2012.jpg',
  'Des Moines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Morning_Skyline_-_Des_Moines%2C_Iowa_-_Winter_on_the_Des_Moines_River_%2824805016620%29_%28cropped%29.jpg/3840px-Morning_Skyline_-_Des_Moines%2C_Iowa_-_Winter_on_the_Des_Moines_River_%2824805016620%29_%28cropped%29.jpg',
  'Manchester': 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Tower_Blocks_over_Knott_Mill%2C_geograph_6866152_by_David_Dixon.jpg',
  'Mexico City': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Sobrevuelos_CDMX_HJ2A4913_%2825514321687%29_%28cropped%29.jpg/3840px-Sobrevuelos_CDMX_HJ2A4913_%2825514321687%29_%28cropped%29.jpg',
  'Quito': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/FACHADA_ASAMBLEA_NACIONAL._QUITO%2C_20_DE_FEBRERO_2020._01.jpg/3840px-FACHADA_ASAMBLEA_NACIONAL._QUITO%2C_20_DE_FEBRERO_2020._01.jpg',
  'Rockford': 'https://upload.wikimedia.org/wikipedia/commons/c/c2/East_State_Street_in_downtown_Rockford.jpg',
  'Alexandria': 'https://upload.wikimedia.org/wikipedia/commons/7/79/San_Stefano_Grand_Plaza.JPG',
  'Copenhagen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/2018_-_Christiansborg_from_the_Marble_Bridge.jpg/3840px-2018_-_Christiansborg_from_the_Marble_Bridge.jpg',
  'Montreal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Montreal%2C_Quebec_skyline.jpg/3840px-Montreal%2C_Quebec_skyline.jpg',
  'Bakersfield': 'https://upload.wikimedia.org/wikipedia/commons/7/77/2009-0726-CA-Bakersfield-FoxTheater_%28cropped%29.jpg',
  'Prague': 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Prague_%286365119737%29.jpg',
  'West Berlin': 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Berlinermauer.jpg',
  'Baja': 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Baja_peninsula_%28mexico%29_250m.jpg',
  'Milwaukee': 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Milwaukee_Skyline_w_New_NW_Mutual_Building_2025_by_Isaac_Rowlett.jpg',
  // 'Gatling' intentionally omitted — EP 68 isn't named after a real place.
  'Syracuse': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Syracuse%2C_New_York_skyline_%28cropped%29.jpg/3840px-Syracuse%2C_New_York_skyline_%28cropped%29.jpg',
  'Bogota': 'https://upload.wikimedia.org/wikipedia/commons/2/20/Bogota%2C_Colombia_%2836668708290%29.jpg',
  'Sierra Leone': 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Freetown-aerialview.jpg',
  'Spokane': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Spokane%2C_Washington_skyline_%28cropped%29.jpg/3840px-Spokane%2C_Washington_skyline_%28cropped%29.jpg',
  'Cordova': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Cordova_Alaska_aerial.jpg/3840px-Cordova_Alaska_aerial.jpg',
  'Hong Kong': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Hong_Kong_Skyline_viewed_from_Victoria_Peak.jpg/3840px-Hong_Kong_Skyline_viewed_from_Victoria_Peak.jpg',
  'Dublin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Dublin_-_aerial_-_2025-07-07_01.jpg/3840px-Dublin_-_aerial_-_2025-07-07_01.jpg',
  'Memphis 2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Skyline_of_Memphis%2C_TN.jpg/3840px-Skyline_of_Memphis%2C_TN.jpg',
  'Monterrey': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/View_of_Monterrey_%282015%29.jpg/3840px-View_of_Monterrey_%282015%29.jpg',
  'Manitba': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Manitoba_Legislative_building_exterior_%28J%29_%28cropped%29.jpg/3840px-Manitoba_Legislative_building_exterior_%28J%29_%28cropped%29.jpg',
  'Patagonia': 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Torres_del_Paine_y_cuernos_del_Paine%2C_montaje.jpg',
  'Tijuana': 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Templo_Tijuana_Mexico_%28cropped%29.jpg',
  'Belgrade': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Panorama_Belgrad.jpg/3840px-Panorama_Belgrad.jpg',
  'Sofia': 'https://upload.wikimedia.org/wikipedia/commons/b/be/Russian_church_%2837591925970%29.jpg',
  'South Dakota': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Mount_Rushmore_detail_view_%28100MP%29.jpg/3840px-Mount_Rushmore_detail_view_%28100MP%29.jpg',
  'Perth': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Perth_CBD_skyline_from_State_War_Memorial_Lookout%2C_2023%2C_04_b.jpg/3840px-Perth_CBD_skyline_from_State_War_Memorial_Lookout%2C_2023%2C_04_b.jpg',
  'Hamburg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Hamburg%2C_Landungsbr%C3%BCcken_--_2016_--_3131-7.jpg/3840px-Hamburg%2C_Landungsbr%C3%BCcken_--_2016_--_3131-7.jpg',
  'Cologne': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Kranh%C3%A4user_Cologne%2C_April_2018_-01.jpg/3840px-Kranh%C3%A4user_Cologne%2C_April_2018_-01.jpg',
  'Long Beach': 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Long_beach3_%28cropped%29.jpg',
  'Boise': 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Boise%2C_Idaho.jpg',
  'Esperanza Base': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Hope_Bay-2016-Trinity_Peninsula%E2%80%93Esperanza_Station_03.jpg/3840px-Hope_Bay-2016-Trinity_Peninsula%E2%80%93Esperanza_Station_03.jpg',
  'San Sebastian': 'https://upload.wikimedia.org/wikipedia/commons/f/f4/San_Sebasti%C3%A1n_-_Ayuntamiento_10.jpg',
  'Joliet': 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Jackson_Street_Bridge_in_Joliet%2C_Illinois%2C_in_2008.jpg',
  'Blue Island': 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Blue_Island_Montage.jpg',
  'Oak Park': 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Lake_Street_at_dusk%2C_Oak_Park.jpg',
  'Yellowstone': 'https://upload.wikimedia.org/wikipedia/commons/7/73/Grand_Canyon_of_yellowstone.jpg',
  'Glacier Lake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Mountain_Goat_at_Hidden_Lake.jpg/3840px-Mountain_Goat_at_Hidden_Lake.jpg',
  'Williamsburg': 'https://upload.wikimedia.org/wikipedia/commons/e/ee/WilliamsburgBK.jpg',
  'Atlanta': 'https://upload.wikimedia.org/wikipedia/commons/c/c8/A2ATL20250614-0721_%28cropped%29.jpg',
  'San Dimas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/San_Dimas_City_Hall.jpg/3840px-San_Dimas_City_Hall.jpg',
  'Calexico': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Camp_Salvation%2C_today_City_Hall_of_Calexico.jpg/3840px-Camp_Salvation%2C_today_City_Hall_of_Calexico.jpg',
  'Charlotte': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Uptown_Charlotte_2018_taking_by_DJI_Phantom_4_pro.jpg/3840px-Uptown_Charlotte_2018_taking_by_DJI_Phantom_4_pro.jpg',
  'Phoenix': 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Downtown_Phoenix_Aerial_Looking_Northeast.jpg',
  'Talahassee': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Florida_Supreme_Court_2022.jpg/3840px-Florida_Supreme_Court_2022.jpg',
  'Tupelo': 'https://upload.wikimedia.org/wikipedia/commons/0/05/Downtown_Tupelo_1.JPG',
  'Pangea': 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Mollweide_Paleographic_Map_of_Earth%2C_250_Ma_%28Olenekian_Age%29.png',
  'Notting Hill': 'https://upload.wikimedia.org/wikipedia/commons/0/04/London_110.jpg',
  'Johannesburg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Johannesburg_skyline_2017.jpg/3840px-Johannesburg_skyline_2017.jpg',
  'Antwerp': 'https://upload.wikimedia.org/wikipedia/commons/3/38/Amberes%3B_vistas_MAS_2.jpg',
  'Bern': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Bundeshaus_Bern_2009%2C_Flooffy.jpg',
  'Salvador': 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Salvador_BA_%28cropped%29_2.jpg',
  'Acapulco': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Skyscrapers_in_Acapulco_Diamante.jpg/3840px-Skyscrapers_in_Acapulco_Diamante.jpg',
  'Fargo': 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Downtown_Fargo_Aerial_-_Facing_Southeast_%2851009704407%29.jpg',
  'Eau Claire': 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Eau_Claire_-_Water_Street_looking_west_2005_%28cropped%29.jpg',
}

// Wikimedia thumb URLs look like:
//   .../commons/thumb/f/f4/File.jpg/3840px-File.jpg
// Swap the leading width so the browser isn't pulling a multi-MB 3840px
// original just to show it in a ~180px card. Falls through untouched for
// URLs that aren't in that thumb format (a handful of images had no
// Wikipedia-generated thumb and are only available at original size).
export function cityArtThumb(url, width = 640) {
  if (!url) return url
  return url.replace(/\/(\d+)px-([^/]+)$/, `/${width}px-$2`)
}

// Look up fallback art for an episode by its cleaned place-name.
export function cityArtFor(placeName) {
  return CITY_ART[placeName] ? cityArtThumb(CITY_ART[placeName]) : null
}
