lang = {};
lang["en"] = {
  "headline": "Please use this extension on the correct URL",
  "subtext": "Supported domains only",
  "editbutton": "Open Editor Page",
  "allowedTitle": "Currently, the extension supports :",
  "edu1": "Qassim University Website",
  "edu2": "Umm Al-Qura University Website",
  "howToOpen": "You must open the proposed courses page to use the extension"
};  

lang["ar"] = {
  "headline": "يرجى استخدام الإضافة من خلال صفحة الطالب المواد المطروحة",
  "subtext": "الدومينات المدعومة فقط",
  "editbutton": " فتح صفحة التعديل",
  "allowedTitle": "الحاليا الاضافة تدعم :",
  "edu1": "موقع جامعة القصيم",
  "edu2": "موقع جامعة ام القرى",
  "howToOpen": "لابد من فتح صفحة المواد المقترحة لاستخدام الإضافة"
};

//==============================================================================

$(document).ready(function() {
  // chrome.tabs.create({ url: "index.html" });
  $("#langBtn").click(function() {
    // Language change logic here
    if ($("#langBtn").text() === "العربية") {
      $("#langBtn").text("English");
      $("#Title1").text(lang["ar"].headline);
      $("#Title2").text(lang["ar"].subtext);
      $("#btn-studio").text(lang["ar"].editbutton);
      $("#allowedTitle").text(lang["ar"].allowedTitle);
      $("#edu1").text(lang["ar"].edu1);
      $("#edu2").text(lang["ar"].edu2);
      $("#howToOpen").text(lang["ar"].howToOpen);
      $("#Universities").attr("dir", "rtl");
    } else {
      $("#langBtn").text("العربية");
      $("#Title1").text(lang["en"].headline);
      $("#Title2").text(lang["en"].subtext);
      $("#btn-studio").text(lang["en"].editbutton);
      $("#Title2").text(lang["en"].subtext);
      $("#allowedTitle").text(lang["en"].allowedTitle);
      $("#edu1").text(lang["en"].edu1);
      $("#edu2").text(lang["en"].edu2);
      $("#howToOpen").text(lang["en"].howToOpen);
      $("#Universities").attr("dir", "ltr");
    }
  });
  $("#btn-studio").click(function () {
    const targetUrl = chrome.runtime.getURL("index.html");

    chrome.tabs.query({}, (tabs) => {
      const existingTab = tabs.find(tab => tab.url === targetUrl);

      if (existingTab) {
        // Focus the existing tab instead of creating a new one
        chrome.tabs.update(existingTab.id, { active: true });
        chrome.windows.update(existingTab.windowId, { focused: true });
      } else {
        // Create a new tab
        chrome.tabs.create({ url: targetUrl });
      }
    });
  });
});

//==============================================================================
// Check the URL of the active tab
// If it matches the allowed sites, open the desired Jadwaly Editor page
// Otherwise, show the popup message
//==============================================================================

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  const allowedSites = [
    "stu-gate.qu.edu.sa",
    "eduservices.uqu.edu.sa",
    "uqu.edu.sa"
  ];

  const isAllowed = allowedSites.some(site =>
    tab.url.includes(site)
  );

  if (isAllowed) {
    const targetUrl = chrome.runtime.getURL("index.html");

    chrome.tabs.query({}, (tabs) => {
      const existingTab = tabs.find(tab => tab.url === targetUrl);

      if (existingTab) {
        // Focus the existing tab instead of creating a new one
        chrome.tabs.update(existingTab.id, { active: true });
        chrome.windows.update(existingTab.windowId, { focused: true });
      } else {
        // Create a new tab
        chrome.tabs.create({ url: targetUrl });
      }
    });
  }
});
