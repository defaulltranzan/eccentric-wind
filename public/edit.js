/**
 * Himalayan Magic Adventure — Frontend Controller & Multilingual Engine
 * Standard: Modern Vanilla JS, i18n Architecture, Safe DOM Manipulation
 */

// ==========================================
// 1. THEME & MULTILINGUAL STATE MANAGEMENT
// ==========================================
let currentTheme = localStorage.getItem('vo_theme') || 'dark';
let currentLang = localStorage.getItem('vo_lang') || 'en';
let isLangDropdownOpen = false;

// Global Site Database State
// Defaults to an empty-but-shaped object (rather than null) so UI renders
// triggered before the /api/content fetch resolves (e.g. initial language
// setup) can safely read siteData.packages/dispatches/stats/contact/about
// without throwing; loadContent() replaces this wholesale once data arrives.
let siteData = { packages: [], dispatches: [], stats: [], contact: {}, about: {} };
let originalData = null;
let isEditMode = false;
let selectedTrekId = null;
let editingTrekIndex = null;

// ==========================================
// 2. COMPREHENSIVE MULTILINGUAL DICTIONARY
// ==========================================
const i18n = {
  en: {
    langName: "English",
    // Admin Bar
    adminTitle: "Himalayan Magic Adventure Control Panel",
    btnEnableEdit: "Enable Edit Mode",
    adminTip: "Double-click text cards to edit. Hover packages to manage!",
    btnSave: "Save Changes",
    btnDiscard: "Discard",
    
    // Top Bar & Manifesto
    coordSystem: "27°59'N · 86°55'E",
    heroBadge: "EST. 1993 · 30+ YEARS OF HIMALAYAN EXCELLENCE",
    heroTitlePrimary: "HIMALAYAN",
    heroTitleItalic: "MAGIC ADVENTURE",
    heroDesc: "Orchestrating transformative journeys across Nepal's sacred peaks and high corridors since 1993. Guided by veteran IFMGA/NMA Sherpa masters with 100% safety commitment.",
    btnViewExpeditions: "Begin Climbing",
    scrollElevation: "SCROLL FOR ELEVATION",
    
    // Stats Matrix
    stats: [
      { value: "30+", label: "Years of Safety Legacy" },
      { value: "100%", label: "Certified Sherpa Guides" },
      { value: "Guaranteed", label: "Group Departures" },
      { value: "Eco-Safe", label: "Sustainable Expeditions" }
    ],
    
    // 02 Expedition Matrix
    sec02Label: "02 — Flagship Expeditions",
    sec02HeadingPrimary: "Choose Your",
    sec02HeadingAccent: "Summit",
    optAllRegions: "ALL REGIONS",
    optNepal: "NEPAL",
    optTibet: "TIBET",
    optBhutan: "BHUTAN",
    optAllDiff: "ANY DIFFICULTY",
    optModerate: "MODERATE",
    optChallenging: "CHALLENGING",
    optStrenuous: "STRENUOUS",
    btnAddTrek: "+ Insert New Trek Package",
    lblExpedition: "EXPEDITION",
    lblDuration: "DURATION",
    lblPricing: "PRICING",
    lblDays: "DAYS",
    lblUSD: "USD",
    btnEdit: "EDIT",
    btnDelete: "DEL",
    noExpeditions: "NO EXPEDITIONS MATCH THE DECLARED MATRIX PARAMETERS.",
    
    // 03 Tactical Itinerary
    sec03Label: "04 — THE TACTICAL ITINERARY",
    sec03Sub: "Follow the elevation profile. Every check-point is critical for acclimatization.",
    dayPrefix: "DAY",
    waypointNote: "Checked & Acclimatized coordinate path altitude waypoint.",
    selectExpeditionPrompt: "SELECT AN EXPEDITION FROM THE MATRIX ABOVE TO AUDIT ITINERARY STAGES.",
    noStagesLogged: "NO STAGES LOGGED FOR THIS EXPEDITION ROUTE.",
    
    // 04 Gear Readiness
    sec04Label: "04 — THE TACTICAL LOADOUT",
    sec04HeadingPrimary: "Gear",
    sec04HeadingAccent: "Manifest",
    sec04Desc: "Every item on this list has been proven across a decade of high expeditions. Check off your loadout—readiness is measured in safety.",
    readyRating: "Ready Rating",
    itemsPacked: "ITEMS PACKED",
    basecampReady: "Basecamp ready",
    
    // 05 Intent Builder
    sec05Label: "05 — CUSTOM EXPEDITION BUILDER",
    sec05Heading: "DECLARE YOUR INTENT",
    sec05Desc: "Every journey begins with a single declaration. State your intent below and our coordinators will reach out.",
    formIam: "I AM",
    formEmail: "AND MY EMAIL IS",
    formSeeking: "SEEKING TO ASCEND",
    formCrew: "WITH A TEAM SIZE OF",
    placeholderName: "YOUR FULL NAME",
    placeholderEmail: "EMAIL",
    optCustomRoute: "CUSTOM OVERLAND ROUTE",
    btnDeclareIntent: "Declare Intent",
    
    // 06 Dispatches
    sec06Label: "06 — DISPATCHES FROM THE TRAIL",
    sec06Heading: "Stories From The <span class='font-semibold text-accent'>High Places</span>",
    btnWriteDispatch: "+ Write Dispatch",
    readJournal: "READ JOURNAL",
    noDispatches: "NO HISTORICAL DISPATCHES LOGGED YET.",
    
    // Legacy & About
    aboutBadge: "TRUSTED MOUNTAINEERING LEGACY",
    aboutTitle: "THIRTY YEARS OF EXPERTISE",
    aboutDesc: "Himalayan Magic Adventure has been a pioneer of safe, sustainable, and immersive tourism across Nepal since its founding.",
    aboutFloatingStat: "30+",
    aboutFloatingLabel: "Years guiding high paths",
    
    // Footer
    footerDesc: "Premier Himalayan expeditions since 2009. Every route led by certified IFMGA mountain guides and local Sherpa teams.",
    hqTitle: "[ Headquarters ]",
    rescueTitle: "[ Emergency Rescue ]",
    regionsTitle: "[ Regions Checked ]",
    copyright: "© 2026 Himalayan Magic Adventure — All Rights Reserved",
    linkRescue: "Rescue Coordination",
    linkAcclimatization: "Acclimatization Logs",
    
    // Menu
    menuAscentRoute: "The Ascent Route",
    menu01: "Home",
    menu02: "Expeditions",
    menu03: "Altitude Safety",
    menu04: "Sherpa Heritage",
    menu05: "Dispatches",
    menu06: "Declare Intent"
  },

  np: {
    langName: "नेपाली",
    // Admin Bar
    adminTitle: "भर्टिकल ओडिसी नियन्त्रण प्यानल",
    btnEnableEdit: "सम्पादन मोड सक्रिय",
    adminTip: "टेक्स्ट कार्डहरूमा डबल-क्लिक गर्नुहोस्। व्यवस्थापन गर्न प्याकेजहरूमा होभर गर्नुहोस्!",
    btnSave: "परिवर्तनहरू सुरक्षित गर्नुहोस्",
    btnDiscard: "रद्द गर्नुहोस्",
    
    // Top Bar & Manifesto
    coordSystem: "[ निर्देशाङ्क ग्रिड प्रणाली ]",
    heroBadge: "नेपालका उत्कृष्ट साहसिक विशेषज्ञहरू",
    heroTitlePrimary: "भर्टिकल",
    heroTitleItalic: "ओडिसी (महायात्रा)",
    heroDesc: "नेपालका सर्वोच्च हिमाली मार्गहरूमा धैर्य र साहसको तीर्थयात्रा। यो केवल बिदा होइन—शरीर र आत्माको एक रूपान्तरणकारी उचाइ हो।",
    btnViewExpeditions: "अभियानहरू हेर्नुहोस्",
    scrollElevation: "उचाइको लागि स्क्रोल गर्नुहोस्",
    
    // Stats Matrix
    stats: [
      { value: "३०+", label: "सुरक्षा इतिहास (वर्ष)" },
      { value: "१००%", label: "प्रमाणित स्थानीय शेर्पा गाइड" },
      { value: "ग्यारेन्टी", label: "नियमित समूह प्रस्थान" },
      { value: "इको-सुरक्षित", label: "दिगो हिमाली पदयात्रा" }
    ],
    
    // 02 Expedition Matrix
    sec02Label: "०२ — मुख्य अभियानहरू",
    sec02HeadingPrimary: "आफ्नो",
    sec02HeadingAccent: "शिखर रोज्नुहोस्",
    optAllRegions: "सबै क्षेत्रहरू",
    optNepal: "नेपाल",
    optTibet: "तिब्बत",
    optBhutan: "भुटान",
    optAllDiff: "सबै कठिनाइ स्तर",
    optModerate: "मध्यम",
    optChallenging: "चुनौतीपूर्ण",
    optStrenuous: "अत्यन्त कठिन",
    btnAddTrek: "+ नयाँ अभियान प्याकेज थप्नुहोस्",
    lblExpedition: "अभियान",
    lblDuration: "अवधि",
    lblPricing: "शुल्क",
    lblDays: "दिन",
    lblUSD: "डलर",
    btnEdit: "सम्पादन",
    btnDelete: "हटाउनुहोस्",
    noExpeditions: "छनोट गरिएका मापदण्डसँग कुनै अभियान मेल खाएन।",
    
    // 03 Tactical Itinerary
    sec03Label: "०४ — रणनीतिक कार्यतालिका",
    sec03Sub: "उचाइ प्रोफाइल पछ्याउनुहोस्। प्रत्येक बिन्दु उच्च उचाइ अनुकूलनको लागि महत्त्वपूर्ण छ।",
    dayPrefix: "दिन",
    waypointNote: "जाँच गरिएको र अनुकूलित मार्ग विन्दु।",
    selectExpeditionPrompt: "कार्यतालिका हेर्न माथिको म्याट्रिक्सबाट अभियान छनोट गर्नुहोस्।",
    noStagesLogged: "यस मार्गको लागि कुनै चरणहरू रेकर्ड गरिएको छैन।",
    
    // 04 Gear Readiness
    sec04Label: "०४ — रणनीतिक गियर सूची",
    sec04HeadingPrimary: "गियर",
    sec04HeadingAccent: "मेनिफेस्ट",
    sec04Desc: "यस सूचीका प्रत्येक गियर दशकौंको उच्च हिमाली अनुभवद्वारा प्रमाणित भइसकेका छन्। सुरक्षा नै सर्वोपरि हो।",
    readyRating: "तयारी दर",
    itemsPacked: "गियरहरू प्याक भए",
    basecampReady: "आधार शिविरका लागि तयार",
    
    // 05 Intent Builder
    sec05Label: "०५ — अनुकूलन अभियान योजनाकार",
    sec05Heading: "आफ्नो इरादा घोषणा गर्नुहोस्",
    sec05Desc: "हरेक यात्राको सुरुवात एउटा दृढ घोषणाबाट हुन्छ। तल आफ्नो विवरण भर्नुहोस् र हाम्रा संयोजकहरूले सम्पर्क गर्नेछन्।",
    formIam: "म",
    formEmail: "र मेरो इमेल",
    formSeeking: "आरोहण गर्न चाहेको",
    formCrew: "सहभागी संख्या",
    placeholderName: "तपाईंको पूरा नाम",
    placeholderEmail: "इमेल ठेगाना",
    optCustomRoute: "अनुकूलन हिमाली मार्ग",
    btnDeclareIntent: "इरादा पेश गर्नुहोस्",
    
    // 06 Dispatches
    sec06Label: "०६ — पदयात्राका रिपोर्टहरू",
    sec06Heading: "उच्च हिमालका <span class='font-semibold text-accent'>कथाहरू</span>",
    btnWriteDispatch: "+ नयाँ रिपोर्ट लेख्नुहोस्",
    readJournal: "विवरण पढ्नुहोस्",
    noDispatches: "हालसम्म कुनै रिपोर्टहरू प्रकाशित भएका छैनन्।",
    
    // Legacy & About
    aboutBadge: "भरपर्दो पर्वतारोहण विरासत",
    aboutTitle: "तीस वर्षको उच्च हिमाली अनुभव",
    aboutDesc: "भर्टिकल ओडिसी स्थापनाकालदेखि नै नेपाल, तिब्बत र भुटानमा सुरक्षित र दिगो पर्यटनको नेतृत्व गर्दै आएको छ।",
    aboutFloatingStat: "३०+",
    aboutFloatingLabel: "वर्ष उच्च हिमालको बाटो देखाउँदै",
    
    // Footer
    footerDesc: "सन् २००९ देखि उत्कृष्ट हिमाली अभियानहरू। प्रत्येक मार्ग प्रमाणित IFMGA गाइड र स्थानीय शेर्पाहरूद्वारा सञ्चालित।",
    hqTitle: "[ मुख्य कार्यालय ]",
    rescueTitle: "[ आकस्मिक उद्धार ]",
    regionsTitle: "[ भ्रमण गरिने क्षेत्रहरू ]",
    copyright: "© २०२६ भर्टिकल ओडिसी — सर्वाधिकार सुरक्षित",
    linkRescue: "उद्धार समन्वय",
    linkAcclimatization: "उचाइ अनुकूलन लग",
    
    // Menu
    menuAscentRoute: "आरोहण मार्गहरू",
    menu01: "गृहपृष्ठ (Home)",
    menu02: "अभियानहरू (Expeditions)",
    menu03: "उचाइ सुरक्षा (Safety)",
    menu04: "शेर्पा गाइडहरू (Guides)",
    menu05: "रिपोर्टहरू (Dispatches)",
    menu06: "इरादा घोषणा (Intent)"
  },

  zh: {
    langName: "中文",
    // Admin Bar
    adminTitle: "Himalayan Magic Adventure 控制面板",
    btnEnableEdit: "启用编辑模式",
    adminTip: "双击卡片文本直接编辑。悬停在项目上可进行增删！",
    btnSave: "保存修改",
    btnDiscard: "放弃修改",
    
    // Top Bar & Manifesto
    coordSystem: "[ 坐标网格系统 ]",
    heroBadge: "尼泊尔顶尖高海拔探险专家",
    heroTitlePrimary: "纵向",
    heroTitleItalic: "奥德赛",
    heroDesc: "穿越尼泊尔最高走廊的耐力朝圣之旅。这不是普通度假——而是一场对身体与心灵的升华蜕变。由国际高山向导联合会（IFMGA）认证向导领衔。",
    btnViewExpeditions: "浏览探险路线",
    scrollElevation: "向下滚动探索海拔",
    
    // Stats Matrix
    stats: [
      { value: "30+", label: "年卓越安全传承" },
      { value: "100%", label: "本地认证夏尔巴向导" },
      { value: "保证出发", label: "固定团队定期排期" },
      { value: "生态安全", label: "可持续环保高山徒步" }
    ],
    
    // 02 Expedition Matrix
    sec02Label: "02 — 旗舰远征",
    sec02HeadingPrimary: "选择你的",
    sec02HeadingAccent: "巅峰",
    optAllRegions: "所有区域",
    optNepal: "尼泊尔",
    optTibet: "西藏",
    optBhutan: "不丹",
    optAllDiff: "所有难度",
    optModerate: "中等难度",
    optChallenging: "进阶挑战",
    optStrenuous: "极度艰难",
    btnAddTrek: "+ 新增远征行程",
    lblExpedition: "探险线路",
    lblDuration: "行程天数",
    lblPricing: "官方报价",
    lblDays: "天",
    lblUSD: "美元",
    btnEdit: "编辑",
    btnDelete: "删除",
    noExpeditions: "当前筛选条件下没有匹配的远征线路。",
    
    // 03 Tactical Itinerary
    sec03Label: "04 — 战术路线规划",
    sec03Sub: "遵循海拔剖面图。沿途每一个检查点对高原适应都至关重要。",
    dayPrefix: "第",
    waypointNote: "已校准并适应海拔的高原坐标航点。",
    selectExpeditionPrompt: "请在上方远征矩阵中选择行程以查看详细战术路线。",
    noStagesLogged: "该线路暂无详细阶段记录。",
    
    // 04 Gear Readiness
    sec04Label: "04 — 战术装备清单",
    sec04HeadingPrimary: "装备",
    sec04HeadingAccent: "清单",
    sec04Desc: "清单上的每件物品都经过了十年高原远征的严苛检验。勾选您的装备——整备率即是安全保障。",
    readyRating: "整备进度",
    itemsPacked: "件装备已打包",
    basecampReady: "大本营准备就绪",
    
    // 05 Intent Builder
    sec05Label: "05 — 自定义远征规划器",
    sec05Heading: "声明您的攀登意愿",
    sec05Desc: "每一次壮丽旅程都始于一份庄严声明。请在下方填写您的意愿，我们的远征协调员将与您联系。",
    formIam: "我是",
    formEmail: "我的电子邮箱是",
    formSeeking: "希望攀登",
    formCrew: "团队同行人数为",
    placeholderName: "您的全名",
    placeholderEmail: "电子邮箱",
    optCustomRoute: "定制越野路线",
    btnDeclareIntent: "提交攀登意愿",
    
    // 06 Dispatches
    sec06Label: "06 — 探险前线简报",
    sec06Heading: "来自<span class='font-semibold text-accent'>群山之巅</span>的纪实故事",
    btnWriteDispatch: "+ 撰写探险简报",
    readJournal: "阅读日志",
    noDispatches: "暂无历史简报发布。",
    
    // Legacy & About
    aboutBadge: "值得信赖的登山传奇",
    aboutTitle: "三十年高海拔专业传承",
    aboutDesc: "Himalayan Magic Adventure 自创立以来一直引领着安全、可持续和沉浸式的喜马拉雅探险之旅。",
    aboutFloatingStat: "30+",
    aboutFloatingLabel: "年高海拔向导经验",
    
    // Footer
    footerDesc: "始于 2009 年的顶级喜马拉雅探险。每条路线均由 IFMGA 认证向导和本地夏尔巴专家团队带领。",
    hqTitle: "[ 总部地址 ]",
    rescueTitle: "[ 紧急搜救 ]",
    regionsTitle: "[ 覆盖区域 ]",
    copyright: "© 2026 Himalayan Magic Adventure — 保留所有权利",
    linkRescue: "救援协调中心",
    linkAcclimatization: "海拔适应日志",
    
    // Menu
    menuAscentRoute: "攀登路线导览",
    menu01: "首页 (Home)",
    menu02: "远征线路 (Expeditions)",
    menu03: "高海拔医学安全 (Safety)",
    menu04: "夏尔巴向导传承 (Heritage)",
    menu05: "前线简报 (Dispatches)",
    menu06: "提交意愿 (Intent)"
  }
};

// ==========================================
// 3. GEAR CATEGORIES & ITEMS TRANSLATION
// ==========================================
const gearTranslations = {
  en: {
    categories: {
      "Headwear": "Headwear",
      "Core Body": "Core Body",
      "Footwear": "Footwear",
      "Technical & Safety": "Technical & Safety"
    },
    items: {
      "g1": "UV Sunglasses (Category 3 or 4)",
      "g2": "Warm Fleece Beanie",
      "g3": "Headlamp (200+ lumens) with extra batteries",
      "g4": "Waterproof hard-shell jacket (Gore-Tex)",
      "g5": "Down Jacket (-15C rated)",
      "g6": "Thermal base layers (Merino wool)",
      "g7": "High-ankle waterproof trekking boots",
      "g8": "Thermal mountaineering socks (x4)",
      "g9": "Camp sandals or light down booties",
      "g10": "Four-season sleeping bag (-20C)",
      "g11": "Trekking poles with snow baskets",
      "g12": "Diamox (Altitude sickness medicine)"
    }
  },
  np: {
    categories: {
      "Headwear": "टाउको र अनुहारको सुरक्षा",
      "Core Body": "शरीरको तातो कपडाहरू",
      "Footwear": "जुत्ता र मोजाहरू",
      "Technical & Safety": "प्राविधिक र सुरक्षा उपकरण"
    },
    items: {
      "g1": "यूभी सुरक्षित सनग्लास (क्याटागोरी ३/४)",
      "g2": "न्यानो फ्लिस टोपी (Beanie)",
      "g3": "हेडल्याम्प (२००+ लुमेन्स) अतिरिक्त ब्याट्रीसहित",
      "g4": "वाटरप्रूफ हार्ड-शेल ज्याकेट (Gore-Tex)",
      "g5": "डाउन ज्याकेट (-१५°C सहन सक्ने)",
      "g6": "थर्मल भित्री कपडाहरू (Merino wool)",
      "g7": "वाटरप्रूफ हाई-एङ्कल ट्रेकिङ बुट",
      "g8": "न्यानो पर्वतीय मोजा (४ जोडी)",
      "g9": "क्याम्प स्यान्डल वा हल्का बुटीहरू",
      "g10": "चार-मौसम स्लिपिङ ब्याग (-२०°C)",
      "g11": "ट्रेकिङ पोल्स (Snow basket सहित)",
      "g12": "डायमोक्स (लेक लाग्नबाट जोगिने औषधि)"
    }
  },
  zh: {
    categories: {
      "Headwear": "头部与面部防护",
      "Core Body": "躯干保暖与防护层",
      "Footwear": "高海拔足部装备",
      "Technical & Safety": "专业技术与安全器材"
    },
    items: {
      "g1": "高海拔防紫外线太阳镜（3/4级防护）",
      "g2": "防风保暖抓绒帽",
      "g3": "专业高亮头灯（200+流明）及备用电池",
      "g4": "Gore-Tex 专业防水硬壳冲锋衣",
      "g5": "高蓬松度羽绒服（适应 -15°C）",
      "g6": "美利奴羊毛保暖排汗内衣裤",
      "g7": "高帮防水重装徒步鞋",
      "g8": "专业加厚美利奴登山袜（4双）",
      "g9": "营地轻便拖鞋或羽绒保暖脚套",
      "g10": "四季高海拔充绒睡袋（舒适温度 -20°C）",
      "g11": "碳纤维带雪托专业登山杖",
      "g12": "乙酰唑胺（Diamox 预防高反常备药）"
    }
  }
};

const defaultGearState = [
  { id: "g1", category: "Headwear", checked: false },
  { id: "g2", category: "Headwear", checked: false },
  { id: "g3", category: "Headwear", checked: false },
  { id: "g4", category: "Core Body", checked: false },
  { id: "g5", category: "Core Body", checked: false },
  { id: "g6", category: "Core Body", checked: false },
  { id: "g7", category: "Footwear", checked: false },
  { id: "g8", category: "Footwear", checked: false },
  { id: "g9", category: "Footwear", checked: false },
  { id: "g10", category: "Technical & Safety", checked: false },
  { id: "g11", category: "Technical & Safety", checked: false },
  { id: "g12", category: "Technical & Safety", checked: false }
];

let gearList = JSON.parse(localStorage.getItem('vo_gear_checklist')) || defaultGearState;

// ==========================================
// 4. THEME CONTROLS
// ==========================================
function initTheme() {
  const body = document.body;
  const icon = document.getElementById('theme-icon');
  if (currentTheme === 'light') {
    body.classList.add('light-mode');
    if (icon) icon.className = "fa-solid fa-sun text-sm text-accent";
  } else {
    body.classList.remove('light-mode');
    if (icon) icon.className = "fa-solid fa-moon text-sm";
  }
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('vo_theme', currentTheme);
  initTheme();
}

// ==========================================
// 5. LANGUAGE DROPDOWN CONTROLS
// ==========================================
function toggleLangDropdown() {
  isLangDropdownOpen = !isLangDropdownOpen;
  const menu = document.getElementById('lang-dropdown-menu');
  const chevron = document.getElementById('lang-chevron');
  
  if (isLangDropdownOpen) {
    menu.classList.remove('hidden');
    chevron.classList.add('rotate-180');
  } else {
    menu.classList.add('hidden');
    chevron.classList.remove('rotate-180');
  }
}

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  const wrapper = document.getElementById('lang-dropdown-wrapper');
  if (wrapper && !wrapper.contains(e.target) && isLangDropdownOpen) {
    toggleLangDropdown();
  }
});

function selectLanguage(lang) {
  if (!i18n[lang]) return;
  currentLang = lang;
  localStorage.setItem('vo_lang', lang);
  
  // Close menu
  if (isLangDropdownOpen) toggleLangDropdown();
  
  // Update button label & checkmark icons
  const langLabel = document.getElementById('current-lang-label');
  if (langLabel) langLabel.innerText = i18n[lang].langName;

  ['en', 'np', 'zh'].forEach(l => {
    const checkIcon = document.getElementById(`check-lang-${l}`);
    if (checkIcon) {
      if (l === lang) {
        checkIcon.classList.remove('hidden');
      } else {
        checkIcon.classList.add('hidden');
      }
    }
  });

  // Re-render UI
  applyLanguageUI();
}

// ==========================================
// 6. MULTILINGUAL UI APPLICATION
// ==========================================
function applyLanguageUI() {
  const t = i18n[currentLang] || i18n.en;
  
  // 1. Language Dropdown Button Label
  const langLabel = document.getElementById('current-lang-label');
  if (langLabel) langLabel.innerText = t.langName;

  // 2. Admin Bar
  const adminTitleEl = document.querySelector('#admin-bar span.font-mono');
  if (adminTitleEl) adminTitleEl.innerText = t.adminTitle;
  const btnEditMode = document.getElementById('btn-edit-mode');
  if (btnEditMode) btnEditMode.innerHTML = `<i class="fa-solid fa-pen-to-square mr-1"></i> ${t.btnEnableEdit}`;

  // 3. Manifesto & Hero
  const coordEl = document.querySelector('#manifesto span.font-mono');
  if (coordEl) coordEl.innerText = t.coordSystem;
  
  // Check if user has custom edited hero; if default, use translated version
  if (!siteData || !siteData.isCustomEdited) {
    const hBadge = document.getElementById('hero-badge');
    if (hBadge) hBadge.innerText = t.heroBadge;
    const hPrimary = document.getElementById('hero-title-primary');
    if (hPrimary) hPrimary.innerText = t.heroTitlePrimary;
    const hItalic = document.getElementById('hero-title-italic');
    if (hItalic) hItalic.innerText = t.heroTitleItalic;
    const hDesc = document.getElementById('hero-description');
    if (hDesc) hDesc.innerText = t.heroDesc;
  }

  // 4. Section Headers & Navigation
  const matrixLabel = document.querySelector('#expeditions span.text-accent');
  if (matrixLabel) matrixLabel.innerText = t.sec02Label;
  const matrixHeading = document.querySelector('#expeditions h2');
  if (matrixHeading) matrixHeading.innerHTML = `${t.sec02HeadingPrimary} <br><span class="font-semibold text-accent">${t.sec02HeadingAccent}</span>`;

  const btnAddTrek = document.querySelector('#add-trek-panel button');
  if (btnAddTrek) btnAddTrek.innerText = t.btnAddTrek;

  // 5. Tactical Itinerary
  const itinLabel = document.querySelector('#itinerary span.text-accent');
  if (itinLabel) itinLabel.innerText = t.sec03Label;
  const itinSub = document.querySelector('#itinerary p.text-muted-foreground');
  if (itinSub) itinSub.innerText = t.sec03Sub;

  // 6. Gear Checklist / Manifest
  const gearLabel = document.querySelector('#gear span.text-accent');
  if (gearLabel) gearLabel.innerText = t.sec04Label || "04 — The Loadout";
  const gearHeading = document.querySelector('#gear h2');
  if (gearHeading) gearHeading.innerHTML = `${t.sec04HeadingPrimary} <span class="font-semibold text-accent">${t.sec04HeadingAccent}</span>`;
  const gearDesc = document.querySelector('#gear p.text-muted-foreground');
  if (gearDesc) gearDesc.innerText = t.sec04Desc;

  // 8. Dispatches
  const dispLabel = document.getElementById('dispatches-label');
  if (dispLabel) dispLabel.innerText = t.sec06Label;
  const dispHeading = document.querySelector('#dispatches h2');
  if (dispHeading) dispHeading.innerHTML = t.sec06Heading;
  const btnWriteDisp = document.getElementById('btn-add-dispatch');
  if (btnWriteDisp) btnWriteDisp.innerText = t.btnWriteDispatch;

  // 9. About Section
  const abBadge = document.getElementById('about-badge');
  if (abBadge) abBadge.innerText = t.aboutBadge;
  const abTitle = document.getElementById('about-title');
  if (abTitle) abTitle.innerText = t.aboutTitle;
  const abDesc = document.getElementById('about-description');
  if (abDesc) abDesc.innerText = t.aboutDesc;
  const abLabel = document.getElementById('about-floating-label');
  if (abLabel) abLabel.innerText = t.aboutFloatingLabel;

  // 10. Footer Titles
  const ftHq = document.getElementById('footer-hq-title');
  if (ftHq) ftHq.innerText = t.hqTitle;
  const ftRescue = document.getElementById('footer-rescue-title');
  if (ftRescue) ftRescue.innerText = t.rescueTitle;
  const ftRegions = document.getElementById('footer-regions-title');
  if (ftRegions) ftRegions.innerText = t.regionsTitle;

  // 11. Navigation menu is now shared (menu.js) — no per-language overwrite.

  // Re-render dynamic lists with active language
  renderStats();
  renderFlagshipPeaks();
  filterTreks();
  renderGearChecklist();
  renderDispatches();
}

/* ==========================================================================
   SECTION 02 — FLAGSHIP EXPEDITIONS
   Renders the best-selling eight-thousanders (from mountains.js) into
   #flagship-grid on the homepage. Each tile links to its /expeditions/<slug>
   page. Data-driven: mark a peak with `bestseller: <n>` in mountains.js.
   ========================================================================== */
function renderFlagshipPeaks() {
  const grid = document.getElementById('flagship-grid');
  if (!grid || !window.MOUNTAINS) return;

  const peaks = Object.keys(window.MOUNTAINS)
    .map(k => window.MOUNTAINS[k])
    .filter(m => m.bestseller)
    .sort((a, b) => a.bestseller - b.bestseller);

  if (!peaks.length) { grid.classList.add('hidden'); return; }
  grid.classList.remove('hidden');

  grid.innerHTML = peaks.map((m, i) => {
    const elev = m.elevationLabel || ((m.elevationM || 0).toLocaleString() + ' m');
    const season = (m.season && m.season.primary) || '';
    const seasonWin = (m.season && m.season.window) || '';
    const firstYear = (m.firstAscent && m.firstAscent.year) || '—';
    // A 1–5 "commitment" read, averaged from the comparative difficulty profile.
    const d = m.difficulty || {};
    const dvals = ['technical', 'altitude', 'exposure', 'weather', 'objectiveHazard']
      .map(k => d[k]).filter(v => typeof v === 'number');
    const commit = dvals.length ? Math.round(dvals.reduce((a, b) => a + b, 0) / dvals.length) : 0;
    const pips = commit
      ? '<span class="tracking-[0.15em] text-accent">' + '●'.repeat(commit) +
        '<span class="text-muted-foreground/40">' + '○'.repeat(5 - commit) + '</span></span>'
      : '<span class="text-muted-foreground">—</span>';
    // Show only the first three on mobile — a six-card swipe gets tedious on a phone.
    const extra = i >= 3 ? ' hme-flag-extra' : '';

    return `
    <a href="/expeditions/${escapeHtml(m.slug)}" aria-label="${escapeHtml(m.name + ' expedition — ' + elev + ', ' + m.countryLabel)}"
       class="hme-flag${extra} group relative block h-[440px] w-[290px] sm:w-[320px] shrink-0 snap-start overflow-hidden border border-border bg-[#181a1e] transition-all duration-500 hover:border-accent hover:shadow-2xl hover:-translate-y-1 focus:outline-none focus-visible:border-accent">
      <div class="absolute inset-0 z-0 bg-cover bg-center opacity-45 group-hover:opacity-30 scale-100 group-hover:scale-105 transition-all duration-700 ease-out" style="background-image:url('${escapeHtml(m.heroImage)}')"></div>
      <div class="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-[#181a1e] via-[#181a1e]/78 to-[#181a1e]/20"></div>
      <span class="absolute top-4 left-4 z-10 bg-black/45 border border-white/15 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white">#${m.rank} <span class="text-white/50">/ 14</span></span>
      ${season ? `<span class="absolute top-4 right-4 z-10 bg-accent/90 px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-background">${escapeHtml(season)}</span>` : ''}
      <div class="relative z-10 flex h-full flex-col justify-end p-6">
        <span class="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">${escapeHtml(m.range)}</span>
        <div class="mt-1 flex items-end gap-1.5">
          <span class="font-heading text-[2.9rem] md:text-5xl font-normal leading-none tracking-tightest text-accent">${escapeHtml(elev.replace(/\s*m$/i, ''))}</span>
          <span class="mb-1 font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground leading-tight">m</span>
        </div>
        <h3 class="mt-1.5 font-heading text-3xl md:text-[2rem] font-medium uppercase tracking-tightest text-foreground group-hover:text-accent transition-colors leading-[0.95]">${escapeHtml(m.name)}</h3>
        ${m.aka ? `<span class="mt-1 block font-mono text-[10px] tracking-wide text-muted-foreground/80">${escapeHtml(m.aka)}</span>` : ''}
        <p class="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground line-clamp-2">${escapeHtml(m.tagline || '')}</p>
        <div class="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-border/70 pt-3 font-mono text-[9px] uppercase tracking-[0.12em]">
          <span class="text-muted-foreground/70">First climbed</span>
          <span class="text-right text-foreground/90">${escapeHtml(String(firstYear))}</span>
          <span class="text-muted-foreground/70">Commitment</span>
          <span class="text-right">${pips}</span>
          <span class="text-muted-foreground/70">Window</span>
          <span class="text-right text-foreground/90 truncate">${escapeHtml(seasonWin || '—')}</span>
        </div>
        <div class="mt-3 flex items-center justify-between gap-3 border-t border-border/70 pt-3">
          <span class="font-mono text-[10px] uppercase tracking-widest text-muted-foreground truncate">${escapeHtml(m.countryLabel)}</span>
          <span class="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent shrink-0">Explore <i class="fa-solid fa-arrow-right text-[9px] transition-transform group-hover:translate-x-1"></i></span>
        </div>
      </div>
    </a>`;
  }).join('');

  updateFlagshipNav();
  grid.removeEventListener('scroll', updateFlagshipNav);
  grid.addEventListener('scroll', updateFlagshipNav, { passive: true });
}

function scrollFlagship(dir) {
  const g = document.getElementById('flagship-grid');
  if (!g) return;
  const card = g.querySelector('a.hme-flag');
  const step = (card ? card.getBoundingClientRect().width + 20 : 340) * dir;
  const target = Math.max(0, Math.min(g.scrollLeft + step, g.scrollWidth - g.clientWidth));
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  g.scrollTo({ left: target, behavior: reduce ? 'auto' : 'smooth' });
  setTimeout(updateFlagshipNav, 400);
}

function updateFlagshipNav() {
  const g = document.getElementById('flagship-grid');
  if (!g) return;
  const prev = document.querySelector('.hme-flag-nav[aria-label="Previous peaks"]');
  const next = document.querySelector('.hme-flag-nav[aria-label="More peaks"]');
  const max = g.scrollWidth - g.clientWidth - 4;
  if (prev) prev.toggleAttribute('disabled', g.scrollLeft <= 4);
  if (next) next.toggleAttribute('disabled', g.scrollLeft >= max);
}

// ==========================================
// 7. DATA LOADING & DATABASE SYNCHRONIZATION
// ==========================================
async function loadContent() {
  try {
    const response = await fetch('/api/content');
    if (!response.ok) throw new Error("Failed to read content database.");
    siteData = await response.json();

    // Default sample dispatches if not in db
    if (!siteData.dispatches) {
      siteData.dispatches = [
        {
          title: "The Acclimatization Philosophy",
          date: "August 15, 2026",
          category: "SAFETY GUIDE",
          excerpt: "Why we require a mandatory two-day rest buffer at Namche Bazaar. Insights from IFMGA expedition leaders.",
          img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400"
        },
        {
          title: "Crossing The Thorong La Pass",
          date: "August 02, 2026",
          category: "EXPEDITION LOG",
          excerpt: "A tactical log of wind conditions, sunrise timing, and path conditions at 5,416 meters during early season.",
          img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=400"
        }
      ];
    }

    originalData = JSON.parse(JSON.stringify(siteData));

    if (siteData.packages && siteData.packages.length > 0) {
      selectedTrekId = siteData.packages[0].id;
    }

    renderWebsite();
  } catch (error) {
    console.error("[!] Error loading content:", error);
  }
}

// Render complete website
function renderWebsite() {
  if (!siteData) return;

  // Contact details
  document.getElementById('contact-phones').innerText = siteData.contact.phones || "";
  document.getElementById('contact-emergency').innerText = siteData.contact.emergency || "";
  document.getElementById('contact-email').innerText = siteData.contact.email || "";
  document.getElementById('contact-address').innerText = siteData.contact.address || "";
  document.getElementById('contact-regions').innerText = siteData.contact.regions || "";

  // About Image
  if (siteData.about && siteData.about.image) {
    document.getElementById('about-image').src = siteData.about.image;
    document.getElementById('about-img-input').value = siteData.about.image;
  }

  // Apply multilingual mappings
  applyLanguageUI();

  // Attach WYSIWYG editing listeners if in edit mode
  applyEditModeAttributes();
}

// Render Stats Grid
function renderStats() {
  const statsGrid = document.getElementById('stats-grid');
  if (!statsGrid) return;
  statsGrid.innerHTML = '';

  const t = i18n[currentLang] || i18n.en;
  const statsList = t.stats || siteData.stats || [];

  statsList.forEach((stat, idx) => {
    const div = document.createElement('div');
    div.className = "border-r border-border p-8 text-center last:border-r-0";
    div.innerHTML = `
      <div class="font-heading text-4xl sm:text-5xl font-light text-accent mb-1 cursor-text" 
           data-stat-idx="${idx}" data-field="value">${escapeHtml(stat.value)}</div>
      <div class="font-mono text-[9px] uppercase tracking-widest text-muted-foreground cursor-text" 
           data-stat-idx="${idx}" data-field="label">${escapeHtml(stat.label)}</div>
    `;
    statsGrid.appendChild(div);
  });
}

const defaultFallbackPackages = [
  {
    id: "ebc-12",
    name: "Everest Base Camp",
    title: "Everest Base Camp",
    altitude: 5364,
    summary: "The classic pilgrimage to the foot of Sagarmatha.",
    dest: "nepal",
    days: 12,
    grade: "IV",
    region: "Khumbu",
    difficulty: "Challenging",
    img: "/images/ebc.png"
  },
  {
    id: "annapurna-16",
    name: "Annapurna Circuit",
    title: "Annapurna Circuit",
    altitude: 5416,
    summary: "A circular traverse crossing the Thorong La pass.",
    dest: "nepal",
    days: 16,
    grade: "III",
    region: "Annapurna",
    difficulty: "Challenging",
    img: "/images/annapurna.png"
  },
  {
    id: "manaslu-18",
    name: "Manaslu Circuit",
    title: "Manaslu Circuit",
    altitude: 5106,
    summary: "A remote restricted-zone loop around the spirit mountain.",
    dest: "nepal",
    days: 18,
    grade: "IV",
    region: "Manaslu",
    difficulty: "Strenuous",
    img: "/images/manaslu.png"
  }
];

// Render & Filter Treks
function filterTreks() {
  const destEl = document.getElementById('search-dest');
  const diffEl = document.getElementById('search-diff');
  const destVal = destEl ? destEl.value.toLowerCase().trim() : 'all';
  const diffVal = diffEl ? diffEl.value.toLowerCase().trim() : 'all';
  const t = i18n[currentLang] || i18n.en;

  const trekGrid = document.getElementById('trek-grid');
  if (!trekGrid) {
    // Section 02 now hosts the flagship-expeditions grid, not the trek carousel.
    // Keep the Tactical Itinerary section (04) alive with a default selection.
    if (!selectedTrekId) {
      const pk = (siteData && siteData.packages && siteData.packages[0]) || (typeof defaultFallbackPackages !== 'undefined' && defaultFallbackPackages[0]);
      if (pk) selectedTrekId = pk.id;
    }
    if (typeof filterTrekFinder === 'function') filterTrekFinder();
    renderItinerary();
    return;
  }

  const pkgList = (siteData && siteData.packages && siteData.packages.length > 0)
    ? siteData.packages
    : defaultFallbackPackages;

  const filtered = pkgList.filter(p => {
    const matchDest = destVal === 'all' || destVal.includes('all') || (p.dest && p.dest.toLowerCase() === destVal);
    const matchDiff = diffVal === 'all' || diffVal.includes('all') || diffVal.includes('any') || (p.difficulty && p.difficulty.toLowerCase() === diffVal);
    return matchDest && matchDiff;
  });

  if (filtered.length === 0) {
    trekGrid.innerHTML = `
      <div class="w-full py-12 text-center text-muted-foreground text-xs font-mono">
        ${t.noExpeditions}
      </div>
    `;
    return;
  }

  trekGrid.innerHTML = '';

  filtered.forEach((p, idx) => {
    const card = document.createElement('article');
    const isSelected = selectedTrekId === p.id;
    card.className = `group relative flex h-[620px] md:h-[76vh] w-[88vw] sm:w-[60vw] md:w-[42vw] lg:w-[36vw] shrink-0 snap-center cursor-pointer flex-col justify-between overflow-hidden border border-border bg-[#181a1e] p-8 md:p-10 transition-all duration-500 hover:border-accent hover:shadow-2xl ${isSelected ? 'border-accent ring-1 ring-accent bg-[#1d2025]' : ''}`;
    
    card.onclick = (e) => {
      if (e.target.closest('.action-btn')) return;
      selectTrek(p.id);
    };

    const altVal = p.altitude || parseInt(p.maxAlt) || 5364;
    const indexFormatted = String(idx + 1).padStart(2, '0');
    const totalFormatted = String(filtered.length).padStart(2, '0');
    const summaryText = p.summary || `The classic pilgrimage across the high ridges of ${p.region || 'Nepal'}.`;
    const gradeVal = p.grade || (p.difficulty === 'Moderate' ? 'III' : (p.difficulty === 'Strenuous' ? 'V' : 'IV'));
    const regionVal = p.region || (p.dest ? p.dest.charAt(0).toUpperCase() + p.dest.slice(1) : 'Khumbu');

    card.innerHTML = `
      <!-- Topographic Contour Subtle Overlay -->
      <div class="pointer-events-none absolute inset-0 z-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent"></div>
      <div class="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full border border-white/5 opacity-40"></div>
      <div class="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full border border-white/5 opacity-40"></div>
      <div class="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full border border-accent/10 opacity-60"></div>

      <!-- 3D Mountain Video & Photography Hover Layers -->
      <div class="absolute inset-0 z-0 bg-cover bg-center opacity-30 group-hover:opacity-10 scale-100 group-hover:scale-105 transition-all duration-700 ease-out" style="background-image: url('${p.img}')"></div>
      <video autoplay loop muted playsinline class="absolute inset-0 z-0 h-full w-full object-cover opacity-0 group-hover:opacity-85 scale-100 group-hover:scale-105 transition-all duration-700 ease-out [filter:contrast(1.08)_saturate(1.05)]">
        <source src="${p.video || '/videos/hero.mp4'}" type="video/mp4">
        <source src="/videos/hero.mp4" type="video/mp4">
      </video>
      <div class="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-[#181a1e] via-[#181a1e]/85 to-[#181a1e]/40"></div>
      
      <!-- Top Row: Counter & Minimalist Dot -->
      <div class="relative z-10 flex items-center justify-between">
        <span class="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">${indexFormatted} &nbsp;/&nbsp; ${totalFormatted}</span>
        <div class="flex items-center gap-3">
          ${isEditMode ? `
            <button onclick="openEditTrekModal('${p.id}')" class="action-btn px-2 py-0.5 border border-accent bg-background/90 hover:bg-accent hover:text-background text-[8px] tracking-widest font-mono text-accent">${t.btnEdit}</button>
            <button onclick="deleteTrek('${p.id}')" class="action-btn px-2 py-0.5 border border-red-500 bg-background/90 hover:bg-red-500 hover:text-white text-[8px] tracking-widest font-mono text-red-500">${t.btnDelete}</button>
          ` : ''}
          <span class="block h-2.5 w-2.5 rounded-full bg-accent transition-transform duration-300 group-hover:scale-125"></span>
        </div>
      </div>

      <!-- Middle & Bottom Content -->
      <div class="relative z-10 flex flex-col justify-end flex-grow pt-10">
        <!-- Giant Peak Altitude -->
        <div class="mb-4 flex items-end gap-3">
          <span class="font-heading text-8xl md:text-9xl font-normal leading-none tracking-tightest text-accent">${altVal}</span>
          <span class="mb-2 font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground leading-tight">M<br>PEAK</span>
        </div>

        <!-- Big Bold Uppercase Trek Title -->
        <h3 class="mb-3 font-heading text-4xl sm:text-5xl md:text-6xl font-medium uppercase tracking-tightest text-foreground group-hover:text-accent transition-colors leading-[0.95]">${escapeHtml(p.name || p.title)}</h3>

        <!-- Clear Mono Summary -->
        <p class="mb-8 max-w-sm font-mono text-xs sm:text-sm leading-relaxed text-muted-foreground">${escapeHtml(summaryText)}</p>

        <!-- 3-Column Specifications Row (Bigger, High Contrast) -->
        <div class="grid grid-cols-3 gap-4 border-t border-border/80 pt-6">
          <div>
            <span class="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-light">DURATION</span>
            <span class="font-heading text-2xl md:text-3xl text-foreground font-normal tracking-tight mt-1 block">${p.days}d</span>
          </div>
          <div>
            <span class="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-light">GRADE</span>
            <span class="font-heading text-2xl md:text-3xl text-foreground font-normal tracking-tight mt-1 block">${escapeHtml(gradeVal)}</span>
          </div>
          <div>
            <span class="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-light">REGION</span>
            <span class="font-heading text-2xl md:text-3xl text-foreground font-normal tracking-tight mt-1 block">${escapeHtml(regionVal)}</span>
          </div>
        </div>
      </div>
    `;

    trekGrid.appendChild(card);
  });

  // Append custom route card
  const customCard = document.createElement('div');
  customCard.className = 'flex w-[78vw] md:w-[20vw] shrink-0 snap-center items-center justify-center';
  customCard.innerHTML = `
    <a href="/contact" class="group flex flex-col items-center gap-4 text-center">
      <span class="flex h-16 w-16 items-center justify-center rounded-full border border-accent/40 font-heading text-2xl text-accent transition-all group-hover:scale-110 group-hover:border-accent group-hover:bg-accent/10">+</span>
      <span class="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">Inquire for<br>custom routes</span>
    </a>
  `;
  trekGrid.appendChild(customCard);

  filterTrekFinder();
  renderItinerary();
}

// ===========================================================================
// FIND YOUR TREK — rules-based recommender (no AI).
// Scores every trail in window.TREKS against the visitor's answers and shows
// the top matches with a % and a plain explanation of the reasoning.
// ===========================================================================
const finderState = { experience: null, region: null, season: null, duration: null, budget: null, style: [] };

const FINDER_CONTAINERS = {
  experience: 'finder-experience-cards',
  region: 'finder-region-cards',
  season: 'finder-season-cards',
  duration: 'finder-duration-cards',
  budget: 'finder-budget-cards',
  style: 'finder-style-cards'
};

function selectFinderCard(group, value) {
  const container = document.getElementById(FINDER_CONTAINERS[group]);
  if (!container) return;

  if (group === 'style') {
    const i = finderState.style.indexOf(value);
    if (i > -1) finderState.style.splice(i, 1); else finderState.style.push(value);
  } else {
    finderState[group] = (finderState[group] === value) ? null : value;
  }

  container.querySelectorAll('.finder-card').forEach((btn) => {
    const on = group === 'style'
      ? finderState.style.indexOf(btn.dataset.value) > -1
      : btn.dataset.value === finderState[group];
    btn.classList.toggle('border-accent', on);
    btn.classList.toggle('ring-1', on);
    btn.classList.toggle('ring-accent', on);
    btn.classList.toggle('bg-accent/5', on);
    btn.classList.toggle('text-foreground', on && !btn.querySelector('.finder-card-title'));
    const title = btn.querySelector('.finder-card-title');
    if (title) title.classList.toggle('text-accent', on);
  });

  filterTrekFinder();
}

const FINDER_CULTURAL = ['upper-mustang', 'tsum-valley', 'tamang-heritage-trail', 'helambu-circuit',
  'lumbini-pilgrimage-circuit', 'janakpur-temple-circuit', 'rolpa-rukum-hill-trail', 'bardiya-national-park-safari'];

function finderTrailModel() {
  const T = window.TREKS || {};
  const P = window.TREK_PROVINCES || {};
  const firstInt = (s) => { const m = String(s || '').replace(/,/g, '').match(/\d+/); return m ? +m[0] : null; };
  return Object.keys(T).map((slug) => {
    const t = T[slug], s = t.stats || {}, su = t.suitability || {};
    const bs = (s.bestSeason || '').toLowerCase();
    const ovr = (t.overview || []).join(' ').toLowerCase();
    const region = (t.region || (P[t.province] && P[t.province].name) || '').toLowerCase();
    const hi = (t.highlights || []).join(' ').toLowerCase();
    const pr = (t.cost && t.cost.tiers && t.cost.tiers[0] && t.cost.tiers[0].rangeUSD) || '';
    const pm = pr.match(/\$[\d,]+/);
    const diff = (s.difficulty || '').toLowerCase();
    const tags = {
      everest: /khumbu|everest/.test(region),
      annapurna: /annapurna/.test(region),
      langtang: /langtang|helambu|gosaikunda/.test(region) || ['langtang-valley', 'gosaikunda', 'helambu-circuit', 'tamang-heritage-trail'].indexOf(slug) > -1,
      manaslu: /manaslu|mansiri|tsum|ganesh/.test(region) || ['manaslu-circuit', 'tsum-valley', 'ganesh-himal-trek'].indexOf(slug) > -1,
      mustang: /mustang/.test(region) || slug === 'upper-mustang',
      dolpo: /dolpo|phoksundo/.test(region) || ['upper-dolpo', 'lower-dolpo', 'shey-phoksundo-lake'].indexOf(slug) > -1,
      farwest: /humla|far.?west|api|saipal|khaptad|rara|limi/.test(region) || ['rara-lake-trek', 'limi-valley'].indexOf(slug) > -1
    };
    return {
      slug: slug,
      name: t.name.replace(/ Trek$/, ''),
      region: t.region || (P[t.province] && P[t.province].name) || '',
      province: (P[t.province] && P[t.province].name || '').replace(' Province', ''),
      difficulty: s.difficulty || '',
      days: firstInt(s.duration),
      maxAlt: s.maxAltitude || '',
      maxAltM: firstInt(s.maxAltitude),
      img: t.heroImage || '/images/hero-mountain.jpg',
      priceFrom: pm ? +pm[0].replace(/[$,]/g, '') : null,
      perDay: /per day/i.test(pr),
      tags: tags,
      remoteness: su.remoteness || 0,
      physical: su.physical || 0,
      technical: su.technical || 0,
      altitudeScore: su.altitude || 0,
      popular: !!t.popular,
      hasPass: Array.isArray(t.passes) && t.passes.length > 0,
      cultural: FINDER_CULTURAL.indexOf(slug) > -1 || /pilgrimage|heritage|monaster|walled city|mustang|tsum/.test(hi + ' ' + ovr),
      scenic: !!t.popular || (firstInt(s.maxAltitude) || 0) >= 4500 || /lake|glacier|panorama|viewpoint|amphitheat|sanctuary/.test(hi),
      season: {
        Spring: /(mar|apr|may)/.test(bs),
        Summer: /(jun|jul|aug|monsoon|mid-may)/.test(bs) || /rain-shadow/.test(ovr),
        Autumn: /(sep|oct|nov)/.test(bs),
        Winter: /(dec|jan|feb|year-round|oct.?may)/.test(bs)
      },
      diffLc: diff
    };
  });
}

function finderCriteria() {
  const st = finderState, c = [];
  if (st.experience) {
    c.push({ key: 'experience', w: 1.0, test: (m) => {
      if (st.experience === 'first') return /easy|moderate/.test(m.diffLc) && !/challenging|strenuous/.test(m.diffLc) && m.altitudeScore <= 8 && m.technical <= 2;
      if (st.experience === 'experienced') return /moderate|challenging/.test(m.diffLc);
      return /challenging|strenuous/.test(m.diffLc) || m.technical >= 3 || m.hasPass;
    }});
  }
  if (st.region) c.push({ key: 'region', w: 1.3, hard: true, test: (m) => !!m.tags[st.region] });
  if (st.season) c.push({ key: 'season', w: 0.8, hard: true, test: (m) => !!m.season[st.season] });
  if (st.duration) {
    const d = st.duration;
    c.push({ key: 'duration', w: 1.0, hard: true, test: (m) => m.days != null && (
      d === 'short' ? m.days <= 10 :
      d === 'mid' ? m.days >= 10 && m.days <= 15 :
      d === 'long' ? m.days >= 15 && m.days <= 20 :
      m.days >= 20) });
  }
  if (st.budget) {
    const b = st.budget;
    c.push({ key: 'budget', w: 0.9, hard: true, test: (m) => {
      const v = m.perDay ? (m.priceFrom || 0) * (m.days || 7) : m.priceFrom;
      if (v == null) return false;
      return b === 'b1' ? v < 1000 : b === 'b2' ? v >= 1000 && v < 2000 : b === 'b3' ? v >= 2000 && v < 3500 : v >= 3500;
    }});
  }
  (st.style || []).forEach((s) => {
    c.push({ key: 'style:' + s, w: 1.1, test: (m) => {
      if (s === 'iconic') return m.popular;
      if (s === 'remote') return m.remoteness >= 7;
      if (s === 'culture') return m.cultural;
      if (s === 'challenge') return /challenging|strenuous/.test(m.diffLc) || m.hasPass || m.physical >= 8;
      if (s === 'photo') return m.scenic;
      if (s === 'slow') return m.physical <= 6 && !/strenuous/.test(m.diffLc) && (m.days || 0) >= 7 && m.remoteness <= 7;
      return false;
    }});
  });
  return c;
}

const FINDER_LABELS = {
  experience: { first: 'a first Himalayan trek', experienced: 'trekking experience', alpinist: 'technical comfort' },
  region: { everest: 'the Everest region', annapurna: 'the Annapurna region', langtang: 'the Langtang region', manaslu: 'the Manaslu region', mustang: 'Mustang', dolpo: 'Dolpo', farwest: 'the Far West' },
  duration: { short: '5–10 days', mid: '10–15 days', long: '15–20 days', epic: '20+ days' },
  budget: { b1: 'a budget under $1,000', b2: 'a $1,000–$2,000 budget', b3: 'a $2,000–$3,500 budget', b4: 'a $3,500+ budget' },
  style: { iconic: 'iconic Himalayan scenery', remote: 'remote wilderness', culture: 'cultural depth', challenge: 'a challenging adventure', photo: 'photography', slow: 'a slower pace' }
};
function finderCritLabel(key) {
  if (key === 'season') return 'a ' + (finderState.season || '').toLowerCase() + ' departure';
  if (key.indexOf('style:') === 0) return FINDER_LABELS.style[key.slice(6)];
  var g = key;
  return (FINDER_LABELS[g] || {})[finderState[g]] || g;
}

function filterTrekFinder() {
  const resultsEl = document.getElementById('finder-results');
  const countEl = document.getElementById('finder-count');
  const resetBtn = document.getElementById('finder-reset-btn');
  if (!resultsEl) return;

  const model = finderTrailModel();
  const crit = finderCriteria();
  const active = crit.length;

  if (resetBtn) resetBtn.classList.toggle('hidden', active === 0);

  if (!model.length) {
    resultsEl.innerHTML = '<div class="py-10 text-center font-mono text-xs text-muted-foreground">Trail directory unavailable. <a href="/treks" class="text-accent underline">Browse all trekking trails →</a></div>';
    if (countEl) countEl.innerText = 'BROWSE ALL TRAILS';
    return;
  }

  if (active === 0) {
    resultsEl.innerHTML = '<div class="border border-dashed border-border/70 py-12 px-6 text-center">' +
      '<span class="block font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">No answers yet</span>' +
      '<p class="mt-3 font-mono text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">Pick an answer to any question above and your top matches appear here, scored and explained.</p>' +
      '</div>';
    if (countEl) countEl.innerText = 'Answer a question above to see your matches';
    return;
  }

  const totalW = crit.reduce((a, c) => a + c.w, 0);
  // Denominator floor: with only one or two answers a perfect pass should
  // not read as "100% match" — spread the scale so a full match lands high
  // (mid-80s to mid-90s) rather than pinned at 100.
  const denom = Math.max(totalW + 0.7, 2.4);
  const scored = model.map((m) => {
    let got = 0, hardFail = 0; const passed = [];
    crit.forEach((c) => {
      if (c.test(m)) { got += c.w; passed.push(c.key); }
      else if (c.hard) hardFail++;
    });
    let pct = Math.round(got / denom * 100);
    if (pct > 97) pct = 97;
    return { m: m, pct: pct, hardFail: hardFail, passed: passed };
  }).sort((a, b) =>
    a.hardFail - b.hardFail ||
    b.pct - a.pct ||
    (b.m.popular ? 1 : 0) - (a.m.popular ? 1 : 0) ||
    (a.m.days || 99) - (b.m.days || 99)
  );

  // Prefer trails that break none of the concrete constraints (region,
  // season, length, budget); relax step by step only if nothing qualifies.
  let matches = scored.filter((s) => s.hardFail === 0 && s.pct >= 40);
  if (matches.length < 3) matches = scored.filter((s) => s.hardFail === 0);
  if (matches.length < 3) matches = scored.filter((s) => s.hardFail <= 1);
  if (!matches.length) matches = scored.slice(0, 3);
  matches = matches.slice(0, 6);

  if (countEl) countEl.innerText = 'Based on your answers, we found ' + matches.length + ' trek' + (matches.length === 1 ? '' : 's');

  const top = matches[0];
  const rest = matches.slice(1);
  const altShort = (s) => (s || '').replace(/^[≈~\s]+/, '').split('(')[0].trim();

  const strength = top.pct >= 80 ? 'Strong match' : top.pct >= 55 ? 'Good match' : 'Closest we have';
  const reasons = top.passed.slice(0, 3).map(finderCritLabel).filter(Boolean);
  const lead = top.pct >= 80 ? 'This is a strong match because you selected '
    : top.pct >= 55 ? 'This is a good match because you selected '
    : 'This is the closest we have — it matches on ';
  let why;
  if (!reasons.length) {
    why = 'It is the closest trail we have to what you asked for, though it does not tick every box — open the full guide to see the detail.';
  } else if (reasons.length === 1) {
    why = lead + reasons[0] + '.';
  } else {
    why = lead + reasons.slice(0, -1).join(', ') + ' and ' + reasons[reasons.length - 1] + '.';
  }
  if (top.hardFail) why += ' It falls outside one of your filters — check the details before you commit.';
  const dayLabel = (n) => n == null ? '—' : n + (n === 1 ? ' day' : ' days');

  resultsEl.innerHTML =
    '<a href="/treks/' + escapeHtml(top.m.slug) + '" class="group block border border-accent/40 bg-[#1b1e22] overflow-hidden">' +
      '<div class="grid md:grid-cols-[240px_1fr]">' +
        '<div class="relative h-44 md:h-full overflow-hidden"><img src="' + escapeHtml(top.m.img) + '" alt="' + escapeHtml(top.m.name) + '" class="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"><div class="absolute inset-0 bg-gradient-to-t from-[#1b1e22]/70 to-transparent"></div></div>' +
        '<div class="p-6 md:p-8">' +
          '<div class="flex items-start justify-between gap-4">' +
            '<span class="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Your top match</span>' +
            '<span class="shrink-0 border border-accent px-3 py-1 font-heading text-lg text-accent leading-none">' + top.pct + '% <span class="text-[9px] font-mono tracking-widest align-middle">match</span></span>' +
          '</div>' +
          '<h3 class="mt-2 font-heading text-3xl md:text-4xl uppercase tracking-tight text-white leading-none group-hover:text-accent transition-colors">' + escapeHtml(top.m.name) + '</h3>' +
          '<span class="mt-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">' + escapeHtml(top.m.region) + ' · ' + escapeHtml(top.m.province) + ' · ' + escapeHtml(strength) + '</span>' +
          '<div class="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[11px] text-foreground/90">' +
            '<span><span class="text-muted-foreground">' + dayLabel(top.m.days) + '</span></span>' +
            '<span><span class="text-muted-foreground">' + escapeHtml(top.m.difficulty) + '</span></span>' +
            '<span class="text-accent">' + escapeHtml(altShort(top.m.maxAlt)) + '</span>' +
          '</div>' +
          '<p class="mt-4 font-sans text-[13px] text-muted-foreground leading-relaxed max-w-lg">' + escapeHtml(why) + '</p>' +
          '<span class="mt-5 inline-flex items-center gap-2 border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground group-hover:border-accent group-hover:text-accent transition-all">Open the full guide →</span>' +
        '</div>' +
      '</div>' +
    '</a>' +
    (rest.length ? '<span class="mt-8 mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Other matches</span>' +
      '<div class="divide-y divide-border border-t border-border">' + rest.map((s) => {
        return '<a href="/treks/' + escapeHtml(s.m.slug) + '" class="group flex items-center justify-between gap-4 py-4 px-2 -mx-2 hover:bg-card/40 transition-colors">' +
          '<div class="flex items-baseline gap-4 min-w-0">' +
            '<span class="w-12 shrink-0 font-heading text-xl text-accent tabular-nums">' + s.pct + '%</span>' +
            '<div class="min-w-0"><span class="block font-heading text-lg md:text-xl uppercase text-foreground group-hover:text-accent transition-colors leading-tight truncate">' + escapeHtml(s.m.name) + '</span>' +
            '<span class="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">' + escapeHtml(s.m.region) + '</span></div>' +
          '</div>' +
          '<div class="flex items-center gap-5 shrink-0 font-mono text-[11px] text-muted-foreground">' +
            '<span class="hidden sm:inline">' + (s.m.days != null ? s.m.days + 'd' : '—') + '</span>' +
            '<span class="hidden sm:inline text-accent">' + escapeHtml(altShort(s.m.maxAlt)) + '</span>' +
            '<span class="border border-border px-3 py-1.5 group-hover:border-accent group-hover:text-accent transition-all">View →</span>' +
          '</div>' +
        '</a>';
      }).join('') + '</div>' : '') +
    '<div class="mt-8 flex flex-col sm:flex-row gap-3">' +
      '<a href="/compare?t=' + encodeURIComponent(matches.slice(0, 3).map((s) => s.m.slug).join(',')) + '" class="flex-1 text-center border border-border px-6 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:border-accent hover:text-accent transition-all">Compare these →</a>' +
      '<a href="/contact" class="flex-1 text-center bg-accent text-background px-6 py-3 font-mono text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-accent-hover transition-colors">Get a personalised plan →</a>' +
    '</div>';
}

function resetTrekFinder() {
  finderState.experience = null;
  finderState.region = null;
  finderState.season = null;
  finderState.duration = null;
  finderState.budget = null;
  finderState.style = [];

  document.querySelectorAll('#trek-finder .finder-card').forEach((btn) => {
    btn.classList.remove('border-accent', 'ring-1', 'ring-accent', 'bg-accent/5', 'text-foreground');
    const title = btn.querySelector('.finder-card-title');
    if (title) title.classList.remove('text-accent');
  });

  filterTrekFinder();
}

// ==========================================
// EXPLORE — Interactive Provincial Map of Nepal
// ==========================================
// Nepal's 7 federal provinces, west to east. Madhesh is a southern Terai
// strip (not a full-height band like the other six) — it borders India,
// has no mountain districts, and is represented honestly as such rather
// than assigned a fabricated trekking route.
// Nepal's 7 federal provinces, west to east. All eight of the world's
// 8,000 m peaks that lie inside Nepal sit in just two of them — five in
// Koshi (east) and three in Gandaki (west-central).
const exploreRegions = {
  'sudurpashchim': {
    name: 'Sudurpashchim Province',
    tag: 'Province 7 · Far-Western Nepal',
    coords: '29.6° N / 80.6° E',
    blurb: "Nepal's least-trodden frontier — remote trailheads on the Tibet and India borders, the Api–Saipal ice giants, and the meadow plateau of Khaptad.",
    peaksLabel: 'Frontier Peaks',
    peaks: [
      { name: 'Api', elev: '7,132 m' },
      { name: 'Saipal', elev: '7,031 m' },
      { name: 'Bobaye', elev: '6,808 m' }
    ],
    destinations: ['Dhangadhi', 'Mahendranagar', 'Silgadhi', 'Darchula', 'Khaptad'],
    regions: ['Api–Nampa', 'Saipal', 'Khaptad', 'Byas Valley'],
    attractions: ['Khaptad National Park', 'Api Nampa Conservation Area', 'Shuklaphanta National Park', 'Badimalika Temple'],
    links: [
      { label: 'Api Base Camp', href: '/treks' },
      { label: 'Saipal Base Camp', href: '/treks' },
      { label: 'Khaptad Trek', href: '/treks' }
    ]
  },
  'karnali': {
    name: 'Karnali Province',
    tag: 'Province 6 · Northwest Nepal',
    coords: '29.3° N / 82.8° E',
    blurb: "Nepal's largest and wildest province — a trans-Himalayan desert of turquoise lakes, restricted valleys and ancient Bön and Buddhist monasteries.",
    peaksLabel: 'Remote Peaks',
    peaks: [
      { name: 'Kanjiroba', elev: '6,883 m' },
      { name: 'Kande Hiunchuli', elev: '6,627 m' }
    ],
    destinations: ['Jumla', 'Dunai', 'Simikot', 'Gamgadhi', 'Surkhet'],
    regions: ['Dolpo', 'Rara', 'Humla', 'Limi Valley', 'Jumla'],
    attractions: ['Rara Lake — Nepal’s largest', 'Shey Phoksundo Lake', 'Shey Gompa', 'Phoksundo National Park'],
    links: [
      { label: 'Upper Dolpo', href: '/treks/upper-dolpo' },
      { label: 'Lower Dolpo', href: '/treks/lower-dolpo' },
      { label: 'Rara Lake', href: '/treks/rara-lake-trek' },
      { label: 'Shey Phoksundo', href: '/treks/shey-phoksundo-lake' },
      { label: 'Limi Valley', href: '/treks/limi-valley' }
    ]
  },
  'lumbini': {
    name: 'Lumbini Province',
    tag: 'Province 5 · Southwestern Nepal',
    coords: '27.5° N / 83.3° E',
    blurb: 'The lowland gateway and spiritual cradle — the birthplace of the Buddha, the wildlife of Bardiya, and the hunting-reserve trails of Dhorpatan below Dhaulagiri.',
    peaksLabel: '',
    peaks: [],
    destinations: ['Lumbini', 'Butwal', 'Nepalgunj', 'Tansen (Palpa)', 'Bardiya'],
    regions: ['Dhorpatan', 'Rukum–Rolpa hills', 'Palpa'],
    attractions: ['Lumbini — UNESCO World Heritage', 'Bardiya National Park', 'Dhorpatan Hunting Reserve', 'Tansen hill town', 'Ranighat Palace'],
    links: [
      { label: 'Lumbini Pilgrimage', href: '/treks/lumbini-pilgrimage-circuit' },
      { label: 'Bardiya Safari', href: '/treks/bardiya-national-park-safari' },
      { label: 'Dhorpatan Trek', href: '/treks/rolpa-rukum-hill-trail' }
    ]
  },
  'gandaki': {
    name: 'Gandaki Province',
    tag: 'Province 4 · West-Central Nepal',
    coords: '28.6° N / 83.9° E',
    blurb: "Nepal's most-trekked province — Pokhara, the Annapurna Sanctuary, the deepest valley on earth, and the walled Buddhist kingdom of Upper Mustang.",
    peaksLabel: 'Peaks above 8,000 m',
    peaks: [
      { name: 'Dhaulagiri I', elev: '8,167 m' },
      { name: 'Manaslu', elev: '8,163 m' },
      { name: 'Annapurna I', elev: '8,091 m' }
    ],
    expeditions: ['dhaulagiri', 'manaslu', 'annapurna'],
    destinations: ['Pokhara', 'Jomsom', 'Muktinath', 'Manang', 'Lo Manthang', 'Gorkha', 'Bandipur'],
    regions: ['Annapurna', 'Manaslu', 'Mustang', 'Nar–Phu', 'Tsum Valley'],
    attractions: ['Phewa Lake', 'Annapurna Conservation Area', 'Kali Gandaki Gorge', 'Muktinath Temple', 'Lo Manthang'],
    links: [
      { label: 'Annapurna Circuit', href: '/treks/annapurna-circuit' },
      { label: 'Annapurna Base Camp', href: '/treks/annapurna-base-camp' },
      { label: 'Manaslu Circuit', href: '/treks/manaslu-circuit' },
      { label: 'Upper Mustang', href: '/treks/upper-mustang' },
      { label: 'Mardi Himal', href: '/treks/mardi-himal' }
    ]
  },
  'bagmati': {
    name: 'Bagmati Province',
    tag: 'Province 3 · Central Nepal',
    coords: '28.1° N / 85.4° E',
    blurb: "Nepal's cultural and political heart — the Kathmandu Valley's temple cities — with alpine wilderness in Langtang and Rolwaling just days from the capital.",
    peaksLabel: 'Trans-Himalayan Peaks',
    peaks: [
      { name: 'Langtang Lirung', elev: '7,227 m' },
      { name: 'Gaurishankar', elev: '7,134 m' },
      { name: 'Dorje Lakpa', elev: '6,966 m' }
    ],
    destinations: ['Kathmandu', 'Bhaktapur', 'Patan', 'Nagarkot', 'Dhunche', 'Chitwan'],
    regions: ['Langtang', 'Gosaikunda', 'Helambu', 'Tamang Heritage', 'Rolwaling'],
    attractions: ['Kathmandu Durbar Squares', 'Boudhanath & Pashupatinath', 'Chitwan National Park', 'Langtang National Park'],
    links: [
      { label: 'Langtang Valley', href: '/treks/langtang-valley' },
      { label: 'Gosaikunda', href: '/treks/gosaikunda' },
      { label: 'Helambu Circuit', href: '/treks/helambu-circuit' },
      { label: 'Tamang Heritage Trail', href: '/treks/tamang-heritage-trail' },
      { label: 'Chitwan Safari', href: '/treks' }
    ]
  },
  'madhesh': {
    name: 'Madhesh Province',
    tag: 'Province 2 · Southeastern Plains',
    coords: '26.8° N / 85.9° E',
    blurb: 'The Terai plains along the Indian border — no mountains, but the temple city of Janakpur, the Mithila cultural heartland, and the birdlife of Koshi Tappu.',
    peaksLabel: '',
    peaks: [],
    destinations: ['Janakpur', 'Birgunj', 'Jaleshwar', 'Rajbiraj', 'Gaur'],
    regions: ['Plains — cultural touring, not trekking'],
    attractions: ['Janaki Mandir, Janakpur', 'Koshi Tappu Wildlife Reserve', 'Gadhimai Temple', 'Mithila art villages'],
    links: [
      { label: 'Janakpur Heritage Tour', href: '/treks/janakpur-temple-circuit' },
      { label: 'Koshi Tappu Birding', href: '/treks' }
    ]
  },
  'koshi': {
    name: 'Koshi Province',
    tag: 'Province 1 · Eastern Nepal',
    coords: '27.6° N / 87.1° E',
    blurb: 'The roof of the world — Sherpa homeland and the gateway to Everest, flanked by the Makalu and Kanchenjunga massifs and the tea hills of Ilam.',
    peaksLabel: 'Peaks above 8,000 m',
    peaks: [
      { name: 'Everest', elev: '8,849 m' },
      { name: 'Kangchenjunga', elev: '8,586 m' },
      { name: 'Lhotse', elev: '8,516 m' },
      { name: 'Makalu', elev: '8,485 m' },
      { name: 'Cho Oyu', elev: '8,188 m' }
    ],
    expeditions: ['everest', 'kangchenjunga', 'lhotse', 'makalu', 'cho-oyu'],
    destinations: ['Lukla', 'Namche Bazaar', 'Tengboche', 'Ilam', 'Dharan', 'Biratnagar'],
    regions: ['Khumbu (Everest)', 'Gokyo', 'Kanchenjunga', 'Makalu–Barun', 'Arun Valley'],
    attractions: ['Sagarmatha National Park', 'Tengboche Monastery', 'Gokyo Lakes', 'Ilam tea estates', 'Kanchenjunga Conservation Area'],
    links: [
      { label: 'Everest Base Camp', href: '/treks/everest-base-camp' },
      { label: 'Three Passes', href: '/treks/three-passes' },
      { label: 'Gokyo Lakes', href: '/treks/gokyo-lakes' },
      { label: 'Kanchenjunga Base Camp', href: '/treks/kanchenjunga-base-camp' },
      { label: 'Makalu Base Camp', href: '/treks/makalu-base-camp' }
    ]
  }
};

let exploreLockedRegion = null;

function highlightExploreRegion(id) {
  const svg = document.querySelector('.hme-map');
  if (svg) {
    if (id) svg.dataset.active = id;
    else svg.removeAttribute('data-active');
  }
  document.querySelectorAll('.hme-region').forEach(path => {
    path.classList.toggle('is-active', path.dataset.region === id);
  });
  document.querySelectorAll('.hme-peak').forEach(g => {
    g.classList.toggle('is-active', g.dataset.region === id);
  });
  document.querySelectorAll('.hme-region-label').forEach(label => {
    label.classList.toggle('is-active', label.dataset.regionLabel === id);
  });

  const idx = document.getElementById('hme-peak-index');
  if (idx) {
    const region = exploreRegions[id];
    if (id && region && region.peaks && region.peaks.length) {
      idx.innerHTML = `
        <span class="block font-mono text-[8px] uppercase tracking-[0.25em] text-accent mb-2">${escapeHtml(region.peaksLabel || 'Peaks')}</span>
        ${region.peaks.map(p => `
          <div class="flex items-baseline justify-between gap-3 py-[3px]">
            <span class="font-mono text-[10px] text-foreground">${escapeHtml(p.name)}</span>
            <span class="font-mono text-[10px] text-accent">${escapeHtml(p.elev)}</span>
          </div>`).join('')}
      `;
      idx.classList.remove('hidden');
    } else {
      idx.classList.add('hidden');
      idx.innerHTML = '';
    }
  }
}

function exploreTrailsFor(id) {
  if (!window.TREKS) return [];
  return Object.keys(window.TREKS).map(k => window.TREKS[k])
    .filter(t => t && t.province === id)
    .sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
}

function renderExploreRegion(id) {
  const panel = document.getElementById('explore-panel');
  if (!panel) return;

  const region = exploreRegions[id];
  if (!region) {
    panel.innerHTML = `
      <div class="m-auto text-center max-w-xs">
        <span class="block h-2 w-2 rounded-full bg-accent mx-auto mb-4 animate-pulse"></span>
        <span class="block font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Pick a province</span>
        <p class="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">
          Tap the map to open a province &mdash; what it&rsquo;s known for, the trails we guide there, the peaks above it and the places worth the detour.
        </p>
        <div class="mt-5 flex flex-wrap justify-center gap-1.5">
          ${Object.keys(exploreRegions).map(rk => `<button type="button" onclick="clickExploreRegion('${rk}')" class="border border-border px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground transition-all hover:border-accent hover:text-accent">${escapeHtml(exploreRegions[rk].name.replace(' Province', ''))}</button>`).join('')}
        </div>
      </div>
    `;
    return;
  }

  const secHead = (label) => `<span class="mt-6 mb-2 block font-mono text-[9px] uppercase tracking-[0.25em] text-accent">${label}</span>`;
  const shortName = region.name.replace(' Province', '');

  // ── Known for ──────────────────────────────────────────────────────────
  const knownItems = (region.peaks && region.peaks.length)
    ? region.peaks.map(p => ({ big: p.name, small: p.elev }))
    : region.attractions.slice(0, 3).map(a => ({ big: a, small: '' }));
  const knownHtml = `
    ${secHead(region.peaks && region.peaks.length ? (region.peaksLabel || 'Known for') : 'Known for')}
    <div class="space-y-1.5">
      ${knownItems.map(k => `
        <div class="flex items-baseline justify-between gap-3 border-b border-border/50 pb-1.5">
          <span class="font-heading text-lg uppercase tracking-tight text-foreground leading-none">${escapeHtml(k.big)}</span>
          ${k.small ? `<span class="shrink-0 font-mono text-[11px] text-accent">${escapeHtml(k.small)}</span>` : ''}
        </div>`).join('')}
    </div>`;

  // ── Trails ─────────────────────────────────────────────────────────────
  const trails = exploreTrailsFor(id);
  let trailsHtml = '';
  if (trails.length) {
    trailsHtml = secHead('Trails we guide here') + '<div class="space-y-1.5">' +
      trails.slice(0, 6).map(t => {
        const st = t.stats || {};
        const meta = [st.difficulty, st.maxAltitude].filter(Boolean).join(' · ');
        return `<a href="/treks/${escapeHtml(t.slug)}" class="hme-xrow block border border-border px-3 py-2">
          <span class="block font-mono text-[11px] uppercase tracking-wide text-foreground">${escapeHtml(t.name)}</span>
          ${meta ? `<span class="mt-0.5 block font-mono text-[9px] uppercase tracking-widest text-muted-foreground">${escapeHtml(meta)}</span>` : ''}
        </a>`;
      }).join('') + '</div>' +
      `<a href="/treks#${id}" class="mt-2.5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent hover:gap-3 transition-all">All ${escapeHtml(shortName)} trails (${trails.length}) &rarr;</a>`;
  } else {
    trailsHtml = secHead('Trails') +
      `<p class="font-mono text-[11px] leading-relaxed text-muted-foreground">We don&rsquo;t run a scheduled trek in ${escapeHtml(shortName)} yet &mdash; <a href="/contact" class="text-accent hover:underline">ask us about a custom route</a>.</p>`;
  }

  // ── Expeditions ────────────────────────────────────────────────────────
  let expHtml = '';
  const expSlugs = (region.expeditions || []).filter(s => window.MOUNTAINS && window.MOUNTAINS[s]);
  if (expSlugs.length) {
    expHtml = secHead('Eight-thousanders above it') + '<div class="space-y-1.5">' +
      expSlugs.map(s => {
        const m = window.MOUNTAINS[s];
        return `<a href="/expeditions/${escapeHtml(m.slug)}" class="hme-xrow flex items-baseline justify-between gap-3 border border-border px-3 py-2">
          <span class="font-mono text-[11px] uppercase tracking-wide text-foreground">${escapeHtml(m.name)}</span>
          <span class="shrink-0 font-mono text-[10px] text-accent">${escapeHtml(m.elevationLabel || '')}</span>
        </a>`;
      }).join('') + '</div>';
  } else if (region.peaks && region.peaks.length) {
    expHtml = secHead('Peaks') +
      `<p class="font-mono text-[11px] leading-relaxed text-muted-foreground">No 8,000 m summits &mdash; the high points are ${region.peaks.map(p => escapeHtml(p.name) + ' (' + escapeHtml(p.elev) + ')').join(', ')}.</p>`;
  }

  // ── Culture & places (factual lists only) ──────────────────────────────
  const cultureHtml = secHead('Culture &amp; places') + `
    <div class="grid grid-cols-2 gap-x-5 gap-y-4">
      <div>
        <span class="block font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/70">Towns &amp; hubs</span>
        <ul class="mt-1.5 space-y-1">${region.destinations.map(x => `<li class="font-mono text-[11px] leading-snug text-foreground">${escapeHtml(x)}</li>`).join('')}</ul>
      </div>
      <div>
        <span class="block font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/70">Parks &amp; landmarks</span>
        <ul class="mt-1.5 space-y-1">${region.attractions.map(x => `<li class="font-mono text-[11px] leading-snug text-foreground">${escapeHtml(x)}</li>`).join('')}</ul>
      </div>
    </div>`;

  // ── Stories ────────────────────────────────────────────────────────────
  const storiesHtml = `<div class="mt-6 border-t border-border pt-4">
      <a href="/dispatches" class="hme-xrow flex items-center justify-between gap-3 border border-border px-3 py-2.5">
        <span class="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">Field notes &amp; dispatches</span>
        <span class="shrink-0 font-mono text-[11px] text-accent">&rarr;</span>
      </a>
    </div>`;

  panel.innerHTML = `
    <div class="hme-xbody">
      <div class="flex items-center justify-between gap-4">
        <span class="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">${escapeHtml(region.tag)}</span>
        <span class="font-mono text-[9px] uppercase tracking-widest text-muted-foreground whitespace-nowrap">${escapeHtml(region.coords)}</span>
      </div>
      <h3 class="mt-3 font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground leading-[0.95]">${escapeHtml(region.name)}</h3>
      <p class="mt-3 font-mono text-xs leading-relaxed text-muted-foreground">${escapeHtml(region.blurb)}</p>
      ${knownHtml}
      ${trailsHtml}
      ${expHtml}
      ${cultureHtml}
      ${storiesHtml}
    </div>
  `;
}

function hoverExploreRegion(id) {
  // Hover only previews the map itself — the discovery panel updates on click.
  if (exploreLockedRegion) return;
  highlightExploreRegion(id);
}

function unhoverExploreRegion() {
  if (exploreLockedRegion) return;
  highlightExploreRegion(null);
}

function clickExploreRegion(id) {
  exploreLockedRegion = (exploreLockedRegion === id) ? null : id;
  renderExploreRegion(exploreLockedRegion);
  highlightExploreRegion(exploreLockedRegion);
  // On tap (no hover), bring the panel into view on narrow screens.
  if (exploreLockedRegion && window.matchMedia && window.matchMedia('(max-width: 1023px)').matches) {
    const panel = document.getElementById('explore-panel');
    if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function scrollTrekGrid(direction) {
  const grid = document.getElementById('trek-grid');
  if (!grid) return;
  const scrollAmount = grid.clientWidth * 0.75;
  if (direction === 'left') {
    grid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  } else {
    grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}

function selectTrek(id) {
  selectedTrekId = id;
  const cards = document.querySelectorAll('#trek-grid > article');
  ((siteData && siteData.packages) || []).forEach((p, idx) => {
    if (cards[idx]) {
      if (p.id === id) {
        cards[idx].classList.add('border-accent', 'ring-1', 'ring-accent', 'bg-[#1e2227]');
      } else {
        cards[idx].classList.remove('border-accent', 'ring-1', 'ring-accent', 'bg-[#1e2227]');
      }
    }
  });
  renderItinerary();
}

// Render Itinerary Timeline
function renderItinerary() {
  const trek = ((siteData && siteData.packages) || []).find(p => p.id === selectedTrekId);
  const container = document.getElementById('itinerary-days-container');
  const bgImg = document.getElementById('itinerary-bg-img');
  const titleEl = document.getElementById('itinerary-title');
  const t = i18n[currentLang] || i18n.en;

  if (!container) return;

  if (!trek) {
    container.innerHTML = `<div class="text-xs text-muted-foreground font-mono">${t.selectExpeditionPrompt}</div>`;
    return;
  }

  if (bgImg) bgImg.src = trek.img;
  if (titleEl) titleEl.innerText = trek.title.toUpperCase();

  container.innerHTML = '';
  const stages = trek.itinerary || [];

  if (stages.length === 0) {
    container.innerHTML = `<div class="text-xs text-muted-foreground font-mono">${t.noStagesLogged}</div>`;
    return;
  }

  stages.forEach((dayStr, index) => {
    const colonIdx = dayStr.indexOf(':');
    let dayLabel = `${t.dayPrefix} ${index + 1}`;
    let dayDesc = dayStr;
    if (colonIdx !== -1) {
      dayDesc = dayStr.substring(colonIdx + 1).trim();
    }

    const row = document.createElement('div');
    row.className = "flex gap-6 border-b border-border/40 pb-6 last:border-b-0";
    row.innerHTML = `
      <div class="w-20 font-mono text-[10px] uppercase tracking-widest text-accent shrink-0 pt-1">${escapeHtml(dayLabel)}</div>
      <div class="space-y-2">
        <h4 class="font-heading text-lg uppercase text-white font-light tracking-wide">${escapeHtml(dayDesc)}</h4>
        <p class="font-mono text-[10px] text-muted-foreground">${t.waypointNote}</p>
      </div>
    `;
    container.appendChild(row);
  });
}

// Render Gear Checklist
const gearManifestCategories = [
  {
    category: "Base Layer",
    items: ["Merino wool base top", "Merino wool base bottom", "Synthetic underwear (×3)", "Moisture-wick sports bra (×2)"]
  },
  {
    category: "Insulation",
    items: ["Fleece mid-layer jacket", "Down jacket (-20°C rated)", "Softshell trekking pants"]
  },
  {
    category: "Shell",
    items: ["Waterproof hardshell jacket", "Waterproof rain pants (full zip)"]
  },
  {
    category: "Footwear",
    items: ["Broken-in trekking boots", "Camp shoes / sandals", "Wool trekking socks (×4)", "Sock liners (×2)"]
  },
  {
    category: "Head & Hands",
    items: ["Sun hat / cap", "Warm beanie", "Balaclava / neck gaiter", "UV glacier sunglasses (Cat 4)", "Liner gloves", "Insulated mittens"]
  },
  {
    category: "Sleep System",
    items: ["4-season sleeping bag", "Silk / fleece liner", "Inflatable sleeping pad"]
  },
  {
    category: "Pack & Technical",
    items: ["65L duffel / porter pack", "25L summit daypack", "Trekking poles", "Headlamp + spare batteries", "Water bottles (2L total)", "Water purification tablets"]
  },
  {
    category: "Personal & Medical",
    items: ["Personal first aid kit", "Diamox (altitude meds)", "Sunscreen SPF 50+", "SPF lip balm", "Toiletries & quick-dry towel", "Power bank + cables", "Camera + memory cards"]
  }
];

let gearCheckedState = {};
try {
  const savedGear = localStorage.getItem('vo_gear_checklist');
  if (savedGear) gearCheckedState = JSON.parse(savedGear);
} catch (e) {}

function toggleGearItem(key) {
  gearCheckedState[key] = !gearCheckedState[key];
  localStorage.setItem('vo_gear_checklist', JSON.stringify(gearCheckedState));
  renderGearChecklist();
}

function resetGearLoadout() {
  gearCheckedState = {};
  localStorage.removeItem('vo_gear_checklist');
  renderGearChecklist();
}

function renderGearChecklist() {
  const container = document.getElementById('gear-manifest-grid') || document.getElementById('gear-groups-container');
  if (!container) return;
  container.innerHTML = '';

  let totalItems = 0;
  let checkedItems = 0;

  gearManifestCategories.forEach(cat => {
    totalItems += cat.items.length;
    const catChecked = cat.items.filter(item => gearCheckedState[`${cat.category}::${item}`]).length;
    checkedItems += catChecked;

    const catDiv = document.createElement('div');
    catDiv.innerHTML = `
      <div class="mb-4 flex items-center justify-between border-b border-border pb-2">
        <h3 class="font-heading text-lg uppercase tracking-tight text-foreground">${cat.category}</h3>
        <span class="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">${catChecked} / ${cat.items.length}</span>
      </div>
      <ul class="space-y-3" id="cat-items-${cat.category.replace(/[^a-zA-Z0-9]/g, '')}"></ul>
    `;
    container.appendChild(catDiv);

    const ul = catDiv.querySelector('ul');
    cat.items.forEach(item => {
      const key = `${cat.category}::${item}`;
      const isChecked = !!gearCheckedState[key];
      const li = document.createElement('li');
      li.innerHTML = `
        <button onclick="toggleGearItem('${key}')" class="flex w-full items-start gap-3 text-left transition-all group">
          <span class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-all ${isChecked ? 'border-accent bg-accent' : 'border-muted-foreground/40 hover:border-accent'}">
            ${isChecked ? '<i class="fa-solid fa-check text-[9px] text-background"></i>' : ''}
          </span>
          <span class="font-mono text-xs leading-relaxed transition-colors ${isChecked ? 'text-muted-foreground line-through' : 'text-foreground/90 group-hover:text-white'}">
            ${escapeHtml(item)}
          </span>
        </button>
      `;
      ul.appendChild(li);
    });
  });

  // Calculate altitude progress from 1,300m (Kathmandu) to 5,364m (EBC)
  const ratio = totalItems > 0 ? (checkedItems / totalItems) : 0;
  const currentAlt = Math.round(1300 + (5364 - 1300) * ratio);
  const percent = Math.round(ratio * 100);

  const altDisplay = document.getElementById('gear-alt-display');
  const progressBar = document.getElementById('gear-progress-bar');
  const countDisplay = document.getElementById('gear-count-display');

  if (altDisplay) altDisplay.innerText = `${currentAlt.toLocaleString()}m`;
  if (progressBar) progressBar.style.width = `${percent}%`;
  if (countDisplay) countDisplay.innerText = `${checkedItems} / ${totalItems}`;
}

// Render Dispatches
function renderDispatches() {
  const container = document.getElementById('dispatches-container');
  if (!container) return;
  container.innerHTML = '';

  const t = i18n[currentLang] || i18n.en;
  const list = siteData.dispatches || [];

  if (list.length === 0) {
    container.innerHTML = `<div class="col-span-full py-16 text-center text-muted-foreground font-mono text-xs">${t.noDispatches}</div>`;
    return;
  }

  list.forEach((d, idx) => {
    const card = document.createElement('div');
    card.className = "group relative flex h-full flex-col border border-border bg-card overflow-hidden hover:border-accent transition-colors";
    card.innerHTML = `
      <div class="h-48 overflow-hidden relative">
        <img src="${d.img}" class="h-full w-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" alt="Dispatch thumbnail">
        <div class="absolute inset-0 bg-gradient-to-t from-card to-transparent"></div>
        ${isEditMode ? `
          <button onclick="deleteDispatch(${idx})" class="absolute top-3 right-3 px-2 py-0.5 border border-red-500 bg-[#1b1e22] text-red-500 text-[8px] font-mono hover:bg-red-500 hover:text-white transition-colors">${t.btnDelete}</button>
        ` : ''}
      </div>
      <div class="p-6 flex flex-col flex-grow space-y-3">
        <span class="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">${escapeHtml(d.category)}</span>
        <h3 class="font-heading text-xl uppercase tracking-tight text-white group-hover:text-accent transition-colors">${escapeHtml(d.title)}</h3>
        <p class="font-mono text-[10px] text-muted-foreground leading-relaxed">${escapeHtml(d.excerpt)}</p>
        <div class="mt-auto pt-4 flex justify-between font-mono text-[9px] uppercase tracking-widest text-[#666]">
          <span>${escapeHtml(d.date)}</span>
          <span class="text-accent group-hover:underline cursor-pointer">${t.readJournal}</span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// ==========================================
// 8. VISUAL WYSIWYG EDITING CONTROLS
// ==========================================
function toggleEditMode() {
  isEditMode = !isEditMode;
  
  const adminActions = document.getElementById('admin-actions');
  const adminSaveActions = document.getElementById('admin-save-actions');
  const addTrekPanel = document.getElementById('add-trek-panel');
  const btnAddDispatch = document.getElementById('btn-add-dispatch');
  const aboutImgEditor = document.getElementById('about-img-editor');

  if (adminActions && adminSaveActions) {
    if (isEditMode) {
      adminActions.classList.add('hidden');
      adminSaveActions.classList.remove('hidden');
    } else {
      adminActions.classList.remove('hidden');
      adminSaveActions.classList.add('hidden');
    }
  }

  if (addTrekPanel) addTrekPanel.classList.toggle('hidden', !isEditMode);
  if (btnAddDispatch) btnAddDispatch.classList.toggle('hidden', !isEditMode);
  if (aboutImgEditor) aboutImgEditor.classList.toggle('hidden', !isEditMode);

  renderWebsite();
}

function applyEditModeAttributes() {
  const editableFields = [
    { id: 'hero-badge', key: 'hero.badge' },
    { id: 'hero-title-primary', key: 'hero.title_primary' },
    { id: 'hero-title-italic', key: 'hero.title_italic' },
    { id: 'hero-description', key: 'hero.description' },
    { id: 'about-badge', key: 'about.badge' },
    { id: 'about-title', key: 'about.title' },
    { id: 'about-description', key: 'about.description' },
    { id: 'about-floating-stat', key: 'about.floating_stat' },
    { id: 'about-floating-label', key: 'about.floating_label' },
    { id: 'contact-phones', key: 'contact.phones' },
    { id: 'contact-emergency', key: 'contact.emergency' },
    { id: 'contact-email', key: 'contact.email' },
    { id: 'contact-address', key: 'contact.address' },
    { id: 'contact-regions', key: 'contact.regions' }
  ];

  editableFields.forEach(field => {
    const el = document.getElementById(field.id);
    if (!el) return;

    if (isEditMode) {
      el.contentEditable = "true";
      el.classList.add('editable-active');
      el.onblur = () => {
        siteData.isCustomEdited = true;
        setNestedKey(siteData, field.key, el.innerText.trim());
      };
    } else {
      el.contentEditable = "false";
      el.classList.remove('editable-active');
      el.onblur = null;
    }
  });

  // Stats editing
  const statValEls = document.querySelectorAll('[data-stat-idx]');
  statValEls.forEach(el => {
    if (isEditMode) {
      el.contentEditable = "true";
      el.classList.add('editable-active');
      el.onblur = () => {
        const idx = parseInt(el.getAttribute('data-stat-idx'));
        const field = el.getAttribute('data-field');
        if (siteData.stats && siteData.stats[idx]) {
          siteData.stats[idx][field] = el.innerText.trim();
        }
      };
    } else {
      el.contentEditable = "false";
      el.classList.remove('editable-active');
      el.onblur = null;
    }
  });
}

function setNestedKey(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) current[parts[i]] = {};
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

function updateAboutImage() {
  const url = document.getElementById('about-img-input').value.trim();
  if (url && siteData.about) {
    siteData.about.image = url;
    document.getElementById('about-image').src = url;
  }
}

// Package Modals
function openAddTrekModal() {
  editingTrekIndex = null;
  document.getElementById('trek-modal-title').innerText = "Add Expedition Package";
  document.getElementById('modal-title').value = '';
  document.getElementById('modal-dest').value = 'nepal';
  document.getElementById('modal-days').value = 14;
  document.getElementById('modal-price').value = 1200;
  document.getElementById('modal-diff').value = 'Moderate';
  document.getElementById('modal-img').value = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=400';
  document.getElementById('modal-max-alt').value = '5,000m';
  document.getElementById('modal-itinerary').value = 'Day 1: Arrival in Kathmandu\nDay 2: Trek preparation\nDay 3: Final descent';
  document.getElementById('modal-included').value = 'Sherpa guides\nWarm camp food\nRescue logistics';
  document.getElementById('modal-excluded').value = 'Nepal Visa\nPersonal travel insurance\nGratuities';

  document.getElementById('trek-modal').classList.remove('hidden');
}

function openEditTrekModal(id) {
  const index = siteData.packages.findIndex(p => p.id === id);
  if (index === -1) return;

  editingTrekIndex = index;
  const p = siteData.packages[index];

  document.getElementById('trek-modal-title').innerText = "Edit Expedition Package";
  document.getElementById('modal-title').value = p.title;
  document.getElementById('modal-dest').value = p.dest.toLowerCase();
  document.getElementById('modal-days').value = p.days;
  document.getElementById('modal-price').value = p.price;
  document.getElementById('modal-diff').value = p.difficulty;
  document.getElementById('modal-img').value = p.img;
  document.getElementById('modal-max-alt').value = p.maxAlt || '';
  document.getElementById('modal-itinerary').value = (p.itinerary || []).join('\n');
  document.getElementById('modal-included').value = (p.included || []).join('\n');
  document.getElementById('modal-excluded').value = (p.excluded || []).join('\n');

  document.getElementById('trek-modal').classList.remove('hidden');
}

function closeTrekModal() {
  document.getElementById('trek-modal').classList.add('hidden');
}

function saveTrekModal() {
  const title = document.getElementById('modal-title').value.trim();
  const dest = document.getElementById('modal-dest').value;
  const days = parseInt(document.getElementById('modal-days').value);
  const price = parseInt(document.getElementById('modal-price').value);
  const difficulty = document.getElementById('modal-diff').value;
  const img = document.getElementById('modal-img').value.trim();
  const maxAlt = document.getElementById('modal-max-alt').value.trim();
  const itinerary = document.getElementById('modal-itinerary').value.trim().split('\n').filter(l => l.length > 0);
  const included = document.getElementById('modal-included').value.trim().split('\n').filter(l => l.length > 0);
  const excluded = document.getElementById('modal-excluded').value.trim().split('\n').filter(l => l.length > 0);

  if (!title) {
    alert("Expedition Title is required.");
    return;
  }

  const payload = {
    id: editingTrekIndex !== null ? siteData.packages[editingTrekIndex].id : 'trek-' + Date.now(),
    title,
    dest,
    days,
    difficulty,
    price,
    img,
    maxAlt,
    itinerary,
    included,
    excluded,
    rating: 4.8,
    reviews: 12
  };

  if (editingTrekIndex !== null) {
    siteData.packages[editingTrekIndex] = payload;
  } else {
    siteData.packages.push(payload);
    selectedTrekId = payload.id;
  }

  closeTrekModal();
  renderWebsite();
}

function deleteTrek(id) {
  if (confirm("Confirm removal of this expedition package?")) {
    siteData.packages = siteData.packages.filter(p => p.id !== id);
    if (selectedTrekId === id && siteData.packages.length > 0) {
      selectedTrekId = siteData.packages[0].id;
    }
    renderWebsite();
  }
}

// Dispatches Add / Delete
function openAddDispatchModal() {
  document.getElementById('dispatch-title-input').value = '';
  document.getElementById('dispatch-date-input').value = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });
  document.getElementById('dispatch-cat-input').value = 'EXPEDITION LOG';
  document.getElementById('dispatch-excerpt-input').value = '';
  document.getElementById('dispatch-img-input').value = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=400';

  document.getElementById('dispatch-modal').classList.remove('hidden');
}

function closeDispatchModal() {
  document.getElementById('dispatch-modal').classList.add('hidden');
}

function saveDispatchModal() {
  const title = document.getElementById('dispatch-title-input').value.trim();
  const date = document.getElementById('dispatch-date-input').value.trim();
  const category = document.getElementById('dispatch-cat-input').value.trim();
  const excerpt = document.getElementById('dispatch-excerpt-input').value.trim();
  const img = document.getElementById('dispatch-img-input').value.trim();

  if (!title || !excerpt) {
    alert("Title and Excerpt are required to log a dispatch.");
    return;
  }

  const payload = { title, date, category, excerpt, img };
  siteData.dispatches.unshift(payload);

  closeDispatchModal();
  renderWebsite();
}

function deleteDispatch(index) {
  if (confirm("Remove this dispatch log?")) {
    siteData.dispatches.splice(index, 1);
    renderWebsite();
  }
}

// Server Synchronization — requires the deployment's ADMIN_TOKEN.
// The token is held in memory for the session only, never persisted.
let __adminToken = null;
async function saveEditsToServer() {
  if (!__adminToken) {
    __adminToken = window.prompt('Admin token required to save content changes:');
    if (!__adminToken) return;
  }
  try {
    const response = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': __adminToken },
      body: JSON.stringify(siteData)
    });
    const result = await response.json();
    if (response.ok && result.status === 'success') {
      alert('Saved. Website content updated.');
      originalData = JSON.parse(JSON.stringify(siteData));
      toggleEditMode();
    } else {
      if (response.status === 401) __adminToken = null;
      throw new Error(result.message || `Save failed (${response.status})`);
    }
  } catch (err) {
    console.error('[!] Save failure:', err.message);
    alert(`Failed to save: ${err.message}`);
  }
}

function discardEdits() {
  if (confirm("Are you sure you want to discard all session modifications?")) {
    siteData = JSON.parse(JSON.stringify(originalData));
    toggleEditMode();
  }
}

// Fullscreen Menu Toggle
let isMenuOpen = false;
function toggleMenu() {
  isMenuOpen = !isMenuOpen;
  const menu = document.getElementById('fullscreen-menu');
  const dot = document.getElementById('menu-dot');
  
  if (isMenuOpen) {
    menu.classList.remove('translate-x-full');
    dot.classList.add('scale-[3]', 'bg-accent');
  } else {
    menu.classList.add('translate-x-full');
    dot.classList.remove('scale-[3]');
  }
}

// Helper: Escape HTML for security
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Scroll Hide Announcement Bar
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
  const announcement = document.getElementById('announcement-bar');
  if (!announcement) return;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop && scrollTop > 60) {
    announcement.classList.add('announcement-hidden');
  } else {
    announcement.classList.remove('announcement-hidden');
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ==========================================
// HERO SLIDER CONTROLLER
// ==========================================
let currentHeroSlide = 0;
let heroSlideTimer = null;

function setHeroSlide(index) {
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.hero-indicator');
  if (!slides || slides.length === 0) return;

  currentHeroSlide = (index + slides.length) % slides.length;

  slides.forEach((s, idx) => {
    if (idx === currentHeroSlide) {
      s.classList.remove('opacity-0', 'scale-105');
      s.classList.add('opacity-40', 'scale-100');
    } else {
      s.classList.remove('opacity-40', 'scale-100');
      s.classList.add('opacity-0', 'scale-105');
    }
  });

  indicators.forEach((ind, idx) => {
    if (idx === currentHeroSlide) {
      ind.classList.remove('bg-border');
      ind.classList.add('bg-accent');
    } else {
      ind.classList.remove('bg-accent');
      ind.classList.add('bg-border');
    }
  });
}

// Hero Mountain Mouse Parallax & Dynamic Topography
// Hero Mountain Mouse Parallax
window.addEventListener('mousemove', (e) => {
  const heroParallax = document.getElementById('hero-bg-parallax');
  if (heroParallax) {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 12;
    heroParallax.style.transform = `scale(1.08) translate(${x}px, ${y}px)`;
  }
});

// Scroll Barometer (1,300m -> 8,848m)
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY || window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
  
  const fill = document.getElementById('barometer-fill');
  const ind = document.getElementById('barometer-indicator');
  const txt = document.getElementById('barometer-alt-text');
  
  if (fill) fill.style.height = `${ratio * 100}%`;
  if (ind) ind.style.top = `${ratio * 100}%`;
  if (txt) {
    const currentAlt = Math.round(1300 + (8848 - 1300) * ratio);
    txt.innerText = `${currentAlt.toLocaleString()}m`;
  }
}, { passive: true });

// 3D Mountain Perspective Video Slider
const heroVideoSlides = [
  {
    id: "everest",
    title: "01 // SAGARMATHA RIDGE · 5,364M",
    coords: "27°59'N · 86°55'E",
    src: "/videos/hero.mp4",
    altSrc: "/videos/hero.mp4.mp4",
    poster: "/images/ebc.png"
  },
  {
    id: "annapurna",
    title: "02 // THORONG LA CIRQUE · 5,416M",
    coords: "28°47'N · 83°56'E",
    src: "/videos/annapurna.mp4",
    altSrc: "/images/annapurna.png",
    poster: "/images/annapurna.png"
  },
  {
    id: "manaslu",
    title: "03 // SPIRIT MOUNTAIN PASS · 5,106M",
    coords: "28°33'N · 84°37'E",
    src: "/videos/manaslu.mp4",
    altSrc: "/images/manaslu.png",
    poster: "/images/manaslu.png"
  }
];

let currentHeroVideoIndex = 0;

function switchHeroVideo(direction) {
  if (direction === 'next') {
    currentHeroVideoIndex = (currentHeroVideoIndex + 1) % heroVideoSlides.length;
  } else if (direction === 'prev') {
    currentHeroVideoIndex = (currentHeroVideoIndex - 1 + heroVideoSlides.length) % heroVideoSlides.length;
  } else if (typeof direction === 'number') {
    currentHeroVideoIndex = direction;
  }
  updateHeroVideoUI();
}

function updateHeroVideoUI() {
  const slide = heroVideoSlides[currentHeroVideoIndex];
  const video = document.getElementById('hero-video');
  const label = document.getElementById('hero-video-title');
  const coord = document.getElementById('hero-telemetry-coords');

  if (label) label.innerText = slide.title;
  if (coord) coord.innerText = slide.coords;

  if (video) {
    video.style.opacity = '0.4';
    setTimeout(() => {
      video.poster = slide.poster;
      video.src = slide.src;
      video.playbackRate = 0.625;
      video.play().catch(() => {});
      video.style.opacity = '0.9';
    }, 200);
  }

  // Update Indicator Pills
  heroVideoSlides.forEach((_, idx) => {
    const pill = document.getElementById(`hero-slide-pill-${idx}`);
    if (pill) {
      if (idx === currentHeroVideoIndex) {
        pill.className = "h-1.5 w-8 rounded-full bg-accent cursor-pointer transition-all";
      } else {
        pill.className = "h-1.5 w-2 rounded-full bg-white/30 hover:bg-white/60 cursor-pointer transition-all";
      }
    }
  });
}

// Slow down hero video playback to stretch from 10s to 16s (0.625x speed)
function initHeroVideoSpeed() {
  const heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    heroVideo.playbackRate = 0.625;
    heroVideo.addEventListener('loadedmetadata', () => {
      heroVideo.playbackRate = 0.625;
    });
  }
}

// ==========================================
// 9. LIFECYCLE INITIALIZATION
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  selectLanguage(currentLang);
  loadContent();
  initHeroVideoSpeed();
  renderExploreRegion(null);
});




