import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { Page } from "./models/page.model.js";

const pagesToSeed = [
  {
    pageKey: "about",
    title: "About Us",
    titleBn: "আমাদের সম্পর্কে",
    banner: {
      type: "visual",
      title: "ABOUT",
      titleBn: "আমাদের",
      accent: "US.",
      accentBn: "সম্পর্কে।",
      description:
        "Dedicated to promoting nationwide safety, building public awareness, and strengthening Bangladesh’s LPG sector through knowledge, technical training, and institutional collaboration.",
      descriptionBn:
        "সারাদেশে নিরাপত্তা নিশ্চিতকরণ, জনসচেতনতা বৃদ্ধি এবং জ্ঞান ও প্রযুক্তিগত প্রশিক্ষণের মাধ্যমে বাংলাদেশের এলপিজি খাতকে শক্তিশালী করতে নিবেদিত।",
      imageSrc:
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop",
      imageAlt: "About Safe LPG Platform",
      imageAltBn: "নিরাপদ এলপিজি সম্পর্কে",
    },
    sections: {
      lpgSafety: {
        tag: "WHO WE ARE",
        tagBn: "আমরা কারা",
        title: "DEDICATED TO",
        titleBn: "নিবেদিত",
        accent: "LPG SAFETY.",
        accentBn: "এলপিজি নিরাপত্তায়।",
        leadText:
          "We are a dedicated national platform working for a safer and more sustainable LPG sector in Bangladesh. We create awareness, provide up-to-date information, deliver quality training and support all stakeholders including investors, companies, dealers, distributors and consumers.",
        leadTextBn:
          "আমরা বাংলাদেশে একটি নিরাপদ এবং টেকসই এলপিজি খাতের জন্য কাজ করা একটি জাতীয় প্ল্যাটফর্ম। আমরা জনসচেতনতা সৃষ্টি করি, সঠিক তথ্য প্রদান করি এবং বিনিয়োগকারী, কোম্পানি, ডিলার, পরিবেশক ও সাধারণ ভোক্তাদের মানসম্মত প্রশিক্ষণ প্রদান করি।",
        paragraphs:
          "Through collaboration with government bodies, industry associations and safety experts, we aim to reduce operational risks, prevent incidents and build a proactive culture of safety across the entire LPG supply chain.",
        paragraphsBn:
          "সরকারি দপ্তর, শিল্প সংগঠন এবং নিরাপত্তা বিশেষজ্ঞদের সাথে সহযোগিতার মাধ্যমে আমরা দুর্ঘটনা প্রতিরোধ ও সমগ্র এলপিজি সরবরাহ শৃঙ্খলে নিরাপত্তার সংস্কৃতি গড়ে তুলছি।",
        features: [
          {
            title: "Safety First",
            titleBn: "নিরাপত্তা সবার আগে",
            desc: "We promote safety as a core value in every aspect of the LPG industry.",
            descBn: "এলপিজি খাতের প্রতিটি ক্ষেত্রে নিরাপত্তাকে আমরা প্রধান অগ্রাধিকার দেই।",
          },
          {
            title: "Awareness for All",
            titleBn: "সবার জন্য সচেতনতা",
            desc: "We spread awareness among all stakeholders to ensure a safer LPG ecosystem.",
            descBn: "একটি নিরাপদ পরিবেশ নিশ্চিত করতে সকল অংশীজনের মাঝে সচেতনতা ছড়িয়ে দিচ্ছি।",
          },
          {
            title: "Knowledge & Training",
            titleBn: "জ্ঞান ও প্রশিক্ষণ",
            desc: "We provide expert training, resources and guidance to build skills and confidence.",
            descBn: "দক্ষতা ও আত্মবিশ্বাস তৈরিতে বিশেষজ্ঞ প্রশিক্ষণ ও দিকনির্দেশনা প্রদান করি।",
          },
          {
            title: "Stronger Together",
            titleBn: "একতাবদ্ধ প্রচেষ্টা",
            desc: "We collaborate with industry leaders and organizations to create a safer tomorrow.",
            descBn: "একটি নিরাপদ আগামী গড়তে শিল্প খাতের নেতৃবৃন্দ ও সংস্থার সাথে যৌথভাবে কাজ করি।",
          },
        ],
      },
      missionVision: {
        tag: "CORE FOUNDATION",
        tagBn: "মূল ভিত্তি",
        title: "MISSION &",
        titleBn: "লক্ষ্য ও",
        accent: "VISION.",
        accentBn: "উদ্দেশ্য।",
        subtitle:
          "Guiding the future of clean energy handling and incident-free LPG adoption.",
        subtitleBn:
          "পরিচ্ছন্ন জ্বালানি ও দুর্ঘটনা-মুক্ত এলপিজি ব্যবহারের ভবিষ্যৎ রূপরেখা।",
        missionBadge: "OUR MISSION",
        missionBadgeBn: "আমাদের লক্ষ্য",
        missionHead: "Mission",
        missionHeadBn: "মিশন",
        mission:
          "To promote LPG safety awareness and best practices through education, training, information sharing and collaboration, ensuring the protection of lives, property and the environment across Bangladesh.",
        missionBn:
          "শিক্ষা, প্রশিক্ষণ, তথ্য বিনিময় এবং পারস্পরিক সহযোগিতার মাধ্যমে সমগ্র বাংলাদেশে এলপিজি নিরাপত্তার সঠিক মানদণ্ড প্রচার করা এবং জীবন, সম্পদ ও পরিবেশ রক্ষা করা।",
        visionBadge: "OUR VISION",
        visionBadgeBn: "আমাদের ভিশন",
        visionHead: "Vision",
        visionHeadBn: "ভিশন",
        vision:
          "To be the leading platform for LPG safety and awareness in Bangladesh, contributing to a sustainable, safe and responsible energy future for all consumers and industrial users.",
        visionBn:
          "বাংলাদেশে এলপিজি নিরাপত্তা ও সচেতনতার ক্ষেত্রে শীর্ষস্থানীয় প্ল্যাটফর্ম হওয়া, যা সকল ভোক্তা ও শিল্পের জন্য একটি টেকসই, নিরাপদ ও দায়িত্বশীল জ্বালানি ভবিষ্যৎ নিশ্চিত করবে।",
      },
      expertTrainers: {
        tag: "CONSULTATION POOL",
        tagBn: "পরামর্শক প্যানেল",
        title: "EXPERT TRAINERS",
        titleBn: "প্রশিক্ষকবৃন্দ",
        subtitle:
          "Our courses are designed and delivered by veteran explosive engineers, DoE consultants, and fire prevention specialists.",
        subtitleBn:
          "আমাদের কোর্সসমূহ বিস্ফোরক বিশেষজ্ঞ প্রকৌশলী এবং ফায়ার সার্ভিসের অভিজ্ঞ অফিসারদের দ্বারা পরিচালিত।",
        trainers: [
          {
            name: "Engr. Md. Shafiqul Islam",
            nameBn: "ইঞ্জি. মোঃ শফিকুল ইসলাম",
            role: "Safety & Risk Management",
            roleBn: "নিরাপত্তা ও ঝুঁকি ব্যবস্থাপনা",
            bio: "25+ years in LPG safety protocols, risk assessment and hazard mitigation.",
            bioBn: "এলপিজি নিরাপত্তা প্রোটোকল, ঝুঁকি নিরূপণ ও প্রশমনে ২৫+ বছরের অভিজ্ঞতা।",
            imageUrl:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
          },
          {
            name: "Mst. Nusrat Jahan",
            nameBn: "মোছাঃ নুসরাত জাহান",
            role: "Environment & Compliance",
            roleBn: "পরিবেশ ও নিয়ন্ত্রক কমপ্লায়েন্স",
            bio: "Specialist in environmental compliance, national regulations and energy safety.",
            bioBn: "পরিবেশগত সম্মতি, জাতীয় নীতিমালা ও জ্বালানি নিরাপত্তা বিশেষজ্ঞ।",
            imageUrl:
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
          },
          {
            name: "Engr. A. K. M. Rakib",
            nameBn: "ইঞ্জি. এ. কে. এম. রাকিব",
            role: "LPG Operations Specialist",
            roleBn: "এলপিজি অপারেশন বিশেষজ্ঞ",
            bio: "15+ years in plant operations, maintenance engineering and process safety.",
            bioBn: "প্ল্যান্ট পরিচালনা, রক্ষণাবেক্ষণ প্রকৌশল ও প্রক্রিয়া নিরাপত্তায় ১৫+ বছরের অভিজ্ঞতা।",
            imageUrl:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
          },
          {
            name: "Md. Kamrul Hasan",
            nameBn: "মোঃ কামরুল হাসান",
            role: "Fire & Emergency Expert",
            roleBn: "অগ্নি ও জরুরি সেবা বিশেষজ্ঞ",
            bio: "Specialist in fire safety standards, rapid emergency response and investigation.",
            bioBn: "অগ্নি নিরাপত্তা মানদণ্ড, দ্রুত জরুরি সাড়া ও তদন্ত বিশেষজ্ঞ।",
            imageUrl:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
          },
          {
            name: "Dr. Tanvir Ahmed",
            nameBn: "ড. তানভীর আহমেদ",
            role: "Training & Development",
            roleBn: "প্রশিক্ষণ ও উন্নয়ন বিশেষজ্ঞ",
            bio: "10+ years in technical curriculum design, safety drills and capacity development.",
            bioBn: "প্রযুক্তিগত পাঠ্যক্রম প্রণয়ন, নিরাপত্তা মহড়া ও সক্ষমতা বৃদ্ধিতে ১০+ বছরের অভিজ্ঞতা।",
            imageUrl:
              "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
          },
        ],
      },
      stats: {
        certifiedLearners: "25,000+",
        certifiedLearnersBn: "২৫,০০০+",
        certifiedLearnersLabel: "Certified Learners",
        certifiedLearnersLabelBn: "প্রত্যয়িত প্রশিক্ষণার্থী",
        districtsCovered: "64 Districts",
        districtsCoveredBn: "৬৪ জেলা",
        districtsCoveredLabel: "Districts Covered",
        districtsCoveredLabelBn: "দেশব্যাপী কভারেজ",
        incidentReduction: "92%",
        incidentReductionBn: "৯২%",
        incidentReductionLabel: "Risk Mitigation",
        incidentReductionLabelBn: "ঝুঁকি হ্রাস সূচক",
        partnerOrganizations: "15+",
        partnerOrganizationsBn: "১৫+",
        partnerOrganizationsLabel: "Partner Regulators",
        partnerOrganizationsLabelBn: "সহযোগী নিয়ন্ত্রক সংস্থা",
      },
    },
    isPublished: true,
  },
  {
    pageKey: "blogs",
    title: "Blogs",
    titleBn: "ব্লগ",
    banner: {
      type: "visual",
      title: "BLOG &",
      titleBn: "ব্লগ ও",
      accent: "INSIGHTS.",
      accentBn: "প্রবন্ধ।",
      description:
        "Stay updated with expert perspectives, safety guidelines, and market trends.",
      descriptionBn:
        "বাংলাদেশের এলপিজি খাতের বিশেষজ্ঞ মতামত ও নিরাপত্তা নির্দেশিকা।",
      imageSrc:
        "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=800&auto=format&fit=crop",
      imageAlt: "LPG Industry Insights",
      imageAltBn: "এলপিজি খাতের প্রবন্ধ",
    },
    isPublished: true,
  },
  {
    pageKey: "home",
    title: "Home",
    titleBn: "হোম",
    banner: {
      type: "visual",
      title: "SAFETY FIRST.",
      titleBn: "নিরাপত্তা সবার আগে।",
      accent: "AWARENESS ALWAYS.",
      accentBn: "সচেতনতা সর্বদা।",
      description:
        "Promoting nationwide LPG safety awareness across Bangladesh for consumers, dealers, and industries — ensuring a safer today and sustainable tomorrow.",
      descriptionBn:
        "ভোক্তা, ডিলার এবং শিল্পের জন্য সমগ্র বাংলাদেশে এলপিজি নিরাপত্তা সচেতনতা বৃদ্ধি — একটি নিরাপদ বর্তমান ও টেকসই ভবিষ্যৎ নিশ্চিতকরণে।",
      btnPrimaryText: "Explore Safety Guidelines",
      btnPrimaryTextBn: "নিরাপত্তা নির্দেশিকা দেখুন",
      btnPrimaryHref: "/safety-guidelines",
      btnSecondaryText: "Start Training & Quiz",
      btnSecondaryTextBn: "প্রশিক্ষণ ও কুইজ শুরু করুন",
      btnSecondaryHref: "/courses",
      slide1Src: "/lpg-hero.jpg",
      slide1Alt: "LPG Safety Storage Plant & Facilities",
      slide2Src:
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
      slide2Alt: "Industrial LPG Pipeline & Valve Safety Inspection",
      slide3Src:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
      slide3Alt: "LPG Energy Infrastructure and Quality Compliance",
    },
  },
  {
    pageKey: "terms",
    title: "Terms of Use",
    titleBn: "ব্যবহারের শর্তাবলী",
    banner: {
      type: "centered",
      icon: "scale",
      title: "TERMS OF",
      titleBn: "ব্যবহারের",
      accent: "SERVICE.",
      accentBn: "শর্তাবলী।",
      description:
        "Statutory conditions governing portal access, certification issuance, educational content utilization, and subscriber obligations.",
      descriptionBn:
        "সেইফ এলপিজি প্ল্যাটফর্ম ব্যবহার, সার্টিফিকেট ইস্যু এবং শিক্ষামূলক কনটেন্ট ব্যবহারের ক্ষেত্রে প্রযোজ্য নিয়মাবলী।",
    },
    contentHtml: `
<div>
  <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Last Revised: May 2024</p>
  <h3 class="text-lg font-bold text-slate-900 mb-2">1. Acceptance of Terms</h3>
  <p class="mb-6 leading-relaxed">By accessing, browsing, or enrolling in any course provided on the Safe LPG platform, you agree to be legally bound by these Terms of Service, the Explosives Act 1884, Gas Cylinder Rules 1991 (amended 2004), and BERC statutory notifications. If you do not agree with any provision, you must discontinue platform use immediately.</p>

  <h3 class="text-lg font-bold text-slate-900 mb-2">2. Certificate Validity & Ethical Conduct</h3>
  <p class="mb-3 leading-relaxed">Certificates of completion are issued strictly based on individual learner engagement and successful attainment of an 80% threshold in official assessment quizzes. The following behaviors constitute grounds for immediate certificate revocation and referral to regulatory authorities:</p>
  <ul class="list-disc pl-5 space-y-2 mb-6 text-slate-700">
    <li>Submitting fraudulent identity documents during registration.</li>
    <li>Attempting to forge, falsify, or replicate digital verification QR codes.</li>
    <li>Unauthorized commercial redistribution or resale of LMS lecture videos and technical safety guides.</li>
  </ul>

  <h3 class="text-lg font-bold text-slate-900 mb-2">3. Operational Safety & Emergency Disclaimer</h3>
  <p class="mb-6 leading-relaxed">While our guidelines reflect current best practices and national engineering codes, training completion does not substitute for on-site statutory inspections conducted by the Department of Explosives (DoE) or Fire Service & Civil Defense. In active gas leak emergencies, prioritize human life, evacuate immediately, and dial emergency telephone 16137.</p>

  <h3 class="text-lg font-bold text-slate-900 mb-2">4. Subscription Billing & Refunds</h3>
  <p class="leading-relaxed">Subscriptions for commercial dealer portals or household plus features are billed in advance on a monthly or annual recurring basis. Unused periods are refundable within 7 days of initial purchase provided no formal certification has been generated or issued.</p>
</div>
    `.trim(),
    contentHtmlBn: `
<div>
  <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">সর্বশেষ সংস্করণ: মে ২০২৪</p>
  <h3 class="text-lg font-bold text-slate-900 mb-2">১. শর্তাবলী গ্রহণ</h3>
  <p class="mb-6 leading-relaxed">সেইফ এলপিজি প্ল্যাটফর্মে প্রবেশ, ব্রাউজ করা বা যেকোনো কোর্সে নথিভুক্ত করার মাধ্যমে আপনি এই ব্যবহারের শর্তাবলী, বিস্ফোরক আইন ১৮৮৪, গ্যাস সিলিন্ডার বিধিমালা ১৯৯১ (সংশোধিত ২০০৪) এবং বিইআরসি সংবিধিবদ্ধ বিজ্ঞপ্তির দ্বারা আইনত বাধ্য হতে সম্মত হচ্ছেন। আপনি কোনো বিধানের সাথে সম্মত না হলে অবিলম্বে প্ল্যাটফর্ম ব্যবহার বন্ধ করতে হবে।</p>

  <h3 class="text-lg font-bold text-slate-900 mb-2">২. সনদের বৈধতা ও নৈতিক আচরণ</h3>
  <p class="mb-3 leading-relaxed">কোর্স সমাপ্তির সনদ কঠোরভাবে প্রতিটি শিক্ষার্থীর নিজস্ব অংশগ্রহণ এবং অফিসিয়াল মূল্যায়ন কুইজে ন্যূনতম ৮০% নম্বর অর্জনের ভিত্তিতে প্রদান করা হয়। নিম্নলিখিত আচরণগুলো সনদপত্র তাৎক্ষণিক বাতিল এবং নিয়ন্ত্রক কর্তৃপক্ষের কাছে প্রেরণের কারণ হিসেবে বিবেচিত হবে:</p>
  <ul class="list-disc pl-5 space-y-2 mb-6 text-slate-700">
    <li>নিবন্ধনের সময় মিথ্যা বা জাল পরিচয় নথি জমা দেওয়া।</li>
    <li>ডিজিটাল যাচাইকরণ কিউআর কোড জালিয়াতি, পরিবর্তন বা অনুলিপি করার অপচেষ্টা।</li>
    <li>এলএমএস লেকচার ভিডিও এবং প্রযুক্তিগত নির্দেশিকা অননুমোদিত বাণিজ্যিক পুনঃবিতরণ বা বিক্রয়।</li>
  </ul>

  <h3 class="text-lg font-bold text-slate-900 mb-2">৩. পরিচালন নিরাপত্তা ও জরুরি অস্বীকৃতি</h3>
  <p class="mb-6 leading-relaxed">আমাদের নির্দেশিকাসমূহ বর্তমান প্রকৌশল নীতি ও জাতীয় মান অনুসরণ করে তৈরি হলেও, এই প্রশিক্ষণ বিস্ফোরক অধিদপ্তর (DoE) বা ফায়ার সার্ভিস ও সিভিল ডিফেন্সের সংবিধিবদ্ধ পরিদর্শন বা লাইসেন্সের বিকল্প নয়। সক্রিয় গ্যাস লিকেজ বা অগ্নিকাণ্ডে সর্বদা মানুষের জীবন রক্ষাকে অগ্রাধিকার দিয়ে অবিলম্বে নিরাপদ স্থানে সরে যান এবং জাতীয় জরুরি হেল্পলাইন ১৬১৩৭-এ কল করুন।</p>

  <h3 class="text-lg font-bold text-slate-900 mb-2">৪. সাবস্ক্রিপশন বিলিং ও রিফান্ড নীতি</h3>
  <p class="leading-relaxed">বাণিজ্যিক ডিলার পোর্টাল বা প্রিমিয়াম সাবস্ক্রিপশনের পেমেন্ট অগ্রিম মাসিক বা বার্ষিক ভিত্তিতে গৃহীত হয়। কোনো প্রাতিষ্ঠানিক সনদ ইস্যু না হয়ে থাকলে প্রাথমিক ক্রয়ের ৭ দিনের মধ্যে রিফান্ডের আবেদন করা যাবে।</p>
</div>
    `.trim(),
  },
  {
    pageKey: "privacy",
    title: "Privacy Policy",
    titleBn: "গোপনীয়তা নীতিমালা",
    banner: {
      type: "centered",
      icon: "lock",
      title: "PRIVACY",
      titleBn: "গোপনীয়তা",
      accent: "POLICY.",
      accentBn: "নীতিমালা।",
      description:
        "How Safe LPG collects, stores, and safeguards personal training records, certification credentials, and incident reports in accordance with statutory digital standards.",
      descriptionBn:
        "সেইফ এলপিজি কীভাবে ব্যক্তিগত প্রশিক্ষণের রেকর্ড, সার্টিফিকেট এবং দুর্ঘটনা সংক্রান্ত তথ্য নিরাপদে সংরক্ষণ ও পরিচালনা করে।",
    },
    contentHtml: `
<div>
  <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Effective Date: May 1, 2024</p>
  <h3 class="text-lg font-bold text-slate-900 mb-2">1. Information We Collect</h3>
  <p class="mb-3 leading-relaxed">We collect information to facilitate certified LPG safety education, maintain national incident registries, and authenticate regulatory dealer licenses:</p>
  <ul class="list-disc pl-5 space-y-2 mb-6 text-slate-700">
    <li><strong>Learner Account Information:</strong> Full name, national identity/passport reference, mobile number, email address, and institutional or dealership affiliation.</li>
    <li><strong>Academic & Assessment Records:</strong> Video lesson completion timestamps, quiz scores, certificate verification hashes, and badge issuances.</li>
    <li><strong>Incident & Technical Inquiries:</strong> Geographical coordinates, eyewitness reports, media attachments, and emergency logs submitted to the national incident registry.</li>
  </ul>

  <h3 class="text-lg font-bold text-slate-900 mb-2">2. How We Use Collected Data</h3>
  <p class="mb-3 leading-relaxed">Data collected is strictly utilized for educational verification and statutory safety monitoring:</p>
  <ul class="list-disc pl-5 space-y-2 mb-6 text-slate-700">
    <li>Issuing verifiable QR-coded certificates recognized by DoE and LOAB.</li>
    <li>Transmitting emergency safety bulletins and BERC price adjustment SMS notifications.</li>
    <li>Conducting anonymized epidemiological safety research to reduce cylinder-related fire incidents.</li>
    <li>We never sell or rent personal contact details to third-party commercial advertisers.</li>
  </ul>

  <h3 class="text-lg font-bold text-slate-900 mb-2">3. Data Security & Encryption</h3>
  <p class="mb-6 leading-relaxed">All interactions between your browser and our servers are encrypted via Transport Layer Security (TLS 1.3 / 256-bit SSL). Payment gateway interactions through bKash, Nagad, and partner acquiring banks are processed through PCI-DSS Level 1 compliant secure tokenization.</p>

  <h3 class="text-lg font-bold text-slate-900 mb-2">4. Contact the Data Protection Officer</h3>
  <p class="mb-3 leading-relaxed">For questions regarding privacy, deletion of account data, or regulatory data sharing requests, contact:</p>
  <div class="rounded-lg bg-slate-50 p-4 border border-slate-200/70 text-xs">
    <strong>Data Privacy & Compliance Cell</strong><br />
    Safe LPG Platform, House # 13, Road # 13, Sector # 03, Uttara, Dhaka-1230<br />
    Email: <span class="text-primary font-medium">privacy@lpgsafety.org.bd</span> | Phone: +880 1812-345678
  </div>
</div>
    `.trim(),
    contentHtmlBn: `
<div>
  <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">কার্যকর তারিখ: ১ মে, ২০২৪</p>
  <h3 class="text-lg font-bold text-slate-900 mb-2">১. যেসকল তথ্য আমরা সংগ্রহ করি</h3>
  <p class="mb-3 leading-relaxed">প্রত্যয়িত এলপিজি নিরাপত্তা শিক্ষা প্রদান, জাতীয় দুর্ঘটনা রেজিস্ট্রি সংরক্ষণ এবং সংবিধিবদ্ধ ডিলার লাইসেন্স যাচাইকরণের সুবিধার্থে আমরা প্রয়োজনীয় তথ্য সংগ্রহ করি:</p>
  <ul class="list-disc pl-5 space-y-2 mb-6 text-slate-700">
    <li><strong>শিক্ষার্থীর অ্যাকাউন্ট তথ্য:</strong> পূর্ণ নাম, জাতীয় পরিচয়পত্র/পাসপোর্ট রেফারেন্স, মোবাইল নম্বর, ইমেইল ঠিকানা এবং প্রাতিষ্ঠানিক বা ডিলারশিপের নাম।</li>
    <li><strong>একাডেমিক ও মূল্যায়ন রেকর্ড:</strong> ভিডিও পাঠ সমাপ্তির টাইমস্ট্যাম্প, কুইজ স্কোর, ডিজিটাল সার্টিফিকেট যাচাইকরণ হ্যাশ এবং ব্যাজ ইস্যু তথ্য।</li>
    <li><strong>দুর্ঘটনা ও কারিগরি তদন্ত তথ্য:</strong> ভৌগোলিক স্থানাঙ্ক, প্রত্যক্ষদর্শীর বিবরণ, ছবি/ভিডিও সংযুক্তি এবং জাতীয় দুর্ঘটনা রেজিস্ট্রিতে প্রেরিত জরুরি লগ।</li>
  </ul>

  <h3 class="text-lg font-bold text-slate-900 mb-2">২. সংগৃহীত তথ্যের ব্যবহার</h3>
  <p class="mb-3 leading-relaxed">সংগৃহীত তথ্য কঠোরভাবে শিক্ষামূলক যাচাইকরণ এবং সংবিধিবদ্ধ জাতীয় নিরাপত্তা পর্যবেক্ষণের জন্য ব্যবহৃত হয়:</p>
  <ul class="list-disc pl-5 space-y-2 mb-6 text-slate-700">
    <li>বিস্ফোরক অধিদপ্তর (DoE) ও এলওএবি স্বীকৃত কিউআর-কোডযুক্ত যাচাইযোগ্য ডিজিটাল সার্টিফিকেট ইস্যু করা।</li>
    <li>জরুরি নিরাপত্তা বুলেটিন এবং বিইআরসি মাসিক মূল্য সমন্বয়ের এসএমএস নোটিফিকেশন প্রদান করা।</li>
    <li>সিলিন্ডারজনিত অগ্নিকাণ্ড হ্রাসে গবেষণামূলক পরিসংখ্যান পরিচালনা করা।</li>
    <li>আমরা কখনোই কোনো বাণিজ্যিক বিজ্ঞাপনদাতার কাছে ব্যবহারকারীর ব্যক্তিগত যোগাযোগের তথ্য বিক্রয় বা ভাড়া দেই না।</li>
  </ul>

  <h3 class="text-lg font-bold text-slate-900 mb-2">৩. তথ্য নিরাপত্তা ও এনক্রিপশন</h3>
  <p class="mb-6 leading-relaxed">আপনার ব্রাউজার এবং আমাদের সার্ভারের মধ্যকার সমস্ত যোগাযোগ ট্রান্সপোর্ট লেয়ার সিকিউরিটি (TLS 1.3 / ২৫৬-বিট এসএসএল) দ্বারা এনক্রিপ্ট করা। বিকাশ, নগদ এবং অংশীদার ব্যাংকের পেমেন্ট গেটওয়েগুলো পিসিআই-ডিএসএস লেভেল ১ কমপ্লায়েন্ট নিরাপদ টোকেনাইজেশনের মাধ্যমে পরিচালিত হয়।</p>

  <h3 class="text-lg font-bold text-slate-900 mb-2">৪. ডেটা সুরক্ষা কর্মকর্তার সাথে যোগাযোগ</h3>
  <p class="mb-3 leading-relaxed">গোপনীয়তা, অ্যাকাউন্ট তথ্য মুছে ফেলা বা নিয়ন্ত্রক সংস্থা সংক্রান্ত অনুসন্ধানের জন্য যোগাযোগ করুন:</p>
  <div class="rounded-lg bg-slate-50 p-4 border border-slate-200/70 text-xs">
    <strong>তথ্য গোপনীয়তা ও কমপ্লায়েন্স সেল</strong><br />
    সেইফ এলপিজি প্ল্যাটফর্ম, বাড়ি # ১৩, রোড # ১৩, সেক্টর # ০৩, উত্তরা, ঢাকা-১২৩০<br />
    Email: <span class="text-primary font-medium">privacy@lpgsafety.org.bd</span> | Phone: +880 1812-345678
  </div>
</div>
    `.trim(),
  },
  {
    pageKey: "acts-and-rules",
    title: "Acts & Rules",
    titleBn: "আইন ও বিধিমালা",
    banner: {
      type: "centered",
      icon: "scale",
      title: "ACTS &",
      titleBn: "আইন ও",
      accent: "RULES.",
      accentBn: "বিধিমালা।",
      description:
        "Official legal gazettes, petroleum acts, explosives regulations, and ministerial directives governing the Liquefied Petroleum Gas (LPG) sector in Bangladesh.",
      descriptionBn:
        "বাংলাদেশে তরলীকৃত পেট্রোলিয়াম গ্যাস (এলপিজি) খাত পরিচালনাকারী সরকারি গেজেট, আইন, বিধিমালা এবং মন্ত্রণালয়ের নির্দেশনা।",
    },
    contentHtml: `
<div>
  <h3 class="text-lg font-bold text-slate-900 mb-2">Statutory Legal Framework Governing LPG Operations in Bangladesh</h3>
  <p class="mb-4 leading-relaxed">The downstream Liquefied Petroleum Gas (LPG) industry in Bangladesh is governed by a robust framework of parliamentary acts, ministerial statutory regulatory orders (SROs), and standards established by the <strong>Department of Explosives (DoE)</strong>, <strong>Bangladesh Energy Regulatory Commission (BERC)</strong>, and the <strong>Bangladesh Fire Service and Civil Defence (BFSCD)</strong>.</p>
  <p class="leading-relaxed">Key legislation mandates that every operator—from international import terminals to regional distributors and retail point-of-sale shopkeepers—maintains verified licensing, calibrated pressure testing certificates, and standard operating procedures (SOPs) compliant with the <em>LPG (Operational) Rules 2004</em> and the <em>Petroleum Act 2016</em>.</p>
</div>
    `.trim(),
    contentHtmlBn: `
<div>
  <h3 class="text-lg font-bold text-slate-900 mb-2">বাংলাদেশে এলপিজি পরিচালনা সংক্রান্ত সংবিধিবদ্ধ আইনি কাঠামো</h3>
  <p class="mb-4 leading-relaxed">বাংলাদেশে তরলীকৃত পেট্রোলিয়াম গ্যাস (এলপিজি) ডাউনস্ট্রিম খাত পরিচালিত হয় জাতীয় সংসদীয় আইন, মন্ত্রণালয়ের এসআরও এবং <strong>বিস্ফোরক পরিদপ্তর (ডিওই)</strong>, <strong>বিইআরসি</strong> এবং <strong>ফায়ার সার্ভিস ও সিভিল ডিফেন্স</strong> কর্তৃক প্রণীত বিধিমালার মাধ্যমে।</p>
  <p class="leading-relaxed">সকল আমদানিকারক, প্ল্যান্ট অপারেটর ও ডিলারকে <em>এলপিজি (পরিচালন) বিধিমালা ২০০৪</em> এবং <em>পেট্রোলিয়াম আইন ২০১৬</em> অনুসারে বৈধ লাইসেন্স ও নিরাপত্তা সরঞ্জাম নিশ্চিত করতে হবে।</p>
</div>
    `.trim(),
    sections: {
      gazettes: [
        {
          id: "act-1",
          title: "The Explosives Act, 1884 (Act No. IV of 1884)",
          titleBn: "দ্য এক্সপ্লোসিভস অ্যাক্ট, ১৮৮৪ (১৮৮৪ সালের ৪ নম্বর আইন)",
          subtitle: "Principal statutory foundation for manufacture, possession, and transport of compressed gas",
          subtitleBn: "সংকুচিত ও তরলীকৃত গ্যাস উৎপাদন, সংরক্ষণ ও পরিবহনের মূল সংবিধিবদ্ধ আইন",
          category: "Explosives Rules",
          categoryBn: "বিস্ফোরক বিধিমালা",
          authority: "Department of Explosives (Ministry of Power & Energy)",
          authorityBn: "বিস্ফোরক পরিদপ্তর (বিদ্যুৎ ও জ্বালানি মন্ত্রণালয়)",
          gazetteRef: "Law Ministry Gazette Vol. 4",
          year: "1884 (Amended 2018)",
          yearBn: "১৮৮৪ (সংশোধিত ২০১৮)",
          fileSize: "2.8 MB",
          fileUrl: "/gazettes/explosives-act-1884.pdf",
        },
        {
          id: "act-2",
          title: "The Gas Cylinder Rules, 1991 (With 2004 Amendments)",
          titleBn: "গ্যাস সিলিন্ডার বিধিমালা, ১৯৯১ (২০০৪ সংশোধনী সহ)",
          subtitle: "Detailed statutory rules on cylinder thickness, hydro-testing, valves, and manifold safety",
          subtitleBn: "সিলিন্ডারের পুরুত্ব, হাইড্রো-টেস্টিং, ভালভ ও ম্যানিফোল্ড নিরাপত্তার বিস্তারিত সংবিধিবদ্ধ বিধিমালা",
          category: "Gas Rules",
          categoryBn: "গ্যাস বিধিমালা",
          authority: "Chief Inspector of Explosives",
          authorityBn: "প্রধান বিস্ফোরক পরিদর্শক",
          gazetteRef: "S.R.O. No. 128-Law/2004",
          year: "1991 (Amended 2004)",
          yearBn: "১৯৯১ (সংশোধিত ২০০৪)",
          fileSize: "4.1 MB",
          fileUrl: "/gazettes/gas-cylinder-rules-1991.pdf",
        },
        {
          id: "act-3",
          title: "Bangladesh Energy Regulatory Commission Act, 2003",
          titleBn: "বাংলাদেশ এনার্জি রেগুলেটরি কমিশন আইন, ২০০৩",
          subtitle: "Mandating BERC for tariff fixing, consumer pricing, fair competition, and licensing",
          subtitleBn: "শুল্ক নির্ধারণ, ভোক্তা মূল্য নিয়ন্ত্রণ, ন্যায্য প্রতিযোগিতা ও লাইসেন্স প্রদানের সংবিধিবদ্ধ আইন",
          category: "BERC Regulations",
          categoryBn: "বিইআরসি প্রবিধান",
          authority: "Bangladesh Energy Regulatory Commission (BERC)",
          authorityBn: "বাংলাদেশ এনার্জি রেগুলেটরি কমিশন (বিইআরসি)",
          gazetteRef: "Act No. 13 of 2003",
          year: "2003",
          yearBn: "২০০৩",
          fileSize: "3.2 MB",
          fileUrl: "/gazettes/berc-act-2003.pdf",
        },
        {
          id: "act-4",
          title: "Fire Prevention and Extinction Act, 2003",
          titleBn: "অগ্নি প্রতিরোধ ও নির্বাপণ আইন, ২০০৩",
          subtitle: "Statutory inspection requirements, emergency exits, and warehouse fire safety licenses",
          subtitleBn: "গুদাম ও রিফিলিং প্ল্যান্টে অগ্নিনির্বাপণ ব্যবস্থা, জরুরি বহির্গমন এবং ফায়ার লাইসেন্স নীতিমালা",
          category: "Fire Codes",
          categoryBn: "ফায়ার কোড",
          authority: "Fire Service & Civil Defence Directorate",
          authorityBn: "ফায়ার সার্ভিস ও সিভিল ডিফেন্স অধিদপ্তর",
          gazetteRef: "Act No. 7 of 2003",
          year: "2003",
          yearBn: "২০০৩",
          fileSize: "1.5 MB",
          fileUrl: "/gazettes/fire-act-2003.pdf",
        },
        {
          id: "act-5",
          title: "The Petroleum Act, 2016 (Act No. XXVII of 2016)",
          titleBn: "পেট্রোলিয়াম আইন, ২০১৬ (২০১৬ সনের ২৭ নং আইন)",
          subtitle: "Governing import, transport, storage, and refining of petroleum and hazardous hydrocarbons",
          subtitleBn: "হাইড্রোকার্বন ও জ্বালানির আমদানি, পাইপলাইন পরিবহন এবং শোধনাগার লাইসেন্স সংক্রান্ত আইন",
          category: "Petroleum Act",
          categoryBn: "পেট্রোলিয়াম আইন",
          authority: "Ministry of Power, Energy and Mineral Resources",
          authorityBn: "বিদ্যুৎ, জ্বালানি ও খনিজ সম্পদ মন্ত্রণালয়",
          gazetteRef: "Bangladesh Gazette No. XXVII",
          year: "2016",
          yearBn: "২০১৬",
          fileSize: "1.9 MB",
          fileUrl: "/gazettes/petroleum-act-2016.pdf",
        },
        {
          id: "act-6",
          title: "BSTI BDS 1499:2018 Standard for LPG Steel Cylinders",
          titleBn: "বিএসটিআই বিডিএস ১৪৯৯:২০১৮ এলপিজি স্টিল সিলিন্ডার স্ট্যান্ডার্ড",
          subtitle: "Material specifications, longitudinal welds, and burst pressure testing benchmarks",
          subtitleBn: "কাঁচামালের স্পেসিফিকেশন, অনুদৈর্ঘ্য ওয়েল্ডিং এবং বিস্ফোরণ চাপ পরীক্ষার মানদণ্ড",
          category: "BSTI Standards",
          categoryBn: "বিএসটিআই মানদণ্ড",
          authority: "Bangladesh Standards and Testing Institution",
          authorityBn: "বাংলাদেশ স্ট্যান্ডার্ডস অ্যান্ড টেস্টিং ইনস্টিটিউশন (বিএসটিআই)",
          gazetteRef: "BDS 1499:2018",
          year: "2018",
          yearBn: "২০১৮",
          fileSize: "3.7 MB",
          fileUrl: "/gazettes/bsti-bds-1499.pdf",
        },
      ],
    },
  },
  {
    pageKey: "faq",
    title: "FAQ & Help Center",
    titleBn: "সাধারণ জিজ্ঞাসা ও সহায়তা",
    banner: {
      type: "centered",
      icon: "help",
      title: "FREQUENTLY ASKED",
      titleBn: "সাধারণ",
      accent: "QUESTIONS.",
      accentBn: "জিজ্ঞাসা।",
      description:
        "Clear, authoritative guidance on LPG household handling, regulator maintenance, commercial compliance, and emergency protocols.",
      descriptionBn:
        "বাসাবাড়িতে এলপিজি সিলিন্ডার ব্যবহার, রেগুলেটর রক্ষণাবেক্ষণ, ডিলার কমপ্লায়েন্স এবং জরুরি প্রোটোকল সম্পর্কিত নির্ভরযোগ্য পরামর্শ।",
    },
    sections: {
      faqItems: [
        {
          id: "faq-1",
          category: "General Safety",
          categoryBn: "সাধারণ নিরাপত্তা",
          question: "What should I do immediately if I smell gas in my home?",
          questionBn: "বাসাবাড়িতে গ্যাসের গন্ধ পেলে তাৎক্ষণিকভাবে আমার কী করা উচিত?",
          answer: "1. Immediately turn OFF the cylinder regulator knob.\n2. Extinguish all open flames (such as mosquito coils or candles).\n3. Open all windows and exterior doors to ensure cross-ventilation.\n4. DO NOT turn any electrical light switches or exhaust fans ON or OFF, as electrical contact sparks can ignite the air-gas mixture.\n5. If the smell persists, evacuate the premises and call the 24/7 Emergency Support Hotline at 16137 from a safe distance outside.",
          answerBn: "১. তাৎক্ষণিকভাবে সিলিন্ডার রেগুলেটরের নব বন্ধ (OFF) করুন।\n২. সকল প্রকার খোলা আগুন (যেমন মশার কয়েল বা মোমবাতি) নিভিয়ে ফেলুন।\n৩. পর্যাপ্ত আলো-বাতাস চলাচলের জন্য ঘরের সমস্ত জানালা ও বাইরের দরজা খুলে দিন।\n৪. কোনো বৈদ্যুতিক সুইচ বা ফ্যান চালু কিংবা বন্ধ করবেন না, কারণ সুইচের স্পার্ক থেকে গ্যাস বিস্ফোরিত হতে পারে।\n৫. গন্ধ দূর না হলে অবিলম্বে ঘর থেকে নিরাপদ দূরত্বে বের হয়ে আসুন এবং জরুরি হেল্পলাইন ১৬১৩৭ নম্বরে কল করুন।",
        },
        {
          id: "faq-2",
          category: "Cylinders & Regulators",
          categoryBn: "সিলিন্ডার ও রেগুলেটর",
          question: "How do I perform a soap-solution leak test at home?",
          questionBn: "বাসায় সাবান-পানির সাহায্যে কীভাবে নিরাপদ লিক পরীক্ষা করবেন?",
          answer: "Mix regular liquid dishwashing soap with water to produce rich foam. Using a sponge or soft brush, apply the soapy water generously over the cylinder valve neck, the regulator connection joint, and both ends of the rubber hose clamps. If growing bubbles appear, a leak is present. Close the valve immediately and replace the defective O-ring, regulator, or hose. Never use a flame or matchstick!",
          answerBn: "লিকুইড ডিশওয়াশ বা সাবানের সাথে পানি মিশিয়ে ঘন ফেনা তৈরি করুন। একটি স্পঞ্জ দিয়ে সিলিন্ডারের ভালভ, রেগুলেটরের সংযোগস্থল এবং গ্যাস হোস পাইপের উভয় মাথায় ফেনা লাগান। যদি বুদবুদ উঠতে দেখা যায় তবে বুঝবেন গ্যাস লিক হচ্ছে। তাৎক্ষণিকভাবে রেগুলেটর বন্ধ করুন এবং ত্রুটিপূর্ণ ও-রিং বা পাইপ পরিবর্তন করুন। কখনোই দিয়াশলাই বা আগুন দিয়ে পরীক্ষা করবেন না!",
        },
        {
          id: "faq-3",
          category: "Cylinders & Regulators",
          categoryBn: "সিলিন্ডার ও রেগুলেটর",
          question: "How often should I replace the domestic LPG flexible rubber hose?",
          questionBn: "গৃহস্থালীর এলপিজি গ্যাস হোস পাইপ কতদিন পর পর পরিবর্তন করা উচিত?",
          answer: "According to national safety standards (BDS 1499), flexible reinforced LPG rubber hoses must be inspected monthly and mandatorily replaced every 2 years—or sooner if signs of surface hardening, pinhole cracking, or discoloration are observed.",
          answerBn: "জাতীয় মানদণ্ড (বিডিএস ১৪৯৯) অনুযায়ী, উচ্চচাপ সহনশীল গ্যাস পাইপ প্রতি মাসে একবার পর্যবেক্ষণ করা উচিত এবং প্রতি ২ বছর পর পর অথবা ফাটা ও শক্ত হয়ে যাওয়ার সাথে সাথে পরিবর্তন করা বাধ্যতামূলক।",
        },
        {
          id: "faq-4",
          category: "General Safety",
          categoryBn: "সাধারণ নিরাপত্তা",
          question: "Can I store an LPG cylinder horizontally under my sink?",
          questionBn: "সিলিন্ডার কি অনুভূমিকভাবে (কাত করে) রাখা যাবে?",
          answer: "No. LPG cylinders must always be kept strictly vertical and upright on a firm, level floor. Storing a cylinder horizontally forces liquid LPG into the regulator, creating extremely high pressure that can rupture appliances or cause uncontrollable liquid flame flares.",
          answerBn: "না। এলপিজি সিলিন্ডার সর্বদা সমতল মেঝেতে খাড়া অবস্থায় সোজা রাখতে হবে। সিলিন্ডার কাত বা উল্টো করে রাখলে তরল গ্যাস সরাসরি রেগুলেটরে চলে গিয়ে মারাত্মক বিস্ফোরণ বা অনিয়ন্ত্রিত অগ্নিকাণ্ডের ঝুঁকি তৈরি করে।",
        },
        {
          id: "faq-5",
          category: "Auto Gas Stations",
          categoryBn: "অটোগ্যাস স্টেশন",
          question: "What are the key safety protocols during auto-gas refueling?",
          questionBn: "অটোগ্যাস নেওয়ার সময় প্রধান নিরাপত্তা সতর্কতা কী কী?",
          answer: "During vehicle refueling at auto gas stations: All passengers must disembark, vehicle engine and mobile phones must be switched OFF, smoking is strictly forbidden within 15 meters, and dispenser nozzles must remain locked until the dispensing cycle is terminated by the certified operator.",
          answerBn: "অটোগ্যাস নেওয়ার সময়: গাড়ির সব যাত্রীকে নেমে যেতে হবে, গাড়ির ইঞ্জিন ও মোবাইল ফোন বন্ধ রাখতে হবে, ১৫ মিটারের মধ্যে ধূমপান সম্পূর্ণ নিষিদ্ধ এবং সার্টিফাইড অপারেটর নোজল লক না করা পর্যন্ত জ্বালানি গ্রহণ বন্ধ রাখতে হবে।",
        },
        {
          id: "faq-6",
          category: "Dealers & Licensing",
          categoryBn: "ডিলার ও লাইসেন্স",
          question: "What licenses are mandatory to operate an LPG retail point in Bangladesh?",
          questionBn: "বাংলাদেশে এলপিজি রিটেল ব্যবসা পরিচালনার জন্য কী কী লাইসেন্স প্রয়োজন?",
          answer: "A retail dealer must possess: 1. Department of Explosives (DoE) Storage License. 2. Fire Service & Civil Defense Fire Safety Clearance (NOC). 3. Trade License from the local Municipality/Union Parishad. 4. Dealership appointment agreement with a licensed LOAB primary operator.",
          answerBn: "একজন খুচরা ব্যবসায়ীর থাকতে হবে: ১. বিস্ফোরক পরিদপ্তরের (DoE) লাইসেন্স। ২. ফায়ার সার্ভিসের ফায়ার সেফটি লাইসেন্স (অনাপত্তিপত্র)। ৩. স্থানীয় পৌরসভা বা ইউনিয়ন পরিষদের ট্রেড লাইসেন্স। ৪. অনুমোদিত কোম্পানির সাথে পরিবেশক বা ডিলার চুক্তিপত্র।",
        },
        {
          id: "faq-7",
          category: "Certificates & LMS",
          categoryBn: "সার্টিফিকেট ও প্রশিক্ষণ",
          question: "Are the training certificates issued on this portal legally recognized?",
          questionBn: "এই পোর্টালে অর্জিত সনদ কি আনুষ্ঠানিকভাবে স্বীকৃত?",
          answer: "Yes. Certificates of completion issued through the Safe LPG digital LMS are co-authenticated under joint guidelines aligned with the Department of Explosives (DoE) and LOAB technical safety standards, verifiable instantly via unique digital QR validation.",
          answerBn: "হ্যাঁ। সেইফ এলপিজি এলএমএস-এর মাধ্যমে প্রদত্ত প্রতিটি সার্টিফিকেট বিস্ফোরক পরিদপ্তর ও লোয়াব নির্দেশিকার সাথে সামঞ্জস্যপূর্ণ এবং এতে থাকা ইউনিক কিউআর কোডের মাধ্যমে অনলাইনে তাৎক্ষণিক যাচাই করা যায়।",
        },
      ],
    },
  },
  {
    pageKey: "verify-certificate",
    title: "Verify Certificate",
    titleBn: "সার্টিফিকেট যাচাইকরণ",
    banner: {
      type: "centered",
      icon: "shield",
      title: "VERIFY",
      titleBn: "সার্টিফিকেট",
      accent: "CERTIFICATE.",
      accentBn: "যাচাইকরণ।",
      description:
        "Instant digital validation for all LPG Safety & Regulatory compliance certificates issued under Safe LPG, Department of Explosives (DoE), and LOAB joint programs.",
      descriptionBn:
        "সেইফ এলপিজি, বিস্ফোরক পরিদপ্তর (ডিওই) এবং লোয়াব-এর যৌথ কার্যক্রমে প্রদত্ত সকল নিরাপত্তা সার্টিফিকেটের তাৎক্ষণিক ডিজিটাল যাচাইকরণ।",
    },
  },
  {
    pageKey: "safety-guidelines",
    title: "Safety Guidelines",
    titleBn: "নিরাপত্তা নির্দেশিকা",
    banner: {
      type: "visual",
      title: "SAFETY",
      titleBn: "নিরাপত্তা",
      accent: "GUIDELINES.",
      accentBn: "নির্দেশিকা।",
      description:
        "Guidelines for safe handling, storage and use of LPG across all sectors. Compliant with BERC, Department of Explosives (DoE), and Fire Service regulations.",
      descriptionBn:
        "সকল সেক্টরে এলপিজির নিরাপদ হ্যান্ডলিং, মজুত এবং ব্যবহারের নির্দেশিকা। বিইআরসি, বিস্ফোরক পরিদপ্তর (ডিওই) এবং ফায়ার সার্ভিসের প্রবিধানের সাথে সামঞ্জস্যপূর্ণ।",
      imageSrc:
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop",
      imageAlt: "LPG Storage Tanks and Cylinders",
      imageAltBn: "এলপিজি স্টোরেজ ট্যাংক ও সিলিন্ডার",
    },
    sections: {
      standardsList: [
        { en: "ISO 14246: LPG Equipment & Cylinder Valves", bn: "আইএসও ১৪২৪৬: এলপিজি সরঞ্জাম ও সিলিন্ডার ভালভ" },
        { en: "EN 589: LPG Automotive Fuel Specifications", bn: "ইএন ৫৮৯: এলপিজি অটোমোটিভ ফুয়েল স্পেসিফিকেশন" },
        { en: "NFPA 58: Liquefied Petroleum Gas Code", bn: "এনএফপিএ ৫৮: লিকুইফাইড পেট্রোলিয়াম গ্যাস কোড" },
        { en: "OIML Standards for Dispenser Measurement", bn: "ওআইএমএল ডিসপেনসার মেজারমেন্ট স্ট্যান্ডার্ড" },
      ],
      regulatoryAgencies: [
        {
          id: "doe",
          name: "DoE",
          titleEn: "Department of Explosives",
          titleBn: "বিস্ফোরক পরিদপ্তর",
          descEn: "National regulatory authority under Ministry of Power & Energy.",
          descBn: "বিদ্যুৎ ও জ্বালানি মন্ত্রণালয়ের অধীনস্থ জাতীয় নিয়ন্ত্রক কর্তৃপক্ষ।",
          badgeBg: "bg-red-50 text-red-600 border-red-200",
          href: "https://explosives.gov.bd",
        },
        {
          id: "fire",
          name: "Civil Defense",
          titleEn: "Directorate General of Fire Service & Civil Defense",
          titleBn: "ফায়ার সার্ভিস ও সিভিল ডিফেন্স অধিদপ্তর",
          descEn: "Emergency fire codes, evacuation protocols and site inspections.",
          descBn: "জরুরি অগ্নিনির্বাপণ কোড, উদ্ধার প্রোটোকল এবং সাইট পরিদর্শন।",
          badgeBg: "bg-amber-50 text-amber-600 border-amber-200",
          href: "http://fireservice.gov.bd",
        },
        {
          id: "loab",
          name: "LOAB",
          titleEn: "LPG Operators Association of Bangladesh",
          titleBn: "এলপিজি অপারেটরস অ্যাসোসিয়েশন অব বাংলাদেশ",
          descEn: "Industry body representing nationwide licensed LPG operators.",
          descBn: "সারাদেশের লাইসেন্সপ্রাপ্ত এলপিজি অপারেটরদের প্রতিনিধিত্বকারী শিল্প ফোরাম।",
          badgeBg: "bg-emerald-50 text-emerald-600 border-emerald-200",
          href: "https://loab.com.bd",
        },
      ],
      documentDownloads: [
        {
          id: 1,
          nameEn: "LPG Handling & Storage Guidelines",
          nameBn: "এলপিজি হ্যান্ডলিং ও মজুত সংক্রান্ত নির্দেশিকা",
          targetTab: "all",
          type: "PDF",
          access: "Public",
          fileName: "lpg-handling-storage-guidelines.pdf",
        },
        {
          id: 2,
          nameEn: "Investor Safety Compliance & Industrial Plant Norms",
          nameBn: "বিনিয়োগকারী নিরাপত্তা কমপ্লায়েন্স ও শিল্প কারখানা নীতিমালা",
          targetTab: "investors",
          type: "PDF",
          access: "Login Required",
          fileName: "investor-plant-safety-manual.pdf",
        },
        {
          id: 3,
          nameEn: "Industrial LPG Installation Code & Pipe Specs",
          nameBn: "শিল্প এলপিজি ইনস্টলেশন কোড ও পাইপ স্পেসিফিকেশন",
          targetTab: "investors",
          type: "PDF",
          access: "Login Required",
          fileName: "industrial-lpg-installation-code.pdf",
        },
        {
          id: 4,
          nameEn: "LPG Cylinder Safety Tips (Customer Guide)",
          nameBn: "এলপিজি সিলিন্ডার নিরাপত্তা নির্দেশিকা (ভোক্তা গাইড)",
          targetTab: "customer",
          type: "PDF",
          access: "Public",
          fileName: "customer-lpg-safety-tips.pdf",
        },
        {
          id: 5,
          nameEn: "Emergency Response & Gas Leakage Protocols",
          nameBn: "জরুরি সাড়াদান ও গ্যাস লিক প্রোটোকল নির্দেশিকা",
          targetTab: "all",
          type: "PDF",
          access: "Login Required",
          fileName: "emergency-response-guidelines.pdf",
        },
        {
          id: 6,
          nameEn: "Bulk Road Tanker & Hauler Transport Standard",
          nameBn: "বাল্ক রোড ট্যাঙ্কার ও ট্রান্সপোর্ট স্ট্যান্ডার্ড নীতিমালা",
          targetTab: "distributor",
          type: "PDF",
          access: "Login Required",
          fileName: "distributor-transportation-code.pdf",
        },
        {
          id: 7,
          nameEn: "Dealer Warehouse Storage & Cylinder Inspection Norms",
          nameBn: "ডিলার গুদাম মজুত ও সিলিন্ডার পরিদর্শন ম্যানুয়াল",
          targetTab: "dealer",
          type: "PDF",
          access: "Public",
          fileName: "dealer-storage-inspection-norms.pdf",
        },
      ],
    },
  },
  {
    pageKey: "courses",
    title: "Training & Quiz",
    titleBn: "প্রশিক্ষণ ও কুইজ",
    banner: {
      type: "visual",
      title: "TRAINING &",
      titleBn: "প্রশিক্ষণ ও",
      accent: "QUIZ.",
      accentBn: "কুইজ।",
      description:
        "Industry-aligned LPG safety training for regular consumers, commercial dealers, and industrial operators. Learn at your own pace, take the quiz, and earn your verified certificate.",
      descriptionBn:
        "গৃহস্থালী ভোক্তা, বাণিজ্যিক ডিলার এবং শিল্প অপারেটরদের জন্য শিল্প-সম্মত এলপিজি নিরাপত্তা প্রশিক্ষণ। নিজের গতিতে শিখুন, কুইজে অংশ নিন এবং যাচাইকৃত সার্টিফিকেট অর্জন করুন।",
      imageSrc:
        "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=800&auto=format&fit=crop",
      imageAlt: "LPG Safety Training & Certification",
      imageAltBn: "এলপিজি নিরাপত্তা প্রশিক্ষণ ও সনদ",
    },
    sections: {},
  },
  {
    pageKey: "market-updates",
    title: "LPG Market Updates",
    titleBn: "এলপিজি মার্কেট আপডেট",
    banner: {
      type: "visual",
      title: "LPG MARKET",
      titleBn: "এলপিজি মার্কেট",
      accent: "UPDATE.",
      accentBn: "আপডেট।",
      description:
        "Stay informed with the latest incident reports, inquiries, stakeholder announcements, BERC price notifications, and global LPG market trends across Bangladesh.",
      descriptionBn:
        "বাংলাদেশে সর্বশেষ দুর্ঘটনা রিপোর্ট, তদন্ত, স্টেকহোল্ডার ঘোষণা, বিইআরসি মূল্য বিজ্ঞপ্তি এবং বৈশ্বিক এলপিজি বাজারের প্রবণতা সম্পর্কে অবগত থাকুন।",
      imageSrc:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
      imageAlt: "Industrial LPG Terminal and Storage",
      imageAltBn: "শিল্প এলপিজি টার্মিনাল ও স্টোরেজ",
    },
    sections: {
      bercPricing: {
        current12kgPrice: "৳ 1,455",
        effectiveMonth: "Current Month",
        effectiveMonthBn: "চলতি মাস",
        statutoryCircularNo: "BERC/LPG-RATE/2026/04",
      },
      incidents: [
        {
          id: "INC-2024-125",
          type: "Leakage",
          typeBn: "গ্যাস লিকেজ",
          location: "Chattogram",
          locationBn: "চট্টগ্রাম",
          specificLocation: "Patenga Depot Area, Chattogram",
          specificLocationBn: "পতেঙ্গা ডিপো এলাকা, চট্টগ্রাম",
          date: "May 20, 2024",
          dateBn: "২০ মে, ২০২৪",
          status: "Resolved",
          statusBn: "সমাধানকৃত",
          severity: "Medium",
          severityBn: "মাঝারি",
          conductedBy: "DoE",
          details: "A localized minor valve leak was reported during manifold pressure transfer at a primary refilling bay. Prompt emergency shutoff protocols were initiated within 3 minutes. Zero casualties, area safely purged.",
          detailsBn: "রিফিলিং বে-তে চাপ স্থানান্তরের সময় একটি ছোট ভালভ লিক শনাক্ত হয়। ৩ মিনিটের মধ্যে জরুরি শাটঅফ সক্রিয় করা হয়। কোনো হতাহতের ঘটনা ঘটেনি।",
          casualties: "0 Casualties, 0 Hospitalized",
          casualtiesBn: "০ হতাহত, ০ হাসপাতালে ভর্তি",
          investigationReport: "INQ-2024-77",
        },
        {
          id: "INC-2024-124",
          type: "Fire",
          typeBn: "অগ্নিকাণ্ড",
          location: "Dhaka",
          locationBn: "ঢাকা",
          specificLocation: "Rampura Road Retail Point, Dhaka",
          specificLocationBn: "রামপুরা রোড রিটেল পয়েন্ট, ঢাকা",
          date: "May 19, 2024",
          dateBn: "১৯ মে, ২০২৪",
          status: "Resolved",
          statusBn: "সমাধানকৃত",
          severity: "High",
          severityBn: "উচ্চ",
          conductedBy: "Civil Defense",
          details: "Electrical short circuit adjacent to unauthorized retail storage caused minor flare up. Civil Defense arrived on scene within 8 minutes and extinguished the flare using dry chemical powder (DCP). Two minor burn injuries treated at hospital.",
          detailsBn: "অননুমোদিত খুচরা গুদামের পাশে শর্ট সার্কিট থেকে অগ্নিকাণ্ড ঘটে। ফায়ার সার্ভিস ৮ মিনিটের মধ্যে আগুন নিয়ন্ত্রণে আনে।",
          casualties: "2 Minor Injuries (Treated & Discharged)",
          casualtiesBn: "২ জন সামান্য আহত (প্রাথমিক চিকিৎসার পর ছাড়পত্র)",
          investigationReport: "INQ-2024-76",
        },
        {
          id: "INC-2024-123",
          type: "Explosion",
          typeBn: "বিস্ফোরণ",
          location: "Narayanganj",
          locationBn: "নারায়ণগঞ্জ",
          specificLocation: "Fatullah Industrial Substation, Narayanganj",
          specificLocationBn: "ফতুল্লা শিল্প এলাকা, নারায়ণগঞ্জ",
          date: "May 18, 2024",
          dateBn: "১৮ মে, ২০২৪",
          status: "Under Investigation",
          statusBn: "তদন্তাধীন",
          severity: "Critical",
          severityBn: "মারাত্মক",
          conductedBy: "LOAB & DoE",
          details: "Substandard imported cylinder burst under unauthorized over-pressurization. Joint probe team comprising DoE and LOAB Technical Committee is inspecting site metallurgical fragments. Preliminary report expected within 7 working days.",
          detailsBn: "অননুমোদিত অতিরিক্ত চাপে মানহীন সিলিন্ডার ফেটে যায়। বিস্ফোরক পরিদপ্তর ও লোয়াব তদন্ত কমিটি গঠন করেছে।",
          casualties: "1 Injured (Stable in Hospital), Substantial Property Damage",
          casualtiesBn: "১ জন আহত (হাসপাতালে চিকিৎসাধীন), অবকাঠামোগত ক্ষতি",
          investigationReport: "INQ-2024-75",
        },
      ],
      bercMessages: [
        {
          id: "BERC-2024-06",
          slug: "BERC-2024-06",
          title: "Monthly LPG Price Revision Circular",
          titleBn: "মাসিক এলপিজি মূল্য সমন্বয় বিজ্ঞপ্তি",
          date: "May 28, 2024",
          dateBn: "২৮ মে, ২০২৪",
          tag: "Price Circular",
          tagBn: "মূল্য বিজ্ঞপ্তি",
          summary: "Standard 12kg cylinder LPG price revised to BDT 1,455 (incl. VAT), effective from current billing cycle. Regional auto-gas quotas itemized in annex.",
          summaryBn: "ভ্যাটসহ প্রতি ১২ কেজি এলপিজি সিলিন্ডারের ভোক্তা পর্যায়ে খুচরা মূল্য ১,৪৫৫ টাকা নির্ধারণ করা হয়েছে।",
        },
        {
          id: "BERC-2024-05",
          slug: "BERC-2024-05",
          title: "Auto Gas Retail Margin Adjustment Notice",
          titleBn: "অটোগ্যাস রিটেল মার্জিন সমন্বয় নোটিশ",
          date: "May 10, 2024",
          dateBn: "১০ মে, ২০২৪",
          tag: "Regulatory Notice",
          tagBn: "নিয়ন্ত্রক নোটিশ",
          summary: "Retail margin for auto gas conversion stations adjusted nationwide to align with revised distribution cost model.",
          summaryBn: "সংশোধিত বিতরণ ব্যয়ের সাথে সামঞ্জস্য রেখে দেশব্যাপী অটোগ্যাস রিটেল মার্জিন সমন্বয় করা হয়েছে।",
        },
      ],
      globalNews: [
        {
          id: "GLOBAL-2024-41",
          slug: "GLOBAL-2024-41",
          title: "Saudi Aramco Sets Contract Price (CP) for June",
          titleBn: "জুন মাসের জন্য সৌদি আরামকো সিপি নির্ধারণ",
          date: "May 31, 2024",
          dateBn: "৩১ মে, ২০২৪",
          tag: "Aramco CP",
          tagBn: "আরামকো সিপি",
          summary: "Propane set at $580/MT, Butane at $565/MT, signaling moderate stabilization across Asian import terminals.",
          summaryBn: "প্রোপেন ৫৮০ ডলার/টন এবং বিউটেন ৫৬৫ ডলার/টন নির্ধারণ করা হয়েছে।",
        },
        {
          id: "GLOBAL-2024-40",
          slug: "GLOBAL-2024-40",
          title: "VLGC Freight Rates Normalize Along Middle East Route",
          titleBn: "মধ্যপ্রাচ্য রুটে ভিএলজিসি ফ্রেইট রেট স্বাভাবিকীকরণ",
          date: "May 22, 2024",
          dateBn: "২২ মে, ২০২৪",
          tag: "Freight Market",
          tagBn: "শিপিং ও ফ্রেইট",
          summary: "Very Large Gas Carrier charter rates softened to $68/MT, reducing landed costs for Bangladeshi import terminals.",
          summaryBn: "ভিএলজিসি চার্টার রেট ৬৮ ডলার/টনে নেমে আসায় বাংলাদেশি টার্মিনালগুলোর আমদানি ব্যয় কমেছে।",
        },
      ],
    },
  },
  {
    pageKey: "contact",
    title: "Contact Us",
    titleBn: "যোগাযোগ",
    banner: {
      type: "visual",
      title: "CONTACT",
      titleBn: "যোগাযোগ",
      accent: "US.",
      accentBn: "করুন।",
      description:
        "We are here to assist with safety protocols, regulatory compliance inquiries, institutional LMS training, and technical advisory services across Bangladesh.",
      descriptionBn:
        "সারাদেশে নিরাপত্তা প্রোটোকল, নিয়ন্ত্রক সম্মতি অনুসন্ধান, প্রাতিষ্ঠানিক এলএমএস প্রশিক্ষণ এবং প্রযুক্তিগত পরামর্শ সেবা প্রদানে আমরা সর্বদা প্রস্তুত।",
      imageSrc:
        "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=800&auto=format&fit=crop",
      imageAlt: "Contact Safe LPG Platform",
      imageAltBn: "নিরাপদ এলপিজি যোগাযোগ",
    },
    sections: {
      contactInfo: {
        hotline: "16137",
        email: "support@safelpg-bd.com",
        officeAddress: "Plot 14, Bir Uttam AK Khandakar Road, Mohakhali C/A, Dhaka-1212",
        officeAddressBn: "প্লট ১৪, বীর উত্তম এ কে খন্দকার সড়ক, মহাখালী বা/এ, ঢাকা-১২১২",
        operatingHours: "Sunday - Thursday: 9:00 AM - 5:00 PM (Emergency 24/7)",
        operatingHoursBn: "রবিবার - বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৫:০০ (জরুরি ২৪/৭)",
      },
    },
  },
];

async function seedPages() {
  try {
    await mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/ael");
    console.log("Connected to MongoDB!");

    // Unset badge and badgeBn from all pages in DB
    await Page.updateMany(
      {},
      { $unset: { "banner.badge": "", "banner.badgeBn": "" } }
    );
    console.log("✅ Removed banner.badge and banner.badgeBn from all database records!");

    for (const page of pagesToSeed) {
      const updated = await Page.findOneAndUpdate(
        { pageKey: page.pageKey },
        { $set: page },
        { new: true, upsert: true }
      );
      console.log(`✅ Seeded / updated page: ${updated.pageKey} (Type: ${updated.banner?.type})`);
    }

    console.log("\nAll pages successfully updated without badge in MongoDB!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding pages:", error);
    process.exit(1);
  }
}

seedPages();
