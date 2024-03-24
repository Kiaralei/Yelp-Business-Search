import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component'
import { SearchFormComponent } from './components/search-form/search-form.component';
import { BookingComponent } from './components/booking/booking.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material Modules
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import { MatTableModule} from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs'; 
import { MatDividerModule} from '@angular/material/divider';
import { MatListModule} from '@angular/material/list';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchFormComponent,
    BookingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    GoogleMapsModule,
    NgbModule,


  ],
  providers: [
    NgbActiveModal,

  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
