import type { Image } from './types';

export const images: Image[] = [
  {
    id: 'image123',
    mission: 'Chandrayaan-TMC',
    filename: 'tmc_image_001.tif',
    illumination: { incidence: 45.0, emission: 10.0, phase: 55.0 },
    uploadedBy: 'Dr. Evelyn Reed',
    uploadedAt: '2023-10-26T10:00:00Z',
    storagePath: '/raw-images/tmc_image_001.tif',
    thumbnailUrl: 'https://placehold.co/300x200.png',
  },
  {
    id: 'image124',
    mission: 'NASA LRO',
    filename: 'lro_nac_1122.jp2',
    illumination: { incidence: 30.5, emission: 5.2, phase: 35.7 },
    uploadedBy: 'Dr. Kenji Tanaka',
    uploadedAt: '2023-11-15T14:30:00Z',
    storagePath: '/raw-images/lro_nac_1122.jp2',
    thumbnailUrl: 'https://placehold.co/300x200.png',
  },
  {
    id: 'image125',
    mission: 'JAXA SELENE',
    filename: 'sel_ter_2009.img',
    illumination: { incidence: 60.1, emission: 20.3, phase: 80.4 },
    uploadedBy: 'Dr. Anya Sharma',
    uploadedAt: '2023-12-01T09:15:00Z',
    storagePath: '/raw-images/sel_ter_2009.img',
    thumbnailUrl: 'https://placehold.co/300x200.png',
  },
];
