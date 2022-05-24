"""
"""

from operator import or_
from sqlalchemy.orm import Session

import models
import schemas


def get_jobs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Job).order_by(models.Job.published_at.desc(), models.Job.id.asc()).offset(skip).limit(limit).all()


def get_job_by_id(db: Session, job_id: int):
    return db.query(models.Job).filter(models.Job.id == job_id).first()


def get_jobs_count(db: Session):
    jobs_count = db.query(models.Job).count()

    return schemas.JobsCount(
        count=jobs_count)


def get_jobs_by_keyword(db: Session, keyword: str = "", skip: int = 0, limit: int = 100):
    return db.query(models.Job).filter(or_(
        or_(models.Job.title.ilike(f"%{keyword}%"),
            models.Job.description.ilike(f"%{keyword}%")),
        or_(models.Job.location.ilike(f"%{keyword}%"),
            models.Job.employer.ilike(f"%{keyword}%")))).order_by(models.Job.published_at.desc(), models.Job.id.asc()).offset(skip).limit(limit).all()


def get_jobs_by_keyword_count(db: Session, keyword: str = ""):
    jobs_count = db.query(models.Job).filter(or_(
        or_(models.Job.title.ilike(f"%{keyword}%"),
            models.Job.description.ilike(f"%{keyword}%")),
        or_(models.Job.location.ilike(f"%{keyword}%"),
            models.Job.employer.ilike(f"%{keyword}%")))).count()

    return schemas.JobsCount(
        count=jobs_count)


def create_job(db: Session, job: schemas.JobCreate):
    db_job = models.Job(**job.dict())

    db.add(db_job)
    db.commit()

    db.refresh(db_job)

    return db_job


def delete_job(db: Session, job: schemas.Job):
    db.delete(job)
    db.commit()


def update_job(db: Session, db_job: models.Job, job_update: schemas.JobUpdate):
    job_data = job_update.dict(exclude_unset=True)
    for key, value in job_data.items():
        setattr(db_job, key, value)

    db.add(db_job)
    db.commit()

    db.refresh(db_job)

    return db_job
