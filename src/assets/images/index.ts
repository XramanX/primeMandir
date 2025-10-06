// src/assets/images/index.ts
export type DeityAsset = {
  id: string;
  name: string;
  src: any;
  tags?: string[];
};

export const DEITIES: DeityAsset[] = [
  {
    id: 'krishna',
    name: 'Shri Krishna',
    src: require('./Krishna.png'),
  },
  {
    id: 'durga',
    name: 'Devi Durga',
    src: {
      uri: 'https://placehold.co/1024x1024/7A0F1A/FFFFFF?text=Devi+Durga',
    },
  },
  {
    id: 'shiva',
    name: 'Lord Shiva',
    src: { uri: 'https://placehold.co/1024x1024/06142C/FFFFFF?text=Shiva' },
  },
  {
    id: 'ganesha',
    name: 'Lord Ganesha',
    src: require('./Ganesha.webp'),
  },
];

export const RITUAL_ITEMS = {
  thali: {
    id: 'thali',
    name: 'Aarti Thali',
    src: require('./aarti_thali.png'),
  },
  prasad: {
    id: 'prasad',
    name: 'Prasad Plate',
    src: { uri: 'https://placehold.co/512x512/FF9A76/6C5CE7?text=Prasad' },
  },
  incense: {
    id: 'incense',
    name: 'Incense',
    src: { uri: 'https://placehold.co/256x512/C8C8C8/6C5CE7?text=Incense' },
  },
} as const;
export const ASSETS = {
  templeFrame: require('./temple_frame.png'),
  iconThali: require('./aarti_thali.png'),
  templeFloor: require('./temple_floor.jpg'),
  // iconFlower: require('./icons/flower_icon.png'),
  // iconConch: require('./icons/conch_icon.png'),
};
