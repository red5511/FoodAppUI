import { Component, Input } from '@angular/core';
import { CreateDeliveryOptionRequest, DeliveryOptionDto } from '../../services/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContextService } from '../../services/context/context.service';
import { DeliveryOptionService } from '../../services/services';
import { ToastrService } from 'ngx-toastr';
import { SaveDeliveryOption$Params } from '../../services/fn/delivery-option/save-delivery-option';

@Component({
  selector: 'app-add-new-delivery-option',
  templateUrl: './add-new-delivery-option.component.html',
  styleUrl: './add-new-delivery-option.component.scss'
})
export class AddNewDeliveryOptionComponent {
  @Input({ required: true })
  deliveryOptions!: DeliveryOptionDto[];
  deliveryOpitionForm!: FormGroup;
  isNewDeliveryOptionButtonVisible: boolean = false
  constructor(
    private fb: FormBuilder,
    private contextService: ContextService,
      private deliveryOptionService: DeliveryOptionService,
    private toastService: ToastrService
  ) {}

  ngOnInit(){
    this.setDefaultDeliveryOptionFromValidations()
  }

  setDefaultDeliveryOptionFromValidations() {
    this.deliveryOpitionForm = this.fb.group({
      newDeliveryOptionRadius: [
        '',
        [Validators.required, this.validatRadiusUniqueness.bind(this)],
      ],
      newDeliveryOptionPrice: [
        ,
        [Validators.required],
      ],
    });
  }

  validatRadiusUniqueness(control: any) {
    if (this.deliveryOptions.map((el) => el.distance).includes(control.value)) {
      return { notUnique: true };
    }
    return null;
  }

  onNewDeliveryOption() {
    if (this.deliveryOpitionForm.valid) {
      const deliveryOption: DeliveryOptionDto = {
        distance: this.deliveryOpitionForm.get('newDeliveryOptionRadius')?.getRawValue(),
      };
      const body: CreateDeliveryOptionRequest = {
        deliveryOption: deliveryOption
      };
      const params: SaveDeliveryOption$Params = {
        body,
        companyId: this.contextService.getCompanyId() ?? -999
      }
          
      this.deliveryOptionService.saveDeliveryOption(params).subscribe({
        next: (response) => {
          if (response.deliveryOption) {
            this.toastService.success('Dodanie przebiegło poprawnie');
            this.deliveryOptions.push(response.deliveryOption);
            this.isNewDeliveryOptionButtonVisible = false;
            this.setDefaultDeliveryOptionFromValidations()
          }
        },
      });
    } else {
      this.markDeliveryOptionFormFieldsTouched();
    }
  }

  capitalizeFirstLetterForDeliveryOption(event: Event, fieldName: string): void {
    const inputElement = event.target as HTMLInputElement; // Explicitly cast to HTMLInputElement
    if (inputElement && inputElement.value) {
      const capitalized =
        inputElement.value.charAt(0).toUpperCase() +
        inputElement.value.slice(1);
      this.deliveryOpitionForm.get(fieldName)?.setValue(capitalized); // Update the form control value
    }
  }

  markDeliveryOptionFormFieldsTouched() {
    Object.keys(this.deliveryOpitionForm.controls).forEach((field) => {
      const control = this.deliveryOpitionForm.get(field);
      if (control) control.markAsTouched();
    });
  }

  isOptionDeliveryFieldInvalid(field: string) {
    return (
      (this.deliveryOpitionForm.get(field)?.hasError('required') &&
        this.deliveryOpitionForm.get(field)?.touched) ||
      (this.deliveryOpitionForm.get(field)?.hasError('notUnique') &&
        this.deliveryOpitionForm.get(field)?.touched)
    );
  }

  onNewDeliveryOptionClick() {
    this.isNewDeliveryOptionButtonVisible = !this.isNewDeliveryOptionButtonVisible;
  }

}
