import type { Difficulty } from '@/types';

interface WordEntry {
  word: string;
  difficulty: Difficulty;
}

const easyWords = [
  'CAT', 'DOG', 'SUN', 'MOON', 'BEE', 'BOW', 'CUP', 'DAY', 'EAR', 'EGG',
  'EYE', 'FAN', 'FAT', 'FEW', 'FIT', 'FLY', 'FOG', 'FOX', 'FROG', 'FUN',
  'GAP', 'GAS', 'GEM', 'GET', 'GIG', 'GOD', 'GUM', 'GUN', 'HAT', 'HEN',
  'HILL', 'HIP', 'HIT', 'HOP', 'HOT', 'HUG', 'ICE', 'INK', 'JAR', 'JET',
  'JOB', 'JOY', 'JUMP', 'KEY', 'KID', 'KIT', 'LAB', 'LAD', 'LAP', 'LAW',
  'LEG', 'LET', 'LID', 'LIE', 'LIP', 'LOG', 'MAP', 'MAT', 'MIX', 'MOM',
  'NET', 'NOR', 'NUT', 'OAK', 'OAR', 'OIL', 'OLD', 'OWL', 'PAD', 'PAN',
  'PARK', 'PEN', 'PIE', 'PIG', 'PIN', 'POP', 'POT', 'PUP', 'RAT', 'RAW',
  'RED', 'RIB', 'RID', 'RIM', 'RIP', 'ROD', 'ROW', 'RUB', 'RUG', 'RUN',
  'SAD', 'SAIL', 'SAT', 'SEA', 'SEE', 'SET', 'SIT', 'SIX', 'SKI', 'SKY',
  'SNAP', 'SOAP', 'SOCK', 'SOFA', 'SOIL', 'SPIN', 'STAR', 'STIR', 'SWIM', 'TAPE',
  'TAX', 'TEA', 'TEN', 'TIE', 'TIN', 'TIP', 'TOE', 'TON', 'TOY', 'TRY',
  'TUB', 'TWO', 'USE', 'VAN', 'WAR', 'WAX', 'WAY', 'WEB', 'WED', 'WET',
  'WIG', 'WIND', 'WIN', 'WIRE', 'WING', 'WIP', 'YES', 'ZAP', 'ZIP', 'ZOO',
];

const mediumWords = [
  'APPLE', 'HOUSE', 'WATER', 'MANGO', 'CHAIR', 'TABLE', 'PHONE', 'MUSIC',
  'CLOUD', 'TRAIN', 'PLANT', 'SMILE', 'HAPPY', 'GREEN', 'LIGHT', 'SCHOOL',
  'BREAD', 'BRICK', 'CABIN', 'CANDY', 'CHASE', 'CLOCK', 'CROWN', 'DANCE',
  'DREAM', 'DRINK', 'EAGLE', 'EARTH', 'EIGHT', 'EMPTY', 'EVERY', 'FAITH',
  'FENCE', 'FIELD', 'FIGHT', 'FINAL', 'FLOOR', 'FLOWER', 'FOCUS', 'FROST',
  'FRUIT', 'GHOST', 'GLASS', 'GRADE', 'GRAIN', 'GRASS', 'GUARD', 'GUEST',
  'HEART', 'HEAVY', 'HORSE', 'HOTEL', 'IMAGE', 'JEWEL', 'JUICE', 'KNIFE',
  'LAKE', 'LARGE', 'LATER', 'LAUGH', 'LEARN', 'LEMON', 'LEVEL', 'LIVER',
  'LOVER', 'LUCKY', 'LUNCH', 'MAGIC', 'MAJOR', 'MARCH', 'MEDIA', 'METAL',
  'MONEY', 'MONTH', 'MOTOR', 'MOUSE', 'MOVIE', 'NIGHT', 'NOBLE', 'NORTH',
  'OCEAN', 'PAINT', 'PAPER', 'PARTY', 'PEACE', 'PEACH', 'PEARL', 'PIANO',
  'PIZZA', 'PLANE', 'PLAZA', 'POINT', 'PRIDE', 'PRIZE', 'QUEEN', 'QUICK',
  'QUIET', 'RADIO', 'RAINY', 'REACH', 'RIVER', 'ROBIN', 'ROYAL', 'SALAD',
  'SCALE', 'SCARF', 'SCENE', 'SHARK', 'SHARP', 'SHEEP', 'SHEET', 'SHELL',
  'SHIRT', 'SHORE', 'SHORT', 'SIGHT', 'SILLY', 'SLEEP', 'SMART', 'SNAKE',
  'SNOWY', 'SOLID', 'SOUND', 'SPACE', 'SPEAK', 'SPICE', 'SPOON', 'SPORT',
  'STAGE', 'STAMP', 'STEAM', 'STEEL', 'STICK', 'STILL', 'STONE', 'STORM',
  'STORY', 'STUDY', 'SUGAR', 'SUNNY', 'SUPER', 'SWEET', 'SWING', 'TASTE',
  'TEACH', 'TIGER', 'TIGHT', 'TOWER', 'TRUCK', 'TRUST', 'UNCLE', 'UNDER',
  'UNION', 'VALUE', 'VIDEO', 'VITAL', 'VOICE', 'WAGON', 'WHALE', 'WHEAT',
  'WHEEL', 'WORLD', 'YOUNG', 'YOUTH', 'ZEBRA',
];

const hardWords = [
  'BASKET', 'BIRTHDAY', 'BOTTLE', 'BRIDGE', 'BUTTON', 'CAMERA', 'CASTLE',
  'CHERRY', 'CHICKEN', 'CIRCUS', 'COFFEE', 'COLONY', 'COOKING', 'CORNER',
  'COTTAGE', 'DESERT', 'DIAMOND', 'DOLPHIN', 'DRAGON', 'ELEPHANT', 'ENERGY',
  'ENGINE', 'FAMILY', 'FARMER', 'FEATHER', 'FESTIVAL', 'FOREST', 'GALLERY',
  'GARDEN', 'GROCERY', 'HAMMER', 'HARBOR', 'HOLIDAY', 'HOSPITAL', 'JUNGLE',
  'KITCHEN', 'LADDER', 'LANTERN', 'LIBRARY', 'MARKET', 'MEMORY', 'MIRROR',
  'MORNING', 'MUSEUM', 'NATURE', 'NUMBER', 'ORANGE', 'PACKAGE', 'PALACE',
  'PENCIL', 'PEPPER', 'PIRATE', 'POCKET', 'POTATO', 'PUPPET', 'PURPLE',
  'QUARTZ', 'RAINBOW', 'ROCKET', 'SANDWICH', 'SCIENCE', 'SEASON', 'SHADOW',
  'SILVER', 'SOCCER', 'SPIDER', 'SQUARE', 'STADIUM', 'STAMPS', 'STELLAR',
  'SUMMER', 'SUNRISE', 'SUNSET', 'TICKET', 'TONGUE', 'TUNNEL', 'TURTLE',
  'UMBRELLA', 'VALLEY', 'VILLAGE', 'VIOLET', 'WALNUT', 'WARMTH', 'WEATHER',
  'WINTER', 'WIZARD', 'PUZZLE', 'TROPHY', 'WINDOW', 'PILOT', 'CANDY',
  'ISLAND', 'LETTER', 'MASTER', 'FRIEND', 'PLANET', 'ROCKET', 'SINGER',
];

const wordDatabase: WordEntry[] = [
  ...easyWords.map(w => ({ word: w, difficulty: 'easy' as Difficulty })),
  ...mediumWords.map(w => ({ word: w, difficulty: 'medium' as Difficulty })),
  ...hardWords.map(w => ({ word: w, difficulty: 'hard' as Difficulty })),
];

export function getWordsByDifficulty(difficulty: Difficulty): string[] {
  return wordDatabase
    .filter(w => w.difficulty === difficulty)
    .map(w => w.word);
}

export function getRandomWord(difficulty: Difficulty, exclude: string[] = []): string {
  const words = getWordsByDifficulty(difficulty).filter(w => !exclude.includes(w));
  const pool = words.length > 0 ? words : getWordsByDifficulty(difficulty);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getRandomWordByLength(minLen: number, maxLen: number, exclude: string[] = []): string {
  const words = wordDatabase
    .filter(w => w.word.length >= minLen && w.word.length <= maxLen && !exclude.includes(w.word))
    .map(w => w.word);
  const pool = words.length > 0 ? words : wordDatabase
    .filter(w => w.word.length >= minLen && w.word.length <= maxLen)
    .map(w => w.word);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getWordDatabase(): string[] {
  return wordDatabase.map(w => w.word);
}

export { wordDatabase };
