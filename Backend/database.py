from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import declarative_base, sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./crm.db" # Easy local database
# curently using sqllite for simplicity
# since sql alchemly is an orm which makes it easier to switch to mysql or postgres later
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Table structure for storing HCP interactions
class Interaction(Base):
    __tablename__ = "interactions"
    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String)
    interaction_type = Column(String)
    sentiment = Column(String)
    notes = Column(Text)

# Create tables in database if they don't exist
Base.metadata.create_all(bind=engine)