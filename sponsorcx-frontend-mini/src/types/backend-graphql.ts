import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: Record<string, unknown>; output: Record<string, unknown>; }
};

export enum AlertType {
  Schedule = 'SCHEDULE',
  Threshold = 'THRESHOLD'
}

export enum AttachmentType {
  Csv = 'CSV',
  Excel = 'EXCEL',
  Pdf = 'PDF'
}

export enum ChartType {
  Area = 'AREA',
  Bar = 'BAR',
  Heatmap = 'HEATMAP',
  HorizontalBar = 'HORIZONTAL_BAR',
  HorizontalStackedBar = 'HORIZONTAL_STACKED_BAR',
  Kpi = 'KPI',
  Line = 'LINE',
  Pie = 'PIE',
  Scatter = 'SCATTER',
  StackedBar = 'STACKED_BAR',
  Table = 'TABLE'
}

export type CreateKpiScheduleInput = {
  alertName: Scalars['String']['input'];
  attachmentType?: InputMaybe<AttachmentType>;
  comment?: InputMaybe<Scalars['String']['input']>;
  createdById: Scalars['ID']['input'];
  dashboardId: Scalars['ID']['input'];
  excludeWeekends?: InputMaybe<Scalars['Boolean']['input']>;
  frequencyInterval: FrequencyInterval;
  gatingCondition?: InputMaybe<Scalars['JSON']['input']>;
  graphId?: InputMaybe<Scalars['ID']['input']>;
  hasGatingCondition?: InputMaybe<Scalars['Boolean']['input']>;
  hourInterval?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  minuteInterval?: InputMaybe<Scalars['Int']['input']>;
  monthDates?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  recipients?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  scheduleHour?: InputMaybe<Scalars['Int']['input']>;
  scheduleMinute?: InputMaybe<Scalars['Int']['input']>;
  selectedDays?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  timeZone?: InputMaybe<Scalars['String']['input']>;
};

export type CreateKpiThresholdInput = {
  alertName: Scalars['String']['input'];
  comment?: InputMaybe<Scalars['String']['input']>;
  condition: ThresholdCondition;
  createdById: Scalars['ID']['input'];
  dashboardId: Scalars['ID']['input'];
  graphId?: InputMaybe<Scalars['ID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  recipients?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  thresholdValue: Scalars['Float']['input'];
  timeZone?: InputMaybe<Scalars['String']['input']>;
};

export type CubeDimension = {
  __typename?: 'CubeDimension';
  description?: Maybe<Scalars['String']['output']>;
  isVisible: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  primaryKey: Scalars['Boolean']['output'];
  public: Scalars['Boolean']['output'];
  shortTitle: Scalars['String']['output'];
  suggestFilterValues: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type CubeDimensionValues = {
  __typename?: 'CubeDimensionValues';
  values: Array<Maybe<Scalars['String']['output']>>;
};

export type CubeDrillMembersGrouped = {
  __typename?: 'CubeDrillMembersGrouped';
  dimensions: Array<Maybe<Scalars['String']['output']>>;
  measures: Array<Maybe<Scalars['String']['output']>>;
};

export type CubeMeasure = {
  __typename?: 'CubeMeasure';
  aggType: Scalars['String']['output'];
  cumulative: Scalars['Boolean']['output'];
  cumulativeTotal: Scalars['Boolean']['output'];
  drillMembers: Array<Maybe<Scalars['String']['output']>>;
  drillMembersGrouped: CubeDrillMembersGrouped;
  format?: Maybe<Scalars['String']['output']>;
  isVisible: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  public: Scalars['Boolean']['output'];
  shortTitle: Scalars['String']['output'];
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type CubeMeta = {
  __typename?: 'CubeMeta';
  connectedComponent: Scalars['Int']['output'];
  dimensions: Array<CubeDimension>;
  folders: Array<Maybe<Scalars['JSON']['output']>>;
  hierarchies: Array<Maybe<Scalars['JSON']['output']>>;
  isVisible: Scalars['Boolean']['output'];
  measures: Array<CubeMeasure>;
  name: Scalars['String']['output'];
  nestedFolders: Array<Maybe<Scalars['JSON']['output']>>;
  public: Scalars['Boolean']['output'];
  segments: Array<CubeSegment>;
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type CubeMetadata = {
  __typename?: 'CubeMetadata';
  cubes: Array<CubeMeta>;
};

export type CubeSchema = {
  __typename?: 'CubeSchema';
  operators: Array<Maybe<Scalars['String']['output']>>;
};

export type CubeSegment = {
  __typename?: 'CubeSegment';
  isVisible: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  public: Scalars['Boolean']['output'];
  shortTitle: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type Dashboard = {
  __typename?: 'Dashboard';
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  layout: LayoutType;
  name: Scalars['String']['output'];
  organizationId?: Maybe<Scalars['ID']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type DashboardFilter = {
  __typename?: 'DashboardFilter';
  activeFilters?: Maybe<Scalars['JSON']['output']>;
  availableFields?: Maybe<Scalars['JSON']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  dashboardId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  selectedViews?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type DashboardFilterInput = {
  activeFilters?: InputMaybe<Scalars['JSON']['input']>;
  availableFields?: InputMaybe<Scalars['JSON']['input']>;
  selectedViews?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type DashboardGridItem = {
  __typename?: 'DashboardGridItem';
  dashboardId: Scalars['ID']['output'];
  displayOrder?: Maybe<Scalars['Int']['output']>;
  graph?: Maybe<Graph>;
  graphId: Scalars['ID']['output'];
  gridColumn?: Maybe<Scalars['Int']['output']>;
  gridHeight?: Maybe<Scalars['Int']['output']>;
  gridRow?: Maybe<Scalars['Int']['output']>;
  gridWidth?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
};

export type DashboardGridItemInput = {
  displayOrder?: InputMaybe<Scalars['Int']['input']>;
  graphId: Scalars['ID']['input'];
  gridColumn?: InputMaybe<Scalars['Int']['input']>;
  gridHeight?: InputMaybe<Scalars['Int']['input']>;
  gridRow?: InputMaybe<Scalars['Int']['input']>;
  gridWidth?: InputMaybe<Scalars['Int']['input']>;
};

export type DashboardInput = {
  layout: LayoutType;
  name: Scalars['String']['input'];
};

export enum FrequencyInterval {
  Day = 'DAY',
  Hour = 'HOUR',
  Month = 'MONTH',
  NMinute = 'N_MINUTE',
  Week = 'WEEK'
}

export type Graph = {
  __typename?: 'Graph';
  chartTitle: Scalars['String']['output'];
  chartType: ChartType;
  colorPalette?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  dates?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  dimensions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  filters?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  kpiLabel?: Maybe<Scalars['String']['output']>;
  kpiSecondaryLabel?: Maybe<Scalars['String']['output']>;
  kpiSecondaryValue?: Maybe<Scalars['Float']['output']>;
  kpiShowTrend?: Maybe<Scalars['Boolean']['output']>;
  kpiTrendPercentage?: Maybe<Scalars['Float']['output']>;
  kpiValue?: Maybe<Scalars['Float']['output']>;
  legendPosition?: Maybe<LegendPosition>;
  maxDataPoints?: Maybe<Scalars['Int']['output']>;
  measures?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  name: Scalars['String']['output'];
  numberFormat?: Maybe<NumberFormat>;
  numberPrecision?: Maybe<Scalars['Int']['output']>;
  orderByDirection?: Maybe<SortOrder>;
  orderByField?: Maybe<Scalars['String']['output']>;
  organizationId?: Maybe<Scalars['ID']['output']>;
  primaryColor?: Maybe<Scalars['String']['output']>;
  primaryDimension?: Maybe<Scalars['String']['output']>;
  secondaryDimension?: Maybe<Scalars['String']['output']>;
  selectedMeasure?: Maybe<Scalars['String']['output']>;
  showGridLines?: Maybe<Scalars['Boolean']['output']>;
  showRegressionLine?: Maybe<Scalars['Boolean']['output']>;
  showXAxisGridLines?: Maybe<Scalars['Boolean']['output']>;
  showYAxisGridLines?: Maybe<Scalars['Boolean']['output']>;
  sortOrder?: Maybe<SortOrder>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  viewName: Scalars['String']['output'];
  xAxisLabel?: Maybe<Scalars['String']['output']>;
  yAxisLabel?: Maybe<Scalars['String']['output']>;
};

export type GraphInput = {
  chartTitle: Scalars['String']['input'];
  chartType: ChartType;
  colorPalette?: InputMaybe<Scalars['String']['input']>;
  dates?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  dimensions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  filters?: InputMaybe<Scalars['JSON']['input']>;
  kpiLabel?: InputMaybe<Scalars['String']['input']>;
  kpiSecondaryLabel?: InputMaybe<Scalars['String']['input']>;
  kpiSecondaryValue?: InputMaybe<Scalars['Float']['input']>;
  kpiShowTrend?: InputMaybe<Scalars['Boolean']['input']>;
  kpiTrendPercentage?: InputMaybe<Scalars['Float']['input']>;
  kpiValue?: InputMaybe<Scalars['Float']['input']>;
  legendPosition?: InputMaybe<LegendPosition>;
  maxDataPoints?: InputMaybe<Scalars['Int']['input']>;
  measures?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name: Scalars['String']['input'];
  numberFormat?: InputMaybe<NumberFormat>;
  numberPrecision?: InputMaybe<Scalars['Int']['input']>;
  orderByDirection?: InputMaybe<SortOrder>;
  orderByField?: InputMaybe<Scalars['String']['input']>;
  primaryColor?: InputMaybe<Scalars['String']['input']>;
  primaryDimension?: InputMaybe<Scalars['String']['input']>;
  secondaryDimension?: InputMaybe<Scalars['String']['input']>;
  selectedMeasure?: InputMaybe<Scalars['String']['input']>;
  showGridLines?: InputMaybe<Scalars['Boolean']['input']>;
  showRegressionLine?: InputMaybe<Scalars['Boolean']['input']>;
  showXAxisGridLines?: InputMaybe<Scalars['Boolean']['input']>;
  showYAxisGridLines?: InputMaybe<Scalars['Boolean']['input']>;
  sortOrder?: InputMaybe<SortOrder>;
  viewName: Scalars['String']['input'];
  xAxisLabel?: InputMaybe<Scalars['String']['input']>;
  yAxisLabel?: InputMaybe<Scalars['String']['input']>;
};

export type KpiAlert = {
  __typename?: 'KpiAlert';
  alertName: Scalars['String']['output'];
  alertType: AlertType;
  comment?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdById: Scalars['ID']['output'];
  cronJobId: Scalars['ID']['output'];
  dashboardId: Scalars['ID']['output'];
  graphId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  organizationId: Scalars['ID']['output'];
  recipients?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type KpiSchedule = {
  __typename?: 'KpiSchedule';
  alert: KpiAlert;
  attachmentType?: Maybe<AttachmentType>;
  cronExpression?: Maybe<Scalars['String']['output']>;
  excludeWeekends?: Maybe<Scalars['Boolean']['output']>;
  frequencyInterval: FrequencyInterval;
  gatingCondition?: Maybe<Scalars['JSON']['output']>;
  hasGatingCondition?: Maybe<Scalars['Boolean']['output']>;
  hourInterval?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  kpiAlertId: Scalars['ID']['output'];
  minuteInterval?: Maybe<Scalars['Int']['output']>;
  monthDates?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  scheduleHour?: Maybe<Scalars['Int']['output']>;
  scheduleMinute?: Maybe<Scalars['Int']['output']>;
  selectedDays?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  timeZone?: Maybe<Scalars['String']['output']>;
};

export type KpiThreshold = {
  __typename?: 'KpiThreshold';
  alert: KpiAlert;
  condition: ThresholdCondition;
  id: Scalars['ID']['output'];
  kpiAlertId: Scalars['ID']['output'];
  thresholdValue: Scalars['Float']['output'];
  timeZone?: Maybe<Scalars['String']['output']>;
};

export enum LayoutType {
  Grid = 'GRID',
  List = 'LIST'
}

export enum LegendPosition {
  Bottom = 'BOTTOM',
  None = 'NONE',
  Top = 'TOP'
}

export type Mutation = {
  __typename?: 'Mutation';
  addDashboardGridItem?: Maybe<DashboardGridItem>;
  clearDashboardFilter?: Maybe<DashboardFilter>;
  createDashboard?: Maybe<Dashboard>;
  createGraph?: Maybe<Graph>;
  createKpiSchedule?: Maybe<KpiSchedule>;
  createKpiThreshold?: Maybe<KpiThreshold>;
  deleteDashboard?: Maybe<Dashboard>;
  deleteGraph?: Maybe<Graph>;
  deleteKpiSchedule?: Maybe<Scalars['Boolean']['output']>;
  deleteKpiThreshold?: Maybe<Scalars['Boolean']['output']>;
  removeDashboardGridItem?: Maybe<DashboardGridItem>;
  saveDashboardFilter?: Maybe<DashboardFilter>;
  toggleKpiScheduleActive?: Maybe<KpiSchedule>;
  toggleKpiThresholdActive?: Maybe<KpiThreshold>;
  updateDashboard?: Maybe<Dashboard>;
  updateDashboardGridItem?: Maybe<DashboardGridItem>;
  updateGraph?: Maybe<Graph>;
};


export type MutationAddDashboardGridItemArgs = {
  dashboardId: Scalars['ID']['input'];
  input: DashboardGridItemInput;
};


export type MutationClearDashboardFilterArgs = {
  dashboardId: Scalars['ID']['input'];
};


export type MutationCreateDashboardArgs = {
  input: DashboardInput;
  organizationId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationCreateGraphArgs = {
  input: GraphInput;
  organizationId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationCreateKpiScheduleArgs = {
  input: CreateKpiScheduleInput;
  organizationId: Scalars['ID']['input'];
};


export type MutationCreateKpiThresholdArgs = {
  input: CreateKpiThresholdInput;
  organizationId: Scalars['ID']['input'];
};


export type MutationDeleteDashboardArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteGraphArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteKpiScheduleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteKpiThresholdArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveDashboardGridItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSaveDashboardFilterArgs = {
  dashboardId: Scalars['ID']['input'];
  input: DashboardFilterInput;
};


export type MutationToggleKpiScheduleActiveArgs = {
  id: Scalars['ID']['input'];
  isActive: Scalars['Boolean']['input'];
};


export type MutationToggleKpiThresholdActiveArgs = {
  id: Scalars['ID']['input'];
  isActive: Scalars['Boolean']['input'];
};


export type MutationUpdateDashboardArgs = {
  id: Scalars['ID']['input'];
  input: DashboardInput;
};


export type MutationUpdateDashboardGridItemArgs = {
  id: Scalars['ID']['input'];
  input: DashboardGridItemInput;
};


export type MutationUpdateGraphArgs = {
  id: Scalars['ID']['input'];
  input: GraphInput;
};

export enum NumberFormat {
  Abbreviated = 'ABBREVIATED',
  Currency = 'CURRENCY',
  Number = 'NUMBER',
  Percentage = 'PERCENTAGE'
}

export type Query = {
  __typename?: 'Query';
  cubeDimensionValues?: Maybe<CubeDimensionValues>;
  cubeMetadata?: Maybe<CubeMetadata>;
  cubeQuery?: Maybe<Scalars['JSON']['output']>;
  cubeSchema?: Maybe<CubeSchema>;
  dashboard?: Maybe<Dashboard>;
  dashboardFilter?: Maybe<DashboardFilter>;
  dashboardGridItems?: Maybe<Array<Maybe<DashboardGridItem>>>;
  dashboards?: Maybe<Array<Maybe<Dashboard>>>;
  graph?: Maybe<Graph>;
  graphs?: Maybe<Array<Maybe<Graph>>>;
  hello?: Maybe<Scalars['String']['output']>;
  kpiSchedulesByGraph?: Maybe<Array<Maybe<KpiSchedule>>>;
  kpiThresholdsByGraph?: Maybe<Array<Maybe<KpiThreshold>>>;
  status?: Maybe<Scalars['String']['output']>;
};


export type QueryCubeDimensionValuesArgs = {
  dimension: Scalars['String']['input'];
  view: Scalars['String']['input'];
};


export type QueryCubeQueryArgs = {
  query: Scalars['String']['input'];
};


export type QueryDashboardArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDashboardFilterArgs = {
  dashboardId: Scalars['ID']['input'];
};


export type QueryDashboardGridItemsArgs = {
  dashboardId: Scalars['ID']['input'];
};


export type QueryDashboardsArgs = {
  organizationId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGraphArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGraphsArgs = {
  organizationId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryKpiSchedulesByGraphArgs = {
  graphId: Scalars['ID']['input'];
};


export type QueryKpiThresholdsByGraphArgs = {
  graphId: Scalars['ID']['input'];
};

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export enum ThresholdCondition {
  EqualTo = 'EQUAL_TO',
  GreaterThan = 'GREATER_THAN',
  GreaterThanOrEqual = 'GREATER_THAN_OR_EQUAL',
  LessThan = 'LESS_THAN',
  LessThanOrEqual = 'LESS_THAN_OR_EQUAL',
  NotEqualTo = 'NOT_EQUAL_TO'
}

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AlertType: AlertType;
  AttachmentType: AttachmentType;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ChartType: ChartType;
  CreateKpiScheduleInput: CreateKpiScheduleInput;
  CreateKpiThresholdInput: CreateKpiThresholdInput;
  CubeDimension: ResolverTypeWrapper<CubeDimension>;
  CubeDimensionValues: ResolverTypeWrapper<CubeDimensionValues>;
  CubeDrillMembersGrouped: ResolverTypeWrapper<CubeDrillMembersGrouped>;
  CubeMeasure: ResolverTypeWrapper<CubeMeasure>;
  CubeMeta: ResolverTypeWrapper<CubeMeta>;
  CubeMetadata: ResolverTypeWrapper<CubeMetadata>;
  CubeSchema: ResolverTypeWrapper<CubeSchema>;
  CubeSegment: ResolverTypeWrapper<CubeSegment>;
  Dashboard: ResolverTypeWrapper<Dashboard>;
  DashboardFilter: ResolverTypeWrapper<DashboardFilter>;
  DashboardFilterInput: DashboardFilterInput;
  DashboardGridItem: ResolverTypeWrapper<DashboardGridItem>;
  DashboardGridItemInput: DashboardGridItemInput;
  DashboardInput: DashboardInput;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  FrequencyInterval: FrequencyInterval;
  Graph: ResolverTypeWrapper<Graph>;
  GraphInput: GraphInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  KpiAlert: ResolverTypeWrapper<KpiAlert>;
  KpiSchedule: ResolverTypeWrapper<KpiSchedule>;
  KpiThreshold: ResolverTypeWrapper<KpiThreshold>;
  LayoutType: LayoutType;
  LegendPosition: LegendPosition;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  NumberFormat: NumberFormat;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  SortOrder: SortOrder;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  ThresholdCondition: ThresholdCondition;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  CreateKpiScheduleInput: CreateKpiScheduleInput;
  CreateKpiThresholdInput: CreateKpiThresholdInput;
  CubeDimension: CubeDimension;
  CubeDimensionValues: CubeDimensionValues;
  CubeDrillMembersGrouped: CubeDrillMembersGrouped;
  CubeMeasure: CubeMeasure;
  CubeMeta: CubeMeta;
  CubeMetadata: CubeMetadata;
  CubeSchema: CubeSchema;
  CubeSegment: CubeSegment;
  Dashboard: Dashboard;
  DashboardFilter: DashboardFilter;
  DashboardFilterInput: DashboardFilterInput;
  DashboardGridItem: DashboardGridItem;
  DashboardGridItemInput: DashboardGridItemInput;
  DashboardInput: DashboardInput;
  Float: Scalars['Float']['output'];
  Graph: Graph;
  GraphInput: GraphInput;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  KpiAlert: KpiAlert;
  KpiSchedule: KpiSchedule;
  KpiThreshold: KpiThreshold;
  Mutation: Record<PropertyKey, never>;
  Query: Record<PropertyKey, never>;
  String: Scalars['String']['output'];
}>;

export type CubeDimensionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CubeDimension'] = ResolversParentTypes['CubeDimension']> = ResolversObject<{
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isVisible?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  primaryKey?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  public?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  shortTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  suggestFilterValues?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type CubeDimensionValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['CubeDimensionValues'] = ResolversParentTypes['CubeDimensionValues']> = ResolversObject<{
  values?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
}>;

export type CubeDrillMembersGroupedResolvers<ContextType = any, ParentType extends ResolversParentTypes['CubeDrillMembersGrouped'] = ResolversParentTypes['CubeDrillMembersGrouped']> = ResolversObject<{
  dimensions?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  measures?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
}>;

export type CubeMeasureResolvers<ContextType = any, ParentType extends ResolversParentTypes['CubeMeasure'] = ResolversParentTypes['CubeMeasure']> = ResolversObject<{
  aggType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cumulative?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  cumulativeTotal?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  drillMembers?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  drillMembersGrouped?: Resolver<ResolversTypes['CubeDrillMembersGrouped'], ParentType, ContextType>;
  format?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isVisible?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  public?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  shortTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type CubeMetaResolvers<ContextType = any, ParentType extends ResolversParentTypes['CubeMeta'] = ResolversParentTypes['CubeMeta']> = ResolversObject<{
  connectedComponent?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  dimensions?: Resolver<Array<ResolversTypes['CubeDimension']>, ParentType, ContextType>;
  folders?: Resolver<Array<Maybe<ResolversTypes['JSON']>>, ParentType, ContextType>;
  hierarchies?: Resolver<Array<Maybe<ResolversTypes['JSON']>>, ParentType, ContextType>;
  isVisible?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  measures?: Resolver<Array<ResolversTypes['CubeMeasure']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nestedFolders?: Resolver<Array<Maybe<ResolversTypes['JSON']>>, ParentType, ContextType>;
  public?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  segments?: Resolver<Array<ResolversTypes['CubeSegment']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type CubeMetadataResolvers<ContextType = any, ParentType extends ResolversParentTypes['CubeMetadata'] = ResolversParentTypes['CubeMetadata']> = ResolversObject<{
  cubes?: Resolver<Array<ResolversTypes['CubeMeta']>, ParentType, ContextType>;
}>;

export type CubeSchemaResolvers<ContextType = any, ParentType extends ResolversParentTypes['CubeSchema'] = ResolversParentTypes['CubeSchema']> = ResolversObject<{
  operators?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
}>;

export type CubeSegmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['CubeSegment'] = ResolversParentTypes['CubeSegment']> = ResolversObject<{
  isVisible?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  public?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  shortTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type DashboardResolvers<ContextType = any, ParentType extends ResolversParentTypes['Dashboard'] = ResolversParentTypes['Dashboard']> = ResolversObject<{
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  layout?: Resolver<ResolversTypes['LayoutType'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type DashboardFilterResolvers<ContextType = any, ParentType extends ResolversParentTypes['DashboardFilter'] = ResolversParentTypes['DashboardFilter']> = ResolversObject<{
  activeFilters?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  availableFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dashboardId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  selectedViews?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type DashboardGridItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['DashboardGridItem'] = ResolversParentTypes['DashboardGridItem']> = ResolversObject<{
  dashboardId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  displayOrder?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  graph?: Resolver<Maybe<ResolversTypes['Graph']>, ParentType, ContextType>;
  graphId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  gridColumn?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  gridHeight?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  gridRow?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  gridWidth?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type GraphResolvers<ContextType = any, ParentType extends ResolversParentTypes['Graph'] = ResolversParentTypes['Graph']> = ResolversObject<{
  chartTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chartType?: Resolver<ResolversTypes['ChartType'], ParentType, ContextType>;
  colorPalette?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dates?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  dimensions?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  filters?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kpiLabel?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  kpiSecondaryLabel?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  kpiSecondaryValue?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  kpiShowTrend?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  kpiTrendPercentage?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  kpiValue?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  legendPosition?: Resolver<Maybe<ResolversTypes['LegendPosition']>, ParentType, ContextType>;
  maxDataPoints?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  measures?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  numberFormat?: Resolver<Maybe<ResolversTypes['NumberFormat']>, ParentType, ContextType>;
  numberPrecision?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  orderByDirection?: Resolver<Maybe<ResolversTypes['SortOrder']>, ParentType, ContextType>;
  orderByField?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  organizationId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  primaryColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  primaryDimension?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  secondaryDimension?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  selectedMeasure?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  showGridLines?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  showRegressionLine?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  showXAxisGridLines?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  showYAxisGridLines?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  sortOrder?: Resolver<Maybe<ResolversTypes['SortOrder']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  viewName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  xAxisLabel?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  yAxisLabel?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type KpiAlertResolvers<ContextType = any, ParentType extends ResolversParentTypes['KpiAlert'] = ResolversParentTypes['KpiAlert']> = ResolversObject<{
  alertName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  alertType?: Resolver<ResolversTypes['AlertType'], ParentType, ContextType>;
  comment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdById?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cronJobId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  dashboardId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  graphId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  organizationId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  recipients?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type KpiScheduleResolvers<ContextType = any, ParentType extends ResolversParentTypes['KpiSchedule'] = ResolversParentTypes['KpiSchedule']> = ResolversObject<{
  alert?: Resolver<ResolversTypes['KpiAlert'], ParentType, ContextType>;
  attachmentType?: Resolver<Maybe<ResolversTypes['AttachmentType']>, ParentType, ContextType>;
  cronExpression?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  excludeWeekends?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  frequencyInterval?: Resolver<ResolversTypes['FrequencyInterval'], ParentType, ContextType>;
  gatingCondition?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  hasGatingCondition?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  hourInterval?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kpiAlertId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  minuteInterval?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  monthDates?: Resolver<Maybe<Array<Maybe<ResolversTypes['Int']>>>, ParentType, ContextType>;
  scheduleHour?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  scheduleMinute?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  selectedDays?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  timeZone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type KpiThresholdResolvers<ContextType = any, ParentType extends ResolversParentTypes['KpiThreshold'] = ResolversParentTypes['KpiThreshold']> = ResolversObject<{
  alert?: Resolver<ResolversTypes['KpiAlert'], ParentType, ContextType>;
  condition?: Resolver<ResolversTypes['ThresholdCondition'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kpiAlertId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  thresholdValue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  timeZone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addDashboardGridItem?: Resolver<Maybe<ResolversTypes['DashboardGridItem']>, ParentType, ContextType, RequireFields<MutationAddDashboardGridItemArgs, 'dashboardId' | 'input'>>;
  clearDashboardFilter?: Resolver<Maybe<ResolversTypes['DashboardFilter']>, ParentType, ContextType, RequireFields<MutationClearDashboardFilterArgs, 'dashboardId'>>;
  createDashboard?: Resolver<Maybe<ResolversTypes['Dashboard']>, ParentType, ContextType, RequireFields<MutationCreateDashboardArgs, 'input'>>;
  createGraph?: Resolver<Maybe<ResolversTypes['Graph']>, ParentType, ContextType, RequireFields<MutationCreateGraphArgs, 'input'>>;
  createKpiSchedule?: Resolver<Maybe<ResolversTypes['KpiSchedule']>, ParentType, ContextType, RequireFields<MutationCreateKpiScheduleArgs, 'input' | 'organizationId'>>;
  createKpiThreshold?: Resolver<Maybe<ResolversTypes['KpiThreshold']>, ParentType, ContextType, RequireFields<MutationCreateKpiThresholdArgs, 'input' | 'organizationId'>>;
  deleteDashboard?: Resolver<Maybe<ResolversTypes['Dashboard']>, ParentType, ContextType, RequireFields<MutationDeleteDashboardArgs, 'id'>>;
  deleteGraph?: Resolver<Maybe<ResolversTypes['Graph']>, ParentType, ContextType, RequireFields<MutationDeleteGraphArgs, 'id'>>;
  deleteKpiSchedule?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteKpiScheduleArgs, 'id'>>;
  deleteKpiThreshold?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteKpiThresholdArgs, 'id'>>;
  removeDashboardGridItem?: Resolver<Maybe<ResolversTypes['DashboardGridItem']>, ParentType, ContextType, RequireFields<MutationRemoveDashboardGridItemArgs, 'id'>>;
  saveDashboardFilter?: Resolver<Maybe<ResolversTypes['DashboardFilter']>, ParentType, ContextType, RequireFields<MutationSaveDashboardFilterArgs, 'dashboardId' | 'input'>>;
  toggleKpiScheduleActive?: Resolver<Maybe<ResolversTypes['KpiSchedule']>, ParentType, ContextType, RequireFields<MutationToggleKpiScheduleActiveArgs, 'id' | 'isActive'>>;
  toggleKpiThresholdActive?: Resolver<Maybe<ResolversTypes['KpiThreshold']>, ParentType, ContextType, RequireFields<MutationToggleKpiThresholdActiveArgs, 'id' | 'isActive'>>;
  updateDashboard?: Resolver<Maybe<ResolversTypes['Dashboard']>, ParentType, ContextType, RequireFields<MutationUpdateDashboardArgs, 'id' | 'input'>>;
  updateDashboardGridItem?: Resolver<Maybe<ResolversTypes['DashboardGridItem']>, ParentType, ContextType, RequireFields<MutationUpdateDashboardGridItemArgs, 'id' | 'input'>>;
  updateGraph?: Resolver<Maybe<ResolversTypes['Graph']>, ParentType, ContextType, RequireFields<MutationUpdateGraphArgs, 'id' | 'input'>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  cubeDimensionValues?: Resolver<Maybe<ResolversTypes['CubeDimensionValues']>, ParentType, ContextType, RequireFields<QueryCubeDimensionValuesArgs, 'dimension' | 'view'>>;
  cubeMetadata?: Resolver<Maybe<ResolversTypes['CubeMetadata']>, ParentType, ContextType>;
  cubeQuery?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<QueryCubeQueryArgs, 'query'>>;
  cubeSchema?: Resolver<Maybe<ResolversTypes['CubeSchema']>, ParentType, ContextType>;
  dashboard?: Resolver<Maybe<ResolversTypes['Dashboard']>, ParentType, ContextType, RequireFields<QueryDashboardArgs, 'id'>>;
  dashboardFilter?: Resolver<Maybe<ResolversTypes['DashboardFilter']>, ParentType, ContextType, RequireFields<QueryDashboardFilterArgs, 'dashboardId'>>;
  dashboardGridItems?: Resolver<Maybe<Array<Maybe<ResolversTypes['DashboardGridItem']>>>, ParentType, ContextType, RequireFields<QueryDashboardGridItemsArgs, 'dashboardId'>>;
  dashboards?: Resolver<Maybe<Array<Maybe<ResolversTypes['Dashboard']>>>, ParentType, ContextType, Partial<QueryDashboardsArgs>>;
  graph?: Resolver<Maybe<ResolversTypes['Graph']>, ParentType, ContextType, RequireFields<QueryGraphArgs, 'id'>>;
  graphs?: Resolver<Maybe<Array<Maybe<ResolversTypes['Graph']>>>, ParentType, ContextType, Partial<QueryGraphsArgs>>;
  hello?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  kpiSchedulesByGraph?: Resolver<Maybe<Array<Maybe<ResolversTypes['KpiSchedule']>>>, ParentType, ContextType, RequireFields<QueryKpiSchedulesByGraphArgs, 'graphId'>>;
  kpiThresholdsByGraph?: Resolver<Maybe<Array<Maybe<ResolversTypes['KpiThreshold']>>>, ParentType, ContextType, RequireFields<QueryKpiThresholdsByGraphArgs, 'graphId'>>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  CubeDimension?: CubeDimensionResolvers<ContextType>;
  CubeDimensionValues?: CubeDimensionValuesResolvers<ContextType>;
  CubeDrillMembersGrouped?: CubeDrillMembersGroupedResolvers<ContextType>;
  CubeMeasure?: CubeMeasureResolvers<ContextType>;
  CubeMeta?: CubeMetaResolvers<ContextType>;
  CubeMetadata?: CubeMetadataResolvers<ContextType>;
  CubeSchema?: CubeSchemaResolvers<ContextType>;
  CubeSegment?: CubeSegmentResolvers<ContextType>;
  Dashboard?: DashboardResolvers<ContextType>;
  DashboardFilter?: DashboardFilterResolvers<ContextType>;
  DashboardGridItem?: DashboardGridItemResolvers<ContextType>;
  Graph?: GraphResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  KpiAlert?: KpiAlertResolvers<ContextType>;
  KpiSchedule?: KpiScheduleResolvers<ContextType>;
  KpiThreshold?: KpiThresholdResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;

