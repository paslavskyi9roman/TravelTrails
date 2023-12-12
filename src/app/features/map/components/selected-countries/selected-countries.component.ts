import { Component, Input } from '@angular/core';
import { FeatureModel } from 'src/app/models/feature.model';

@Component({
  selector: 'app-selected-countries',
  standalone: true,
  imports: [],
  templateUrl: './selected-countries.component.html',
  styleUrl: './selected-countries.component.scss'
})
export class SelectedCountriesComponent {
  @Input() selectedCountries: Set<FeatureModel>;
}
