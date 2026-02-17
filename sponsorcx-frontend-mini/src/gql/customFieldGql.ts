/**
 * CustomField type stubs for Stadium PageHeader filter compatibility.
 * PageHeaderFilters.type.ts imports ObjectType from here.
 */

export enum ObjectType {
  B_ASSET = 'B_ASSET',
  B_ASSET_USAGE_UPDATE = 'B_ASSET_USAGE_UPDATE',
  B_AGREEMENT = 'B_AGREEMENT',
  B_SPONSOR = 'B_SPONSOR',
  B_CONTACT = 'B_CONTACT',
}

export interface CustomField {
  id: string;
  name: string;
  label: string;
  objectType: ObjectType;
  fieldType: string;
  options?: string[];
}
