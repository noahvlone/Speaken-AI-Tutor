-- Seed data for daily challenges
-- Grammar challenges
INSERT INTO daily_challenges (question, options, correct_answer, explanation, category, difficulty) VALUES
('Choose the correct sentence:', '["She don''t like coffee.", "She doesn''t likes coffee.", "She doesn''t like coffee.", "She not like coffee."]', 2, 'Use ''doesn''t'' (does not) with third-person singular subjects, followed by base form verb.', 'Grammar', 'easy'),
('Complete: If I ___ rich, I would travel the world.', '["am", "was", "were", "will be"]', 2, 'In second conditional (hypothetical present/future), use ''were'' with all subjects.', 'Grammar', 'medium'),
('Choose the correct preposition: She''s good ___ mathematics.', '["in", "at", "on", "with"]', 1, 'We use ''good at'' to describe skills or abilities in a particular area.', 'Grammar', 'easy'),
('Which sentence is correct?', '["He have been working here for 5 years.", "He has been working here for 5 years.", "He is been working here for 5 years.", "He was been working here for 5 years."]', 1, 'Use ''has been'' with third-person singular for present perfect continuous.', 'Grammar', 'medium'),
('Complete: By next year, I ___ English for 10 years.', '["will study", "will be studying", "will have been studying", "am studying"]', 2, 'Future perfect continuous describes an action that will continue up to a point in the future.', 'Grammar', 'hard'),
('Choose the correct form: Neither of the students ___ ready.', '["is", "are", "were", "be"]', 0, '''Neither'' is singular and takes a singular verb.', 'Grammar', 'medium'),
('Which is correct?', '["I wish I was taller.", "I wish I were taller.", "I wish I am taller.", "I wish I will be taller."]', 1, 'Use ''were'' (not ''was'') in wishes about present situations.', 'Grammar', 'medium'),
('Complete: She made me ___ my homework.', '["do", "to do", "doing", "did"]', 0, 'After ''make'' use the base form of the verb (without ''to'').', 'Grammar', 'easy'),
('Which sentence uses the passive voice correctly?', '["The book was wrote by him.", "The book was written by him.", "The book is wrote by him.", "The book written by him."]', 1, 'Passive voice uses ''was/were'' + past participle.', 'Grammar', 'easy'),
('Complete: I''d rather you ___ smoke here.', '["don''t", "didn''t", "not", "won''t"]', 1, 'After ''would rather'' use past simple for present/future preference about others.', 'Grammar', 'hard');

-- Vocabulary challenges
INSERT INTO daily_challenges (question, options, correct_answer, explanation, category, difficulty) VALUES
('Which word is a synonym for ''happy''?', '["Sad", "Joyful", "Angry", "Tired"]', 1, '''Joyful'' means feeling or expressing great happiness and triumph.', 'Vocabulary', 'easy'),
('What does ''abundant'' mean?', '["Scarce", "Plentiful", "Small", "Difficult"]', 1, '''Abundant'' means existing in large quantities; plentiful.', 'Vocabulary', 'easy'),
('Choose the antonym of ''generous'':',  '["Kind", "Selfish", "Helpful", "Friendly"]', 1, '''Selfish'' is the opposite of generous.', 'Vocabulary', 'easy'),
('What does ''meticulous'' mean?', '["Careless", "Very careful and precise", "Quick", "Lazy"]', 1, '''Meticulous'' means showing great attention to detail; very careful.', 'Vocabulary', 'medium'),
('Which word means ''to make worse''?', '["Improve", "Exacerbate", "Fix", "Help"]', 1, '''Exacerbate'' means to make a problem or bad situation worse.', 'Vocabulary', 'hard'),
('What does ''ubiquitous'' mean?', '["Rare", "Present everywhere", "Ancient", "Modern"]', 1, '''Ubiquitous'' means present, appearing, or found everywhere.', 'Vocabulary', 'hard'),
('Choose the synonym for ''diligent'':',  '["Lazy", "Hardworking", "Careless", "Slow"]', 1, '''Diligent'' means hardworking and careful.', 'Vocabulary', 'medium'),
('What does ''ephemeral'' mean?', '["Permanent", "Lasting for a very short time", "Beautiful", "Expensive"]', 1, '''Ephemeral'' means lasting for a very short time.', 'Vocabulary', 'hard'),
('Which word means ''to criticize severely''?', '["Praise", "Lambaste", "Ignore", "Support"]', 1, '''Lambaste'' means to criticize someone or something harshly.', 'Vocabulary', 'hard'),
('What does ''pragmatic'' mean?', '["Idealistic", "Practical and realistic", "Emotional", "Theoretical"]', 1, '''Pragmatic'' means dealing with things sensibly and realistically.', 'Vocabulary', 'medium');

-- Idioms challenges
INSERT INTO daily_challenges (question, options, correct_answer, explanation, category, difficulty) VALUES
('What does ''break the ice'' mean?', '["To damage something frozen", "To make people feel more relaxed", "To work very hard", "To be very cold"]', 1, '''Break the ice'' is an idiom meaning to make people feel more comfortable in a social situation.', 'Idioms', 'easy'),
('What does ''hit the nail on the head'' mean?', '["To make a mistake", "To be exactly right", "To hurt yourself", "To build something"]', 1, 'This idiom means to describe exactly what is causing a situation or problem.', 'Idioms', 'medium'),
('What does ''piece of cake'' mean?', '["Dessert", "Something very easy", "Something expensive", "A celebration"]', 1, '''Piece of cake'' means something that is very easy to do.', 'Idioms', 'easy'),
('What does ''spill the beans'' mean?', '["To make a mess", "To reveal a secret", "To cook food", "To waste something"]', 1, '''Spill the beans'' means to reveal secret information.', 'Idioms', 'easy'),
('What does ''cost an arm and a leg'' mean?', '["To be injured", "To be very expensive", "To be free", "To be dangerous"]', 1, 'This idiom means something is very expensive.', 'Idioms', 'easy'),
('What does ''under the weather'' mean?', '["Outside", "Feeling ill", "Happy", "Confused"]', 1, '''Under the weather'' means feeling slightly ill.', 'Idioms', 'medium'),
('What does ''let the cat out of the bag'' mean?', '["To free an animal", "To reveal a secret accidentally", "To make noise", "To be messy"]', 1, 'This idiom means to reveal a secret, usually accidentally.', 'Idioms', 'medium'),
('What does ''burn the midnight oil'' mean?', '["To waste energy", "To work late into the night", "To be tired", "To light a fire"]', 1, 'This idiom means to work late into the night.', 'Idioms', 'medium'),
('What does ''bite off more than you can chew'' mean?', '["To eat too much", "To take on more than you can handle", "To be hungry", "To be aggressive"]', 1, 'This idiom means to take on a task that is too big or difficult.', 'Idioms', 'medium'),
('What does ''the ball is in your court'' mean?', '["You''re playing sports", "It''s your decision or responsibility", "You''re losing", "You''re winning"]', 1, 'This idiom means it''s now your turn to take action or make a decision.', 'Idioms', 'medium');

-- Pronunciation & Usage challenges
INSERT INTO daily_challenges (question, options, correct_answer, explanation, category, difficulty) VALUES
('Which word has a silent ''k''?', '["Kite", "Knight", "Keep", "Kick"]', 1, 'In ''knight'', the ''k'' is silent. It''s pronounced /naɪt/.', 'Pronunciation', 'easy'),
('How many syllables are in ''comfortable''?', '["3", "4", "5", "2"]', 0, '''Comfortable'' has 3 syllables: com-for-ta-ble (often pronounced as com-f''ta-ble).', 'Pronunciation', 'medium'),
('Which word rhymes with ''through''?', '["Tough", "Blue", "Cough", "Bough"]', 1, '''Through'' rhymes with ''blue'' (/θruː/).', 'Pronunciation', 'medium'),
('Which pair of words are homophones?', '["Their/There", "Here/Hear", "Both A and B", "None"]', 2, 'Both pairs are homophones (words that sound the same but have different meanings).', 'Pronunciation', 'easy'),
('Which word has the stress on the SECOND syllable?', '["PHOtograph", "phoTOgraphy", "photoGRAPHic", "Both B and C"]', 3, 'Both ''phoTOgraphy'' and ''photoGRAPHic'' have stress on the second syllable.', 'Pronunciation', 'hard');
