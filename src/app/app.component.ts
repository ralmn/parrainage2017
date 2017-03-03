import { Component, OnInit } from '@angular/core';

import {CandidatService} from './candidat.service'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  list: any[]  = [];
  
  constructor(private candidatService: CandidatService) {

    candidatService.listCandidats((err, list)=> {
      if(err){

      }else{
        console.log(list);
        this.list = list;
      }
    })

   }

  ngOnInit() {
    
  }
}



