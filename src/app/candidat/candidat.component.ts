import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { CandidatService } from '../candidat.service';
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
  departement: any = null;



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


        let mandats = ["Conseiller/ère départemental-e", "Maire", "Maire délégué-e", "Député-e", "Conseiller/ère métropolitain-e de Lyon", "Maire d'arrondissement", "Sénateur/trice", "Conseiller/ère régional-e", "Président-e d'un conseil de communauté de communes", "Membre du Conseil de Paris", "Représentant-e français-e au Parlement européen", "Président-e d'un conseil de métropole", "Membre de l'assemblée de Corse", "Membre élu-e de l'assemblée des Français de l'étranger"];


        let mandatsCount = [];
        let mandatsColor = [];

        let departementCount = [];
        let departements = [];
        let departementColor = [];


        for (let mandat of mandats) {
          mandatsCount.push(0);
          mandatsColor.push(this.randomColor());
        }




        for (let parrain of candidat.Parrains) {
          let indexMandat = mandats.indexOf(parrain.Mandat);
          if (indexMandat > - 1) {
            mandatsCount[indexMandat]++;
          }

          let indexDep = departements.indexOf(parrain.Département);
          if (indexDep > -1) {
            departementCount[indexDep]++;
          } else {
            departements.push(parrain.Département);
            departementCount.push(1);
            departementColor.push(this.randomColor());
          }

          let indexData = dates.indexOf(parrain.Date_de_publication);
          if (indexData > -1) {
            dateCount[indexData]++;
          } else {
            dates.push(parrain.Date_de_publication);
            dateCount.push(1);
          }
        }

        let datesPogress = [];
        let datesPogressCount = [];
        for (let date of dates.sort()) {
          datesPogress.push(date);
          datesPogressCount.push(0);
        }

        for (let parrain of candidat.Parrains) {
          let indexData = dates.indexOf(parrain.Date_de_publication);
          if (indexData > -1) {
            for (let i = indexData; i < datesPogressCount.length; i++) {
              datesPogressCount[i]++;
            }
          }
        }

        for (let i in mandats) {
          mandats[i] += " (" + mandatsCount[i] + ")"
        }

        this.mandats = {
          options: {
            title: {
              display: true,
              text: "Répartitions par mandats"
            },
          },
          labels: mandats,
          datasets: [
            {
              data: mandatsCount,
              backgroundColor: mandatsColor
            }
          ]
        }

        for (let i in departements) {
          departements[i] += " (" + departementCount[i] + ")"
        }

        this.departement = {
          options: {
            title: {
              display: true,
              text: "Répartitions par département",
            }
          },
          labels: departements,
          datasets: [
            {
              data: departementCount,
              backgroundColor: departementColor
            }
          ]
        }


        this.dates = {
          options: {
            title: {
              display: true,
              text: "Date de publication des parrainages",
            },
          },
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

  randomColor(){
    var val = Math.floor(Math.random() * 16777215).toString(16);
    while(val.length < 6){
      val = "0" + val;
    }
    return "#" + val;
  }

}
