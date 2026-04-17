export type QuestionTekst = { category: string; question: string; helpText?: string };

export const SPØRSMÅL_TEKSTER = {
    nb: {
        q1: {
            category: 'Pengestøtte',
            question: 'Mottar du eller skal du søke om pengestøtte som krever at du er registrert som arbeidssøker?',
            helpText:
                'Dagpenger, friskmeldt til arbeidsformidling og enkelte andre ytelser krever at du er registrert arbeidssøker.',
        },
        q2: { category: 'Pengestøtte', question: 'Er du permittert?' },
        q3: {
            category: 'Pengestøtte',
            question: 'Har du fått beskjed om å registrere deg som arbeidssøker?',
            helpText: 'Noen tilfeller krever at du skal være registrert arbeidssøker.',
        },
        q4: { category: 'Forhold til jobb', question: 'Trenger du hjelp til å bli værende i den jobben du har?' },
        q5: { category: 'Forhold til jobb', question: 'Er du sykmeldt og har du en jobb du skal tilbake til?' },
        q6: {
            category: 'Forhold til jobb',
            question: 'Er du usikker på om du kan jobbe akkurat nå?',
            helpText: 'For eksempel etter sykdom, permisjon eller lang tid utenfor arbeidslivet.',
        },
        q7: { category: 'Forhold til jobb', question: 'Trenger du oppfølging før du kan søke eller ta en jobb?' },
        q8: {
            category: 'Kurs/utdanning/tiltak',
            question: 'Trenger du kurs, tiltak eller omskolering for å komme i jobb?',
        },
        q9: { category: 'Kurs/utdanning/tiltak', question: 'Trenger du hjelp til å fullføre eller velge utdanning?' },
        q10: {
            category: 'Hindringer',
            question: 'Har du utfordringer som påvirker om du kan jobbe eller søke jobb?',
            helpText: 'Helse, språk, livssituasjon, familiesituasjon, transportmuligheter osv.',
        },
    } satisfies Record<string, QuestionTekst>,
    nn: {
        q1: {
            category: 'Pengestøtte',
            question: 'Mottar du eller skal du søkje om pengestøtte som krev at du er registrert som arbeidssøkjar?',
            helpText:
                'Dagpengar, friskmeldt til arbeidsformidling og enkelte andre ytingar krev at du er registrert arbeidssøkjar.',
        },
        q2: { category: 'Pengestøtte', question: 'Er du permittert?' },
        q3: {
            category: 'Pengestøtte',
            question: 'Har du fått beskjed om å registrere deg som arbeidssøkjar?',
            helpText: 'Nokre tilfelle krev at du skal vere registrert arbeidssøkjar.',
        },
        q4: { category: 'Tilhøve til jobb', question: 'Treng du hjelp til å bli verande i den jobben du har?' },
        q5: { category: 'Tilhøve til jobb', question: 'Er du sjukmeld og har du ein jobb du skal tilbake til?' },
        q6: {
            category: 'Tilhøve til jobb',
            question: 'Er du usikker på om du kan jobbe akkurat no?',
            helpText: 'Til dømes etter sjukdom, permisjon eller lang tid utanfor arbeidslivet.',
        },
        q7: { category: 'Tilhøve til jobb', question: 'Treng du oppfølging før du kan søkje eller ta ein jobb?' },
        q8: {
            category: 'Kurs/utdanning/tiltak',
            question: 'Treng du kurs, tiltak eller omskolering for å komme i jobb?',
        },
        q9: { category: 'Kurs/utdanning/tiltak', question: 'Treng du hjelp til å fullføre eller velje utdanning?' },
        q10: {
            category: 'Hindringar',
            question: 'Har du utfordringar som påverkar om du kan arbeide eller søkje jobb?',
            helpText: 'Helse, språk, livssituasjon, familiesituasjon, transportmoglegheiter osv.',
        },
    } satisfies Record<string, QuestionTekst>,
    en: {
        q1: {
            category: 'Financial support',
            question:
                'Are you receiving or applying for financial support that requires you to be registered as a job seeker?',
            helpText:
                'Unemployment benefits, rehabilitation work placement and certain other benefits require you to be registered as a job seeker.',
        },
        q2: { category: 'Financial support', question: 'Are you temporarily laid off?' },
        q3: {
            category: 'Financial support',
            question: 'Have you been told to register as a job seeker?',
            helpText: 'Some situations require you to be registered as a job seeker.',
        },
        q4: { category: 'Relationship to work', question: 'Do you need help staying in the job you have?' },
        q5: { category: 'Relationship to work', question: 'Are you on sick leave and do you have a job to return to?' },
        q6: {
            category: 'Relationship to work',
            question: 'Are you unsure whether you can work right now?',
            helpText: 'For example after illness, leave of absence or a long period outside the workforce.',
        },
        q7: {
            category: 'Relationship to work',
            question: 'Do you need follow-up before you can apply for or take a job?',
        },
        q8: {
            category: 'Courses/education/measures',
            question: 'Do you need courses, measures or retraining to get a job?',
        },
        q9: {
            category: 'Courses/education/measures',
            question: 'Do you need help completing or choosing an education?',
        },
        q10: {
            category: 'Obstacles',
            question: 'Do you have challenges that affect whether you can work or look for work?',
            helpText: 'Health, language, life situation, family situation, transportation options, etc.',
        },
    } satisfies Record<string, QuestionTekst>,
};
