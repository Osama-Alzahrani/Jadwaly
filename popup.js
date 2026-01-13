lang = {};
lang["en"] = {
  "headline": "Please use this extension on the correct URL",
  "subtext": "Supported domains only"
};  

lang["ar"] = {
  "headline": "يرجى استخدام الإضافة من خلال صفحة الطالب المواد المطروحة",
  "subtext": "الدومينات المدعومة فقط"
};

//==============================================================================

$(document).ready(function() {
  chrome.tabs.create({ url: "index.html" });
  $("#langBtn").click(function() {
    // Language change logic here
    if ($("#langBtn").text() === "العربية") {
      $("#langBtn").text("English");
      $("#Title1").text(lang["ar"].headline);
      $("#Title2").text(lang["ar"].subtext);

    } else {
      $("#langBtn").text("العربية");
      $("#Title1").text(lang["en"].headline);
      $("#Title2").text(lang["en"].subtext);
    }
  });
});