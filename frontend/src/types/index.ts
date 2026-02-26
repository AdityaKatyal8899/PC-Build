export type ComponentType = 'motherboard' | 'cpu' | 'gpu' | 'ram' | 'psu';

export interface PCBuild {
  motherboard: string;
  cpu: string;
  gpu: string;
  ram: string;
  psu: string;
}