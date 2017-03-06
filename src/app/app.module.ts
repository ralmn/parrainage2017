import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import {AppRoutingModule} from './app-routing.module';


import { AppComponent } from './app.component';


import { MessagesModule } from 'primeng/primeng';
import { InputTextModule } from 'primeng/primeng';
import { PasswordModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { DataTableModule, SharedModule, MultiSelectModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { ChartModule } from 'primeng/primeng';


import { CandidatService } from './candidat.service';
import { SenateurService } from './senateur.service';
import { HomePageComponent } from './home-page/home-page.component';
import { CandidatComponent } from './candidat/candidat.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    CandidatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ButtonModule,
    MessagesModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    DataTableModule,
    SharedModule,
    DialogModule,
    AppRoutingModule,
    ChartModule,
    MultiSelectModule
  ],
  providers: [CandidatService, SenateurService],
  bootstrap: [AppComponent]
})
export class AppModule { }
