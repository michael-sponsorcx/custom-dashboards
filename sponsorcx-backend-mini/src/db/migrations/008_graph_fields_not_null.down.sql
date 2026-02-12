ALTER TABLE graphs
  ALTER COLUMN number_format DROP NOT NULL,
  ALTER COLUMN number_format DROP DEFAULT,
  ALTER COLUMN number_precision DROP NOT NULL,
  ALTER COLUMN number_precision DROP DEFAULT,
  ALTER COLUMN primary_color DROP NOT NULL,
  ALTER COLUMN primary_color DROP DEFAULT,
  ALTER COLUMN sort_order DROP NOT NULL,
  ALTER COLUMN sort_order DROP DEFAULT,
  ALTER COLUMN show_x_axis_grid_lines DROP NOT NULL,
  ALTER COLUMN show_y_axis_grid_lines DROP NOT NULL,
  ALTER COLUMN show_grid_lines DROP NOT NULL,
  ALTER COLUMN show_regression_line DROP NOT NULL;
