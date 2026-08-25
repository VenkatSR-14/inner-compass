-- Create content_schema if not exists
CREATE SCHEMA IF NOT EXISTS content_schema;

-- Create short_videos table for Mindful Clips with 10s-60s duration constraint
CREATE TABLE IF NOT EXISTS content_schema.short_videos (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    description TEXT,
    video_url VARCHAR(512) NOT NULL,
    thumbnail_url VARCHAR(512),
    duration_seconds INTEGER NOT NULL,
    intent_category VARCHAR(50) NOT NULL,
    author_id BIGINT NOT NULL,
    author_name VARCHAR(100) DEFAULT 'Inner Compass Guide',
    likes_count BIGINT DEFAULT 0,
    views_count BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_video_duration CHECK (duration_seconds >= 10 AND duration_seconds <= 60),
    CONSTRAINT chk_likes_non_negative CHECK (likes_count >= 0),
    CONSTRAINT chk_views_non_negative CHECK (views_count >= 0)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_short_videos_intent ON content_schema.short_videos(intent_category);
CREATE INDEX IF NOT EXISTS idx_short_videos_created_at ON content_schema.short_videos(created_at DESC);

-- Clear and update initial Mindful Clips with local high-quality Yoga Tutor video
TRUNCATE TABLE content_schema.short_videos RESTART IDENTITY CASCADE;

INSERT INTO content_schema.short_videos (title, description, video_url, thumbnail_url, duration_seconds, intent_category, author_id, author_name, likes_count, views_count)
VALUES 
('Authentic Yoga Practice & Posture Calibration', 'Yoga practitioner demonstrating posture execution, spinal alignment, and breath anchoring.', '/videos/yoga_tutor_demo.mp4', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80', 30, 'Equanimity', 1, 'Yoga Tutor Guide', 142, 1205),
('Standing Postural Plumb Line Calibration', 'Yoga practitioner alignment breakdown for standing posture and pelvic neutrality.', '/videos/yoga_tutor_demo.mp4', 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80', 45, 'Clarity', 1, 'Yoga Tutor Guide', 98, 840),
('Somatic Grounding Posture Hold', 'Yoga practitioner demonstrating grounding posture, hip external rotation, and Drishti gaze.', '/videos/yoga_tutor_demo.mp4', 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80', 25, 'Somatic Grounding', 1, 'Yoga Tutor Guide', 215, 1940);
