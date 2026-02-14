export interface VocabularyItem {
    word: string;
    phonetic?: string;
    meaning: string; // Indonesian meaning for easier learning? Or English definition? Let's stick to English definition for now as per previous pattern, or mixed. User asked for "Dictionary" style previously, so Definition + Example.
    definition: string;
    example: string;
}

export interface VocabularyCategory {
    id: string;
    title: string;
    description: string;
    icon: string; // We'll map this in the component
    words: VocabularyItem[];
}

export const vocabularyCategories: VocabularyCategory[] = [
    {
        id: 'daily-life',
        title: 'Daily Life',
        description: 'Common words used in everyday conversations and routines.',
        icon: 'Sun',
        words: [
            { word: 'Groceries', phonetic: '/ˈɡroʊ.sər.iz/', definition: 'Food and other goods sold by a grocer or supermarket.', example: 'I need to buy some groceries on my way home.' },
            { word: 'Commute', phonetic: '/kəˈmjuːt/', definition: 'Travel some distance between one\'s home and place of work on a regular basis.', example: 'My morning commute takes about 45 minutes.' },
            { word: 'Chore', phonetic: '/tʃɔːr/', definition: 'A routine task, especially a household one.', example: 'Washing dishes is my least favorite chore.' },
            { word: 'Errand', phonetic: '/ˈer.ənd/', definition: 'A short journey undertaken in order to deliver or collect something, often on someone else\'s behalf.', example: 'I have a few errands to run this afternoon.' },
            { word: 'Leisure', phonetic: '/ˈliː.ʒər/', definition: 'Use of free time for enjoyment.', example: 'I spend my leisure time reading books.' }
        ]
    },
    {
        id: 'business-work',
        title: 'Business & Work',
        description: 'Professional vocabulary for meetings, emails, and office environments.',
        icon: 'Briefcase',
        words: [
            { word: 'Deadline', phonetic: '/ˈded.laɪn/', definition: 'The latest time or date by which something should be completed.', example: 'We have a tight deadline for this project.' },
            { word: 'Collaborate', phonetic: '/kəˈlæb.ə.reɪt/', definition: 'Work jointly on an activity, especially to produce or create something.', example: 'We need to collaborate with the marketing team.' },
            { word: 'Agenda', phonetic: '/əˈdʒen.də/', definition: 'A list of items to be discussed at a formal meeting.', example: 'Please send out the meeting agenda beforehand.' },
            { word: 'Negotiate', phonetic: '/nəˈɡoʊ.ʃi.eɪt/', definition: 'Obtain or bring about by discussion.', example: 'They managed to negotiate a better deal.' },
            { word: 'Feedback', phonetic: '/ˈfiːd.bæk/', definition: 'Information about reactions to a product, a person\'s performance of a task, etc.', example: 'I appreciate your constructive feedback.' }
        ]
    },
    {
        id: 'food-dining',
        title: 'Food & Dining',
        description: 'Words related to cooking, ordering food, and restaurants.',
        icon: 'Utensils',
        words: [
            { word: 'Appetizer', phonetic: '/ˈæp.ə.taɪ.zər/', definition: 'A small dish of food or a drink taken before a meal.', example: 'We ordered nachos as an appetizer.' },
            { word: 'Cuisine', phonetic: '/kwɪˈziːn/', definition: 'A style or method of cooking, especially as characteristic of a particular country.', example: 'I love Italian cuisine, especially pasta.' },
            { word: 'Reservation', phonetic: '/ˌrez.ɚˈveɪ.ʃən/', definition: 'an arrangement in which something such as a seat on an aircraft or a table at a restaurant is kept for you.', example: 'I made a reservation for two at 7 PM.' },
            { word: 'Recommendation', phonetic: '/ˌrek.ə.menˈdeɪ.ʃən/', definition: 'A suggestion or proposal as to the best course of action.', example: 'What is your recommendation for the main course?' },
            { word: 'Beverage', phonetic: '/ˈbev.ɚ.ɪdʒ/', definition: 'A drink, especially one other than water.', example: 'Hot beverages are served in the lounge.' }
        ]
    },
    {
        id: 'travel',
        title: 'Travel & Tourism',
        description: 'Essential vocabulary for trips, airports, and hotels.',
        icon: 'Plane',
        words: [
            { word: 'Itinerary', phonetic: '/naɪˈtɪn.ə.rer.i/', definition: 'A planned route or journey.', example: 'Our travel itinerary includes a visit to the museum.' },
            { word: 'Accommodation', phonetic: '/əˌkɑː.məˈdeɪ.ʃən/', definition: 'A room, group of rooms, or building in which someone may live or stay.', example: 'We booked cheap accommodation near the city center.' },
            { word: 'Departure', phonetic: '/dɪˈpɑːr.tʃər/', definition: 'The action of leaving, typically to start a journey.', example: 'The flight departure is scheduled for 10 AM.' },
            { word: 'Excursion', phonetic: '/ɪkˈskɝː.ʃən/', definition: 'A short journey or trip, especially one engaged in as a leisure activity.', example: 'We went on a day excursion to the mountains.' },
            { word: 'Souvenir', phonetic: '/ˌsuː.vəˈnɪr/', definition: 'A thing that is kept as a reminder of a person, place, or event.', example: 'I bought a magnet as a souvenir from Paris.' }
        ]
    },
    {
        id: 'emotions',
        title: 'Emotions & Personality',
        description: 'Words to describe feelings and character traits.',
        icon: 'Smile',
        words: [
            { word: 'Optimistic', phonetic: '/ˌɑːp.təˈmɪs.tɪk/', definition: 'Hopeful and confident about the future.', example: 'She is optimistic about her chances of winning.' },
            { word: 'Frustrated', phonetic: '/ˈfrʌs.treɪ.t̬ɪd/', definition: 'Feeling or expressing distress and annoyance.', example: 'I get frustrated when the internet is slow.' },
            { word: 'Grateful', phonetic: '/ˈɡreɪt.fəl/', definition: 'Feeling or showing an appreciation of kindness; thankful.', example: 'I am grateful for your help.' },
            { word: 'Ambitious', phonetic: '/æmˈbɪʃ.əs/', definition: 'Having or showing a strong desire and determination to succeed.', example: 'He is an ambitious student who wants to be a doctor.' },
            { word: 'Compassionate', phonetic: '/kəmˈpæʃ.ən.ət/', definition: 'Feeling or showing sympathy and concern for others.', example: 'She is a very compassionate nurse.' }
        ]
    },
    {
        id: 'slang-idioms',
        title: 'Slang & Idioms',
        description: 'Common informal expressions and idioms.',
        icon: 'MessageCircle', // Or Sparkles
        words: [
            { word: 'Chill out', phonetic: '/tʃɪl aʊt/', definition: 'To relax or calm down.', example: 'Just chill out, everything will be fine.' },
            { word: 'Piece of cake', phonetic: '/piːs əv keɪk/', definition: 'Something very easy to do.', example: 'The exam was a piece of cake.' },
            { word: 'Break a leg', phonetic: '/breɪk ə leɡ/', definition: 'Good luck (especially before a performance).', example: 'Break a leg on your presentation today!' },
            { word: 'Ghost', phonetic: '/ɡoʊst/', definition: 'To suddenly end a personal relationship with someone without explanation.', example: 'I think he ghosted me after our first date.' },
            { word: 'Vibe', phonetic: '/vaɪb/', definition: 'A person\'s emotional state or the atmosphere of a place.', example: 'This cafe has a really good vibe.' }
        ]
    }
];
