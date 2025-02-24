import { OrderProductDto } from '../services/models';

export type WHAT_TO_DO_CODES =
  | 'BON_PRINT'
  | 'KASA_FISKALNA'
  | 'MARK_ORDER_AS_EXECUTED';

export interface CartSummaryModel {
  orderProducts?: OrderProductDto[];
  whatToDoCodes?: WHAT_TO_DO_CODES[];
  paymentMethod?: 'Gotówka' | 'Karta';
  isTakeaway?: string;
  desctiption?: string;
  executionDateTime?: Date;
}

export interface OrderProcessOption {
  name: string;
  active: boolean;
  code: WHAT_TO_DO_CODES;
  warningText?: string;
  warning?: boolean;
  disabled?: boolean;
}

export interface CartModel {
  orderProducts: OrderProductDto[];
  modifiedOrderId?: number;
}
