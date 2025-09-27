-- Database optimization script for Sign Language Learning Application
-- This script creates indexes and optimizations for better search performance

-- Create indexes for the Sign table for faster searches
CREATE INDEX IF NOT EXISTS idx_sign_type ON sign(type);
CREATE INDEX IF NOT EXISTS idx_sign_language_level ON sign(language_level);
CREATE INDEX IF NOT EXISTS idx_sign_region ON sign(region);
CREATE INDEX IF NOT EXISTS idx_sign_category_id ON sign(category_id);
CREATE INDEX IF NOT EXISTS idx_sign_created_at ON sign(created_at);

-- Create indexes for sign components for faster component-based searches
CREATE INDEX IF NOT EXISTS idx_sign_hand_shape_id ON sign(hand_shape_id);
CREATE INDEX IF NOT EXISTS idx_sign_location_component_id ON sign(location_component_id);
CREATE INDEX IF NOT EXISTS idx_sign_movement_component_id ON sign(movement_component_id);
CREATE INDEX IF NOT EXISTS idx_sign_palm_orientation_id ON sign(palm_orientation_id);
CREATE INDEX IF NOT EXISTS idx_sign_finger_orientation_id ON sign(finger_orientation_id);
CREATE INDEX IF NOT EXISTS idx_sign_contact_region_id ON sign(contact_region_id);
CREATE INDEX IF NOT EXISTS idx_sign_hand_arrangement_id ON sign(hand_arrangement_id);

-- Create full-text search index for sign translations
CREATE INDEX IF NOT EXISTS idx_sign_translations_lower ON sign_translations(LOWER(translations));
CREATE INDEX IF NOT EXISTS idx_sign_translations_sign_id ON sign_translations(sign_id);

-- Create index for explanation text searches
CREATE INDEX IF NOT EXISTS idx_sign_explanation_lower ON sign(LOWER(explanation));

-- Create indexes for user-related searches
CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_user_classroom_id ON users(classroom_id);

-- Create indexes for category and subject searches
CREATE INDEX IF NOT EXISTS idx_category_name_lower ON category(LOWER(name));
CREATE INDEX IF NOT EXISTS idx_subject_name_lower ON subject(LOWER(name));

-- Create indexes for sign component searches
CREATE INDEX IF NOT EXISTS idx_sign_component_name_lower ON sign_component(LOWER(name));
CREATE INDEX IF NOT EXISTS idx_sign_component_type ON sign_component(type);

-- Create indexes for private collection relationships
CREATE INDEX IF NOT EXISTS idx_private_collection_signs_collection_id ON private_collection_signs(private_collection_id);
CREATE INDEX IF NOT EXISTS idx_private_collection_signs_sign_id ON private_collection_signs(signs_id);

-- Create composite indexes for common search patterns
CREATE INDEX IF NOT EXISTS idx_sign_category_type ON sign(category_id, type);
CREATE INDEX IF NOT EXISTS idx_sign_level_region ON sign(language_level, region);
CREATE INDEX IF NOT EXISTS idx_sign_movement_hand_shape ON sign(movement_component_id, hand_shape_id);

-- Create index for user-subject relationships
CREATE INDEX IF NOT EXISTS idx_user_subjects_user_id ON user_subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subjects_subject_id ON user_subjects(subjects_id);

-- Performance optimization: Create statistics on important tables
ANALYZE sign;
ANALYZE sign_translations;
ANALYZE sign_component;
ANALYZE category;
ANALYZE users;

-- Create view for sign search with pre-joined data for better performance
CREATE OR REPLACE VIEW sign_search_view AS
SELECT
    s.id,
    s.type,
    s.language_level,
    s.region,
    s.explanation,
    s.video_file_name,
    s.created_at,
    c.id as category_id,
    c.name as category_name,
    hs.id as hand_shape_id,
    hs.name as hand_shape_name,
    loc.id as location_id,
    loc.name as location_name,
    mov.id as movement_id,
    mov.name as movement_name,
    po.id as palm_orientation_id,
    po.name as palm_orientation_name,
    fo.id as finger_orientation_id,
    fo.name as finger_orientation_name,
    cr.id as contact_region_id,
    cr.name as contact_region_name,
    ha.id as hand_arrangement_id,
    ha.name as hand_arrangement_name,
    string_agg(st.translations, '|') as all_translations
FROM sign s
LEFT JOIN category c ON s.category_id = c.id
LEFT JOIN sign_component hs ON s.hand_shape_id = hs.id
LEFT JOIN sign_component loc ON s.location_component_id = loc.id
LEFT JOIN sign_component mov ON s.movement_component_id = mov.id
LEFT JOIN sign_component po ON s.palm_orientation_id = po.id
LEFT JOIN sign_component fo ON s.finger_orientation_id = fo.id
LEFT JOIN sign_component cr ON s.contact_region_id = cr.id
LEFT JOIN sign_component ha ON s.hand_arrangement_id = ha.id
LEFT JOIN sign_translations st ON s.id = st.sign_id
GROUP BY
    s.id, s.type, s.language_level, s.region, s.explanation, s.video_file_name, s.created_at,
    c.id, c.name, hs.id, hs.name, loc.id, loc.name, mov.id, mov.name,
    po.id, po.name, fo.id, fo.name, cr.id, cr.name, ha.id, ha.name;

-- Create materialized view for frequently accessed statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS sign_statistics AS
SELECT
    COUNT(*) as total_signs,
    COUNT(DISTINCT category_id) as total_categories,
    COUNT(DISTINCT type) as total_types,
    COUNT(DISTINCT language_level) as total_levels,
    COUNT(DISTINCT region) as total_regions,
    AVG(LENGTH(explanation)) as avg_explanation_length
FROM sign
WHERE created_at >= CURRENT_DATE - INTERVAL '1 year';

-- Create trigger to refresh statistics view periodically
CREATE OR REPLACE FUNCTION refresh_sign_statistics()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW sign_statistics;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to refresh statistics when signs are added/modified
DROP TRIGGER IF EXISTS sign_statistics_refresh ON sign;
CREATE TRIGGER sign_statistics_refresh
    AFTER INSERT OR UPDATE OR DELETE ON sign
    FOR EACH STATEMENT
    EXECUTE FUNCTION refresh_sign_statistics();

-- Create function for fuzzy text search
CREATE OR REPLACE FUNCTION fuzzy_search_translations(query_text TEXT)
RETURNS TABLE(sign_id UUID, translation_text TEXT, similarity_score REAL) AS $$
BEGIN
    RETURN QUERY
    SELECT
        st.sign_id,
        st.translations,
        similarity(LOWER(st.translations), LOWER(query_text)) as score
    FROM sign_translations st
    WHERE similarity(LOWER(st.translations), LOWER(query_text)) > 0.3
    ORDER BY score DESC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql;

-- Enable pg_trgm extension for better text search (if available)
-- This would need to be run by a superuser
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create index using trigram for fuzzy text search (requires pg_trgm)
-- CREATE INDEX IF NOT EXISTS idx_sign_translations_trgm ON sign_translations USING gin (translations gin_trgm_ops);

COMMENT ON INDEX idx_sign_type IS 'Index for filtering signs by type (BASIC, COMPOUND, FINGERSPELLING)';
COMMENT ON INDEX idx_sign_language_level IS 'Index for filtering signs by difficulty level';
COMMENT ON INDEX idx_sign_region IS 'Index for filtering signs by regional variants';
COMMENT ON INDEX idx_sign_category_id IS 'Index for filtering signs by category';
COMMENT ON INDEX idx_sign_translations_lower IS 'Index for case-insensitive translation searches';
COMMENT ON VIEW sign_search_view IS 'Optimized view for sign search with pre-joined component data';
COMMENT ON MATERIALIZED VIEW sign_statistics IS 'Cached statistics for dashboard and analytics';