import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.detect': 'Detect',
    'nav.history': 'History',
    'nav.reports': 'Reports',
    'nav.help': 'Help',
    'nav.profile': 'Profile',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.signOut': 'Sign Out',
    
    // Landing Page
    'landing.title': 'CattleCare AI',
    'landing.subtitle': 'Smart Cattle Health & Breed Detection',
    'landing.description': 'Helping farmers and veterinarians detect cattle breed and diseases with just a photo. Works even without internet!',
    'landing.signIn': 'Sign In',
    'landing.createAccount': 'Create Account',
    'landing.tryDemo': 'Try Demo',
    'landing.features': 'Features',
    'landing.breedDetection': 'Breed Detection',
    'landing.breedDesc': 'Identify cattle breeds instantly from photos',
    'landing.diseaseDetection': 'Disease Detection',
    'landing.diseaseDesc': 'Detect common cattle diseases early',
    'landing.offlineCapable': 'Works Offline',
    'landing.offlineDesc': 'Use the app even without internet connection',
    'landing.footer.contact': 'Contact Us',
    'landing.footer.version': 'Version 1.0.0',
    
    // Auth
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Create Account',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.fullName': 'Full Name',
    'auth.rememberMe': 'Remember me',
    'auth.forgotPassword': 'Forgot password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.createHere': 'Create one here',
    'auth.signInHere': 'Sign in here',
    'auth.forgotTitle': 'Forgot Password',
    'auth.forgotDesc': 'Enter your email and we will send you a reset link',
    'auth.sendResetLink': 'Send Reset Link',
    'auth.backToSignIn': 'Back to Sign In',
    'auth.resetSent': 'Reset link sent! Check your email.',
    'auth.selectLanguage': 'Select Language',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.scanBreed': 'Scan Breed',
    'dashboard.scanDisease': 'Scan Disease',
    'dashboard.fullScan': 'Full Scan',
    'dashboard.fullScanDesc': 'Breed + Disease',
    'dashboard.history': 'View History',
    'dashboard.totalScans': 'Total Scans',
    'dashboard.topBreed': 'Most Detected Breed',
    'dashboard.topDisease': 'Most Detected Disease',
    'dashboard.recentScans': 'Recent Scans',
    'dashboard.noScans': 'No scans yet. Start by uploading a cattle image!',
    
    // Detection
    'detect.title': 'Upload Cattle Image',
    'detect.step1': 'Step 1: Upload Image',
    'detect.step2': 'Step 2: Choose Scan Type',
    'detect.step3': 'Step 3: View Results',
    'detect.dragDrop': 'Drag and drop your image here',
    'detect.or': 'or',
    'detect.browse': 'Browse Files',
    'detect.supportedFormats': 'Supported: JPG, PNG, WEBP (Max 10MB)',
    'detect.fullDetection': 'Full Detection',
    'detect.onlyBreed': 'Only Breed',
    'detect.onlyDisease': 'Only Disease',
    'detect.scanning': 'Scanning...',
    'detect.cattleDetected': 'Cattle Detected',
    'detect.cattleNotDetected': 'No Cattle Detected',
    'detect.breed': 'Breed',
    'detect.disease': 'Disease',
    'detect.confidence': 'Confidence',
    'detect.healthy': 'Healthy',
    'detect.downloadReport': 'Download Scan Report',
    'detect.scanAgain': 'Scan Another Image',
    'detect.helpTitle': 'How to take a good photo',
    'detect.helpTip1': 'Make sure the cattle is clearly visible',
    'detect.helpTip2': 'Good lighting helps accuracy',
    'detect.helpTip3': 'Include the full body if possible',
    'detect.helpTip4': 'Avoid blurry or dark images',
    'detect.invalidInput': 'Invalid Input: Please upload an image of a cattle (cow). No cattle detected in the provided image.',
    'detect.startScan': 'Start Scan',
    
    // History
    'history.title': 'Scan History',
    'history.filterByBreed': 'Filter by Breed',
    'history.filterByDisease': 'Filter by Disease',
    'history.filterByDate': 'Filter by Date',
    'history.allBreeds': 'All Breeds',
    'history.allDiseases': 'All Diseases',
    'history.viewDetails': 'View Details',
    'history.noHistory': 'No scan history yet',
    'history.noHistoryDesc': 'Your scan results will appear here after you scan cattle images.',
    'history.status': 'Status',
    'history.valid': 'Valid',
    'history.invalid': 'Invalid',
    
    // Scan Details
    'details.title': 'Scan Details',
    'details.scanId': 'Scan ID',
    'details.dateTime': 'Date & Time',
    'details.delete': 'Delete Scan',
    'details.backToHistory': 'Back to History',
    'details.confirmDelete': 'Are you sure you want to delete this scan?',
    
    // Reports
    'reports.title': 'Reports & Analytics',
    'reports.monthly': 'Monthly Summary',
    'reports.topBreeds': 'Top Breeds',
    'reports.topDiseases': 'Top Diseases',
    'reports.trends': 'Trends',
    'reports.exportPdf': 'Export PDF',
    'reports.exportCsv': 'Export CSV',
    'reports.noData': 'Not enough data to show reports',
    
    // Profile
    'profile.title': 'Profile & Settings',
    'profile.userInfo': 'User Information',
    'profile.language': 'Language',
    'profile.logout': 'Logout',
    'profile.changePassword': 'Change Password',
    
    // Help
    'help.title': 'Help & FAQ',
    'help.q1': 'How do I take a good photo of cattle?',
    'help.a1': 'Stand at a distance where you can see the full body of the cattle. Make sure there is good lighting and the image is not blurry.',
    'help.q2': 'Why do some images fail?',
    'help.a2': 'Images may fail if: the cattle is not clearly visible, the image is too dark or blurry, or if there is no cattle in the image.',
    'help.q3': 'What should I do if cattle is not detected?',
    'help.a3': 'Try taking another photo with better lighting and make sure the cattle is clearly visible in the frame.',
    'help.q4': 'Can I use this app without internet?',
    'help.a4': 'Yes! The app works offline. Your scans will be saved and synced when you connect to the internet.',
    
    // About
    'about.title': 'About CattleCare AI',
    'about.description': 'CattleCare AI is a smart tool designed to help farmers and veterinarians.',
    'about.howItWorks': 'How It Works',
    'about.step1': 'Upload a photo of your cattle',
    'about.step2': 'Our AI detects if it is a valid cattle image',
    'about.step3': 'The system identifies the breed',
    'about.step4': 'It also checks for any visible diseases',
    'about.pipeline': 'The system first finds cattle using a detection model, then predicts breed and disease.',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.name': 'Your Name',
    'contact.email': 'Your Email',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.sent': 'Message sent successfully!',
    'contact.team': 'Our Team',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.success': 'Success!',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.yes': 'Yes',
    'common.no': 'No',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.empty': 'No notifications yet',
    'notifications.markAllRead': 'Mark all as read',
    'notifications.clearAll': 'Clear all',
    'notifications.enable': 'Enable Notifications',
    'notifications.enablePrompt': 'Get alerts for disease detection and health tips',
    'notifications.settings': 'Notification Settings',
    'notifications.diseaseAlerts': 'Disease Alerts',
    'notifications.healthTips': 'Health Tips',
  },
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.detect': 'जांच करें',
    'nav.history': 'इतिहास',
    'nav.reports': 'रिपोर्ट',
    'nav.help': 'मदद',
    'nav.profile': 'प्रोफाइल',
    'nav.about': 'जानकारी',
    'nav.contact': 'संपर्क',
    'nav.signOut': 'लॉग आउट',
    
    // Landing Page
    'landing.title': 'कैटलकेयर AI',
    'landing.subtitle': 'स्मार्ट पशु स्वास्थ्य और नस्ल पहचान',
    'landing.description': 'किसानों और पशु चिकित्सकों को सिर्फ एक फोटो से पशुओं की नस्ल और बीमारियों का पता लगाने में मदद। इंटरनेट के बिना भी काम करता है!',
    'landing.signIn': 'साइन इन',
    'landing.createAccount': 'खाता बनाएं',
    'landing.tryDemo': 'डेमो देखें',
    'landing.features': 'विशेषताएं',
    'landing.breedDetection': 'नस्ल पहचान',
    'landing.breedDesc': 'फोटो से तुरंत पशु की नस्ल पहचानें',
    'landing.diseaseDetection': 'बीमारी पहचान',
    'landing.diseaseDesc': 'पशुओं की आम बीमारियों का जल्दी पता लगाएं',
    'landing.offlineCapable': 'ऑफलाइन काम करे',
    'landing.offlineDesc': 'इंटरनेट के बिना भी ऐप का उपयोग करें',
    'landing.footer.contact': 'संपर्क करें',
    'landing.footer.version': 'संस्करण 1.0.0',
    
    // Auth
    'auth.signIn': 'साइन इन',
    'auth.signUp': 'खाता बनाएं',
    'auth.email': 'ईमेल पता',
    'auth.password': 'पासवर्ड',
    'auth.confirmPassword': 'पासवर्ड पुष्टि',
    'auth.fullName': 'पूरा नाम',
    'auth.rememberMe': 'मुझे याद रखें',
    'auth.forgotPassword': 'पासवर्ड भूल गए?',
    'auth.noAccount': 'खाता नहीं है?',
    'auth.hasAccount': 'पहले से खाता है?',
    'auth.createHere': 'यहां बनाएं',
    'auth.signInHere': 'यहां साइन इन करें',
    'auth.forgotTitle': 'पासवर्ड भूल गए',
    'auth.forgotDesc': 'अपना ईमेल दर्ज करें और हम आपको रीसेट लिंक भेजेंगे',
    'auth.sendResetLink': 'रीसेट लिंक भेजें',
    'auth.backToSignIn': 'साइन इन पर वापस',
    'auth.resetSent': 'रीसेट लिंक भेजा गया! अपना ईमेल देखें।',
    'auth.selectLanguage': 'भाषा चुनें',
    
    // Dashboard
    'dashboard.welcome': 'वापस स्वागत है',
    'dashboard.scanBreed': 'नस्ल स्कैन',
    'dashboard.scanDisease': 'बीमारी स्कैन',
    'dashboard.fullScan': 'पूर्ण स्कैन',
    'dashboard.fullScanDesc': 'नस्ल + बीमारी',
    'dashboard.history': 'इतिहास देखें',
    'dashboard.totalScans': 'कुल स्कैन',
    'dashboard.topBreed': 'सबसे अधिक पहचानी गई नस्ल',
    'dashboard.topDisease': 'सबसे अधिक पहचानी गई बीमारी',
    'dashboard.recentScans': 'हाल के स्कैन',
    'dashboard.noScans': 'अभी तक कोई स्कैन नहीं। पशु की छवि अपलोड करके शुरू करें!',
    
    // Detection
    'detect.title': 'पशु छवि अपलोड करें',
    'detect.step1': 'चरण 1: छवि अपलोड करें',
    'detect.step2': 'चरण 2: स्कैन प्रकार चुनें',
    'detect.step3': 'चरण 3: परिणाम देखें',
    'detect.dragDrop': 'अपनी छवि यहां खींचें और छोड़ें',
    'detect.or': 'या',
    'detect.browse': 'फाइलें ब्राउज़ करें',
    'detect.supportedFormats': 'समर्थित: JPG, PNG, WEBP (अधिकतम 10MB)',
    'detect.fullDetection': 'पूर्ण पहचान',
    'detect.onlyBreed': 'केवल नस्ल',
    'detect.onlyDisease': 'केवल बीमारी',
    'detect.scanning': 'स्कैन हो रहा है...',
    'detect.cattleDetected': 'पशु पाया गया',
    'detect.cattleNotDetected': 'पशु नहीं मिला',
    'detect.breed': 'नस्ल',
    'detect.disease': 'बीमारी',
    'detect.confidence': 'विश्वास',
    'detect.healthy': 'स्वस्थ',
    'detect.downloadReport': 'स्कैन रिपोर्ट डाउनलोड करें',
    'detect.scanAgain': 'दूसरी छवि स्कैन करें',
    'detect.helpTitle': 'अच्छी फोटो कैसे लें',
    'detect.helpTip1': 'सुनिश्चित करें कि पशु स्पष्ट दिखाई दे',
    'detect.helpTip2': 'अच्छी रोशनी से सटीकता बढ़ती है',
    'detect.helpTip3': 'संभव हो तो पूरा शरीर शामिल करें',
    'detect.helpTip4': 'धुंधली या अंधेरी छवियों से बचें',
    'detect.invalidInput': 'अमान्य इनपुट: कृपया पशु (गाय) की छवि अपलोड करें। दी गई छवि में कोई पशु नहीं मिला।',
    'detect.startScan': 'स्कैन शुरू करें',
    
    // History
    'history.title': 'स्कैन इतिहास',
    'history.filterByBreed': 'नस्ल से फ़िल्टर',
    'history.filterByDisease': 'बीमारी से फ़िल्टर',
    'history.filterByDate': 'तारीख से फ़िल्टर',
    'history.allBreeds': 'सभी नस्लें',
    'history.allDiseases': 'सभी बीमारियां',
    'history.viewDetails': 'विवरण देखें',
    'history.noHistory': 'अभी तक कोई स्कैन इतिहास नहीं',
    'history.noHistoryDesc': 'पशु छवियों को स्कैन करने के बाद आपके परिणाम यहां दिखाई देंगे।',
    'history.status': 'स्थिति',
    'history.valid': 'वैध',
    'history.invalid': 'अमान्य',
    
    // Scan Details
    'details.title': 'स्कैन विवरण',
    'details.scanId': 'स्कैन आईडी',
    'details.dateTime': 'तारीख और समय',
    'details.delete': 'स्कैन हटाएं',
    'details.backToHistory': 'इतिहास पर वापस',
    'details.confirmDelete': 'क्या आप वाकई इस स्कैन को हटाना चाहते हैं?',
    
    // Reports
    'reports.title': 'रिपोर्ट और विश्लेषण',
    'reports.monthly': 'मासिक सारांश',
    'reports.topBreeds': 'शीर्ष नस्लें',
    'reports.topDiseases': 'शीर्ष बीमारियां',
    'reports.trends': 'रुझान',
    'reports.exportPdf': 'PDF निर्यात करें',
    'reports.exportCsv': 'CSV निर्यात करें',
    'reports.noData': 'रिपोर्ट दिखाने के लिए पर्याप्त डेटा नहीं',
    
    // Profile
    'profile.title': 'प्रोफाइल और सेटिंग्स',
    'profile.userInfo': 'उपयोगकर्ता जानकारी',
    'profile.language': 'भाषा',
    'profile.logout': 'लॉग आउट',
    'profile.changePassword': 'पासवर्ड बदलें',
    
    // Help
    'help.title': 'मदद और अक्सर पूछे जाने वाले प्रश्न',
    'help.q1': 'पशु की अच्छी फोटो कैसे लें?',
    'help.a1': 'ऐसी दूरी पर खड़े हों जहां से पशु का पूरा शरीर दिखे। सुनिश्चित करें कि अच्छी रोशनी हो और छवि धुंधली न हो।',
    'help.q2': 'कुछ छवियां विफल क्यों होती हैं?',
    'help.a2': 'छवियां विफल हो सकती हैं यदि: पशु स्पष्ट दिखाई न दे, छवि बहुत अंधेरी या धुंधली हो, या छवि में कोई पशु न हो।',
    'help.q3': 'अगर पशु का पता नहीं चलता तो क्या करें?',
    'help.a3': 'बेहतर रोशनी के साथ दूसरी फोटो लेने का प्रयास करें और सुनिश्चित करें कि पशु फ्रेम में स्पष्ट दिखाई दे।',
    'help.q4': 'क्या मैं इस ऐप को इंटरनेट के बिना उपयोग कर सकता हूं?',
    'help.a4': 'हां! ऐप ऑफलाइन काम करता है। आपके स्कैन सहेजे जाएंगे और इंटरनेट से कनेक्ट होने पर सिंक हो जाएंगे।',
    
    // About
    'about.title': 'कैटलकेयर AI के बारे में',
    'about.description': 'कैटलकेयर AI किसानों और पशु चिकित्सकों की मदद के लिए बनाया गया एक स्मार्ट टूल है।',
    'about.howItWorks': 'यह कैसे काम करता है',
    'about.step1': 'अपने पशु की फोटो अपलोड करें',
    'about.step2': 'हमारा AI जांचता है कि यह वैध पशु छवि है',
    'about.step3': 'सिस्टम नस्ल की पहचान करता है',
    'about.step4': 'यह किसी भी दिखाई देने वाली बीमारी की भी जांच करता है',
    'about.pipeline': 'सिस्टम पहले डिटेक्शन मॉडल का उपयोग करके पशु ढूंढता है, फिर नस्ल और बीमारी की भविष्यवाणी करता है।',
    
    // Contact
    'contact.title': 'संपर्क करें',
    'contact.name': 'आपका नाम',
    'contact.email': 'आपका ईमेल',
    'contact.message': 'संदेश',
    'contact.send': 'संदेश भेजें',
    'contact.sent': 'संदेश सफलतापूर्वक भेजा गया!',
    'contact.team': 'हमारी टीम',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'कुछ गलत हो गया',
    'common.success': 'सफलता!',
    'common.cancel': 'रद्द करें',
    'common.confirm': 'पुष्टि करें',
    'common.save': 'सहेजें',
    'common.delete': 'हटाएं',
    'common.yes': 'हां',
    'common.no': 'नहीं',
    
    // Notifications
    'notifications.title': 'सूचनाएं',
    'notifications.empty': 'अभी कोई सूचना नहीं',
    'notifications.markAllRead': 'सभी पढ़े गए के रूप में चिह्नित करें',
    'notifications.clearAll': 'सभी साफ करें',
    'notifications.enable': 'सूचनाएं सक्षम करें',
    'notifications.enablePrompt': 'रोग पहचान और स्वास्थ्य सुझावों के लिए अलर्ट प्राप्त करें',
    'notifications.settings': 'सूचना सेटिंग्स',
    'notifications.diseaseAlerts': 'रोग अलर्ट',
    'notifications.healthTips': 'स्वास्थ्य सुझाव',
  },
  mr: {
    // Navigation
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.detect': 'तपासा',
    'nav.history': 'इतिहास',
    'nav.reports': 'अहवाल',
    'nav.help': 'मदत',
    'nav.profile': 'प्रोफाइल',
    'nav.about': 'माहिती',
    'nav.contact': 'संपर्क',
    'nav.signOut': 'बाहेर पडा',
    
    // Landing Page
    'landing.title': 'कॅटलकेअर AI',
    'landing.subtitle': 'स्मार्ट गुरे आरोग्य आणि जात ओळख',
    'landing.description': 'शेतकरी आणि पशुवैद्यांना फक्त एका फोटोवरून गुरांची जात आणि आजार ओळखण्यात मदत. इंटरनेटशिवायही काम करते!',
    'landing.signIn': 'साइन इन',
    'landing.createAccount': 'खाते तयार करा',
    'landing.tryDemo': 'डेमो पहा',
    'landing.features': 'वैशिष्ट्ये',
    'landing.breedDetection': 'जात ओळख',
    'landing.breedDesc': 'फोटोवरून गुरांची जात लगेच ओळखा',
    'landing.diseaseDetection': 'आजार ओळख',
    'landing.diseaseDesc': 'गुरांचे सामान्य आजार लवकर ओळखा',
    'landing.offlineCapable': 'ऑफलाइन काम करते',
    'landing.offlineDesc': 'इंटरनेट कनेक्शनशिवाय अॅप वापरा',
    'landing.footer.contact': 'संपर्क साधा',
    'landing.footer.version': 'आवृत्ती 1.0.0',
    
    // Auth
    'auth.signIn': 'साइन इन',
    'auth.signUp': 'खाते तयार करा',
    'auth.email': 'ईमेल पत्ता',
    'auth.password': 'पासवर्ड',
    'auth.confirmPassword': 'पासवर्ड पुष्टी',
    'auth.fullName': 'पूर्ण नाव',
    'auth.rememberMe': 'मला लक्षात ठेवा',
    'auth.forgotPassword': 'पासवर्ड विसरलात?',
    'auth.noAccount': 'खाते नाही?',
    'auth.hasAccount': 'आधीच खाते आहे?',
    'auth.createHere': 'येथे तयार करा',
    'auth.signInHere': 'येथे साइन इन करा',
    'auth.forgotTitle': 'पासवर्ड विसरलात',
    'auth.forgotDesc': 'तुमचा ईमेल प्रविष्ट करा आणि आम्ही तुम्हाला रीसेट लिंक पाठवू',
    'auth.sendResetLink': 'रीसेट लिंक पाठवा',
    'auth.backToSignIn': 'साइन इन वर परत',
    'auth.resetSent': 'रीसेट लिंक पाठवली! तुमचा ईमेल तपासा.',
    'auth.selectLanguage': 'भाषा निवडा',
    
    // Dashboard
    'dashboard.welcome': 'पुन्हा स्वागत',
    'dashboard.scanBreed': 'जात स्कॅन',
    'dashboard.scanDisease': 'आजार स्कॅन',
    'dashboard.fullScan': 'पूर्ण स्कॅन',
    'dashboard.fullScanDesc': 'जात + आजार',
    'dashboard.history': 'इतिहास पहा',
    'dashboard.totalScans': 'एकूण स्कॅन',
    'dashboard.topBreed': 'सर्वाधिक ओळखली जात',
    'dashboard.topDisease': 'सर्वाधिक ओळखला आजार',
    'dashboard.recentScans': 'अलीकडील स्कॅन',
    'dashboard.noScans': 'अजून स्कॅन नाहीत. गुरांची छवी अपलोड करून सुरू करा!',
    
    // Detection
    'detect.title': 'गुरे छवी अपलोड करा',
    'detect.step1': 'पायरी 1: छवी अपलोड करा',
    'detect.step2': 'पायरी 2: स्कॅन प्रकार निवडा',
    'detect.step3': 'पायरी 3: निकाल पहा',
    'detect.dragDrop': 'तुमची छवी येथे ड्रॅग आणि ड्रॉप करा',
    'detect.or': 'किंवा',
    'detect.browse': 'फाइल्स ब्राउझ करा',
    'detect.supportedFormats': 'समर्थित: JPG, PNG, WEBP (कमाल 10MB)',
    'detect.fullDetection': 'पूर्ण ओळख',
    'detect.onlyBreed': 'फक्त जात',
    'detect.onlyDisease': 'फक्त आजार',
    'detect.scanning': 'स्कॅन होत आहे...',
    'detect.cattleDetected': 'गुरे सापडले',
    'detect.cattleNotDetected': 'गुरे सापडले नाही',
    'detect.breed': 'जात',
    'detect.disease': 'आजार',
    'detect.confidence': 'विश्वास',
    'detect.healthy': 'निरोगी',
    'detect.downloadReport': 'स्कॅन अहवाल डाउनलोड करा',
    'detect.scanAgain': 'दुसरी छवी स्कॅन करा',
    'detect.helpTitle': 'चांगला फोटो कसा काढावा',
    'detect.helpTip1': 'गुरे स्पष्ट दिसत असल्याची खात्री करा',
    'detect.helpTip2': 'चांगल्या प्रकाशाने अचूकता वाढते',
    'detect.helpTip3': 'शक्य असल्यास संपूर्ण शरीर समाविष्ट करा',
    'detect.helpTip4': 'धूसर किंवा गडद छवी टाळा',
    'detect.invalidInput': 'अवैध इनपुट: कृपया गुरे (गाय) ची छवी अपलोड करा. दिलेल्या छवीत कोणतेही गुरे सापडले नाही.',
    'detect.startScan': 'स्कॅन सुरू करा',
    
    // History
    'history.title': 'स्कॅन इतिहास',
    'history.filterByBreed': 'जातीनुसार फिल्टर',
    'history.filterByDisease': 'आजारानुसार फिल्टर',
    'history.filterByDate': 'तारखेनुसार फिल्टर',
    'history.allBreeds': 'सर्व जाती',
    'history.allDiseases': 'सर्व आजार',
    'history.viewDetails': 'तपशील पहा',
    'history.noHistory': 'अजून स्कॅन इतिहास नाही',
    'history.noHistoryDesc': 'गुरांच्या छवी स्कॅन केल्यानंतर तुमचे निकाल येथे दिसतील.',
    'history.status': 'स्थिती',
    'history.valid': 'वैध',
    'history.invalid': 'अवैध',
    
    // Scan Details
    'details.title': 'स्कॅन तपशील',
    'details.scanId': 'स्कॅन आयडी',
    'details.dateTime': 'तारीख आणि वेळ',
    'details.delete': 'स्कॅन हटवा',
    'details.backToHistory': 'इतिहासावर परत',
    'details.confirmDelete': 'तुम्हाला खात्री आहे की तुम्ही हे स्कॅन हटवू इच्छिता?',
    
    // Reports
    'reports.title': 'अहवाल आणि विश्लेषण',
    'reports.monthly': 'मासिक सारांश',
    'reports.topBreeds': 'शीर्ष जाती',
    'reports.topDiseases': 'शीर्ष आजार',
    'reports.trends': 'ट्रेंड',
    'reports.exportPdf': 'PDF निर्यात करा',
    'reports.exportCsv': 'CSV निर्यात करा',
    'reports.noData': 'अहवाल दाखवण्यासाठी पुरेसा डेटा नाही',
    
    // Profile
    'profile.title': 'प्रोफाइल आणि सेटिंग्ज',
    'profile.userInfo': 'वापरकर्ता माहिती',
    'profile.language': 'भाषा',
    'profile.logout': 'बाहेर पडा',
    'profile.changePassword': 'पासवर्ड बदला',
    
    // Help
    'help.title': 'मदत आणि वारंवार विचारले जाणारे प्रश्न',
    'help.q1': 'गुरांचा चांगला फोटो कसा काढायचा?',
    'help.a1': 'अशा अंतरावर उभे राहा जिथून गुरांचे संपूर्ण शरीर दिसेल. चांगला प्रकाश असल्याची आणि छवी धूसर नसल्याची खात्री करा.',
    'help.q2': 'काही छवी अयशस्वी का होतात?',
    'help.a2': 'छवी अयशस्वी होऊ शकतात जर: गुरे स्पष्ट दिसत नसतील, छवी खूप गडद किंवा धूसर असेल, किंवा छवीत गुरे नसतील.',
    'help.q3': 'गुरे सापडले नाही तर काय करावे?',
    'help.a3': 'चांगल्या प्रकाशासह दुसरा फोटो काढण्याचा प्रयत्न करा आणि गुरे फ्रेममध्ये स्पष्ट दिसत असल्याची खात्री करा.',
    'help.q4': 'मी हे अॅप इंटरनेटशिवाय वापरू शकतो का?',
    'help.a4': 'होय! अॅप ऑफलाइन काम करते. तुमचे स्कॅन सेव्ह होतील आणि इंटरनेटशी कनेक्ट झाल्यावर सिंक होतील.',
    
    // About
    'about.title': 'कॅटलकेअर AI बद्दल',
    'about.description': 'कॅटलकेअर AI हे शेतकरी आणि पशुवैद्यांना मदत करण्यासाठी तयार केलेले स्मार्ट साधन आहे.',
    'about.howItWorks': 'हे कसे काम करते',
    'about.step1': 'तुमच्या गुरांचा फोटो अपलोड करा',
    'about.step2': 'आमचा AI तपासतो की ही वैध गुरे छवी आहे का',
    'about.step3': 'सिस्टम जात ओळखते',
    'about.step4': 'कोणत्याही दृश्यमान आजारांसाठी देखील तपासते',
    'about.pipeline': 'सिस्टम प्रथम डिटेक्शन मॉडेल वापरून गुरे शोधते, नंतर जात आणि आजाराचा अंदाज लावते.',
    
    // Contact
    'contact.title': 'संपर्क साधा',
    'contact.name': 'तुमचे नाव',
    'contact.email': 'तुमचा ईमेल',
    'contact.message': 'संदेश',
    'contact.send': 'संदेश पाठवा',
    'contact.sent': 'संदेश यशस्वीरित्या पाठवला!',
    'contact.team': 'आमची टीम',
    
    // Common
    'common.loading': 'लोड होत आहे...',
    'common.error': 'काहीतरी चूक झाली',
    'common.success': 'यशस्वी!',
    'common.cancel': 'रद्द करा',
    'common.confirm': 'पुष्टी करा',
    'common.save': 'सेव्ह करा',
    'common.delete': 'हटवा',
    'common.yes': 'होय',
    'common.no': 'नाही',
    
    // Notifications
    'notifications.title': 'सूचना',
    'notifications.empty': 'अजून सूचना नाहीत',
    'notifications.markAllRead': 'सर्व वाचले म्हणून चिन्हांकित करा',
    'notifications.clearAll': 'सर्व साफ करा',
    'notifications.enable': 'सूचना सक्षम करा',
    'notifications.enablePrompt': 'आजार ओळख आणि आरोग्य टिपांसाठी अलर्ट मिळवा',
    'notifications.settings': 'सूचना सेटिंग्ज',
    'notifications.diseaseAlerts': 'आजार अलर्ट',
    'notifications.healthTips': 'आरोग्य टिपा',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('cattlecare-language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('cattlecare-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
