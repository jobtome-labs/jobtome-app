import { Component, OnInit, Input, ViewChild, Directive } from '@angular/core';

import { Observable } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { DialogConfirmActionComponent } from '../dialog-confirm-action/dialog-confirm-action.component';

import { Job } from '../job';
import { JobsCount } from '../jobs-count';

import { NotificationService } from '../notification.service';
import { JobService } from '../job.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input()
  get search(): string {
    return this._search;
  }
  set search(search: string) {
    this._search = (search && search.trim()) || '';
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
  private _search: string = '';

  jobs: Job[] = [];
  jobsCount: JobsCount = { count: 0 } as JobsCount;

  content_limit: number = 338;

  jobsPageIndex: number = 0;
  jobsPageSize: number = 5;
  jobsPageSizeOptions: number[] = [3, 5, 10, 25, 100];

  constructor(
    private jobService: JobService,
    public dialog: MatDialog,
    private notification: NotificationService
  ) {
  }

  ngOnInit(): void {

    console.log("JobsComponent: ngOnInit()");

    this.getJobsByKeyword();
    this.getJobsByKeyword();

  }

  ngOnChanges(): void {

    console.log("JobsComponent: ngOnChanges()");

    this.getJobsByKeyword();
    this.getJobsByKeywordCount();

  }

  openDialog(question: string, width: string = "400px"): Observable<boolean> {

    const config = {
      width: width,
      data: {
        question: question
      }
    }

    return this.dialog.open(DialogConfirmActionComponent, config)
      .afterClosed();

  }

  onPaginatorChange(event: PageEvent) {

    this.jobsPageIndex = event.pageIndex;
    this.jobsPageSize = event.pageSize;

    this.ngOnChanges();

  }

  getJobs(): void {
    this.jobService.getJobs(this.jobsPageIndex * this.jobsPageSize, this.jobsPageSize)
      .subscribe(jobs => {
        this.jobs = jobs;
      });
  }

  getJobsCount(): void {
    this.jobService.getJobsCount()
      .subscribe(jobsCount => {
        this.jobsCount = jobsCount;
      });
  }

  getJobsByKeyword(): void {
    this.jobService.getJobsByKeyword(this.search, this.jobsPageIndex * this.jobsPageSize, this.jobsPageSize)
      .subscribe(jobs => {
        this.jobs = jobs;
      });
  }

  getJobsByKeywordCount(): void {
    this.jobService.getJobsByKeywordCount(this.search)
      .subscribe(jobsCount => {
        this.jobsCount = jobsCount;
      });
  }

  addJob(title: string, description: string, location: string,
    employer: string, contact_information: string, is_active: boolean): void {

    this.jobService.addJob({
      title, description, location,
      employer, contact_information, is_active
    } as Job)
      .subscribe(job => {
        this.jobs.push(job);
        this.jobsCount.count += 1;
      });
  }

  deleteJob(job: Job): void {
    this.openDialog(`Do you really want to delete the "${job.title}" Job?`)
      .subscribe(result => {
        if (result) {

          this.jobs = this.jobs.filter(j => j !== job);
          this.jobsCount.count -= 1;

          this.jobService.deleteJob(job.id)
            .subscribe();

        }
      });
  }

  setJobActive(job: Job): void {
    this.openDialog(`Do you really want to mark the "${job.title}" Job as Active?`)
      .subscribe(result => {
        if (result) {
          job.is_active = true;
          this.jobService.updateJob(job)
            .subscribe();
        }
      });
  }

  setJobInactive(job: Job): void {
    this.openDialog(`Do you really want to mark the "${job.title}" Job as Inactive?`)
      .subscribe(result => {
        if (result) {
          job.is_active = false;
          this.jobService.updateJob(job)
            .subscribe();
        }
      });
  }

}
