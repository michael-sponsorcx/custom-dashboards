-- Revert color_palette to nullable with no default
ALTER TABLE graphs
  ALTER COLUMN color_palette DROP DEFAULT,
  ALTER COLUMN color_palette DROP NOT NULL;
