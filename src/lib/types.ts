export type Illumination = {
  incidence: number;
  emission: number;
  phase: number;
};

export type Image = {
  id: string;
  mission: 'Chandrayaan-TMC' | 'NASA LRO' | 'JAXA SELENE';
  filename: string;
  illumination: Illumination;
  uploadedBy: string;
  uploadedAt: string; // ISO date string
  storagePath: string;
  thumbnailUrl: string;
};
