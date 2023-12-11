import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { TooltipComponent } from 'src/app/components/tooltip/tooltip.component';
import { MapComponent } from 'src/app/components/map/map.component';



@NgModule({
  declarations: [MapComponent, LayoutComponent],
  imports: [
    CommonModule, TooltipComponent
  ],
  exports: [LayoutComponent]
})
export class LayoutModule { }
