import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';

declare var google: any; // make sure google maps script is loaded

@Component({
  selector: 'app-delivery-ordering',
  templateUrl: './delivery-ordering.component.html',
  styleUrls: ['./delivery-ordering.component.scss'],
})
export class DeliveryOrderingComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  // For PrimeNG p-autoComplete (two-way binding with ngModel)
  address: string = '';
  suggestions: any[] = [];
  distanceInKilometers: number | undefined;

  map: any;
  // Fixed shop location (e.g., Kraków)
  shopLocation = { lat: 50.0647, lng: 19.945 };
  shopMarker: any;
  deliveryMarker: any;

  ngAfterViewInit(): void {
    this.initMap();
  }

  // Initialize the map centered on the shop location
  initMap(): void {
    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      center: this.shopLocation,
      zoom: 12,
      streetViewControl: false,
      mapTypeControl: false,
    });

    // Place a marker for the shop
    this.shopMarker = new google.maps.Marker({
      position: this.shopLocation,
      map: this.map,
      title: 'Restauracja',
    });

    const radiusCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.map,
      center: this.shopLocation,
      radius: 5000, // 5 km radius
    });
    const radiusCircle2 = new google.maps.Circle({
      strokeColor: '#00ffaa',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#00ffaa',
      fillOpacity: 0.35,
      map: this.map,
      center: this.shopLocation,
      radius: 2000, // 5 km radius
    });

    // Fit the map bounds to include the entire circle
    this.map.fitBounds(radiusCircle.getBounds());
  }

  // This method is called as the user types
  onAddressInput(event: any): void {
    if (!event.query) {
      this.suggestions = [];
      return;
    }

    const service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      { input: event.query, types: ['geocode'] },
      (
        predictions: google.maps.places.AutocompletePrediction[] | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          this.suggestions = predictions.filter((p) => p.place_id);
        } else {
          this.suggestions = [];
        }
      }
    );
  }

  onSelectSuggestion(event: any): void {
    if (!event || !event.value.place_id) {
      console.error('Selected place does not have a place_id.');
      return;
    }

    // Set the basic address description
    this.address = event.value.description;

    const placesService = new google.maps.places.PlacesService(this.map);
    placesService.getDetails(
      { placeId: event.value.place_id },
      (place: any, status: any) => {
        if (
          status !== google.maps.places.PlacesServiceStatus.OK ||
          !place.geometry
        ) {
          console.error('Failed to retrieve place details.');
          return;
        }

        // Extract postal code from address components
        const postalComponent = place.address_components.find(
          (component: any) => component.types.includes('postal_code')
        );
        const zipCode =
          postalComponent && postalComponent.long_name?.includes('-')
            ? postalComponent.long_name
            : '';

        this.address = `${event.value.description} ${zipCode}`;

        const deliveryLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        // Remove existing delivery marker if present
        if (this.deliveryMarker) {
          this.deliveryMarker.setMap(null);
        }

        // Place a marker for the delivery address
        this.deliveryMarker = new google.maps.Marker({
          position: deliveryLocation,
          map: this.map,
          title: 'Delivery Address',
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        });

        // Adjust the map bounds to show both markers
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(this.shopLocation);
        bounds.extend(deliveryLocation);
        this.map.fitBounds(bounds);

        const shopLatLng = new google.maps.LatLng(
          this.shopLocation.lat,
          this.shopLocation.lng
        );
        const deliveryLatLng = new google.maps.LatLng(
          deliveryLocation.lat,
          deliveryLocation.lng
        );
        const distanceInMeters =
          google.maps.geometry.spherical.computeDistanceBetween(
            shopLatLng,
            deliveryLatLng
          );
        this.distanceInKilometers =
          Math.round((distanceInMeters / 1000) * 100) / 100;
      }
    );
  }
}
