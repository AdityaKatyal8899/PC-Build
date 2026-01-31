export const componentsData = {
  motherboards: [
    { value: 'b650', label: 'B650 (Mid-range AM5)' },
    { value: 'x670e', label: 'X670E (High-end AM5)' },
    { value: 'b760', label: 'B760 (Mid-range Intel)' },
    { value: 'z790', label: 'Z790 (High-end Intel)' },
    { value: 'h610', label: 'H610 (Budget Intel)' },
  ],
  cpus: [
    { value: 'r5-7600', label: 'Ryzen 5 7600 (Mid-range)' },
    { value: 'r7-7800x3d', label: 'Ryzen 7 7800X3D (High-end Gaming)' },
    { value: 'r9-7950x', label: 'Ryzen 9 7950X (Enthusiast)' },
    { value: 'i5-13600k', label: 'Intel i5-13600K (Mid-range)' },
    { value: 'i7-14700k', label: 'Intel i7-14700K (High-end)' },
    { value: 'i9-14900k', label: 'Intel i9-14900K (Enthusiast)' },
    { value: 'i3-12100', label: 'Intel i3-12100 (Budget)' },
  ],
  gpus: [
    { value: 'rtx4060', label: 'RTX 4060 (Budget 1080p)' },
    { value: 'rtx4070', label: 'RTX 4070 (1440p Gaming)' },
    { value: 'rtx4080', label: 'RTX 4080 (High-end 4K)' },
    { value: 'rtx4090', label: 'RTX 4090 (Flagship)' },
    { value: 'rx7800xt', label: 'RX 7800 XT (Mid-range)' },
    { value: 'rx7900xtx', label: 'RX 7900 XTX (High-end)' },
    { value: 'gtx1660s', label: 'GTX 1660 Super (Entry)' },
  ],
  rams: [
    { value: 'ddr5-4800-16gb', label: '16GB DDR5-4800 (Budget)' },
    { value: 'ddr5-6000-32gb', label: '32GB DDR5-6000 (Balanced)' },
    { value: 'ddr5-6400-32gb', label: '32GB DDR5-6400 (High-end)' },
    { value: 'ddr5-7200-64gb', label: '64GB DDR5-7200 (Enthusiast)' },
    { value: 'ddr4-3200-16gb', label: '16GB DDR4-3200 (Budget)' },
    { value: 'ddr4-3600-32gb', label: '32GB DDR4-3600 (Mid-range)' },
  ],
};

export interface ComponentSpec {
  tier: number; // 1-5, where 5 is highest
  platform: 'am5' | 'intel-12-14' | 'any';
  memoryType: 'ddr5' | 'ddr4' | 'both';
}

export const componentSpecs: Record<string, ComponentSpec> = {
  // Motherboards
  'b650': { tier: 3, platform: 'am5', memoryType: 'ddr5' },
  'x670e': { tier: 5, platform: 'am5', memoryType: 'ddr5' },
  'b760': { tier: 3, platform: 'intel-12-14', memoryType: 'both' },
  'z790': { tier: 5, platform: 'intel-12-14', memoryType: 'both' },
  'h610': { tier: 1, platform: 'intel-12-14', memoryType: 'both' },

  // CPUs
  'r5-7600': { tier: 3, platform: 'am5', memoryType: 'ddr5' },
  'r7-7800x3d': { tier: 5, platform: 'am5', memoryType: 'ddr5' },
  'r9-7950x': { tier: 5, platform: 'am5', memoryType: 'ddr5' },
  'i5-13600k': { tier: 3, platform: 'intel-12-14', memoryType: 'both' },
  'i7-14700k': { tier: 4, platform: 'intel-12-14', memoryType: 'both' },
  'i9-14900k': { tier: 5, platform: 'intel-12-14', memoryType: 'both' },
  'i3-12100': { tier: 2, platform: 'intel-12-14', memoryType: 'both' },

  // GPUs
  'rtx4060': { tier: 2, platform: 'any', memoryType: 'both' },
  'rtx4070': { tier: 3, platform: 'any', memoryType: 'both' },
  'rtx4080': { tier: 5, platform: 'any', memoryType: 'both' },
  'rtx4090': { tier: 5, platform: 'any', memoryType: 'both' },
  'rx7800xt': { tier: 3, platform: 'any', memoryType: 'both' },
  'rx7900xtx': { tier: 5, platform: 'any', memoryType: 'both' },
  'gtx1660s': { tier: 1, platform: 'any', memoryType: 'both' },

  // RAM
  'ddr5-4800-16gb': { tier: 2, platform: 'any', memoryType: 'ddr5' },
  'ddr5-6000-32gb': { tier: 3, platform: 'any', memoryType: 'ddr5' },
  'ddr5-6400-32gb': { tier: 4, platform: 'any', memoryType: 'ddr5' },
  'ddr5-7200-64gb': { tier: 5, platform: 'any', memoryType: 'ddr5' },
  'ddr4-3200-16gb': { tier: 2, platform: 'any', memoryType: 'ddr4' },
  'ddr4-3600-32gb': { tier: 3, platform: 'any', memoryType: 'ddr4' },
};
