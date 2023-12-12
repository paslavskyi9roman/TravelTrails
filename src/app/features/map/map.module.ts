import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from 'src/app/features/map/components/map/map.component';

@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
  ],
  exports: [MapComponent]
})
export class MapModule { }
