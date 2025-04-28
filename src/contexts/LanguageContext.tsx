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
