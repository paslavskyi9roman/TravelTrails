import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapComponent } from './map.component';
import { SelectedCountriesComponent } from './components/selected-countries/selected-countries.component';

@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule, SelectedCountriesComponent,
  ],
  exports: [MapComponent]
})
export class MapModule { }
