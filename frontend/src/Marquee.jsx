import React from "react";
import logo2 from "../src/assets/logo.png";
import { useLanguage } from "./context/LanguageContext";

// Prefix mapping for Hindi
const prefixMap = {
  "Shri": "श्री",
  "Smt.": "श्रीमती",
  "Ms.": "सुश्री",
  "Dr.": "डॉ.",
};

// ✅ Name mapping for Hindi
const nameMap = {
  "Smt. Vijaylaxmi Tanwar": "श्रीमती विजयलक्ष्मी तंवर",
  "Shri Mukesh Patel": "श्री मुकेश पटेल",
  "Shri Shyam Kumar Guddu": "श्री श्याम कुमार गुड्डू",
  "Shri Rajendra Kushwaha": "श्री राजेंद्र कुशवाहा",
  "Shri Sanjay Uikey": "श्री संजय उइके",
  "Shri Nanesh Chaudhary": "श्री ननेश चौधरी",
  "Shri Nilay Vinod Daga": "श्री निलय विनोद डागा",
  "Shri Ramshish Baghel": "श्री रामशिश बघेल",
  "Shri Dharmendra Bhadoriya": "श्री धर्मेंद्र भदौरिया",
  "Shri Praveen Saxena": "श्री प्रवीन सक्सेना",
  "Shri Anokhi Man Singh Patel": "श्री अनोखी मान सिंह पटेल",
  "Shri Harsh Tank Rinku": "श्री हर्ष टैंक रिंकू",
  "Shri Ravinder Mahajan": "श्री रविंदर महाजन",
  "Shri Gagan Yadav": "श्री गगन यादव",
  "Shri Vishwanath Okhte": "श्री विश्वनाथ ओखटे",
  "Shri Manak Patel": "श्री मनक पटेल",
  "Shri Ashok Dangi": "श्री अशोक डांगी",
  "Shri Prayas Gautam": "श्री प्रयास गौतम",
  "Shri Manish Choudhary": "श्री मनीष चौधरी",
  "Shri Swatantra Joshi": "श्री स्वतंत्र जोशी",
  "Shri Omkar Singh Markam": "श्री ओंकार सिंह मरकाम",
  "Shri Jaivardhan Singh": "श्री जयवर्धन सिंह",
  "Shri Surendra Yadav": "श्री सुरेंद्र यादव",
  "Shri Prabhudayal Johare": "श्री प्रभुदयाल जोहरे",
  "Shri Mohan Sai": "श्री मोहन साई",
  "Shri Chintu Chouksey": "श्री चिंटू चौकसे",
  "Shri Vipin Wankhede": "श्री विपिन वानखेड़े",
  "Shri Sourabh Nati Sharma": "श्री सौरभ नटी शर्मा",
  "Shri Sanjay Yadav": "श्री संजय यादव",
  "Shri Prakash Ranka": "श्री प्रकाश रांका",
  "Shri Amit Kumar Shukla": "श्री अमित कुमार शुक्ला",
  "Shri Kuwar Sourabh Singh": "श्री कुवर सौरभ सिंह",
  "Ms. Pratibha Raghuwanshi": "सुश्री प्रतिभा रघुवंशी",
  "Shri Uttam Pal Singh Purni": "श्री उत्तम पाल सिंह पर्णी",
  "Shri Ravi Naik": "श्री रवि नाइक",
  "Shri Dharmesh Ghai": "श्री धर्मेश घई",
  "Dr. Ashok Marskole": "डॉ. अशोक मर्सकोले",
  "Shri Mahendra Singh Gurjar": "श्री महेंद्र सिंह गुर्जर",
  "Shri Hiralal Kol": "श्री हीरालाल कोल",
  "Shri Gajendra Jatav": "श्री गजेन्द्र जाटव",
  "Shri Madhuraj Tomar": "श्री मधुराज तोमर",
  "Shri Shivakant Pandey": "श्री शिवकांत पांडेय",
  "Smt. Sunita Patel": "श्रीमती सुनीता पटेल",
  "Shri Tarun Baheti": "श्री तरुण बाहेती",
  "Shri Rajesh Yadav": "श्री राजेश यादव",
  "Shri Jatan Uikey": "श्री जतन उइके",
  "Shri Anis Khan": "श्री अनीस खान",
  "Shri Devendra Patel": "श्री देवेंद्र पटेल",
  "Shri Priyavrat Singh": "श्री प्रियव्रत सिंह",
  "Shri Shantilal Verma": "श्री शांतिलाल वर्मा",
  "Shri Harshvijay Gehlot": "श्री हर्षविजय गेहलोत",
  "Shri Ashok Patel": "श्री अशोक पटेल",
  "Shri Rajinder Sharma": "श्री राजिंदर शर्मा",
  "Shri Mahesh Jatav": "श्री महेश जाटव",
  "Shri Bhupendra Singh Mohasa": "श्री भूपेंद्र सिंह मोहासा",
  "Shri Arif Iqbal Siddique": "श्री आरिफ इक़बाल सिद्दीकी",
  "Shri Siddharth Kushwaha": "श्री सिद्धार्थ कुशवाहा",
  "Shri Rajiv Gujarati": "श्री राजीव गुजराती",
  "Shri Naresh Marawai": "श्री नरेश मरवाई",
  "Shri Ajay Awasti": "श्री अजय अवस्थी",
  "Shri Nareshwar Pratap Singh": "श्री नरेश्वर प्रताप सिंह",
  "Shri Mangilal Bairwa Fauji": "श्री मंगीलाल बैरवा फौजी",
  "Shri Mohit Agarwal": "श्री मोहित अग्रवाल",
  "Shri Gyan Pratap Singh": "श्री ज्ञान प्रताप सिंह",
  "Shri Praveen Singh Chauhan": "श्री प्रवीन सिंह चौहान",
  "Smt. Saraswati Singh Markam": "श्रीमती सरस्वती सिंह मरकाम",
  "Shri Naveen Sahu": "श्री नवीन साहू",
  "Shri Mukesh Bhati": "श्री मुकेश भाटी",
  "Shri Mahesh Parmar": "श्री महेश परमार",
  "Shri Engineer Vijay Kumar Kol": "श्री इंजीनियर विजय कुमार कोल",
  "Shri Mohit Raghuwanshi": "श्री मोहित रघुवंशी",
};

// ✅ Designation mapping for Hindi
const designationMap = {
  "Admin": "प्रशासक",
  "Agar - Malwa Jila Adhyaksh": "आगर मालवा जिला अध्यक्ष",
  "Alirajpur Jila Adhyaksh": "अलीराजपुर जिला अध्यक्ष",
  "Anuppur Jila Adhyaksh": "अनूपपुर जिला अध्यक्ष",
  "Ashok Nagar JIla Adhyaksh": "अशोक नगर जिला अध्यक्ष",
  "Balaghat Jila Adhyaksh": "बालाघाट जिला अध्यक्ष",
  "Barwani Jila Adhyaksh": "बड़वानी जिला अध्यक्ष",
  "Betul Jila Adhyaksh": "बेतूल जिला अध्यक्ष",
  "Bhind Rural Jila Adhyaksh": "भिंड ग्रामीण जिला अध्यक्ष",
  "Bhind City Adhyaksh": "भिंड शहर अध्यक्ष",
  "Bhopal City Adhyaksh": "भोपाल शहर अध्यक्ष",
  "Bhopal Rural Jila Adhyaksh": "भोपाल ग्रामीण जिला अध्यक्ष",
  "Burhanpur City Adhyaksh": "बुरहानपुर शहर अध्यक्ष",
  "Burhanpur Rural Jila Adhyaksh": "बुरहानपुर ग्रामीण जिला अध्यक्ष",
  "Chhatarpur Jila Adhyaksh": "छतरपुर जिला अध्यक्ष",
  "Chhindwara Jila Adhyaksh": "छिंदवाड़ा जिला अध्यक्ष",
  "Damoh Jila Adhyaksh": "दमोह जिला अध्यक्ष",
  "Datia Jila Adhyaksh": "दतिया जिला अध्यक्ष",
  "Dewas City Adhyaksh": "देवास शहर अध्यक्ष",
  "Dewas Rural Jila Adhyaksh": "देवास ग्रामीण जिला अध्यक्ष",
  "Dhar Jila Adhyaksh": "धार जिला अध्यक्ष",
  "Dindori Jila Adhyaksh": "डिंडोरी जिला अध्यक्ष",
  "Guna Jila Adhyaksh": "गुना जिला अध्यक्ष",
  "Gwalior City Adhyaksh": "ग्वालियर शहर अध्यक्ष",
  "Gwalior Rural Jila Adhyaksh": "ग्वालियर ग्रामीण जिला अध्यक्ष",
  "Harda Jila Adhyaksh": "हरदा जिला अध्यक्ष",
  "Indore City Adhyaksh": "इंदौर शहर अध्यक्ष",
  "Indore Rural Jila Adhyaksh": "इंदौर ग्रामीण जिला अध्यक्ष",
  "Jabalpur City Adhyaksh": "जबलपुर शहर अध्यक्ष",
  "Jabalpur Rural Jila Adhyaksh": "जबलपुर ग्रामीण जिला अध्यक्ष",
  "Jhabua Jila Adhyaksh": "झाबुआ जिला अध्यक्ष",
  "Katni City Adhyaksh": "कटनी शहर अध्यक्ष",
  "Katni Rural Jila Adhyaksh": "कटनी ग्रामीण जिला अध्यक्ष",
  "Khandwa City Adhyaksh": "खंडवा शहर अध्यक्ष",
  "Khandwa Rural Jila Adhyaksh": "खंडवा ग्रामीण जिला अध्यक्ष",
  "Khargone Jila Adhyaksh": "खरगोन जिला अध्यक्ष",
  "Maihar Jila Adhyaksh": "मैहर जिला अध्यक्ष",
  "Mandla Jila Adhyaksh": "मंडला जिला अध्यक्ष",
  "Mandsaur Jila Adhyaksh": "मंदसौर जिला अध्यक्ष",
  "Mauganj Jila Adhyaksh": "मऊगंज जिला अध्यक्ष",
  "Morena City Adhyaksh": "मुरैना शहर अध्यक्ष",
  "Morena Rural Jila Adhyaksh": "मुरैना ग्रामीण जिला अध्यक्ष",
  "Narmadapuram Jila Adhyaksh": "नर्मदापुरम जिला अध्यक्ष",
  "Narsinghpur Jila Adhyaksh": "नरसिंहपुर जिला अध्यक्ष",
  "Neemuch Jila Adhyaksh": "नीमच जिला अध्यक्ष",
  "Niwadi Jila Adhyaksh": "निवाड़ी जिला अध्यक्ष",
  "Pandurna Jila Adhyaksh": "पांढुर्ना जिला अध्यक्ष",
  "Panna Jila Adhyaksh": "पन्ना जिला अध्यक्ष",
  "Raisen Jila Adhyaksh": "रायसेन जिला अध्यक्ष",
  "Rajgarh Jila Adhyaksh": "राजगढ़ जिला अध्यक्ष",
  "Ratlam City Adhyaksh": "रतलाम शहर अध्यक्ष",
  "Ratlam Rural Jila Adhyaksh": "रतलाम ग्रामीण जिला अध्यक्ष",
  "Rewa City Adhyaksh": "रीवा शहर अध्यक्ष",
  "Rewa Rural Jila Adhyaksh": "रीवा ग्रामीण जिला अध्यक्ष",
  "Sagar City Adhyaksh": "सागर शहर अध्यक्ष",
  "Sagar Rural Jila Adhyaksh": "सागर ग्रामीण जिला अध्यक्ष",
  "Satna City Adhyaksh": "सतना शहर अध्यक्ष",
  "Satna Rural Jila Adhyaksh": "सतना ग्रामीण जिला अध्यक्ष",
  "Sehore Jila Adhyaksh": "सीहोर जिला अध्यक्ष",
  "Seoni Jila Adhyaksh": "सिवनी जिला अध्यक्ष",
  "Shahdol Jila Adhyaksh": "शहडोल जिला अध्यक्ष",
  "Shajapur Jila Adhyaksh": "शाजापुर जिला अध्यक्ष",
  "Sheopur Jila Adhyaksh": "श्योपुर जिला अध्यक्ष",
  "Shivpuri Jila Adhyaksh": "शिवपुरी जिला अध्यक्ष",
  "Sidhi Jila Adhyaksh": "सीधी जिला अध्यक्ष",
  "Singrauli City Adhyaksh": "सिंगरौली शहर अध्यक्ष",
  "Singrauli Rural Jila Adhyaksh": "सिंगरौली ग्रामीण जिला अध्यक्ष",
  "Tikamgarh Jila Adhyaksh": "टीकमगढ़ जिला अध्यक्ष",
  "Ujjain City Adhyaksh": "उज्जैन शहर अध्यक्ष",
  "Ujjain Rural Jila Adhyaksh": "उज्जैन ग्रामीण जिला अध्यक्ष",
  "Umaria Jila Adhyaksh": "उमरिया जिला अध्यक्ष",
  "Vidisha Jila Adhyaksh": "विदिशा जिला अध्यक्ष",
};

export default function Marquee({
  logo = logo2,
  speed = 30,
  height = "h-16 md:h-20",
  gap = "gap-12 md:gap-16",
}) {
  const { language } = useLanguage();

  // get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const designation = user?.designation || "Admin";
  const userName = user?.username || "";

  // ✅ Translate name
  let displayName = userName;
  if (language === "hi") {
    if (nameMap[userName]) {
      displayName = nameMap[userName];
    } else {
      Object.keys(prefixMap).forEach((eng) => {
        displayName = displayName.replace(eng, prefixMap[eng]);
      });
    }
  }

  // ✅ Translate designation
  const displayDesignation =
    language === "hi"
      ? designationMap[designation] || designation
      : designation;

  // ✅ Final text
  const items = [`${displayName} - ${displayDesignation}`];

  // Repeat with logos
  const withLogos = [];
  items.forEach((text, i) => {
    withLogos.push({ type: "text", value: text });
    if (logo && i < items.length - 1) {
      withLogos.push({ type: "logo", value: logo });
    }
  });
  const repeated = Array.from({ length: 6 }, () => withLogos).flat();

  return (
    <div
      className={`relative w-screen max-w-none overflow-hidden ${height} group flex items-center`}
      role="region"
      aria-label="Scrolling ticker"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-white to-green-600 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-md" />
      </div>

      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white/70 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white/70 to-transparent" />

      {/* Marquee animation */}
      <div
        className={`flex items-center ${gap} whitespace-nowrap will-change-transform`}
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationPlayState: "var(--play, running)",
        }}
      >
        {repeated.map((item, i) =>
          item.type === "text" ? (
            <span
              key={i}
              className="flex items-center text-center text-sm sm:text-base md:text-xl lg:text-2xl font-semibold tracking-wide drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]"
            >
              {item.value}
            </span>
          ) : (
            <img
              key={i}
              src={item.value}
              alt="logo"
              className="h-8 sm:h-10 md:h-12 object-contain"
            />
          )
        )}
      </div>

      <style>{`
        .group:hover { --play: paused; }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
