import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.page.html',
  styleUrls: ['./project-details.page.scss'],
})
export class ProjectDetailsPage implements OnInit {

  project_name: any;
  project_type: any;
  company_name: any;
  name_culture: any;
  name_country: any;
  start_date: any;
  due_date: any;

  project_id = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private db: DatabaseService
  ) { }

  ngOnInit() {
    this.project_id = this.activatedRoute.snapshot.paramMap.get('project_id');
    this.db.getProject(this.project_id).then(project => {

      if(project.project_name == 'null'){
        this.project_name = '';
      } else { this.project_name = project.project_name; }

      if(project.project_type == 'null'){
        this.project_type = '';
      } else { this.project_type = project.project_type; }

      if(project.company_name == 'null'){
        this.company_name = '';
      } else { this.company_name = project.company_name; }

      if(project.name_culture == 'null'){
        this.name_culture = '';
      } else { this.name_culture = project.name_culture; }

      if(project.name_country == 'null'){
        this.name_country = '';
      } else { this.name_country = project.name_country; }

      if(project.start_date == 'null'){
        this.start_date = '';
      } else { 
        let start_date = project.start_date.split(" ");
        this.start_date = start_date[0]; 
      }

      if(project.due_date == 'null'){
        this.due_date = '';
      } else { 
        let due_date = project.due_date.split(" ");
        this.due_date = due_date[0]; 
      }
    });
  }

}
