-- Make graph fields NOT NULL that always have values in practice
-- Backfill any existing NULLs with sensible defaults first

UPDATE graphs SET number_format = 'number' WHERE number_format IS NULL;
UPDATE graphs SET number_precision = 2 WHERE number_precision IS NULL;
UPDATE graphs SET primary_color = '#3b82f6' WHERE primary_color IS NULL;
UPDATE graphs SET sort_order = 'desc' WHERE sort_order IS NULL;
UPDATE graphs SET show_x_axis_grid_lines = true WHERE show_x_axis_grid_lines IS NULL;
UPDATE graphs SET show_y_axis_grid_lines = true WHERE show_y_axis_grid_lines IS NULL;
UPDATE graphs SET show_grid_lines = true WHERE show_grid_lines IS NULL;
UPDATE graphs SET show_regression_line = false WHERE show_regression_line IS NULL;

ALTER TABLE graphs
  ALTER COLUMN number_format SET DEFAULT 'number',
  ALTER COLUMN number_format SET NOT NULL,
  ALTER COLUMN number_precision SET DEFAULT 2,
  ALTER COLUMN number_precision SET NOT NULL,
  ALTER COLUMN primary_color SET DEFAULT '#3b82f6',
  ALTER COLUMN primary_color SET NOT NULL,
  ALTER COLUMN sort_order SET DEFAULT 'desc',
  ALTER COLUMN sort_order SET NOT NULL,
  ALTER COLUMN show_x_axis_grid_lines SET DEFAULT true,
  ALTER COLUMN show_x_axis_grid_lines SET NOT NULL,
  ALTER COLUMN show_y_axis_grid_lines SET DEFAULT true,
  ALTER COLUMN show_y_axis_grid_lines SET NOT NULL,
  ALTER COLUMN show_grid_lines SET DEFAULT true,
  ALTER COLUMN show_grid_lines SET NOT NULL,
  ALTER COLUMN show_regression_line SET DEFAULT false,
  ALTER COLUMN show_regression_line SET NOT NULL;
