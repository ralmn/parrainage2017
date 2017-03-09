import { Component, OnInit } from '@angular/core';

import { CandidatService } from '../candidat.service';
import { Candidat } from '../domain/candidat';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  candidats = [];
  nbValid = 0;
  constructor(public service: CandidatService
  ) {
      this.service.getCandidats((err, candidats) => {
        if(err){

        }else{
          this.candidats = candidats;
          this.nbValid = 0;
          for(let candidat of candidats){
            if(candidat.peutEtreCandidat()){
              this.nbValid++;
            }
          }
        }
      })

   }

  ngOnInit() {
  }

}
