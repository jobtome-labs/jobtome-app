import { Injectable } from '@angular/core';

import { NgxConfigureService } from 'ngx-configure';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

import { NotificationService } from './notification.service';

import { Job } from './job';
import { JobsCount } from './jobs-count';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private jobsApiUrl: string;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private config: NgxConfigureService,
    private http: HttpClient,
    private notification: NotificationService) {

    this.jobsApiUrl = config.config.apiBaseUrl + '/jobs';

  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error);

      this.log(`${operation} Failed: ${error.message}`);

      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`JobService: ${message}.`);
  }

  getJobs(skip: number = 0, limit: number = 100): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.jobsApiUrl}?skip=${skip}&limit=${limit}`)
      .pipe(
        tap(_ => this.log('Fetched Jobs')),
        catchError(this.handleError<Job[]>('getJobs', []))
      );
  }

  getJobsCount(): Observable<JobsCount> {
    return this.http.get<JobsCount>(`${this.jobsApiUrl}/actions/count`)
      .pipe(
        tap(_ => this.log('Fetched Jobs Count')),
        catchError(this.handleError<JobsCount>('getJobsCount'))
      );
  }

  getJobById(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.jobsApiUrl}/${id}`)
      .pipe(
        tap(_ => this.log('Fetched Job')),
        catchError(this.handleError<Job>('getJobById', undefined))
      );
  }

  getJobsByKeywordCount(keyword: string): Observable<JobsCount> {

    keyword = keyword.trim();

    return this.http.get<JobsCount>(`${this.jobsApiUrl}/actions/count?keyword=${keyword}`)
      .pipe(
        tap(_ => this.log('Fetched Jobs Count')),
        catchError(this.handleError<JobsCount>('getJobsByKeywordCount'))
      );
  }

  getJobsByKeyword(keyword: string, skip: number = 0, limit: number = 100): Observable<Job[]> {

    keyword = keyword.trim();

    return this.http.get<Job[]>(`${this.jobsApiUrl}?keyword=${keyword}&skip=${skip}&limit=${limit}`)
      .pipe(
        tap(_ => this.log('Fetched Jobs')),
        catchError(this.handleError<Job[]>('getJobsByKeyword', []))
      );

  }

  updateJob(job: Job): Observable<any> {
    return this.http.patch(`${this.jobsApiUrl}/${job.id}`, job, this.httpOptions)
      .pipe(
        tap(_ => this.log(`Updated Job with ID: ${job.id}`)),
        catchError(this.handleError<any>('updateJob'))
      );
  }

  deleteJob(id: number): Observable<Job> {
    return this.http.delete<Job>(`${this.jobsApiUrl}/${id}`, this.httpOptions)
      .pipe(
        tap(_ => this.log(`Deleted Job with ID: ${id}`)),
        catchError(this.handleError<Job>('deleteJob'))
      );
  }

  addJob(job: Job): Observable<Job> {
    return this.http.post<Job>(this.jobsApiUrl, job, this.httpOptions)
      .pipe(
        tap((newJob: Job) => this.log(`Added Job with ID: ${newJob.id}`)),
        catchError(this.handleError<Job>('addJob'))
      );
  }

}
