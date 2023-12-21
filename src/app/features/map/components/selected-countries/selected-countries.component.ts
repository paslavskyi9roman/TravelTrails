import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  private url = 'http://localhost:4200';
  private router = inject(Router);
  private route = inject(ActivatedRoute);


  shareList() {
    const selectedFeatureIds = Array.from(this.selectedCountries).map(
      (feature: FeatureModel) => feature.properties.name,
    );
    const queryParams = { selectedCountries: selectedFeatureIds.join(',') };

    const shareableLink = this.router
      .createUrlTree([], { relativeTo: this.route, queryParams })
      .toString();

    this.copyToClipboard(shareableLink);
  }

  copyToClipboard(shareableLink: any) {
    navigator.clipboard
    .writeText(this.url + shareableLink)
    .then(() => {
      alert(`Link copied to clipboard: ${this.url + shareableLink}`);
    })
    .catch((error) => {
      console.error('Failed to copy link to clipboard:', error);
    });
  }
}
