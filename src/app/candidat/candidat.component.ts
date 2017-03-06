import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { CandidatService } from '../candidat.service';
import { Candidat } from '../domain/candidat';

import { ViewChild } from '@angular/core';
import { UIChart, SelectItem } from "primeng/primeng";


@Component({
  selector: 'app-candidat',
  templateUrl: './candidat.component.html',
  styleUrls: ['./candidat.component.css']
})
export class CandidatComponent implements OnInit {

  slug: String;
  parrainStr = "s";
  candidat: Candidat;
  mandats: any = null;

  dates: any = null;
  departement: any = null;
  listes: any = null;
  listesSenat: any = null;

  @ViewChild("chartmandats") chartMandats: UIChart;
  @ViewChild("chartdates") chartDates: UIChart;
  @ViewChild("chartdepartements") chartDepartements: UIChart;
  @ViewChild("chartlistes") chartListes: UIChart;



  MANDATS = ["Conseiller/ère départemental-e", "Maire", "Maire délégué-e", "Député-e", "Conseiller/ère métropolitain-e de Lyon", "Maire d'arrondissement", "Sénateur/trice", "Conseiller/ère régional-e", "Président-e d'un conseil de communauté de communes", "Membre du Conseil de Paris", "Représentant-e français-e au Parlement européen", "Président-e d'un conseil de métropole", "Membre de l'assemblée de Corse", "Membre élu-e de l'assemblée des Français de l'étranger"];

  mandatsFilter: SelectItem[] = [];

  constructor(route: ActivatedRoute,
    private router: Router,
    private service: CandidatService
  ) {

    this.mandats = {
      options: {
        title: {
          display: true,
          text: "Répartitions par mandats"
        },
      },
      labels: this.MANDATS,
      datasets: [
        {
          data: [],
          backgroundColor: []
        }
      ]
    }

    this.departement = {
      options: {
        title: {
          display: true,
          text: "Répartitions par département",
        }
      },
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: []
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
      labels: [],
      datasets: [
        {
          type: 'line',
          data: [],
          label: "Publication ce jour",
          fill: false,
          borderColor: '#4bc0c0'

        },
        {
          type: 'line',
          data: [],
          label: "Progression",
          fill: false,
          borderColor: '#565656'
        }
      ]
    }

    this.listes = {
      options: {
        title: {
          display: true,
          text: "Répartitions par liste electorales des maires (municipale de 2014)",
        }
      },
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: []
        }
      ]
    };

    this.listesSenat = {
      options: {
        title: {
          display: true,
          text: "Répartitions par groupe senatorial",
        }
      },
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: []
        }
      ]
    };

    this.mandatsFilter.push({ label: 'Tous les mandats', value: null });
    for (let mandat of this.MANDATS) {
      this.mandatsFilter.push({ label: mandat, value: mandat });
    }

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




        let mandatsCount = [];
        let mandatsColor = [];

        let departementCount = [];
        let departements = [];
        let departementColor = [];


        let listes = [];
        let listesCount = [];
        let listesColor = [];

        for (let mandat of this.MANDATS) {
          mandatsCount.push(0);
          mandatsColor.push(this.randomColor());
        }


        let listesSenat = [];
        let listesSenatCount = [];
        let listesSenatColor = [];


        for (let parrain of candidat.Parrains) {
          let indexMandat = this.MANDATS.indexOf(parrain.Mandat);
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

          if (parrain.Liste != '') {
            if (listes.indexOf(parrain.Liste) > -1) {
              listesCount[listes.indexOf(parrain.Liste)]++;
            } else {
              listes.push(parrain.Liste);
              listesCount.push(1);
              listesColor.push(this.randomColor());
            }
          }


          if (parrain.GroupeSenat != '') {
            if (listesSenat.indexOf(parrain.GroupeSenat) > -1) {
              listesSenatCount[listesSenat.indexOf(parrain.GroupeSenat)]++;
            } else {
              listesSenat.push(parrain.GroupeSenat);
              listesSenatCount.push(1);
              listesSenatColor.push(this.randomColor());
            }
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

        for (let i in this.MANDATS) {
          this.mandats[i] += " (" + mandatsCount[i] + ")"
        }



        for (let i in departements) {
          departements[i] += " (" + departementCount[i] + ")"
        }

        this.mandats.datasets[0].data = mandatsCount;
        this.mandats.datasets[0].backgroundColor = mandatsColor;

        this.departement.labels = departements;
        this.departement.datasets[0].data = departementCount;
        this.departement.datasets[0].backgroundColor = departementColor;


        this.dates.label = dates;
        this.dates.datasets[0].data = dateCount;
        this.dates.datasets[1].data = datesPogressCount;

        this.listes.labels = listes;
        this.listes.datasets[0].data = listesCount;
        this.listes.datasets[0].backgroundColor = listesColor;

        this.listesSenat.labels = listesSenat;
        this.listesSenat.datasets[0].data = listesSenatCount;
        this.listesSenat.datasets[0].backgroundColor = listesSenatColor;

        if (this.chartMandats != null) {
          this.chartMandats.refresh();
        }
        if (this.chartDates != null) {
          this.chartDates.refresh();
        }
        if (this.chartDepartements != null) {
          this.chartDepartements.refresh();
        }
        if (this.chartListes != null) {
          this.chartListes.refresh();
        }

        if (candidat.Parrains.length < 2) {
          this.parrainStr = "";
        } else {
          this.parrainStr = "s";
        }
        this.candidat = candidat;
      }
    });

  }

  ngOnInit() { }

  randomColor() {
    var val = Math.floor(Math.random() * 16777215).toString(16);
    while (val.length < 6) {
      val = "0" + val;
    }
    return "#" + val;
  }

}
