-- Seed the dashboard maintenance feature flag
INSERT INTO feature_flags (name, key, description, default_value, permanent)
VALUES (
    'Dashboard Maintenance Mode',
    'dashboard_maintenance',
    'When enabled, shows a maintenance page instead of the dashboard',
    false,
    true
);
