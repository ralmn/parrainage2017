import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { CandidatService  } from '../candidat.service';
import { Candidat } from '../domain/candidat';



@Component({
  selector: 'app-candidat',
  templateUrl: './candidat.component.html',
  styleUrls: ['./candidat.component.css']
})
export class CandidatComponent implements OnInit {

  slug: String;
  candidat: Candidat;
  mandats: any = null;

  dates: any = null;



  constructor(route: ActivatedRoute,
    private router: Router,
    private service: CandidatService
  ) {

    route.params.subscribe(p => {
      this.slug = p["candidat"];

      this.loadCandidat();
    });


  }

  loadCandidat() {

    this.service.getCandidat(this.slug, (err, candidat) => {
      if (err) {
        console.error(err);

      } else {

        let dates = [];
        let dateCount = [];
         

        let mandats = ["Conseiller/ère départemental-e",	"Maire",	"Maire délégué-e",	"Député-e",	"Conseiller/ère métropolitain-e de Lyon",	"Maire d'arrondissement",	"Sénateur/trice",	"Conseiller/ère régional-e",	"Président-e d'un conseil de communauté de communes",	"Membre du Conseil de Paris"	,"Représentant-e français-e au Parlement européen",	"Président-e d'un conseil de métropole",	"Membre de l'assemblée de Corse",	"Membre élu-e de l'assemblée des Français de l'étranger"];


        let mandatsCount = [];
        let mandatsColor = [];
        for(let mandat of mandats){
          mandatsCount.push(0);
          mandatsColor.push('#' + Math.floor(Math.random()*16777215).toString(16));
        }

        

        for(let parrain of candidat.Parrains){
            let indexMandat = mandats.indexOf(parrain.Mandat);
            if(indexMandat > - 1){
              mandatsCount[indexMandat]++;
            }

            let indexData = dates.indexOf(parrain.Date_de_publication);
            if(indexData > -1){
              dateCount[indexData]++;
            }else{
              dates.push(parrain.Date_de_publication);
              dateCount.push(1);
            }
        }

        let datesPogress = [];
        let datesPogressCount = [];
        for(let date of dates.sort()){
            datesPogress.push(date);
            datesPogressCount.push(0);
        }

        for(let parrain of candidat.Parrains){
          let indexData = dates.indexOf(parrain.Date_de_publication);
          if(indexData > -1){
            for(let i = indexData; i < datesPogressCount.length; i++){
              datesPogressCount[i]++;
            }
          }
        }

        this.mandats = {
            labels: mandats,
            datasets: [
                {
                    data: mandatsCount,
                    backgroundColor: mandatsColor
                }
            ]
        }
        
      

        this.dates = {
            labels: dates,
            datasets: [
                {
                     type: 'line',
                    data: dateCount,
                    label: "Publication ce jour",
                    fill: false,
                    borderColor: '#4bc0c0'
                   
                },
                 {
                   type: 'line',
                    data: datesPogressCount,
                    label: "Progression",
                    fill: false,
                    borderColor: '#565656'
                }
            ]
        }



        this.candidat = candidat; 
      }
    });

  }

  ngOnInit() {
  }

}
