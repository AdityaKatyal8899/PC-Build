from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


SQLAlchemyDB_URL = 'sqlite:///./components.db'
DATABASE_URL = "postgresql+psycopg2://postgres:Aditya8899@localhost:5432/PC-Build-DB"


engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()
