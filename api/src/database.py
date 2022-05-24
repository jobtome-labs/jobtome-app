"""
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from config import load_config


CONFIG = load_config()

SQLALCHEMY_DATABASE_URL = CONFIG["database"]["connectionString"]


engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
