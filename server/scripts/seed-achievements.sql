INSERT INTO achievements (id, title, description, emoji, target_value, category)
VALUES
('first_lesson', 'First Step', 'Complete your first lesson', U&'\+01F463', 1, 'lessons'),
('lesson_rookie', 'Lesson Rookie', 'Complete 5 lessons', U&'\+01F4DA', 5, 'lessons'),
('lesson_grinder', 'Lesson Grinder', 'Complete 20 lessons', U&'\+01F3CB', 20, 'lessons'),
('streak_3', 'Warming Up', 'Build a 3-day study streak', U&'\+01F525', 3, 'streak'),
('streak_7', 'One Week Flame', 'Build a 7-day study streak', U&'\+01F4C5', 7, 'streak'),
('streak_30', 'Monthly Momentum', 'Build a 30-day study streak', U&'\+01F680', 30, 'streak'),
('vocab_10', 'Word Collector', 'Learn or review 10 vocabulary items', U&'\+01F9E0', 10, 'vocabulary'),
('vocab_50', 'Vocabulary Builder', 'Learn or review 50 vocabulary items', U&'\+01F4D6', 50, 'vocabulary'),
('vocab_200', 'Word Bank', 'Learn or review 200 vocabulary items', U&'\+01F3E6', 200, 'vocabulary'),
('xp_100', 'XP Spark', 'Earn 100 XP', U&'\2728', 100, 'xp'),
('xp_500', 'XP Engine', 'Earn 500 XP', U&'\26A1', 500, 'xp'),
('xp_2000', 'XP Legend', 'Earn 2,000 XP', U&'\+01F3C6', 2000, 'xp'),
('hsk_1', 'HSK 1 Clear', 'Complete all active HSK 1 lessons', U&'\+01F396', 1, 'hsk'),
('hsk_2', 'HSK 2 Clear', 'Complete all active HSK 2 lessons', U&'\+01F3D4', 2, 'hsk'),
('perfect_lesson', 'Perfect Lesson', 'Complete any lesson with 100% accuracy', U&'\+01F48E', 100, 'skill'),
('tone_master', 'Tone Master', 'Score at least 80 in tone practice', U&'\+01F3B5', 80, 'skill'),
('shadow_speaker', 'Shadow Speaker', 'Score at least 80 in shadowing practice', U&'\+01F399', 80, 'skill'),
('hanzi_starter', 'Hanzi Starter', 'Complete a Hanzi writing practice', U&'\270D', 80, 'skill'),
('listening_sharp', 'Sharp Listener', 'Score at least 80 in listening practice', U&'\+01F3A7', 80, 'skill'),
('pinyin_typist', 'Pinyin Typist', 'Score at least 80 in pinyin typing practice', U&'\2328', 80, 'skill')
ON CONFLICT (id)
DO UPDATE SET title = EXCLUDED.title,
              description = EXCLUDED.description,
              emoji = EXCLUDED.emoji,
              target_value = EXCLUDED.target_value,
              category = EXCLUDED.category,
              is_active = true;
