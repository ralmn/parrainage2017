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
}
