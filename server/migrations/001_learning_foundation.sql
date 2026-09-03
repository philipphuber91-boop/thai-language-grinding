CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thai TEXT NOT NULL,
  romanization TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (thai)
);

CREATE TABLE word_meanings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  german TEXT NOT NULL,
  context TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_word_meanings_word_id
  ON word_meanings(word_id);

CREATE TABLE sentences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thai TEXT NOT NULL,
  german TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sentence_word_occurrences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sentence_id UUID NOT NULL REFERENCES sentences(id) ON DELETE CASCADE,
  word_id UUID NOT NULL REFERENCES words(id) ON DELETE RESTRICT,
  position INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sentence_word_occurrences_sentence_id
  ON sentence_word_occurrences(sentence_id);

CREATE INDEX idx_sentence_word_occurrences_word_id
  ON sentence_word_occurrences(word_id);

CREATE TABLE learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id TEXT NOT NULL,
  word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'new',
  correct_count INTEGER NOT NULL DEFAULT 0,
  incorrect_count INTEGER NOT NULL DEFAULT 0,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (learner_id, word_id)
);

CREATE TABLE review_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id TEXT NOT NULL,
  word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  due_at TIMESTAMPTZ NOT NULL,
  interval_days INTEGER NOT NULL DEFAULT 0,
  ease_factor NUMERIC(4,2) NOT NULL DEFAULT 2.50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (learner_id, word_id)
);
