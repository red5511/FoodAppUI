import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ContextService } from '../../services/context/context.service';
import { DeliveryOptionService } from '../../services/services';
import { Address, DeliveryOptionDto, OrderDto } from '../../services/models';
import { Message } from 'primeng/api';
import { Router } from '@angular/router';

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
  deliveryAddress: Address = {};
  approveButtonLabel: string = 'Zatwierdź';
  suggestions: any[] = [];
  deliveryOptions: DeliveryOptionDto[] = [];
  distanceInKilometers: number | undefined;
  summaryMapping: any[] = [];
  deliveryPrice: number | undefined;
  messages: Message[] = [];
  event: any | undefined;
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
  showErrorMessage: boolean = false;

  constructor(
    private contextService: ContextService,
    private deliveryOptionService: DeliveryOptionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.setErrorMessage();
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

  enableGeoLocalization() {
    if (navigator.geolocation) {
      console.log(navigator.geolocation);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          // User granted permission: use their location
          this.shopLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log(this.shopLocation);

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

  setErrorMessage() {
    this.messages = [
      {
        severity: 'error',
        detail: 'Strona wymaga danych geolokalizacyjnych do uruchomienia',
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
          this.enableGeoLocalization();
          this.getSummaryMapping();
        },
        error: () => {
          this.enableGeoLocalization();
        },
      });
  }
  getSummaryMapping() {
    this.summaryMapping = this.deliveryOptions.map((option, index, arr) => {
      // Reverse index: for a 3-element array, indices would be 2,1,0
      const reverseIndex = arr.length - 1 - index;
      return {
        color: this.colors[reverseIndex % this.colors.length],
        deliveryPrice: option.deliveryPrice,
        distance: option.distance,
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
      var radius = (option.distance ?? 0) * 1000;
      new google.maps.Circle({
        strokeColor: this.colors[index % this.colors.length], // Use colors cyclically
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: this.colors[index % this.colors.length],
        fillOpacity: 0.3,
        map: this.map,
        center: this.shopLocation,
        radius,
      });
    });

    // Fit the map bounds to include all circles
    if (this.deliveryOptions.length > 0) {
      this.map.fitBounds(
        new google.maps.Circle({
          center: this.shopLocation,
          radius:
            (this.deliveryOptions[this.deliveryOptions.length - 1].distance ??
              0) * 1000,
        }).getBounds()
      );
    }
  }

  // This method is called as the user types
  onAddressInput(event: any): void {
    this.deliveryAddress = {};
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
    this.deliveryAddress = {};
    if (!event || !event.value.place_id) {
      console.error('Selected place does not have a place_id.');
      return;
    }

    // Set the basic address description
    this.address = event.value.description;
    this.event = event.value;

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
        this.deliveryAddress.postalCode = zipCode;
        this.address = `${event.value.description} ${zipCode}`;

        console.log('place');
        console.log(place);

        const deliveryLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        this.mapGoogleAddress(place);

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

        const applicableOption = this.deliveryOptions.find(
          (option) => this.distanceInKilometers! <= (option.distance ?? 0)
        );
        this.deliveryPrice = applicableOption?.deliveryPrice;
        this.approveButtonLabel = this.deliveryPrice
          ? 'Zatwierdź - ' + this.deliveryPrice + 'zł'
          : 'Zatwierdź - ?zł';
      }
    );
  }

  onApprove() {
    if (this.isEmptyAddress(this.deliveryAddress)) {
      this.deliveryAddress.unstructuredAddress = this.address;
    }
    const order: OrderDto = {
      deliveryAddress: this.deliveryAddress,
      deliveryPrice: this.deliveryPrice,
      delivery: true,
    };
    this.router.navigate(['/restaurant-order/delivery'], {
      queryParams: { order: JSON.stringify(order) },
    });
  }

  isEmptyAddress(address: Address): boolean {
    // Option 1: If the object has no own properties at all:
    if (Object.keys(address).length === 0) {
      return true;
    }
    return false;
  }

  mapGoogleAddress(place: any) {
    if (place.address_components && Array.isArray(place.address_components)) {
      place.address_components.forEach((component: any) => {
        const types: string[] = component.types;

        // Check for street number (e.g., "107")
        if (types.includes('street_number')) {
          this.deliveryAddress.streetNumber = component.long_name;
        }
        // Check for street name (e.g., "Chorzowska")
        else if (types.includes('route') || types.includes('neighborhood')) {
          this.deliveryAddress.street = component.long_name;
        }
        // Check for locality/city (e.g., "Katowice")
        else if (types.includes('locality')) {
          this.deliveryAddress.city = component.long_name;
        }
        // Check for postal code (e.g., "40-101")
        else if (types.includes('postal_code')) {
          let postalCode = component.long_name;
          // If the postal code doesn't include a hyphen, append one.
          if (!postalCode.includes('-')) {
            postalCode += '-';
          }
          this.deliveryAddress.postalCode = postalCode;
        }
        // Check for country (e.g., "Polska")
        else if (types.includes('country')) {
          this.deliveryAddress.country = component.long_name;
        }
      });
    }
  }
}
