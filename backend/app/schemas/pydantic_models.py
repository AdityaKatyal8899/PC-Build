from pydantic import BaseModel


#These are base requirements of schema of each compponent 
class BaseComponent(BaseModel):
    id: str
    name: str

class CPUCreate(BaseComponent):
    cpu_index: float
    cores: int
    platform: str


class CPUResponse(CPUCreate):
    class Config:
        orm_mode = True

class GPUCreate(BaseComponent):
    gpu_index: float
    vram_gb: int
    cuda_cores: int

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
    mb_index: float
    socket: str
    memory_type: str

class MotherboardResponse(MotherboardCreate):
    class Config:
        orm_mode = True

