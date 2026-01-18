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
                    },
                    "login": {
                        "welcome": "Welcome Back",
                        "subtitle": "Access the premier emergency network",
                        "email_placeholder": "Email Address",
                        "password_placeholder": "Password",
                        "btn": "Login to Account",
                        "new_user": "New to LifeLineX?",
                        "create_account": "Create Account"
                    },
                    "register": {
                        "title": "Create Account",
                        "subtitle": "Join the premier emergency response network.",
                        "i_am": "I am a",
                        "role_user": "User",
                        "role_donor": "Donor",
                        "role_hospital": "Hospital",
                        "full_name": "Full Name",
                        "phone": "Phone Number",
                        "email": "Email Address",
                        "password": "Password",
                        "location_setup": "Location Setup",
                        "use_current_location": "Use Current Location",
                        "finding": "Finding you...",
                        "tap_map": "Tap the map to adjust your precise location pin.",
                        "blood_group": "Blood Group",
                        "select_group": "Select Group",
                        "hospital_name": "Hospital / Bank Name",
                        "type": "Type",
                        "city": "City/Area",
                        "submit": "Create Account",
                        "why_join": "Why Join?",
                        "rapid_response": "Rapid Response",
                        "rapid_desc": "Connect instantly with nearest ambulances.",
                        "blood_network": "Blood Network",
                        "blood_desc": "Real-time blood availability tracking.",
                        "secure_data": "Secure Data",
                        "secure_desc": "HIPAA compliant end-to-end encryption.",
                        "have_account": "I already have an account"
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
                    },
                    "login": {
                        "welcome": "वापसी पर स्वागत है",
                        "subtitle": "प्रमुख आपातकालीन नेटवर्क तक पहुंचें",
                        "email_placeholder": "ईमेल पता",
                        "password_placeholder": "पासवर्ड",
                        "btn": "खाते में लॉगिन करें",
                        "new_user": "LifeLineX पर नए हैं?",
                        "create_account": "खाता बनाएं"
                    },
                    "register": {
                        "title": "खाता बनाएं",
                        "subtitle": "प्रमुख आपातकालीन प्रतिक्रिया नेटवर्क में शामिल हों।",
                        "i_am": "मैं एक हूँ",
                        "role_user": "उपयोगकर्ता",
                        "role_donor": "दाता",
                        "role_hospital": "अस्पताल",
                        "full_name": "पूरा नाम",
                        "phone": "फोन नंबर",
                        "email": "ईमेल पता",
                        "password": "पासवर्ड",
                        "location_setup": "स्थान सेटअप",
                        "use_current_location": "वर्तमान स्थान का उपयोग करें",
                        "finding": "आपको खोज रहा हूँ...",
                        "tap_map": "स्थान पिन समायोजित करने के लिए मानचित्र पर टैप करें।",
                        "blood_group": "रक्त समूह",
                        "select_group": "समूह चुनें",
                        "hospital_name": "अस्पताल / बैंक का नाम",
                        "type": "प्रकार",
                        "city": "शहर / क्षेत्र",
                        "submit": "खाता बनाएं",
                        "why_join": "क्यों शामिल हों?",
                        "rapid_response": "त्वरित प्रतिक्रिया",
                        "rapid_desc": "निकटतम एम्बुलेंस के साथ तुरंत जुड़ें।",
                        "blood_network": "रक्त नेटवर्क",
                        "blood_desc": "वास्तविक समय में रक्त की उपलब्धता पर नज़र रखना।",
                        "secure_data": "सुरक्षित डेटा",
                        "secure_desc": "HIPAA अनुपालन एंड-टू-एंड एन्क्रिप्शन।",
                        "have_account": "मेरे पास पहले से एक खाता है"
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
                    },
                    "login": {
                        "welcome": "স্বাগতম",
                        "subtitle": "প্রধান জরুরী নেটওয়ার্ক অ্যাক্সেস করুন",
                        "email_placeholder": "ইমেল ঠিকানা",
                        "password_placeholder": "পাসওয়ার্ড",
                        "btn": "অ্যাকাউন্টে লগইন করুন",
                        "new_user": "LifeLineX এ নতুন?",
                        "create_account": "অ্যাকাউন্ট তৈরি করুন"
                    },
                    "register": {
                        "title": "অ্যাকাউন্ট তৈরি করুন",
                        "subtitle": "প্রধান জরুরী প্রতিক্রিয়া নেটওয়ার্কে যোগ দিন।",
                        "i_am": "আমি একজন",
                        "role_user": "ব্যবহারকারী",
                        "role_donor": "দাতা",
                        "role_hospital": "হাসপাতাল",
                        "full_name": "পুরো নাম",
                        "phone": "ফোন নম্বর",
                        "email": "ইমেল ঠিকানা",
                        "password": "পাসওয়ার্ড",
                        "location_setup": "অবস্থান সেটআপ",
                        "use_current_location": "বর্তমান অবস্থান ব্যবহার করুন",
                        "finding": "আপনাকে খুঁজছি...",
                        "tap_map": "সঠিক অবস্থান পিন ঠিক করতে মানচিত্রে আলতো চাপুন।",
                        "blood_group": "রক্তের গ্রুপ",
                        "select_group": "গ্রুপ নির্বাচন করুন",
                        "hospital_name": "হাসপাতাল / ব্যাঙ্কের নাম",
                        "type": "ধরন",
                        "city": "শহর / এলাকা",
                        "submit": "অ্যাকাউন্ট তৈরি করুন",
                        "why_join": "কেন যোগ দেবেন?",
                        "rapid_response": "দ্রুত প্রতিক্রিয়া",
                        "rapid_desc": "নিকটতম অ্যাম্বুলেন্সের সাথে অবিলম্বে সংযোগ করুন।",
                        "blood_network": "রক্তের নেটওয়ার্ক",
                        "blood_desc": "রিয়েল-টাইম রক্ত প্রাপ্যতা ট্র্যাকিং।",
                        "secure_data": "সুরক্ষিত ডেটা",
                        "secure_desc": "HIPAA অনুগত এন্ড-টু-এন্ড এনক্রিপশন।",
                        "have_account": "আমার ইতিমধ্যে একটি অ্যাকাউন্ট আছে"
                    }
                }
            }
        }
    });

export default i18n;
