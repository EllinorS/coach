-------------------
-- ROLES
-------------------
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name ENUM('SUPER_ADMIN','COACH','ASSISTANT') NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO roles (name, description) VALUES
('SUPER_ADMIN','Full access to dashboard'),
('COACH','Content and bookings management'),
('ASSISTANT','Read only bookings');

-------------------
-- USERS
-------------------
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verify_token VARCHAR(36),
  reset_token VARCHAR(36),
  avatar_media_id INT NULL,
  is_active TINYINT(1) DEFAULT 1,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  INDEX idx_email (email),
  INDEX idx_verify (verify_token),
  INDEX idx_reset (reset_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-------------------
-- MEDIA (VERSION PROPRE + SCALABLE)
-------------------
CREATE TABLE media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  folder VARCHAR(255),
  storage_disk VARCHAR(50) DEFAULT 'local',
  mime_type VARCHAR(100),
  file_hash CHAR(64),
  size_bytes INT,
  alt VARCHAR(255),
  uploaded_by INT,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_uploaded_by (uploaded_by),
  INDEX idx_hash (file_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-------------------
-- LESSON TYPES
-------------------
CREATE TABLE lesson_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(500),
  is_active TINYINT(1) DEFAULT 1,
  position INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-------------------
-- LESSONS
-------------------
CREATE TABLE lessons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lesson_type_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  short_desc VARCHAR(500),
  price DECIMAL(10,2) NOT NULL,
  deposit_amount DECIMAL(10,2) NOT NULL,
  duration_minutes INT NOT NULL,
  max_participants INT NOT NULL,
  level ENUM('ALL','BEGINNER','INTERMEDIATE','ADVANCED') DEFAULT 'ALL',
  is_visible TINYINT(1) DEFAULT 1,
  position INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lesson_type_id) REFERENCES lesson_types(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-------------------
-- LESSON MEDIA
-------------------
CREATE TABLE lesson_media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lesson_id INT NOT NULL,
  media_id INT NOT NULL,
  is_cover TINYINT(1) DEFAULT 0,
  position INT DEFAULT 0,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-------------------
-- TIME SLOTS
-------------------
CREATE TABLE time_slots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lesson_id INT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  spots_total INT NOT NULL,
  spots_taken INT DEFAULT 0,
  is_cancelled TINYINT(1) DEFAULT 0,
  cancel_reason VARCHAR(500),
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id),
  INDEX idx_date (date),
  INDEX idx_lesson_date (lesson_id,date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-------------------
-- BOOKINGS
-------------------
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slot_id INT NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50),
  client_country VARCHAR(100),
  participants INT DEFAULT 1,
  status ENUM('PENDING','CONFIRMED','CANCELLED') DEFAULT 'PENDING',
  cancel_reason VARCHAR(500),
  notes TEXT,
  internal_notes TEXT,
  payment_status ENUM('UNPAID','DEPOSIT_PAID','FULLY_PAID','REFUNDED') DEFAULT 'UNPAID',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (slot_id) REFERENCES time_slots(id),
  INDEX idx_slot (slot_id),
  INDEX idx_email (client_email),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-------------------
-- PAYMENTS
-------------------
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NZD',
  type ENUM('DEPOSIT','BALANCE') NOT NULL,
  method ENUM('STRIPE','ON_SITE','BANK_TRANSFER') NOT NULL,
  status ENUM('PENDING','PAID','FAILED','REFUNDED') DEFAULT 'PENDING',
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  paid_at DATETIME,
  refunded_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  INDEX idx_booking (booking_id),
  INDEX idx_stripe_intent (stripe_payment_intent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-------------------
-- TRIP REQUESTS
-------------------
CREATE TABLE surf_trip_requests (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  first_name  VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  phone       VARCHAR(50),
  country     VARCHAR(100),
  duration    VARCHAR(100),
  period      VARCHAR(100),
  group_size  INT,
  budget      ENUM('BUDGET','MEDIUM','COMFORT','LUXURY'),
  wants_video TINYINT(1)  DEFAULT 0,
  status      ENUM('NEW','CONTACTED','IN_PROGRESS','QUOTED','CLOSED','CANCELLED') DEFAULT 'NEW',
  coach_notes TEXT,
  quoted_at   DATETIME,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_email (email)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-------------------
-- QUIZ QUESTIONS
-------------------

CREATE TABLE quiz_questions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  key_name    VARCHAR(100) NOT NULL UNIQUE,
  label       TEXT         NOT NULL,
  type        ENUM('SINGLE','MULTIPLE','RANK','TEXT') NOT NULL,
  section     VARCHAR(100),
  is_required TINYINT(1)  DEFAULT 1,
  is_active   TINYINT(1)  DEFAULT 1,
  position    INT         DEFAULT 0,
  created_at  DATETIME    DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-------------------
-- QUIZ ANSWERS OPTIONS
-------------------

CREATE TABLE quiz_options (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT          NOT NULL,
  label       TEXT         NOT NULL,
  value       VARCHAR(100) NOT NULL,
  position    INT          DEFAULT 0,
  is_active   TINYINT(1)   DEFAULT 1
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-------------------
-- QUIZ USERS ANSWERS
-------------------
CREATE TABLE quiz_answers (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  request_id  INT  NOT NULL,
  question_id INT  NOT NULL,
  text_value  TEXT,
  INDEX idx_request (request_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE quiz_answer_options (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  answer_id INT  NOT NULL,
  option_id INT  NOT NULL,
  rank      INT  NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-------------------
-- REVIEWS
-------------------
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  client_country VARCHAR(100),
  client_photo_media_id INT NULL,
  content TEXT NOT NULL,
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  product_type ENUM('COURSE','TRIP','GENERAL') NOT NULL,
  source VARCHAR(100),
  is_visible TINYINT(1) DEFAULT 1,
  position INT DEFAULT 0,
  review_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-------------------
-- SITE CONTENT
-------------------
CREATE TABLE site_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  key_name VARCHAR(100) NOT NULL UNIQUE,
  value TEXT,
  media_id INT NULL,
  type ENUM('TEXT','RICHTEXT','IMAGE_URL','NUMBER') DEFAULT 'TEXT',
  page VARCHAR(50),
  label VARCHAR(255),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-------------------
-- FOREIGN KEYS AJOUTÉES APRÈS (CIRCULAIRES)
-------------------
ALTER TABLE media
ADD CONSTRAINT fk_media_user
FOREIGN KEY (uploaded_by)
REFERENCES users(id)
ON DELETE SET NULL;

ALTER TABLE users
ADD CONSTRAINT fk_users_avatar
FOREIGN KEY (avatar_media_id)
REFERENCES media(id)
ON DELETE SET NULL;

ALTER TABLE reviews
ADD CONSTRAINT fk_reviews_media
FOREIGN KEY (client_photo_media_id)
REFERENCES media(id)
ON DELETE SET NULL;

ALTER TABLE site_content
ADD CONSTRAINT fk_sitecontent_media
FOREIGN KEY (media_id)
REFERENCES media(id)
ON DELETE SET NULL;

ALTER TABLE quiz_options
ADD CONSTRAINT fk_options_question
FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE;

ALTER TABLE quiz_answers
ADD CONSTRAINT fk_answers_request
FOREIGN KEY (request_id) REFERENCES surf_trip_requests(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_answers_question
FOREIGN KEY (question_id) REFERENCES quiz_questions(id);

ALTER TABLE quiz_answer_options
ADD CONSTRAINT fk_answer_options_answer
FOREIGN KEY (answer_id) REFERENCES quiz_answers(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_answer_options_option
FOREIGN KEY (option_id) REFERENCES quiz_options(id);







------------------- BASIC INSERTS ----------------------


INSERT INTO lesson_types (name, slug, description, position) VALUES
('Cours de groupe', 'group',    'Sessions collectives, max 6 personnes', 1),
('Cours privé',     'private',  'Session individuelle ou en duo',        2),
('Coaching',        'coaching', 'Programme sur plusieurs séances',       3);


INSERT INTO quiz_questions (key_name, label, type, section, position) VALUES
('surf_level',       'How would you describe your surfing level?',                        'SINGLE',   'Surfing Level & Experience', 1),
('surf_frequency',   'How often do you surf?',                                            'SINGLE',   'Surfing Level & Experience', 2),
('wave_comfort',     'What type of waves are you most comfortable with?',                 'SINGLE',   'Surfing Level & Experience', 3),
('experiences',      'Do you have experience with any of the following?',                 'MULTIPLE', 'Surfing Level & Experience', 4),
('board_type',       'What board do you usually ride?',                                   'SINGLE',   'Surfing Level & Experience', 5),
('trip_style',       'What kind of trip experience are you looking for?',                 'SINGLE',   'Trip Style & Expectations',  6),
('adventure_level',  'How adventurous do you want the itinerary to be?',                 'SINGLE',   'Trip Style & Expectations',  7),
('wave_size',        'What size waves are you hoping to surf on this trip?',              'SINGLE',   'Trip Style & Expectations',  8),
('travel_with',      'Are you traveling with...?',                                        'MULTIPLE', 'Trip Style & Expectations',  9),
('trip_priorities',  'What matters most to you on this trip?',                            'RANK',     'Trip Style & Expectations',  10),
('best_experience',  'Tell us about your best or worst surf experience so far.',          'TEXT',     'Your Story',                 11),
('ocean_confidence', 'Is there anything we should know about your confidence level in the ocean?', 'TEXT', 'Your Story',           12);


-- Q1 — Surf level
INSERT INTO quiz_options (question_id, label, value, position) VALUES
(1, 'Beginner — learning to paddle, stand up, or catch white-water waves', 'BEGINNER',           1),
(1, 'Lower-intermediate — catching small green waves, working on turns',   'LOWER_INTERMEDIATE', 2),
(1, 'Intermediate — confident in most beach breaks',                       'INTERMEDIATE',       3),
(1, 'Advanced — comfortable in bigger surf and reef breaks',               'ADVANCED',           4),
(1, 'Expert — regularly surf powerful waves / barrels',                    'EXPERT',             5);

-- Q2 — Surf frequency
INSERT INTO quiz_options (question_id, label, value, position) VALUES
(2, 'First surf trip / rarely surf', 'FIRST_TIME',       1),
(2, 'A few times a year',            'FEW_TIMES_YEAR',   2),
(2, '1–2 times per month',           'ONCE_TWICE_MONTH', 3),
(2, '1–2 times per week',            'ONCE_TWICE_WEEK',  4),
(2, 'Almost every day',              'ALMOST_DAILY',     5);

-- Q3 — Wave comfort
INSERT INTO quiz_options (question_id, label, value, position) VALUES
(3, 'Small & mellow',                        'SMALL_MELLOW', 1),
(3, 'Fun and playful beach breaks',          'BEACH_BREAK',  2),
(3, 'Consistent intermediate waves',         'INTERMEDIATE', 3),
(3, 'Powerful waves and bigger swells',      'POWERFUL',     4),
(3, 'I''m flexible — depends on conditions', 'FLEXIBLE',     5);

-- Q4 — Experiences
INSERT INTO quiz_options (question_id, label, value, position) VALUES
(4, 'Rip currents',                       'RIP_CURRENTS', 1),
(4, 'Reef breaks',                        'REEF_BREAKS',  2),
(4, 'Point breaks',                       'POINT_BREAKS', 3),
(4, 'Long paddle outs',                   'LONG_PADDLE',  4),
(4, 'None of the above / still learning', 'NONE',         5);

-- Q5 — Board type
INSERT INTO quiz_options (question_id, label, value, position) VALUES
(5, 'Soft-top / foamie',                       'SOFT_TOP',   1),
(5, 'Longboard',                               'LONGBOARD',  2),
(5, 'Funboard',                                'FUNBOARD',   3),
(5, 'Shortboard',                              'SHORTBOARD', 4),
(5, 'Multiple boards depending on conditions', 'MULTIPLE',   5);

-- Q6 — Trip style
INSERT INTO quiz_options (question_id, label, value, position) VALUES
(6, 'Relaxed & family-friendly',      'RELAXED_FAMILY',      1),
(6, 'Surf & chill with friends',      'SURF_CHILL_FRIENDS',  2),
(6, 'Surf-focused performance trip',  'PERFORMANCE',         3),
(6, 'Road-trip adventure & discovery','ROAD_TRIP_ADVENTURE', 4),
(6, 'Romantic / couple escape',       'ROMANTIC_COUPLE',     5),
(6, 'Solo traveler social vibe',      'SOLO_SOCIAL',         6);

-- Q7 — Adventure level
INSERT INTO quiz_options (question_id, label, value, position) VALUES
(7, 'Mostly comfort — easy access spots & short drives',  'COMFORT',     1),
(7, 'Balanced — mix of comfort & exploration',            'BALANCED',    2),
(7, 'Adventurous — hidden spots & longer road-trip legs', 'ADVENTUROUS', 3);

-- Q8 — Wave size
INSERT INTO quiz_options (question_id, label, value, position) VALUES
(8, '1–2 ft — small & safe',      'ONE_TWO_FT',     1),
(8, '2–3 ft — fun & friendly',    'TWO_THREE_FT',   2),
(8, '3–5 ft — intermediate',      'THREE_FIVE_FT',  3),
(8, '5–7 ft — powerful surf',     'FIVE_SEVEN_FT',  4),
(8, 'I''ll follow your guidance', 'FOLLOW_GUIDANCE',5);

-- Q9 — Travel with
INSERT INTO quiz_options (question_id, label, value, position) VALUES
(9, 'Partner',              'PARTNER',         1),
(9, 'Friends group',        'FRIENDS',         2),
(9, 'Family with children', 'FAMILY_CHILDREN', 3),
(9, 'Solo',                 'SOLO',            4),
(9, 'Other',                'OTHER',           5);

-- Q10 — Trip priorities
INSERT INTO quiz_options (question_id, label, value, position) VALUES
(10, 'Progressing my surf skills',    'PROGRESSION',    1),
(10, 'Finding uncrowded surf spots',  'UNCROWDED_SPOTS',2),
(10, 'Scenic road-trip experience',   'SCENIC_ROAD',    3),
(10, 'Local culture & nature',        'CULTURE_NATURE', 4),
(10, 'Comfort & easy logistics',      'COMFORT',        5),
(10, 'Budget-friendly trip',          'BUDGET',         6);




INSERT INTO site_content (key_name, value, type, page, label) VALUES
-- HOME
('hero_title',           'Surf la Nouvelle-Zélande', 'TEXT',      'home',    'Titre hero'),
('hero_subtitle',        '',                          'TEXT',      'home',    'Sous-titre hero'),
('hero_video_url',       NULL,                        'IMAGE_URL', 'home',    'Vidéo ou photo hero'),
('home_intro_text',      '',                          'RICHTEXT',  'home',    'Texte intro coach'),
('home_intro_photo',     NULL,                        'IMAGE_URL', 'home',    'Photo intro coach'),
-- ABOUT
('about_intro',          '',                          'RICHTEXT',  'about',   'Texte introduction'),
('about_photo',          NULL,                        'IMAGE_URL', 'about',   'Photo principale'),
('about_method_text',    '',                          'RICHTEXT',  'about',   'Texte méthode'),
('about_certifications', '',                          'TEXT',      'about',   'Certifications'),
-- SPOTS
('spot_1_name',          'Raglan',                    'TEXT',      'about',   'Spot 1 - Nom'),
('spot_1_quote',         '',                          'TEXT',      'about',   'Spot 1 - Citation'),
('spot_1_image',         NULL,                        'IMAGE_URL', 'about',   'Spot 1 - Photo'),
('spot_2_name',          'Piha',                      'TEXT',      'about',   'Spot 2 - Nom'),
('spot_2_quote',         '',                          'TEXT',      'about',   'Spot 2 - Citation'),
('spot_2_image',         NULL,                        'IMAGE_URL', 'about',   'Spot 2 - Photo'),
('spot_3_name',          'Gisborne',                  'TEXT',      'about',   'Spot 3 - Nom'),
('spot_3_quote',         '',                          'TEXT',      'about',   'Spot 3 - Citation'),
('spot_3_image',         NULL,                        'IMAGE_URL', 'about',   'Spot 3 - Photo'),
-- SURF TRIP
('trip_intro',            '',                         'RICHTEXT',  'trip',    'Texte intro surf trip'),
('trip_photo',            NULL,                       'IMAGE_URL', 'trip',    'Photo hero surf trip'),
('trip_itinerary_1_name', 'Côte ouest',               'TEXT',      'trip',    'Itinéraire 1 - Nom'),
('trip_itinerary_1_desc', '',                         'TEXT',      'trip',    'Itinéraire 1 - Description'),
('trip_itinerary_1_img',  NULL,                       'IMAGE_URL', 'trip',    'Itinéraire 1 - Photo'),
('trip_itinerary_2_name', 'Côte est',                 'TEXT',      'trip',    'Itinéraire 2 - Nom'),
('trip_itinerary_2_desc', '',                         'TEXT',      'trip',    'Itinéraire 2 - Description'),
('trip_itinerary_2_img',  NULL,                       'IMAGE_URL', 'trip',    'Itinéraire 2 - Photo'),
('trip_itinerary_3_name', 'Extrême nord',             'TEXT',      'trip',    'Itinéraire 3 - Nom'),
('trip_itinerary_3_desc', '',                         'TEXT',      'trip',    'Itinéraire 3 - Description'),
('trip_itinerary_3_img',  NULL,                       'IMAGE_URL', 'trip',    'Itinéraire 3 - Photo'),
-- CONTACT
('contact_whatsapp',      '',                         'TEXT',      'contact', 'Numéro WhatsApp'),
('contact_email',         '',                         'TEXT',      'contact', 'Email'),
('contact_instagram',     '',                         'TEXT',      'contact', 'Instagram URL'),
('contact_zone',          '',                         'TEXT',      'contact', 'Zone principale'),
('contact_languages',     '',                         'TEXT',      'contact', 'Langues parlées'),
('contact_response_time', '',                         'TEXT',      'contact', 'Délai de réponse'),
('cancel_policy',         '',                         'RICHTEXT',  'contact', 'Politique annulation');


