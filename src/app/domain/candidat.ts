import {Parrain} from './parrain';

export class Candidat {
    Nom: string;
    Parrains: Parrain[];

    public constructor(Nom, Parrain){
        this.Nom = Nom;
        this.Parrains = Parrain;
    }

    slug() : string {
        return this.Nom.replace(' ', '_').toLowerCase();
    }

    premierPub() : string {
        let date = this.Parrains[0].Date_de_publication;
        for(let parrain of this.Parrains){
            if(date > parrain.Date_de_publication){
                date = parrain.Date_de_publication;
            }
        }
        return date;
    }

    peutEtreCandidat() : boolean {
        if(this.Parrains.length < 500) return false;

        let countDeps = {};

        for(let parrain of this.Parrains){
            if(countDeps[parrain.Département] == null){
                countDeps[parrain.Département] = 1;
            }else{
                countDeps[parrain.Département]++;
            }            
        }   
        let nbDeps = 0;
        for(let deps of Object.keys(countDeps)){
            if(countDeps[deps] < (this.Parrains.length * 0.1)){
                nbDeps++;
            }
        }

        return nbDeps > 30;

    }

}
