import {Routes,RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {HomePageComponent} from './home-page/home-page.component';
import {CandidatComponent} from './candidat/candidat.component';  

@NgModule({
    imports: [
        RouterModule.forRoot([
            {path: '', component: HomePageComponent},
            { path:'candidat/:candidat', component: CandidatComponent }
        ])    
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}