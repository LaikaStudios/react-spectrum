/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

// Portions of the code in this file are based on code from ICU.
// Original licensing can be found in the NOTICE file in the root directory of this source tree.

import {CalendarDate} from '../CalendarDate';
import {GregorianCalendar} from './GregorianCalendar';
import {Mutable} from '../utils';

const TAIWAN_ERA_START = 1911;

function gregorianYear(date: CalendarDate) {
  return date.era === 'minguo'
    ? date.year + TAIWAN_ERA_START
    : 1 - date.year + TAIWAN_ERA_START;
}

function gregorianToTaiwan(year: number, date: Mutable<CalendarDate>) {
  let y = year - TAIWAN_ERA_START;
  if (y > 0) {
    date.era = 'minguo';
    date.year = y;
  } else {
    date.era = 'before_minguo';
    date.year = 1 - y;
  }
}

export class TaiwanCalendar extends GregorianCalendar {
  identifier = 'roc'; // Republic of China

  fromJulianDay(jd: number): CalendarDate {
    let date = super.fromJulianDay(jd) as Mutable<CalendarDate>;
    gregorianToTaiwan(date.year, date);
    return date;
  }

  toJulianDay(date: CalendarDate) {
    return super.toJulianDay(
      new CalendarDate(
        gregorianYear(date),
        date.month,
        date.day
      )
    );
  }

  getCurrentEra() {
    return 'minguo';
  }

  balanceDate(date: Mutable<CalendarDate>) {
    gregorianToTaiwan(gregorianYear(date), date);
  }

  addYears(date: Mutable<CalendarDate>, years: number) {
    if (date.era === 'before_minguo') {
      years = -years;
    }

    date.year += years;
  }
}
