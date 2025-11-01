export enum RecurrenceFrequency {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export class RecurrenceEntity {
  frequency: RecurrenceFrequency;
  interval: number;
  endDate: Date | null;

  constructor(recurrence: RecurrenceEntity) {
    Object.assign(this, recurrence);
  }
}
