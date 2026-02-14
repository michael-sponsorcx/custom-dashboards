import type { KpiScheduleRow, KpiSchedule } from './types';
import { rowToKpiAlert } from '../kpiAlert';

/** Convert a kpi_schedule joined row to camelCase for GraphQL */
export const kpiScheduleToCamelCase = (row: KpiScheduleRow): KpiSchedule => ({
    id: row.schedule_id,
    kpiAlertId: row.kpi_alert_id,
    frequencyInterval: row.frequency_interval,
    minuteInterval: row.minute_interval,
    hourInterval: row.hour_interval,
    scheduleHour: row.schedule_hour,
    scheduleMinute: row.schedule_minute,
    selectedDays: row.selected_days,
    excludeWeekends: row.exclude_weekends,
    monthDates: row.month_dates,
    timeZone: row.time_zone,
    attachmentType: row.attachment_type,
    alert: rowToKpiAlert(row),
});
