import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutComponent } from './layout.component';
import { MapModule } from '../map/map.module';

@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, MapModule],
  exports: [LayoutComponent],
})
export class LayoutModule {}
