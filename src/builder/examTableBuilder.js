import { Variables } from "../shared/config/config.js";

export function startTimeBuild(value) {
  const items = [];
  const periodsName = ["أول", "ثاني", "ثالث", "رابع"];
  for (let i = 0; i < value; i++) {
    items.push(`
      <div class="mb-2 flex justify-start items-center justify-content-center flex-1">
        <label for="${i}" class="ml-2 font-semibold text-center"><bdi>${
          periodsName[i]
        } فترة </bdi></label>
        <div class="w-full drop-menu-border flex-1 mx-1">
          <select name="${i}" id="startPeriods" class="w-full p-2 drop-menu ${
      Variables.darkModeON ? "dark:second" : ""
    }" dir="rtl" lang="ar">
            <option ${i == 0 ? "selected" : ""} value="8:00">8:00</option>
            <option value="8:30">8:30</option>
            <option value="9:00">9:00</option>
            <option value="9:30">9:30</option>
            <option value="10:00">10:00</option>
            <option ${i == 1 ? "selected" : ""} value="10:30">10:30</option>
            <option value="11:00">11:00</option>
            <option value="11:30">11:30</option>
            <option value="12:00">12:00</option>
            <option value="12:30">12:30</option>
            <option ${i == 2 ? "selected" : ""} value="1:00">1:00</option>
            <option value="1:30">1:30</option>
            <option value="2:00">2:00</option>
            <option value="2:30">2:30</option>
            <option value="3:00">3:00</option>
            <option ${i == 3 ? "selected" : ""} value="3:30">3:30</option>
            <option value="4:00">4:00</option>
          </select>
        </div>
      </div>
    `);
  }
  $("#peroidSelectionLocation").html(items);
  $("[id=startPeriods]").each(function () {
    $(this).val(Variables.startPeriods[$(this).attr("name")]);
  });
}


export function buildExamTable(noExamDay, beforeExamWeek) {
  let tempExamNumber = Variables.examNumberPeriods;
  let tempStartPeriods = Variables.startPeriods;
  let noExamCourses = "";
  const Weeks = {
    1: "الأول",
    2: "الثاني",
    3: "الثالث",
    4: "الرابع",
    5: "الخامس",
  };
  const WeekDays = {
    0: "الأحد",
    1: "الأثنين",
    2: "الثلاثاء",
    3: "الأربعاء",
    4: "الخميس",
  };
  const tableTitles = ["جدول الاختبارات", "جدول اسبوع قبل الاختبارات"];
  let titleIndex = 0;
  let tbody = [];
  let beforeExamTable = [];

  // console.log(tempStartPeriods);
  

  let table = `
    <div style="width: 31.5vw;">
      <div class="w-full text-center font-semibold py-2 " style="font-size: 0.9vw;">${
        tableTitles[titleIndex]
      }</div>
      <table id="exam-table" class="text-center font-light text-surface w-full" style="font-size: ${Variables.AppearanceSettings.ExamTableFontSize || 15}px;">
                            <thead
                              class="border-b border-neutral-200 bg-slate-500 dark:border-white/10 text-white">
                              <tr style="z-index: 2;">
                              ${
                                tempExamNumber <= 3
                                  ? ""
                                  : '<th scope="col" class="px-4 py-4 w-40 font-bold">' +
                                    tempStartPeriods[3] +
                                    "</th>"
                              }
                              ${
                                tempExamNumber <= 2
                                  ? ""
                                  : '<th scope="col" class="px-4 py-4 w-40 font-bold">' +
                                    tempStartPeriods[2] +
                                    "</th>"
                              }
                              ${
                                tempExamNumber <= 1
                                  ? ""
                                  : '<th scope="col" class="px-4 py-4 w-40 font-bold">' +
                                    tempStartPeriods[1] +
                                    "</th>"
                              }
                              ${
                                tempExamNumber <= 0
                                  ? ""
                                  : '<th scope="col" class="px-4 py-4 w-40 font-bold">' +
                                    tempStartPeriods[0] +
                                    "</th>"
                              }
                                <th scope="col" class="px-4 py-4 w-40 font-bold">اليوم</th>
                              </tr>
                            </thead>
  `;
  tbody.push("<tbody>"); // add tbody for the table

  // let tempDaysOfexam = Variables.daysOfExam;
  if (beforeExamWeek) {
    titleIndex = 1;
    beforeExamTable.push(`
      <div style="width: 31.5vw;">
        <div class="w-full text-center font-semibold py-2 " style="font-size: 0.9vw;">${tableTitles[titleIndex]}</div>
        <table class="text-center text-sm font-light text-surface w-full">
          <thead
            class="border-b border-neutral-200 bg-slate-500 dark:border-white/10 text-white">
            <tr style="z-index: 2;">
            <th scope="col" class="px-4 py-4 w-40 font-bold">3:30</th>
            <th scope="col" class="px-4 py-4 w-40 font-bold">1:00</th>
            <th scope="col" class="px-4 py-4 w-40 font-bold">10:30</th>
            <th scope="col" class="px-4 py-4 w-40 font-bold">8:00</th>
            <th scope="col" class="px-4 py-4 w-40 font-bold">اليوم</th>
            </tr>
          </thead>
          <tbody>
    `);
    for (let i = 0; i < 5; i++) {
      let slots = [];

      // Here the loop will be reversed because of the table structure it's reversed
      for (let j = 3; j >= 0; j--) {
        slots.push(
          `<td id="before-exam-${i % 5}-${j}" week="-1" day="${
            i % 5
          }" period="${j}" class="border ${
            Variables.darkModeON ? "dark:border dark" : ""
          } text-white exam-table"></td>`
        );
      }

      const row = `
      <tr class="even:bg-gray-300 bg-gray-100">
        ${slots.join("")}
        <td class="border px-4 py-2 ${Variables.darkModeON ? "dark:border dark" : ""}">${
        WeekDays[i % 5]
      }</td>
      </tr>
      `;
      beforeExamTable.push(row);
    }
    beforeExamTable.push(`
          </tbody>
        </table>
      </div>
    `);
  }
  for (let i = 0, weekNum = 1; i < Variables.daysOfExam; i++) {
    // if(i == 0){
    //     row = `
    //     <tr class="h-2">
    //       <td colspan="4" class="border bg-slate-400 px-4 whitespace-nowrap py-4"><bdi class="font-bold text-white">الاسبوع قبل الاختبارات</bdi></td>
    //     </tr>
    //     `;
    //     tbody.push(row);
    // }

    // let weekNum = Math.ceil(((i+t)+1)/5);
    if (i % 5 == 0 && i != 0) {
      const row = `
        <tr class="h-2">
          <td colspan="${
            Variables.examNumberPeriods + 1
          }" class="border bg-slate-400 px-4 whitespace-nowrap py-4"><bdi class="font-bold text-white">الأسبوع ${
        Weeks[weekNum + 1]
      }</bdi></td>
        </tr>
      `;
      tbody.push(row);
      weekNum++;
    }

    // Create the periods

    let slots = [];

    // Here the loop will be reversed because of the table structure it's reversed
    for (let j = Variables.examNumberPeriods - 1; j >= 0; j--) {
      slots.push(
        `<td id="exam-${weekNum}-${i % 5}-${j}" week="${weekNum}" day="${
          i % 5
        }" period="${j}" class="border ${
          Variables.darkModeON ? "dark:border dark" : ""
        } text-white exam-table"></td>`
      );
    }

    const row = `
    <tr class="even:bg-gray-300 bg-gray-100">
      ${slots.join("")}
      <td class="border px-4 py-2 ${Variables.darkModeON ? "dark:border dark" : ""}">${
      WeekDays[i % 5]
    }</td>
    </tr>
    `;
    tbody.push(row);
  }
  // console.log(noExamDay);
  
  noExamDay.forEach((elm) => {
    // console.log(Variables.courses[elm.id]);
    
    noExamCourses += `<bdi section="${elm.sectionid}"  class="m-1 p-2 section-router bg-slate-400 rounded text-white">${
      Variables.courses[elm.id].courseName
    } - ${Variables.courses[elm.id].courseCode} - ${elm.type} </bdi>`;
  });

  tbody.push(`
    </tbody>
    </table>
    ${
      noExamDay.length != 0
        ? `<p class="m-2">:مواد لم يتم تحديد موعد اختبارها</p>`
        : ""
    }
      <div class="flex min-w-0 flex-wrap flex-row-reverse">
        ${noExamCourses}
      </div>
    </div>
    `);

  return beforeExamTable.join("") + table + tbody.join("");
}