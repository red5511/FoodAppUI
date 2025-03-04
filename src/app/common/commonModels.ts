import { Address, OrderProductDto } from '../services/models';

export type WHAT_TO_DO_CODES =
  | 'BON_PRINT'
  | 'KASA_FISKALNA'
  | 'MARK_ORDER_AS_ACTIVE';

export interface CartSummaryModel {
  orderProducts?: OrderProductDto[];
  whatToDoCodes: WHAT_TO_DO_CODES[];
  paymentMethod?: 'Gotówka' | 'Karta';
  isTakeaway?: 'Tak' | 'Nie';
  delivery?: 'Tak' | 'Nie';
  desctiption?: string;
  executionDateTime?: Date;
  deliveryPrice?: number;
  deliveryAddress?: Address;
  deliveryNote?: string;
}

export interface OrderProcessOption {
  name: string;
  active: boolean;
  code: WHAT_TO_DO_CODES;
  warningText?: string;
  warning?: boolean;
  ownDisabled?: boolean;
}

export interface CartModel {
  orderProducts: OrderProductDto[];
  modifiedOrderId?: number;
  isDelivery?: boolean;
  deliveryPrice?: number;
  deliveryAddress?: Address
  isTakeawayOption?: boolean
  isModification?: boolean
}
