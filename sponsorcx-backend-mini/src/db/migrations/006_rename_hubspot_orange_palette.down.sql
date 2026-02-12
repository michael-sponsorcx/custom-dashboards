-- Revert 'hubspotOrange' back to 'hubspot-orange'
UPDATE graphs SET color_palette = 'hubspot-orange' WHERE color_palette = 'hubspotOrange';

ALTER TABLE graphs ALTER COLUMN color_palette SET DEFAULT 'hubspot-orange';
