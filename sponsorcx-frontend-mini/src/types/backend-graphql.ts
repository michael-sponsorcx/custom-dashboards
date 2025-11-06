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
  JSON: { input: any; output: any; }
};

export enum ChartType {
  Area = 'AREA',
  Bar = 'BAR',
  Heatmap = 'HEATMAP',
  Kpi = 'KPI',
  Line = 'LINE',
  Pie = 'PIE',
  Scatter = 'SCATTER',
  Table = 'TABLE'
}

export type CubeDimensionValues = {
  __typename?: 'CubeDimensionValues';
  values: Array<Maybe<Scalars['String']['output']>>;
};

export type CubeSchema = {
  __typename?: 'CubeSchema';
  operators: Array<Maybe<Scalars['String']['output']>>;
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
  deleteDashboard?: Maybe<Dashboard>;
  deleteGraph?: Maybe<Graph>;
  removeDashboardGridItem?: Maybe<DashboardGridItem>;
  saveDashboardFilter?: Maybe<DashboardFilter>;
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


export type MutationDeleteDashboardArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteGraphArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveDashboardGridItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSaveDashboardFilterArgs = {
  dashboardId: Scalars['ID']['input'];
  input: DashboardFilterInput;
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
  cubeMetadata?: Maybe<Scalars['JSON']['output']>;
  cubeQuery?: Maybe<Scalars['JSON']['output']>;
  cubeSchema?: Maybe<CubeSchema>;
  dashboard?: Maybe<Dashboard>;
  dashboardFilter?: Maybe<DashboardFilter>;
  dashboardGridItems?: Maybe<Array<Maybe<DashboardGridItem>>>;
  dashboards?: Maybe<Array<Maybe<Dashboard>>>;
  graph?: Maybe<Graph>;
  graphs?: Maybe<Array<Maybe<Graph>>>;
  hello?: Maybe<Scalars['String']['output']>;
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

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
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
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ChartType: ChartType;
  CubeDimensionValues: ResolverTypeWrapper<CubeDimensionValues>;
  CubeSchema: ResolverTypeWrapper<CubeSchema>;
  Dashboard: ResolverTypeWrapper<Dashboard>;
  DashboardFilter: ResolverTypeWrapper<DashboardFilter>;
  DashboardFilterInput: DashboardFilterInput;
  DashboardGridItem: ResolverTypeWrapper<DashboardGridItem>;
  DashboardGridItemInput: DashboardGridItemInput;
  DashboardInput: DashboardInput;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Graph: ResolverTypeWrapper<Graph>;
  GraphInput: GraphInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  LayoutType: LayoutType;
  LegendPosition: LegendPosition;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  NumberFormat: NumberFormat;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  SortOrder: SortOrder;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  CubeDimensionValues: CubeDimensionValues;
  CubeSchema: CubeSchema;
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
  Mutation: Record<PropertyKey, never>;
  Query: Record<PropertyKey, never>;
  String: Scalars['String']['output'];
}>;

export type CubeDimensionValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['CubeDimensionValues'] = ResolversParentTypes['CubeDimensionValues']> = ResolversObject<{
  values?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
}>;

export type CubeSchemaResolvers<ContextType = any, ParentType extends ResolversParentTypes['CubeSchema'] = ResolversParentTypes['CubeSchema']> = ResolversObject<{
  operators?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
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

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addDashboardGridItem?: Resolver<Maybe<ResolversTypes['DashboardGridItem']>, ParentType, ContextType, RequireFields<MutationAddDashboardGridItemArgs, 'dashboardId' | 'input'>>;
  clearDashboardFilter?: Resolver<Maybe<ResolversTypes['DashboardFilter']>, ParentType, ContextType, RequireFields<MutationClearDashboardFilterArgs, 'dashboardId'>>;
  createDashboard?: Resolver<Maybe<ResolversTypes['Dashboard']>, ParentType, ContextType, RequireFields<MutationCreateDashboardArgs, 'input'>>;
  createGraph?: Resolver<Maybe<ResolversTypes['Graph']>, ParentType, ContextType, RequireFields<MutationCreateGraphArgs, 'input'>>;
  deleteDashboard?: Resolver<Maybe<ResolversTypes['Dashboard']>, ParentType, ContextType, RequireFields<MutationDeleteDashboardArgs, 'id'>>;
  deleteGraph?: Resolver<Maybe<ResolversTypes['Graph']>, ParentType, ContextType, RequireFields<MutationDeleteGraphArgs, 'id'>>;
  removeDashboardGridItem?: Resolver<Maybe<ResolversTypes['DashboardGridItem']>, ParentType, ContextType, RequireFields<MutationRemoveDashboardGridItemArgs, 'id'>>;
  saveDashboardFilter?: Resolver<Maybe<ResolversTypes['DashboardFilter']>, ParentType, ContextType, RequireFields<MutationSaveDashboardFilterArgs, 'dashboardId' | 'input'>>;
  updateDashboard?: Resolver<Maybe<ResolversTypes['Dashboard']>, ParentType, ContextType, RequireFields<MutationUpdateDashboardArgs, 'id' | 'input'>>;
  updateDashboardGridItem?: Resolver<Maybe<ResolversTypes['DashboardGridItem']>, ParentType, ContextType, RequireFields<MutationUpdateDashboardGridItemArgs, 'id' | 'input'>>;
  updateGraph?: Resolver<Maybe<ResolversTypes['Graph']>, ParentType, ContextType, RequireFields<MutationUpdateGraphArgs, 'id' | 'input'>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  cubeDimensionValues?: Resolver<Maybe<ResolversTypes['CubeDimensionValues']>, ParentType, ContextType, RequireFields<QueryCubeDimensionValuesArgs, 'dimension' | 'view'>>;
  cubeMetadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  cubeQuery?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<QueryCubeQueryArgs, 'query'>>;
  cubeSchema?: Resolver<Maybe<ResolversTypes['CubeSchema']>, ParentType, ContextType>;
  dashboard?: Resolver<Maybe<ResolversTypes['Dashboard']>, ParentType, ContextType, RequireFields<QueryDashboardArgs, 'id'>>;
  dashboardFilter?: Resolver<Maybe<ResolversTypes['DashboardFilter']>, ParentType, ContextType, RequireFields<QueryDashboardFilterArgs, 'dashboardId'>>;
  dashboardGridItems?: Resolver<Maybe<Array<Maybe<ResolversTypes['DashboardGridItem']>>>, ParentType, ContextType, RequireFields<QueryDashboardGridItemsArgs, 'dashboardId'>>;
  dashboards?: Resolver<Maybe<Array<Maybe<ResolversTypes['Dashboard']>>>, ParentType, ContextType, Partial<QueryDashboardsArgs>>;
  graph?: Resolver<Maybe<ResolversTypes['Graph']>, ParentType, ContextType, RequireFields<QueryGraphArgs, 'id'>>;
  graphs?: Resolver<Maybe<Array<Maybe<ResolversTypes['Graph']>>>, ParentType, ContextType, Partial<QueryGraphsArgs>>;
  hello?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  CubeDimensionValues?: CubeDimensionValuesResolvers<ContextType>;
  CubeSchema?: CubeSchemaResolvers<ContextType>;
  Dashboard?: DashboardResolvers<ContextType>;
  DashboardFilter?: DashboardFilterResolvers<ContextType>;
  DashboardGridItem?: DashboardGridItemResolvers<ContextType>;
  Graph?: GraphResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;

