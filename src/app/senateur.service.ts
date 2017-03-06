import { Injectable } from '@angular/core';

import { Parrain } from './domain/parrain';

import { Http } from '@angular/http';

@Injectable()
export class SenateurService {

  private senateurs: any[] = [];

  constructor(private http: Http) {
    this.http.request('/assets/senateurs.json').subscribe((res) => {
      let tmpSenateurs = (res.json() as any).results;
      this.senateurs = [];
      for(let senateur of tmpSenateurs){
        if(senateur.Etat == "ACTIF"){
          this.senateurs.push(senateur);
        }
      }
      tmpSenateurs = [];
    })
  }
    
  
  public getGroupeSenateur(parrain: Parrain){
        
      for(let senateur of this.senateurs){
        if(this.removeAccent(senateur.Nom_usuel) == this.removeAccent(parrain.Nom) 
          //&& this.removeAccent(senateur.Prenom_usuel) == this.removeAccent(parrain.Prénom)
          ){
          parrain.GroupeSenat = senateur.Groupe_politique;
          return senateur.Groupe_politique;
        }
      }

      parrain.GroupeSenat = "";
      return "";
  }  

  private removeAccent(str: string){
     var accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g, // C, c
    ];
    var noaccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];
     
    for(var i = 0; i < accent.length; i++){
        str = str.replace(accent[i], noaccent[i]);
    }
     
    return str.replace(/\-/g, ' ').toUpperCase();
  }

}
