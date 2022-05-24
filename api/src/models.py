"""
"""

from datetime import datetime

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class Job(Base):
    __tablename__ = "Jobs"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String)
    description = Column(String)

    location = Column(String)

    employer = Column(String)
    contact_information = Column(String)

    is_active = Column(Boolean, default=True)
    is_sponsored = Column(Boolean, default=False)

    published_at = Column(
        String, default=datetime.now().strftime("%m %B %Y (%H:%M:%S)"))
