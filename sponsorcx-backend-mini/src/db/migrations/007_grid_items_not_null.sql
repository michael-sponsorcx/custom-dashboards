-- Make grid layout columns NOT NULL with sensible defaults
-- These fields should always have values for proper grid rendering

UPDATE dashboard_grid_items SET grid_column = 1 WHERE grid_column IS NULL;
UPDATE dashboard_grid_items SET grid_row = 1 WHERE grid_row IS NULL;
UPDATE dashboard_grid_items SET grid_width = 3 WHERE grid_width IS NULL;
UPDATE dashboard_grid_items SET grid_height = 3 WHERE grid_height IS NULL;
UPDATE dashboard_grid_items SET display_order = 0 WHERE display_order IS NULL;

ALTER TABLE dashboard_grid_items
    ALTER COLUMN grid_column SET NOT NULL,
    ALTER COLUMN grid_column SET DEFAULT 1,
    ALTER COLUMN grid_row SET NOT NULL,
    ALTER COLUMN grid_row SET DEFAULT 1,
    ALTER COLUMN grid_width SET NOT NULL,
    ALTER COLUMN grid_width SET DEFAULT 3,
    ALTER COLUMN grid_height SET NOT NULL,
    ALTER COLUMN grid_height SET DEFAULT 3,
    ALTER COLUMN display_order SET NOT NULL;
