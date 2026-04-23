export interface Axe {
  id: number;
  title: string;
  titleEn: string;
  dimension: string;
  dimensionEn: string;
  items: { text: string; textEn: string; isControl?: boolean }[];
  openQuestion: string;
  openQuestionEn: string;
}

export const AXES: Axe[] = [
  {
    id: 1,
    title: "Sens & Vision",
    titleEn: "Purpose & Vision",
    dimension: "Alignement stratégique",
    dimensionEn: "Strategic Alignment",
    items: [
      { text: "Les orientations stratégiques sont exprimées de manière suffisamment claire pour que chaque équipe puisse en déduire ses priorités opérationnelles.", textEn: "Strategic directions are expressed clearly enough for each team to derive their operational priorities." },
      { text: "Les décisions de la direction sont perceptiblement cohérentes avec la vision à long terme affichée.", textEn: "Management decisions are visibly consistent with the stated long-term vision." },
      { text: "Les collaborateurs comprennent en quoi leur contribution s'inscrit dans les objectifs globaux.", textEn: "Employees understand how their contribution fits into the organization's overall objectives." },
      { text: "L'organisation est capable de réactualiser sa vision lorsque le contexte l'exige, sans perdre sa cohérence.", textEn: "The organization can update its vision when context requires, without losing coherence." },
    ],
    openQuestion: "Qu'est-ce qui fragilise le plus l'adhésion collective aux orientations stratégiques ?",
    openQuestionEn: "What most undermines collective buy-in to strategic directions?",
  },
  {
    id: 2,
    title: "Management & Communication",
    titleEn: "Management & Communication",
    dimension: "Cohérence managériale",
    dimensionEn: "Managerial Coherence",
    items: [
      { text: "Les pratiques managériales sont suffisamment homogènes pour garantir une expérience organisationnelle cohérente.", textEn: "Management practices are consistent enough to ensure a coherent organizational experience." },
      { text: "Les messages portés par l'encadrement intermédiaire sont alignés avec les orientations de la direction générale.", textEn: "Messages from middle management are aligned with senior leadership directions." },
      { text: "Lorsqu'une décision impacte les équipes, les managers disposent des éléments pour la contextualiser avec justesse.", textEn: "When a decision affects teams, managers have the information to contextualize it appropriately." },
      { text: "Dans notre organisation, les managers communiquent de manière uniforme et sans variation notable selon les contextes.", textEn: "In our organization, managers communicate uniformly without notable variation across contexts.", isControl: true },
    ],
    openQuestion: "Identifiez une situation où la communication managériale a renforcé — ou fragilisé — la confiance des équipes.",
    openQuestionEn: "Identify a situation where management communication strengthened — or undermined — team trust.",
  },
  {
    id: 3,
    title: "Charge de travail & Organisation",
    titleEn: "Workload & Organization",
    dimension: "Architecture organisationnelle",
    dimensionEn: "Organizational Architecture",
    items: [
      { text: "La répartition des responsabilités est suffisamment formalisée pour éviter les zones de flou ou les doubles recouvrements.", textEn: "Responsibilities are formalized enough to avoid grey areas or overlaps." },
      { text: "Les processus internes permettent aux équipes d'absorber les variations d'activité sans désorganisation majeure.", textEn: "Internal processes allow teams to absorb activity variations without major disruption." },
      { text: "La charge de travail est distribuée selon des critères explicites, indépendamment des affinités informelles.", textEn: "Workload is distributed based on explicit criteria, independent of informal relationships." },
      { text: "Les priorités sont définies par des mécanismes formels, et non exclusivement par l'urgence ou la pression hiérarchique.", textEn: "Priorities are set through formal mechanisms, not solely by urgency or hierarchical pressure." },
    ],
    openQuestion: "Quelles sont les principales sources de friction organisationnelle qui freinent l'efficacité collective ?",
    openQuestionEn: "What are the main sources of organizational friction that hinder collective efficiency?",
  },
  {
    id: 4,
    title: "Reconnaissance & Équité",
    titleEn: "Recognition & Equity",
    dimension: "Cohérence managériale",
    dimensionEn: "Managerial Coherence",
    items: [
      { text: "Les critères de reconnaissance (promotion, valorisation) sont connus et perçus comme objectifs.", textEn: "Recognition criteria (promotion, acknowledgment) are known and perceived as objective." },
      { text: "L'organisation traite de manière équitable des situations comparables, indépendamment du profil ou de la visibilité.", textEn: "The organization treats comparable situations equitably, regardless of profile or visibility." },
      { text: "Les pratiques de reconnaissance formelle sont intégrées aux processus managériaux, pas laissées à l'initiative individuelle.", textEn: "Formal recognition practices are embedded in managerial processes, not left to individual initiative." },
      { text: "En cas de traitement inéquitable perçu, des voies de recours existent et sont réellement accessibles.", textEn: "If unfair treatment is perceived, recourse channels exist and are genuinely accessible." },
    ],
    openQuestion: "Qu'est-ce qui génère le plus fort sentiment d'iniquité dans l'organisation ?",
    openQuestionEn: "What generates the strongest sense of inequity in the organization?",
  },
  {
    id: 5,
    title: "Rémunération & Avantages",
    titleEn: "Compensation & Benefits",
    dimension: "Maturité sociale",
    dimensionEn: "Social Maturity",
    items: [
      { text: "La politique de rémunération repose sur des critères documentés, accessibles et compréhensibles.", textEn: "Compensation policy is based on documented, accessible, and understandable criteria." },
      { text: "L'organisation actualise régulièrement sa politique salariale en tenant compte des évolutions du marché.", textEn: "The organization regularly updates its salary policy in line with market trends." },
      { text: "Les avantages sociaux traduisent une politique cohérente de fidélisation, pas uniquement des obligations réglementaires.", textEn: "Benefits reflect a coherent retention policy, not merely regulatory obligations." },
      { text: "La rémunération variable, lorsqu'elle existe, est adossée à des critères de performance clairs et connus à l'avance.", textEn: "Variable pay, where it exists, is based on clear, pre-known performance criteria." },
    ],
    openQuestion: "Dans quelle mesure la politique de rémunération est-elle un levier de performance — ou une source de tension ?",
    openQuestionEn: "To what extent is the compensation policy a performance lever — or a source of tension?",
  },
  {
    id: 6,
    title: "Développement & Compétences",
    titleEn: "Development & Skills",
    dimension: "Alignement stratégique",
    dimensionEn: "Strategic Alignment",
    items: [
      { text: "L'organisation dispose d'une cartographie actualisée des compétences critiques nécessaires à ses objectifs à 2–3 ans.", textEn: "The organization has an updated map of critical skills needed for its 2–3 year objectives." },
      { text: "Les investissements en formation sont arbitrés selon les besoins organisationnels, pas uniquement les souhaits individuels.", textEn: "Training investments are decided based on organizational needs, not just individual wishes." },
      { text: "Les dispositifs de développement permettent de réduire effectivement les écarts entre compétences actuelles et futures.", textEn: "Development programs effectively bridge the gap between current and future skill needs." },
      { text: "L'organisation anticipe les évolutions de compétences plutôt que de les subir au moment où elles deviennent critiques.", textEn: "The organization anticipates skill changes rather than being caught off-guard when they become critical." },
    ],
    openQuestion: "Quels sont les écarts de compétences les plus préoccupants à horizon 2–3 ans ?",
    openQuestionEn: "What are the most concerning skill gaps over the next 2–3 years?",
  },
  {
    id: 7,
    title: "Équilibre Vie Pro / Perso",
    titleEn: "Work-Life Balance",
    dimension: "Soutenabilité de la performance",
    dimensionEn: "Performance Sustainability",
    items: [
      { text: "L'organisation dispose de mécanismes formels pour surveiller et réguler la charge de travail excessive.", textEn: "The organization has formal mechanisms to monitor and regulate excessive workloads." },
      { text: "Les normes implicites de disponibilité hors heures de travail ne constituent pas un facteur de pression structurelle.", textEn: "Implicit availability norms outside working hours do not create structural pressure." },
      { text: "Les managers sont formés à détecter les signaux précoces d'épuisement et disposent de leviers pour y répondre.", textEn: "Managers are trained to detect early burnout signs and have tools to respond." },
      { text: "L'organisation ajuste ses exigences de performance en tenant compte des capacités réelles sur la durée.", textEn: "The organization adjusts its performance expectations based on real long-term team capacity." },
    ],
    openQuestion: "Quels facteurs organisationnels pèsent le plus sur la capacité à maintenir un équilibre durable ?",
    openQuestionEn: "What organizational factors most impact the ability to maintain a sustainable balance?",
  },
  {
    id: 8,
    title: "Climat & Relations",
    titleEn: "Climate & Relationships",
    dimension: "Dynamique collective",
    dimensionEn: "Collective Dynamics",
    items: [
      { text: "La coopération entre équipes repose sur des règles du jeu explicites et des mécanismes de coordination formalisés.", textEn: "Cross-team cooperation is based on explicit rules and formalized coordination mechanisms." },
      { text: "Les conflits sont pris en charge par des dispositifs organisationnels, pas laissés à la gestion informelle.", textEn: "Conflicts are handled through organizational systems, not left to informal management." },
      { text: "Le sentiment d'appartenance dépasse les frontières de l'équipe immédiate et se manifeste dans la coopération transversale.", textEn: "The sense of belonging extends beyond the immediate team and manifests in cross-functional cooperation." },
      { text: "Dans notre organisation, les tensions entre équipes n'ont aucun impact sur la qualité des livrables.", textEn: "In our organization, tensions between teams have no impact on deliverable quality.", isControl: true },
    ],
    openQuestion: "Quelles dynamiques relationnelles ont le plus d'impact sur la performance collective ?",
    openQuestionEn: "What relational dynamics most impact collective performance?",
  },
  {
    id: 9,
    title: "Sécurité & Confiance",
    titleEn: "Safety & Trust",
    dimension: "Maturité sociale",
    dimensionEn: "Social Maturity",
    items: [
      { text: "Les collaborateurs peuvent exprimer un désaccord ou signaler un dysfonctionnement sans crainte de répercussions.", textEn: "Employees can express disagreement or flag a dysfunction without fear of repercussions." },
      { text: "L'organisation dispose de canaux d'expression structurés au-delà de la ligne hiérarchique directe.", textEn: "The organization has structured expression channels beyond the direct reporting line." },
      { text: "La direction démontre par ses actes — pas uniquement ses discours — qu'elle prend les remontées terrain au sérieux.", textEn: "Leadership demonstrates through actions — not just words — that it takes ground-level feedback seriously." },
      { text: "Le cadre institutionnel est suffisamment stable et prévisible pour que les collaborateurs puissent s'y appuyer.", textEn: "The institutional framework is stable and predictable enough for employees to rely on." },
    ],
    openQuestion: "Qu'est-ce qui affaiblit concrètement la confiance envers l'institution dans l'organisation ?",
    openQuestionEn: "What concretely weakens trust in the organization as an institution?",
  },
  {
    id: 10,
    title: "Engagement Global",
    titleEn: "Overall Engagement",
    dimension: "Dynamique collective",
    dimensionEn: "Collective Dynamics",
    items: [
      { text: "Les collaborateurs s'impliquent au-delà du strict périmètre de leur poste lorsque la situation le requiert.", textEn: "Employees go beyond their defined role when the situation requires it." },
      { text: "L'organisation crée les conditions structurelles d'un engagement actif, sans compter uniquement sur la motivation individuelle.", textEn: "The organization creates structural conditions for active engagement, not relying solely on individual motivation." },
      { text: "Le niveau d'engagement est stable dans le temps, pas tributaire de cycles ponctuels.", textEn: "The level of engagement is stable over time, not dependent on sporadic cycles." },
      { text: "L'organisation sait reconnaître et capitaliser sur les initiatives individuelles qui dépassent les attentes formelles.", textEn: "The organization recognizes and builds on individual initiatives that exceed formal expectations." },
    ],
    openQuestion: "Quels leviers organisationnels favorisent ou freinent l'engagement collectif ?",
    openQuestionEn: "What organizational levers promote or hinder collective engagement?",
  },
  {
    id: 11,
    title: "Agilité & Adaptation",
    titleEn: "Agility & Adaptation",
    dimension: "Soutenabilité de la performance",
    dimensionEn: "Performance Sustainability",
    items: [
      { text: "L'organisation dispose de mécanismes formels pour détecter rapidement les signaux faibles et en tirer des ajustements.", textEn: "The organization has formal mechanisms to quickly detect weak signals and derive adjustments." },
      { text: "Lors d'une transformation, l'organisation régule le rythme en fonction de la capacité d'absorption réelle des équipes.", textEn: "During a transformation, the organization regulates the pace based on teams' real absorption capacity." },
      { text: "L'apprentissage organisationnel est institutionnalisé : erreurs et expérimentations alimentent un retour d'expérience collectif.", textEn: "Organizational learning is institutionalized: errors and experiments feed a collective feedback loop." },
      { text: "La structure permet de reconfigurer rapidement ressources et priorités sans décision centralisée à chaque étape.", textEn: "The structure allows quick reconfiguration of resources and priorities without centralized decision at each step." },
    ],
    openQuestion: "Face aux derniers changements majeurs, qu'a le plus facilité ou freiné l'adaptation collective ?",
    openQuestionEn: "Regarding recent major changes, what most enabled or hindered collective adaptation?",
  },
];

  // ── AXE 12 — Charge & Régulation de l'effort ───────────────────────────────
  {
    id: 12,
    dimension: "Soutenabilité de la performance",
    dimensionEn: "Performance Sustainability",
    title: "Charge & Régulation",
    titleEn: "Workload & Recovery",
    items: [
      { text: "Mon volume de travail habituel me permet de maintenir un niveau d'énergie satisfaisant tout au long de la semaine.", textEn: "My usual workload allows me to maintain a satisfying energy level throughout the week." },
      { text: "Mon organisation me donne suffisamment d'espaces de récupération (pauses, temps calmes) pour rester efficace sur la durée.", textEn: "My organisation gives me enough recovery spaces (breaks, quiet time) to stay effective over time." },
      { text: "Lorsque la charge augmente de façon ponctuelle, je parviens facilement à la gérer sans que cela déborde sur ma vie personnelle.", textEn: "When workload temporarily increases, I can easily manage it without it spilling over into my personal life.", isControl: true },
      { text: "Les priorités qui me sont fixées sont suffisamment claires pour que je puisse organiser mon travail sans sentiment de surcharge inutile.", textEn: "The priorities set for me are clear enough to let me organise my work without a sense of unnecessary overload." },
    ],
    openQuestion: "Qu'est-ce qui vous aiderait le plus à mieux réguler votre charge de travail au quotidien ?",
    openQuestionEn: "What would help you most to better manage your daily workload?",
  },

  // ── AXE 13 — Qualité du management de proximité ─────────────────────────────
  {
    id: 13,
    dimension: "Cohérence managériale",
    dimensionEn: "Managerial Coherence",
    title: "Management de proximité",
    titleEn: "Direct Management Quality",
    items: [
      { text: "Mon manager me donne des retours réguliers qui m'aident concrètement à progresser dans mon travail.", textEn: "My manager gives me regular feedback that concretely helps me improve in my work." },
      { text: "Lorsque je rencontre une difficulté, mon manager est disponible et m'apporte un soutien concret pour avancer.", textEn: "When I face a difficulty, my manager is available and provides concrete support to help me move forward." },
      { text: "Mon manager m'exprime clairement ce qu'il attend de moi, ce qui me permet de savoir où concentrer mes efforts.", textEn: "My manager clearly communicates what is expected of me, allowing me to know where to focus my efforts." },
      { text: "Mon manager reconnaît mes contributions de façon sincère et adaptée à ce que j'accomplis réellement.", textEn: "My manager acknowledges my contributions in a genuine way that reflects what I actually accomplish." },
    ],
    openQuestion: "Quelle est la pratique managériale qui aurait le plus d'impact positif sur votre engagement au travail ?",
    openQuestionEn: "Which management practice would have the most positive impact on your engagement at work?",
  },

  // ── AXE 14 — Droit à la déconnexion & frontières travail-vie ────────────────
  {
    id: 14,
    dimension: "Maturité sociale",
    dimensionEn: "Social Maturity",
    title: "Droit à la déconnexion",
    titleEn: "Right to Disconnect",
    items: [
      { text: "Dans mon équipe, il est admis et respecté de ne pas répondre aux messages professionnels en dehors de mes heures de travail.", textEn: "In my team, it is accepted and respected not to respond to professional messages outside my working hours." },
      { text: "Mon organisation m'a communiqué des règles claires sur les plages horaires où je suis attendu(e) joignable.", textEn: "My organisation has communicated clear guidelines about the time windows when I am expected to be reachable." },
      { text: "Mes temps de repos (soirées, week-ends, congés) me permettent de me ressourcer pleinement, sans intrusion du travail.", textEn: "My rest periods (evenings, weekends, holidays) allow me to fully recharge without work intruding." },
      { text: "Mon manager donne l'exemple en respectant lui-même les frontières entre temps de travail et temps personnel.", textEn: "My manager leads by example by respecting the boundaries between working time and personal time." },
    ],
    openQuestion: "Qu'est-ce qui favoriserait davantage votre capacité à vous déconnecter du travail et à préserver vos temps personnels ?",
    openQuestionEn: "What would further support your ability to disconnect from work and protect your personal time?",
  },
];

export const DIMENSIONS = [
  { id: 1, name: "Alignement stratégique", nameEn: "Strategic Alignment", axes: [1, 6] },
  { id: 2, name: "Cohérence managériale", nameEn: "Managerial Coherence", axes: [2, 4, 13] },
  { id: 3, name: "Architecture organisationnelle", nameEn: "Organizational Architecture", axes: [3] },
  { id: 4, name: "Dynamique collective", nameEn: "Collective Dynamics", axes: [8, 10] },
  { id: 5, name: "Soutenabilité de la performance", nameEn: "Performance Sustainability", axes: [7, 11, 12] },
  { id: 6, name: "Maturité sociale", nameEn: "Social Maturity", axes: [5, 9, 14] },
];

export const SCALE_FR = [
  { value: 1, label: "Pas du tout" },
  { value: 2, label: "Plutôt non" },
  { value: 3, label: "Neutre" },
  { value: 4, label: "Plutôt oui" },
  { value: 5, label: "Tout à fait" },
];

export const SCALE_EN = [
  { value: 1, label: "Strongly disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly agree" },
];
