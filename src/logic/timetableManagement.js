import { CustomModal,Custom_Colors, Custom_btn_ID  } from "../../assets/js/modal.js";
import { Variables } from "../shared/config/config.js";
import { clearTimetable, removeFromCodeTimes } from "./coursesManagement.js";

function addTableRow() {
  let table = $("#timetable").find("table");
  let tbody = table.find("tbody");
  // maxTimeCode = ((maxTimeCode/60) == 22)? 60*23: maxTimeCode;
  for (let i = (Variables.oldMaxTime + 60) / 60; i <= Variables.maxTimeCode / 60; i++) {
    let row = `
      <tr class="h-16">
        <td class="border px-8 whitespace-nowrap ${
          Variables.darkModeON ? "dark:border text-white" : ""
        } px-6 py-4"></td>
        <td class="border px-8 whitespace-nowrap ${
          Variables.darkModeON ? "dark:border text-white" : ""
        } px-6 py-4"></td>
        <td class="border px-8 whitespace-nowrap ${
          Variables.darkModeON ? "dark:border text-white" : ""
        } px-6 py-4"></td>
        <td class="border px-8 whitespace-nowrap ${
          Variables.darkModeON ? "dark:border text-white" : ""
        } px-6 py-4"></td>
        <td class="border px-8 whitespace-nowrap ${
          Variables.darkModeON ? "dark:border text-white" : ""
        } px-6 py-4"></td>
        <td class="bg-neutral-50 px-8 whitespace-nowrap ${
          Variables.darkModeON ? "dark:second text-white" : ""
        } px-6 py-4">${
      i < 12 ? `${i}:00 ص` : i == 12 ? `${i}:00 م` : `${i - 12}:00 م`
    }</td>
      </tr>
    `;

    tbody.append(row);
  }
}


export function captureTimetable() {
  // Capture the timetable as an image
  let width = $("#timetable").width();
  $("#timetable").css("width", width + "px");
  const table = $("#timetable").find("thead");
  if ($("#coruse-section").hasClass("animation-slideDown")) {
    table.toggleClass("sticky");
  }
html2canvas(document.querySelector("#timetable"), {
  scale: 3, // Increase this value for higher resolution (e.g., 2, 3, or 4)
  useCORS: true, // In case of external images
}).then((canvas) => {
  table.toggleClass("sticky");

  // Convert the canvas to a data URL (higher resolution now)
  const dataURL = canvas.toDataURL("image/png", 1.0);

  // Create a temporary link element
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "timetable.png"; // better to keep PNG for lossless
  link.id = "image-link";

  // Create a preview image
  const previewImg = document.createElement("img");
  previewImg.src = dataURL;
  previewImg.style.maxWidth = "100%";
  previewImg.style.height = "auto";
  previewImg.style.marginBottom = "10px";

  // Create a container for the preview
  const previewContainer = document.createElement("div");
  previewContainer.appendChild(previewImg);

  // Show the preview in a modal
  CustomModal(
    "<p class='text-lg font-semibold text-center text-white bg-[#1F294F] p-3' dir='ltr'> الجدول </p>",
    previewContainer.outerHTML,
    [{ text: "حفظ", id: "download-timetable", color: Custom_Colors.BLUE }]
  );

  // Append the link to the body, click it, and remove it
  document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
});

}

export function makeTimetableCard(
  secIndex,
  corIndex,
  indx,
  day,
  section,
  endPixel,
  startPixel,
  style,
  prefix = ""
) {
  const OrgColor = tinycolor(style.substring(style.indexOf(":") + 1).trim());
  const DarkerColor = OrgColor.darken(6).toString();
  const BorderColor = OrgColor.darken(8).toString();
  //${$("#side-menu").hasClass("slideLeft")? "SOpend":""}
  if (Variables.AppearanceSettings.cardDesign === "Default" || !Variables.AppearanceSettings.cardDesign) {
    return `
        <div id="${prefix}section-${secIndex}" course="${corIndex}" timeIndex="${indx}" day="${day}" class="overflow-hidden rounded-lg flex flex-col text-start added-section timetable-section" style="height: ${pixelsToVH(
      endPixel - startPixel
    )}vh; margin-top: ${pixelsToVH(startPixel)}vh; ${style} border: ${pixelsToVW(
      5
    )}vw solid ${BorderColor};">
          
          <!-- Top section -->
          <div class="w-full">
            <div class="flex justify-between text-white border-b border-black" style="background-color: ${DarkerColor};">
              <span class="text-center text-black border-black border-r rounded-br-lg" style="font-size: 0.6vw; width: 3vw; background-color: ${
                section.type === "عملي" || section.type === "تدريب"
                  ? "#FFC700"
                  : "#FFFFFF"
              }">${section.type}</span>
              <span class="w-full text-center">${section.id}</span>
              <span class="text-center border-black border-l rounded-bl-lg" style="font-size: 0.6vw; width: 3vw; background-color: ${
                section.status === "مغلقة" ? "#f03d3d" : "#4E6F43"
              }">${section.status}</span>
            </div>
          </div>
      
          <!-- Centered content -->
          <div id="course-overflow-${secIndex}" class="flex flex-col justify-center py-8 items-center overflow-auto h-full">
            
            <div class="flex justify-center text-center">
              <bdi class="${
                $("#side-menu").hasClass("slideLeft") ? "" : "sm:px-8"
              } rounded mt-1 course-title" style="background-color: ${DarkerColor}; font-weight: 700;">${
      Variables.courses[corIndex].courseName
    }</bdi>
            </div>
            
            <div class="flex justify-center" dir="rtl">
              <bdi id="sec-time" class="rounded mt-1 ${
                $("#side-menu").hasClass("slideLeft") ? "text-xs" : ""
              }" style="background-color: ${DarkerColor}; line-height: 0.75rem;">
                <svg class="text-black inline-block h-5 w-5 mb-0 bg-slate-300 rounded-br rounded-tr" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6 -3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ${section.time[indx][0]} - ${section.time[indx][1]}
              </bdi>
            </div>
          </div>
        </div>
      `;
  }else if (Variables.AppearanceSettings.cardDesign === "Compact") {
        return `
        <div id="${prefix}section-${secIndex}" course="${corIndex}" timeIndex="${indx}" day="${day}" class="overflow-hidden rounded-lg flex flex-col text-start added-section timetable-section" style="height: ${pixelsToVH(
      endPixel - startPixel
    )}vh; margin-top: ${pixelsToVH(startPixel)}vh; ${style} border: ${pixelsToVW(
      5
    )}vw solid ${BorderColor};">
          
          <!-- Centered content -->
          <div id="course-overflow-${secIndex}" class="flex flex-col justify-center py-8 items-center overflow-auto h-full">
            
            <div class="flex justify-center text-center">
              <bdi class="${
                $("#side-menu").hasClass("slideLeft") ? "" : "sm:px-8"
              } rounded mt-1 course-title" style="font-weight: 700;">${
      Variables.courses[corIndex].courseName
    }</bdi>
            </div>
            
            <div class="flex justify-center" dir="rtl">
              <bdi id="sec-time" class="rounded mt-1 ${
                $("#side-menu").hasClass("slideLeft") ? "text-xs" : ""
              }" style="line-height: 0.75rem;">
                ${section.time[indx][0]} - ${section.time[indx][1]}
              </bdi>
            </div>
          </div>
        </div>
      `;
  }
}

export function previewSection(courseIndex, sectionIndex, style) {
  const table = $("#timetable").find("tbody");
  const section = Variables.courses[courseIndex].sections[sectionIndex];
  let maxValue = -1;
  section["codeTime"].forEach((period, indx) => {
    //console.log(period);
    if (parseInt(period["end"], 10) > Variables.maxTimeCode + 60) {
      Variables.oldMaxTime = Variables.maxTimeCode;
      //TODO: Please Check it is it works Correctly => period["end"] - Variables.maxTimeCode + Variables.maxTimeCode
      Variables.maxTimeCode =
        Math.ceil((period["end"]) / 60) * 60 - 60;
      if (Variables.maxTimeCode > 1440) {
        Variables.maxTimeCode = Variables.oldMaxTime;
        return;
      }
      addTableRow();
    }
    if (maxValue < parseInt(period["end"], 10)) {
      maxValue = parseInt(period["end"], 10);
    }
    const tableHeight = table.innerHeight();
    let pixelPerMin = tableHeight / (Variables.maxTimeCode - 480 + 60); // -480 is the start time of the day 8:00 am
    let startPixel = pixelPerMin * (period["start"] - 480);
    let endPixel = pixelPerMin * (period["end"] - 480);

    //console.log(`Time start: ${startPixel} => Time end: ${endPixel} => Test: ${period["end"] - 480}`);

    $("#day-" + section["dayOfWeek"][indx]).append(
      makeTimetableCard(
        sectionIndex,
        courseIndex,
        indx,
        section["dayOfWeek"][indx],
        section,
        endPixel,
        startPixel,
        style,
        "preview-"
      )
    );
    // console.log(sectionIndex);
    
    $("#left-section")
      .stop()
      .animate(
        {
          scrollTop: $("#preview-section-" + sectionIndex).offset().top - 500,
        },
        200
      );
  });
  // $('html, body').scrollTop($("#preview-section-"+sectionIndex).offset().top);

  Variables.timeCodes.push(parseInt(maxValue, 10));
  
  Variables.timeCodes.sort(function (a, b) {
    return b - a;
  });
  // console.log("This is time table ",Variables.timeCodes);
}

export function removePreview(course, id) {
  $("[id=preview-section-" + id + "]").remove();
  removeFromCodeTimes(course, id);
  // console.log(course);
}

export function addToTimetable(selectedSection) {
  //Todo: make sure it all the time for example chemistry has 2 section atr
  const table = $("#timetable").find("tbody");
  const corIndex = selectedSection["course"];
  const secIndex = selectedSection["section"];
  const style = selectedSection["color"];

  // console.log(selectedSection);

  const section = Variables.courses[corIndex]["sections"][secIndex];
  if (section["dayOfWeek"].length === 0) {
    dangerAlert("تنويه", "هذه شعبة عن بعد <br> سيتم اضافتها في الاسفل", "حسنًا");
    if ($("#onlineCourses").children().length == 0) {
      $("#onlineTitle").show();
      $("#onlineCourses").addClass("mb-10");
      $(table).css("border-bottom-width", "0.45vw");
    }
    $("#onlineCourses").append(
      `<bdi id="section-${secIndex}" course="${corIndex}" timeIndex="-1" class='online-course m-1 p-2 dark:second rounded added-section text-white' dir="ltr">[ ${section.id} ] - ${Variables.courses[corIndex].courseCode} - ${Variables.courses[corIndex].courseName}</bdi>`
    );

    return;
  }
  // const exam_dayNum = Math.ceil(Number(section["examDay"])/3); // Out of 15 days. 3 weeks
  // const exam_dayWeek = (exam_dayNum-1)%5;                      // Out of 5 days a week.
  // const exam_dayTime = (Number(section["examDay"])-1)%3;      // Out of 3 times a day.
  // if(IsBeforeExamWeek(section["examDay"])){
  //   infoAlert("EXAM","Exam day is before the exam weeks");
  // }else{
  //   infoAlert("EXAM","Exam day is"+WeekDays[exam_dayWeek]+ " Time:"+ Periods[exam_dayTime]);
  // }
  //console.log(tableHeight);
  let maxValue = -1;
  section["codeTime"].forEach((period, indx) => {
    //console.log(period);
    if (parseInt(period["end"], 10) > Variables.maxTimeCode + 60) {
      Variables.oldMaxTime = Variables.maxTimeCode;
      //TODO: Please Check it is it works Correctly => period["end"] - Variables.maxTimeCode + Variables.maxTimeCode
      Variables.maxTimeCode =
        Math.ceil((period["end"]) / 60) * 60 - 60;
      if (Variables.maxTimeCode > 1440) {
        Variables.maxTimeCode = Variables.oldMaxTime;
        return;
      }
      addTableRow();
      // alert(Variables.maxTimeCode);
    }
    if (maxValue < parseInt(period["end"], 10)) {
      maxValue = parseInt(period["end"], 10);
    }
    const tableHeight = table.innerHeight();
    let pixelPerMin = tableHeight / (Variables.maxTimeCode - 480 + 60); // -480 is the start time of the day 8:00 am
    let startPixel = pixelPerMin * (period["start"] - 480);
    let endPixel = pixelPerMin * (period["end"] - 480);

    //console.log(`Time start: ${startPixel} => Time end: ${endPixel} => Test: ${period["end"] - 480}`);

    // const OrgColor = tinycolor(style.substring(style.indexOf(":")+1).trim());
    // const DarkerColor = OrgColor.darken(6).toString();
    // const BorderColor = OrgColor.darken(8).toString();
    $("#day-" + section["dayOfWeek"][indx]).append(
      makeTimetableCard(
        secIndex,
        corIndex,
        indx,
        section["dayOfWeek"][indx],
        section,
        endPixel,
        startPixel,
        style
      )
    );
  });
  // timeCodes.push(parseInt(maxValue, 10));
  // timeCodes.sort(function (a, b) {
  //   return b - a;
  // });
}

export function refreshTable() {
  const ConflictStyles = clearTimetable();
  Variables.selectedSections.forEach((selected) => {
    addToTimetable(selected);
  });
  // console.log(ConflictStyles);
  
  ConflictStyles.forEach((elm) => {
    // console.log(elm);
    if ($(`[id='section-${elm.id}'][day='${elm.day}']`)){
      $(`[id='section-${elm.id}'][day='${elm.day}']`).attr("style", elm.style);
      $(`[id='section-${elm.id}'][day='${elm.day}']`).toggleClass("conflict-section");
      if ($(`[id='section-${elm.id}'][day='${elm.day}']`).attr("title")) {
        $(`[id='section-${elm.id}'][day='${elm.day}']`).removeAttr('title');
      } else {
        $(`[id='section-${elm.id}'][day='${elm.day}']`).attr("title", "يوجد شعبة أخرى تتعارض مع هذه الشعبة تم اختيارها");
      }

    //   $(`#${elm.id}`).toggleClass("conflict-section");
    }
    // }else{
      // $(`[id='course-overflow-${elm.id}'][day='${elm.day}']`).attr("style", elm.style);
    // }
    // const thisCard = $(
    //   `[id='section-${secIndex}'][day='${elm}']`
    // ).first();
  });
  

  // const sec = $(this).attr("id");

  // $("[id=course-overflow-" + sec + "]").each(function () {
  //   if (isOverflowed($(this))) {
  //     $(this).children().eq(0).children().eq(0).removeClass("sm:px-8");
  //     //console.log("Flowed");
  //     //console.log(this);
  //   }
  // });
}