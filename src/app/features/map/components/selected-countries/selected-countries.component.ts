import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FeatureModel } from 'src/app/models/feature.model';

@Component({
  selector: 'app-selected-countries',
  standalone: true,
  imports: [],
  templateUrl: './selected-countries.component.html',
  styleUrl: './selected-countries.component.scss',
})
export class SelectedCountriesComponent {
  @Input() selectedCountries: Set<FeatureModel>;
  private url: string = 'http://localhost:4200';
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  shareList(): void {
    const selectedFeatureIds: string[] = Array.from(this.selectedCountries).map(
      (feature: FeatureModel) => feature.properties.name,
    );
    const queryParams: { selectedCountries: string } = {
      selectedCountries: selectedFeatureIds.join(','),
    };

    const shareableLink: string = this.router
      .createUrlTree([], { relativeTo: this.route, queryParams })
      .toString();

    this.copyToClipboard(shareableLink);
  }

  copyToClipboard(shareableLink: string): void {
    navigator.clipboard
      .writeText(this.url + shareableLink)
      .then((): void => {
        alert(`Link copied to clipboard: ${this.url + shareableLink}`);
      })
      .catch((error): void => {
        console.error('Failed to copy link to clipboard:', error);
      });
  }
}
