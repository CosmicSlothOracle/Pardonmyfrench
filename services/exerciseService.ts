import { ClozeSegment, ExamSection, GeneratedExercise } from "../types";

const videoSegments: ClozeSegment[] = [
  { type: "text", content: "L'incident commence pendant l'arrivée d'Éric Zemmour à Moissac. Il " },
  { type: "gap", content: { id: 0, originalWord: "arrivait", hint: "arriver", tense: "Imparfait" } },
  { type: "text", content: " devant sa sécurité." },
  { type: "text", content: "Soudain, un spectateur " },
  { type: "gap", content: { id: 1, originalWord: "a lancé", hint: "lancer", tense: "Passé Composé" } },
  { type: "text", content: " un œuf vers sa tête." },
  { type: "text", content: "L'œuf " },
  { type: "gap", content: { id: 2, originalWord: "s'est cassé", hint: "se casser", tense: "Passé Composé" } },
  { type: "text", content: " et " },
  { type: "gap", content: { id: 3, originalWord: "a répandu", hint: "répandre", tense: "Passé Composé" } },
  { type: "text", content: " du jaune sur son visage." },
  { type: "text", content: "Les agents de sécurité " },
  { type: "gap", content: { id: 4, originalWord: "sont intervenus", hint: "intervenir", tense: "Passé Composé" } },
  { type: "text", content: " rapidement et " },
  { type: "gap", content: { id: 5, originalWord: "ont maîtrisé", hint: "maîtriser", tense: "Passé Composé" } },
  { type: "text", content: " l'agresseur." }
];

const geographySegments: ClozeSegment[] = [
  { type: "text", content: "La France " },
  { type: "gap", content: { id: 6, originalWord: "s'étend", hint: "s'étendre", tense: "Présent" } },
  { type: "text", content: " de la Manche jusqu'à la Méditerranée." },
  { type: "text", content: "Le fleuve " },
  { type: "gap", content: { id: 7, originalWord: "la Loire", hint: "nom propre", tense: "Nom propre" } },
  { type: "text", content: " " },
  { type: "gap", content: { id: 8, originalWord: "coule", hint: "couler", tense: "Présent" } },
  { type: "text", content: " à travers des châteaux célèbres." },
  { type: "text", content: "Les Alpes " },
  { type: "gap", content: { id: 9, originalWord: "sont", hint: "être", tense: "Présent" } },
  { type: "text", content: " une chaîne de montagnes à l'est et " },
  { type: "gap", content: { id: 10, originalWord: "offrent", hint: "offrir", tense: "Présent" } },
  { type: "text", content: " de nombreuses activités." },
  { type: "text", content: "Le nord " },
  { type: "gap", content: { id: 11, originalWord: "border", hint: "border", tense: "Présent" } },
  { type: "text", content: " la Belgique et la mer du Nord." }
];

const grammarSegments: ClozeSegment[] = [
  { type: "text", content: "Hier, j' " },
  { type: "gap", content: { id: 12, originalWord: "ai visité", hint: "visiter", tense: "Passé Composé" } },
  { type: "text", content: " Paris. Je " },
  { type: "gap", content: { id: 13, originalWord: "suis allé", hint: "aller", tense: "Passé Composé" } },
  { type: "text", content: " au musée du Louvre. Ensuite, je " },
  { type: "gap", content: { id: 14, originalWord: "regardais", hint: "regarder", tense: "Imparfait" } },
  { type: "text", content: " les peintures et je " },
  { type: "gap", content: { id: 15, originalWord: "prenais", hint: "prendre", tense: "Imparfait" } },
  { type: "text", content: " des notes. Demain, je " },
  { type: "gap", content: { id: 16, originalWord: "vais écrire", hint: "écrire", tense: "Futur Proche" } },
  { type: "text", content: " un court texte pour raconter cette journée." }
];

const sections: ExamSection[] = [
  {
    id: "video",
    title: "Sonderteil – Videoanalyse (L'Incident de Moissac)",
    type: "listening",
    maxPoints: 25,
    timeLimitMinutes: 15,
    segments: videoSegments,
    extraQuestion: {
      question: "Beschreibe in 2-3 Sätzen auf Deutsch, was im Video passiert ist und wie die Sicherheitskräfte reagiert haben.",
      answer: "Das Video zeigt einen Angriff mit einem Ei auf Éric Zemmour in Moissac. Die Sicherheitskräfte greifen schnell ein und nehmen den Angreifer fest."
    }
  },
  {
    id: "geography",
    title: "Teil 2 – Leseverstehen: Frankreich und Nachbarländer",
    type: "reading",
    maxPoints: 30,
    segments: geographySegments,
    extraQuestion: {
      question: "Welche Landschaften und Nachbarländer werden genannt? Antworte auf Deutsch.",
      answer: "Die Loire fließt durch berühmte Schlösser, die Alpen bieten Aktivitäten, und der Norden grenzt an Belgien."
    }
  },
  {
    id: "grammar",
    title: "Teil 3 – Grammatik: Vergangenes und Zukunft",
    type: "grammar",
    maxPoints: 25,
    segments: grammarSegments,
    extraQuestion: {
      question: "Welche Zeiten wurden im Text verwendet? Schreibe zwei Sätze auf Deutsch.",
      answer: "Der Text nutzt Passé Composé, Imparfait und Futur Proche. Beispiel: Ich besuchte das Museum und ich werde morgen darüber schreiben."
    }
  },
  {
    id: "writing",
    title: "Teil 4 – Textproduktion: Ma région préférée",
    type: "writing",
    maxPoints: 20,
    segments: [],
    extraQuestion: {
      question: "Schreibe einen französischen Text (80–100 Wörter) über deine Lieblingsregion in Frankreich und warum du sie besuchst.",
      answer: "Modellantwort: Ma région préférée est la Bretagne. J'aime la mer, les crêpes et les villages pittoresques. Chaque année, j'explore les phares et je parle français avec les habitants."
    }
  }
];

const EXAM_BRANDENBURG: GeneratedExercise = {
  title: "Klausur Französisch – Brandenburg 9. Klasse",
  topic: "Frankreich, Geografie, Grammatik, Videoanalyse",
  difficulty: "B1",
  gradeLevel: "9. Klasse",
  curriculum: "Brandenburg Lehrplan",
  sourceUrl: "/assets/2026-01-14 10-55-38.mp4",
  totalTimeMinutes: 45,
  totalPoints: 100,
  sections,
  segments: sections.reduce<ClozeSegment[]>((acc, section) => {
    return [...acc, ...section.segments];
  }, [])
};

export const getStaticExams = () => {
  return [EXAM_BRANDENBURG];
};

export const getExamById = (id: number): GeneratedExercise => {
  const exams = getStaticExams();
  return exams[id] || exams[0];
};
