import { OrderProductDto } from '../services/models';

export type WHAT_TO_DO_CODES =
  | 'BON_PRINT'
  | 'KASA_FISKALNA'
  | 'MARK_ORDER_AS_EXECUTED';

export interface CartSummaryModel {
  orderProducts: OrderProductDto[];
  whatToDoCodes?: WHAT_TO_DO_CODES[];
  paymentMethod?: 'Gotówka' | 'Karta';
  isTakeaway?: string;
  desctiption?: string;
  executionDateTime?: Date;
}
