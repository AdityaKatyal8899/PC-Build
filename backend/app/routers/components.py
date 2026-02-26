from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.sqlalchemy_models import CPU, GPU, RAM, Motherboard, PSUS
from app.schemas.pydantic_models import (PSUResponse, PSUCreate, CPUCreate, CPUResponse, GPUResponse, GPUCreate, RAMCreate, RAMResponse, MotherboardCreate, MotherboardResponse)
from app.database import get_db
from typing import List

router = APIRouter()


#POST routes to add more components later on
@router.post("/cpu", response_model=CPUResponse, tags=['components-post'])
def create_cpu(cpu: CPUCreate, db: Session = Depends(get_db)):
    db_cpu = CPU(**cpu.dict())
    db.add(db_cpu)
    db.commit()
    db.refresh(db_cpu)
    return db_cpu
    

@router.post("/gpu", response_model=GPUResponse, tags=['components-post'])
def create_gpu(gpu: GPUCreate, db: Session = Depends(get_db)):
    db_gpu = GPU(**gpu.dict())
    db.add(db_gpu)
    db.commit()
    db.refresh(db_gpu)
    return db_gpu


@router.post("/ram", response_model=RAMResponse, tags=['components-post'])
def create_ram(ram: RAMCreate, db: Session = Depends(get_db)):
    db_ram = RAM(**ram.dict())
    db.add(db_ram)
    db.commit()
    db.refresh(db_ram)
    return db_ram


@router.post("/motherboard", response_model=MotherboardResponse, tags=['components-post'])
def create_motherboard(mb: MotherboardCreate, db: Session = Depends(get_db)):
    db_mb = Motherboard(**mb.dict())
    db.add(db_mb)
    db.commit()
    db.refresh(db_mb)
    return db_mb


@router.post('/psu', response_model=PSUResponse, tags=['components-post'])
def create_psu(psu: PSUCreate, db: Session = Depends(get_db)):
    db_psu = PSUS(**psu.dict())
    db.add(db_psu)
    db.commit()
    db.refresh(db_psu)
    return db_psu


#PUT routes to update exisiting data
@router.put("/cpu/{cpu_id}", response_model=CPUResponse)
def update_cpu(cpu_id: str, cpu: CPUCreate, db: Session = Depends(get_db)):
    db_cpu = db.query(CPU).filter(CPU.id == cpu_id).first()

    if db_cpu is None:
        raise HTTPException(status_code=404, detail='Component not found')
    
    for key,value in cpu.dict().items():
        setattr(db_cpu, key, value)

    db.commit()
    db.refresh(db_cpu)
    return db_cpu


@router.put("/gpu/{gpu_id}", response_model=GPUResponse)
def update_gpu(gpu_id: str, gpu: GPUCreate, db: Session = Depends(get_db)):
    db_gpu = db.query(gpu).filter(GPU.id == gpu_id).first()

    if db_gpu is None:
        raise HTTPException(status_code=404, detail='Component not found')
    
    for key,value in gpu.dict().items():
        setattr(db_gpu, key, value)

    db.commit()
    db.refresh(db_gpu)
    return db_gpu


@router.put("/ram/{ram_id}", response_model=RAMResponse)
def update_ram(ram_id: str, ram: RAMCreate, db: Session = Depends(get_db)):
    db_ram = db.query(ram).filter(RAM.id == ram_id).first()

    if db_ram is None:
        raise HTTPException(status_code=404, detail='No such component found on DB')
    
    for key, value in ram.dict().items():
        setattr(db_ram, key, value)

    db.commit()
    db.refresh(db_ram)
    return db_ram


@router.put("/psu/{psu_id}", response_model=RAMResponse)
def update_ram(ram_id: str, ram: RAMCreate, db: Session = Depends(get_db)):
    db_ram = db.query(ram).filter(RAM.id == ram_id).first()

    if db_ram is None:
        raise HTTPException(status_code=404, detail='No such component found on DB')
    
    for key, value in ram.dict().items():
        setattr(db_ram, key, value)

    db.commit()
    db.refresh(db_ram)
    return db_ram


#GET routes for user
@router.get("/components", tags=['FetchAll'])
def get_all_components(db: Session = Depends(get_db)):
    return {
        'cpus': db.query(CPU).limit(10).all(),
        'gpus': db.query(GPU).limit(10).all(),
        'rams': db.query(RAM).limit(10).all(),
        'motherboards': db.query(Motherboard).limit(10).all(),
        'psus': db.query(PSUS).limit(10).all()
    }
