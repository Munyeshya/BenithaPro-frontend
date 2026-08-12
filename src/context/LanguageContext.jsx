import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

const rw = {
  'Home': 'Ahabanza', 'Packages & Pricing': 'Serivisi n ibiciro', 'Gallery': 'Amafoto',
  'Track Appointment': 'Kurikirana gahunda', 'Book Appointment': 'Fata gahunda', 'Book': 'Fata gahunda',
  'Glow beyond beauty': 'Ubwiza burenze uko bugaragara', 'Beyond your': 'Renza ibyo wari', 'expectations.': 'witeze.',
  'Refined makeup artistry for every shade of beauty, created for weddings, events, portraits, and unforgettable moments.': 'Ubuhanga bwo gusiga ibirungo by ubwiza kuri buri ruhu, mu bukwe, ibirori, amafoto n ibihe bitazibagirana.',
  'Book your session': 'Fata gahunda yawe', 'The Benitha experience': 'Uburyo bwa Benitha',
  'Private studio care and on-location artistry, designed around you.': 'Serivisi yihariye muri studio cyangwa aho uri, ikozwe igukwiriye.',
  'The real Benitha experience': 'Uburyo nyabwo bwa Benitha', 'A beauty space built to make you': 'Ahantu h ubwiza hagenewe gutuma', 'feel seen.': 'wiyumva kandi ugaragara.',
  'Visit our Instagram': 'Sura Instagram yacu', 'Our category': 'Ibyiciro byacu', 'Signature services': 'Serivisi zihariye',
  'Explore all services': 'Reba serivisi zose', 'Studio bridal': 'Ubwiza bw umugeni muri studio', 'Bride & matron': 'Umugeni n umuherekeza',
  'On-location artistry': 'Serivisi aho uri', 'Wedding day service': 'Serivisi y umunsi w ubukwe', 'Event glam': 'Ubwiza bw ibirori', 'Soft & full glam': 'Soft na full glam',
  'Packages &': 'Serivisi n', 'Pricing': 'ibiciro', 'Exquisite Beauty Services': 'Serivisi z ubwiza zinoze',
  'All Services': 'Serivisi zose', 'Book Service': 'Fata iyi serivisi', 'Service Fee': 'Igiciro cya serivisi',
  'Portfolio & Artistry': 'Amafoto n ubuhanga', 'Makeup': 'Ubwiza', 'Selected looks': 'Imisusire twahisemo',
  'Reservation Status': 'Imiterere ya gahunda', 'Track Your': 'Kurikirana', 'Appointment': 'gahunda yawe',
  'Secure Tracking Token / ID': 'Kode y ibanga ya gahunda', 'Seamless Online Reservation': 'Fata gahunda byoroshye kuri interineti',
  'Book Your': 'Fata gahunda y', 'Glam Experience': 'ubwiza bwawe', 'Package': 'Serivisi', 'Calendar & Time': 'Itariki n isaha',
  'Your Info': 'Amakuru yawe', 'Deposit': 'Avansi', 'Continue to Calendar': 'Komeza uhitemo itariki', 'Back': 'Subira inyuma',
  'Continue to Payment': 'Komeza ku kwishyura', 'Complete Booking Request': 'Ohereza gahunda',
  'Ready for your glow?': 'Witeguye kurabagirana?', 'Your moment, elevated': 'Igihe cyawe, cyongerewe ubwiza',
  'Explore bridal, editorial, and special-event artistry created in Kigali.': 'Reba imisusire y abageni, amafoto n ibirori yakozwe i Kigali.',
  'Enter your secure booking code to view the live status of your Benitha appointment.': 'Andika kode y ibanga urebe aho gahunda yawe ya Benitha igeze.',
  'Category': 'Icyiciro', 'Available Packages': 'Serivisi zihari', 'Select Category & Package': 'Hitamo icyiciro na serivisi',
  'Select Date & Starting Hour': 'Hitamo itariki n isaha', 'Your Personal Information': 'Amakuru yawe bwite',
  'Deposit Payment & Proof Upload': 'Kwishyura avansi no kohereza icyemezo', 'Loading services...': 'Serivisi zirimo kuzanwa...',
  'Quick Navigation': 'Inzira zihuse', 'Makeup Packages': 'Serivisi z ubwiza', 'Studio Hours': 'Amasaha ya studio',
  'Studio Location': 'Aho studio iherereye', 'Home Experience': 'Ahabanza', 'Staff Login': 'Kwinjira kw abakozi',
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('benitha_language') || 'en');
  useEffect(() => { localStorage.setItem('benitha_language', language); document.documentElement.lang = language === 'rw' ? 'rw' : 'en'; }, [language]);
  const value = useMemo(() => ({ language, setLanguage, t: (text) => language === 'rw' ? (rw[text] || text) : text }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);

