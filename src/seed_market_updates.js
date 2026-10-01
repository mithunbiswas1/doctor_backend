// ael_backend/src/seed_market_updates.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import { MarketUpdate } from "./models/marketUpdate.model.js";

dotenv.config();

const INITIAL_UPDATES = [
  // ── 1. Incidents Category (Item 1 & 2) ──
  {
    titleEn: "Chattogram Port LPG Terminal Safety Probe & Incident Analysis Report",
    titleBn: "চট্টগ্রাম বন্দর এলপিজি টার্মিনাল নিরাপত্তা তদন্ত ও দুর্ঘটনা বিশ্লেষণ প্রতিবেদন",
    slug: "chattogram-port-lpg-terminal-safety-probe-analysis",
    category: "incidents",
    categoryBn: "দুর্ঘটনা ও তদন্ত প্রতিবেদন",
    summaryEn:
      "Comprehensive investigation into the static discharge leak and rapid valve response at Chattogram coastal terminal. Technical probe findings, emergency response timeline, and preventative guidelines.",
    summaryBn:
      "চট্টগ্রাম উপকূলীয় টার্মিনালে স্ট্যাটিক ডিসচার্জ লিক ও জরুরি ভাল্ব নিয়ন্ত্রণ ব্যবস্থার কারিগরি তদন্ত প্রতিবেদন। ঘটনাস্থল পরিদর্শন, তদন্ত কমিটির সুপারিশ ও প্রতিরোধমূলক নির্দেশনা।",
    contentEn: `<h3>Executive Summary</h3>
<p>On May 14, 2024, a localized flange pressure variance triggered automatic safety shutoff valves at the Chattogram outer anchorage unloading terminal. The Department of Explosives (DoE) joint probe committee deployed high-precision telemetry to determine the root cause.</p>
<h4>Key Findings & Telemetry Analysis</h4>
<ul>
<li><strong>Valve Interlock Efficacy:</strong> Automated shut-off activated within 1.8 seconds of differential pressure breach.</li>
<li><strong>Secondary Containment:</strong> Zero vapor escape into coastal perimeter zones.</li>
<li><strong>Recommended Remediation:</strong> Mandating ultrasonic flange testing for all vessel offloading couplings across Chittagong and Mongla ports.</li>
</ul>
<p>Official investigation documents, valve schematics, and DoE compliance directives are compiled in the attached circular.</p>`,
    contentBn: `<h3>সারসংক্ষেপ</h3>
<p>গত ১৪ মে ২০২৪ তারিখে চট্টগ্রাম বহির্নোঙর টার্মিনালে আনলোডিং চলাকালীন পাইপলাইন ফ্ল্যাঞ্জে প্রেশার বৈষম্য পরিলক্ষিত হলে স্বয়ংক্রিয় সেফটি ভাল্ব দ্রুত সক্রিয় হয়। বিস্ফোরক পরিদপ্তর (DoE) ও এনার্জি রেগুলেটরি কমিটির যৌথ তদন্ত দল সার্বিক কারিগরি পরীক্ষা সম্পন্ন করেছে।</p>
<h4>প্রধান পর্যবেক্ষণ ও সুপারিশমালা</h4>
<ul>
<li><strong>অটোমেটেড শাট-অফ:</strong> চাপ তারতম্য ধরা পড়ার ১.৮ সেকেন্ডের মধ্যে গ্যাস সঞ্চালন বন্ধ হয়।</li>
<li><strong>পরিবেশগত সুরক্ষা:</strong> আশেপাশের উপকূলীয় অঞ্চলে কোনো গ্যাস নিঃসরণ বা ক্ষয়ক্ষতি হয়নি।</li>
<li><strong>নতুন নির্দেশনা:</strong> চট্টগ্রাম ও মোংলা পোর্টে আনলোডিং কার্যক্রমে অতিস্বনক (Ultrasonic) ফ্ল্যাঞ্জ টেস্টিং বাধ্যতামূলক করা হয়েছে।</li>
</ul>`,
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfOriginalName: "DoE-Chattogram-Terminal-Probe-Report-2024.pdf",
    pdfSize: 2450000,
    authorEn: "Engr. Mahmudul Hasan (DoE Lead Auditor)",
    authorBn: "প্রকৌশলী মাহমুদুল হাসান (বিস্ফোরক পরিদপ্তর)",
    publishDate: new Date("2024-05-20"),
    isPublished: true,
    isFeatured: true,
    tags: ["incidents", "safety-probe", "chattogram", "doe-circular"],
  },
  {
    titleEn: "Dhaka-Gazipur Industrial Refilling Plant Valve Integrity & Leakage Probe Report",
    titleBn: "ঢাকা-গাজীপুর শিল্পাঞ্চল রিফিলিং প্ল্যান্ট সেফটি ভাল্ব ও লিকেজ প্রতিরোধ তদন্ত প্রতিবেদন",
    slug: "dhaka-gazipur-refilling-plant-valve-integrity-probe",
    category: "incidents",
    categoryBn: "দুর্ঘটনা ও তদন্ত প্রতিবেদন",
    summaryEn:
      "Technical audit and forensic telemetry on carousel seal degradation at Gazipur bottling facility. Safety recommendations, replacement protocols, and mandatory digital pressure logging.",
    summaryBn:
      "গাজীপুর বোতলজাতকরণ প্ল্যান্টের ক্যারোজেল সিল অবক্ষয় ও সম্ভাব্য লিকেজের ওপর বিশদ কারিগরি অডিট। সেফটি রিকমেন্ডেশন, যন্ত্রাংশ প্রতিস্থাপন প্রোটোকল ও ডিজিটাল প্রেশার লগিং বাধ্যতামূলক করার সিদ্ধান্ত।",
    contentEn: `<h3>Industrial Audit Overview</h3>
<p>A safety inspection by the Department of Explosives (DoE) was conducted across major refilling stations along the Dhaka-Gazipur industrial belt following reports of micro-fissures in carousel sealing rings.</p>
<h4>Corrective Action Directives</h4>
<ul>
<li><strong>Replacement Lifecycle:</strong> Carousel O-ring seals must be replaced every 45 operational days rather than 90 days.</li>
<li><strong>Nitrogen Pressure Testing:</strong> Hydrostatic and nitrogen dry testing mandated before re-commissioning.</li>
<li><strong>Operator Protocol:</strong> Real-time methane and combustible gas sensors with automated visual strobe alarms.</li>
</ul>`,
    contentBn: `<h3>শিল্পাঞ্চল অডিট সারসংক্ষেপ</h3>
<p>গাজীপুর ইন্ডাস্ট্রিয়াল বেল্টের এলপিজি ফিলিং প্ল্যান্টগুলোতে সেফটি পরিদর্শন সম্পন্ন করেছে বিস্ফোরক পরিদপ্তরের বিশেষজ্ঞ প্যানেল। সিলিং রিং ও ক্যারোজেল ভাল্ব সমন্বয় ব্যবস্থার ওপর পরীক্ষা চালানো হয়।</p>
<h4>বাস্তবায়ন নির্দেশিকা</h4>
<ul>
<li><strong>সিল পরিবর্তনের মেয়াদ:</strong> প্রতিটি ক্যারোজেল ও-রিং সর্বোচ্চ ৪৫ দিনের মধ্যে বাধ্যতামূলক প্রতিস্থাপন।</li>
<li><strong>নাইট্রোজেন টেস্ট:</strong> কমিশনিং করার পূর্বে প্রেসার ও লিকেজ টেস্টের বাধ্যবাধকতা।</li>
<li><strong>অ্যালার্ম সিস্টেম:</strong> প্ল্যান্টের ফিলিং লাইনে স্বয়ংক্রিয় গ্যাস ডিটেকশন ও ভিজ্যুয়াল অ্যালার্ম নিশ্চিতকরণ।</li>
</ul>`,
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfOriginalName: "DoE-Gazipur-Plant-Valve-Audit-Report-2024.pdf",
    pdfSize: 2180000,
    authorEn: "Engr. Mahmudul Hasan (DoE Lead Auditor)",
    authorBn: "প্রকৌশলী মাহমুদুল হাসান (বিস্ফোরক পরিদপ্তর)",
    publishDate: new Date("2024-05-19"),
    isPublished: true,
    isFeatured: false,
    tags: ["incidents", "gazipur", "refilling-plant", "valve-integrity"],
  },

  // ── 2. BERC Category (Item 1 & 2) ──
  {
    titleEn: "BERC Official Statutory Notice: 12kg Cylinder Retail Price & Tariff Formula",
    titleBn: "বিইআরসি সংবিধিবদ্ধ প্রজ্ঞাপন: ১২ কেজি সিলিন্ডার খুচরা মূল্য ও ট্যারিফ নির্ধারণ",
    slug: "berc-official-statutory-notice-12kg-cylinder-pricing",
    category: "berc",
    categoryBn: "বিইআরসি বার্তা ও মূল্য সার্কুলার",
    summaryEn:
      "Bangladesh Energy Regulatory Commission (BERC) gazette notification outlining international Saudi Aramco CP adjustment, distribution margin, and unified consumer price ceiling for 12kg reticulated & bottled LPG.",
    summaryBn:
      "বাংলাদেশ এনার্জি রেগুলেটরি কমিশন (বিইআরসি) কর্তৃক ঘোষিত সৌদি আরামকো সিপি দর, ডিস্ট্রিবিউশন মার্জিন এবং ভোক্তা পর্যায়ে ১২ কেজি বোতলজাত এলপিজির মূল্য তালিকা ও তদারকি নির্দেশিকা।",
    contentEn: `<h3>Regulatory Gazette Details</h3>
<p>Under Section 22(Kha) of the Bangladesh Energy Regulatory Commission Act 2003, the Commission announces the official monthly consumer price benchmark for private bottled LPG and auto-gas across all 64 districts.</p>
<h4>Cost Breakdown & Formula Benchmarks</h4>
<ul>
<li><strong>Saudi Aramco CP Benchmark:</strong> Propane ($590/MT) and Butane ($570/MT) weighted blend at 35:65 ratio.</li>
<li><strong>Ocean Freight & Insurance:</strong> Calculated on standard Arabian Gulf to Bay of Bengal route charter rates.</li>
<li><strong>Retailer Commission:</strong> Strictly bounded to protect end-consumer welfare and prevent unauthorized local inflation.</li>
</ul>
<p>Authorized distributors are required to prominently display the statutory price chart at every retail outlet.</p>`,
    contentBn: `<h3>নিয়ন্ত্রণকারী প্রজ্ঞাপন</h3>
<p>বাংলাদেশ এনার্জি রেগুলেটরি কমিশন আইন ২০০৩ এর ধারা ২২(খ) এর আলোকে বেসরকারি বোতলজাত এলপিজি ও অটোগ্যাসের সমন্বিত ভোক্তা মূল্য নির্ধারণ করা হয়েছে।</p>
<h4>মূল্য নির্ধারণের ভিত্তি</h4>
<ul>
<li><strong>সৌদি আরামকো সিপি:</strong> প্রোপেন ($৫৯০/টন) ও বিউটেন ($৫৭০/টন) এর ৩৫:৬৫ মিশ্রণ অনুপাত।</li>
<li><strong>নৌ-পরিবহন ও বীমা ব্যয়:</strong> আন্তর্জাতিক বাজার ও ডলার বিনিময় হারের বাস্তব সমন্বয়।</li>
<li><strong>ডিস্ট্রিবিউটর মার্জিন:</strong> খুচরা বিক্রেতাদের জন্য নির্ধারিত মুনাফা কাঠামো বজায় রাখার কঠোর নির্দেশনা।</li>
</ul>`,
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfOriginalName: "BERC-Gazette-LPG-Consumer-Price-Circular.pdf",
    pdfSize: 1820000,
    authorEn: "BERC Tariff Directorate",
    authorBn: "বিইআরসি ট্যারিফ পরিদপ্তর",
    publishDate: new Date("2024-05-18"),
    isPublished: true,
    isFeatured: true,
    tags: ["berc", "pricing", "tariff", "circular"],
  },
  {
    titleEn: "BERC Directives on Safe Auto-Gas Operations & Anti Cross-Filling Enforcement",
    titleBn: "নিরাপদ অটোগ্যাস পরিচালনা ও ক্রস-ফিলিং নিষিদ্ধকরণে বিইআরসি-এর নতুন নির্দেশনা",
    slug: "berc-directives-safe-auto-gas-operations-cross-filling",
    category: "berc",
    categoryBn: "বিইআরসি বার্তা ও মূল্য সার্কুলার",
    summaryEn:
      "Strict enforcement orders against unauthorized decanting and cross-filling of domestic cylinders at auto-gas retail stations. Penal code provisions and license revocation terms.",
    summaryBn:
      "অটোগ্যাস ফিলিং স্টেশনগুলোতে গৃহস্থালী সিলিন্ডারে অনিবন্ধিত ও ঝুঁকিপূর্ণ গ্যাস রূপান্তর (ক্রস-ফিলিং) বন্ধে বাংলাদেশ এনার্জি রেগুলেটরি কমিশনের কঠোর প্রজ্ঞাপন ও লাইসেন্স বাতিলের সতর্কতা।",
    contentEn: `<h3>Enforcement Framework</h3>
<p>The Bangladesh Energy Regulatory Commission (BERC) in coordination with mobile courts and the Department of Explosives has promulgated strict monitoring guidelines to eliminate illicit cylinder decanting.</p>
<h4>Compliance Mandates</h4>
<ul>
<li><strong>CCTV Archiving:</strong> Minimum 60 days continuous high-definition recording of dispensing nozzles.</li>
<li><strong>Calibration Verification:</strong> Auto-gas dispensing meters must undergo monthly calibration by BSTI inspectors.</li>
<li><strong>Legal Penalties:</strong> Revocation of commercial operating licenses and confiscation of unlicensed dispensing units.</li>
</ul>`,
    contentBn: `<h3>আইন প্রয়োগকারী নীতিমালা</h3>
<p>বাংলাদেশ এনার্জি রেগুলেটরি কমিশন কর্তৃক ভ্রাম্যমাণ আদালত ও স্থানীয় প্রশাসনের সহায়তায় অটোগ্যাস স্টেশনগুলোতে অবৈধভাবে গৃহস্থালী সিলিন্ডারে গ্যাস ভর্তি রোধে বিশেষ নির্দেশনা জারি করা হয়েছে।</p>
<h4>বাধ্যতামূলক পালনীয় শর্ত</h4>
<ul>
<li><strong>সিসিটিভি রেকর্ডিং:</strong> ফিলিং নজলের কাছে কমপক্ষে ৬০ দিনের সিসিটিভি ফুটেজ সংরক্ষণ বাধ্যতামূলক।</li>
<li><strong>মিটার ক্যালিব্রেশন:</strong> প্রতি মাসে বিএসটিআই কর্তৃক অনুমোদিত পরিমাপক সিল যাচাইকরণ।</li>
<li><strong>আইনি ব্যবস্থা:</strong> নিয়ম লঙ্ঘনে তাৎক্ষণিক স্টেশন সিলগালা এবং বাণিজ্যিক অনুমোদন বাতিল।</li>
</ul>`,
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800&auto=format&fit=crop",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfOriginalName: "BERC-Enforcement-Notice-Autogas-Safety-2024.pdf",
    pdfSize: 1950000,
    authorEn: "BERC Legal & Compliance Wing",
    authorBn: "বিইআরসি আইন ও কমপ্লায়েন্স উইং",
    publishDate: new Date("2024-05-17"),
    isPublished: true,
    isFeatured: false,
    tags: ["berc", "autogas", "compliance", "cross-filling"],
  },

  // ── 3. Global Category (Item 1 & 2) ──
  {
    titleEn: "Global LPG Market Intelligence: Saudi Aramco CP Trends & Global Supply Chain",
    titleBn: "বৈশ্বিক এলপিজি মার্কেট অ্যানালাইসিস: সৌদি আরামকো সিপি ট্রেন্ড ও আন্তর্জাতিক সরবরাহ চেইন",
    slug: "global-lpg-market-intelligence-saudi-aramco-cp-trends",
    category: "global",
    categoryBn: "বৈশ্বিক মার্কেট আপডেট ও ট্রেন্ড",
    summaryEn:
      "Global energy analytics review covering Asian petrochemical feedstocks demand, VLGC shipping charter freight dynamics, and projected contract price trajectories for the third quarter.",
    summaryBn:
      "বিশ্ব জ্বালানি বাজারের ত্রৈমাসিক পর্যালোচনা: এশীয় পেট্রোকেমিক্যাল চাহিদা, ভিএলজিসি (VLGC) ভ্যাসেল ফ্রেইট ভাড়া এবং আন্তর্জাতিক বাজারে প্রোপেন-বিউটেনের মূল্য পূর্বাভাস।",
    contentEn: `<h3>Global Supply Dynamics</h3>
<p>International LPG shipments through the Strait of Hormuz remained robust, with US Gulf Coast exports operating at 94% utilization to Asian terminals.</p>
<h4>Market Drivers & Shipping Rates</h4>
<ul>
<li><strong>VLGC Fleet Availability:</strong> Daily time-charter rates averaged $42,500/day across East of Suez routes.</li>
<li><strong>Petrochemical Cracker Feedstock:</strong> Increased arbitrage switching from naphtha to LPG in East Asian coastal crackers.</li>
<li><strong>Quarterly Outlook:</strong> Stable supply buffer projected with domestic Bangladesh reserves reaching peak storage capacities.</li>
</ul>`,
    contentBn: `<h3>আন্তর্জাতিক সরবরাহ পরিস্থিতি</h3>
<p>হরমুজ প্রণালী ও আন্তর্জাতিক সমুদ্র রুটে এলপিজি কার্গো পরিবহন স্থিতিশীল রয়েছে। মার্কিন উপসাগরীয় রফতানি টার্মিনালগুলো থেকে এশিয়ায় গ্যাস সরবরাহ ৯৪% সক্ষমতায় চলমান।</p>
<h4>বাজার চালিকাশক্তি ও ফ্রেইট রেট</h4>
<ul>
<li><strong>ভিএলজিসি নৌবহর:</strong> সুয়েজ খালের পূর্বাঞ্চলীয় রুটে দৈনিক চার্টার ভাড়া গড়ে ৪২,৫০০ ডলারে স্থিতিশীল।</li>
<li><strong>পেট্রোকেমিক্যাল চাহিদা:</strong> পূর্ব এশিয়ার দেশগুলোতে ন্যাপথার বদলে এলপিজির ব্যবহার বৃদ্ধির ইতিবাচক প্রভাব।</li>
<li><strong>আগামী প্রান্তিকের পূর্বাভাস:</strong> দেশীয় রিজার্ভ মজুত সন্তোষজনক থাকায় আসন্ন প্রান্তিকে সরবরাহ সংকট হওয়ার সম্ভাবনা নেই।</li>
</ul>`,
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfOriginalName: "Global-LPG-Market-Intelligence-Briefing-Q3.pdf",
    pdfSize: 3100000,
    authorEn: "AEL Global Market Research Cell",
    authorBn: "এইএল গ্লোবাল মার্কেট রিসার্চ সেল",
    publishDate: new Date("2024-05-15"),
    isPublished: true,
    isFeatured: true,
    tags: ["global", "saudi-aramco", "vlgc", "crude-parity"],
  },
  {
    titleEn: "VLGC Shipping Freight Dynamics & Middle East to Asia Supply Chain Trajectory",
    titleBn: "ভিএলজিসি কার্গো ফ্রেইট ও মধ্যপ্রাচ্য-এশিয়া এলপিজি সরবরাহ চেইন পূর্বাভাস",
    slug: "vlgc-freight-dynamics-middle-east-asia-supply-chain",
    category: "global",
    categoryBn: "বৈশ্বিক মার্কেট আপডেট ও ট্রেন্ড",
    summaryEn:
      "International freight rate indices, vessel transit times across Ras Tanura to Chittagong routes, and global bunker fuel parity analysis.",
    summaryBn:
      "আন্তর্জাতিক এলপিজি ফ্রেইট ইনডেক্স, রাস তানুরা থেকে চট্টগ্রাম রুটে কার্গো পরিবহন সময় এবং বৈশ্বিক জ্বালানি তেলের দামের প্রভাব বিশ্লেষণ।",
    contentEn: `<h3>Maritime Logistics & VLGC Fleet Index</h3>
<p>The global Very Large Gas Carrier (VLGC) market has experienced stabilized charter rates following enhanced turnaround efficiency in regional transshipment hubs.</p>
<h4>Supply Chain Highlights</h4>
<ul>
<li><strong>Transit Duration:</strong> Direct voyage time from Persian Gulf to Bay of Bengal maintained at 11-13 days.</li>
<li><strong>Bunker Fuel Hedging:</strong> Low-sulfur marine gasoil stabilization reducing voyage cost variances.</li>
<li><strong>Regional Storage Buffers:</strong> Expanded floating storage facilities in Singapore and Malaysia reducing spot supply volatility.</li>
</ul>`,
    contentBn: `<h3>সামুদ্রিক পরিবহন ও ফ্রেইট ইনডেক্স</h3>
<p>আঞ্চলিক ট্রান্সশিপমেন্ট হাবগুলোতে ভ্যাসেল আনলোডিং গতি বৃদ্ধির ফলে আন্তর্জাতিক ভেরি লার্জ গ্যাস ক্যারিয়ার (VLGC) জাহাজের চার্টার রেট নিয়ন্ত্রণে রয়েছে।</p>
<h4>গুরুত্বপূর্ণ পর্যবেক্ষণ</h4>
<ul>
<li><strong>পরিবহন সময়:</strong> পারস্য উপসাগর থেকে বঙ্গোপসাগর অঞ্চলে জাহাজ পৌঁছাতে সময় লাগছে ১১-১৩ দিন।</li>
<li><strong>ফুয়েল ব্যয়:</strong> আন্তর্জাতিক তেলের বাজার স্থিতিশীল থাকায় জাহাজের পরিচালন ব্যয়ে ভারসাম্য এসেছে।</li>
<li><strong>আঞ্চলিক সঞ্চয় ক্ষমতা:</strong> সিঙ্গাপুর ও মালয়েশিয়ায় এলপিজি ভাসমান মজুত বৃদ্ধির ফলে সরবরাহে ধারাবাহিকতা বজায় রয়েছে।</li>
</ul>`,
    image:
      "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=800&auto=format&fit=crop",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    pdfOriginalName: "Global-VLGC-Shipping-Charter-Review-2024.pdf",
    pdfSize: 2850000,
    authorEn: "AEL Global Market Research Cell",
    authorBn: "এইএল গ্লোবাল মার্কেট রিসার্চ সেল",
    publishDate: new Date("2024-05-14"),
    isPublished: true,
    isFeatured: false,
    tags: ["global", "vlgc", "freight", "logistics"],
  },
];

async function seedMarketUpdates() {
  try {
    const mongoUri =
      process.env.MONGODB_URL ||
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/ael";
    console.log("Connecting to MongoDB:", mongoUri);
    await mongoose.connect(mongoUri);

    console.log("Seeding 2 Market Updates per category (6 total)...");

    for (const item of INITIAL_UPDATES) {
      await MarketUpdate.findOneAndUpdate(
        { slug: item.slug },
        { $set: item },
        { upsert: true, new: true }
      );
      console.log(`✓ Seeded update: ${item.titleEn} [${item.category}]`);
    }

    console.log("✅ All 6 market updates seeded successfully (2 per category)!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seedMarketUpdates();
