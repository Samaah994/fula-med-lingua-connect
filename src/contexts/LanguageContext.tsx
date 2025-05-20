import { createContext, useContext, useState, ReactNode } from "react";

// Define available languages
export type Language = "en" | "ff" | "fr";

// Translation dictionary type
export type TranslationDict = {
  [key: string]: {
    en: string;
    ff: string;
    fr: string;
  };
};

// Translations for our app
export const translations: TranslationDict = {
  welcome: {
    en: "Welcome to FulaMed",
    ff: "A jaɓɓaama e FulaMed",
    fr: "Bienvenue sur FulaMed"
  },
  login: {
    en: "Login",
    ff: "Seŋo",
    fr: "Connexion"
  },
  signup: {
    en: "Sign Up",
    ff: "Winndito",
    fr: "S'inscrire"
  },
  email: {
    en: "Email",
    ff: "Iimeel",
    fr: "Email"
  },
  password: {
    en: "Password",
    ff: "Finnde suuɗiinde",
    fr: "Mot de passe"
  },
  name: {
    en: "Name",
    ff: "Innde",
    fr: "Nom"
  },
  age: {
    en: "Age",
    ff: "Duuɓi",
    fr: "Âge"
  },
  specialty: {
    en: "Specialty",
    ff: "Peŋal",
    fr: "Spécialité"
  },
  patient: {
    en: "Patient",
    ff: "Nyawɗo",
    fr: "Patient"
  },
  doctor: {
    en: "Doctor",
    ff: "Doktoor",
    fr: "Médecin"
  },
  selectRole: {
    en: "Select Role",
    ff: "Suɓo Fannuuji",
    fr: "Sélectionner un rôle"
  },
  forgotPassword: {
    en: "Forgot Password?",
    ff: "Yeggiti finnde suuɗiinde?",
    fr: "Mot de passe oublié?"
  },
  noAccount: {
    en: "Don't have an account?",
    ff: "A alaa konte?",
    fr: "Vous n'avez pas de compte?"
  },
  hasAccount: {
    en: "Already have an account?",
    ff: "Aɗa jogii konte?",
    fr: "Vous avez déjà un compte?"
  },
  home: {
    en: "Home",
    ff: "Jaɓɓorgo",
    fr: "Accueil"
  },
  profile: {
    en: "Profile",
    ff: "Humpito",
    fr: "Profil"
  },
  medicalHistory: {
    en: "Medical History",
    ff: "Aslol Nyaw",
    fr: "Historique Médical"
  },
  translate: {
    en: "Translate",
    ff: "Firtude",
    fr: "Traduire"
  },
  logout: {
    en: "Logout",
    ff: "Yaltude",
    fr: "Déconnexion"
  },
  download: {
    en: "Download",
    ff: "Aawto",
    fr: "Télécharger"
  },
  surgeon: {
    en: "Surgeon",
    ff: "Ceeroowo",
    fr: "Chirurgien"
  },
  generalPractitioner: {
    en: "General Practitioner",
    ff: "Doktoor Kuuɓɗo",
    fr: "Médecin Généraliste"
  },
  dentist: {
    en: "Dentist",
    ff: "Nyawndoowo Nyiiƴe",
    fr: "Dentiste"
  },
  pediatrician: {
    en: "Pediatrician",
    ff: "Nyawndoowo Sukaaɓe",
    fr: "Pédiatre"
  },
  gynecologist: {
    en: "Gynecologist",
    ff: "Nyawndoowo Rewɓe",
    fr: "Gynécologue"
  },
  submit: {
    en: "Submit",
    ff: "Neldu",
    fr: "Soumettre"
  },
  switchLanguage: {
    en: "Switch Language",
    ff: "Waylude Ɗemngal",
    fr: "Changer de Langue"
  },
  enterEmail: {
    en: "Enter your email",
    ff: "Naatu iimeel maa",
    fr: "Entrez votre email"
  },
  enterPassword: {
    en: "Enter your password",
    ff: "Naatu finnde maa suuɗiinde",
    fr: "Entrez votre mot de passe"
  },
  enterName: {
    en: "Enter your name",
    ff: "Naatu innde maa",
    fr: "Entrez votre nom"
  },
  enterAge: {
    en: "Enter your age",
    ff: "Naatu duuɓi maa",
    fr: "Entrez votre âge"
  },
  selectSpecialty: {
    en: "Select your specialty",
    ff: "Suɓo peŋal maa",
    fr: "Sélectionnez votre spécialité"
  },
  medicalRecords: {
    en: "Medical Records",
    ff: "Winndannde Cellal",
    fr: "Dossiers Médicaux"
  },
  voiceRecordings: {
    en: "Voice Recordings",
    ff: "Nanngitanɗe Daande",
    fr: "Enregistrements Vocaux"
  },
  textNotes: {
    en: "Text Notes",
    ff: "Binndanɗe",
    fr: "Notes Textuelles"
  },
  downloadAsPdf: {
    en: "Download as PDF",
    ff: "Aawto e PDF",
    fr: "Télécharger en PDF"
  },
  lastLogin: {
    en: "Last login",
    ff: "Seŋaango sakitiingo",
    fr: "Dernière connexion"
  },
  profileInformation: {
    en: "Profile Information",
    ff: "Humpito Konte",
    fr: "Informations de Profil"
  },
  edit: {
    en: "Edit",
    ff: "Waylude",
    fr: "Modifier"
  },
  cancel: {
    en: "Cancel",
    ff: "Haaytu",
    fr: "Annuler"
  },
  save: {
    en: "Save",
    ff: "Danndu",
    fr: "Enregistrer"
  },
  from: {
    en: "From",
    ff: "Iwde e",
    fr: "De"
  },
  to: {
    en: "To",
    ff: "Faade e",
    fr: "À"
  },
  inputText: {
    en: "Input Text",
    ff: "Naatnu Binndol",
    fr: "Texte d'entrée"
  },
  startRecording: {
    en: "Start Recording",
    ff: "Fuɗɗo Nanngitaade",
    fr: "Commencer l'enregistrement"
  },
  stopRecording: {
    en: "Stop Recording",
    ff: "Dartin Nanngitaade",
    fr: "Arrêter l'enregistrement"
  },
  enterTextToTranslate: {
    en: "Enter text to translate",
    ff: "Naatnu binndol ngam firtude",
    fr: "Entrez du texte à traduire"
  },
  translationResult: {
    en: "Translation Result",
    ff: "Fiirtannde",
    fr: "Résultat de la traduction"
  },
  translationWillAppearHere: {
    en: "Translation will appear here",
    ff: "Fiirtannde ma wanngo ɗoo",
    fr: "La traduction apparaîtra ici"
  },
  translateToFulfulde: {
    en: "Translate to Fulfulde",
    ff: "Firtu to Fulfulde",
    fr: "Traduire en Fulfulde"
  },
  translateFromFulfulde: {
    en: "Translate from Fulfulde",
    ff: "Firtu iwde e Fulfulde",
    fr: "Traduire du Fulfulde"
  },
  theme: {
    en: "Theme",
    ff: "Mbayka",
    fr: "Thème"
  },
  lightTheme: {
    en: "Light Theme",
    ff: "Mbayka Jalbunde",
    fr: "Thème Clair"
  },
  darkTheme: {
    en: "Dark Theme",
    ff: "Mbayka Niɓɓunde",
    fr: "Thème Sombre"
  },
  switchToLight: {
    en: "Switch to Light",
    ff: "Waylit to Jalbunde",
    fr: "Passer au Clair"
  },
  switchToDark: {
    en: "Switch to Dark",
    ff: "Waylit to Niɓɓunde",
    fr: "Passer au Sombre"
  },
  sound: {
    en: "Sound",
    ff: "Sawto",
    fr: "Son"
  },
  soundOn: {
    en: "Sound On",
    ff: "Sawto Udditaama",
    fr: "Son Activé"
  },
  soundOff: {
    en: "Sound Off",
    ff: "Sawto Uddaama",
    fr: "Son Désactivé"
  },
  volume: {
    en: "Volume",
    ff: "Toowngal Sawto",
    fr: "Volume"
  },
  applicationSettings: {
    en: "Application Settings",
    ff: "Teelte Jaaynde",
    fr: "Paramètres de l'Application"
  },
  textTranslation: {
    en: "Text Translation",
    ff: "Firtugol Binndol",
    fr: "Traduction de Texte"
  },
  voiceTranslation: {
    en: "Voice Translation",
    ff: "Firtugol Daande",
    fr: "Traduction Vocale"
  },
  transcription: {
    en: "Transcription",
    ff: "Winnditannde",
    fr: "Transcription"
  },
  recording: {
    en: "Recording",
    ff: "Ina nanngitoo",
    fr: "Enregistrement"
  },
  tapToStartRecording: {
    en: "Tap to start recording",
    ff: "Tappu ngam fuɗɗaade nanngitaade",
    fr: "Appuyez pour commencer l'enregistrement"
  },
  microphoneAccessDenied: {
    en: "Microphone access denied",
    ff: "Duŋaaki to maakirofoŋ salaama",
    fr: "Accès au microphone refusé"
  },
  speechWillAppearHere: {
    en: "Speech will appear here",
    ff: "Konngol ma wanngo ɗoo",
    fr: "La parole apparaîtra ici"
  },
  playAudio: {
    en: "Play Audio",
    ff: "Nanno Ojoo",
    fr: "Lire l'Audio"
  },
  translationInfo: {
    en: "Translation Information",
    ff: "Humpito Firtugol",
    fr: "Informations de Traduction"
  },
  translationDataSource: {
    en: "Translation Data Source",
    ff: "Iwdi Keɓe Firtugol",
    fr: "Source de Données de Traduction"
  },
  fulfuldeDataSource: {
    en: "Fulfulde translations use data from the OLDI seed dataset",
    ff: "Firtugol Fulfulde huutorto keɓe OLDI seed dataset",
    fr: "Les traductions en Fulfulde utilisent des données du jeu de données OLDI"
  },
  sttSupport: {
    en: "Speech-to-Text Support",
    ff: "Ballal Jiiɓtugol Haala to Binndol",
    fr: "Support de Reconnaissance Vocale"
  },
  ttsSupport: {
    en: "Text-to-Speech Support",
    ff: "Ballal Jiiɓtugol Binndol to Haala",
    fr: "Support de Synthèse Vocale"
  },
  fullSupport: {
    en: "Full Support",
    ff: "Ballal Timminngal",
    fr: "Support Complet"
  },
  limitedSupport: {
    en: "Limited Support",
    ff: "Ballal Keddiingal",
    fr: "Support Limité"
  },
  stopAudio: {
    en: "Stop Audio",
    ff: "Dartin Nanngitaade",
    fr: "Arrêter l'Audio"
  },
  translating: {
    en: "Translating",
    ff: "Ina firtoo",
    fr: "En cours de traduction"
  },
  translationFeedback: {
    en: "Translation Feedback",
    ff: "Jaabtol e Firtugol",
    fr: "Commentaire sur la Traduction"
  },
  feedbackReceived: {
    en: "Feedback Received",
    ff: "Jaabtol heɓaama",
    fr: "Commentaire Reçu"
  },
  thankYouForFeedback: {
    en: "Thank you for your feedback!",
    ff: "A jaaraama e jaabtol maa!",
    fr: "Merci pour votre commentaire!"
  },
  thankYouForDetailedFeedback: {
    en: "Thank you for your detailed feedback!",
    ff: "A jaaraama e jaabtol maa keewngol!",
    fr: "Merci pour votre commentaire détaillé!"
  },
  feedbackError: {
    en: "Feedback Error",
    ff: "Juumre Jaabtol",
    fr: "Erreur de Commentaire"
  },
  errorSubmittingFeedback: {
    en: "There was an error submitting your feedback. Please try again.",
    ff: "Waɗii juumre e nelditgol jaabtol maa. Tiiɗno fuɗɗito.",
    fr: "Une erreur s'est produite lors de l'envoi de votre commentaire. Veuillez réessayer."
  },
  selectRating: {
    en: "Select Rating",
    ff: "Suɓo Foddeeji",
    fr: "Sélectionner une Évaluation"
  },
  pleaseSelectRatingFirst: {
    en: "Please select a rating before submitting your feedback.",
    ff: "Tiiɗno suɓo foddeeji hade nelditde jaabtol maa.",
    fr: "Veuillez sélectionner une évaluation avant de soumettre votre commentaire."
  },
  accurate: {
    en: "Accurate",
    ff: "Feewaani",
    fr: "Précis"
  },
  inaccurate: {
    en: "Inaccurate",
    ff: "Feewaani",
    fr: "Imprécis"
  },
  additionalFeedback: {
    en: "Additional comments (optional)",
    ff: "Jaabtol kesol (so a yiɗi)",
    fr: "Commentaires supplémentaires (facultatif)"
  },
  // New translations to support hardcoded strings in TranslatePage
  translateComplete: {
    en: "Translation complete",
    ff: "Firtugol timmi",
    fr: "Traduction terminée"
  },
  translatedFromTo: {
    en: "Translated from {from} to {to}",
    ff: "Firtuɗo iwde e {from} faade e {to}",
    fr: "Traduit de {from} vers {to}"
  },
  translationFailed: {
    en: "Translation failed",
    ff: "Firtugol waɗaani",
    fr: "Échec de traduction"
  },
  textToSpeechFailed: {
    en: "Text-to-speech failed",
    ff: "Jiiɓtugol binndol to haala waɗaani",
    fr: "Échec de la synthèse vocale"
  },
  emptyInput: {
    en: "Empty input",
    ff: "Naatnirgol meere",
    fr: "Entrée vide"
  },
  pleaseEnterTextToTranslate: {
    en: "Please enter text to translate",
    ff: "Tiiɗno naatnu binndol ngam firtude",
    fr: "Veuillez entrer du texte à traduire"
  },
  // Fixing duplicate key issue - renaming the second occurrence of medicalTranslation
  medicalTranslationTitle: {
    en: "Medical Translation",
    ff: "Firtugol Cellal",
    fr: "Traduction Médicale"
  },
  translateMedicalConversations: {
    en: "Translate medical conversations between English, French, and Fulfulde with high accuracy.",
    ff: "Firtu kaaldal cellal hakkunde Engeleere, Faraas, e Fulfulde e peewgol toowngol.",
    fr: "Traduisez les conversations médicales entre l'anglais, le français et le fulfulde avec une grande précision."
  },
  speakNaturallyGetTranslations: {
    en: "Speak naturally and get instant translations in your preferred language.",
    ff: "Haal e al'aada maa keɓ firtanɗe ɗe peelortoɗaa law.",
    fr: "Parlez naturellement et obtenez des traductions instantanées dans votre langue préférée."
  },
  processingYourSpeech: {
    en: "Processing your speech...",
    ff: "Ena yuɓɓina konngol maa...",
    fr: "Traitement de votre discours..."
  },
  recordingStarted: {
    en: "Recording started",
    ff: "Nanngitaade fuɗɗaama",
    fr: "Enregistrement démarré"
  },
  recordingStopped: {
    en: "Recording stopped",
    ff: "Nanngitaade dartinaa",
    fr: "Enregistrement arrêté"
  },
  speakNowRecording: {
    en: "Speak now. Recording will automatically stop after 15 seconds if not stopped manually.",
    ff: "Haal jooni. Nanngitaade maa daroyoo hoore mum caggal kilaaji 15 so tawi dartaaka e juuɗe.",
    fr: "Parlez maintenant. L'enregistrement s'arrêtera automatiquement après 15 secondes s'il n'est pas arrêté manuellement."
  },
  processingYourSpeechEllipsis: {
    en: "Processing your speech...",
    ff: "Ena yuɓɓina konngol maa...",
    fr: "Traitement de votre discours..."
  },
  // New translations for Index page
  breakingLanguageBarriers: {
    en: "Breaking Language Barriers in Healthcare",
    ff: "Hettude Saɗɗi Ɗemɗe e Cellal",
    fr: "Briser les Barrières Linguistiques dans les Soins de Santé"
  },
  empoweringMedicalCommunication: {
    en: "Empowering medical communication between healthcare providers and patients through seamless translation in English, French, and Fulfulde.",
    ff: "Hokkirde baawɗe e kaaldol cellal hakkunde hokkoowo cellal e nyawɓe laamorgol firtuki yaawnuki e Engeleere, Faraasi, e Fulfulde.",
    fr: "Faciliter la communication médicale entre les professionnels de santé et les patients grâce à une traduction fluide en anglais, français et fulfulde."
  },
  getStarted: {
    en: "Get Started",
    ff: "Fuɗɗo Jooni",
    fr: "Commencer"
  },
  goToDashboard: {
    en: "Go To Dashboard",
    ff: "Yah to Alluwal Kuutorɗo",
    fr: "Accéder au Tableau de Bord"
  },
  featuredFeatures: {
    en: "Featured Features",
    ff: "Fannuuji Cuɓaaɗi",
    fr: "Fonctionnalités Vedettes"
  },
  exploreOurServices: {
    en: "Explore Our Services",
    ff: "Yillo Ballal Amen",
    fr: "Explorez Nos Services"
  },
  realTimeTranslation: {
    en: "Real-Time Translation",
    ff: "Firtugol e Sahaa Gooto",
    fr: "Traduction en Temps Réel"
  },
  instantTranslation: {
    en: "Instant translation between languages during consultations",
    ff: "Firtugol law hakkunde ɗemɗe e sahaa ƴeewde",
    fr: "Traduction instantanée entre les langues pendant les consultations"
  },
  voiceSupport: {
    en: "Voice Support",
    ff: "Ballal Daande",
    fr: "Support Vocal"
  },
  ourCoreFeatures: {
    en: "Our Core Features",
    ff: "Fannuuji Amen Mawɗi",
    fr: "Nos Fonctionnalités Principales"
  },
  medicalTranslation: {
    en: "Medical Translation",
    ff: "Firtugol Cellal",
    fr: "Traduction Médicale"
  },
  medicalTranslationDescription: {
    en: "Accurate translations of medical terminology and conversations between patients and healthcare providers",
    ff: "Firtanɗe peewɗe konngol cellal e kaaldal hakkunde nyawɓe e hokkooɓe cellal",
    fr: "Traductions précises de la terminologie médicale et des conversations entre patients et professionnels de santé"
  },
  voiceTextSupport: {
    en: "Voice & Text Support",
    ff: "Ballal Daande & Binndol",
    fr: "Support Vocal & Textuel"
  },
  voiceTextSupportDescription: {
    en: "Support for both voice and text-based communication to accommodate different preferences",
    ff: "Ballal e daande e binndol ngam yahde e jiɗaaɗi celluɗi",
    fr: "Support pour la communication vocale et textuelle pour s'adapter aux différentes préférences"
  },
  patientDoctorConnection: {
    en: "Patient-Doctor Connection",
    ff: "Jokkondiral Nyawɗo-Doktoor",
    fr: "Connexion Patient-Médecin"
  },
  patientDoctorConnectionDescription: {
    en: "Secure platform for seamless communication between patients and healthcare providers",
    ff: "Danndorgol hisungol ngam kaaldol yaawnugol hakkunde nyawɓe e hokkooɓe cellal",
    fr: "Plateforme sécurisée pour une communication fluide entre patients et professionnels de santé"
  },
  allRightsReserved: {
    en: "All Rights Reserved",
    ff: "Hakkeeji Fof Ko Ndenndaaɗi",
    fr: "Tous Droits Réservés"
  },
  welcomeDescription: {
    en: "Experience seamless medical communication across language barriers with FulaMed's translation platform.",
    ff: "Heɓ kaaldol cellal yaawnungol hakkunde saɗɗi ɗemɗe e danndorgol firtugol FulaMed.",
    fr: "Découvrez une communication médicale fluide à travers les barrières linguistiques grâce à la plateforme de traduction de FulaMed."
  },
  // App name
  appName: {
    en: "FulaMed",
    ff: "FulaMed",
    fr: "FulaMed"
  },
  // Dashboard
  dashboard: {
    en: "Dashboard",
    ff: "Alluwal Kuutorɗo",
    fr: "Tableau de bord"
  },
  profileOverview: {
    en: "Profile Overview",
    ff: "Ko Humpitii e Konte",
    fr: "Aperçu du profil"
  },
  upcomingAppointments: {
    en: "Upcoming Appointments",
    ff: "Udditaaje Garooje",
    fr: "Rendez-vous à venir"
  },
  recentTranslations: {
    en: "Recent Translations",
    ff: "Firtanɗe Cakkitiiɗe",
    fr: "Traductions récentes"
  },
  quickActions: {
    en: "Quick Actions",
    ff: "Gollaaji Yaawnuɗi",
    fr: "Actions rapides"
  },
  viewProfile: {
    en: "View Profile",
    ff: "Yiy Humpito Konte",
    fr: "Voir le profil"
  },
  viewAll: {
    en: "View All",
    ff: "Yiy fof",
    fr: "Voir tout"
  },
  noUpcomingAppointments: {
    en: "No upcoming appointments",
    ff: "Alaa udditaaje garooje",
    fr: "Pas de rendez-vous à venir"
  },
  noRecentTranslations: {
    en: "No recent translations",
    ff: "Alaa firtanɗe cakkitiiɗe",
    fr: "Pas de traductions récentes"
  },
  startTranslation: {
    en: "Start Translation",
    ff: "Fuɗɗo Firtude",
    fr: "Commencer la traduction"
  },
  manageAppointments: {
    en: "Manage Appointments",
    ff: "Toppito Udditaaje",
    fr: "Gérer les rendez-vous"
  },
  viewPatientRecords: {
    en: "View Patient Records",
    ff: "Yiy Binndanɗe Nyawɓe",
    fr: "Voir les dossiers des patients"
  },
  translateWithYourDoctor: {
    en: "Translate with your doctor",
    ff: "Firtu e doktoor maa",
    fr: "Traduisez avec votre médecin"
  },
  viewAllAppointments: {
    en: "View All Appointments",
    ff: "Yiy Udditaaje Fof",
    fr: "Voir tous les rendez-vous"
  },
  bookAppointment: {
    en: "Book Appointment",
    ff: "Uddito",
    fr: "Prendre rendez-vous"
  },
  translations: {
    en: "Translations",
    ff: "Firtanɗe",
    fr: "Traductions"
  },
  translatedFrom: {
    en: "Translated from",
    ff: "Firtuɗo iwde e",
    fr: "Traduit de"
  },
  fulfulde: {
    en: "Fulfulde",
    ff: "Fulfulde",
    fr: "Peul"
  },
  regularCheckup: {
    en: "Regular check-up",
    ff: "Ƴeewtogol Kala Wakkati",
    fr: "Contrôle régulier"
  },
  followUpConsultation: {
    en: "Follow-up consultation",
    ff: "Jokkolal Ƴeewtagol",
    fr: "Consultation de suivi"
  },
  // Medical History
  annualCheckupResults: {
    en: "Annual Checkup Results",
    ff: "Keɓe Ƴeewtol Hitaande",
    fr: "Résultats du bilan annuel"
  },
  allVitalsNormal: {
    en: "All vitals normal. Blood pressure 120/80.",
    ff: "Colli ɓanndu fof e cellal. Ɗatol ƴiiƴam 120/80.",
    fr: "Tous les signes vitaux sont normaux. Tension artérielle 120/80."
  },
  consultationRecording: {
    en: "Consultation Recording",
    ff: "Nanngitaade Ƴeewtagol",
    fr: "Enregistrement de consultation"
  },
  unknown: {
    en: "unknown",
    ff: "anndaaka",
    fr: "inconnu"
  },
  audioWaveform: {
    en: "audio waveform",
    ff: "diiwal ojoo",
    fr: "forme d'onde audio"
  },
  noContent: {
    en: "No content available",
    ff: "Alaa ko heɓii",
    fr: "Pas de contenu disponible"
  },
  downloadStarted: {
    en: "Download started",
    ff: "Aawtagol fuɗɗii",
    fr: "Téléchargement commencé"
  },
  isBeingDownloaded: {
    en: "is being downloaded",
    ff: "ina aawte",
    fr: "est en cours de téléchargement"
  },
  errorLoadingRecords: {
    en: "Error loading medical records",
    ff: "Juumre e loowgol winndannde cellal",
    fr: "Erreur lors du chargement des dossiers médicaux"
  },
  noTextRecords: {
    en: "No text records found",
    ff: "Alaa binndanɗe keɓaaɗe",
    fr: "Aucun dossier textuel trouvé"
  },
  noVoiceRecords: {
    en: "No voice records found",
    ff: "Alaa nanngitanɗe keɓaaɗe",
    fr: "Aucun enregistrement vocal trouvé"
  },
  // Appointments
  appointments: {
    en: "Appointments",
    ff: "Udditaaje",
    fr: "Rendez-vous"
  },
  upcoming: {
    en: "Upcoming",
    ff: "Garooje",
    fr: "À venir"
  },
  bookNew: {
    en: "Book New",
    ff: "Uddito Heso",
    fr: "Nouveau rendez-vous"
  },
  past: {
    en: "Past",
    ff: "Jawtuɗe",
    fr: "Passés"
  },
  bookNewAppointment: {
    en: "Book New Appointment",
    ff: "Uddito Udditaare Hesere",
    fr: "Prendre un nouveau rendez-vous"
  },
  date: {
    en: "Date",
    ff: "Ñalnde",
    fr: "Date"
  },
  time: {
    en: "Time",
    ff: "Wakkati",
    fr: "Heure"
  },
  selectDate: {
    en: "Select date",
    ff: "Suɓo ñalnde",
    fr: "Sélectionner une date"
  },
  selectTime: {
    en: "Select time",
    ff: "Suɓo wakkati",
    fr: "Sélectionner une heure"
  },
  selectDoctor: {
    en: "Select doctor",
    ff: "Suɓo doktoor",
    fr: "Sélectionner un médecin"
  },
  purpose: {
    en: "Purpose",
    ff: "Faandaare",
    fr: "Motif"
  },
  describeReason: {
    en: "Briefly describe the reason for your appointment",
    ff: "Fammina e raɓɓiɗɗum daliili udditaare maa",
    fr: "Décrivez brièvement la raison de votre rendez-vous"
  },
  completed: {
    en: "Completed",
    ff: "Timmii",
    fr: "Terminé"
  },
  reschedule: {
    en: "Reschedule",
    ff: "Waylit Wakkati",
    fr: "Reprogrammer"
  },
  noPastAppointments: {
    en: "No past appointments found",
    ff: "Alaa udditaaje jawtuɗe keɓaa",
    fr: "Aucun rendez-vous passé trouvé"
  },
  missingInformation: {
    en: "Missing information",
    ff: "Humpito nyaki",
    fr: "Information manquante"
  },
  pleaseAllFields: {
    en: "Please fill in all fields to book an appointment",
    ff: "Tiiɗno hebbinboɗe fof ngam udditaare",
    fr: "Veuillez remplir tous les champs pour prendre rendez-vous"
  },
  appointmentBooked: {
    en: "Appointment Booked",
    ff: "Udditaare Nanngiima",
    fr: "Rendez-vous pris"
  },
  appointmentScheduled: {
    en: "Your appointment has been scheduled for {date} at {time}",
    ff: "Udditaare maa nanngiima ngam {date} e {time}",
    fr: "Votre rendez-vous a été programmé pour le {date} à {time}"
  },
  // Doctor specialties
  cardiologist: {
    en: "Cardiologist",
    ff: "Ñawndoowo Ɓernde",
    fr: "Cardiologue"
  },
  dermatologist: {
    en: "Dermatologist",
    ff: "Ñawndoowo Nguru",
    fr: "Dermatologue"
  },
  notSpecified: {
    en: "Not specified",
    ff: "Hollaaka",
    fr: "Non spécifié"
  }
};

// Context type
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  // Translation function
  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
