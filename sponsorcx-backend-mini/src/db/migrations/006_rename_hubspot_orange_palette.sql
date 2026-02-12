-- Rename 'hubspot-orange' to 'hubspotOrange' for GraphQL enum compatibility
-- (GraphQL enum names cannot contain hyphens)
UPDATE graphs SET color_palette = 'hubspotOrange' WHERE color_palette = 'hubspot-orange';

ALTER TABLE graphs ALTER COLUMN color_palette SET DEFAULT 'hubspotOrange';
