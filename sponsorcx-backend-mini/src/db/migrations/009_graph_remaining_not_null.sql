-- Make remaining graph fields NOT NULL where they always have values
-- Stays nullable: kpi_value, kpi_label, kpi_secondary_value, kpi_secondary_label,
--                 kpi_trend_percentage, x_axis_label, y_axis_label, secondary_dimension

-- Backfill NULLs
UPDATE graphs SET measures = '{}' WHERE measures IS NULL;
UPDATE graphs SET dimensions = '{}' WHERE dimensions IS NULL;
UPDATE graphs SET dates = '{}' WHERE dates IS NULL;
UPDATE graphs SET filters = '[]' WHERE filters IS NULL;
UPDATE graphs SET order_by_field = '' WHERE order_by_field IS NULL;
UPDATE graphs SET order_by_direction = 'desc' WHERE order_by_direction IS NULL;
UPDATE graphs SET legend_position = 'bottom' WHERE legend_position IS NULL;
UPDATE graphs SET kpi_show_trend = false WHERE kpi_show_trend IS NULL;
UPDATE graphs SET max_data_points = 50 WHERE max_data_points IS NULL;
UPDATE graphs SET primary_dimension = '' WHERE primary_dimension IS NULL;
UPDATE graphs SET selected_measure = '' WHERE selected_measure IS NULL;

ALTER TABLE graphs
  ALTER COLUMN measures SET DEFAULT '{}',
  ALTER COLUMN measures SET NOT NULL,
  ALTER COLUMN dimensions SET DEFAULT '{}',
  ALTER COLUMN dimensions SET NOT NULL,
  ALTER COLUMN dates SET DEFAULT '{}',
  ALTER COLUMN dates SET NOT NULL,
  ALTER COLUMN filters SET DEFAULT '[]',
  ALTER COLUMN filters SET NOT NULL,
  ALTER COLUMN order_by_field SET DEFAULT '',
  ALTER COLUMN order_by_field SET NOT NULL,
  ALTER COLUMN order_by_direction SET DEFAULT 'desc',
  ALTER COLUMN order_by_direction SET NOT NULL,
  ALTER COLUMN legend_position SET DEFAULT 'bottom',
  ALTER COLUMN legend_position SET NOT NULL,
  ALTER COLUMN kpi_show_trend SET DEFAULT false,
  ALTER COLUMN kpi_show_trend SET NOT NULL,
  ALTER COLUMN max_data_points SET DEFAULT 50,
  ALTER COLUMN max_data_points SET NOT NULL,
  ALTER COLUMN primary_dimension SET DEFAULT '',
  ALTER COLUMN primary_dimension SET NOT NULL,
  ALTER COLUMN selected_measure SET DEFAULT '',
  ALTER COLUMN selected_measure SET NOT NULL;
