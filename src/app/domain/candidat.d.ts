/// <reference path="./parrain.d.ts" />
import {Parrain} from './parrain';

export class Candidat {
    Nom: string;
    Parrains: Parrain[];

    public constructor(Nom: string, Parrain: Parrain[])

    slug(): string;
    peutEtreCandidat() : boolean;
    estEgocentrique(): boolean;

}
