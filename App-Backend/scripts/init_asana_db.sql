-- ==========================================================
-- Inner Compass — Asana, Class & Practice Schema
-- Schema: content_schema
-- ==========================================================

CREATE SCHEMA IF NOT EXISTS content_schema;

-- ----------------------------------------------------------
-- 1. ASANAS — Master posture catalog
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_schema.asanas (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100)  NOT NULL,
    english_name    VARCHAR(100)  NOT NULL,
    intent_category VARCHAR(50)   NOT NULL,
    difficulty      VARCHAR(30)   NOT NULL,
    category        VARCHAR(60)   NOT NULL,
    hold_time       VARCHAR(30),
    biomechanics    TEXT,
    model_3d_url    VARCHAR(512),
    thumbnail_url   VARCHAR(512),
    contraindications TEXT[],
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_asanas_intent ON content_schema.asanas(intent_category);
CREATE INDEX IF NOT EXISTS idx_asanas_difficulty ON content_schema.asanas(difficulty);
CREATE INDEX IF NOT EXISTS idx_asanas_name ON content_schema.asanas(name);

-- ----------------------------------------------------------
-- 2. ASANA STEPS — Ordered execution instructions
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_schema.asana_steps (
    id          BIGSERIAL PRIMARY KEY,
    asana_id    BIGINT    NOT NULL REFERENCES content_schema.asanas(id) ON DELETE CASCADE,
    step_order  INTEGER   NOT NULL,
    instruction TEXT      NOT NULL,

    CONSTRAINT uq_asana_step_order UNIQUE (asana_id, step_order)
);

CREATE INDEX IF NOT EXISTS idx_asana_steps_asana ON content_schema.asana_steps(asana_id);

-- ----------------------------------------------------------
-- 3. ASANA MUSCLES — Muscles activated
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_schema.asana_muscles (
    id          BIGSERIAL    PRIMARY KEY,
    asana_id    BIGINT       NOT NULL REFERENCES content_schema.asanas(id) ON DELETE CASCADE,
    muscle_name VARCHAR(100) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_asana_muscles_asana ON content_schema.asana_muscles(asana_id);

-- ----------------------------------------------------------
-- 4. ASANA BENEFITS — Health & cognitive benefits
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_schema.asana_benefits (
    id       BIGSERIAL PRIMARY KEY,
    asana_id BIGINT    NOT NULL REFERENCES content_schema.asanas(id) ON DELETE CASCADE,
    benefit  TEXT      NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_asana_benefits_asana ON content_schema.asana_benefits(asana_id);

-- ----------------------------------------------------------
-- 5. ASANA ALIGNMENT CUES — 360° per-angle checkpoints
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_schema.asana_alignment_cues (
    id            BIGSERIAL   PRIMARY KEY,
    asana_id      BIGINT      NOT NULL REFERENCES content_schema.asanas(id) ON DELETE CASCADE,
    angle_degrees INTEGER     NOT NULL,
    view_label    VARCHAR(60) NOT NULL,
    cue           TEXT        NOT NULL,

    CONSTRAINT chk_angle_range CHECK (angle_degrees >= 0 AND angle_degrees < 360)
);

CREATE INDEX IF NOT EXISTS idx_alignment_cues_asana ON content_schema.asana_alignment_cues(asana_id);

-- ----------------------------------------------------------
-- 6. YOGA CLASSES — Online classes & courses
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_schema.yoga_classes (
    id              BIGSERIAL    PRIMARY KEY,
    title           VARCHAR(150) NOT NULL,
    category        VARCHAR(60)  NOT NULL,
    intent_category VARCHAR(50)  NOT NULL,
    difficulty      VARCHAR(30)  NOT NULL,
    instructor_name VARCHAR(100),
    schedule        VARCHAR(150),
    description     TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_yoga_classes_intent ON content_schema.yoga_classes(intent_category);

-- ----------------------------------------------------------
-- 7. PRACTICE CONFIGS — Intent-based practice presets
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_schema.practice_configs (
    id                   BIGSERIAL   PRIMARY KEY,
    intent_key           VARCHAR(30) NOT NULL UNIQUE,
    title                VARCHAR(60) NOT NULL,
    cognitive_framing    TEXT        NOT NULL,
    asana_id             BIGINT      REFERENCES content_schema.asanas(id),
    breath_inhale_secs   INTEGER     NOT NULL,
    breath_hold_secs     INTEGER     NOT NULL,
    breath_exhale_secs   INTEGER     NOT NULL,
    breath_name          VARCHAR(60) NOT NULL,
    default_duration_secs INTEGER    NOT NULL
);


-- ==========================================================
-- SEED DATA
-- ==========================================================

-- Padmasana (Lotus Pose)
INSERT INTO content_schema.asanas (name, english_name, intent_category, difficulty, category, hold_time, biomechanics, model_3d_url, thumbnail_url, contraindications)
VALUES (
    'Padmasana', 'Lotus Pose', 'Equanimity', 'Intermediate', 'Seated Meditation', '3–10 min',
    'Full lotus requires bilateral hip external rotation (approx. 115°) with knee flexion. The wide base of support through the crossed legs creates a triangular foundation, lowering the center of gravity and reducing muscular effort to maintain an upright spine. Pelvic anterior tilt is minimized when sits bones bear weight evenly.',
    NULL,
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    ARRAY['Knee injury', 'Ankle injury', 'Severe hip tightness']
) ON CONFLICT DO NOTHING;

-- Tadasana (Mountain Pose)
INSERT INTO content_schema.asanas (name, english_name, intent_category, difficulty, category, hold_time, biomechanics, model_3d_url, thumbnail_url, contraindications)
VALUES (
    'Tadasana', 'Mountain Pose', 'Clarity', 'Beginner', 'Standing Foundation', '30s–2 min',
    'Tadasana establishes the biomechanical blueprint for all standing postures. Weight distributes equally across the four corners of each foot (1st metatarsal, 5th metatarsal, medial heel, lateral heel). The pelvis finds neutral via balanced engagement of the rectus abdominis and erector spinae. This "standing meditation" builds proprioceptive body mapping.',
    NULL,
    'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80',
    ARRAY['Severe vertigo', 'Acute lower back pain']
) ON CONFLICT DO NOTHING;

-- Virabhadrasana II (Warrior II)
INSERT INTO content_schema.asanas (name, english_name, intent_category, difficulty, category, hold_time, biomechanics, model_3d_url, thumbnail_url, contraindications)
VALUES (
    'Virabhadrasana II', 'Warrior II', 'Somatic Grounding', 'Beginner–Intermediate', 'Standing Strength', '30s–1 min per side',
    'Warrior II is a frontal-plane-dominant posture requiring hip abduction and external rotation of the front leg with simultaneous hip extension of the rear leg. The wide stance (approx. 3.5–4 feet) creates a stable base while challenging the hip stabilizers. Maintaining a neutral torso between the legs requires balanced engagement of the lateral trunk flexors.',
    NULL,
    'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80',
    ARRAY['Knee injury (front leg)', 'High blood pressure (hold shorter)', 'Hip labral tear']
) ON CONFLICT DO NOTHING;

-- Asana Steps — Padmasana (id=1)
INSERT INTO content_schema.asana_steps (asana_id, step_order, instruction) VALUES
(1, 1, 'Sit on a folded blanket or cushion with legs extended (Dandasana).'),
(1, 2, 'Bend the right knee; cradle the right shin, placing the right foot on the left inner thigh crease.'),
(1, 3, 'Bend the left knee; place the left foot on the right inner thigh crease.'),
(1, 4, 'Press both knees toward the floor. Root the sits bones.'),
(1, 5, 'Elongate the spine from sacrum to crown. Relax the shoulders.'),
(1, 6, 'Place hands in Chin Mudra (thumb & index finger touching) on each knee.'),
(1, 7, 'Soften the gaze or close the eyes. Observe the breath without manipulating it.')
ON CONFLICT DO NOTHING;

-- Asana Steps — Tadasana (id=2)
INSERT INTO content_schema.asana_steps (asana_id, step_order, instruction) VALUES
(2, 1, 'Stand with feet hip-width apart, toes spread. Ground through all four corners of each foot.'),
(2, 2, 'Engage the quadriceps to lift the kneecaps. Do not hyperextend the knees.'),
(2, 3, 'Tilt the pelvis to neutral: draw the tailbone slightly down, lift the pubic bone gently.'),
(2, 4, 'Lengthen the spine from the sacrum through the crown of the head.'),
(2, 5, 'Roll the shoulders up, back, and down. Let the arms hang with palms facing forward.'),
(2, 6, 'Align the ears over the shoulders, shoulders over hips, hips over ankles.'),
(2, 7, 'Soften the jaw and the space between the eyebrows. Breathe naturally.')
ON CONFLICT DO NOTHING;

-- Asana Steps — Virabhadrasana II (id=3)
INSERT INTO content_schema.asana_steps (asana_id, step_order, instruction) VALUES
(3, 1, 'From Tadasana, step the feet 3.5–4 feet apart.'),
(3, 2, 'Turn the right foot out 90°, align the right heel with the left arch.'),
(3, 3, 'Bend the right knee to 90°, stacking it directly over the right ankle.'),
(3, 4, 'Extend both arms out to the sides, parallel to the floor, palms down.'),
(3, 5, 'Keep the torso vertical and centered—do not lean toward the front leg.'),
(3, 6, 'Turn the head to gaze over the right fingertips (Drishti).'),
(3, 7, 'Press firmly through the outer edge of the back foot. Breathe steadily.')
ON CONFLICT DO NOTHING;

-- Muscles — Padmasana
INSERT INTO content_schema.asana_muscles (asana_id, muscle_name) VALUES
(1, 'Hip External Rotators'), (1, 'Erector Spinae'), (1, 'Transverse Abdominis'),
(1, 'Piriformis'), (1, 'Iliopsoas (lengthened)')
ON CONFLICT DO NOTHING;

-- Muscles — Tadasana
INSERT INTO content_schema.asana_muscles (asana_id, muscle_name) VALUES
(2, 'Quadriceps (isometric)'), (2, 'Tibialis Anterior'), (2, 'Erector Spinae'),
(2, 'Core stabilizers'), (2, 'Intrinsic foot muscles')
ON CONFLICT DO NOTHING;

-- Muscles — Virabhadrasana II
INSERT INTO content_schema.asana_muscles (asana_id, muscle_name) VALUES
(3, 'Quadriceps (front leg, eccentric)'), (3, 'Gluteus Medius & Maximus'), (3, 'Adductors'),
(3, 'Deltoids (isometric)'), (3, 'Core obliques')
ON CONFLICT DO NOTHING;

-- Benefits — Padmasana
INSERT INTO content_schema.asana_benefits (asana_id, benefit) VALUES
(1, 'Stimulates parasympathetic nervous system via vagal tone enhancement'),
(1, 'Increases hip joint synovial fluid circulation'),
(1, 'Promotes diaphragmatic breathing by opening anterior ribcage'),
(1, 'Reduces cortisol through sustained stillness and downregulated amygdala activity')
ON CONFLICT DO NOTHING;

-- Benefits — Tadasana
INSERT INTO content_schema.asana_benefits (asana_id, benefit) VALUES
(2, 'Improves postural awareness and proprioception'),
(2, 'Strengthens arches and prevents flat-foot pronation'),
(2, 'Enhances spatial body schema in the somatosensory cortex'),
(2, 'Foundation for all standing asanas—transfers to Vinyasa sequences')
ON CONFLICT DO NOTHING;

-- Benefits — Virabhadrasana II
INSERT INTO content_schema.asana_benefits (asana_id, benefit) VALUES
(3, 'Builds isometric strength and endurance in the lower body'),
(3, 'Increases hip flexibility and range of motion'),
(3, 'Enhances concentration and mental stamina through Drishti (focused gaze)'),
(3, 'Activates the vestibular system for improved balance')
ON CONFLICT DO NOTHING;

-- Alignment Cues — Padmasana (all 8 angles)
INSERT INTO content_schema.asana_alignment_cues (asana_id, angle_degrees, view_label, cue) VALUES
(1, 0,   'Front View',            'Spine erect, crown lifting'),
(1, 0,   'Front View',            'Shoulders relaxed, scapulae neutral'),
(1, 0,   'Front View',            'Hands in Chin Mudra on knees'),
(1, 45,  'Front-Right Oblique',   'Right knee grounded, femur externally rotated'),
(1, 45,  'Front-Right Oblique',   'Right ankle rests on left inner thigh crease'),
(1, 90,  'Right Profile',         'Lumbar lordosis maintained'),
(1, 90,  'Right Profile',         'Ear, shoulder, hip vertically aligned'),
(1, 90,  'Right Profile',         'Ribcage stacked over pelvis'),
(1, 135, 'Rear-Right Oblique',    'Right scapula drawn down, not winging'),
(1, 135, 'Rear-Right Oblique',    'Posterior chain relaxed yet engaged'),
(1, 180, 'Rear View',             'Spine: natural S-curve preserved'),
(1, 180, 'Rear View',             'Sacrum neutral, no posterior tilt'),
(1, 180, 'Rear View',             'Thoracic spine open, not rounded'),
(1, 225, 'Rear-Left Oblique',     'Left scapula mirrors right—symmetry'),
(1, 225, 'Rear-Left Oblique',     'Gluteals softened, sits bones grounded'),
(1, 270, 'Left Profile',          'Left ear over left shoulder'),
(1, 270, 'Left Profile',          'No lateral trunk lean'),
(1, 270, 'Left Profile',          'Pelvic bowl level'),
(1, 315, 'Front-Left Oblique',    'Left knee grounded, femur externally rotated'),
(1, 315, 'Front-Left Oblique',    'Left ankle rests on right inner thigh crease')
ON CONFLICT DO NOTHING;

-- Alignment Cues — Tadasana (all 8 angles)
INSERT INTO content_schema.asana_alignment_cues (asana_id, angle_degrees, view_label, cue) VALUES
(2, 0,   'Front View',            'Feet hip-width, arches lifted'),
(2, 0,   'Front View',            'Kneecaps lifted, thighs engaged'),
(2, 0,   'Front View',            'Arms alongside torso, palms forward'),
(2, 45,  'Front-Right Oblique',   'Right shoulder blade drawn down'),
(2, 45,  'Front-Right Oblique',   'Right arm naturally spiraling outward'),
(2, 90,  'Right Profile',         'Ear → Shoulder → Hip → Ankle aligned'),
(2, 90,  'Right Profile',         'Slight lumbar curve maintained'),
(2, 90,  'Right Profile',         'Chin level, not jutting forward'),
(2, 135, 'Rear-Right Oblique',    'Right trapezius relaxed'),
(2, 135, 'Rear-Right Oblique',    'Scapulae flat against ribcage'),
(2, 180, 'Rear View',             'Spine: vertical plumb line from occiput to sacrum'),
(2, 180, 'Rear View',             'Gluteals gently engaged'),
(2, 180, 'Rear View',             'Heels grounded, Achilles long'),
(2, 225, 'Rear-Left Oblique',     'Left trapezius mirrors right'),
(2, 225, 'Rear-Left Oblique',     'No lateral spinal deviation'),
(2, 270, 'Left Profile',          'Left ear over left shoulder'),
(2, 270, 'Left Profile',          'Pelvis neutral—ASIS & PSIS level'),
(2, 270, 'Left Profile',          'Quadriceps isometrically engaged'),
(2, 315, 'Front-Left Oblique',    'Left arm mirrors right'),
(2, 315, 'Front-Left Oblique',    'Ribcage not flaring forward')
ON CONFLICT DO NOTHING;

-- Alignment Cues — Virabhadrasana II (all 8 angles)
INSERT INTO content_schema.asana_alignment_cues (asana_id, angle_degrees, view_label, cue) VALUES
(3, 0,   'Front View',            'Front knee stacked over front ankle'),
(3, 0,   'Front View',            'Arms extended, parallel to floor'),
(3, 0,   'Front View',            'Torso vertical, not leaning forward'),
(3, 45,  'Front-Right Oblique',   'Right hip externally rotated'),
(3, 45,  'Front-Right Oblique',   'Right thigh approaching parallel to floor'),
(3, 90,  'Right Profile',         'Right knee tracks over 2nd/3rd toe'),
(3, 90,  'Right Profile',         'Torso centered between legs'),
(3, 90,  'Right Profile',         'Gaze (Drishti) over front fingertips'),
(3, 135, 'Rear-Right Oblique',    'Right glute engaged to support external rotation'),
(3, 135, 'Rear-Right Oblique',    'Back leg straight and pressing through outer foot'),
(3, 180, 'Rear View',             'Hips open to side (frontal plane)'),
(3, 180, 'Rear View',             'Back foot at 90° angle to front foot'),
(3, 180, 'Rear View',             'Shoulder blades drawn together and down'),
(3, 225, 'Rear-Left Oblique',     'Left leg fully extended, pressing through heel'),
(3, 225, 'Rear-Left Oblique',     'Left glute stabilizing the pelvis'),
(3, 270, 'Left Profile',          'Back arm extending with energy through fingertips'),
(3, 270, 'Left Profile',          'Ribcage not collapsing to the right'),
(3, 315, 'Front-Left Oblique',    'Front arm reaching forward with intention'),
(3, 315, 'Front-Left Oblique',    'Chest broad and open')
ON CONFLICT DO NOTHING;

-- Yoga Classes
INSERT INTO content_schema.yoga_classes (title, category, intent_category, difficulty, instructor_name, schedule, description) VALUES
('Morning Equanimity Flow', 'Live Online Class', 'Equanimity', 'Beginner', 'Dr. Ananda Sharma', 'Mon, Wed, Fri — 6:00 AM IST', 'A seated-only class focusing on breath anchoring, pelvic grounding, and cognitive reframing for balanced awareness.'),
('Somatic Strength & Grounding', 'Recorded Course', 'Somatic Grounding', 'Intermediate', 'Priya Venkatesh', 'Self-paced — 12 sessions', 'Standing posture series designed to build proprioceptive awareness and muscular endurance through isometric holds.'),
('Rational Clarity Workshop', 'Workshop Series', 'Clarity', 'All Levels', 'Venkat Raghavan', 'Saturdays — 8:00 AM IST', 'Cognitive framing meets standing alignment. Explore how executive attention networks are engaged through precise postural awareness.')
ON CONFLICT DO NOTHING;

-- Practice Configs
INSERT INTO content_schema.practice_configs (intent_key, title, cognitive_framing, asana_id, breath_inhale_secs, breath_hold_secs, breath_exhale_secs, breath_name, default_duration_secs) VALUES
('equanimity', 'Equanimity', 'Equanimity is the balanced awareness that neither clings to pleasant experience nor recoils from discomfort. In this practice, you will observe sensations without reactivity — training the prefrontal cortex to modulate the amygdala''s automatic fight-or-flight cascade. The goal is not to suppress, but to witness.', 1, 4, 7, 8, '4-7-8 Relaxation Breath', 300),
('clarity', 'Clarity', 'Clarity arises when the discursive mind quiets and the prefrontal cortex disengages from default-mode-network rumination. By anchoring attention on a single postural landmark — the vertical alignment of ear over shoulder over hip — you invoke the brain''s executive attention network, replacing mental noise with somatic precision.', 2, 4, 4, 4, 'Box Breath (4-4-4)', 180),
('grounding', 'Somatic Grounding', 'Somatic Grounding reconnects the mind to the body through deliberate muscular engagement and proprioceptive feedback. When the nervous system receives strong sensory input from large muscle groups — quadriceps, gluteals, erector spinae — the cortex shifts from abstract rumination to embodied presence. This is the neurological basis of "feeling grounded."', 3, 5, 2, 5, 'Grounding Breath (5-2-5)', 240)
ON CONFLICT DO NOTHING;
