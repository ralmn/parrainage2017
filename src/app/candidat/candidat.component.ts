import { Component, OnInit, AfterViewInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { CandidatService } from '../candidat.service';
import { Candidat } from '../domain/candidat';

import { ViewChild } from '@angular/core';
import { UIChart, SelectItem } from "primeng/primeng";

import { AmChartsDirective } from "amcharts3-angular2";


declare var AmCharts: any;


@Component({
  selector: 'app-candidat',
  templateUrl: './candidat.component.html',
  styleUrls: ['./candidat.component.css']
})
export class CandidatComponent implements OnInit, AfterViewInit {

  slug: String;
  parrainStr = "s";
  candidat: Candidat;
  mandats: any = null;

  dates: any = null;
  departement: any = null;
  departementsProgression: any = null;
  listes: any = null;
  listesSenat: any = null;

  mapsOptions: any = null;
  indexArea = {};

  @ViewChild("chartmandats") chartMandats: UIChart;
  @ViewChild("chartdates") chartDates: UIChart;
  @ViewChild("chartdepartements") chartDepartements: UIChart;
  @ViewChild("chartlistes") chartListes: UIChart;
  @ViewChild("chartlistessenat") chartListesSenat: UIChart;
  @ViewChild("chartdepartementsprogression") chartDepartementsProgression: UIChart;
  mapDepartements: any;



  MANDATS = ["Conseiller/ère départemental-e", "Maire", "Maire délégué-e", "Député-e", "Conseiller/ère métropolitain-e de Lyon", "Maire d'arrondissement", "Sénateur/trice", "Conseiller/ère régional-e", "Président-e d'un conseil de communauté de communes", "Membre du Conseil de Paris", "Représentant-e français-e au Parlement européen", "Président-e d'un conseil de métropole", "Membre de l'assemblée de Corse", "Membre élu-e de l'assemblée des Français de l'étranger"];

  mandatsFilter: SelectItem[] = [];

  constructor(private route: ActivatedRoute,
    private router: Router,
    public service: CandidatService
  ) {
    this.mapsOptions = {
      /**
       * this tells amCharts it's a map
       */
      "type": "map",
      "colorSteps": 10,
      "theme": "light",
      /**
       * create data provider object
       * map property is usually the same as the name of the map file.
       * getAreasFromMap indicates that amMap should read all the areas available
       * in the map data and treat them as they are included in your data provider.
       * in case you don't set it to true, all the areas except listed in data
       * provider will be treated as unlisted.
       */
      "dataProvider": {
        "map": "franceDepartmentsHigh",
        "getAreasFromMap": true,
        "zoomLevel": 0.9,
        "areas": []
      },
      "areasSettings": {
        "autoZoom": false,
        "balloonText": "[[title]]: <strong>[[value]]</strong>"
        //"selectedColor": "#CC0000"
      },
      "valueLegend": {
        "right": 1,
        "minValue": "little",
        "maxValue": "a lot!"
      },
      "listeners": [{
        "event": "init",
        "method": (event) => {
          this.updateArea(event);
        }
      }],

    }

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

    this.departementsProgression = {
      options: {
        title: {
          display: true,
          text: "Progression des département",
        },
      },
      labels: [],
      datasets: [
        {
          type: 'line',
          data: [],
          label: "Total",
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


  }

  updateArea(event) {
    var map = event.chart;
    this.mapDepartements = map;
    if (map.dataGenerated)
      return;
    if (map.dataProvider.areas.length === 0) {
      setTimeout(this.updateArea, 100);
      return;
    }
    this.mapsOptions.dataProvider.areas = map.dataProvider.areas;
    for (let i = 0; i < map.dataProvider.areas.length; i++) {
      let area = map.dataProvider.areas[i];
      area.value = 0;
      this.indexArea[area.enTitle] = i;

    }
    console.log("dataProvider", this.mapsOptions.dataProvider)
    if (this.slug != null) {
      this.loadCandidat();

    }

  }

  loadCandidat() {

    this.service.getCandidat(this.slug, (err, candidat) => {
      if (err) {
        console.error(err);

      } else {

        let dates = [];
        let dateCount = [];

        let departementsDate = [];

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
            if (departementsDate[indexData].indexOf(parrain.Département) == -1) {
              departementsDate[indexData].push(parrain.Département);
            }
          } else {
            dates.push(parrain.Date_de_publication);
            dateCount.push(1);
            departementsDate.push([parrain.Département]);
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
  
        let datesPogressSorted = [];
        let datesCountSorted = [];

        let departmentsDateProgress = [];
        let departmentsDateTotal = [];
    
        for (let date of dates.sort()) {
          datesPogress.push(date);
          datesPogressCount.push(0);
          departmentsDateProgress.push(0);
          departmentsDateTotal.push(0);
          datesPogressSorted.push(0);
          datesCountSorted.push(0);
          

        }

        for (let i = 0; i < dates.length; i++) {
          let date = dates[i];
          let indexSort = datesPogress.indexOf(date);
          datesPogressSorted[indexSort] = datesPogress[i];
          //datesCountSorted[i] = dateCount[i];
          if (i < departementsDate.length) {
            departmentsDateProgress[indexSort] = departementsDate[i].length;
            for (let j = 0; j <= i; j++) {
              if (j < departementsDate.length)
                departmentsDateTotal[indexSort] += departementsDate[i].length;
            }
          }
        }

        for (let parrain of candidat.Parrains) {
          let indexData = datesPogress.indexOf(parrain.Date_de_publication);
          if (indexData > -1) {
            datesCountSorted[indexData]++;
            for (let i = indexData; i < datesPogressCount.length; i++) {
              datesPogressCount[i]++;
            }
          }
        }

        for (let i in this.MANDATS) {
          this.mandats[i] += " (" + mandatsCount[i] + ")"
        }

        for (let i = 0; i < departements.length; i++) {
          let name = departements[i];
          let count = departementCount[i];
          let indexDep = this.indexArea[name];
          if (indexDep != null && this.mapsOptions.dataProvider.areas[indexDep].enTitle == name) {
            this.mapsOptions.dataProvider.areas[indexDep].value = count;
          }
        }

        for (let i in departements) {
          departements[i] += " (" + departementCount[i] + ")"
        }

        this.mandats.datasets[0].data = mandatsCount;
        this.mandats.datasets[0].backgroundColor = mandatsColor;

        this.departement.labels = departements;
        this.departement.datasets[0].data = departementCount;
        this.departement.datasets[0].backgroundColor = departementColor;


        this.dates.labels = datesPogress;
        this.dates.datasets[0].data = datesCountSorted;
        this.dates.datasets[1].data = datesPogressCount;


        this.departementsProgression.labels = datesPogress;
        this.departementsProgression.datasets[0].data = departmentsDateTotal;
        this.departementsProgression.datasets[1].data = departmentsDateProgress;

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

        if (this.chartListesSenat != null) {
          this.chartListesSenat.refresh();
        }

        if (this.chartDepartementsProgression != null) {
          this.chartDepartementsProgression.refresh();
        }

        if (candidat.Parrains.length < 2) {
          this.parrainStr = "";
        } else {
          this.parrainStr = "s";
        }
        this.candidat = candidat;

        
        if (this.mapDepartements != null) {
          this.mapDepartements.validateData(); //2fois car yolo
          this.mapDepartements.validateData();
        }

      }
    });


  }



  ngAfterViewInit() {
    this.route.params.subscribe(p => {
      this.slug = p["candidat"];
      this.loadCandidat();

    });
  }

  ngOnInit() {
    //this.renderMap();

  }

  randomColor() {
    var val = Math.floor(Math.random() * 16777215).toString(16);
    while (val.length < 6) {
      val = "0" + val;
    }
    return "#" + val;
  }

}
