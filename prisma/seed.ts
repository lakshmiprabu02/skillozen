import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ── BADGES ────────────────────────────────────────────────────────────────────
const BADGES = [
  { id: 'badge-first-assessment', name: 'First Step',          description: 'Completed your first assessment',          emoji: '🎯', condition: 'FIRST_ASSESSMENT'  },
  { id: 'badge-streak-7',         name: 'Week Warrior',        description: 'Maintained a 7-day streak',                emoji: '🔥', condition: 'STREAK_7'          },
  { id: 'badge-xp-100',           name: 'XP Hunter',           description: 'Earned 100 XP',                            emoji: '⚡', condition: 'XP_100'            },
  { id: 'badge-xp-500',           name: 'XP Legend',           description: 'Earned 500 XP',                            emoji: '💎', condition: 'XP_500'            },
  { id: 'badge-activities-10',    name: 'Activity Ace',        description: 'Completed 10 activities',                  emoji: '🏆', condition: 'ACTIVITIES_10'     },
  { id: 'badge-activities-50',    name: 'Training Champion',   description: 'Completed 50 activities',                  emoji: '👑', condition: 'ACTIVITIES_50'     },
  { id: 'badge-all-skills',       name: 'All-Rounder',         description: 'Tried activities in all 10 skills',        emoji: '🌈', condition: 'ALL_SKILLS'        },
  { id: 'badge-perfect-week',     name: 'Perfect Week',        description: 'Completed all daily activities for 7 days',emoji: '⭐', condition: 'PERFECT_WEEK'      },
  { id: 'badge-assessment-3',     name: 'Growth Tracker',      description: 'Completed 3 assessments',                  emoji: '📈', condition: 'ASSESSMENT_3'      },
  { id: 'badge-level-5',          name: 'Level 5 Hero',        description: 'Reached Level 5',                          emoji: '🦸', condition: 'LEVEL_5'           },
]

// ── ACTIVITIES ────────────────────────────────────────────────────────────────
const ACTIVITIES = [

  // ════════════════════════════════════════════════════════
  // AGES 4-7 | CRITICAL THINKING | 50 activities
  // ════════════════════════════════════════════════════════
  {
    id: 'ct-47-001', title: 'The Odd One Out', description: 'Find the one that does not belong in the group!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Raju loves sorting things. Help him find which one does not belong!', question: 'Apple, Orange, Banana, Train — which does NOT belong?', audioText: 'Apple, Orange, Banana, Train. Which one does not belong with the others?', options: [{ emoji: '🍎', label: 'Apple' }, { emoji: '🍊', label: 'Orange' }, { emoji: '🍌', label: 'Banana' }, { emoji: '🚂', label: 'Train' }], correct: 3, funFact: 'Apple, Orange and Banana are all fruits. A train is a vehicle. Sorting things into groups is called classification!', encouragement: 'Fantastic sorting! You think just like a scientist! 🧪' }
  },
  {
    id: 'ct-47-002', title: 'What Comes Next?', description: 'Find the pattern and say what comes next!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Priya is drawing a pattern. Can you help her finish it?', question: 'Moon, Star, Moon, Star, Moon... What comes next?', audioText: 'Moon, Star, Moon, Star, Moon. What comes next in the pattern?', options: [{ emoji: '🌙', label: 'Moon' }, { emoji: '⭐', label: 'Star' }, { emoji: '☀️', label: 'Sun' }, { emoji: '☁️', label: 'Cloud' }], correct: 1, funFact: 'Patterns are everywhere! Finding patterns is one of the most important thinking skills!', encouragement: 'You are a pattern detective! Amazing work! 🕵️' }
  },
  {
    id: 'ct-47-003', title: 'Which is Bigger?', description: 'Compare the sizes and pick the biggest one!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Meena wants to know which animal is the biggest. Can you help her?', question: 'Which animal is the BIGGEST?', audioText: 'Which animal is the biggest? Ant, Cat, Elephant, or Dog?', options: [{ emoji: '🐜', label: 'Ant' }, { emoji: '🐈', label: 'Cat' }, { emoji: '🐘', label: 'Elephant' }, { emoji: '🐕', label: 'Dog' }], correct: 2, funFact: 'Elephants are the biggest land animals on Earth! They can weigh up to 6,000 kilograms!', encouragement: 'You are so smart! Great comparing! 🎉' }
  },
  {
    id: 'ct-47-004', title: 'Day or Night?', description: 'Decide if things happen during the day or at night!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Arjun is making a chart of day and night activities. Help him sort this one!', question: 'The moon and stars appear in the sky. Is it DAY or NIGHT?', audioText: 'The moon and stars appear in the sky. Is it day or night?', options: [{ emoji: '☀️', label: 'Day' }, { emoji: '🌙', label: 'Night' }, { emoji: '🌈', label: 'Rainbow' }, { emoji: '🌧️', label: 'Rain' }], correct: 1, funFact: 'We can only see the moon and stars at night when the sun goes down and the sky gets dark!', encouragement: 'Brilliant thinking! You know day and night perfectly! 🌟' }
  },
  {
    id: 'ct-47-005', title: 'Which Floats?', description: 'Guess which object floats on water!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Kavya is playing with water. She wants to know which things float. Help her!', question: 'Which one will FLOAT on water?', audioText: 'Which one will float on water? A stone, a leaf, an iron pan, or a brick?', options: [{ emoji: '🪨', label: 'Stone' }, { emoji: '🍃', label: 'Leaf' }, { emoji: '🍳', label: 'Iron pan' }, { emoji: '🧱', label: 'Brick' }], correct: 1, funFact: 'Light things like leaves float because water pushes them up. This is called buoyancy!', encouragement: 'You are a little scientist! Wonderful experiment thinking! 🔬' }
  },
  {
    id: 'ct-47-006', title: 'Missing Piece', description: 'Find what is missing from the picture!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Sona is drawing a face but something is missing. Can you find what it is?', question: 'A face has eyes and a nose but something is MISSING. What is it?', audioText: 'A face has eyes and a nose but something is missing. What is it?', options: [{ emoji: '👁️', label: 'Eyes' }, { emoji: '👃', label: 'Nose' }, { emoji: '😄', label: 'Mouth' }, { emoji: '👂', label: 'Ears' }], correct: 2, funFact: 'We use our mouth to speak, eat, smile and breathe! Every part of our face has an important job.', encouragement: 'Sharp eyes! You noticed what was missing right away! 👀' }
  },
  {
    id: 'ct-47-007', title: 'Before or After?', description: 'Think about what happens first and what happens next!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Rohan is learning about order. Help him decide what happens first!', question: 'What happens BEFORE you eat your food?', audioText: 'What happens before you eat your food?', options: [{ emoji: '🍽️', label: 'Eat food' }, { emoji: '🚿', label: 'Wash hands' }, { emoji: '😴', label: 'Sleep' }, { emoji: '🏃', label: 'Run outside' }], correct: 1, funFact: 'Washing your hands before eating removes germs. Clean hands keep you healthy and strong!', encouragement: 'You know the right order! Smart and healthy thinking! 🙌' }
  },
  {
    id: 'ct-47-008', title: 'Which is Heavier?', description: 'Compare the weights of two objects!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Tara is helping Amma in the kitchen. She needs to pick the heavier item.', question: 'Which is HEAVIER — a watermelon or a grape?', audioText: 'Which is heavier — a watermelon or a grape?', options: [{ emoji: '🍉', label: 'Watermelon' }, { emoji: '🍇', label: 'Grape' }, { emoji: '🍋', label: 'Lemon' }, { emoji: '🫐', label: 'Blueberry' }], correct: 0, funFact: 'A big watermelon can weigh up to 10 kilograms while a single grape weighs less than 5 grams!', encouragement: 'Great thinking about weight and size! You are incredible! 💪' }
  },
  {
    id: 'ct-47-009', title: 'Which Comes First?', description: 'Put things in the right order from first to last!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Ananya is telling a story about a butterfly. What happens first?', question: 'In a butterfly\'s life, what happens FIRST?', audioText: 'In a butterfly\'s life, what happens first?', options: [{ emoji: '🦋', label: 'Fly around' }, { emoji: '🐛', label: 'Be a caterpillar' }, { emoji: '🥚', label: 'Hatch from egg' }, { emoji: '🫘', label: 'Make cocoon' }], correct: 2, funFact: 'A butterfly starts as an egg, then becomes a caterpillar, wraps in a cocoon, and finally becomes a butterfly! This is called metamorphosis.', encouragement: 'You know the story of a butterfly! Absolutely wonderful! 🦋' }
  },
  {
    id: 'ct-47-010', title: 'Same or Different?', description: 'Spot what is the same and what is different!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Veer has two fruits. He wants to know what makes them different.', question: 'A mango and a lemon are both fruits. What makes them DIFFERENT?', audioText: 'A mango and a lemon are both fruits. What makes them different?', options: [{ emoji: '🌈', label: 'Colour' }, { emoji: '🌱', label: 'They grow' }, { emoji: '🍽️', label: 'We eat them' }, { emoji: '🌳', label: 'Grow on trees' }], correct: 0, funFact: 'Noticing differences between things is called observation — a very important science skill!', encouragement: 'Super observation skills! You notice everything! 🔍' }
  },
  {
    id: 'ct-47-011', title: 'The Why Game', description: 'Think about WHY things happen!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Ishaan left his ice cream outside on a hot day. When he came back it was gone!', question: 'WHY did Ishaan\'s ice cream disappear?', audioText: 'Ishaan left his ice cream outside on a hot day. Why did it disappear?', options: [{ emoji: '🐕', label: 'Dog ate it' }, { emoji: '🔥', label: 'Heat melted it' }, { emoji: '🌧️', label: 'Rain washed it' }, { emoji: '🧙', label: 'Magic!' }], correct: 1, funFact: 'Ice cream melts when it gets warm because heat gives energy to the frozen molecules. Science is everywhere!', encouragement: 'You figured out the WHY! That is incredible thinking! 🧠' }
  },
  {
    id: 'ct-47-012', title: 'Which Goes Together?', description: 'Find two things that belong together as a pair!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Diya is playing a matching game. Help her find which things go together!', question: 'A pencil goes best with which of these?', audioText: 'A pencil goes best with which of these? Paper, a chair, a shoe, or a ball?', options: [{ emoji: '📄', label: 'Paper' }, { emoji: '🪑', label: 'Chair' }, { emoji: '👟', label: 'Shoe' }, { emoji: '⚽', label: 'Ball' }], correct: 0, funFact: 'Things that go together and work as a pair are called complements!', encouragement: 'Perfect match! You are a natural thinker! ✏️' }
  },
  {
    id: 'ct-47-013', title: 'How Many Steps?', description: 'Think through the steps needed to do something!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Nila wants to drink a glass of water. What should she do FIRST?', question: 'What is the FIRST step to drink a glass of water?', audioText: 'What is the first step to drink a glass of water?', options: [{ emoji: '💧', label: 'Drink it' }, { emoji: '🥛', label: 'Pick up the glass' }, { emoji: '😋', label: 'Enjoy the taste' }, { emoji: '🤲', label: 'Put it down' }], correct: 1, funFact: 'Doing things step by step is called a procedure. Following steps in order helps us do things correctly every time!', encouragement: 'You know the right steps! Brilliant organised thinking! 📋' }
  },
  {
    id: 'ct-47-014', title: 'Which is Alive?', description: 'Decide which things are alive and which are not!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Aryan is learning about living and non-living things in school. Help him sort!', question: 'Which one of these is ALIVE?', audioText: 'Which one of these is alive? A rock, a tree, a toy car, or a book?', options: [{ emoji: '🪨', label: 'Rock' }, { emoji: '🌳', label: 'Tree' }, { emoji: '🚗', label: 'Toy car' }, { emoji: '📚', label: 'Book' }], correct: 1, funFact: 'Living things grow, breathe, eat, and reproduce. Trees are alive because they grow, drink water and make food from sunlight!', encouragement: 'You know what is alive! Super science thinking! 🌱' }
  },
  {
    id: 'ct-47-015', title: 'Fix the Problem', description: 'Think of the best way to fix a simple problem!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Mahi spilled water on the floor. What is the best way to fix this?', question: 'Water is spilled on the floor. What should Mahi do?', audioText: 'Mahi spilled water on the floor. What should she do?', options: [{ emoji: '🏃', label: 'Run away' }, { emoji: '🧹', label: 'Wipe it up' }, { emoji: '😭', label: 'Cry about it' }, { emoji: '🙈', label: 'Ignore it' }], correct: 1, funFact: 'When we make a mistake the best thing to do is fix it right away! Taking responsibility and solving problems quickly is a sign of great thinking.', encouragement: 'You know how to solve problems! That is a superpower! 🦸' }
  },
  {
    id: 'ct-47-016', title: 'True or Not True?', description: 'Decide if what you hear is true or not true!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 2, xpReward: 15, durationMin: 5, isOffline: true,
    content: { story: 'Ritu heard something interesting. Is it true or not true?', question: 'Fish can live on land just like cats and dogs. TRUE or NOT TRUE?', audioText: 'Fish can live on land just like cats and dogs. Is this true or not true?', options: [{ emoji: '✅', label: 'True' }, { emoji: '❌', label: 'Not True' }, { emoji: '🤔', label: 'Maybe' }, { emoji: '🤷', label: 'Do not know' }], correct: 1, funFact: 'Fish breathe through gills which only work in water. Most fish cannot survive on land!', encouragement: 'You can tell what is true and what is not! Amazing critical mind! 🎯' }
  },
  {
    id: 'ct-47-017', title: 'Best Choice', description: 'Pick the best choice when you have a problem!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'It is raining outside and Chotu wants to go and play. What is the best thing to do?', question: 'It is raining heavily. What should Chotu do?', audioText: 'It is raining heavily. Chotu wants to go outside and play. What should he do?', options: [{ emoji: '☔', label: 'Take an umbrella' }, { emoji: '🏃', label: 'Run outside anyway' }, { emoji: '😭', label: 'Cry all day' }, { emoji: '🎮', label: 'Play inside instead' }], correct: 3, funFact: 'When we cannot do what we planned we can find another option! Finding alternatives is smart problem solving!', encouragement: 'You make great choices! Smart and safe thinking! 🌟' }
  },
  {
    id: 'ct-47-018', title: 'Where Does it Belong?', description: 'Find the right place for each object!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Pooja is helping clean up. She needs to put things where they belong!', question: 'Where does a toothbrush belong?', audioText: 'Where does a toothbrush belong? In the bathroom, kitchen, bedroom, or garden?', options: [{ emoji: '🚿', label: 'Bathroom' }, { emoji: '🍳', label: 'Kitchen' }, { emoji: '🛏️', label: 'Bedroom' }, { emoji: '🌸', label: 'Garden' }], correct: 0, funFact: 'Keeping things in the right place helps us stay organised!', encouragement: 'You know where everything goes! Perfect organising skills! 🏠' }
  },
  {
    id: 'ct-47-019', title: 'Cause and Effect', description: 'Find out what causes something to happen!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Bunny the rabbit did not eat any vegetables and felt very tired.', question: 'WHY did Bunny feel so tired?', audioText: 'Bunny the rabbit did not eat any vegetables and felt very tired. Why?', options: [{ emoji: '🌙', label: 'It was bedtime' }, { emoji: '🥕', label: 'No food energy' }, { emoji: '☀️', label: 'Sun was too hot' }, { emoji: '🎮', label: 'Too much playing' }], correct: 1, funFact: 'Food gives our body energy. Without nutritious food our body does not have enough fuel — just like a car without petrol!', encouragement: 'You understand cause and effect! Super smart thinking! 🐰' }
  },
  {
    id: 'ct-47-020', title: 'Which is Faster?', description: 'Compare speeds and decide which moves faster!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Viru wants to reach his friend\'s house quickly!', question: 'Which is FASTEST to travel a long distance?', audioText: 'Which is the fastest way to travel a long distance? Walking, cycling, bus, or aeroplane?', options: [{ emoji: '🚶', label: 'Walking' }, { emoji: '🚲', label: 'Cycling' }, { emoji: '🚌', label: 'Bus' }, { emoji: '✈️', label: 'Aeroplane' }], correct: 3, funFact: 'An aeroplane travels at about 900 km/h! A person walks at about 5 km/h. That is 180 times faster!', encouragement: 'You know which is fastest! Great comparative thinking! ✈️' }
  },
  {
    id: 'ct-47-021', title: 'What Do I Need?', description: 'Think about what tools you need to do a job!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Chitra wants to draw a picture of her family. What does she NEED?', question: 'To draw a picture, what does Chitra NEED most?', audioText: 'Chitra wants to draw a picture. What does she need most?', options: [{ emoji: '✏️', label: 'Pencil and paper' }, { emoji: '🍕', label: 'Pizza' }, { emoji: '⚽', label: 'Football' }, { emoji: '🎵', label: 'Music' }], correct: 0, funFact: 'The right tools help you do your best work!', encouragement: 'You picked exactly the right tool! Brilliant thinking! 🎨' }
  },
  {
    id: 'ct-47-022', title: 'The Weather Clue', description: 'Use clues to figure out what the weather is like!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Deepa looked outside and saw people carrying umbrellas and wearing raincoats.', question: 'What is the weather MOST LIKELY like outside?', audioText: 'Deepa saw people carrying umbrellas and wearing raincoats. What is the weather like?', options: [{ emoji: '☀️', label: 'Hot and sunny' }, { emoji: '🌧️', label: 'Rainy' }, { emoji: '❄️', label: 'Snowing' }, { emoji: '🌬️', label: 'Windy' }], correct: 1, funFact: 'Using clues around us to figure out something is called inference! Detectives use this skill every day.', encouragement: 'You read the clues perfectly! You think like a detective! 🕵️' }
  },
  {
    id: 'ct-47-023', title: 'Which is Useful?', description: 'Decide which tool is useful for a specific job!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Hari wants to cut paper for his art project. Which tool should he use?', question: 'To cut paper, which tool should Hari use?', audioText: 'Hari wants to cut paper. Which tool should he use?', options: [{ emoji: '✂️', label: 'Scissors' }, { emoji: '🍴', label: 'Fork' }, { emoji: '🖌️', label: 'Paintbrush' }, { emoji: '🔑', label: 'Key' }], correct: 0, funFact: 'Scissors were invented over 3000 years ago! The right tool makes every job easier!', encouragement: 'You know which tool to use! Excellent practical thinking! ✂️' }
  },
  {
    id: 'ct-47-024', title: 'What Happens Next?', description: 'Predict what will happen in a simple story!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Monu the cat sees a ball roll under the sofa. He crouches down and reaches his paw under it.', question: 'What will Monu MOST LIKELY do next?', audioText: 'Monu the cat sees a ball roll under the sofa. He reaches his paw under it. What will he do next?', options: [{ emoji: '😴', label: 'Fall asleep' }, { emoji: '🐾', label: 'Pull out the ball' }, { emoji: '🏃', label: 'Run away' }, { emoji: '🍽️', label: 'Eat dinner' }], correct: 1, funFact: 'Predicting what comes next in a story is called making an inference!', encouragement: 'You predicted it perfectly! You have a great thinking brain! 🐱' }
  },
  {
    id: 'ct-47-025', title: 'Too Much or Too Little?', description: 'Decide if something is too much, too little, or just right!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Pari is watering her plant. She pours a whole bucket of water on it every day!', question: 'Is Pari giving the plant TOO MUCH or TOO LITTLE water?', audioText: 'Pari pours a whole bucket of water on her plant every day. Is this too much or too little?', options: [{ emoji: '💧', label: 'Too little' }, { emoji: '🌊', label: 'Too much' }, { emoji: '✅', label: 'Just right' }, { emoji: '🤔', label: 'Cannot tell' }], correct: 1, funFact: 'Plants need just the right amount of water. Too much water can drown the roots and kill the plant!', encouragement: 'You understood just right! Wonderful balanced thinking! 🌱' }
  },
  {
    id: 'ct-47-026', title: 'The Shape Sort', description: 'Sort shapes into the right groups!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Neha is sorting shapes in maths class. Help her find the round shape!', question: 'Which shape is ROUND?', audioText: 'Which shape is round? A circle, square, triangle, or rectangle?', options: [{ emoji: '⭕', label: 'Circle' }, { emoji: '⬛', label: 'Square' }, { emoji: '🔺', label: 'Triangle' }, { emoji: '▬', label: 'Rectangle' }], correct: 0, funFact: 'A circle is perfectly round with no corners or edges. We see circles everywhere — wheels, coins, the sun!', encouragement: 'You know your shapes! Excellent maths thinking! 🔵' }
  },
  {
    id: 'ct-47-027', title: 'Why is it Important?', description: 'Think about why something is important!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Pinku always wears a helmet when riding his bicycle.', question: 'WHY is wearing a helmet important when riding a bicycle?', audioText: 'Pinku always wears a helmet when riding his bicycle. Why is wearing a helmet important?', options: [{ emoji: '😎', label: 'It looks cool' }, { emoji: '🧠', label: 'Protects your head' }, { emoji: '🌧️', label: 'Keeps rain off' }, { emoji: '🏆', label: 'Shows you are brave' }], correct: 1, funFact: 'A helmet protects your brain during an accident. Your brain controls everything your body does!', encouragement: 'You know why safety matters! Smart and safe thinking! ⛑️' }
  },
  {
    id: 'ct-47-028', title: 'Which Group?', description: 'Put objects into the correct category!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Samir is sorting his toy box into animals and vehicles. Help him sort the lion!', question: 'Is a lion an ANIMAL or a VEHICLE?', audioText: 'Is a lion an animal or a vehicle?', options: [{ emoji: '🦁', label: 'Animal' }, { emoji: '🚗', label: 'Vehicle' }, { emoji: '🏠', label: 'Building' }, { emoji: '🍎', label: 'Food' }], correct: 0, funFact: 'Lions are the second largest wild cats in the world! Animals and vehicles are very different categories!', encouragement: 'Perfect sorting! You know your categories! 🦁' }
  },
  {
    id: 'ct-47-029', title: 'Which is Longer?', description: 'Compare lengths and find the longer one!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Tina and Rani are measuring things with a ruler in class.', question: 'Which is LONGER — a school bus or a pencil?', audioText: 'Which is longer — a school bus or a pencil?', options: [{ emoji: '🚌', label: 'School bus' }, { emoji: '✏️', label: 'Pencil' }, { emoji: '📏', label: 'Ruler' }, { emoji: '📚', label: 'Book' }], correct: 0, funFact: 'A school bus is about 12 metres long while a pencil is only 19 centimetres. The bus is 63 times longer!', encouragement: 'You are great at comparing! Wonderful measurement thinking! 📏' }
  },
  {
    id: 'ct-47-030', title: 'The Silly Sentence', description: 'Find what is silly or wrong in a sentence!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Gopal heard something funny. Can you spot what is wrong?', question: 'What is WRONG? The fish climbed up the tree to eat mangoes.', audioText: 'What is wrong with this sentence? The fish climbed up the tree to eat mangoes.', options: [{ emoji: '🐟', label: 'Fish cannot climb' }, { emoji: '🌳', label: 'Trees are too big' }, { emoji: '🥭', label: 'Mangoes are not tasty' }, { emoji: '🤷', label: 'Nothing is wrong' }], correct: 0, funFact: 'Fish live in water and cannot walk on land let alone climb trees! Noticing when something does not make sense is called logical thinking.', encouragement: 'You spotted the silliness! Brilliant logical mind! 🐟' }
  },
  {
    id: 'ct-47-031', title: 'What Would Happen?', description: 'Think about what would happen if something changed!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Lata forgot to turn off the tap after washing her hands.', question: 'What would HAPPEN if Lata left the tap running all day?', audioText: 'Lata forgot to turn off the tap. What would happen if she left it running all day?', options: [{ emoji: '💧', label: 'Lots of water wasted' }, { emoji: '☀️', label: 'Sun would shine more' }, { emoji: '🌱', label: 'Plants would grow faster' }, { emoji: '🎉', label: 'A party would happen' }], correct: 0, funFact: 'A dripping tap can waste up to 20 litres of water per day! Clean water is precious. Saving water is everyone\'s responsibility.', encouragement: 'You thought about consequences! That is very wise thinking! 💧' }
  },
  {
    id: 'ct-47-032', title: 'Find the Pattern Colour', description: 'Follow the colour pattern and find what comes next!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Maya is making a colourful beaded necklace. Help her pick the next bead colour!', question: 'Red, Blue, Red, Blue, Red... What colour comes NEXT?', audioText: 'Red, Blue, Red, Blue, Red. What colour bead comes next in Maya\'s necklace?', options: [{ emoji: '🔴', label: 'Red' }, { emoji: '🔵', label: 'Blue' }, { emoji: '🟢', label: 'Green' }, { emoji: '🟡', label: 'Yellow' }], correct: 1, funFact: 'This is called an AB pattern. Finding and continuing patterns is important in maths and music!', encouragement: 'You completed the pattern perfectly! Pattern genius! 📿' }
  },
  {
    id: 'ct-47-033', title: 'Who Needs Help?', description: 'Identify who in the story needs help and why!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Three children are in the park. Amit is playing happily. Bina is reading. Charu fell down and is crying.', question: 'Which child needs HELP the most right now?', audioText: 'Amit is playing, Bina is reading, Charu fell down and is crying. Which child needs help most?', options: [{ emoji: '😊', label: 'Amit' }, { emoji: '📖', label: 'Bina' }, { emoji: '😢', label: 'Charu' }, { emoji: '🤷', label: 'No one' }], correct: 2, funFact: 'Noticing when someone needs help is called empathy and awareness. People who notice and help become great friends and leaders!', encouragement: 'You spotted who needed help! Caring and smart thinking! 🤝' }
  },
  {
    id: 'ct-47-034', title: 'Which Season?', description: 'Use clues to figure out which season it is!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 2, xpReward: 15, durationMin: 5, isOffline: true,
    content: { story: 'Farhan sees mango trees full of ripe yellow mangoes. The weather is very hot and sunny.', question: 'Which season is it MOST LIKELY to be?', audioText: 'Farhan sees mango trees full of ripe yellow mangoes and it is very hot. Which season is it?', options: [{ emoji: '❄️', label: 'Winter' }, { emoji: '🌸', label: 'Spring' }, { emoji: '☀️', label: 'Summer' }, { emoji: '🍂', label: 'Autumn' }], correct: 2, funFact: 'In India mangoes ripen in summer — usually between April and June. This is why mango is called the king of summer fruits!', encouragement: 'You read the clues and got it right! Superb reasoning! 🥭' }
  },
  {
    id: 'ct-47-035', title: 'Which is Softer?', description: 'Compare textures and find the softer one!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Gita is learning about touch in science.', question: 'Which is SOFTER to touch — a pillow or a rock?', audioText: 'Which is softer to touch — a pillow or a rock?', options: [{ emoji: '🪨', label: 'Rock' }, { emoji: '🛏️', label: 'Pillow' }, { emoji: '🌵', label: 'Cactus' }, { emoji: '🔩', label: 'Bolt' }], correct: 1, funFact: 'Touch is one of our five amazing senses! A pillow is soft because it is filled with cotton that squishes easily.', encouragement: 'You know your textures! Excellent sensory thinking! 🛏️' }
  },
  {
    id: 'ct-47-036', title: 'What is it Used For?', description: 'Match objects to their correct use!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Sanju is learning about tools and their uses in class.', question: 'What is a broom used for?', audioText: 'What is a broom used for?', options: [{ emoji: '🧹', label: 'Sweeping floor' }, { emoji: '🍳', label: 'Cooking food' }, { emoji: '✏️', label: 'Drawing pictures' }, { emoji: '💧', label: 'Watering plants' }], correct: 0, funFact: 'Brooms have been used for thousands of years to sweep floors! Every tool has a special purpose.', encouragement: 'You know what every tool does! Fantastic functional thinking! 🧹' }
  },
  {
    id: 'ct-47-037', title: 'The Missing Number', description: 'Find the missing number in the pattern!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Kapil is doing his maths homework and found a missing number!', question: '2, 4, 6, ?, 10 — What is the MISSING number?', audioText: '2, 4, 6, question mark, 10. What is the missing number?', options: [{ emoji: '7️⃣', label: '7' }, { emoji: '8️⃣', label: '8' }, { emoji: '9️⃣', label: '9' }, { emoji: '5️⃣', label: '5' }], correct: 1, funFact: 'This is a pattern of even numbers — they go up by 2 each time! Even numbers are 2, 4, 6, 8, 10...', encouragement: 'You found the missing number! Maths superstar! 🔢' }
  },
  {
    id: 'ct-47-038', title: 'Which is Safer?', description: 'Choose the safer option in a given situation!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Raju wants to cross a busy road to get to school.', question: 'What is the SAFEST way for Raju to cross the road?', audioText: 'Raju wants to cross a busy road. What is the safest way?', options: [{ emoji: '🏃', label: 'Run across quickly' }, { emoji: '🚶', label: 'Use the zebra crossing' }, { emoji: '🙈', label: 'Close eyes and cross' }, { emoji: '📱', label: 'Look at phone while crossing' }], correct: 1, funFact: 'Zebra crossings show people where it is safe to cross! Drivers must stop when someone uses one.', encouragement: 'You chose the safe way! Smart and responsible thinking! 🦓' }
  },
  {
    id: 'ct-47-039', title: 'What Time is it?', description: 'Use clues to figure out what time of day it is!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 2, xpReward: 15, durationMin: 5, isOffline: true,
    content: { story: 'Laxmi is getting up, brushing her teeth and eating idli sambar. The sky is getting bright.', question: 'What TIME OF DAY is it for Laxmi?', audioText: 'Laxmi is getting up, brushing teeth and eating idli sambar. The sky is getting bright. What time is it?', options: [{ emoji: '🌅', label: 'Morning' }, { emoji: '🌞', label: 'Afternoon' }, { emoji: '🌆', label: 'Evening' }, { emoji: '🌙', label: 'Night' }], correct: 0, funFact: 'Morning routines help us start the day well! Idli sambar is a popular South Indian breakfast eaten by millions every morning.', encouragement: 'You read all the clues and got it! Brilliant deduction! 🌅' }
  },
  {
    id: 'ct-47-040', title: 'Which is Not a Food?', description: 'Find the item that cannot be eaten!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Kamla is setting the dining table for lunch. One thing on her list cannot be eaten!', question: 'Which of these is NOT a food?', audioText: 'Which of these is not a food? Rice, dal, a pencil, or chapati?', options: [{ emoji: '🍚', label: 'Rice' }, { emoji: '🍲', label: 'Dal' }, { emoji: '✏️', label: 'Pencil' }, { emoji: '🫓', label: 'Chapati' }], correct: 2, funFact: 'A pencil is made of wood and graphite — definitely not something we should eat! Knowing what is safe to eat is very important.', encouragement: 'You spotted what does not belong! Perfect categorising! 🍚' }
  },
  {
    id: 'ct-47-041', title: 'Who Can Help?', description: 'Decide which adult can help in a specific situation!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Rahul fell down and cut his knee. It is bleeding a little and hurts.', question: 'Who should Rahul go to for help FIRST?', audioText: 'Rahul fell down and cut his knee. Who should he go to for help first?', options: [{ emoji: '👨‍👩‍👦', label: 'Parent or teacher' }, { emoji: '🐕', label: 'His pet dog' }, { emoji: '📺', label: 'The television' }, { emoji: '🏃', label: 'Just keep playing' }], correct: 0, funFact: 'When we are hurt we should always go to a trusted adult like a parent or teacher!', encouragement: 'You know who helps us when we are hurt! Very wise thinking! 🩹' }
  },
  {
    id: 'ct-47-042', title: 'Which is More?', description: 'Compare quantities and find which has more!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Geeta has 3 apples and her brother Suresh has 7 apples.', question: 'Who has MORE apples — Geeta or Suresh?', audioText: 'Geeta has 3 apples and Suresh has 7 apples. Who has more?', options: [{ emoji: '👧', label: 'Geeta' }, { emoji: '👦', label: 'Suresh' }, { emoji: '🤝', label: 'Both same' }, { emoji: '🤷', label: 'Cannot tell' }], correct: 1, funFact: '7 is greater than 3 so Suresh has more apples! Comparing numbers helps us every day.', encouragement: 'Great number comparing! You are a maths star! 🍎' }
  },
  {
    id: 'ct-47-043', title: 'What Would You Use?', description: 'Choose the right tool or action for the situation!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Preethi wants to send a message to her grandmother who lives far away.', question: 'What is the BEST way for Preethi to reach her grandmother quickly?', audioText: 'Preethi wants to send a message to her grandmother who lives far away. What is the best way?', options: [{ emoji: '🚶', label: 'Walk there' }, { emoji: '📞', label: 'Call on phone' }, { emoji: '🐢', label: 'Send by turtle' }, { emoji: '💤', label: 'Wait until she visits' }], correct: 1, funFact: 'A phone call lets you hear someone\'s voice instantly no matter how far away they are!', encouragement: 'Great solution finding! You chose the smartest way! 📞' }
  },
  {
    id: 'ct-47-044', title: 'Same Amount?', description: 'Find out if two groups have the same amount!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Anu has 5 crayons and Bala has 5 crayons too.', question: 'Do Anu and Bala have the SAME number of crayons?', audioText: 'Anu has 5 crayons and Bala has 5 crayons. Do they have the same number?', options: [{ emoji: '✅', label: 'Yes same' }, { emoji: '❌', label: 'No different' }, { emoji: '🤔', label: 'Maybe' }, { emoji: '🤷', label: 'Cannot tell' }], correct: 0, funFact: 'When two groups have the same number we say they are equal! 5 = 5!', encouragement: 'You understood equal amounts! Brilliant number sense! 🖍️' }
  },
  {
    id: 'ct-47-045', title: 'The Right Order', description: 'Put the steps of a daily activity in the right order!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Naveen is getting dressed in the morning. What should he put on FIRST?', question: 'What should Naveen put on BEFORE his shirt?', audioText: 'Naveen is getting dressed. What should he put on before his shirt?', options: [{ emoji: '👕', label: 'Shirt' }, { emoji: '👙', label: 'Undergarment' }, { emoji: '🧥', label: 'Jacket' }, { emoji: '🎒', label: 'School bag' }], correct: 1, funFact: 'Doing things in the right order every day builds good habits!', encouragement: 'You know the right order! Excellent sequential thinking! 👕' }
  },
  {
    id: 'ct-47-046', title: 'What Makes it Work?', description: 'Think about what makes something work!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Harish turned on the torch but it did not light up. His father said it needs something.', question: 'What does the torch NEED to work?', audioText: 'Harish turned on his torch but it did not light up. What does the torch need?', options: [{ emoji: '💧', label: 'Water' }, { emoji: '🔋', label: 'Batteries' }, { emoji: '🌞', label: 'Sunlight' }, { emoji: '🍎', label: 'An apple' }], correct: 1, funFact: 'Batteries store chemical energy and turn it into electrical energy to power lights and motors!', encouragement: 'You figured out what was needed! Great engineering thinking! 🔦' }
  },
  {
    id: 'ct-47-047', title: 'Which is Coldest?', description: 'Compare temperatures and find the coldest one!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Simi is helping her mum in the kitchen. She needs to find the coldest thing.', question: 'Which is the COLDEST?', audioText: 'Which is the coldest? Ice cream, warm tea, hot roti, or hot soup?', options: [{ emoji: '🍦', label: 'Ice cream' }, { emoji: '☕', label: 'Warm tea' }, { emoji: '🫓', label: 'Hot roti' }, { emoji: '🍲', label: 'Hot soup' }], correct: 0, funFact: 'Ice cream is stored in a freezer at about -18 degrees Celsius! Temperature helps us understand the world!', encouragement: 'You know hot and cold perfectly! Cool temperature thinking! 🍦' }
  },
  {
    id: 'ct-47-048', title: 'The Good Choice', description: 'Choose the better option when given a decision!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Supriya can either spend her evening watching TV for 3 hours or read a book and play outside.', question: 'Which choice is BETTER for Supriya?', audioText: 'Supriya can watch TV for 3 hours or read and play outside. Which is better?', options: [{ emoji: '📺', label: 'Watch TV 3 hours' }, { emoji: '📚', label: 'Read and play outside' }, { emoji: '😴', label: 'Sleep instead' }, { emoji: '🤷', label: 'Both are same' }], correct: 1, funFact: 'Reading builds vocabulary and imagination while playing outside keeps our body healthy!', encouragement: 'You made the healthy choice! Wonderful decision making! 🌳' }
  },
  {
    id: 'ct-47-049', title: 'What is Missing?', description: 'Look at the set and find what important thing is missing!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Rajan packed his school bag. He has his books, pencil and water bottle. But Amma says something important is missing!', question: 'What IMPORTANT thing might Rajan have forgotten?', audioText: 'Rajan has his books, pencil and water bottle. But something important is missing! What could it be?', options: [{ emoji: '🎮', label: 'Video game' }, { emoji: '🍱', label: 'Lunch box' }, { emoji: '🧸', label: 'Teddy bear' }, { emoji: '🛏️', label: 'His pillow' }], correct: 1, funFact: 'A lunch box is very important for school! Eating a proper lunch gives children energy to learn and play!', encouragement: 'You noticed what was missing! Super observant thinking! 🍱' }
  },
  {
    id: 'ct-47-050', title: 'The Smartest Plan', description: 'Choose the smartest plan to solve a problem!',
    ageGroup: ['EARLY'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 7, isOffline: true,
    content: { story: 'Kiran wants to reach a book on a high shelf. She is not tall enough to reach it.', question: 'What is the SMARTEST thing Kiran can do?', audioText: 'Kiran wants to reach a book on a high shelf but she is not tall enough. What is the smartest thing she can do?', options: [{ emoji: '😭', label: 'Cry about it' }, { emoji: '🪑', label: 'Stand on a stool' }, { emoji: '🏃', label: 'Jump repeatedly' }, { emoji: '😴', label: 'Give up and sleep' }], correct: 1, funFact: 'Using tools to solve problems is one of the things that makes humans very special!', encouragement: 'You found the smartest solution! You are a brilliant problem solver! 🌟' }
  },

  // ════════════════════════════════════════════════════════
  // AGES 4-7 | COMMUNICATION | 50 activities
  // ════════════════════════════════════════════════════════
  {
    id: 'cm-47-001', title: 'Say It Nicely', description: 'Learn how to ask for things politely!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Ramu wants more rice at dinner. How should he ask Amma?', question: 'Which is the NICEST way to ask for more rice?', audioText: 'Ramu wants more rice at dinner. Which is the nicest way to ask his mother?', options: [{ emoji: '😠', label: 'Give me more!' }, { emoji: '🙏', label: 'May I have more please?' }, { emoji: '😭', label: 'I want it now!' }, { emoji: '🤷', label: 'Say nothing' }], correct: 1, funFact: 'Saying please and thank you makes people feel respected and happy to help you! These are called magic words!', encouragement: 'You know the magic words! So polite and wonderful! 🌟' }
  },
  {
    id: 'cm-47-002', title: 'Happy or Sad Face?', description: 'Match the face to the feeling!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Priya got a new doll as a birthday gift. She is jumping up and down!', question: 'How is Priya feeling?', audioText: 'Priya got a new doll as a birthday gift and she is jumping up and down! How is she feeling?', options: [{ emoji: '😢', label: 'Sad' }, { emoji: '😠', label: 'Angry' }, { emoji: '🤩', label: 'Very happy' }, { emoji: '😴', label: 'Sleepy' }], correct: 2, funFact: 'When we jump up and down and smile it means we are very excited and happy! Reading body language helps us understand feelings.', encouragement: 'You read Priya\'s feelings perfectly! You are so understanding! 💛' }
  },
  {
    id: 'cm-47-003', title: 'Listening Ears', description: 'Learn why listening carefully is important!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'QUIZ', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Teacher is giving important instructions for the art activity but Sonu is looking out the window.', question: 'What should Sonu do to be a GOOD listener?', audioText: 'Teacher is giving instructions but Sonu is looking out the window. What should he do?', options: [{ emoji: '🪟', label: 'Keep looking outside' }, { emoji: '👀', label: 'Look at teacher and listen' }, { emoji: '💤', label: 'Take a nap' }, { emoji: '📱', label: 'Play with a toy' }], correct: 1, funFact: 'Good listeners look at the person speaking, stay quiet and think about what they are saying!', encouragement: 'You know how to be a great listener! Super communication skill! 👂' }
  },
  {
    id: 'cm-47-004', title: 'Show How You Feel', description: 'Express your feelings using the right words!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'SIMULATION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Arjun is scared of the dark. He wants to tell his father how he feels.', question: 'What should Arjun SAY to his father?', audioText: 'Arjun is scared of the dark and wants to tell his father. What should he say?', options: [{ emoji: '😶', label: 'Say nothing' }, { emoji: '😢', label: 'Just cry' }, { emoji: '🗣️', label: 'Papa I feel scared' }, { emoji: '🏃', label: 'Run and hide' }], correct: 2, funFact: 'Telling people how we feel is called expressing emotions. Brave people share their feelings!', encouragement: 'You know how to share feelings! That is so brave and smart! 💪' }
  },
  {
    id: 'cm-47-005', title: 'Take Turns Talking', description: 'Learn why taking turns in conversation is important!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'SIMULATION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Divya and her friend Meena both want to tell a story. Divya keeps interrupting Meena.', question: 'What should Divya do to be a GOOD friend?', audioText: 'Divya keeps interrupting Meena while she talks. What should she do?', options: [{ emoji: '🗣️', label: 'Keep interrupting' }, { emoji: '⏳', label: 'Wait for her turn' }, { emoji: '😠', label: 'Get angry' }, { emoji: '🏃', label: 'Walk away' }], correct: 1, funFact: 'Good conversations are like a game of catch — one person throws and the other catches, then they throw back!', encouragement: 'You know how to take turns! Such great conversation skills! 🎯' }
  },
  {
    id: 'cm-47-006', title: 'Loud or Soft Voice?', description: 'Choose the right volume for different situations!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Kavya is in the library and wants to ask where the picture books are.', question: 'What kind of voice should Kavya use in the library?', audioText: 'Kavya is in the library. What kind of voice should she use?', options: [{ emoji: '📢', label: 'Very loud shout' }, { emoji: '🤫', label: 'Soft whisper' }, { emoji: '😶', label: 'No voice at all' }, { emoji: '🎤', label: 'Singing voice' }], correct: 1, funFact: 'We use quiet voices in libraries, hospitals and classrooms so we do not disturb others!', encouragement: 'You know the right voice for every place! Excellent! 📚' }
  },
  {
    id: 'cm-47-007', title: 'Saying Sorry', description: 'Learn when and how to apologise sincerely!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'SIMULATION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Rohan accidentally stepped on his classmate Rahul\'s foot.', question: 'What should Rohan say to Rahul?', audioText: 'Rohan accidentally stepped on Rahul\'s foot. What should he say?', options: [{ emoji: '😶', label: 'Nothing' }, { emoji: '🙏', label: 'Sorry Rahul!' }, { emoji: '😂', label: 'Laugh at him' }, { emoji: '🏃', label: 'Run away' }], correct: 1, funFact: 'Saying sorry when we make a mistake shows that we care about other people\'s feelings!', encouragement: 'You know when to say sorry! That shows great character! 🌸' }
  },
  {
    id: 'cm-47-008', title: 'What Does That Face Mean?', description: 'Understand what different facial expressions mean!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Tara\'s grandmother is frowning and her eyes look worried.', question: 'How is Tara\'s grandmother MOST LIKELY feeling?', audioText: 'Tara\'s grandmother is frowning and her eyes look worried. How is she feeling?', options: [{ emoji: '😊', label: 'Happy' }, { emoji: '😟', label: 'Worried' }, { emoji: '😂', label: 'Laughing' }, { emoji: '😴', label: 'Sleepy' }], correct: 1, funFact: 'Our face shows our feelings even when we do not say anything! Scientists say humans make about 10,000 different facial expressions.', encouragement: 'You read that face perfectly! Amazing emotional intelligence! 😊' }
  },
  {
    id: 'cm-47-009', title: 'Say Thank You', description: 'Learn when to express gratitude!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'SIMULATION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Geeta helped Nishi pick up her crayons that fell on the floor.', question: 'What should Nishi say to Geeta?', audioText: 'Geeta helped Nishi pick up her crayons. What should Nishi say?', options: [{ emoji: '😶', label: 'Nothing' }, { emoji: '🙏', label: 'Thank you Geeta!' }, { emoji: '😠', label: 'Why did you do that?' }, { emoji: '🏃', label: 'Run away quickly' }], correct: 1, funFact: 'Saying thank you makes the helper feel valued! Grateful people are happier and have better friendships.', encouragement: 'You know when to say thank you! So thoughtful and kind! 💛' }
  },
  {
    id: 'cm-47-010', title: 'Introduce Yourself', description: 'Learn how to introduce yourself to someone new!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'SIMULATION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'A new child named Vikram joined the class. He is sitting alone and looks nervous.', question: 'What is the BEST way to introduce yourself to Vikram?', audioText: 'A new child named Vikram joined the class. He is sitting alone. What is the best way to introduce yourself?', options: [{ emoji: '😶', label: 'Ignore him' }, { emoji: '👋', label: 'Hi I am... want to play?' }, { emoji: '😝', label: 'Laugh at him' }, { emoji: '🏃', label: 'Run past him' }], correct: 1, funFact: 'A friendly introduction is one of the best ways to make a new friend!', encouragement: 'You know how to welcome someone new! What a warm heart! 🤝' }
  },
  {
    id: 'cm-47-011', title: 'What Does the Story Say?', description: 'Listen carefully and answer about a short story!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'QUIZ', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Mia the little bird fell from her nest. A kind boy named Arun gently placed her back. The mama bird sang a sweet song.', question: 'Who helped Mia the bird?', audioText: 'Mia the little bird fell from her nest. A kind boy named Arun placed her back. Who helped Mia?', options: [{ emoji: '👦', label: 'Arun' }, { emoji: '🦅', label: 'Mama bird' }, { emoji: '🌳', label: 'The tree' }, { emoji: '🐱', label: 'A cat' }], correct: 0, funFact: 'Good listeners can remember details from stories they hear! Listening carefully helps us understand and learn.', encouragement: 'You listened so carefully! Wonderful listening skills! 🐦' }
  },
  {
    id: 'cm-47-012', title: 'Asking for Help', description: 'Learn the right way to ask for help when you need it!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'SIMULATION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Pinku cannot reach his shoes on the top shelf. His older sister is nearby.', question: 'What should Pinku say to get his sister\'s help?', audioText: 'Pinku cannot reach his shoes. His older sister is nearby. What should he say?', options: [{ emoji: '😭', label: 'Cry loudly' }, { emoji: '🙏', label: 'Didi can you help me please?' }, { emoji: '😠', label: 'Get it for me now!' }, { emoji: '💤', label: 'Give up and sleep' }], correct: 1, funFact: 'Asking for help politely is a sign of intelligence not weakness! Using someone\'s name and saying please makes them more likely to help.', encouragement: 'You know how to ask for help! Very smart and polite! 🌟' }
  },
  {
    id: 'cm-47-013', title: 'Happy Birthday!', description: 'Learn how to greet someone on a special occasion!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Today is Sunita\'s birthday! Her friend Rekha wants to make her feel special.', question: 'What should Rekha say to Sunita?', audioText: 'Today is Sunita\'s birthday. What should Rekha say to make her feel special?', options: [{ emoji: '😶', label: 'Nothing' }, { emoji: '🎂', label: 'Happy Birthday Sunita!' }, { emoji: '😠', label: 'Why are you celebrating?' }, { emoji: '😴', label: 'I am tired' }], correct: 1, funFact: 'Greetings for special occasions like birthdays make people feel loved and remembered!', encouragement: 'You know how to make people feel special! Wonderful! 🎂' }
  },
  {
    id: 'cm-47-014', title: 'Yes or No?', description: 'Answer questions clearly with yes or no!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'QUIZ', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Anu\'s teacher asked her if she had finished her drawing.', question: 'If Anu finished her drawing what should she answer?', audioText: 'Anu\'s teacher asked if she finished her drawing. If she did, what should she answer?', options: [{ emoji: '✅', label: 'Yes I finished it!' }, { emoji: '🤷', label: 'Maybe' }, { emoji: '😶', label: 'Say nothing' }, { emoji: '😭', label: 'Start crying' }], correct: 0, funFact: 'Answering questions clearly and directly helps communication go smoothly!', encouragement: 'You know how to give a clear answer! Excellent communication! ✅' }
  },
  {
    id: 'cm-47-015', title: 'Tell the Story', description: 'Put a story in the right order to tell it clearly!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'GAME', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Ravi wants to tell his father about his day at school. He needs to start at the beginning.', question: 'Which part should Ravi tell FIRST?', audioText: 'Ravi wants to tell his father about school. What should he say first?', options: [{ emoji: '🎒', label: 'I arrived at school' }, { emoji: '🍱', label: 'I ate my lunch' }, { emoji: '🏠', label: 'I came back home' }, { emoji: '📚', label: 'I did homework' }], correct: 0, funFact: 'Good storytellers always start at the beginning and go in order! Telling things in sequence helps the listener follow along easily.', encouragement: 'You know how to tell a story in order! Great storyteller! 📖' }
  },
  {
    id: 'cm-47-016', title: 'Smile or Frown?', description: 'Decide which expression to use in different situations!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Sanjay just won first prize in the drawing competition!', question: 'What expression would Sanjay MOST LIKELY have?', audioText: 'Sanjay just won first prize in the drawing competition. What expression would he have?', options: [{ emoji: '😢', label: 'Sad face' }, { emoji: '😁', label: 'Big smile' }, { emoji: '😠', label: 'Angry face' }, { emoji: '😴', label: 'Sleepy face' }], correct: 1, funFact: 'Smiling is contagious! When you smile at someone they almost always smile back!', encouragement: 'You matched the feeling to the face! Brilliant emotional reading! 😊' }
  },
  {
    id: 'cm-47-017', title: 'Excuse Me!', description: 'Learn when to say excuse me politely!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'SIMULATION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Lata needs to walk past some people who are standing in her way at the market.', question: 'What should Lata say?', audioText: 'Lata needs to walk past people standing in her way. What should she say?', options: [{ emoji: '💥', label: 'Push them aside' }, { emoji: '🙏', label: 'Excuse me please' }, { emoji: '😠', label: 'Move out of my way!' }, { emoji: '💤', label: 'Wait there all day' }], correct: 1, funFact: 'Excuse me is a polite phrase we use when we need to pass by someone. It shows respect!', encouragement: 'You know all the polite phrases! Such wonderful manners! 🌸' }
  },
  {
    id: 'cm-47-018', title: 'Feelings Words', description: 'Match feelings to the right words!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Deepa\'s puppy ran away and she cannot find it. She has tears in her eyes.', question: 'Which feeling word best describes Deepa?', audioText: 'Deepa\'s puppy ran away. She has tears in her eyes. Which feeling word describes her?', options: [{ emoji: '😊', label: 'Happy' }, { emoji: '😢', label: 'Sad' }, { emoji: '😡', label: 'Angry' }, { emoji: '😴', label: 'Tired' }], correct: 1, funFact: 'Having words for our feelings helps us communicate them to others!', encouragement: 'You matched the feeling perfectly! Great emotional vocabulary! 💛' }
  },
  {
    id: 'cm-47-019', title: 'Look at Me When I Talk', description: 'Learn why eye contact is important when talking!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'QUIZ', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Grandpa is telling Munna an important story. Munna is playing with his toy car instead of listening.', question: 'What should Munna do to show he is listening?', audioText: 'Grandpa is telling Munna a story but Munna is playing with his toy car. What should he do?', options: [{ emoji: '🚗', label: 'Keep playing' }, { emoji: '👀', label: 'Look at grandpa' }, { emoji: '💤', label: 'Fall asleep' }, { emoji: '📺', label: 'Watch TV instead' }], correct: 1, funFact: 'Looking at the person speaking shows them that we respect and value what they are saying!', encouragement: 'You know how to show respect when listening! Wonderful! 👴' }
  },
  {
    id: 'cm-47-020', title: 'Describe It!', description: 'Practise describing something using words!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'GAME', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Pari wants to describe her favourite fruit to her friend without saying its name.', question: 'She says: It is yellow, long, and monkeys love it. What is it?', audioText: 'Pari says: It is yellow, long, and monkeys love it. What fruit is she describing?', options: [{ emoji: '🍎', label: 'Apple' }, { emoji: '🍌', label: 'Banana' }, { emoji: '🍊', label: 'Orange' }, { emoji: '🍇', label: 'Grapes' }], correct: 1, funFact: 'Describing something using its colour shape and features without saying its name is called a riddle!', encouragement: 'You solved the riddle! Brilliant listening and thinking! 🍌' }
  },
  {
    id: 'cm-47-021', title: 'Good Morning!', description: 'Learn the right greetings for different times of day!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Rohit wakes up and sees his mother in the kitchen making breakfast.', question: 'What should Rohit say to his mother?', audioText: 'Rohit wakes up and sees his mother making breakfast. What should he say?', options: [{ emoji: '🌙', label: 'Good night Amma!' }, { emoji: '🌅', label: 'Good morning Amma!' }, { emoji: '😴', label: 'Go back to sleep' }, { emoji: '😶', label: 'Say nothing' }], correct: 1, funFact: 'Greetings like good morning help us acknowledge people around us! These simple words can brighten someone\'s entire day.', encouragement: 'You know the right greetings! Such wonderful social skills! ☀️' }
  },
  {
    id: 'cm-47-022', title: 'Sharing News', description: 'Learn how to share exciting news with others!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Kamla saw a beautiful rainbow on her way home from school. She wants to tell her family!', question: 'How should Kamla share her exciting news?', audioText: 'Kamla saw a beautiful rainbow. How should she share this exciting news with her family?', options: [{ emoji: '😶', label: 'Tell no one' }, { emoji: '😊', label: 'I saw a rainbow! It was so beautiful!' }, { emoji: '😠', label: 'Why does no one care?' }, { emoji: '😭', label: 'Cry because it is gone' }], correct: 1, funFact: 'Sharing happy experiences with people we love is called positive communication! When we share joy it doubles the happy feeling!', encouragement: 'You know how to share good news! Spreading joy is wonderful! 🌈' }
  },
  {
    id: 'cm-47-023', title: 'What Did the Sign Say?', description: 'Learn about communication through signs and symbols!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'QUIZ', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Farhan saw a big red sign with a white bar on it at the entrance of the park.', question: 'What does a red circle with a bar through it usually mean?', audioText: 'Farhan saw a big red sign with a white bar. What does this usually mean?', options: [{ emoji: '✅', label: 'Yes you can!' }, { emoji: '🚫', label: 'No or stop' }, { emoji: '❓', label: 'I do not know' }, { emoji: '🎉', label: 'Celebrate!' }], correct: 1, funFact: 'Signs and symbols communicate without words! Red usually means stop or danger.', encouragement: 'You can read signs and symbols! Very smart visual communication! 🚦' }
  },
  {
    id: 'cm-47-024', title: 'Cheer Someone Up', description: 'Find the right words to comfort a sad friend!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Mona\'s cat is unwell. She is sitting alone looking very sad.', question: 'What is the BEST thing to say to cheer Mona up?', audioText: 'Mona\'s cat is unwell and she is sitting alone looking sad. What is the best thing to say?', options: [{ emoji: '😝', label: 'Laugh at her' }, { emoji: '🤗', label: 'I am here for you. Your cat will feel better!' }, { emoji: '🤷', label: 'It is just a cat!' }, { emoji: '🏃', label: 'Run away' }], correct: 1, funFact: 'Kind words have real power! Supportive words from a friend can lower stress and make people feel better!', encouragement: 'You know how to comfort someone! What a kind and caring heart! 🤗' }
  },
  {
    id: 'cm-47-025', title: 'What is the Question?', description: 'Learn how to ask good questions to find out more!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'GAME', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Suresh wants to know what time dinner will be ready. He goes to ask his father.', question: 'What is the BEST question for Suresh to ask?', audioText: 'Suresh wants to know what time dinner will be ready. What is the best question to ask?', options: [{ emoji: '🍽️', label: 'Papa what time is dinner?' }, { emoji: '😠', label: 'Where is my food?!' }, { emoji: '😶', label: 'Say nothing and wait' }, { emoji: '😭', label: 'Cry from hunger' }], correct: 0, funFact: 'Asking clear questions is one of the most important communication skills!', encouragement: 'You ask great questions! Smart communicator! ❓' }
  },
  {
    id: 'cm-47-026', title: 'Big Voice Small Voice', description: 'Know when to use a big voice and when to use a small voice!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'QUIZ', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Nita wants to call her friend who is playing far away on the other side of the playground.', question: 'What kind of voice should Nita use?', audioText: 'Nita wants to call her friend far away on the playground. What kind of voice should she use?', options: [{ emoji: '🤫', label: 'Very quiet whisper' }, { emoji: '📢', label: 'Loud calling voice' }, { emoji: '😶', label: 'No voice at all' }, { emoji: '🎵', label: 'Singing voice' }], correct: 1, funFact: 'We naturally adjust our voice volume depending on how far away the listener is!', encouragement: 'You know when to speak loudly! Great voice control! 📣' }
  },
  {
    id: 'cm-47-027', title: 'Tell Me About Your Day', description: 'Practise sharing what happened in your day!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Amma asks Bhanu what was the best part of school today. Bhanu shrugs and says nothing.', question: 'What would be a BETTER answer from Bhanu?', audioText: 'Amma asks Bhanu what was the best part of school. What would be a better answer than shrugging?', options: [{ emoji: '🤷', label: 'Shrug again' }, { emoji: '😊', label: 'We painted pictures and it was so fun!' }, { emoji: '😴', label: 'I do not know' }, { emoji: '😠', label: 'Stop asking me!' }], correct: 1, funFact: 'Sharing about our day builds a strong connection between children and parents!', encouragement: 'You know how to share about your day! Great communicator! 🎨' }
  },
  {
    id: 'cm-47-028', title: 'The Giving Compliment', description: 'Learn how to give someone a sincere compliment!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'SIMULATION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Reena drew a beautiful picture of a sunset. Her friend Tina wants to say something nice.', question: 'What is a NICE thing Tina can say about Reena\'s drawing?', audioText: 'Reena drew a beautiful picture. What is a nice thing Tina can say?', options: [{ emoji: '😝', label: 'Mine is better!' }, { emoji: '🌟', label: 'Reena your drawing is so beautiful!' }, { emoji: '😶', label: 'Say nothing' }, { emoji: '😠', label: 'I do not like it' }], correct: 1, funFact: 'Giving genuine compliments is a wonderful communication skill! They make both people feel good!', encouragement: 'You know how to give lovely compliments! Such a kind friend! 🌸' }
  },
  {
    id: 'cm-47-029', title: 'Point and Tell', description: 'Use pointing and telling together to communicate clearly!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Gopal cannot find his water bottle. He wants to show his friend where he left it.', question: 'What should Gopal do to help his friend understand?', audioText: 'Gopal cannot find his water bottle. What should he do to help his friend understand where he left it?', options: [{ emoji: '😶', label: 'Say nothing' }, { emoji: '👆', label: 'Point and say I left it near the door' }, { emoji: '😭', label: 'Cry about it' }, { emoji: '💤', label: 'Forget about it' }], correct: 1, funFact: 'Using gestures like pointing together with words makes communication much clearer!', encouragement: 'You know how to communicate with words and actions! Brilliant! 👆' }
  },
  {
    id: 'cm-47-030', title: 'I Do Not Understand', description: 'Learn how to ask for clarification when confused!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Teacher explained a new activity but Seema did not understand the instructions.', question: 'What should Seema do?', audioText: 'Teacher explained a new activity but Seema did not understand. What should she do?', options: [{ emoji: '😴', label: 'Do nothing' }, { emoji: '🙋', label: 'Raise hand and ask teacher to explain again' }, { emoji: '😭', label: 'Cry at her desk' }, { emoji: '🏃', label: 'Run out of class' }], correct: 1, funFact: 'Asking for clarification when we do not understand is a sign of intelligence! There are no silly questions!', encouragement: 'You know it is okay to ask for help! Very wise! 🙋' }
  },
  {
    id: 'cm-47-031', title: 'Quiet Please!', description: 'Know when silence is the best form of communication!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'QUIZ', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Shankar\'s baby sister is sleeping. Shankar wants to play with his toy drum.', question: 'What should Shankar do?', audioText: 'Shankar\'s baby sister is sleeping. He wants to play with his toy drum. What should he do?', options: [{ emoji: '🥁', label: 'Play the drum loudly' }, { emoji: '🤫', label: 'Play quietly or wait' }, { emoji: '😠', label: 'Wake the baby up' }, { emoji: '🎤', label: 'Sing loudly' }], correct: 1, funFact: 'Being quiet when others are sleeping is a form of caring communication. It shows we think about others!', encouragement: 'You show great consideration for others! Wonderful! 🤫' }
  },
  {
    id: 'cm-47-032', title: 'The Feelings Check', description: 'Practise checking in on how you feel and sharing it!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'REFLECTION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Every morning at school the teacher asks children how they are feeling today.', question: 'Which response tells the teacher most clearly how you feel?', audioText: 'Every morning the teacher asks how you are feeling. Which response tells her most clearly?', options: [{ emoji: '🤷', label: 'Fine I guess' }, { emoji: '😊', label: 'I feel happy today because...' }, { emoji: '😶', label: 'Say nothing' }, { emoji: '🏃', label: 'Run to my seat' }], correct: 1, funFact: 'Sharing our feelings with a reason helps people understand us better! This builds deeper connections.', encouragement: 'You know how to share feelings clearly! Amazing self-expression! 😊' }
  },
  {
    id: 'cm-47-033', title: 'What did Amma Say?', description: 'Follow instructions carefully by listening well!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'QUIZ', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Amma said: Put your shoes near the door, wash your hands and then come for snacks.', question: 'What should Vasu do FIRST?', audioText: 'Amma said: Put your shoes near the door, wash your hands, then come for snacks. What should Vasu do first?', options: [{ emoji: '🍪', label: 'Eat snacks' }, { emoji: '👟', label: 'Put shoes near door' }, { emoji: '🚿', label: 'Wash hands' }, { emoji: '📺', label: 'Watch TV' }], correct: 1, funFact: 'Following instructions in order is called sequential listening! Good listeners always follow instructions step by step.', encouragement: 'You followed the instructions perfectly! Superb listening! 👟' }
  },
  {
    id: 'cm-47-034', title: 'A Thank You Note', description: 'Learn to express gratitude through a simple message!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'CREATIVE_TASK', difficulty: 2, xpReward: 15, durationMin: 7, isOffline: true,
    content: { story: 'Nani bought Pinky a beautiful storybook as a gift. Pinky wants to say thank you in a special way.', question: 'What is the most SPECIAL way for Pinky to say thank you?', audioText: 'Nani bought Pinky a beautiful storybook. What is the most special way to say thank you?', options: [{ emoji: '😶', label: 'Say nothing' }, { emoji: '💌', label: 'Draw a card and write thank you Nani!' }, { emoji: '🏃', label: 'Run and play with it' }, { emoji: '😴', label: 'Go to sleep' }], correct: 1, funFact: 'Written thank you notes are extra special because the person can keep them! Writing our feelings shows extra effort and love.', encouragement: 'You know how to show gratitude in the most beautiful way! 💌' }
  },
  {
    id: 'cm-47-035', title: 'No Thank You', description: 'Learn how to politely say no when you do not want something!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Aunty offered Raju a sweet he does not like. He does not want to be rude.', question: 'What is the POLITE way for Raju to say he does not want it?', audioText: 'Aunty offered Raju a sweet he does not like. What is the polite way to say he does not want it?', options: [{ emoji: '😠', label: 'I hate that! No!' }, { emoji: '🙏', label: 'No thank you Aunty' }, { emoji: '🤮', label: 'Make a disgusted face' }, { emoji: '🏃', label: 'Run away' }], correct: 1, funFact: 'Saying no thank you politely is just as important as saying please! It shows we can communicate while being respectful.', encouragement: 'You can say no politely! That is a very important life skill! 🙏' }
  },
  {
    id: 'cm-47-036', title: 'The Whole Story', description: 'Give complete information when telling a story!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'QUIZ', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Chitra came home with a torn shirt. Amma asked what happened. Chitra just said I fell.', question: 'What EXTRA information would help Amma understand better?', audioText: 'Chitra said I fell when asked about her torn shirt. What extra information would help?', options: [{ emoji: '🤷', label: 'Nothing more needed' }, { emoji: '📍', label: 'Where and how she fell' }, { emoji: '😴', label: 'She was dreaming' }, { emoji: '🎮', label: 'What game she played after' }], correct: 1, funFact: 'A complete message includes who, what, where, when and how! Giving details prevents misunderstandings.', encouragement: 'You know how to give complete information! Great detailed communication! 📋' }
  },
  {
    id: 'cm-47-037', title: 'Nod Your Head', description: 'Learn about non-verbal communication signals!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Teacher is asking if everyone understood the instructions. Sanvi understood but is too shy to speak.', question: 'What can Sanvi do WITHOUT speaking to show she understood?', audioText: 'Teacher is asking if everyone understood. Sanvi understood but is too shy to speak. What can she do?', options: [{ emoji: '😴', label: 'Fall asleep' }, { emoji: '👍', label: 'Nod her head and give thumbs up' }, { emoji: '🏃', label: 'Run out of class' }, { emoji: '😭', label: 'Start crying' }], correct: 1, funFact: 'Experts say that over 55% of communication is through body language!', encouragement: 'You know body language too! Amazing complete communicator! 👍' }
  },
  {
    id: 'cm-47-038', title: 'The Right Words', description: 'Choose the right words for different situations!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Hari accidentally broke his friend Sonu\'s pencil box.', question: 'What is the MOST complete and caring thing Hari can say?', audioText: 'Hari accidentally broke Sonu\'s pencil box. What is the most caring thing he can say?', options: [{ emoji: '🤷', label: 'Accidents happen!' }, { emoji: '🙏', label: 'Sorry Sonu. I broke it by accident. I will get you a new one.' }, { emoji: '😶', label: 'Say nothing' }, { emoji: '🏃', label: 'Walk away quickly' }], correct: 1, funFact: 'A complete apology has three parts: say sorry, explain it was an accident, and offer to fix it!', encouragement: 'You gave the most complete and caring apology! Wonderful character! 🌟' }
  },
  {
    id: 'cm-47-039', title: 'Ask Before You Take', description: 'Learn to always ask permission before taking something!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'SIMULATION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Kaveri sees a beautiful eraser on her classmate\'s desk. She really wants to use it.', question: 'What should Kaveri do BEFORE using the eraser?', audioText: 'Kaveri sees a beautiful eraser on her classmate\'s desk. What should she do before using it?', options: [{ emoji: '🤚', label: 'Just take it' }, { emoji: '🙏', label: 'Can I borrow your eraser please?' }, { emoji: '😴', label: 'Ignore it' }, { emoji: '😭', label: 'Cry about not having one' }], correct: 1, funFact: 'Always asking permission before using someone else\'s things shows respect for their belongings!', encouragement: 'You always ask first! That shows great respect and communication! 🌸' }
  },
  {
    id: 'cm-47-040', title: 'Tell a Joke!', description: 'Discover how humour is a fun part of communication!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'GAME', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Rishi wants to make his friends laugh. He tells a short funny joke.', question: 'What makes a good joke?', audioText: 'Rishi wants to make his friends laugh with a short funny joke. What makes a good joke?', options: [{ emoji: '😠', label: 'It makes someone feel bad' }, { emoji: '😂', label: 'It is silly and makes everyone laugh' }, { emoji: '😴', label: 'It puts people to sleep' }, { emoji: '😭', label: 'It makes someone cry' }], correct: 1, funFact: 'Humour is a powerful communication tool that brings people together and makes friendships stronger!', encouragement: 'You know what makes a great joke! Fun communicator! 😂' }
  },
  {
    id: 'cm-47-041', title: 'What Does That Word Mean?', description: 'Ask about words you do not understand!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Papa used the word enormous to describe a very big building. Radha does not know what enormous means.', question: 'What should Radha do?', audioText: 'Papa used the word enormous and Radha does not know what it means. What should she do?', options: [{ emoji: '😴', label: 'Pretend she knows' }, { emoji: '🙋', label: 'Papa what does enormous mean?' }, { emoji: '😶', label: 'Stay confused' }, { emoji: '🏃', label: 'Walk away' }], correct: 1, funFact: 'Asking about new words is how we build our vocabulary! Children who ask about new words learn 3000 new words every year!', encouragement: 'You are curious about new words! That is how brilliant people learn! 📚' }
  },
  {
    id: 'cm-47-042', title: 'Wave Hello Wave Goodbye', description: 'Learn different ways to greet and say farewell!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Sita is going to school. Her grandfather is watching from the door.', question: 'What can Sita do to show love to grandfather as she leaves?', audioText: 'Sita is going to school and her grandfather is watching from the door. What can she do to show love?', options: [{ emoji: '😶', label: 'Just walk away' }, { emoji: '👋', label: 'Wave and say bye Thatha!' }, { emoji: '😠', label: 'Tell him to go inside' }, { emoji: '💤', label: 'Go back to sleep' }], correct: 1, funFact: 'Waving is a universal gesture understood by people all around the world!', encouragement: 'You know how to show love when saying goodbye! So warm hearted! 👋' }
  },
  {
    id: 'cm-47-043', title: 'I Feel Excited!', description: 'Name and express the feeling of excitement!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'REFLECTION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Tomorrow is the school trip to the zoo! Vijay cannot stop jumping and clapping.', question: 'What feeling word describes Vijay?', audioText: 'Tomorrow is the school trip to the zoo and Vijay cannot stop jumping and clapping! What word describes him?', options: [{ emoji: '😴', label: 'Bored' }, { emoji: '🤩', label: 'Excited' }, { emoji: '😢', label: 'Sad' }, { emoji: '😠', label: 'Angry' }], correct: 1, funFact: 'Excitement is a strong happy feeling we get when something wonderful is about to happen!', encouragement: 'You named that feeling perfectly! Great emotional vocabulary! 🎉' }
  },
  {
    id: 'cm-47-044', title: 'One at a Time', description: 'Learn why speaking one at a time makes communication better!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'QUIZ', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Four children all started talking to the teacher at the same time. The teacher could not understand anyone.', question: 'What should the children do so the teacher can understand?', audioText: 'Four children all talked to the teacher at the same time and she could not understand. What should they do?', options: [{ emoji: '📢', label: 'All talk even louder' }, { emoji: '🙋', label: 'Take turns and speak one at a time' }, { emoji: '😶', label: 'All stay silent forever' }, { emoji: '🏃', label: 'All run away' }], correct: 1, funFact: 'Taking turns to speak makes sure everyone\'s voice is heard!', encouragement: 'You know the rule of one at a time! Brilliant communication wisdom! 🙋' }
  },
  {
    id: 'cm-47-045', title: 'Show and Tell', description: 'Practise presenting something you love to others!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'CREATIVE_TASK', difficulty: 2, xpReward: 15, durationMin: 7, isOffline: true,
    content: { story: 'It is show and tell day! Meena brought her favourite toy elephant. She needs to tell the class about it.', question: 'What is the BEST thing for Meena to say about her toy?', audioText: 'It is show and tell day and Meena brought her favourite toy elephant. What is the best thing to say?', options: [{ emoji: '😶', label: 'This is a toy' }, { emoji: '🗣️', label: 'This is my elephant Gaju. I love him because he is soft and grey!' }, { emoji: '😭', label: 'I do not want to share' }, { emoji: '🏃', label: 'Run back to her seat' }], correct: 1, funFact: 'Show and tell helps children practise public speaking! Giving something a name and describing what you love makes a presentation interesting and personal.', encouragement: 'You gave a wonderful show and tell presentation! Little star speaker! 🐘' }
  },
  {
    id: 'cm-47-046', title: 'Right or Wrong Way to Ask', description: 'Choose the right way to ask for something you want!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'GAME', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Bunty wants to watch one more cartoon before bedtime.', question: 'What is the BEST way to ask?', audioText: 'Bunty wants to watch one more cartoon before bedtime. What is the best way to ask?', options: [{ emoji: '😭', label: 'Cry and roll on the floor' }, { emoji: '🙏', label: 'Papa can I please watch one more cartoon?' }, { emoji: '😠', label: 'I want to watch more NOW!' }, { emoji: '🏃', label: 'Just turn the TV back on' }], correct: 1, funFact: 'Asking politely with a please is much more effective than demanding or crying!', encouragement: 'You know the right way to ask! Polite and effective communication! 📺' }
  },
  {
    id: 'cm-47-047', title: 'Complete the Sentence', description: 'Practise speaking in complete sentences!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'GAME', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Teacher asked Kiran what his favourite food is. Kiran just said pizza.', question: 'How could Kiran say it as a complete sentence?', audioText: 'Teacher asked Kiran what his favourite food is and he just said pizza. How could he say it as a complete sentence?', options: [{ emoji: '🍕', label: 'Just pizza' }, { emoji: '🗣️', label: 'My favourite food is pizza because it is cheesy!' }, { emoji: '🤷', label: 'Food is good' }, { emoji: '😶', label: 'Say nothing more' }], correct: 1, funFact: 'Speaking in complete sentences helps people understand us much better!', encouragement: 'You speak in wonderful complete sentences! Great language skills! 🗣️' }
  },
  {
    id: 'cm-47-048', title: 'Surprised!', description: 'Identify and express the feeling of surprise!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'All of Diya\'s friends jumped out and shouted surprise for her birthday! Diya\'s eyes went wide and she put her hands on her cheeks.', question: 'How was Diya feeling?', audioText: 'Diya\'s friends jumped out and shouted surprise! Her eyes went wide. How was she feeling?', options: [{ emoji: '😴', label: 'Sleepy' }, { emoji: '😮', label: 'Surprised' }, { emoji: '😠', label: 'Angry' }, { emoji: '😢', label: 'Sad' }], correct: 1, funFact: 'Surprise is a very short emotion that happens when something unexpected occurs! Our eyes go wide because our brain needs more information quickly!', encouragement: 'You identified that feeling so well! Excellent emotional reading! 😮' }
  },
  {
    id: 'cm-47-049', title: 'Better Together', description: 'Learn how communication makes teamwork better!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Rani and Sita are building a block tower together. Rani puts blocks but Sita keeps knocking them over without realising.', question: 'What should Rani say to make their teamwork better?', audioText: 'Rani and Sita are building a block tower but Sita keeps accidentally knocking it over. What should Rani say?', options: [{ emoji: '😠', label: 'Stop touching my blocks!' }, { emoji: '🤝', label: 'Sita you hold the bottom and I will put blocks on top!' }, { emoji: '😭', label: 'Cry and stop building' }, { emoji: '🏃', label: 'Build alone instead' }], correct: 1, funFact: 'Communicating clearly in a team about who does what is called delegation! Communication is the foundation of teamwork!', encouragement: 'You know how to make teamwork better with communication! Leader in the making! 🏗️' }
  },
  {
    id: 'cm-47-050', title: 'I Love You', description: 'Express love and appreciation to people who matter!',
    ageGroup: ['EARLY'], skill: 'COMMUNICATION', type: 'REFLECTION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Grandma cooked Raju\'s favourite dish especially for him. Raju wants to show how much he loves and appreciates her.', question: 'What is the MOST loving thing Raju can say or do?', audioText: 'Grandma cooked Raju\'s favourite dish. What is the most loving thing he can say or do?', options: [{ emoji: '😶', label: 'Just eat quietly' }, { emoji: '🤗', label: 'Give her a hug and say thank you Nani I love you!' }, { emoji: '🏃', label: 'Eat and run outside' }, { emoji: '📺', label: 'Go watch TV' }], correct: 1, funFact: 'Expressing love through hugs, words and actions is one of the most powerful forms of human communication!', encouragement: 'You know how to express love! That is the most beautiful communication of all! ❤️' }
  },

  // ════════════════════════════════════════════════════════
  // AGES 4-7 | SOCIAL-EMOTIONAL | 50 activities
  // ════════════════════════════════════════════════════════
  {
    id: 'se-47-001', title: 'How Are You Feeling?', description: 'Learn to identify and name your feelings!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'REFLECTION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Every morning Amma asks Chotu how he is feeling. Today Chotu woke up with a big smile!', question: 'Which feeling word best describes Chotu this morning?', audioText: 'Chotu woke up with a big smile today. Which feeling word best describes him?', options: [{ emoji: '😊', label: 'Happy' }, { emoji: '😢', label: 'Sad' }, { emoji: '😠', label: 'Angry' }, { emoji: '😨', label: 'Scared' }], correct: 0, funFact: 'Being able to name how we feel is called emotional literacy! Children who can name their feelings build stronger friendships.', encouragement: 'You named that feeling perfectly! You have great emotional awareness! 😊' }
  },
  {
    id: 'se-47-002', title: 'Sharing is Caring', description: 'Learn why sharing makes everyone feel good!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Priya has five biscuits. Her friend Mina has none. Priya wants to be a good friend.', question: 'What should Priya do?', audioText: 'Priya has five biscuits and her friend Mina has none. What should Priya do to be a good friend?', options: [{ emoji: '🤤', label: 'Eat all five alone' }, { emoji: '🤝', label: 'Share some with Mina' }, { emoji: '😝', label: 'Tease Mina' }, { emoji: '🏃', label: 'Run away' }], correct: 1, funFact: 'Sharing makes both people happy! When we give something to a friend our brain releases a feel good chemical called oxytocin!', encouragement: 'You know that sharing is caring! What a generous heart! 🌟' }
  },
  {
    id: 'se-47-003', title: 'Taking a Deep Breath', description: 'Learn to calm down using deep breathing!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Arjun is very angry because his block tower fell down for the third time.', question: 'What is the BEST thing Arjun can do to calm down?', audioText: 'Arjun is very angry because his block tower fell down again. What is the best thing he can do?', options: [{ emoji: '👊', label: 'Hit the blocks' }, { emoji: '🌬️', label: 'Take three deep breaths' }, { emoji: '😱', label: 'Scream loudly' }, { emoji: '😭', label: 'Cry for an hour' }], correct: 1, funFact: 'Deep breathing sends a signal to your brain to calm down! It is a superpower!', encouragement: 'You know how to calm down! That is an amazing superpower! 🧘' }
  },
  {
    id: 'se-47-004', title: 'My Friend is Sad', description: 'Learn how to comfort a friend who is feeling sad!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Ravi\'s best friend Sunil is sitting alone in the corner. He looks very sad.', question: 'What should Ravi do to help Sunil?', audioText: 'Ravi\'s best friend Sunil is sitting alone looking very sad. What should Ravi do?', options: [{ emoji: '🏃', label: 'Walk past him' }, { emoji: '😝', label: 'Make fun of him' }, { emoji: '🤗', label: 'Sit with him and ask if he is okay' }, { emoji: '📺', label: 'Go watch TV' }], correct: 2, funFact: 'Checking on a sad friend is called showing empathy. Empathy is one of the most important skills for making and keeping friends!', encouragement: 'You know how to be there for a friend! Amazing empathy! 🤗' }
  },
  {
    id: 'se-47-005', title: 'Waiting My Turn', description: 'Learn why waiting your turn is important!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'There is only one swing in the park. Five children all want to use it. Meena pushes to the front.', question: 'What should Meena do instead?', audioText: 'There is one swing and five children want to use it. Meena pushes to the front. What should she do instead?', options: [{ emoji: '💥', label: 'Keep pushing forward' }, { emoji: '⏳', label: 'Wait in the queue' }, { emoji: '😠', label: 'Demand to go first' }, { emoji: '😭', label: 'Cry until she goes first' }], correct: 1, funFact: 'Waiting your turn is called patience and fairness! When everyone takes turns nobody gets left out and everyone has fun!', encouragement: 'You know how to wait your turn! That shows great self-control! ⏳' }
  },
  {
    id: 'se-47-006', title: 'Being a Good Sport', description: 'Learn how to handle winning and losing gracefully!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Pooja lost the running race at school. Her friend Asha came first. Pooja feels disappointed.', question: 'What is the BEST thing Pooja can do?', audioText: 'Pooja lost the running race and her friend Asha came first. Pooja feels disappointed. What is the best thing she can do?', options: [{ emoji: '😠', label: 'Say it was not fair' }, { emoji: '👏', label: 'Congratulate Asha and try harder next time' }, { emoji: '😭', label: 'Cry for the whole day' }, { emoji: '🏃', label: 'Refuse to play again' }], correct: 1, funFact: 'Being a good sport means being happy for others when they win and trying again when you lose. It makes people want to play with you more!', encouragement: 'You know how to be a great sport! That shows amazing maturity! 🏅' }
  },
  {
    id: 'se-47-007', title: 'Feeling Scared', description: 'Learn what to do when you feel scared!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Nita is scared of thunder during a big storm at night.', question: 'What is the BEST thing Nita can do when she feels scared?', audioText: 'Nita is scared of thunder during a big storm at night. What is the best thing she can do?', options: [{ emoji: '🙈', label: 'Hide under the bed' }, { emoji: '👨‍👩‍👧', label: 'Go to Amma or Papa' }, { emoji: '😱', label: 'Scream all night' }, { emoji: '🚪', label: 'Run outside' }], correct: 1, funFact: 'Going to a trusted adult when we feel scared is always the right thing to do! Asking for comfort is a sign of wisdom!', encouragement: 'You know what to do when you feel scared! Very wise and brave! 💪' }
  },
  {
    id: 'se-47-008', title: 'Including Everyone', description: 'Learn why including others in games matters!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'A new boy named Raju is watching from the side while other children play cricket. He looks lonely.', question: 'What should the other children do?', audioText: 'A new boy named Raju is watching from the side while others play cricket. He looks lonely. What should the children do?', options: [{ emoji: '😶', label: 'Ignore him' }, { emoji: '👋', label: 'Hey Raju come and play with us!' }, { emoji: '😝', label: 'Laugh at him for watching' }, { emoji: '🏃', label: 'Move further away' }], correct: 1, funFact: 'Including others makes everyone feel welcome and valued! A group that includes everyone is a happier and stronger group!', encouragement: 'You include everyone! That makes you a wonderful friend! 🌈' }
  },
  {
    id: 'se-47-009', title: 'I Made a Mistake', description: 'Learn that mistakes are okay and how to handle them!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'REFLECTION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Kavya drew outside the lines in her colouring book. She feels upset.', question: 'What is the BEST way for Kavya to feel about her mistake?', audioText: 'Kavya drew outside the lines in her colouring book and feels upset. What is the best way to feel?', options: [{ emoji: '😭', label: 'Cry and give up drawing' }, { emoji: '😊', label: 'That is okay I will try again!' }, { emoji: '😠', label: 'Tear up the whole book' }, { emoji: '🙈', label: 'Hide the drawing' }], correct: 1, funFact: 'Everyone makes mistakes — even great artists and scientists! Mistakes are how we learn and improve!', encouragement: 'You know mistakes are okay! That is a champion mindset! 🌟' }
  },
  {
    id: 'se-47-010', title: 'Feeling Proud', description: 'Recognise and celebrate the feeling of pride!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'REFLECTION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Sami helped his little sister tie her shoes for the first time. She jumped with joy!', question: 'How does Sami MOST LIKELY feel after helping his sister?', audioText: 'Sami helped his little sister tie her shoes for the first time. How does he most likely feel?', options: [{ emoji: '😢', label: 'Sad' }, { emoji: '😠', label: 'Angry' }, { emoji: '🏆', label: 'Proud and happy' }, { emoji: '😴', label: 'Tired' }], correct: 2, funFact: 'Pride is the wonderful feeling we get when we do something good or help someone!', encouragement: 'You recognised the feeling of pride! Beautiful emotional awareness! 🏆' }
  },
  {
    id: 'se-47-011', title: 'Saying No to Unkindness', description: 'Learn to stand up against unkind behaviour!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Two classmates are making fun of Deepa\'s lunchbox. Deepa\'s friend Tara sees this.', question: 'What should Tara do?', audioText: 'Two classmates are making fun of Deepa\'s lunchbox. What should her friend Tara do?', options: [{ emoji: '😶', label: 'Say nothing and watch' }, { emoji: '🛡️', label: 'Tell them to stop and support Deepa' }, { emoji: '😂', label: 'Join in the teasing' }, { emoji: '🏃', label: 'Walk away' }], correct: 1, funFact: 'Standing up for someone who is being treated unkindly is called being an upstander! Upstanders are brave kind people who make the world better!', encouragement: 'You would stand up for your friend! You are a true upstander! 🦸' }
  },
  {
    id: 'se-47-012', title: 'Feeling Nervous', description: 'Understand what nervousness feels like and what helps!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Tomorrow is Rani\'s first day at a new school. Her stomach feels fluttery and she cannot sleep.', question: 'What is Rani feeling?', audioText: 'Tomorrow is Rani\'s first day at a new school. Her stomach feels fluttery and she cannot sleep. What is she feeling?', options: [{ emoji: '😊', label: 'Very happy' }, { emoji: '😰', label: 'Nervous and anxious' }, { emoji: '😴', label: 'Very sleepy' }, { emoji: '😡', label: 'Angry' }], correct: 1, funFact: 'That fluttery feeling in your stomach is called butterflies! Even grown ups feel nervous before new experiences!', encouragement: 'You understood that nervous feeling! You have wonderful emotional knowledge! 🦋' }
  },
  {
    id: 'se-47-013', title: 'Helping at Home', description: 'Learn how helping at home shows love and responsibility!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Amma has been cooking all morning and looks very tired. Vasu wants to help.', question: 'What can Vasu do to help Amma?', audioText: 'Amma has been cooking all morning and looks very tired. What can Vasu do to help?', options: [{ emoji: '📺', label: 'Keep watching TV' }, { emoji: '🧹', label: 'Set the table or sweep the floor' }, { emoji: '😴', label: 'Go take a nap' }, { emoji: '😠', label: 'Ask her to hurry up' }], correct: 1, funFact: 'Helping at home without being asked is called taking initiative! It shows emotional maturity!', encouragement: 'You help without being asked! That shows such a caring heart! 🏠' }
  },
  {
    id: 'se-47-014', title: 'Feeling Jealous', description: 'Understand jealousy and how to handle it well!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'REFLECTION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Kiran\'s brother got a new bicycle. Kiran does not have one and feels a strange uncomfortable feeling inside.', question: 'What feeling is Kiran MOST LIKELY experiencing?', audioText: 'Kiran\'s brother got a new bicycle and Kiran feels a strange uncomfortable feeling. What feeling is this?', options: [{ emoji: '🤩', label: 'Excited' }, { emoji: '😒', label: 'Jealous' }, { emoji: '😴', label: 'Sleepy' }, { emoji: '😊', label: 'Happy' }], correct: 1, funFact: 'Jealousy is a normal feeling that everyone experiences sometimes! The best way to handle it is to notice it, talk about it and remember all the good things we already have.', encouragement: 'You understood jealousy! Knowing our feelings helps us handle them! 💛' }
  },
  {
    id: 'se-47-015', title: 'Keeping a Promise', description: 'Learn why keeping promises is important for trust!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Mira promised to play with her friend Sona after school but then a cartoon she likes came on TV.', question: 'What should Mira do?', audioText: 'Mira promised to play with Sona after school but her favourite cartoon came on TV. What should she do?', options: [{ emoji: '📺', label: 'Watch TV and forget Sona' }, { emoji: '🤝', label: 'Keep her promise and go to Sona' }, { emoji: '😴', label: 'Take a nap instead' }, { emoji: '🙈', label: 'Pretend she forgot' }], correct: 1, funFact: 'Keeping our promises builds trust. People who keep promises are known as reliable and others always want to be their friend!', encouragement: 'You keep your promises! That makes you someone people can always trust! 🤝' }
  },
  {
    id: 'se-47-016', title: 'Grateful Heart', description: 'Practise feeling and expressing gratitude!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'REFLECTION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Raju thinks about three things he is happy and grateful for today.', question: 'Which of these shows GRATITUDE?', audioText: 'Raju thinks about things he is grateful for. Which of these shows gratitude?', options: [{ emoji: '😠', label: 'I want more things!' }, { emoji: '🙏', label: 'I am thankful for my family food and health' }, { emoji: '😭', label: 'Nothing is good' }, { emoji: '🤷', label: 'I have nothing good' }], correct: 1, funFact: 'Children who practise gratitude every day are happier and sleep better at night!', encouragement: 'You have a grateful heart! That is one of the greatest gifts! 🙏' }
  },
  {
    id: 'se-47-017', title: 'When Someone is Hurt', description: 'Know how to respond when someone gets hurt!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'During recess Mihir falls down and scrapes his knee. He is crying.', question: 'What should his classmates do?', audioText: 'During recess Mihir falls down and scrapes his knee. He is crying. What should his classmates do?', options: [{ emoji: '😂', label: 'Laugh and keep playing' }, { emoji: '🏃', label: 'Run away' }, { emoji: '🤝', label: 'Help him and get a teacher' }, { emoji: '😶', label: 'Pretend not to see' }], correct: 2, funFact: 'Helping someone who is hurt is called compassion in action! Compassionate people make others feel safe and cared for!', encouragement: 'You help people when they are hurt! You are so compassionate! 🩹' }
  },
  {
    id: 'se-47-018', title: 'My Special Strengths', description: 'Recognise and celebrate your own strengths!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'REFLECTION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Teacher asks everyone in class to share one thing they are good at. Preethi is not sure what to say.', question: 'Which answer shows Preethi recognising her own strength?', audioText: 'Teacher asks everyone to share one thing they are good at. What can Preethi say about herself?', options: [{ emoji: '😞', label: 'I am not good at anything' }, { emoji: '🎨', label: 'I am good at drawing and being kind!' }, { emoji: '😴', label: 'I do not know' }, { emoji: '🤷', label: 'Nothing' }], correct: 1, funFact: 'Every single person has special strengths and talents! Knowing what we are good at is called self-awareness!', encouragement: 'You know your strengths! That is wonderful self-confidence! ⭐' }
  },
  {
    id: 'se-47-019', title: 'Feeling Bored', description: 'Learn healthy ways to handle the feeling of boredom!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Ritu has nothing to do on a Sunday afternoon. She feels bored.', question: 'What is a HEALTHY way for Ritu to deal with boredom?', audioText: 'Ritu has nothing to do on a Sunday afternoon and feels bored. What is a healthy way to deal with it?', options: [{ emoji: '😭', label: 'Cry about being bored' }, { emoji: '🎨', label: 'Draw a picture or read a book' }, { emoji: '📺', label: 'Watch TV for 5 hours' }, { emoji: '😠', label: 'Get angry at everyone' }], correct: 1, funFact: 'Boredom can actually be good for us! When we are bored our brains start to imagine and create new ideas!', encouragement: 'You found a healthy way to handle boredom! Creative thinker! 🎨' }
  },
  {
    id: 'se-47-020', title: 'Respecting Differences', description: 'Learn to appreciate that everyone is different and special!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'A new girl named Fatima joined the class. She speaks a different language and eats different food.', question: 'What is the KINDEST thing children can do?', audioText: 'A new girl named Fatima joined the class. She speaks a different language. What is the kindest thing to do?', options: [{ emoji: '😝', label: 'Laugh at her differences' }, { emoji: '😶', label: 'Ignore her completely' }, { emoji: '🌍', label: 'Welcome her and learn about her culture' }, { emoji: '🏃', label: 'Tell her to be like everyone else' }], correct: 2, funFact: 'India has over 19,500 languages and dialects! Our country is beautiful because of its diversity!', encouragement: 'You welcome and celebrate differences! That makes you a world citizen! 🌍' }
  },
  {
    id: 'se-47-021', title: 'The Kindness Boomerang', description: 'Discover how kindness comes back to you!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Sunita helped an old lady carry her bag at the market. The old lady smiled and blessed her.', question: 'How did the kind act make BOTH of them feel?', audioText: 'Sunita helped an old lady carry her bag. The old lady smiled and blessed her. How did both feel?', options: [{ emoji: '😢', label: 'Sad and tired' }, { emoji: '😊', label: 'Happy and warm inside' }, { emoji: '😠', label: 'Angry' }, { emoji: '😴', label: 'Sleepy' }], correct: 1, funFact: 'Kindness is like a boomerang — it always comes back to you! When we do something kind our brain releases happy chemicals!', encouragement: 'You understand the power of kindness! Keep spreading it! 💛' }
  },
  {
    id: 'se-47-022', title: 'Body Feelings', description: 'Connect physical body sensations to emotions!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'REFLECTION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Before his school play Rohan\'s heart is beating very fast and his hands feel shaky.', question: 'What emotion is Rohan\'s body showing?', audioText: 'Before his school play Rohan\'s heart is beating fast and his hands feel shaky. What emotion is his body showing?', options: [{ emoji: '😴', label: 'Very sleepy' }, { emoji: '😰', label: 'Nervous or excited' }, { emoji: '🤒', label: 'Sick' }, { emoji: '😊', label: 'Calm and relaxed' }], correct: 1, funFact: 'Our body shows emotions through physical signs! Fast heartbeat and shaky hands are signs of nervousness or excitement!', encouragement: 'You understand body feelings! That is amazing self-awareness! 💓' }
  },
  {
    id: 'se-47-023', title: 'Fairness', description: 'Understand what fairness means and why it matters!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Amma has one piece of cake to share between Diya and her sister. Diya wants to take the bigger piece.', question: 'What would be the FAIREST thing to do?', audioText: 'Amma has one piece of cake to share between Diya and her sister. What would be the fairest thing?', options: [{ emoji: '🎂', label: 'Diya takes the bigger piece' }, { emoji: '⚖️', label: 'Split it equally into two pieces' }, { emoji: '😭', label: 'Nobody gets any cake' }, { emoji: '😠', label: 'Fight over it' }], correct: 1, funFact: 'Fairness means everyone gets an equal and just share! It is a natural human value that helps communities work well together!', encouragement: 'You chose the fair option! That shows great justice and equality! ⚖️' }
  },
  {
    id: 'se-47-024', title: 'Disappointment', description: 'Learn to manage the feeling of disappointment healthily!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Gopal was very excited about a picnic. But it rained and the picnic was cancelled.', question: 'What is the BEST way for Gopal to handle his disappointment?', audioText: 'Gopal was excited about a picnic but it rained and the picnic was cancelled. What is the best way to handle this?', options: [{ emoji: '😭', label: 'Cry the whole day' }, { emoji: '😊', label: 'Feel sad for a bit then find a fun indoor activity' }, { emoji: '😠', label: 'Be angry at everyone' }, { emoji: '🏃', label: 'Run out in the rain anyway' }], correct: 1, funFact: 'Allowing ourselves to feel sad briefly and then finding another way forward is called resilience!', encouragement: 'You handle disappointment so well! That is true resilience! 🌦️' }
  },
  {
    id: 'se-47-025', title: 'Caring for Animals', description: 'Show empathy and care towards animals!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Tara sees a stray dog sitting in the rain looking cold and hungry.', question: 'What shows the most CARING response?', audioText: 'Tara sees a stray dog sitting in the rain looking cold and hungry. What shows the most caring response?', options: [{ emoji: '😶', label: 'Walk past and ignore it' }, { emoji: '🥣', label: 'Tell an adult and bring some food and water' }, { emoji: '😝', label: 'Make loud noises to scare it' }, { emoji: '🏃', label: 'Run away from it' }], correct: 1, funFact: 'Animals feel pain, hunger and cold just like we do. Taking care of other living beings is a sign of a beautiful and kind character!', encouragement: 'You care for all living beings! What a beautiful compassionate heart! 🐕' }
  },
  {
    id: 'se-47-026', title: 'Solving a Fight', description: 'Learn peaceful ways to solve disagreements with friends!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Bunny and Pinky both want to play with the same toy at the same time.', question: 'What is the MOST PEACEFUL way to solve this?', audioText: 'Bunny and Pinky both want to play with the same toy. What is the most peaceful way to solve this?', options: [{ emoji: '👊', label: 'Fight for the toy' }, { emoji: '⏳', label: 'Take turns — one plays then the other' }, { emoji: '😭', label: 'Both cry and nobody plays' }, { emoji: '💥', label: 'Break the toy so nobody gets it' }], correct: 1, funFact: 'Taking turns is a peaceful conflict resolution strategy! Finding a fair solution that works for both is called a compromise!', encouragement: 'You found a peaceful solution! Amazing conflict resolution skills! ☮️' }
  },
  {
    id: 'se-47-027', title: 'I Am Unique', description: 'Celebrate what makes you special and unique!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'REFLECTION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'In art class Teacher asked everyone to draw themselves. Asha noticed she looked different from her classmates.', question: 'What should Asha think about her differences?', audioText: 'In art class Asha noticed she looked different from her classmates. What should she think?', options: [{ emoji: '😞', label: 'I wish I was like everyone else' }, { emoji: '🌟', label: 'My differences make me special and unique!' }, { emoji: '😭', label: 'I want to hide' }, { emoji: '😠', label: 'It is not fair' }], correct: 1, funFact: 'Not one person on Earth has the same fingerprints, face or personality as you! Your uniqueness is your superpower!', encouragement: 'You know you are uniquely wonderful! Celebrate everything that makes you YOU! 🌟' }
  },
  {
    id: 'se-47-028', title: 'Feeling Lonely', description: 'Understand loneliness and how to feel better!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'All of Manu\'s friends are sick today. He is the only one at school and feels very alone.', question: 'What can Manu do to feel better?', audioText: 'All of Manu\'s friends are sick today and he feels very alone at school. What can he do to feel better?', options: [{ emoji: '😭', label: 'Cry at his desk all day' }, { emoji: '👋', label: 'Try talking to someone new or tell the teacher how he feels' }, { emoji: '😴', label: 'Sleep on the desk' }, { emoji: '😠', label: 'Be angry at his sick friends' }], correct: 1, funFact: 'Loneliness tells us we need connection. Talking to someone new or telling a trusted adult how we feel are the best ways to feel less lonely!', encouragement: 'You know how to reach out when lonely! That takes real courage! 🤝' }
  },
  {
    id: 'se-47-029', title: 'Thank You for Being My Friend', description: 'Express appreciation for your friends!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'CREATIVE_TASK', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Chandu has a best friend named Raju who always makes him laugh and helps him when he is sad.', question: 'What can Chandu do to show Raju how much their friendship means?', audioText: 'Chandu has a best friend named Raju who always makes him laugh. What can Chandu do to show how much their friendship means?', options: [{ emoji: '😶', label: 'Say nothing' }, { emoji: '💌', label: 'Draw him a friendship card' }, { emoji: '😠', label: 'Argue with him' }, { emoji: '🏃', label: 'Avoid him' }], correct: 1, funFact: 'Telling people they matter to us strengthens friendship bonds! Expressing appreciation is called affirming someone!', encouragement: 'You know how to celebrate friendship! You are a wonderful friend! 💌' }
  },
  {
    id: 'se-47-030', title: 'Calm Down Corner', description: 'Learn strategies to calm down when upset!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'GAME', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Lata is very upset and needs to calm down before she talks to her teacher.', question: 'Which is the BEST calming strategy for Lata?', audioText: 'Lata is very upset and needs to calm down. Which is the best calming strategy?', options: [{ emoji: '💥', label: 'Throw her pencil case' }, { emoji: '🧸', label: 'Hug a soft toy and breathe slowly' }, { emoji: '😱', label: 'Scream in the classroom' }, { emoji: '😠', label: 'Say mean things to classmates' }], correct: 1, funFact: 'Hugging something soft and breathing slowly activates the calming system in our brain!', encouragement: 'You know great calming strategies! Emotional wisdom at its best! 🧸' }
  },
  {
    id: 'se-47-031', title: 'Asking Permission', description: 'Learn when and how to ask for permission respectfully!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Kiran wants to go and play at his neighbour\'s house after school.', question: 'What should Kiran do before going?', audioText: 'Kiran wants to go and play at his neighbour\'s house after school. What should he do before going?', options: [{ emoji: '🏃', label: 'Just go without telling anyone' }, { emoji: '🙏', label: 'Ask Amma or Papa for permission first' }, { emoji: '😴', label: 'Go to sleep instead' }, { emoji: '📺', label: 'Watch TV and forget about it' }], correct: 1, funFact: 'Asking permission before going somewhere keeps us safe and shows respect to our parents!', encouragement: 'You always ask permission first! That shows great responsibility! 🏠' }
  },
  {
    id: 'se-47-032', title: 'The Worry Jar', description: 'Learn how talking about worries makes them smaller!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'REFLECTION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Deepa has been worrying about the school test for three days. She has not told anyone.', question: 'What should Deepa do with her worry?', audioText: 'Deepa has been worrying about the school test for three days and has not told anyone. What should she do?', options: [{ emoji: '🙈', label: 'Keep worrying alone' }, { emoji: '🗣️', label: 'Tell Amma or Papa about her worry' }, { emoji: '😴', label: 'Try to sleep all the time' }, { emoji: '😠', label: 'Refuse to go to school' }], correct: 1, funFact: 'Talking about our worries makes them feel smaller and less scary! It is like letting air out of a balloon!', encouragement: 'You know that sharing worries helps! That is emotionally brilliant! 🫙' }
  },
  {
    id: 'se-47-033', title: 'Celebrating Others', description: 'Learn to genuinely celebrate when others succeed!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Ananya won the prize for the best poem in class. Her classmate Vijay did not win.', question: 'What should Vijay do?', audioText: 'Ananya won the prize for the best poem. Her classmate Vijay did not win. What should Vijay do?', options: [{ emoji: '😒', label: 'Feel jealous and say nothing' }, { emoji: '👏', label: 'Clap and say well done Ananya!' }, { emoji: '😠', label: 'Say her poem was not good' }, { emoji: '🏃', label: 'Leave the room' }], correct: 1, funFact: 'Celebrating other people\'s success without jealousy is a sign of great emotional maturity and confidence!', encouragement: 'You celebrate others genuinely! That shows wonderful generosity of spirit! 👏' }
  },
  {
    id: 'se-47-034', title: 'Helping Without Being Asked', description: 'Recognise opportunities to help spontaneously!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Grandpa is trying to carry a heavy bag of groceries up the stairs.', question: 'What should you do even without being asked?', audioText: 'Grandpa is trying to carry a heavy bag of groceries up the stairs. What should you do?', options: [{ emoji: '📺', label: 'Keep watching TV' }, { emoji: '🙌', label: 'Run over and offer to help carry it' }, { emoji: '😴', label: 'Pretend you did not see' }, { emoji: '😠', label: 'Ask him to hurry up' }], correct: 1, funFact: 'Helping without being asked shows that we are paying attention to others and care about making their lives easier!', encouragement: 'You help without being asked! That shows true kindness of heart! 🌟' }
  },
  {
    id: 'se-47-035', title: 'When I Feel Angry', description: 'Learn safe ways to express and manage anger!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'GAME', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Raju\'s older brother broke his favourite toy. Raju feels very angry inside.', question: 'What is a SAFE way for Raju to express his anger?', audioText: 'Raju\'s older brother broke his favourite toy and Raju feels very angry. What is a safe way to express anger?', options: [{ emoji: '👊', label: 'Hit his brother' }, { emoji: '🗣️', label: 'Say I feel angry you broke my toy' }, { emoji: '💥', label: 'Break something else' }, { emoji: '😱', label: 'Scream for an hour' }], correct: 1, funFact: 'Using words to describe our anger instead of our hands is called expressing emotions constructively! I feel statements are powerful tools!', encouragement: 'You use words for your feelings! That is incredibly mature and wise! 🗣️' }
  },
  {
    id: 'se-47-036', title: 'Being Responsible', description: 'Learn what it means to be responsible for your things!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Meena forgot to water her plant for a whole week. The plant is now drooping.', question: 'What should Meena do?', audioText: 'Meena forgot to water her plant for a whole week and now it is drooping. What should she do?', options: [{ emoji: '🙈', label: 'Ignore the plant' }, { emoji: '💧', label: 'Water it now and set a reminder' }, { emoji: '🗑️', label: 'Throw the plant away' }, { emoji: '😭', label: 'Cry about it but do nothing' }], correct: 1, funFact: 'Taking care of something that belongs to us is called responsibility. Responsibility is learned through practice!', encouragement: 'You take responsibility! That shows great maturity and care! 🌱' }
  },
  {
    id: 'se-47-037', title: 'The Power of a Smile', description: 'Discover how a simple smile can change someone\'s day!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Every morning Sunita smiles at the school guard as she enters. The guard always smiles back.', question: 'What does Sunita\'s simple smile do for the guard?', audioText: 'Every morning Sunita smiles at the school guard. What does her simple smile do for the guard?', options: [{ emoji: '😞', label: 'Nothing at all' }, { emoji: '😊', label: 'Makes him feel seen and happy' }, { emoji: '😠', label: 'Makes him angry' }, { emoji: '😴', label: 'Makes him sleepy' }], correct: 1, funFact: 'A genuine smile triggers happy chemicals in BOTH your brain and theirs. One smile can change an entire day!', encouragement: 'You understand the power of a smile! Keep spreading them everywhere! 😊' }
  },
  {
    id: 'se-47-038', title: 'Too Rough Play', description: 'Learn the difference between fun play and rough play!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'During play time Ravi pushed his friend Mohan so hard that Mohan fell and cried.', question: 'What should Ravi understand about his behaviour?', audioText: 'Ravi pushed Mohan so hard that Mohan fell and cried. What should Ravi understand?', options: [{ emoji: '😂', label: 'It was just a funny game' }, { emoji: '💭', label: 'Pushing too hard hurts people and is not okay' }, { emoji: '🤷', label: 'Mohan should be tougher' }, { emoji: '🏃', label: 'Just run away' }], correct: 1, funFact: 'Checking in with our friends during play — asking are you okay? — shows emotional intelligence and keeps everyone safe!', encouragement: 'You understand what is too rough! Safe play shows you care about others! 🤝' }
  },
  {
    id: 'se-47-039', title: 'Feeling Loved', description: 'Recognise the feeling of being loved and cared for!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'REFLECTION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'When Tara came home from school sick Amma made her hot soup, hugged her and sat with her all evening.', question: 'How did Tara MOST LIKELY feel?', audioText: 'When Tara came home sick Amma made hot soup, hugged her and sat with her all evening. How did Tara feel?', options: [{ emoji: '😞', label: 'Still very sad' }, { emoji: '❤️', label: 'Loved and cared for' }, { emoji: '😠', label: 'Angry' }, { emoji: '🤔', label: 'Confused' }], correct: 1, funFact: 'Feeling loved is one of the most fundamental human needs! When people show us care through actions it fills our emotional cup and helps us heal faster!', encouragement: 'You recognised the feeling of being loved! That is such a beautiful awareness! ❤️' }
  },
  {
    id: 'se-47-040', title: 'My Safe People', description: 'Identify the trusted adults who keep you safe!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Pinku is learning about trusted adults who can help him stay safe.', question: 'Which of these is a SAFE trusted adult for Pinku?', audioText: 'Which of these is a safe trusted adult for Pinku?', options: [{ emoji: '👨‍👩‍👦', label: 'His parents' }, { emoji: '🧑‍💻', label: 'A stranger online' }, { emoji: '🤷', label: 'Someone he just met' }, { emoji: '📱', label: 'A random phone caller' }], correct: 0, funFact: 'Safe trusted adults are people who love us and have permission to take care of us — like parents, grandparents and teachers!', encouragement: 'You know your safe people! That knowledge keeps you protected and loved! 🛡️' }
  },
  {
    id: 'se-47-041', title: 'Big Feelings Small Body', description: 'Understand that big feelings are normal for little people!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'REFLECTION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Sometimes Riya feels so many feelings at once that she wants to cry and shout and laugh all together.', question: 'What should Riya know about having so many big feelings?', audioText: 'Sometimes Riya feels so many feelings at once she wants to cry and shout and laugh. What should she know?', options: [{ emoji: '😞', label: 'She is broken and wrong' }, { emoji: '💛', label: 'Big mixed feelings are normal for everyone' }, { emoji: '😠', label: 'She should never feel this way' }, { emoji: '🙈', label: 'She should hide all her feelings' }], correct: 1, funFact: 'Humans can feel multiple emotions at the same time! Scientists have discovered we have over 27 distinct emotional states!', encouragement: 'You know that all feelings are normal! Wonderful emotional acceptance! 💛' }
  },
  {
    id: 'se-47-042', title: 'Cheering Up a Friend', description: 'Find creative ways to cheer up a sad friend!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'CREATIVE_TASK', difficulty: 2, xpReward: 15, durationMin: 7, isOffline: true,
    content: { story: 'Bunty\'s friend Riya has been sad since her pet fish died. Bunty wants to make her smile.', question: 'What would be the MOST THOUGHTFUL way for Bunty to cheer up Riya?', audioText: 'Bunty\'s friend Riya has been sad since her pet fish died. What would be the most thoughtful way to cheer her up?', options: [{ emoji: '😶', label: 'Say nothing and hope she gets better' }, { emoji: '💌', label: 'Draw her a picture or write her a little note' }, { emoji: '😂', label: 'Make jokes about the fish' }, { emoji: '🏃', label: 'Avoid her until she is happy' }], correct: 1, funFact: 'Small gestures of kindness like drawing a picture or writing a note can make someone feel remembered and loved!', encouragement: 'You chose the most thoughtful way to help! You are a truly wonderful friend! 🎨' }
  },
  {
    id: 'se-47-043', title: 'No Means No', description: 'Learn to respect boundaries and understand consent!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Mina does not like being hugged. When her friend Tara tries to hug her Mina says please do not hug me.', question: 'What should Tara do?', audioText: 'Mina does not like being hugged and tells her friend Tara. What should Tara do?', options: [{ emoji: '💪', label: 'Hug her anyway' }, { emoji: '🤝', label: 'Respect her feelings and wave instead' }, { emoji: '😠', label: 'Get angry at Mina' }, { emoji: '😭', label: 'Cry and feel rejected' }], correct: 1, funFact: 'Everyone has the right to decide who can touch their body. Respecting when someone says no is called respecting personal boundaries!', encouragement: 'You respect boundaries! That shows wonderful respect for others! 🛡️' }
  },
  {
    id: 'se-47-044', title: 'Trying Something New', description: 'Build the courage to try new and challenging things!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Vikram has never tried swimming. Today his class is going to the pool for the first time. He feels nervous.', question: 'What is the BRAVEST and BEST thing Vikram can do?', audioText: 'Vikram has never tried swimming and feels nervous. What is the bravest and best thing he can do?', options: [{ emoji: '🏠', label: 'Ask to go back home' }, { emoji: '💪', label: 'Tell the teacher he is nervous and try his best' }, { emoji: '😭', label: 'Cry and refuse to go in' }, { emoji: '😴', label: 'Pretend to be sick' }], correct: 1, funFact: 'Bravery is feeling scared and trying anyway! Telling someone we trust that we are nervous before doing something new is an act of great courage!', encouragement: 'You are brave enough to try new things! That is extraordinary courage! 🏊' }
  },
  {
    id: 'se-47-045', title: 'When Grownups Argue', description: 'Learn that it is okay when adults disagree and how to feel safe!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'REFLECTION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Sonu heard his parents arguing about something in the next room. He felt scared and worried.', question: 'What should Sonu know to help him feel better?', audioText: 'Sonu heard his parents arguing and felt scared. What should he know to feel better?', options: [{ emoji: '😱', label: 'Everything is falling apart' }, { emoji: '💛', label: 'Adults sometimes disagree and it is not his fault' }, { emoji: '😠', label: 'He should make them stop' }, { emoji: '🏃', label: 'He should run away from home' }], correct: 1, funFact: 'All adults disagree sometimes! It is never a child\'s fault when adults argue. Talking to a trusted adult about how you feel always helps!', encouragement: 'You know that disagreements are not your fault! That understanding protects your heart! 💛' }
  },
  {
    id: 'se-47-046', title: 'Counting to Ten', description: 'Learn the counting to ten strategy for managing big emotions!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'GAME', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Papa always tells Raju to count to ten slowly whenever he feels very angry.', question: 'WHY does counting to ten help when we are angry?', audioText: 'Papa always tells Raju to count to ten slowly when he feels very angry. Why does this help?', options: [{ emoji: '🔢', label: 'Because numbers are fun' }, { emoji: '🧠', label: 'It gives the brain time to calm down' }, { emoji: '😴', label: 'It makes you sleepy' }, { emoji: '🤷', label: 'It does not really help' }], correct: 1, funFact: 'Counting slowly to ten takes about 10 seconds. In those 10 seconds the angry feeling in your brain has time to cool down!', encouragement: 'You know why counting helps! Brilliant emotional self-regulation! 🔟' }
  },
  {
    id: 'se-47-047', title: 'Saying What I Need', description: 'Practise clearly expressing what you need!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Anu is feeling overwhelmed and needs some quiet time. Her siblings keep making noise.', question: 'What should Anu say to express what she needs?', audioText: 'Anu is feeling overwhelmed and needs quiet time but her siblings keep making noise. What should she say?', options: [{ emoji: '😭', label: 'Just cry without explaining' }, { emoji: '🗣️', label: 'I need some quiet time please. I am feeling overwhelmed.' }, { emoji: '😠', label: 'Scream at her siblings' }, { emoji: '😴', label: 'Just go to sleep' }], correct: 1, funFact: 'Telling people what we need is called assertive communication. People who express their needs clearly have much less stress!', encouragement: 'You know how to say what you need! That is powerful self-advocacy! 💛' }
  },
  {
    id: 'se-47-048', title: 'A Good Deed a Day', description: 'Discover how one good deed can spread happiness!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'REFLECTION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Every day before school Gopal does one kind thing for someone. Today he picked up litter from the street.', question: 'Why is doing one good deed every day a wonderful habit?', audioText: 'Every day Gopal does one kind thing for someone. Today he picked up litter. Why is this a wonderful habit?', options: [{ emoji: '🤷', label: 'It does not really matter' }, { emoji: '🌍', label: 'It makes the world a little better every day' }, { emoji: '😴', label: 'It is tiring and pointless' }, { emoji: '😠', label: 'It wastes time' }], correct: 1, funFact: 'If every person on Earth did one kind deed per day that would be over 8 billion acts of kindness every single day!', encouragement: 'You understand the power of daily kindness! You are making the world better! 🌍' }
  },
  {
    id: 'se-47-049', title: 'Jealousy vs Inspiration', description: 'Learn the difference between jealousy and healthy inspiration!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'REFLECTION', difficulty: 2, xpReward: 15, durationMin: 6, isOffline: true,
    content: { story: 'Riya saw her classmate Priya draw a beautiful horse. Riya thought wow I want to draw like that someday!', question: 'What is Riya feeling — jealousy or inspiration?', audioText: 'Riya saw Priya draw a beautiful horse and thought she wanted to draw like that someday. What is Riya feeling?', options: [{ emoji: '😒', label: 'Jealousy — she wants what Priya has' }, { emoji: '✨', label: 'Inspiration — she is motivated to improve' }, { emoji: '😠', label: 'Anger — she thinks it is unfair' }, { emoji: '😴', label: 'Boredom — she does not care' }], correct: 1, funFact: 'Inspiration means we see something great in someone else and feel motivated to grow ourselves! It is positive and leads to learning!', encouragement: 'You know the difference between jealousy and inspiration! Emotionally brilliant! ✨' }
  },
  {
    id: 'se-47-050', title: 'I Am Enough', description: 'Build confidence by knowing you are already enough!',
    ageGroup: ['EARLY'], skill: 'SOCIAL_EMOTIONAL', type: 'REFLECTION', difficulty: 1, xpReward: 10, durationMin: 5, isOffline: true,
    content: { story: 'Sometimes Chotu compares himself to his classmates and feels like he is not as smart or talented.', question: 'What is the MOST IMPORTANT thing Chotu should remember?', audioText: 'Sometimes Chotu compares himself to classmates and feels not as smart. What should he remember?', options: [{ emoji: '😞', label: 'He is right — he is not enough' }, { emoji: '💛', label: 'He is unique special and enough exactly as he is' }, { emoji: '😠', label: 'He should be angry at his classmates' }, { emoji: '🏃', label: 'He should try to be exactly like others' }], correct: 1, funFact: 'You are the only version of yourself that has ever existed in the entire universe! Your unique combination of talents makes you irreplaceable!', encouragement: 'You are enough — more than enough! You are absolutely wonderful exactly as you are! 💛' }
  },

  // ════════════════════════════════════════════════════════
  // AGES 8-12 | CRITICAL THINKING | 10 sample activities
  // ════════════════════════════════════════════════════════
  {
    id: 'ct-812-001', title: 'The Fake News Detective', description: 'Learn to spot fake news and unreliable information!',
    ageGroup: ['MIDDLE'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 8, isOffline: false,
    content: { story: 'Arjun saw a post on his cousin\'s phone saying that eating ice cream every day makes you smarter. Thousands of people had shared it. His cousin believed it completely.', storyEmoji: '📱', question: 'What should Arjun do BEFORE believing or sharing this claim?', options: ['Share it immediately — thousands of people cannot be wrong', 'Check if a scientist or doctor has actually proven this', 'Start eating ice cream every day just in case', 'Believe it because it sounds like good news'], correct: 1, funFact: 'Just because something is shared thousands of times does not make it true! Always check if information comes from a qualified expert or reliable source before believing or sharing it.', encouragement: 'You think before you share! That makes you a responsible digital citizen! 🕵️' }
  },
  {
    id: 'ct-812-002', title: 'Both Sides of the Story', description: 'Learn to consider multiple perspectives before judging!',
    ageGroup: ['MIDDLE'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 8, isOffline: true,
    content: { story: 'Riya told the teacher that Priya pushed her. The teacher was about to punish Priya. But Priya said Riya had first taken her pencil without asking and she was trying to get it back.', storyEmoji: '⚖️', question: 'What should the teacher do BEFORE deciding who is wrong?', options: ['Punish Priya immediately since Riya complained first', 'Listen to both sides carefully before making any decision', 'Punish both of them to be safe', 'Ignore the whole situation'], correct: 1, funFact: 'Every situation has at least two sides! Good judges, detectives and leaders always gather all the information before making a decision. This is called fair and balanced thinking.', encouragement: 'You always hear both sides! That is the mark of a truly fair and wise thinker! ⚖️' }
  },
  {
    id: 'ct-812-003', title: 'The Experiment Plan', description: 'Design a simple experiment to test an idea!',
    ageGroup: ['MIDDLE'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 3, xpReward: 20, durationMin: 10, isOffline: true,
    content: { story: 'Vikram thinks plants grow faster when you talk to them. His friend says that is nonsense. Vikram wants to prove it scientifically.', storyEmoji: '🌱', question: 'What is the BEST way for Vikram to test his idea fairly?', options: ['Just talk to one plant and see if it grows', 'Grow two identical plants — talk to one and not the other — compare after 4 weeks', 'Ask his friends if they think plants like talking', 'Search for someone else who already tested this'], correct: 1, funFact: 'A fair experiment always has a control group — one that is unchanged — and a test group. This is the scientific method!', encouragement: 'You designed a proper experiment! You think like a real scientist! 🔬' }
  },
  {
    id: 'ct-812-004', title: 'Root Cause Finder', description: 'Find the real cause of a problem rather than treating symptoms!',
    ageGroup: ['MIDDLE'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 3, xpReward: 20, durationMin: 8, isOffline: true,
    content: { story: 'Kavya keeps getting low marks in Maths. She gets extra tuition but her marks are still low. Her tuition teacher notices she is always very tired in class and cannot concentrate.', storyEmoji: '📊', question: 'What is MOST LIKELY the ROOT CAUSE of Kavya\'s low marks?', options: ['She is simply not smart enough for Maths', 'She needs even more tuition classes', 'She is not getting enough sleep which affects her concentration', 'The Maths syllabus is too hard for everyone'], correct: 2, funFact: 'Root cause analysis means finding the original reason a problem exists rather than just treating the surface symptoms. Doctors, engineers and detectives use this skill every day!', encouragement: 'You found the real problem not just the surface! Deep thinker! 🧠' }
  },
  {
    id: 'ct-812-005', title: 'The Best Solution', description: 'Evaluate multiple solutions and pick the most effective one!',
    ageGroup: ['MIDDLE'], skill: 'CRITICAL_THINKING', type: 'GAME', difficulty: 2, xpReward: 15, durationMin: 8, isOffline: true,
    content: { story: 'The school water cooler is broken and students are going thirsty during a hot day. The principal needs to solve this quickly.', storyEmoji: '💧', question: 'Which solution solves the problem MOST effectively RIGHT NOW?', options: ['Tell students to wait until the cooler is repaired next week', 'Ask students to bring extra water bottles from home tomorrow', 'Immediately arrange water cans or distribute water bottles today', 'Cancel school for the day'], correct: 2, funFact: 'Good problem solvers think about what can be done immediately versus what takes time. The best solutions address the urgent need first!', encouragement: 'You found the most effective solution! Outstanding practical thinking! 💡' }
  },
  {
    id: 'ct-812-006', title: 'Logical or Illogical?', description: 'Identify when an argument does not make logical sense!',
    ageGroup: ['MIDDLE'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 3, xpReward: 20, durationMin: 8, isOffline: true,
    content: { story: 'Mohan said: My grandfather smoked his whole life and lived to 95. Therefore smoking is not harmful.', storyEmoji: '🤔', question: 'What is WRONG with Mohan\'s argument?', options: ['Nothing — his grandfather proved smoking is safe', 'One person\'s experience cannot represent the experience of millions of people', 'Only doctors can say if smoking is harmful', 'His grandfather must have been lying about his age'], correct: 1, funFact: 'Using one example to make a general conclusion is called anecdotal evidence. It is a logical fallacy! Scientific conclusions need data from thousands of people!', encouragement: 'You spotted the logical flaw! That is exceptional critical reasoning! 🏆' }
  },
  {
    id: 'ct-812-007', title: 'Prioritise the Tasks', description: 'Learn to prioritise what is urgent versus what can wait!',
    ageGroup: ['MIDDLE'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 8, isOffline: true,
    content: { story: 'Neha has an exam tomorrow. She also has a drawing competition next month and a birthday party this weekend. She only has 2 hours free today.', storyEmoji: '📅', question: 'How should Neha use her 2 hours TODAY?', options: ['Draw for the competition since she loves drawing', 'Plan what to wear to the birthday party', 'Study for tomorrow\'s exam — it is the most urgent', 'Do a little of everything and nothing properly'], correct: 2, funFact: 'Prioritising means doing the most important and most urgent task first. Ask yourself: what happens if I do not do this today?', encouragement: 'You prioritised perfectly! That is a life skill that leads to great success! 📋' }
  },
  {
    id: 'ct-812-008', title: 'Question the Assumption', description: 'Challenge hidden assumptions in everyday thinking!',
    ageGroup: ['MIDDLE'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 3, xpReward: 20, durationMin: 8, isOffline: true,
    content: { story: 'The class monitor said: Only students who are good at studies should be given responsibilities in school events.', storyEmoji: '🏫', question: 'What HIDDEN ASSUMPTION is the monitor making?', options: ['That academic marks show a student\'s overall ability and character', 'That school events are not important', 'That teachers cannot manage events themselves', 'That all students want responsibilities'], correct: 0, funFact: 'An assumption is something we believe is true without actually checking! Good thinkers always identify and question assumptions.', encouragement: 'You spotted the hidden assumption! Exceptional philosophical thinking! 🌟' }
  },
  {
    id: 'ct-812-009', title: 'Cause and Consequence', description: 'Think through the chain of consequences before acting!',
    ageGroup: ['MIDDLE'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 2, xpReward: 15, durationMin: 8, isOffline: true,
    content: { story: 'Rahul is thinking about copying his friend\'s homework because he did not do his own. He thinks the teacher will never find out.', storyEmoji: '📝', question: 'What is the most LIKELY long-term consequence if Rahul keeps copying?', options: ['He will always get good marks and everything will be fine', 'He will never actually learn the subject and fall behind eventually', 'His friend will become famous for his homework', 'The teacher will be impressed by his neatness'], correct: 1, funFact: 'Short-term shortcuts often create long-term problems! Thinking about consequences before acting is called consequential thinking!', encouragement: 'You thought through the consequences! That is mature and wise thinking! 🎯' }
  },
  {
    id: 'ct-812-010', title: 'The Better Argument', description: 'Evaluate which argument is stronger and better supported!',
    ageGroup: ['MIDDLE'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 3, xpReward: 20, durationMin: 8, isOffline: true,
    content: { story: 'Two students debate about homework. Shreya says homework should be banned because she finds it boring. Rohan says homework should be reduced because research shows 2 hours daily is the effective limit and more causes burnout.', storyEmoji: '💬', question: 'Whose argument is STRONGER and why?', options: ['Shreya — because personal feelings matter most', 'Rohan — because his argument uses research evidence not just feelings', 'Both are equally strong arguments', 'Neither — homework cannot be changed'], correct: 1, funFact: 'A strong argument uses evidence, facts and reasoning not just personal feelings. This is called evidence-based thinking!', encouragement: 'You identified the stronger argument! Brilliant analytical thinking! 💪' }
  },

  // ════════════════════════════════════════════════════════
  // AGES 13-20 | CRITICAL THINKING | 10 sample activities
  // ════════════════════════════════════════════════════════
  {
    id: 'ct-1320-001', title: 'The Bias Detector', description: 'Identify cognitive bias in everyday decision making!',
    ageGroup: ['TEEN'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 3, xpReward: 20, durationMin: 10, isOffline: false,
    content: { story: 'Aditya has believed since childhood that people from a particular state are dishonest. When his new classmate from that state makes a mistake Aditya immediately thinks see I was right. But his classmate from his own state makes the same mistake and Aditya thinks nothing of it.', question: 'What cognitive bias is Aditya demonstrating?', options: ['Confirmation bias — seeking evidence that supports existing beliefs while ignoring contradictory evidence', 'Recency bias — judging based on the most recent event only', 'Optimism bias — believing good things will happen to him', 'Sunk cost bias — continuing something because of past investment'], correct: 0, funFact: 'Confirmation bias is one of the most common and dangerous thinking errors! Our brain actively seeks information that confirms what we already believe. Knowing this helps us actively seek opposing viewpoints.', encouragement: 'You identified the cognitive bias! That level of self-awareness is rare and powerful! 🧠' }
  },
  {
    id: 'ct-1320-002', title: 'First Principles Thinking', description: 'Break down a problem to its most fundamental truths!',
    ageGroup: ['TEEN'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 4, xpReward: 25, durationMin: 12, isOffline: true,
    content: { story: 'Everyone in Priya\'s school buys expensive branded stationery because that is what students have always done. Priya questions whether branded stationery actually helps you study better or whether it is just a social expectation.', question: 'What thinking approach is Priya using?', options: ['Copying what successful people do', 'First principles thinking — questioning assumptions to find what is fundamentally true', 'Trend following — doing what is popular', 'Contrarian thinking — disagreeing with everything'], correct: 1, funFact: 'First principles thinking was used by Elon Musk to reduce rocket costs by 90%! Instead of accepting expensive rocket parts as given he asked what are rockets fundamentally made of and sourced raw materials directly.', encouragement: 'You understand first principles thinking! This is how the world\'s greatest innovators think! 🚀' }
  },
  {
    id: 'ct-1320-003', title: 'The Ethical Dilemma', description: 'Navigate a complex ethical situation with reasoned thinking!',
    ageGroup: ['TEEN'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 4, xpReward: 25, durationMin: 12, isOffline: true,
    content: { story: 'Rohit discovers his best friend has been cheating in exams. If he reports it his friend could be expelled and their friendship destroyed. If he stays silent he is complicit in dishonesty that unfairly disadvantages honest students.', question: 'What approach demonstrates the MOST ethical and thoughtful response?', options: ['Stay silent to protect the friendship at all costs', 'Immediately report to teachers without speaking to friend first', 'Talk to the friend privately first giving them a chance to come clean themselves', 'Spread the information to other classmates'], correct: 2, funFact: 'Ethical dilemmas often have no perfect solution. The best approach respects multiple values — honesty, fairness and loyalty. Speaking to the friend first gives them agency and dignity while addressing the wrong.', encouragement: 'You navigated that ethical dilemma with wisdom and care! Outstanding moral reasoning! ⚖️' }
  },
  {
    id: 'ct-1320-004', title: 'Statistical Thinking', description: 'Understand how statistics can mislead or inform!',
    ageGroup: ['TEEN'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 4, xpReward: 25, durationMin: 10, isOffline: false,
    content: { story: 'A coaching institute claims 95% of their students pass the entrance exam. But they do not mention that they only accept students who already scored above 90% in school. Meanwhile a rival institute claims only 70% pass but they accept all students.', question: 'Which institute is ACTUALLY more effective at teaching?', options: ['The first institute — 95% is clearly better than 70%', 'Cannot determine without knowing the starting level of students at each institute', 'The second institute — lower pass rates mean they try harder', 'Both are equally effective'], correct: 1, funFact: 'Statistics without context can be deeply misleading! This is called selection bias. Always ask WHO was included in the data before drawing conclusions!', encouragement: 'You saw through the misleading statistics! That is elite level analytical thinking! 📊' }
  },
  {
    id: 'ct-1320-005', title: 'Second Order Thinking', description: 'Think beyond immediate effects to downstream consequences!',
    ageGroup: ['TEEN'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 4, xpReward: 25, durationMin: 12, isOffline: true,
    content: { story: 'The government of a city decides to make all public transport free to reduce traffic. Immediately traffic reduces. But six months later traffic is worse than before and the transport system is overcrowded and deteriorating.', question: 'What SECOND ORDER consequence did the government fail to anticipate?', options: ['People would stop buying cars entirely', 'Free transport would attract more users overwhelming the system and people would return to cars', 'The city would become too popular with tourists', 'Bus drivers would go on strike for better pay'], correct: 1, funFact: 'Second order thinking means asking and then what happens after that? Great strategists, investors and policy makers always think multiple steps ahead!', encouragement: 'You thought multiple steps ahead! That is how the greatest strategic minds operate! ♟️' }
  },
  {
    id: 'ct-1320-006', title: 'Separating Fact from Opinion', description: 'Distinguish between objective facts and subjective opinions!',
    ageGroup: ['TEEN'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 3, xpReward: 20, durationMin: 8, isOffline: false,
    content: { story: 'A political leader\'s speech contained these statements: India\'s GDP grew 7.2% last year. Our government is the best in history. We have built 500 new schools. Opposition parties do not care about education.', question: 'Which statements are FACTS and which are OPINIONS?', options: ['All four statements are facts because a leader said them', 'GDP growth and school count are facts — best government and opposition claims are opinions', 'All four are opinions because they come from a politician', 'Only the school count is a fact — everything else is opinion'], correct: 1, funFact: 'Facts can be verified with evidence. Opinions are personal judgements or interpretations. Being able to separate these is crucial for understanding media and politics!', encouragement: 'You separated facts from opinions perfectly! This skill protects you from manipulation! 🎯' }
  },
  {
    id: 'ct-1320-007', title: 'The Inversion Technique', description: 'Solve problems by thinking backwards from the worst outcome!',
    ageGroup: ['TEEN'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 4, xpReward: 25, durationMin: 12, isOffline: true,
    content: { story: 'Shreya wants to make sure her group project gets an excellent grade. Instead of only thinking about what to do right she decides to think about all the ways the project could fail badly.', question: 'Why is thinking about HOW THE PROJECT COULD FAIL a smart strategy?', options: ['It is not smart — positive thinking always works better', 'By identifying potential failures in advance she can prevent them proactively', 'It makes the group work harder out of fear', 'Teachers reward students who predict problems'], correct: 1, funFact: 'This technique is called inversion and was used by the ancient Stoics and modern investors like Charlie Munger! Instead of asking how to succeed ask how to avoid failure!', encouragement: 'You understand the power of inversion! You think like a master strategist! 🔄' }
  },
  {
    id: 'ct-1320-008', title: 'Correlation vs Causation', description: 'Understand the crucial difference between correlation and causation!',
    ageGroup: ['TEEN'], skill: 'CRITICAL_THINKING', type: 'QUIZ', difficulty: 4, xpReward: 25, durationMin: 10, isOffline: false,
    content: { story: 'A researcher found that cities with more libraries have lower crime rates. A politician concluded that building more libraries will reduce crime and proposed a massive library building programme.', question: 'What is the FLAW in the politician\'s reasoning?', options: ['Libraries are not useful institutions', 'Correlation does not prove causation — both could be caused by a third factor like higher education levels or wealth', 'Crime statistics are always unreliable', 'The researcher made a mathematical error'], correct: 1, funFact: 'Correlation means two things happen together. Causation means one thing directly causes another. Ice cream sales and drowning rates both rise in summer but ice cream does not cause drowning!', encouragement: 'You understand correlation vs causation! This single insight prevents enormous policy mistakes! 📈' }
  },
  {
    id: 'ct-1320-009', title: 'The Steel Man Argument', description: 'Build the strongest possible version of an opposing argument!',
    ageGroup: ['TEEN'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 4, xpReward: 25, durationMin: 12, isOffline: true,
    content: { story: 'Karan strongly believes that social media is harmful for teenagers. His debate teacher asks him to construct the strongest possible argument FOR social media before arguing against it.', question: 'Why does the teacher ask Karan to argue FOR something he disagrees with?', options: ['To confuse him and test his memory', 'Understanding the strongest opposing argument makes your own argument much more persuasive and honest', 'Because the teacher personally supports social media', 'Debate rules require arguing both sides randomly'], correct: 1, funFact: 'A steel man is the opposite of a straw man — instead of weakening an opponent\'s argument you make it as strong as possible. This is how the world\'s best thinkers debate!', encouragement: 'You understand steel man thinking! That is intellectual maturity of the highest level! 🗡️' }
  },
  {
    id: 'ct-1320-010', title: 'The Decision Matrix', description: 'Use structured thinking to make complex decisions!',
    ageGroup: ['TEEN'], skill: 'CRITICAL_THINKING', type: 'SIMULATION', difficulty: 4, xpReward: 25, durationMin: 12, isOffline: true,
    content: { story: 'Ananya must choose between three options after Class 12: join her family business immediately, take a gap year to travel and discover herself, or go to college. Each option has different implications for money, independence, experience and her parents\' expectations.', question: 'What is the MOST structured and rational approach to making this decision?', options: ['Do whatever her friends are doing', 'Choose the option her parents prefer to avoid conflict', 'List her top 5 values and evaluate each option against those values with pros and cons', 'Flip a coin — all options are equally valid anyway'], correct: 2, funFact: 'A decision matrix where you score each option against your personal values is used by executives, doctors and military leaders for high stakes decisions!', encouragement: 'You choose structured thinking for big decisions! That wisdom will serve you your entire life! 🎯' }
  },
]

// ── MAIN SEED FUNCTION ────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Starting seed...')

  // Seed badges
  console.log('📛 Seeding badges...')
  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where:  { id: badge.id },
      update: { name: badge.name, description: badge.description, emoji: badge.emoji, condition: badge.condition },
      create: { id: badge.id, name: badge.name, description: badge.description, emoji: badge.emoji, condition: badge.condition },
    })
  }
  console.log(`✅ ${BADGES.length} badges seeded`)

  // Seed activities
  console.log('🎮 Seeding activities...')
  let count = 0
  for (const activity of ACTIVITIES) {
    await prisma.activity.upsert({
      where: { id: activity.id },
      update: {
        title:       activity.title,
        description: activity.description,
        ageGroup:    activity.ageGroup as ('EARLY' | 'MIDDLE' | 'TEEN' | 'YOUNG_ADULT')[],
        skill:       activity.skill as any,
        type:        activity.type as any,
        difficulty:  activity.difficulty,
        xpReward:    activity.xpReward,
        durationMin: activity.durationMin,
        isOffline:   activity.isOffline,
        content:     activity.content,
      },
      create: {
        id:          activity.id,
        title:       activity.title,
        description: activity.description,
        ageGroup:    activity.ageGroup as ('EARLY' | 'MIDDLE' | 'TEEN' | 'YOUNG_ADULT')[],
        skill:       activity.skill as any,
        type:        activity.type as any,
        difficulty:  activity.difficulty,
        xpReward:    activity.xpReward,
        durationMin: activity.durationMin,
        isOffline:   activity.isOffline,
        content:     activity.content,
      },
    })
    count++
    if (count % 10 === 0) console.log(`   ${count}/${ACTIVITIES.length} activities seeded...`)
  }

  console.log(`✅ ${ACTIVITIES.length} activities seeded`)
  console.log('🎉 Seed complete!')
  console.log(`   📛 ${BADGES.length} badges`)
  console.log(`   🎮 ${ACTIVITIES.length} activities`)
  console.log(`      - Ages 4-7:   150 activities`)
  console.log(`      - Ages 8-12:   10 activities`)
  console.log(`      - Ages 13-20:  10 activities`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
