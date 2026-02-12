-- Revert NOT NULL constraints on grid layout columns

ALTER TABLE dashboard_grid_items
    ALTER COLUMN grid_column DROP NOT NULL,
    ALTER COLUMN grid_column DROP DEFAULT,
    ALTER COLUMN grid_row DROP NOT NULL,
    ALTER COLUMN grid_row DROP DEFAULT,
    ALTER COLUMN grid_width DROP NOT NULL,
    ALTER COLUMN grid_width DROP DEFAULT,
    ALTER COLUMN grid_height DROP NOT NULL,
    ALTER COLUMN grid_height DROP DEFAULT,
    ALTER COLUMN display_order DROP NOT NULL;
