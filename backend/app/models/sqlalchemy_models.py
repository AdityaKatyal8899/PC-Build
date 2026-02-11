from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from ..database import Base

class CPU(Base): 
    __tablename__ = "cpus"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    cpu_index = Column(Float, nullable=False)
    cores = Column(Integer, nullable=False)
    platform = Column(String, nullable=False)

class GPU(Base):
    __tablename__ = "gpus"

    id = Column(String, primary_key=True, index=True)  
    name = Column(String, nullable=False)
    gpu_index = Column(Float, nullable=False)
    vram_gb = Column(Integer, nullable=False)
    cuda_cores = Column(Integer, nullable=False)

    
class RAM(Base):
    __tablename__ = "rams"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    ram_index = Column(Float, nullable=False)
    memory_type = Column(String, nullable=False)  
    size_gb = Column(Integer, nullable=False)


class Motherboard(Base):
    __tablename__ = "motherboards"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    mb_index = Column(Float, nullable=False)
    socket = Column(String, nullable=False)
    memory_type = Column(String, nullable=False)