from pydantic import BaseModel

#These are base requirements of schema of each compponent 
class BaseComponent(BaseModel):
    id: str
    name: str

class CPUCreate(BaseComponent):
    brand: str
    family: str
    model: str
    generation: str

    cores: int
    threads: int
    base_clock: float
    boost_clock: float
    socket: str
    tdp_watt: int

    cpu_index: float
    current_price: int
    status: str


class CPUResponse(CPUCreate):
    class Config:
        orm_mode = True


class GPUCreate(BaseComponent):
    id: int
    brand: str
    model: str
    architecture: str

    cores: int
    # vram_gb: int
    # base_clock_mhz: int
    boost_clock_mhz: int
    power_watt: int

    gpu_index: str
    status: str


class GPUResponse(GPUCreate):
    class Config:
        orm_mode = True


class RAMCreate(BaseComponent):
    ram_index: float
    memory_type: str
    size_gb: int

class RAMResponse(RAMCreate):
    class Config:
        orm_mode = True


class MotherboardCreate(BaseComponent):
    id: int
    brand: str
    chipset: str

    socket: str
    form_factor: str
    ram_type: str
    max_ram: int

    pcie_version: str
    m2_slots: int
    sata_ports: int
    performance: str
    status: str


class MotherboardResponse(MotherboardCreate):
    class Config:
        orm_mode = True


class PSUCreate(BaseComponent):
    id: int
    brand: str

    wattage: int
    efficiency: str

    modularity: str
    form_factor: str
    current_price: int

    performance: str
    status: str

class PSUResponse(PSUCreate):
    class Config:
        orm_mode = True


