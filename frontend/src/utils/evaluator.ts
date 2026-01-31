import { PCBuild, ComponentType } from '../App';
import { componentSpecs } from '../data/components';

export interface ComponentStatus {
  type: 'ideal' | 'good' | 'warning' | 'error';
  label: string;
  message: string;
}

export interface OverallRating {
  level: 'overkill' | 'beast' | 'good' | 'decent' | 'cooked';
  label: string;
  description: string;
}

export interface CompatibilityCheck {
  title: string;
  message: string;
  status: 'ideal' | 'good' | 'warning' | 'error';
  statusLabel: string;
  explanation?: string;
}

export function getComponentStatus(
  build: PCBuild,
  type: ComponentType
): ComponentStatus | null {
  const value = build[type];
  if (!value) return null;

  const spec = componentSpecs[value];
  if (!spec) return null;

  // Check motherboard compatibility
  if (type === 'motherboard') {
    if (!build.cpu) {
      return {
        type: 'good',
        label: 'Selected',
        message: 'Choose a CPU to check compatibility',
      };
    }

    const cpuSpec = componentSpecs[build.cpu];
    if (spec.platform !== cpuSpec.platform) {
      return {
        type: 'error',
        label: 'Incompatible',
        message: 'CPU socket does not match motherboard',
      };
    }

    if (spec.tier >= 4 && cpuSpec.tier >= 4) {
      return {
        type: 'ideal',
        label: 'Ideal',
        message: 'Perfect match for high-end builds',
      };
    }

    return {
      type: 'good',
      label: 'Good',
      message: 'Compatible and balanced',
    };
  }

  // Check CPU
  if (type === 'cpu') {
    if (!build.motherboard) {
      return {
        type: 'good',
        label: 'Selected',
        message: 'Choose a motherboard to check compatibility',
      };
    }

    const mbSpec = componentSpecs[build.motherboard];
    if (spec.platform !== mbSpec.platform) {
      return {
        type: 'error',
        label: 'Incompatible',
        message: 'CPU socket does not match motherboard',
      };
    }

    if (build.gpu) {
      const gpuSpec = componentSpecs[build.gpu];
      const diff = Math.abs(spec.tier - gpuSpec.tier);
      
      if (diff === 0) {
        return {
          type: 'ideal',
          label: 'Ideal',
          message: 'Perfectly balanced with GPU',
        };
      } else if (diff === 1) {
        return {
          type: 'good',
          label: 'Good',
          message: 'Well balanced with GPU',
        };
      } else if (diff >= 2) {
        if (spec.tier > gpuSpec.tier) {
          return {
            type: 'warning',
            label: 'May Bottleneck',
            message: 'CPU is stronger than GPU - GPU may limit performance',
          };
        } else {
          return {
            type: 'warning',
            label: 'May Bottleneck',
            message: 'GPU is stronger than CPU - CPU may limit performance',
          };
        }
      }
    }

    return {
      type: 'good',
      label: 'Good',
      message: 'Compatible with motherboard',
    };
  }

  // Check GPU
  if (type === 'gpu') {
    if (!build.cpu) {
      return {
        type: 'good',
        label: 'Selected',
        message: 'Choose a CPU to check balance',
      };
    }

    const cpuSpec = componentSpecs[build.cpu];
    const diff = Math.abs(spec.tier - cpuSpec.tier);

    if (diff === 0) {
      return {
        type: 'ideal',
        label: 'Ideal',
        message: 'Perfectly balanced with CPU',
      };
    } else if (diff === 1) {
      return {
        type: 'good',
        label: 'Good',
        message: 'Well balanced with CPU',
      };
    } else if (diff >= 2) {
      if (spec.tier > cpuSpec.tier) {
        return {
          type: 'warning',
          label: 'May Bottleneck',
          message: 'CPU may limit GPU performance',
        };
      } else {
        return {
          type: 'good',
          label: 'Good',
          message: 'CPU is stronger - good for productivity',
        };
      }
    }
  }

  // Check RAM
  if (type === 'ram') {
    if (!build.motherboard) {
      return {
        type: 'good',
        label: 'Selected',
        message: 'Choose a motherboard to check compatibility',
      };
    }

    const mbSpec = componentSpecs[build.motherboard];
    
    if (mbSpec.memoryType === 'ddr5' && spec.memoryType === 'ddr4') {
      return {
        type: 'error',
        label: 'Incompatible',
        message: 'Motherboard requires DDR5 memory',
      };
    }

    if (mbSpec.memoryType === 'ddr4' && spec.memoryType === 'ddr5') {
      return {
        type: 'error',
        label: 'Incompatible',
        message: 'Motherboard only supports DDR4 memory',
      };
    }

    if (build.cpu) {
      const cpuSpec = componentSpecs[build.cpu];
      const diff = Math.abs(spec.tier - cpuSpec.tier);

      if (diff === 0) {
        return {
          type: 'ideal',
          label: 'Ideal',
          message: 'Perfect match for this CPU',
        };
      } else if (diff === 1) {
        return {
          type: 'good',
          label: 'Good',
          message: 'Good match for this build',
        };
      } else if (spec.tier < cpuSpec.tier) {
        return {
          type: 'warning',
          label: 'May Bottleneck',
          message: 'Consider faster RAM for this CPU',
        };
      }
    }

    return {
      type: 'good',
      label: 'Good',
      message: 'Compatible with motherboard',
    };
  }

  return {
    type: 'good',
    label: 'Good',
    message: 'Component selected',
  };
}

export function getOverallRating(build: PCBuild): OverallRating {
  const cpuSpec = componentSpecs[build.cpu];
  const gpuSpec = componentSpecs[build.gpu];
  const mbSpec = componentSpecs[build.motherboard];
  const ramSpec = componentSpecs[build.ram];

  if (!cpuSpec || !gpuSpec || !mbSpec || !ramSpec) {
    return {
      level: 'decent',
      label: 'Decent',
      description: 'Complete the build for full analysis',
    };
  }

  // Check for incompatibilities
  if (cpuSpec.platform !== mbSpec.platform) {
    return {
      level: 'cooked',
      label: 'Cooked',
      description: 'CPU and motherboard are incompatible - this build won\'t work',
    };
  }

  if (
    (mbSpec.memoryType === 'ddr5' && ramSpec.memoryType === 'ddr4') ||
    (mbSpec.memoryType === 'ddr4' && ramSpec.memoryType === 'ddr5')
  ) {
    return {
      level: 'cooked',
      label: 'Cooked',
      description: 'RAM type is incompatible with motherboard',
    };
  }

  const avgTier = (cpuSpec.tier + gpuSpec.tier + ramSpec.tier) / 3;
  const imbalance = Math.max(
    Math.abs(cpuSpec.tier - gpuSpec.tier),
    Math.abs(cpuSpec.tier - ramSpec.tier)
  );

  // Check for overkill (all top tier)
  if (avgTier >= 4.5 && imbalance <= 1) {
    return {
      level: 'overkill',
      label: 'Overkill',
      description: 'Top-tier components across the board - exceptional performance',
    };
  }

  // Check for beast (high-end, balanced)
  if (avgTier >= 4 && imbalance <= 1) {
    return {
      level: 'beast',
      label: 'Beast',
      description: 'High-end balanced build - excellent for gaming and productivity',
    };
  }

  // Check for good (mid-high tier, balanced)
  if (avgTier >= 3 && imbalance <= 1) {
    return {
      level: 'good',
      label: 'Good',
      description: 'Solid balanced build - great for most use cases',
    };
  }

  // Check for major bottlenecks
  if (imbalance >= 3) {
    return {
      level: 'cooked',
      label: 'Cooked',
      description: 'Severe imbalance - one component will heavily bottleneck the others',
    };
  }

  // Check for decent (some imbalance)
  if (imbalance >= 2) {
    return {
      level: 'decent',
      label: 'Decent',
      description: 'Functional build but has some imbalance - consider upgrading weaker components',
    };
  }

  return {
    level: 'good',
    label: 'Good',
    description: 'Balanced build that will serve you well',
  };
}

export function getCompatibilityChecks(build: PCBuild): CompatibilityCheck[] {
  const cpuSpec = componentSpecs[build.cpu];
  const gpuSpec = componentSpecs[build.gpu];
  const mbSpec = componentSpecs[build.motherboard];
  const ramSpec = componentSpecs[build.ram];

  const checks: CompatibilityCheck[] = [];

  // CPU ↔ GPU
  const cpuGpuDiff = Math.abs(cpuSpec.tier - gpuSpec.tier);
  if (cpuGpuDiff === 0) {
    checks.push({
      title: 'CPU ↔ GPU Balance',
      message: 'Perfect pairing - both components will perform optimally',
      status: 'ideal',
      statusLabel: 'Ideal',
      explanation: 'Your CPU and GPU are in the same performance tier, meaning neither will bottleneck the other. You\'ll get maximum performance from both components.',
    });
  } else if (cpuGpuDiff === 1) {
    checks.push({
      title: 'CPU ↔ GPU Balance',
      message: 'Well balanced - minimal performance impact',
      status: 'good',
      statusLabel: 'Good',
      explanation: 'While not perfectly matched, the performance difference is small enough that you won\'t notice significant bottlenecking in most scenarios.',
    });
  } else if (cpuSpec.tier > gpuSpec.tier) {
    checks.push({
      title: 'CPU ↔ GPU Balance',
      message: 'CPU is significantly stronger - GPU may limit gaming performance',
      status: 'warning',
      statusLabel: 'GPU Limited',
      explanation: 'Your CPU is more powerful than your GPU. In gaming, the GPU will reach 100% usage while the CPU is underutilized. Consider upgrading the GPU or using the extra CPU power for streaming/recording.',
    });
  } else {
    checks.push({
      title: 'CPU ↔ GPU Balance',
      message: 'GPU is significantly stronger - CPU may limit performance',
      status: 'warning',
      statusLabel: 'CPU Limited',
      explanation: 'Your GPU is more powerful than your CPU. In demanding games, the CPU will hit 100% usage, preventing the GPU from reaching its full potential. You may experience stuttering or lower FPS than expected.',
    });
  }

  // CPU ↔ RAM
  const cpuRamDiff = Math.abs(cpuSpec.tier - ramSpec.tier);
  if (cpuRamDiff === 0) {
    checks.push({
      title: 'CPU ↔ RAM Balance',
      message: 'Memory matches CPU performance perfectly',
      status: 'ideal',
      statusLabel: 'Ideal',
      explanation: 'Your RAM speed and capacity are perfectly suited for this CPU. You\'ll get optimal performance in both gaming and productivity tasks.',
    });
  } else if (cpuRamDiff === 1) {
    checks.push({
      title: 'CPU ↔ RAM Balance',
      message: 'RAM is adequate for this CPU',
      status: 'good',
      statusLabel: 'Good',
      explanation: 'Your RAM is sufficient for this CPU, though you might see small gains with faster memory in specific workloads.',
    });
  } else if (cpuSpec.tier > ramSpec.tier) {
    checks.push({
      title: 'CPU ↔ RAM Balance',
      message: 'Slow RAM may limit CPU performance in memory-intensive tasks',
      status: 'warning',
      statusLabel: 'RAM Limited',
      explanation: 'High-end CPUs benefit from faster RAM. You may see performance gains in productivity apps, gaming (especially with AMD CPUs), and multitasking by upgrading to faster memory.',
    });
  } else {
    checks.push({
      title: 'CPU ↔ RAM Balance',
      message: 'RAM is faster than CPU needs - good for future upgrades',
      status: 'good',
      statusLabel: 'Good',
      explanation: 'Your RAM exceeds current needs, but provides headroom for future CPU upgrades without needing to replace memory.',
    });
  }

  // CPU ↔ Motherboard
  if (cpuSpec.platform !== mbSpec.platform) {
    checks.push({
      title: 'CPU ↔ Motherboard',
      message: 'INCOMPATIBLE - CPU socket does not match motherboard',
      status: 'error',
      statusLabel: 'Incompatible',
      explanation: 'This CPU physically cannot fit in this motherboard. AMD Ryzen 7000 CPUs require AM5 motherboards, while Intel 12th-14th gen CPUs require LGA1700 motherboards.',
    });
  } else if (cpuSpec.tier === 5 && mbSpec.tier === 5) {
    checks.push({
      title: 'CPU ↔ Motherboard',
      message: 'High-end motherboard provides full features for this CPU',
      status: 'ideal',
      statusLabel: 'Ideal',
      explanation: 'Your motherboard has robust VRMs, PCIe 5.0 support, and advanced features that complement this high-end CPU perfectly.',
    });
  } else if (mbSpec.tier < cpuSpec.tier - 1) {
    checks.push({
      title: 'CPU ↔ Motherboard',
      message: 'Basic motherboard may limit CPU features and overclocking',
      status: 'warning',
      statusLabel: 'Limited',
      explanation: 'Lower-end motherboards may have weaker power delivery and fewer features. The CPU will work, but you might not get full overclocking potential or all connectivity options.',
    });
  } else {
    checks.push({
      title: 'CPU ↔ Motherboard',
      message: 'Motherboard supports CPU with all essential features',
      status: 'good',
      statusLabel: 'Good',
      explanation: 'Your motherboard provides solid support for this CPU with good power delivery and connectivity.',
    });
  }

  // GPU ↔ Motherboard
  if (gpuSpec.tier >= 5 && mbSpec.tier >= 4) {
    checks.push({
      title: 'GPU ↔ Motherboard',
      message: 'Motherboard provides PCIe 4.0/5.0 for maximum GPU bandwidth',
      status: 'ideal',
      statusLabel: 'Ideal',
      explanation: 'High-end motherboards ensure your GPU gets full bandwidth, though current GPUs rarely saturate even PCIe 4.0.',
    });
  } else {
    checks.push({
      title: 'GPU ↔ Motherboard',
      message: 'Motherboard has sufficient PCIe lanes for GPU',
      status: 'good',
      statusLabel: 'Good',
      explanation: 'Your motherboard provides adequate PCIe connectivity for this GPU. Even PCIe 3.0 x16 provides enough bandwidth for modern GPUs.',
    });
  }

  return checks;
}

export function getPerformanceEstimate(build: PCBuild): string[] {
  const cpuSpec = componentSpecs[build.cpu];
  const gpuSpec = componentSpecs[build.gpu];
  const avgTier = (cpuSpec.tier + gpuSpec.tier) / 2;

  const estimates: string[] = [];

  // Gaming performance
  if (gpuSpec.tier >= 5) {
    estimates.push('4K Gaming: High to Ultra settings in most games');
  } else if (gpuSpec.tier >= 4) {
    estimates.push('1440p Gaming: High to Ultra settings, smooth 100+ FPS');
  } else if (gpuSpec.tier >= 3) {
    estimates.push('1440p Gaming: Medium to High settings, 60-100 FPS');
  } else if (gpuSpec.tier >= 2) {
    estimates.push('1080p Gaming: Medium settings, 60+ FPS in most games');
  } else {
    estimates.push('1080p Gaming: Low to Medium settings');
  }

  // Productivity
  if (cpuSpec.tier >= 5) {
    estimates.push('Content Creation: Excellent for 4K video editing, 3D rendering, and multitasking');
  } else if (cpuSpec.tier >= 4) {
    estimates.push('Content Creation: Good for video editing, streaming, and productivity');
  } else if (cpuSpec.tier >= 3) {
    estimates.push('Productivity: Great for multitasking, light content creation');
  } else {
    estimates.push('Productivity: Suitable for everyday tasks and light multitasking');
  }

  // Future proofing
  if (avgTier >= 4.5) {
    estimates.push('Future-proofing: Excellent - should handle new games and apps for 4-5 years');
  } else if (avgTier >= 3.5) {
    estimates.push('Future-proofing: Good - should remain relevant for 3-4 years');
  } else if (avgTier >= 2.5) {
    estimates.push('Future-proofing: Moderate - good for current games, may need upgrades in 2-3 years');
  } else {
    estimates.push('Future-proofing: Limited - suitable for current needs, upgrades likely needed sooner');
  }

  // Special notes
  if (Math.abs(cpuSpec.tier - gpuSpec.tier) >= 2) {
    if (cpuSpec.tier > gpuSpec.tier) {
      estimates.push('Note: CPU overhead available for streaming, recording, or background tasks');
    } else {
      estimates.push('Note: CPU may limit performance in CPU-heavy games or during multitasking');
    }
  }

  return estimates;
}
