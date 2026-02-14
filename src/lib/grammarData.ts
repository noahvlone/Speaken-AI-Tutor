export interface GrammarTense {
    id: string;
    name: string;
    description: string;
    formula: {
        positive: string;
        negative: string;
        interrogative: string;
    };
    examples: {
        type: 'positive' | 'negative' | 'question';
        sentence: string;
    }[];
}

export const grammarTenses: GrammarTense[] = [
    {
        id: 'simple-present',
        name: 'Simple Present Tense',
        description: 'Used for facts, habits, and general truths.',
        formula: {
            positive: 'Subject + V1 (s/es)',
            negative: 'Subject + do/does + not + V1',
            interrogative: 'Do/Does + Subject + V1?'
        },
        examples: [
            { type: 'positive', sentence: 'She drinks coffee every morning.' },
            { type: 'negative', sentence: 'I do not like spicy food.' },
            { type: 'question', sentence: 'Do you play football?' }
        ]
    },
    {
        id: 'present-continuous',
        name: 'Present Continuous Tense',
        description: 'Used for actions happening right now or in the near future.',
        formula: {
            positive: 'Subject + am/is/are + V-ing',
            negative: 'Subject + am/is/are + not + V-ing',
            interrogative: 'Am/Is/Are + Subject + V-ing?'
        },
        examples: [
            { type: 'positive', sentence: 'I am studying English right now.' },
            { type: 'negative', sentence: 'They are not watching TV.' },
            { type: 'question', sentence: 'Are you coming to the party?' }
        ]
    },
    {
        id: 'simple-past',
        name: 'Simple Past Tense',
        description: 'Used for actions that happened and finished in the past.',
        formula: {
            positive: 'Subject + V2',
            negative: 'Subject + did + not + V1',
            interrogative: 'Did + Subject + V1?'
        },
        examples: [
            { type: 'positive', sentence: 'We visited Paris last year.' },
            { type: 'negative', sentence: 'He did not call me yesterday.' },
            { type: 'question', sentence: 'Did you finish your homework?' }
        ]
    },
    {
        id: 'past-continuous',
        name: 'Past Continuous Tense',
        description: 'Used for actions that were happening at a specific time in the past.',
        formula: {
            positive: 'Subject + was/were + V-ing',
            negative: 'Subject + was/were + not + V-ing',
            interrogative: 'Was/Were + Subject + V-ing?'
        },
        examples: [
            { type: 'positive', sentence: 'I was reading a book when you called.' },
            { type: 'negative', sentence: 'She was not sleeping at 10 PM.' },
            { type: 'question', sentence: 'Were they playing outside?' }
        ]
    },
    {
        id: 'simple-future',
        name: 'Simple Future Tense',
        description: 'Used for actions that will happen in the future.',
        formula: {
            positive: 'Subject + will + V1',
            negative: 'Subject + will + not + V1',
            interrogative: 'Will + Subject + V1?'
        },
        examples: [
            { type: 'positive', sentence: 'I will help you with your project.' },
            { type: 'negative', sentence: 'It will not rain tomorrow.' },
            { type: 'question', sentence: 'Will you marry me?' }
        ]
    },
    {
        id: 'present-perfect',
        name: 'Present Perfect Tense',
        description: 'Used for actions that happened in the past but have a connection to the present.',
        formula: {
            positive: 'Subject + have/has + V3',
            negative: 'Subject + have/has + not + V3',
            interrogative: 'Have/Has + Subject + V3?'
        },
        examples: [
            { type: 'positive', sentence: 'I have visited Japan twice.' },
            { type: 'negative', sentence: 'She has not finished her lunch yet.' },
            { type: 'question', sentence: 'Have you ever seen a ghost?' }
        ]
    }
];
