import {isOverflowed, captureModalContent, validateAndApplyFontSize} from "./src/utils/utils.js";
import {correctAlert, hideModal, delModal, newModal, Custom_btn_ID, Custom_Colors} from "./assets/js/modal.js";
import { loadSettings, saveSettings, Variables } from "./src/shared/config/config.js";
import showTour from "./src/guide/driver.js";
import {courseOrganizer, removeSection, removeSections,filterSelectedCourses, isItCollide, addSelectedCourse,updateCreditHours, showAllCourses} from "./src/logic/coursesManagement.js";
import {captureTimetable, previewSection,removePreview, addToTimetable, refreshTable} from "./src/logic/timetableManagement.js";
import { toggleSideMenu } from "./src/componenet/sidebar.js";
import { filterCourses } from "./src/componenet/courseSearch.js";
import { copySections, showSectionDetails, showSections } from "./src/componenet/sectionsTable.js";
import { buildTimetable } from "./src/builder/timetableBuilder.js";
import { showPopover } from "./src/componenet/popover/popover.js";
import { darkMode } from "./src/ui/appearance.js";
import { startTimeBuild } from "./src/builder/examTableBuilder.js";
import { showExams, copyExams } from "./src/componenet/examTable.js";


document.addEventListener("DOMContentLoaded", async () => {
  let isNewDataFromWebsite = false;

  chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action !== "insertContent") return;

    const { coursesData } = await chrome.storage.local.get(["coursesData"]);

    if (!coursesData) {
      if (!Variables.darkModeON) {
        darkMode();
        $("#toggle-mode").prop("checked", true);
        saveSettings();
      }

      Variables.FirstTimeLoad = true;
      showTour();
    } else {
      console.log("Fresh Data");
      await chrome.storage.local.remove(["coursesData"]);
    }

    // organize first
    courseOrganizer(request.content);

    // save after organizing
    await chrome.storage.local.set({ coursesData: request.content });

    // render AFTER everything is ready
    showAllCourses();

    isNewDataFromWebsite = true;
  });

  // ---------------------------
  // PAGE LOAD / RELOAD HANDLING
  // ---------------------------

  const [navigationEntry] = performance.getEntriesByType("navigation");

  if (
    navigationEntry?.type === "reload" ||
    !isNewDataFromWebsite
  ) {
    if (Variables.courses.length === 0) {
      console.log("Load!!");

      const { coursesData } = await chrome.storage.local.get(["coursesData"]);
      if (coursesData) {
        await courseOrganizer(coursesData);
        showAllCourses();
      }
    }
  }

  // ---------------------------
  // SETTINGS LOAD
  // ---------------------------

  const { settings } = await chrome.storage.local.get(["settings"]);

  if (!settings) {
    Variables.FirstTimeLoad = true;
    darkMode();
    $("#toggle-mode").prop("checked", true);
    saveSettings();
    showTour();
  }
});
  
  // TODO: Need to Fix or Remove it because now availableCourses are using just indexes
function init() {
  $('#avalible').split({
    orientation: 'vertical',
    limit: [1200, 380],
    position: '79%', // if there is no percentage it interpret it as pixels
  });

  loadSettings();

  const table = $("#timetable").find("thead");
  table.animate(
    {
      top: "18.5rem",
    },
    500,
    function () {}
  );

  startTimeBuild($("#numberOfPeriods").val());
}

function isAvalibleCourses(){
  return $("#available-list").children().length > 0;
}


$(document).ready(function () {
  //TODO: PUT ANYTHING THAT DON'T BELONG TO ANY EVENT TO ONE FUNCTION AND CALL IT INIT OR ANYTHING
  init();



  
  

  $(document).on("click", "#total-credit-hours-container", function () {
    let rows = '';
    let totalCreditHours = 0;

    Variables.selectedCourses.forEach((course) => {
      // console.log(Variables.courses[course].courseName, Variables.courses[course].creditHours);
      rows += `<tr>
                <th class="border-2 border-black select-text">${Variables.courses[course].courseName}</th>
                <td class="border-2 border-black select-text">${Variables.courses[course].creditHours}</td>
              </tr>`
      totalCreditHours += parseInt(Variables.courses[course].creditHours);
    });
    
    rows += `<tr>
                <th class="bg-slate-400 border-2 border-black select-text">المجموع</th>
                <td class="border-2 border-black select-text bg-slate-400">${totalCreditHours}</td>
              </tr>`
    
    newModal(
        "",
        `
        <div class="w-full text-center font-semibold py-2 " style="font-size: 0.9vw;">عدد الساعات</div>
        <div class="flex w-[40rem]">
        <div class="w-full border-2 border-r-0 border-black">
          <table class="w-full text-center" dir="rtl" style="font-size: ${Variables.AppearanceSettings.sectionsDetailsFontSize || 15}px;">
          <thead>
            <th class="border-2 border-black select-text">اسم المقرر</th>
            <th class="border-2 border-black select-text">الساعات</th>
          </thead>
            ${rows}
          </table>
        </div>
        </div>
        `,[{text:"حسنا",id:Custom_btn_ID.CANCEL,color:Custom_Colors.BLUE}],"لم يتم إضافة مقررات"
      );
  });

  $(document).on("change", "#cardDesign", function () {
      let cardDesign = $(this).val();
      message.success("تم تغيير تصميم البطاقة");
      Variables.AppearanceSettings.cardDesign = cardDesign;
      refreshTable();
  });

  $(document).on("change", "#sections-details-font-size", function () {
    validateAndApplyFontSize(12,22,"sectionsDetailsFontSize",this);
  });

  $(document).on("change", "#table-font-size", function () {
    validateAndApplyFontSize(12,22,"tableFontSize",this,
    ["timetable-table","onlineTitle","onlineCourses"]);
  });

  $(document).on("change", "#courses-font-size", function () {
    validateAndApplyFontSize(12,22,"coursesFontSize",this,
    ["coruse-section"]);
  });
  
  $(document).on("change", "#rightSection-font-size", function () {
    validateAndApplyFontSize(12,18,"RightSectionFontSize",this,
    ["right-section-content"]);
  });

  $(document).on("change", "#exam-table-font-size", function () {
    validateAndApplyFontSize(12,18,"ExamTableFontSize",this);
  });
  
  $(document).on("change", "#sections-table-font-size", function () {
    validateAndApplyFontSize(12,18,"SectionsTableFontSize",this);
  });

  $(document).on("change", "#available-courses-font-size", function () {
    validateAndApplyFontSize(12,18,"AvaliableSectionFontSize",this);
  });

  $(document).on("change", "#toggle-dynamic-titles", function () {
    if ($(this).is(":checked")) {
      Variables.toggleHiddenSections = true;
      $(".course").each(function () {
        $(this).addClass("dynamicTitles");
      });
    } else {
      $(".course").each(function () {
        $(this).removeClass("dynamicTitles");
      });
      Variables.toggleHiddenSections = false;
    }
    
  });
  
  $(document).on("change", "#toggle-same-activity", function () {
    if ($(this).is(":checked")) {
      Variables.allowSameActivity = true;
    } else {
      Variables.allowSameActivity = false;
    }
    filterSelectedCourses();
  });

  $(document).on("change", "#toggle-conflict", function () {
    if ($(this).is(":checked")) {
      Variables.allowConflict = true;

    } else {
      Variables.allowConflict = false;
      Object.values(Variables.intersectSections).some(value => {
        // console.log(value, value.length);
        
        return value.some(collide => {
          // console.log(collide.size);
          
          if (collide.size > 1) {
            message.error("لا يمكنك تعطيل هذا الخيار مع وجود تعارضات في الجدول");
            $(this).prop("checked", true);
            Variables.allowConflict = true;
            return true; // stop inner loop
          }
          return false;
        });
      });

      
    }
  });

  $(document).on("change", "#toggle-hidden-sections", function () {
    if ($(this).is(":checked")) {
      Variables.toggleHiddenSections = true;
    } else {
      Variables.toggleHiddenSections = false;
    }
    filterSelectedCourses();
  });

  $(document).on("change", "#examWeeks", function () {
    Variables.daysOfExam = this.value * 5;
  });

  $(document).on("change", "#numberOfPeriods", function () {
    Variables.examNumberPeriods = this.value;
    startTimeBuild(this.value);
  });

  $(document).on("change", "#toggle-mode", function () {
    darkMode();
  });

  $(document).on("change", "#startPeriods", function () {
    Variables.startPeriods[$(this).attr("name")] = this.value;
    // console.log(Variables.startPeriods);
  });

  $(document).on("click", "#settings-save", function () {
    saveSettings();
  });

  $(document).on("click", "#show-tour", function () {
    setTimeout(() => {
      toggleSideMenu();
      showTour();
    }, 300);
  });

  $(document).on("click", ".toggle-settings-btn", function () {
    target = $(this).attr('target-toggle');
    hideToggle = $(this).attr('hide-toggle');
    const wrapper = document.getElementById(target);
    





    // $("#" + target).toggleClass("hidden");

    if (wrapper.classList.contains("max-h-0")) {
      // Expand
      wrapper.style.maxHeight = wrapper.scrollHeight + "px";
      wrapper.classList.remove("max-h-0");
    } else {
      // Collapse
      wrapper.style.maxHeight = wrapper.scrollHeight + "px"; // lock current height
      void wrapper.offsetHeight; // force reflow
      wrapper.style.maxHeight = "0px"; // animate
      wrapper.addEventListener("transitionend", function handler() {
        wrapper.classList.add("max-h-0");
        wrapper.style.maxHeight = ""; // cleanup
        wrapper.removeEventListener("transitionend", handler);

      });
    }
  });

  $(document).on("click", ".section-router", function () {
    $("#section-" + $(this).attr("section")).click();
  });

  $(document).on("click", "#show-sections", function () {
    $("#modal_lower")[0].style.setProperty("font-size", Variables.AppearanceSettings.SectionsTableFontSize + "px","important");

    showSections();
  });

  $(document).on("click", "#show-exams", function () {
    $("#modal_lower").css("font-size", Variables.AppearanceSettings.ExamTableFontSize + "px");
    showExams();
  });

  $(document).on("click", "#copy-sections-table", function () {
    showPopover("copy-sections-table", "نسخ!");
    copySections();
  });

  $(document).on("click", "#copy-exam-table", function (event) {
    showPopover("copy-exam-table", "نسخ!");
    copyExams();
  });

  //TODO: Done! notify user of the copy
  $(document).on("click", "#save-exam-table", function (event) {
    showPopover("save-exam-table", "حفظ!");
    captureModalContent("Exam-Table");
  });

  $(document).on("click", "#save-sections-table", function (event) {
    showPopover("save-sections-table", "حفظ!");
    captureModalContent("Sections-Table");
  });

  $(document).on("click", ".added-section", function () {
    showSectionDetails(
      $(this).attr("course"),
      $(this).attr("id"),
      $(this).attr("timeIndex")
    );
  });

  // Hide modal when clicking the Cancel button
  $('.bg-gray-50 button:contains("Cancel")').on("click", hideModal);

  $('.bg-gray-50 button:contains("Cancel-temp")').on("click", delModal);

  // Handle Deactivate button click
  $('.bg-gray-50 button:contains("Deactivate")').on("click", function () {
    // Add your deactivation logic here
    // console.log("Account deactivated");
    hideModal();
  });

  $(document).on("click", "#days-filter", function () {
    if ($(this).hasClass("selectedDay")) {
      Variables.selectedDays.splice(Variables.selectedDays.indexOf($(this).attr("value")), 1);
    } else {
      Variables.selectedDays.push($(this).attr("value"));
    }
    // console.log($(this).text());
    $(this).toggleClass("selectedDay");
    filterSelectedCourses();
  });

  $(document).on("click", "#coverBG-temp", function (event) {
    if (event.target.id === "coverBG-temp") delModal();
  });

  $(document).on("click", "#coverBG", function (event) {
    if (event.target.id === "coverBG") hideModal();
  });

  $(document).on("click", "#side-menu-btn", function () {
    toggleSideMenu();
  });

  $(document).on("click", "#download-timetable", function () {
    document.getElementById("image-link").click();

    // Wait for the download window to open
    setTimeout(() => {
      // Check if the download has started
      if (document.getElementById("image-link").download) {
        $("#timetable").removeAttr("style");
        hideModal();
      } else {
        // If download hasn't started, wait a bit longer
        setTimeout(hideModal, 1000);
      }
    }, 100);
  });

  $(document).on("click", "#modal-button-ok", function () {
    hideModal();
  });

  $(document).on("click", "#modal-button-cancel", function () {
    hideModal();
  });

  $(document).on("click", "#modal-button-ok-temp", function () {
    delModal();
  });

  $(document).on("click", "#modal-button-cancel-temp", function () {
    delModal();
  });

  $(document).on("click", "#check-timetable", function () {
    correctAlert("saved", "Your timetable has been saved", "Done");
  });

  $(document).on("click", "#save-timetable", function () {
    captureTimetable();
  });

  // Search Bar
  $("#course-search").on("input", function () {
    const searchTerm = $(this).val();
    filterCourses(searchTerm);
  });

  // Event listener for day filter checkboxes
  $('input[name="day"]').on("change", function () {
    filterSelectedCourses();
  });

  $("#locations").on("change", function () {
    filterSelectedCourses();
  });

  //"mouseenter mouseleave"
  $(document).on("mouseenter mouseleave", ".available-section", function () {
    // IF selected no need to preview it again :|
    if ($(this).hasClass("selected-section")) {
      return false;
    }
    //alert($(this).children("p").eq(0).text());
    if ($(this).hasClass("preview-section")) {
      // alert("Selected");
      $(this).toggleClass("preview-section");
      removePreview($(this).attr("index"), $(this).attr("id"));
      return false;
    }
    $(this).toggleClass("preview-section");
    previewSection(
      $(this).attr("index"),
      $(this).attr("id"),
      $(this).attr("style")
    );
  });

  $(document).on("click", ".available-section", function () {
    //alert($(this).children("p").eq(0).text());
    
    //TODO: Done! Check if there is a section with the same data
    if ($(this).hasClass("hidden-section")) {
      // dangerAlert("خطأ", "هذه الشعبة مخفية من القائمة");
      message.error("هذه الشعبة مخفية من القائمة");
      return false;
    }

    refreshTable();
    if ($(this).hasClass("selected-section")) {
      // alert("Selected");
      // if($(this).hasClass("preview-section")){
      //   //removePreview($(this).attr("index"),$(this).attr("id"));
      // }
      $(this).toggleClass("selected-section");
      removeSection($(this).attr("id"));
      filterSelectedCourses();
      refreshTable();
      return false;
    }

    if (!Variables.allowSameActivity)
    if (Variables.selectedSections.some((sec) => sec.course === $(this).attr("index") && Variables.courses[sec.course].sections[sec.section].type === Variables.courses[sec.course].sections[$(this).attr("id")].type)) {
      message.error("لا يمكنك اختيار أكثر من شعبة لنفس المقرر بنفس النشاط",5000);
      return false;
    }

    // if(checkSectionExists($(this).attr("id"))){
    //   return false;
    // }
    Variables.selectedSections.unshift({
      course: $(this).attr("index"),
      section: $(this).attr("id"),
      color: $(this).attr("style")
    });

    if (!isItCollide()) {

      // console.log("NO CONFLICT");
      
      // To avoid duplication after selecting a section
      // if ($(this).hasClass("preview-section")) {
        // removePreview($(this).attr("index"), $(this).attr("id"));
      // }
      $(this).toggleClass("selected-section");
      addToTimetable(Variables.selectedSections[0]);
      const sec = $(this).attr("id");

      $("[id=course-overflow-" + sec + "]").each(function () {
        if (isOverflowed($(this))) {
          $(this).children().eq(0).children().eq(0).removeClass("sm:px-8");
          //console.log("Flowed");
          //console.log(this);
        }
      });

      if (Variables.allowConflict && Variables.hasIntersected) {
        let index = 0;
        Variables.conflictInfo["dayOfConflict"].forEach((elm) => {
          let i = Variables.conflictInfo["index"][index];
          // console.log(elm, index);

          let innerI = 0;
          Variables.intersectSections[elm][i].forEach((secIndex) => {
            const thisCard = $(
              `[id='section-${secIndex}'][day='${elm}']`
            ).first();
            $("#" + secIndex).addClass("conflict-section");
            $("#" + secIndex).attr("title", "يوجد شعبة أخرى تتعارض مع هذه الشعبة تم اختيارها");
            const width = `${80 - innerI * 6}%`;
            thisCard.css("width", width);
            thisCard.css("z-index", innerI);
            thisCard.addClass("conflict-section");
            thisCard.attr("title", "يوجد شعبة أخرى تتعارض مع هذه الشعبة تم اختيارها");
            // console.log(width, thisCard);
            innerI++;
          });
          index++;
        });

        // thisCard = $("#section-"+$(this).attr("id"));
        // secondCard = $("#section-"+intersectWithSection);
        // console.log("ID:",thisCard);
        // console.log("ID2:",secondCard);
        // thisCard.width('50%');
        // secondCard.width('50%');
        // secondCard.css("transform","translate(50%, 0)")
      }

      // if (isOverflowed($("[id=course-title-"+sec+"]").parent().parent())) {
      //   $("[id=course-title-"+sec+"]").removeClass("sm:px-8")
      //   alert('The element is overflowed.');
      // } else {
      //   console.log($("#course-title-"+sec).parent().parent());
      // }
    } else {
      Variables.selectedSections.splice(0, 1);
    }
    // console.log(selectedSections);
  });

  

  $(document).on("click", ".toggle-btn", function () {
    const table = $("#timetable").find("thead");
    if (table.hasClass("myTop")) {
      table.animate(
        {
          top: "5.5rem",
        },
        500,
        function () {
          table.toggleClass("myTop");
        }
      );
    } else {
      table.animate(
        {
          top: "18.5rem",
        },
        500,
        function () {
          table.toggleClass("myTop");
        }
      );
    }

    $("#coruse-section").toggleClass("animation-slideUp");
    $("#coruse-section").toggleClass("animation-slideDown");

    $(".toggle-btn svg")
      .toggleClass("rotate-180");
  });

  $(document).on("click", ".available-course", function () {
    const index = $(this).attr("index");
    Variables.selectedCourses.unshift(index);
    $(this).toggleClass("selected");
    //console.log(Variables.selectedCourses);
    addSelectedCourse(index);
    updateCreditHours();
    // console.log(Variables.selectedCourses);

    if (!$("#emptyCourses").is(":hidden")){
      $("#emptyCourses").hide();
    }

    
  });

  $(document).on("click", ".course", function () {
    // Variables.selectedCourses.unshift(courses[$(this).attr("index")])

    $(".available-course[index|='" + $(this).attr("index") + "']").toggleClass(
      "selected"
    );
    const index = Variables.selectedCourses.findIndex(
      (ind) => ind === $(this).attr("index")
    );

    if (index !== -1) {
      // Remove the element at the found index
      Variables.selectedCourses.splice(index, 1);
    }
    $(this).closest("li").remove();
    removeSections($(this).attr("index"));
    updateCreditHours();
    if (!isAvalibleCourses()){
      if ($("#emptyCourses").is(":hidden")){
        $("#emptyCourses").show();
      }
    }
    //console.log(Variables.selectedCourses);
  });

  // $(document).on("click", ".course", function() {
  //   // Variables.selectedCourses.unshift(courses[$(this).attr("index")])

  //   $(".available-course[index|='"+$(this).attr("index")+"']").toggleClass("selected");
  //   const index = Variables.selectedCourses.findIndex(ind => ind === $(this).attr("index"));

  //   if (index !== -1) {
  //       // Remove the element at the found index
  //       Variables.selectedCourses.splice(index, 1);
  //   }
  //   $(this).closest("li").remove();
  //   removeSections($(this).attr("index"));
  //   console.log(Variables.selectedCourses);
  // });

  buildTimetable();

  // let courses = [" 1 @t 09:45 ص - 11:25 ص @r COC-107CS"," 2 @t 09:45 ص - 11:25 ص @r COC-107CS"," 2 @t 08:00 ص - 09:40 ص @r 102 م"," 3 @t 10:00 ص - 11:40 ص @r 202 ب ( B) @n  5 @t 12:00 م - 12:50 م @r 202 ب ( B)"];
  // let mycourse = getEachCourse(courses);
  // TimeToMinutes(mycourse);
  // console.log(CheckIntersect(mycourse));
});