import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapsService } from '../../services/services';

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

  map: any;
  // Fixed shop location (e.g., Kraków)
  shopLocation = { lat: 50.0647, lng: 19.9450 };
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
      mapTypeControl: false
    });

    // Place a marker for the shop
    this.shopMarker = new google.maps.Marker({
      position: this.shopLocation,
      map: this.map,
      title: 'Shop Location'
    });
  }

  // This method is called as the user types
  onAddressInput(event: any): void {
    if (!event.query) {
      this.suggestions = [];
      return;
    }
  
    const service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      { input: event.query, types: ["geocode"] },
      (predictions: google.maps.places.AutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          this.suggestions = predictions.filter(p => p.place_id);
        } else {
          this.suggestions = [];
        }
      }
    );
  }
  
  

  onSelectSuggestion(event: any): void {
    if (!event || !event.place_id) {
      console.error("Selected place does not have a place_id.");
      return;
    }
  
    this.address = event.description;
  
    const placesService = new google.maps.places.PlacesService(this.map);
    placesService.getDetails({ placeId: event.place_id }, (place: any, status: any) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !place.geometry) {
        console.error("Failed to retrieve place details.");
        return;
      }
  
      const deliveryLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
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
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });
  
      // Adjust the map bounds to show both markers
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(this.shopLocation);
      bounds.extend(deliveryLocation);
      this.map.fitBounds(bounds);
    });
  }
  
}