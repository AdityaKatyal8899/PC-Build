import { Cpu, Microchip, Monitor, MemoryStick } from 'lucide-react';
import { ComponentCard } from './ComponentCard';
import { PCBuild, ComponentType } from '../App';
import { componentsData } from '../data/components';

interface ComponentSelectorProps {
  build: PCBuild;
  onChange: (type: ComponentType, value: string) => void;
}

export function ComponentSelector({ build, onChange }: ComponentSelectorProps) {
  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: 'var(--text-primary)' }}>
        Build Your PC
      </h2>

      <ComponentCard
        icon={<Microchip className="w-5 h-5 sm:w-6 sm:h-6" />}
        label="Motherboard"
        options={componentsData.motherboards}
        value={build.motherboard}
        onChange={(value) => onChange('motherboard', value)}
        build={build}
        type="motherboard"
        bgColor="var(--card-bg-1)"
      />

      <ComponentCard
        icon={<Cpu className="w-5 h-5 sm:w-6 sm:h-6" />}
        label="CPU"
        options={componentsData.cpus}
        value={build.cpu}
        onChange={(value) => onChange('cpu', value)}
        build={build}
        type="cpu"
        bgColor="var(--card-bg-2)"
      />

      <ComponentCard
        icon={<Monitor className="w-5 h-5 sm:w-6 sm:h-6" />}
        label="GPU"
        options={componentsData.gpus}
        value={build.gpu}
        onChange={(value) => onChange('gpu', value)}
        build={build}
        type="gpu"
        bgColor="var(--card-bg-3)"
      />

      <ComponentCard
        icon={<MemoryStick className="w-5 h-5 sm:w-6 sm:h-6" />}
        label="RAM"
        options={componentsData.rams}
        value={build.ram}
        onChange={(value) => onChange('ram', value)}
        build={build}
        type="ram"
        bgColor="var(--card-bg-4)"
      />
    </div>
  );
}