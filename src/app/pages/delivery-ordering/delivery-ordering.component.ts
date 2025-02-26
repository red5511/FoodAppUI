import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ContextService } from '../../services/context/context.service';
import { DeliveryOptionService } from '../../services/services';
import { DeliveryOptionDto } from '../../services/models';
import { Message } from 'primeng/api';

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
  deliveryOptions: DeliveryOptionDto[] = [];
  distanceInKilometers: number | undefined;
  summaryMapping: any[] = []
  messages: Message[] = [];
  private destroy$ = new Subject<void>();
  colors: string[] = [
    '#581845', 
    '#C70039', 
    '#FFC300', 
    '#9afa62', 
    '#003554', 
    '#006494', 
    '#0582ca', 
    '#00a6fb', 
  ];  

  map: any;
  // Fixed shop location (e.g., Kraków)
  shopLocation!: google.maps.LatLngLiteral;
  shopMarker: any;
  deliveryMarker: any;
  showErrorMessage: boolean = false

  constructor(private contextService: ContextService,
    private deliveryOptionService: DeliveryOptionService
  ){}
  
  ngOnInit() {
    this.setErrorMessage()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // User granted permission: use their location
          this.shopLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.initMap();
        },
        (error) => {
          // Geolocation error or permission denied: show error message
          this.showErrorMessage = true;
        }
      );
    } else {
      // Browser doesn't support Geolocation: show error message
      this.showErrorMessage = true;
    }
  }

  ngAfterViewInit(): void {
    this.contextService
    .getCompanyIdObservable()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.loadDeliveryOptions();
      },
    });
  }
  
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }

    setErrorMessage(){
      this.messages = [
        {
          severity: 'error',
          detail:
            'Strona wymaga danych geolokalizacyjnych do uruchomienia'        
          },
      ];
    }
  
    loadDeliveryOptions() {
      this.deliveryOptionService
        .getAllDeliveryOptions({
          companyId: this.contextService.getCompanyId() ?? -999,
        })
        .subscribe({
          next: (response) => {
            if (response.deliveryOptions) {
              this.deliveryOptions = response.deliveryOptions;
            }
            this.initMap();
            this.getSummaryMapping()
          },
          error: () => {
            this.initMap();
          }
        });
    }
    getSummaryMapping(){
    this.summaryMapping = this.deliveryOptions.map((option, index, arr) => {
      // Reverse index: for a 3-element array, indices would be 2,1,0
      const reverseIndex = arr.length - 1 - index;
      return {
        color: this.colors[reverseIndex % this.colors.length],
        deliveryPrice: option.deliveryPrice,
        distance: option.distance
      };
    });
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

      const reversedOptions = [...this.deliveryOptions].reverse();

    // Loop over sorted delivery options and create circles
    reversedOptions.forEach((option, index) => {
      new google.maps.Circle({
        strokeColor: this.colors[index % this.colors.length], // Use colors cyclically
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: this.colors[index % this.colors.length],
        fillOpacity: 0.3,
        map: this.map,
        center: this.shopLocation,
        radius: (option.distance ?? 0) * 1000, // convert km to meters
      });
    });
  
    // Fit the map bounds to include all circles
    if (this.deliveryOptions.length > 0) {
      this.map.fitBounds(
        new google.maps.Circle({
          center: this.shopLocation,
          radius: (this.deliveryOptions[this.deliveryOptions.length - 1].distance ?? 0) * 1000,
        }).getBounds()
      );
    }
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
