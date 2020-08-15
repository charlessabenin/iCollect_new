import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.page.html',
  styleUrls: ['./task-details.page.scss'],
})
export class TaskDetailsPage implements OnInit {

  task_titleshort: any;
  tt_farmers: any;
  tt_plantation: any;
  planned_start_date: any;
  planned_end_date: any;
  task_delegated_name: any;
  agent_name: any;
  task_status_name: any;
  task_done: any;
  task_description: any;

  task_id= null;

  constructor(
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    private db: DatabaseService
  ) { }

  ngOnInit() {
    this.task_id = this.activatedRoute.snapshot.paramMap.get('task_id');


    this.db.lastLogedUser().then(usr => {
      this.db.task_nbFarmers(this.task_id, usr.id_primary_company).then(tt => {
        if(tt.tt_farmers == 'null'){
          this.tt_farmers = '';
        } else { this.tt_farmers = tt.tt_farmers; }
      });
    });
    

    this.db.getProjectTask(this.task_id).then(task => {
      var yes, no;
      this.translate.get('YES').subscribe( value => { yes = value; } );
      this.translate.get('NO').subscribe( value => { no = value; } );

      if(task.task_titleshort == 'null'){
        this.task_titleshort = '';
      } else { this.task_titleshort = task.task_titleshort; }

      /*if(task.tt_farmers == 'null'){
        this.tt_farmers = '';
      } else { this.tt_farmers = task.tt_farmers; }*/

      if(task.tt_plantation == 'null'){
        this.tt_plantation = '';
      } else { this.tt_plantation = task.tt_plantation; }

      if(task.planned_start_date == 'null'){
        this.planned_start_date = '';
      } else { 
        let planned_start = task.planned_start_date.split(" ");
        this.planned_start_date = planned_start[0]; 
      }

      if(task.planned_end_date == 'null'){
        this.planned_end_date = '';
      } else { 
        let planned_end = task.planned_end_date.split(" ");
        this.planned_end_date = planned_end[0]; 
      }

      if(task.task_delegated_name == 'null'){
        this.task_delegated_name = '';
      } else { this.task_delegated_name = task.task_delegated_name; }

      if(task.agent_name == 'null'){
        this.agent_name = '';
      } else { this.agent_name = task.agent_name; }

      if(task.task_status_name == 'null'){
        this.task_status_name = '';
      } else { this.task_status_name = task.task_status_name; }

      if(task.task_done == 1){ this.task_done = yes; } else { this.task_done = no; }

      if(task.task_description == 'null'){
        this.task_description = '';
      } else { this.task_description = task.task_description; }
    });
  }

}
