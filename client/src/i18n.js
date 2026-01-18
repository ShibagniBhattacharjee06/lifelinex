import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: {
                translation: {
                    "sos_btn": "SOS",
                    "tap_alert": "TAP TO ALERT",
                    "emergency_center": "Emergency Center",
                    "nearby_resources": "Nearby Resources",
                    "health_id": "My Health ID",
                    "home": {
                        "tagline": "Live Emergency Response Network",
                        "title": "LifeLineX",
                        "subtitle": "Connecting hospitals, donors, and ambulances in milliseconds.",
                        "empowerment": "One click can save a life.",
                        "get_started": "Get Started",
                        "join_donor": "Join as Donor"
                    }
                }
            },
            hi: {
                translation: {
                    "sos_btn": "मदद",
                    "tap_alert": "दबाएं",
                    "emergency_center": "आपातकालीन केंद्र",
                    "nearby_resources": "निकटतम संसाधन",
                    "health_id": "स्वास्थ्य आईडी",
                    "home": {
                        "tagline": "लाइव आपातकालीन प्रतिक्रिया नेटवर्क",
                        "title": "लाइफलाइनएक्स",
                        "subtitle": "अस्पतालों, दाताओं और एम्बुलेंस को मिलीसेकंड में जोड़ना।",
                        "empowerment": "एक क्लिक जीवन बचा सकता है।",
                        "get_started": "शुरू करें",
                        "join_donor": "दाता बनें"
                    }
                }
            },
            bn: {
                translation: {
                    "sos_btn": "সাহায্য",
                    "tap_alert": "চাপ দিন",
                    "emergency_center": "জরুরী কেন্দ্র",
                    "nearby_resources": "নিকটস্থ সম্পদ",
                    "health_id": "স্বাস্থ্য আইডি",
                    "home": {
                        "tagline": "লাইভ জরুরী প্রতিক্রিয়া নেটওয়ার্ক",
                        "title": "লাইফলাইনএক্স",
                        "subtitle": "হাসপাতাল, দাতা এবং অ্যাম্বুলেন্সকে নিমিষেই সংযুক্ত করছে।",
                        "empowerment": "এক ক্লিকেই জীবন বাঁচতে পারে।",
                        "get_started": "শুরু করুন",
                        "join_donor": "দাতা হিসেবে যোগ দিন"
                    }
                }
            }
        }
    });

export default i18n;
