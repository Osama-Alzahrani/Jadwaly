import { Variables } from '../shared/config/config.js';
import { getExamsText } from './examTable.js';
import { newModal, Custom_btn_ID, Custom_Colors,CustomModal } from '../../assets/js/modal.js';
import { copyToClipboard } from '../utils/utils.js';


export function copySections() {
  let textToCopy = "";
  Variables.selectedSections.forEach((selected) => {
    const corIndex = selected["course"];
    const secIndex = selected["section"];

    const course = Variables.courses[corIndex];
    const section = Variables.courses[corIndex]["sections"][secIndex];
    textToCopy += `\u202B \u202A${course.courseName} - ${course.courseCode}\u202C | \u202B${section.id}\u202C | ${section.type} | ${section.instructor}\u202C\n`;
  });

  copyToClipboard(textToCopy);
}



export function showSections() {
  const table = `
    <div style="width: 31.5vw;">
    <div class="w-full text-center font-semibold py-2 " style="font-size: 0.9vw;">الشعب المسجلة</div>
    <table id="sections-table" class="text-center font-light text-surface w-full" style="font-size: ${Variables.AppearanceSettings.SectionsTableFontSize || 15}px;">
                          <thead
                            class="border-b border-neutral-200 bg-slate-500 dark:border-white/10 text-white">
                            <tr style="z-index: 2;">
                              <th scope="col" class="px-4 py-4 w-40 font-bold">المحاضر</th>
                              <th scope="col" class="px-4 py-4 w-40 font-bold">القاعة</th>
                              <th scope="col" class="px-4 py-4 w-40 font-bold">النشاط</th>
                              <th scope="col" class="px-4 py-4 w-40 font-bold">الشعبه</th>
                              <th scope="col" class="px-4 py-4 w-40 font-bold">المادة</th>
                            </tr>
                          </thead>

  `;
  let tbody = [];
  Variables.selectedSections.forEach((selected) => {
    const corIndex = selected["course"];
    const secIndex = selected["section"];

    const course = Variables.courses[corIndex];
    const section = Variables.courses[corIndex]["sections"][secIndex];
    console.log(section);
    let rooms = [];
    section["room"].forEach((elm, i) => {
      let time = section["time"][i][0];

      console.log(Variables.timeCodes,elm);
      
      if (section["room"].length > 1 && i != section["room"].length - 1) {
        rooms.push(`${time}<br> ${elm}<hr class='pt-2'> `);
      }else{
        rooms.push(`${time}<br> ${elm}`);
      }
    });

    rooms = rooms.join("");

    tbody.push(
      `
      <tr section="${secIndex}" class="section-router even:bg-gray-300 bg-gray-100">
        <td class="border ${Variables.darkModeON ? "dark:border dark" : ""} ">
        ${section.instructor}
        </td>
        <td class="border ${Variables.darkModeON ? "dark:border dark" : ""} ">
        ${rooms}
        </td>
        <td class="border ${
          Variables.darkModeON ? "dark:border" : ""
        } " style="background-color: ${
        section.type === "عملي" || section.type === "تدريب"
          ? "#FFC700"
          : Variables.darkModeON
          ? "#555"
          : "#FFFFFF"
      };">${section.type}</td>
        <td class="border ${Variables.darkModeON ? "dark:border dark" : ""}">${
        section.id
      }</td>
        <td class="border px-4 py-2 ${
          Variables.darkModeON ? "dark:border dark" : ""
        }" dir="rtl">${course.courseCode} <br> ${course.courseName} </td>
      </tr>
      `
    );
  });

  const Table = table + tbody.join("");

  CustomModal("", Table, [
    { text: "حسنا", id: Custom_btn_ID.CANCEL, color: Custom_Colors.BLUE },
    { text: "نسخ", id: "copy-sections-table", color: Custom_Colors.YELLOW },
    { text: "حفظ", id: "save-sections-table", color: Custom_Colors.YELLOW },
  ],
  false,
  "لا توجد شعب مسجلة حالياً");
}


export function showSectionDetails(courseIndex, sectionI, timeIndex) {
  const sectionIndex = sectionI.replace("section-", "");

  const ExamDay = Variables.courses[courseIndex].sections[sectionIndex]["examDay"];
  const exam = getExamsText(ExamDay);

  //flex-row-reverse
  newModal(
    "",
    `
    <div class="w-full text-center font-semibold py-2 " style="font-size: 0.9vw;">تفاصيل الشعبة</div>
    <div class="flex w-[40rem]">
    <div class="w-full border-2 border-black" id="section-details" style="user-select:text;" >
        <h3 class="p-2 border-b-2 border-black text-base font-semibold leading-6 text-white" style="background-color: #263365;" id="modal-title">:معلومات المقرر</h3>
        <table class="w-full text-center" dir="rtl" style="font-size: ${Variables.AppearanceSettings.sectionsDetailsFontSize || 15}px;">
        <thead>
          <tr>
            <th class="border-2 border-gray-300 bg-gray-100 select-text">رمز المقرر</th>
            <td class="border select-text">
              ${Variables.courses[courseIndex].courseCode}
            </td>
          </tr>
          <tr>
            <th class="border-2 border-gray-300 bg-gray-100 select-text">اسم المقرر</th>
            <td class="border select-text">
              ${Variables.courses[courseIndex].courseName}
            </td>
          </tr>
          <tr>
            <th class="border-2 border-gray-300 bg-gray-100 select-text">الساعات</th>
            <td class="border select-text">
              ${Variables.courses[courseIndex].creditHours}
            </td>
          </tr>
          ${Variables.universityName !== "uqu"? `<tr>
            <th class="border-2 border-gray-300 bg-gray-100 select-text">الإختبار</th>
            <td class="border select-text">
              ${
                exam.day === null
                  ? "لم يحدد من الكلية"
                  : ` الفترة [${ExamDay}] </br> الاسبوع ${exam.week} / يوم ${exam.day} </br> الوقت ${exam.time}`
              }
            </td>
          </tr>`:""}


        </thead>
      </table>
    </div>
    <div class="w-full border-2 border-r-0 border-black">
      <h3 class="p-2 border-b-2 border-black w-full text-base font-semibold leading-6 text-white" style="background-color: #263365;" id="modal-title">:معلومات الشعبه</h3>
      <table class="w-full text-center" dir="rtl" style="font-size: ${Variables.AppearanceSettings.sectionsDetailsFontSize || 15}px;">
        <thead>
          <tr>
            <th class="border-2 border-gray-300 bg-gray-100 select-text">الشعبة</th>
            <td class="border select-text">
            ${Variables.courses[courseIndex].sections[sectionIndex].id}
            </td>
          </tr>
          <tr>
            <th class="border-2 border-gray-300 bg-gray-100 select-text">الحالة</th>
            <td class="border select-text">
              ${Variables.courses[courseIndex].sections[sectionIndex].status}
            </td>
          </tr>
          <tr>
            <th class="border-2 border-gray-300 bg-gray-100 select-text">النشاط</th>
            <td class="border select-text">
              ${Variables.courses[courseIndex].sections[sectionIndex].type}
            </td>
          </tr>
          <tr>
            <th class="border-2 border-gray-300 bg-gray-100 select-text">المقر</th>
            <td class="border select-text">
              ${Variables.courses[courseIndex].sections[sectionIndex].location}
            </td>
          </tr>
          <tr>
            <th class="border-2 border-gray-300 bg-gray-100 select-text">القاعة</th>
            <td class="border select-text">
              ${
                timeIndex == -1
                  ? "شعبه اونلاين"
                  : Variables.courses[courseIndex].sections[sectionIndex].room[timeIndex]
              }
            </td>
          </tr>
          <tr>
            <th class="border-2 border-gray-300 bg-gray-100 select-text">المحاضر</th>
            <td class="border select-text">
              ${Variables.courses[courseIndex].sections[sectionIndex].instructor}
            </td>
          </tr>
          <tr>
            <th class="border-2 border-gray-300 bg-gray-100 select-text">الوقت</th>
            <td class="border select-text">
              ${
                timeIndex == -1
                  ? "شعبه اونلاين"
                  : Variables.courses[courseIndex].sections[sectionIndex].time[
                      timeIndex
                    ][0] +
                    "-" +
                    Variables.courses[courseIndex].sections[sectionIndex].time[
                      timeIndex
                    ][1]
              }
            </td>
          </tr>
          
        </thead>
      </table>
    </div>
    </div>
    `,[{text:"حسنا",id:Custom_btn_ID.CANCEL,color:Custom_Colors.BLUE}]
  );
}
