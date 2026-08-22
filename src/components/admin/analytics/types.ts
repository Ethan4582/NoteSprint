export type TimeRange = "1H" | "24H" | "7D" | "30D" | "90D" | "custom";

export interface AnalyticsKpi {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  iconName: "users" | "eye" | "book" | "clock";
  tooltip: string;
}

export interface VisitorTrendPoint {
  date: string;
  visitors: number;
  pageviews: number;
  sessions: number;
  avgTime: number;
}

export interface StudyActivityPoint {
  date: string;
  flashcardSessions: number;
  articleReads: number;
}

export interface CountryVisitor {
  code: string;
  name: string;
  flag: string;
  visitors: number;
  percentage: number;
}

export interface TopTopic {
  slug: string;
  name: string;
  iconPath: string;
  visitors: number;
  percentage: number;
}

export interface DeviceData {
  name: string;
  value: number;
  fill: string;
}

export interface PeakHourData {
  hour: string;
  activity: number;
}

export interface AnalyticsData {
  timeRange: TimeRange;
  kpis: AnalyticsKpi[];
  trendData: VisitorTrendPoint[];
  studyActivity: StudyActivityPoint[];
  topCountries: CountryVisitor[];
  topTopics: TopTopic[];
  devices: DeviceData[];
  peakHours: PeakHourData[];
}
