import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { JobService } from '../job.service';

import { Job } from '../job';

@Component({
  selector: 'app-job-details-view',
  templateUrl: './job-details-view.component.html',
  styleUrls: ['./job-details-view.component.css']
})
export class JobDetailsViewComponent implements OnInit {

  jobId: number;

  notAvailableJob: boolean;

  job: Job;

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService
  ) {

    this.notAvailableJob = true;
    this.job = this.getNotAvailableJob();

    this.jobId = Number(this.route.snapshot.paramMap.get('id'));

  }

  ngOnInit(): void {

    console.log("JobDetailsViewComponent: ngOnInit()");

    this.getJobById();

  }

  ngOnChanges(): void {

    console.log("JobDetailsViewComponent: ngOnChanges()");

    this.getJobById();

  }

  private getNotAvailableJob(): Job {
    return {
      id: 0,
      title: "N/A",
      description: "N/A",
      location: "N/A",
      employer: "N/A",
      contact_information: "N/A",
      is_active: false,
      is_sponsored: false,
      published_at: "N/A"
    } as Job;
  }

  getJobById(): void {
    this.jobService.getJobById(this.jobId)
      .subscribe(job => {
        this.job = job;
        if (job) {
          this.notAvailableJob = false;
        }
      });
  }

}
