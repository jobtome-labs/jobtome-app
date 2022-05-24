"""
"""

from pydantic import BaseModel


class JobBase(BaseModel):
    pass


class JobCreate(JobBase):
    title: str
    description: str

    location: str

    employer: str
    contact_information: str

    is_active: bool
    is_sponsored: bool


class JobUpdate(JobBase):
    title: str | None = None
    description: str | None = None

    location: str | None = None

    employer: str | None = None
    contact_information: str | None = None

    is_active: bool | None = None
    is_sponsored: bool | None = None


class Job(JobBase):
    id: int

    title: str
    description: str

    location: str

    employer: str
    contact_information: str

    is_active: bool
    is_sponsored: bool

    published_at: str

    class Config:
        orm_mode = True


class JobsCount(JobBase):
    count: int
