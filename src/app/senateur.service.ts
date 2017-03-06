import { Injectable } from '@angular/core';

import { Parrain } from './domain/parrain';

import { Http } from '@angular/http';

@Injectable()
export class SenateurService {

  private senateurs = [];

  constructor(private http: Http) {
    this.http.request('/assets/senateurs.json').subscribe((res) => {
      this.senateurs = (res.json() as any).results;
    })
  }
    
  
  public getGroupeSenateur(parrain: Parrain){
        
      for(let senateur of this.senateurs){
        if(senateur.Etat == "ACTIF" && senateur.Nom_usuel.toUpperCase() == parrain.Nom.toUpperCase() && senateur.Prenom_usuel.toUpperCase() == parrain.Prénom.toUpperCase()){
          parrain.GroupeSenat = senateur.Groupe_politique;
          return senateur.Groupe_politique;
        }
      }

      parrain.GroupeSenat = "";
      return "";
  }  

}
