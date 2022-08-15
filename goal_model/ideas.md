## Objectives
1. Have a harmonized database of different "goals" users might have
  - e.g. "exercise more", "exercise a lot more", "start working out" should all be considered the same
  - Lemmatization might be useful here? then some sort of word vectorization and then a neural network
  - Should account for specific quantities/times, e.g. every day, twice a week, once a month, X amt of dollars, X pushups, X pounds
    - So one of the set/reference goals would look like "Exercise [FREQUENCY]", where [FREQUENCY] denotes a phrase like "once a week", "3 times a day", "four times within a week", etc.
2. Link chips to goals
  - e.g. "went to the gym" should contribute towards "exercise more" automatically
3. Link subgoals to other goals, potentially forming a grit-like goal tree
  - e.g. "Be more healthy" could include "lose weight" or "exercise more" or "sleep better" as goals
  - Maybe I could form one massive goal tree? There are multiple ways to achieve a goal, but any one way should be listed under a certain goal
  - https://www.envisionexperience.com/blog/the-6-most-common-self-improvement-goals-and-how-to-achieve-them
    - sample data lol
  

Current pipeline
1. Preprocess all goals in training data
  - Replace quantities, frequencies, and named entities with special tokens
2. Get embeddings for all goals via `all-MiniLM-L6-v2`
3. Use Stanza to find the root of each sentence via dependency parsing
4. Get embeddings for all roots (use some pretrained word2vec model)=
5. Prediction (from a predetermined set of goals to map to):
  1. Filter all goals by thresholds for cosine similarities from sentence and root embeddings
  2. Select the highest ranking goal by sentence similarity (ignore root similarity)
  3. If no goals pass through the filter, then keep the input to start a new "cluster"


## Notes

Problems
- need to deal with vague goals, e.g. "learn more" or "gain a new talent"
- harmonizing goals may be nontrivial (e.g. eat more healthy and stop eating unhealthy)
  - may need some way to recognize inverse keywords
  - or maybe i should just keep these separate for now
- need to deal with numerical variables and named entities
  - detect and replace with tokens
- need to deal with ambiguous phrasing
  - e.g. "get into a club" could either be a school club or a 21-and-up club
  - confirm that a good sentence embedding could help with this
- need to identify invalid goals/entries (later)
  - maybe if it's just not similar enough to anything
  - and certain filters for words we don't want

Dependency parsing
- binary relations between all words in a sentence
- root is marked
- good for languages with flexible word orders (abstracts away from order)

Preprocessing outline
1. Named entity recognition and 
2. Case and punctuation


Model ideas
- If the MAIN PREDICATE is semantically different, then they AREN'T the same goal even if they are similar via


