-- Backfill NULL color_palette values with default
UPDATE graphs SET color_palette = 'hubspot-orange' WHERE color_palette IS NULL;

-- Make color_palette NOT NULL with default
ALTER TABLE graphs
  ALTER COLUMN color_palette SET DEFAULT 'hubspot-orange',
  ALTER COLUMN color_palette SET NOT NULL;
