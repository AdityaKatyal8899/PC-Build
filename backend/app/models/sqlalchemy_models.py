from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from ..database import Base

class CPU(Base):
    __tablename__ = "cpus"

    id = Column(String, primary_key=True, index=True)

    # Identity
    brand = Column(String, nullable=False)
    family = Column(String, nullable=False)
    model = Column(String, nullable=False)
    generation = Column(String, nullable=False)

    # Specs
    cores = Column(Integer, nullable=False)
    threads = Column(Integer, nullable=False)
    base_clock = Column(Float, nullable=False)
    boost_clock = Column(Float, nullable=False)
    socket = Column(String, nullable=False)
    tdp_watt = Column(Integer, nullable=False)

    # Pricing
    msrp_usd = Column(Integer)
    current_price = Column(Integer)

    # Derived / system values
    cpu_index = Column(Float)        # computed later
    status = Column(String, default="active")


class GPU(Base):
    __tablename__ = "gpus"

    id = Column(Integer, primary_key=True, index=True)

    brand = Column(String, nullable=False)
    model = Column(String, nullable=False)
    architecture = Column(String, nullable=False)

    cores = Column(Integer, nullable=False)
    # vram_gb = Column(Integer, nullable=False)

    # base_clock_mhz = Column(Integer, nullable=False)
    boost_clock_mhz = Column(Integer)

    power_watt = Column(Integer, nullable=False)

    benchmark_score = Column(Integer)      # optional, raw data
    gpu_index = Column(String, nullable=False)  # derived ranking value

    status = Column(String, default="active")


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

    brand = Column(String, nullable=False)
    chipset = Column(String, nullable=False)

    socket = Column(String, nullable=False)
    form_factor = Column(String, nullable=False)
    ram_type = Column(String, nullable=False)
    max_ram = Column(Integer, nullable=False)

    pcie_version = Column(String, nullable=False)
    m2_slots = Column(Integer, nullable=False)
    sata_ports = Column(Integer, nullable=False)
    performacne = Column(String, nullable=False)
    status = Column(String, default="active")


class PSUS(Base):
    __tablename__ = "psus"

    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String, nullable=False)

    wattage = Column(Integer, nullable=False)
    efficiency = Column(String, nullable=False)

    modularity = Column(String, nullable=False)
    form_factor = Column(String, nullable=False)
    current_price = Column(Integer, nullable=False)

    performance = Column(String, nullable=False)
    status = Column(String, nullable=False)






    

