export interface CubeView {
  name: string;
  title?: string;
}

export interface CubeMeasure {
  name: string;
  title?: string;
  type: string;
}

export interface CubeDimension {
  name: string;
  title?: string;
  type: string;
}

export interface ValidationError {
  type: 'syntax' | 'cube';
  message: string;
}

export interface ValidationWarning {
  type: 'cube';
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}
