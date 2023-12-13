import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapComponent } from './map.component';
import { SelectedCountriesComponent } from './components/selected-countries/selected-countries.component';
import { ModalComponent } from './components/modal/modal.component';
import { ClickOutsideDirective } from 'src/app/directives/outsideClick.directive';

@NgModule({
  declarations: [MapComponent, ClickOutsideDirective],
  imports: [
    CommonModule, SelectedCountriesComponent, ModalComponent,
  ],
  exports: [MapComponent]
})
export class MapModule { }
