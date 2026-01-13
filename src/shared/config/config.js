import { startTimeBuild } from "../../builder/examTableBuilder.js";
import { darkMode } from "../../ui/appearance.js";

export const Variables = {
    courses: [],
    selectedCourses: [],
    selectedSections: [],
    sectionsExam: [],
    Locations: [],
    selectedDays: [],
    daysOfExam: 15,
    examNumberPeriods: 3,
    maxTimeCode: 900,
    oldMaxTime: 900,
    timeCodes: [],
    startPeriods: { 0: "8:00", 1: "10:30", 2: "1:00", 3: "3:30" },
    allowConflict: false,
    allowSameActivity: false,
    toggleHiddenSections: false,
    toggleDynamicTitles: false,
    darkModeON: false,
    hasIntersected: false,
    conflictInfo: { dayOfConflict: new Set(), index: [] },
    intersectSections: { 1: [], 2: [], 3: [], 4: [], 5: [] },
    universityName: "qu",
    FirstTimeLoad: false,
    AppearanceSettings: {},
    driver: window.driver.js.driver,
    hoursExceeded: false,
    timeoutsPopover: []
};

export function saveSettings() {
  // console.log($("#toggle-mode").prop("checked"));
  let darkmodeValue = $("#toggle-mode").prop("checked");
  // console.log($("#examWeeks").val());
  let examWeeksValue = $("#examWeeks").val();
  // console.log($("#numberOfPeriods").val());
  let numberOfPeriodsValue = $("#numberOfPeriods").val();
  // console.log($("#toggle-conflict").prop("checked"));
  let toggleConflictValue = $("#toggle-conflict").prop("checked");
  // console.log($("#toggle-hidden-sections").prop("checked"));
  let toggleHiddenSectionsValue = $("#toggle-hidden-sections").prop("checked");
  // console.log($("#toggle-hidden-sections").prop("checked"));
  let toggleSameActivityValue = $("#toggle-same-activity").prop("checked");
  // console.log($("#toggle-hidden-sections").prop("checked"));
  let toggleDynamicTitlesValue = $("#toggle-dynamic-titles").prop("checked");

  $("#table-font-size").val(Variables.AppearanceSettings.tableFontSize || 15);
  $("#courses-font-size").val(Variables.AppearanceSettings.coursesFontSize || 15);
  $("#rightSection-font-size").val(Variables.AppearanceSettings.RightSectionFontSize || 15);
  $("#available-courses-font-size").val(Variables.AppearanceSettings.AvaliableSectionFontSize || 15);
  $("#exam-table-font-size").val(Variables.AppearanceSettings.ExamTableFontSize || 15);
  $("#sections-table-font-size").val(Variables.AppearanceSettings.SectionsTableFontSize || 15);
  $("#sections-details-font-size").val(Variables.AppearanceSettings.SectionsDetailsFontSize || 15);

  let RightSectionFontSizeValue = $("#rightSection-font-size").val();
  let AvaliableSectionFontSizeValue = $("#available-courses-font-size").val();
  let ExamTableFontSizeValue = $("#exam-table-font-size").val();
  let SectionsTableFontSizeValue = $("#sections-table-font-size").val();
  let SectionsDetailsFontSizeValue = $("#sections-details-font-size").val();
  let tableFontSizeValue = $("#table-font-size").val();
  let coursesFontSizeValue = $("#courses-font-size").val();
  let cardDesignValue = $("#cardDesign").val();




  let startPeriodsValue = [];
  $("[id=startPeriods]").each(function () {
    // console.log($(this).val());
    startPeriodsValue.push($(this).val());
  });

  chrome.storage.local.set({
    settings: {
      darkMode: darkmodeValue,
      examWeeks: examWeeksValue,
      numberOfPeriods: numberOfPeriodsValue,
      toggleConflict: toggleConflictValue,
      toggleHiddenSections: toggleHiddenSectionsValue,
      toggleSameActivity: toggleSameActivityValue,
      toggleDynamicTitles: toggleDynamicTitlesValue,
      startPeriods: startPeriodsValue,
      AppearanceSettings: {
        cardDesign: cardDesignValue,
        RightSectionFontSize: RightSectionFontSizeValue,
        AvaliableSectionFontSize: AvaliableSectionFontSizeValue,
        ExamTableFontSize: ExamTableFontSizeValue,
        SectionsTableFontSize: SectionsTableFontSizeValue,
        SectionsDetailsFontSize: SectionsDetailsFontSizeValue,
        tableFontSize: tableFontSizeValue,
        coursesFontSize: coursesFontSizeValue,
      }
    },

  });
  if (!Variables.FirstTimeLoad){
    message.success("تم حفظ الإعدادات بنجاح");
  }
  
}

export function loadSettings() {
      chrome.storage.local.get(["settings"], function (result) {
        if (result !== undefined && Object.keys(result).length !== 0) {
          if (result.settings.darkMode) {
            $("#toggle-mode").prop("checked", true);
            darkMode();
          }
          if (result.settings.toggleConflict) {
            $("#toggle-conflict").prop("checked", true);
            Variables.allowConflict = true;
          }
          if (result.settings.toggleHiddenSections) {
            $("#toggle-hidden-sections").prop("checked", true);
            Variables.toggleHiddenSections= true;
          }
          if (result.settings.toggleSameActivity) {
            $("#toggle-same-activity").prop("checked", true);
            Variables.allowSameActivity = true;
          }
          if (result.settings.toggleDynamicTitles) {
            $("#toggle-dynamic-titles").prop("checked", true);
            Variables.toggleHiddenSections = true;
          }
          $("#examWeeks").val(result.settings.examWeeks);
          Variables.daysOfExam = result.settings.examWeeks * 5;
          $("#numberOfPeriods").val(result.settings.numberOfPeriods);
          Variables.examNumberPeriods = result.settings.numberOfPeriods;
          startTimeBuild(result.settings.numberOfPeriods);
          result.settings.startPeriods.forEach((elm, index) => {
            $("[id=startPeriods]")[index].value = elm;
          });
    
          if (result.settings.AppearanceSettings){
            let TempAppearanceSettings = result.settings.AppearanceSettings;
            // console.table(TempAppearanceSettings);
            
            $("#sections-details-font-size").val(TempAppearanceSettings.sectionsDetailsFontSize || 15);
            $("#table-font-size").val(TempAppearanceSettings.tableFontSize || 15);
            $("#courses-font-size").val(TempAppearanceSettings.coursesFontSize || 15);
            $("#rightSection-font-size").val(TempAppearanceSettings.RightSectionFontSize || 15);
            $("#available-courses-font-size").val(TempAppearanceSettings.AvaliableSectionFontSize || 15);
            $("#exam-table-font-size").val(TempAppearanceSettings.ExamTableFontSize || 15);
            $("#sections-table-font-size").val(TempAppearanceSettings.SectionsTableFontSize || 15);
    
            Variables.AppearanceSettings.sectionsDetailsFontSize = TempAppearanceSettings.sectionsDetailsFontSize;
            Variables.AppearanceSettings.tableFontSize = TempAppearanceSettings.tableFontSize;
            Variables.AppearanceSettings.coursesFontSize = TempAppearanceSettings.coursesFontSize;
            Variables.AppearanceSettings.RightSectionFontSize = TempAppearanceSettings.RightSectionFontSize;
            Variables.AppearanceSettings.ExamTableFontSize = TempAppearanceSettings.ExamTableFontSize;
            Variables.AppearanceSettings.SectionsTableFontSize = TempAppearanceSettings.SectionsTableFontSize;
            Variables.AppearanceSettings.AvaliableSectionFontSize = TempAppearanceSettings.AvaliableSectionFontSize;
            Variables.AppearanceSettings.cardDesign = TempAppearanceSettings.cardDesign;
    
            $("#cardDesign").val(TempAppearanceSettings.cardDesign || "default");
    
            $("#timetable-table")[0].style.setProperty("font-size", Variables.AppearanceSettings.tableFontSize + "px","important");
            $("#onlineTitle")[0].style.setProperty("font-size", Variables.AppearanceSettings.tableFontSize + "px","important");
            $("#onlineCourses")[0].style.setProperty("font-size", (Variables.AppearanceSettings.tableFontSize - 1) + "px","important");
            
            $("#coruse-section")[0].style.setProperty("font-size", Variables.AppearanceSettings.coursesFontSize + "px","important");
            $("#right-section-content")[0].style.setProperty("font-size", Variables.AppearanceSettings.RightSectionFontSize + "px","important");
            $("#available-list")[0].style.setProperty("font-size", Variables.AppearanceSettings.AvaliableSectionFontSize + "px","important");
          }
    
        }else{
          // FirstTimeLoad = true;
        }
      });
}

// const courses = [];
// const selectedCourses = [];
// const selectedSections = [];
// let sectionsExam = [];
// const Locations = [];
// let selectedDays = [];
// let daysOfExam = 15;
// var examNumberPeriods = 3;
// let maxTimeCode = 900; // 3 pm
// let oldMaxTime = 900;
// var timeCodes = [];
// // var settings.darkModeON = false;
// let startPeriods = { 0: "8:00", 1: "10:30", 2: "1:00", 3: "3:30" };
// let allowConflict = false;
// let allowSameActivity = false;
// let toggleHiddenSections = false;
// let toggleDynamicTitles = false;
// let hasIntersected = false;
// let conflictInfo = { dayOfConflict: new Set(), index: [] };
// let intersectSections = { 1: [], 2: [], 3: [], 4: [], 5: [] };
// let universityName = "qu";
// let FirstTimeLoad = false;
// const AppearanceSettings = {};

// const driver = window.driver.js.driver;

// const L_NotDefined = "لم يحدد من الكلية";
// let hoursExceeded = false;
// let timeoutsPopover = [];