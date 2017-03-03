import { Injectable } from '@angular/core';
import { Candidat } from './domain/candidat';
import { Parrain } from './domain/parrain';

import {Http} from '@angular/http';



@Injectable()
export class CandidatService {

  constructor( private http:Http ) { }

  getCandidats(cb: (error: Error | any, candidats?: Candidat[]) => any) {

   
    

    this.http.request('/data.json').subscribe(response =>{
      
      let realCandidats: Candidat[] = [];

      let jsonData = response.json() as any[];
      for (let candidatRAW of jsonData) {

        let parrains: Parrain[] = [];

        //TODO: tester si on peut pas transformer l'array d'un coup
        for(let rawParrain of candidatRAW["Parrainages"]){
          let parrain = rawParrain as Parrain;
          parrain.Date_de_publication = rawParrain["Date de publication"];
          parrains.push(parrain);
        }

        let candidat = new Candidat(candidatRAW["Candidat-e parrainé-e"], parrains);
          
        realCandidats.push(candidat);
      }

      cb(null, realCandidats);
    });
     
  }

  listCandidats(cb: (error: Error|any, list?: any[]) => any){
    this.getCandidats((err, candidats) => {
      if(err){
        cb(err);
      }else{
        let list: any[] = [];
        for(let candidat of candidats){
          list.push({slug: candidat.slug(), nom: candidat.Nom});
        }
        cb(null, list);
      }
    })
  }

  getCandidat(slug:String, cb: (error: Error|any, candidat?: Candidat) =>  any){
    this.getCandidats((err, candidats) => {
      if(err){
        cb(err);
      }else{
        for(let candidat of candidats){
          if(candidat.slug() == slug){
            cb(null, candidat);
            return;
          }
        }
        cb(new Error("Candidat non trouvé"), null);
      }
    })
  }

}