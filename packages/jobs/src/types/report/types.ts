/**
 * Report Generation Job Data Interface
 */
export interface ReportJobData {
  reportType: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  userId: string;
  format: 'pdf' | 'excel' | 'csv';
}
