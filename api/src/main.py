"""
"""

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from fastapi_health import health

from sqlalchemy import event

from sqlalchemy.orm import Session

import crud
import models
import schemas

from database import SessionLocal, engine

from seed import seed_database


event.listen(models.Job.__table__, "after_create", seed_database)


models.Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def is_db_healthy(db: Session = Depends(get_db)):
    try:
        db.execute("SELECT 1")
    except Exception as e:
        return False

    return True


app.add_api_route("/healthz", health([is_db_healthy]))


@app.get("/jobs/", response_model=list[schemas.Job])
def read_jobs(keyword: str = "", skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    if keyword:
        jobs = crud.get_jobs_by_keyword(db, keyword, skip=skip, limit=limit)
    else:
        jobs = crud.get_jobs(db, skip=skip, limit=limit)

    return jobs


@app.get("/jobs/actions/count/", response_model=schemas.JobsCount)
def read_jobs_count(keyword: str = "", db: Session = Depends(get_db)):
    if keyword:
        jobs_count = crud.get_jobs_by_keyword_count(db, keyword)
    else:
        jobs_count = crud.get_jobs_count(db)

    return jobs_count


@app.get("/jobs/{job_id}", response_model=schemas.Job)
def read_job(job_id: int, db: Session = Depends(get_db)):
    db_job = crud.get_job_by_id(db, job_id=job_id)
    if db_job is None:
        raise HTTPException(
            status_code=404, detail=f"Job with ID '{job_id}' not found.")
    return db_job


@app.post("/jobs/", response_model=schemas.Job, status_code=status.HTTP_201_CREATED)
def create_job(job: schemas.JobCreate, db: Session = Depends(get_db)):
    return crud.create_job(db=db, job=job)


@app.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    db_job = crud.get_job_by_id(db, job_id=job_id)
    if db_job is None:
        raise HTTPException(
            status_code=404, detail=f"Job with ID '{job_id}' not found.")

    crud.delete_job(db=db, job=db_job)

    return {"detail": f"Job with ID '{job_id}' deleted."}


@app.patch("/jobs/{job_id}", response_model=schemas.Job)
def update_job(job_id: int, job: schemas.JobUpdate, db: Session = Depends(get_db)):
    db_job = crud.get_job_by_id(db, job_id=job_id)
    if db_job is None:
        raise HTTPException(
            status_code=404, detail=f"Job with ID '{job_id}' not found.")

    return crud.update_job(db=db, db_job=db_job, job_update=job)
