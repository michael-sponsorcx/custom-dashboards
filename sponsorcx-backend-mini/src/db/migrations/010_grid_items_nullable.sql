-- Make grid layout columns nullable again
-- React Grid Layout handles positioning when values are null

ALTER TABLE dashboard_grid_items
    ALTER COLUMN grid_column DROP NOT NULL,
    ALTER COLUMN grid_row DROP NOT NULL,
    ALTER COLUMN grid_width DROP NOT NULL,
    ALTER COLUMN grid_height DROP NOT NULL,
    ALTER COLUMN display_order DROP NOT NULL;
