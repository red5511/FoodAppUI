/* tslint:disable */
/* eslint-disable */
import { LocalTime } from '../models/local-time';
export interface OpenHours {
  fridayEnd?: LocalTime;
  fridayStart?: LocalTime;
  mondayEnd?: LocalTime;
  mondayStart?: LocalTime;
  saturdayEnd?: LocalTime;
  saturdayStart?: LocalTime;
  sundayEnd?: LocalTime;
  sundayStart?: LocalTime;
  thursdayEnd?: LocalTime;
  thursdayStart?: LocalTime;
  tuesdayEnd?: LocalTime;
  tuesdayStart?: LocalTime;
  wednesdayEnd?: LocalTime;
  wednesdayStart?: LocalTime;
}
