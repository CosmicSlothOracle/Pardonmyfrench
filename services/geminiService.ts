import { GeneratedExercise } from "../types";

// Static content - No AI needed
const EXAM_1: GeneratedExercise = {
  title: "Une Rupture Musicale (Maître Gims)",
  topic: "Passé Composé, Imparfait, Passé Simple, PQP",
  difficulty: "B1",
  sourceUrl: "https://www.youtube.com/watch?v=EFoxx2KXgSg",
  extraQuestion: {
    question: "In the video, what is the contrast between the lyrics 'Est-ce que tu m'aimes' (Do you love me) and the visual setting?",
    answer: "The lyrics ask for love, but the setting is dark, disjointed, and often shows characters in isolation or conflict, suggesting the relationship is already broken."
  },
  segments: [
    { type: "text", content: "C'était une nuit sombre. Gims " },
    { type: "gap", content: { id: 0, originalWord: "marchait", hint: "marcher", tense: "Imparfait" } },
    { type: "text", content: " seul dans la rue. Il " },
    { type: "gap", content: { id: 1, originalWord: "se demandait", hint: "se demander", tense: "Imparfait" } },
    { type: "text", content: " si tout était fini. La veille, elle lui " },
    { type: "gap", content: { id: 2, originalWord: "avait dit", hint: "dire", tense: "Plus-que-parfait" } },
    { type: "text", content: " des mots blessants. Soudain, il " },
    { type: "gap", content: { id: 3, originalWord: "s'arrêta", hint: "s'arrêter", tense: "Passé Simple" } },
    { type: "text", content: " devant une vitrine. Il " },
    { type: "gap", content: { id: 4, originalWord: "vit", hint: "voir", tense: "Passé Simple" } },
    { type: "text", content: " son reflet et " },
    { type: "gap", content: { id: 5, originalWord: "comprit", hint: "comprendre", tense: "Passé Simple" } },
    { type: "text", content: " la vérité. Il " },
    { type: "gap", content: { id: 6, originalWord: "a réalisé", hint: "réaliser", tense: "Passé Composé" } },
    { type: "text", content: " qu'il " },
    { type: "gap", content: { id: 7, originalWord: "avait perdu", hint: "perdre", tense: "Plus-que-parfait" } },
    { type: "text", content: " son temps. Pourtant, son cœur " },
    { type: "gap", content: { id: 8, originalWord: "battait", hint: "battre", tense: "Imparfait" } },
    { type: "text", content: " encore pour elle. Finalement, il " },
    { type: "gap", content: { id: 9, originalWord: "a décidé", hint: "décider", tense: "Passé Composé" } },
    { type: "text", content: " de tourner la page." }
  ]
};

const EXAM_2: GeneratedExercise = {
  title: "Le Souvenir de Paris (Bonus)",
  topic: "Narrative Tenses Mix",
  difficulty: "A2/B1",
  sourceUrl: "https://www.youtube.com/watch?v=EFoxx2KXgSg", // Keeping same video context for simplicity in app logic
  extraQuestion: {
    question: "Why is the use of 'Imparfait' important in the description of the weather?",
    answer: "It sets the scene and describes the background state (it was raining) rather than a specific completed action."
  },
  segments: [
    { type: "text", content: "L'été dernier, nous " },
    { type: "gap", content: { id: 0, originalWord: "sommes allés", hint: "aller", tense: "Passé Composé" } },
    { type: "text", content: " à Paris. Il " },
    { type: "gap", content: { id: 1, originalWord: "faisait", hint: "faire", tense: "Imparfait" } },
    { type: "text", content: " très beau ce matin-là. Nous " },
    { type: "gap", content: { id: 2, originalWord: "avions visité", hint: "visiter", tense: "Plus-que-parfait" } },
    { type: "text", content: " le Louvre avant midi. Soudain, un orage " },
    { type: "gap", content: { id: 3, originalWord: "éclata", hint: "éclater", tense: "Passé Simple" } },
    { type: "text", content: " violemment. Les touristes " },
    { type: "gap", content: { id: 4, originalWord: "ont couru", hint: "courir", tense: "Passé Composé" } },
    { type: "text", content: " vers les cafés. Je " },
    { type: "gap", content: { id: 5, originalWord: "regardais", hint: "regarder", tense: "Imparfait" } },
    { type: "text", content: " la pluie tomber quand tu " },
    { type: "gap", content: { id: 6, originalWord: "arrivas", hint: "arriver", tense: "Passé Simple" } },
    { type: "text", content: ". Tu " },
    { type: "gap", content: { id: 7, originalWord: "étais", hint: "être", tense: "Imparfait" } },
    { type: "text", content: " trempé mais tu " },
    { type: "gap", content: { id: 8, originalWord: "as souri", hint: "sourire", tense: "Passé Composé" } },
    { type: "text", content: "." }
  ]
};

const EXAM_3: GeneratedExercise = {
  title: "Une Journée à Vienne",
  topic: "Passé Composé vs Imparfait",
  difficulty: "A2/B1",
  sourceUrl: "https://www.youtube.com/watch?v=EFoxx2KXgSg",
  extraQuestion: {
    question: "Pourquoi utilise-t-on l'imparfait pour décrire le temps qu'il faisait?",
    answer: "L'imparfait décrit un état ou une situation de fond qui dure dans le temps, comme la météo."
  },
  segments: [
    { type: "text", content: "Hier, je " },
    { type: "gap", content: { id: 0, originalWord: "suis allé", hint: "aller", tense: "Passé Composé" } },
    { type: "text", content: " à Vienne avec mes amis. Il " },
    { type: "gap", content: { id: 1, originalWord: "faisait", hint: "faire", tense: "Imparfait" } },
    { type: "text", content: " beau et le soleil " },
    { type: "gap", content: { id: 2, originalWord: "brillait", hint: "briller", tense: "Imparfait" } },
    { type: "text", content: ". Nous " },
    { type: "gap", content: { id: 3, originalWord: "avons visité", hint: "visiter", tense: "Passé Composé" } },
    { type: "text", content: " le château de Schönbrunn. Pendant que nous " },
    { type: "gap", content: { id: 4, originalWord: "marchions", hint: "marcher", tense: "Imparfait" } },
    { type: "text", content: " dans les jardins, un guide " },
    { type: "gap", content: { id: 5, originalWord: "est arrivé", hint: "arriver", tense: "Passé Composé" } },
    { type: "text", content: " et nous " },
    { type: "gap", content: { id: 6, originalWord: "a raconté", hint: "raconter", tense: "Passé Composé" } },
    { type: "text", content: " l'histoire du palais. L'après-midi, nous " },
    { type: "gap", content: { id: 7, originalWord: "sommes allés", hint: "aller", tense: "Passé Composé" } },
    { type: "text", content: " dans un café typique. Je " },
    { type: "gap", content: { id: 8, originalWord: "buvais", hint: "boire", tense: "Imparfait" } },
    { type: "text", content: " mon café quand soudain mon téléphone " },
    { type: "gap", content: { id: 9, originalWord: "a sonné", hint: "sonner", tense: "Passé Composé" } },
    { type: "text", content: "." }
  ]
};

const EXAM_4: GeneratedExercise = {
  title: "L'Histoire de Marie-Antoinette",
  topic: "Passé Simple (Literary Context)",
  difficulty: "B1/B2",
  sourceUrl: "https://www.youtube.com/watch?v=EFoxx2KXgSg",
  extraQuestion: {
    question: "Pourquoi utilise-t-on le passé simple dans les récits historiques?",
    answer: "Le passé simple est utilisé dans la littérature et les récits historiques pour décrire des actions passées complètes et ponctuelles."
  },
  segments: [
    { type: "text", content: "Marie-Antoinette " },
    { type: "gap", content: { id: 0, originalWord: "naquit", hint: "naître", tense: "Passé Simple" } },
    { type: "text", content: " à Vienne en 1755. Elle " },
    { type: "gap", content: { id: 1, originalWord: "épousa", hint: "épouser", tense: "Passé Simple" } },
    { type: "text", content: " le futur roi de France à l'âge de quatorze ans. Quand elle " },
    { type: "gap", content: { id: 2, originalWord: "arriva", hint: "arriver", tense: "Passé Simple" } },
    { type: "text", content: " en France, elle " },
    { type: "gap", content: { id: 3, originalWord: "ne parlait", hint: "parler", tense: "Imparfait" } },
    { type: "text", content: " pas encore bien le français. Pendant la Révolution, le peuple " },
    { type: "gap", content: { id: 4, originalWord: "se révolta", hint: "se révolter", tense: "Passé Simple" } },
    { type: "text", content: " contre la monarchie. Marie-Antoinette " },
    { type: "gap", content: { id: 5, originalWord: "fut", hint: "être", tense: "Passé Simple" } },
    { type: "text", content: " emprisonnée et " },
    { type: "gap", content: { id: 6, originalWord: "mourut", hint: "mourir", tense: "Passé Simple" } },
    { type: "text", content: " sur l'échafaud en 1793. L'histoire " },
    { type: "gap", content: { id: 7, originalWord: "se souvient", hint: "se souvenir", tense: "Présent" } },
    { type: "text", content: " encore de cette reine tragique." }
  ]
};

const EXAM_5: GeneratedExercise = {
  title: "Les Vacances d'Été",
  topic: "Plus-que-parfait et Temporalité",
  difficulty: "B1",
  sourceUrl: "https://www.youtube.com/watch?v=EFoxx2KXgSg",
  extraQuestion: {
    question: "Quelle est la différence entre le plus-que-parfait et le passé composé dans ce texte?",
    answer: "Le plus-que-parfait exprime une action antérieure à une autre action passée, créant une relation temporelle complexe."
  },
  segments: [
    { type: "text", content: "Quand nous " },
    { type: "gap", content: { id: 0, originalWord: "sommes arrivés", hint: "arriver", tense: "Passé Composé" } },
    { type: "text", content: " à la plage, le soleil " },
    { type: "gap", content: { id: 1, originalWord: "brillait", hint: "briller", tense: "Imparfait" } },
    { type: "text", content: " déjà depuis plusieurs heures. Nous " },
    { type: "gap", content: { id: 2, originalWord: "avions préparé", hint: "préparer", tense: "Plus-que-parfait" } },
    { type: "text", content: " nos affaires la veille. Avant de partir, maman " },
    { type: "gap", content: { id: 3, originalWord: "avait vérifié", hint: "vérifier", tense: "Plus-que-parfait" } },
    { type: "text", content: " la météo. Quand nous " },
    { type: "gap", content: { id: 4, originalWord: "avons commencé", hint: "commencer", tense: "Passé Composé" } },
    { type: "text", content: " à nager, l'eau " },
    { type: "gap", content: { id: 5, originalWord: "était", hint: "être", tense: "Imparfait" } },
    { type: "text", content: " déjà chaude. Le soir, nous " },
    { type: "gap", content: { id: 6, originalWord: "avions réservé", hint: "réserver", tense: "Plus-que-parfait" } },
    { type: "text", content: " un restaurant avant notre arrivée. C'était parfait!" }
  ]
};

const EXAM_6: GeneratedExercise = {
  title: "Un Accident de Vélo",
  topic: "Narrative Tenses Mix",
  difficulty: "B1",
  sourceUrl: "https://www.youtube.com/watch?v=EFoxx2KXgSg",
  extraQuestion: {
    question: "Comment les différents temps verbaux créent-ils la progression narrative?",
    answer: "L'imparfait établit le contexte, le passé composé marque les actions principales, et le plus-que-parfait montre les antécédents."
  },
  segments: [
    { type: "text", content: "Il " },
    { type: "gap", content: { id: 0, originalWord: "faisait", hint: "faire", tense: "Imparfait" } },
    { type: "text", content: " un beau dimanche matin. Marc " },
    { type: "gap", content: { id: 1, originalWord: "roulait", hint: "rouler", tense: "Imparfait" } },
    { type: "text", content: " tranquillement à vélo quand soudain une voiture " },
    { type: "gap", content: { id: 2, originalWord: "est sortie", hint: "sortir", tense: "Passé Composé" } },
    { type: "text", content: " d'un parking. Marc " },
    { type: "gap", content: { id: 3, originalWord: "n'avait pas vu", hint: "voir", tense: "Plus-que-parfait" } },
    { type: "text", content: " la voiture à temps. Il " },
    { type: "gap", content: { id: 4, originalWord: "est tombé", hint: "tomber", tense: "Passé Composé" } },
    { type: "text", content: " et " },
    { type: "gap", content: { id: 5, originalWord: "s'est blessé", hint: "se blesser", tense: "Passé Composé" } },
    { type: "text", content: " au genou. Heureusement, un passant " },
    { type: "gap", content: { id: 6, originalWord: "a appelé", hint: "appeler", tense: "Passé Composé" } },
    { type: "text", content: " une ambulance. Marc " },
    { type: "gap", content: { id: 7, originalWord: "avait eu", hint: "avoir", tense: "Plus-que-parfait" } },
    { type: "text", content: " de la chance car l'hôpital " },
    { type: "gap", content: { id: 8, originalWord: "était", hint: "être", tense: "Imparfait" } },
    { type: "text", content: " tout près." }
  ]
};

const EXAM_7: GeneratedExercise = {
  title: "La Première Journée d'École",
  topic: "Passé Composé et Imparfait",
  difficulty: "A2",
  sourceUrl: "https://www.youtube.com/watch?v=EFoxx2KXgSg",
  extraQuestion: {
    question: "Pourquoi utilise-t-on l'imparfait pour décrire les sentiments?",
    answer: "L'imparfait décrit des états et des sentiments qui durent, contrairement au passé composé qui marque des actions ponctuelles."
  },
  segments: [
    { type: "text", content: "Le premier jour d'école, je " },
    { type: "gap", content: { id: 0, originalWord: "me suis réveillé", hint: "se réveiller", tense: "Passé Composé" } },
    { type: "text", content: " très tôt. J' " },
    { type: "gap", content: { id: 1, originalWord: "étais", hint: "être", tense: "Imparfait" } },
    { type: "text", content: " nerveux mais aussi excité. Ma mère " },
    { type: "gap", content: { id: 2, originalWord: "m'a préparé", hint: "préparer", tense: "Passé Composé" } },
    { type: "text", content: " un bon petit-déjeuner. Pendant que je " },
    { type: "gap", content: { id: 3, originalWord: "mangeais", hint: "manger", tense: "Imparfait" } },
    { type: "text", content: ", elle " },
    { type: "gap", content: { id: 4, originalWord: "a vérifié", hint: "vérifier", tense: "Passé Composé" } },
    { type: "text", content: " mon cartable. À l'école, le professeur " },
    { type: "gap", content: { id: 5, originalWord: "était", hint: "être", tense: "Imparfait" } },
    { type: "text", content: " très gentil. Il nous " },
    { type: "gap", content: { id: 6, originalWord: "a accueillis", hint: "accueillir", tense: "Passé Composé" } },
    { type: "text", content: " avec un grand sourire. Je " },
    { type: "gap", content: { id: 7, originalWord: "me suis fait", hint: "se faire", tense: "Passé Composé" } },
    { type: "text", content: " de nouveaux amis ce jour-là." }
  ]
};

const EXAM_8: GeneratedExercise = {
  title: "Le Concert de Rock",
  topic: "Mixed Narrative Tenses",
  difficulty: "B1",
  sourceUrl: "https://www.youtube.com/watch?v=EFoxx2KXgSg",
  extraQuestion: {
    question: "Comment les temps verbaux reflètent-ils la progression de l'événement?",
    answer: "L'imparfait décrit l'ambiance continue, le passé composé marque les moments clés, et le plus-que-parfait montre la préparation."
  },
  segments: [
    { type: "text", content: "Samedi dernier, nous " },
    { type: "gap", content: { id: 0, originalWord: "sommes allés", hint: "aller", tense: "Passé Composé" } },
    { type: "text", content: " à un concert de rock. La foule " },
    { type: "gap", content: { id: 1, originalWord: "était", hint: "être", tense: "Imparfait" } },
    { type: "text", content: " immense et tout le monde " },
    { type: "gap", content: { id: 2, originalWord: "dansait", hint: "danser", tense: "Imparfait" } },
    { type: "text", content: ". Nous " },
    { type: "gap", content: { id: 3, originalWord: "avions acheté", hint: "acheter", tense: "Plus-que-parfait" } },
    { type: "text", content: " nos billets trois mois à l'avance. Quand le groupe " },
    { type: "gap", content: { id: 4, originalWord: "est monté", hint: "monter", tense: "Passé Composé" } },
    { type: "text", content: " sur scène, le public " },
    { type: "gap", content: { id: 5, originalWord: "a explosé", hint: "exploser", tense: "Passé Composé" } },
    { type: "text", content: " de joie. Pendant le concert, les lumières " },
    { type: "gap", content: { id: 6, originalWord: "clignotaient", hint: "clignoter", tense: "Imparfait" } },
    { type: "text", content: " en rythme. C'était incroyable!" }
  ]
};

const EXAM_9: GeneratedExercise = {
  title: "La Découverte Archéologique",
  topic: "Passé Simple et Passé Composé",
  difficulty: "B2",
  sourceUrl: "https://www.youtube.com/watch?v=EFoxx2KXgSg",
  extraQuestion: {
    question: "Pourquoi le passé simple est-il utilisé dans les récits scientifiques?",
    answer: "Le passé simple donne un ton formel et narratif aux récits historiques et scientifiques, créant une distance temporelle."
  },
  segments: [
    { type: "text", content: "En 1922, l'archéologue Howard Carter " },
    { type: "gap", content: { id: 0, originalWord: "découvrit", hint: "découvrir", tense: "Passé Simple" } },
    { type: "text", content: " la tombe de Toutânkhamon. Il " },
    { type: "gap", content: { id: 1, originalWord: "avait cherché", hint: "chercher", tense: "Plus-que-parfait" } },
    { type: "text", content: " pendant des années. Quand il " },
    { type: "gap", content: { id: 2, originalWord: "ouvrit", hint: "ouvrir", tense: "Passé Simple" } },
    { type: "text", content: " la chambre funéraire, il " },
    { type: "gap", content: { id: 3, originalWord: "vit", hint: "voir", tense: "Passé Simple" } },
    { type: "text", content: " des trésors incroyables. Cette découverte " },
    { type: "gap", content: { id: 4, originalWord: "devinrent", hint: "devenir", tense: "Passé Simple" } },
    { type: "text", content: " célèbre dans le monde entier. Aujourd'hui, les objets " },
    { type: "gap", content: { id: 5, originalWord: "sont", hint: "être", tense: "Présent" } },
    { type: "text", content: " exposés dans les musées." }
  ]
};

const EXAM_10: GeneratedExercise = {
  title: "Une Rencontre Inattendue",
  topic: "Complex Temporal Relationships",
  difficulty: "B1/B2",
  sourceUrl: "https://www.youtube.com/watch?v=EFoxx2KXgSg",
  extraQuestion: {
    question: "Comment le plus-que-parfait établit-il la chronologie dans ce récit?",
    answer: "Le plus-que-parfait montre que certaines actions s'étaient déjà produites avant les actions principales du récit."
  },
  segments: [
    { type: "text", content: "Quand je " },
    { type: "gap", content: { id: 0, originalWord: "suis entré", hint: "entrer", tense: "Passé Composé" } },
    { type: "text", content: " dans le café, je " },
    { type: "gap", content: { id: 1, originalWord: "ai reconnu", hint: "reconnaître", tense: "Passé Composé" } },
    { type: "text", content: " immédiatement mon ancien professeur. Il " },
    { type: "gap", content: { id: 2, originalWord: "était", hint: "être", tense: "Imparfait" } },
    { type: "text", content: " assis à une table et " },
    { type: "gap", content: { id: 3, originalWord: "lisait", hint: "lire", tense: "Imparfait" } },
    { type: "text", content: " un journal. Je " },
    { type: "gap", content: { id: 4, originalWord: "ne l'avais pas vu", hint: "voir", tense: "Plus-que-parfait" } },
    { type: "text", content: " depuis cinq ans. Nous " },
    { type: "gap", content: { id: 5, originalWord: "avions été", hint: "être", tense: "Plus-que-parfait" } },
    { type: "text", content: " très proches autrefois. Quand je " },
    { type: "gap", content: { id: 6, originalWord: "l'ai salué", hint: "saluer", tense: "Passé Composé" } },
    { type: "text", content: ", il " },
    { type: "gap", content: { id: 7, originalWord: "a souri", hint: "sourire", tense: "Passé Composé" } },
    { type: "text", content: " et nous " },
    { type: "gap", content: { id: 8, originalWord: "avons parlé", hint: "parler", tense: "Passé Composé" } },
    { type: "text", content: " pendant une heure." }
  ]
};

export const getStaticExams = () => {
  return [EXAM_1, EXAM_2, EXAM_3, EXAM_4, EXAM_5, EXAM_6, EXAM_7, EXAM_8, EXAM_9, EXAM_10];
};

export const getExamById = (id: number): GeneratedExercise => {
  const exams = getStaticExams();
  return exams[id] || exams[0];
};