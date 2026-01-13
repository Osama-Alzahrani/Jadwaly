import { Custom_btn_ID, Custom_Colors, CustomModal } from "../../assets/js/modal.js";
import { buildExamTable } from "../builder/examTableBuilder.js";
import { Variables } from "../shared/config/config.js";


function isItCollideExam(target, name) {
  let counter = 0;
  for (let i = 0; i < Variables.selectedSections.length; i++) {
    const corIndex = Variables.selectedSections[i]["course"];
    const secIndex = Variables.selectedSections[i]["section"];
    const section = Variables.courses[corIndex]["sections"][secIndex];
    if (section.examDay == target) {
      counter++;
    }
  }
  if (counter > 1) {
    return true;
  }

  console.log("Count of this is:" + name + " || " + counter);
  return false;
}

export function getExamsText(ExamNum){
    return getExamText(getExamDay(ExamNum));
}

function getExamText(ExamNum) {
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
  const Periods = Variables.startPeriods;

  if (ExamNum.day === null) {
    return {
      day: null,
      time: null,
      week: null,
    };
  }

  if (ExamNum.week > Variables.daysOfExam / 5) {
    return {
      day: WeekDays[ExamNum.day],
      time: Periods[ExamNum.time],
      week: "الاسبوع قبل الاختبارات",
    };
  } else {
    return {
      day: WeekDays[ExamNum.day],
      time: Periods[ExamNum.time],
      week: Weeks[ExamNum.week],
    };
  }
}

function getExamDay(examDay) {
  if (!examDay || examDay.toString().trim().length === 0) {
    return { day: null, time: null, week: null };
  }

  // Config (adjust if needed)
  const perDayPhase1 = Number(Variables.examNumberPeriods); // 3
  const perDayPhase2 = 2;
  const daysPerWeek = 5;

  // Break point: last slot of the 3-per-day phase
  // If your code already ensures this equals 50, keep it.
  const BREAK = 50; // or: Variables.daysOfExam * perDayPhase1

  let n = Number(examDay);

  // ----- Phase 1: 3 periods/day -----
  if (n <= BREAK) {
    const perWeekSlots = daysPerWeek * perDayPhase1; // 15
    const week = Math.ceil(n / perWeekSlots);

    const zeroBasedWithinWeek = (n - 1) % perWeekSlots;     // 0..14
    const day = Math.floor(zeroBasedWithinWeek / perDayPhase1) + 1; // 1..5
    const time = (zeroBasedWithinWeek % perDayPhase1);          // 1..3

    return { day: day - 1, time, week };
  }

  // ----- Phase 2: 2 periods/day -----
  // Spec: 51–61 is week 10; 61 maps to day 5, time 2.
  const offset = n - BREAK; // 51->1, 54->4, 61->11

  let week, withinBlock;
  if (offset <= 11) {
    week = 10;                        // special block
    withinBlock = Math.min(offset, 10); // clamp 61 to behave like 60
  } else {
    // After 61, weeks advance by full 10-slot weeks (2 per day * 5 days)
    const afterBlock = offset - 11; // 62->1, ...
    const slotsPerWeek2 = daysPerWeek * perDayPhase2; // 10
    week = 10 + Math.ceil(afterBlock / slotsPerWeek2);
    // Position within its current 10-slot week (1..10)
    withinBlock = ((afterBlock - 1) % slotsPerWeek2) + 1;
  }

  const day = Math.ceil(withinBlock / perDayPhase2);        // 1..5
  const time = ((withinBlock - 1) % perDayPhase2);      // 1..2

  return { day: day - 1, time, week };
}

export function showExams() {
  Variables.sectionsExam = [];
  const noExamDay = [];
  let beforeExamWeek = false;
  Variables.selectedSections.forEach((selected) => {
    const corIndex = selected["course"];
    const secIndex = selected["section"];

    const section = Variables.courses[corIndex]["sections"][secIndex];
    const exam = getExamDay(section.examDay);

    console.log(exam);

    if (
      Variables.sectionsExam.some(
        (course) =>
          course.id === Variables.courses[corIndex].courseCode &&
          course.type === section.type
      )
    ) {
      return;
    }

    if (!beforeExamWeek && section.examDay > Variables.daysOfExam) {
      //it mean after 3 week of exam
      beforeExamWeek = true;
    }

    if (section.examDay.trim().length === 0) {
      //IF there no exam day but it in noExam List
      if (!noExamDay.some((day) => day.id === corIndex)) {
        noExamDay.push({ id: corIndex, type: section.type, sectionid: secIndex });
      }
    } else {
      if (isItCollideExam(section.examDay, Variables.courses[corIndex].courseName)) {
        dangerAlert(
          "Conflict",
          "There are two/more than courses have conflict in the exam day"
        );
      }
    }

    // IF everything good add it to sectionExam list
    Variables.sectionsExam.push({
      section: secIndex,
      id: Variables.courses[corIndex].courseCode,
      name: Variables.courses[corIndex].courseName,
      exam: exam,
      type: section.type,
    });
  });

  const body = buildExamTable(noExamDay, beforeExamWeek);

  CustomModal("", body, [
    { text: "حسنا", id: Custom_btn_ID.CANCEL, color: Custom_Colors.BLUE },
    { text: "نسخ", id: "copy-exam-table", color: Custom_Colors.YELLOW },
    { text: "حفظ", id: "save-exam-table", color: Custom_Colors.YELLOW },
  ]);
  
  Variables.sectionsExam.forEach((elm) => {
    let text = "";
    if (Variables.daysOfExam / 5 < elm.exam.week) {
      text = "before-exam-" + elm.exam.day + "-" + elm.exam.time;
    } else {
      text = "exam-" + elm.exam.week + "-" + elm.exam.day + "-" + elm.exam.time;
    }
    console.log(text);

    $("#" + text).html(`
      <div section="${elm.section}" class="overflow-hidden break-words section-router">${elm.id} <br>
      ${elm.name}</div>
    `);
    $("#" + text).attr(
      "style",
      $("#" + elm.section)
        .attr("style")
        .replace(";", "") + " !important;"
    );
  });
}

function sortExam() {
  Variables.sectionsExam.sort((a, b) => {
    // Sort by week first
    if (a.exam.week !== b.exam.week) {
      return a.exam.week - b.exam.week;
    }

    // If the weeks are the same, sort by day
    if (a.exam.day !== b.exam.day) {
      return a.exam.day - b.exam.day;
    }

    // If the days are the same, sort by time
    return a.exam.time - b.exam.time;
  });
}

function copyExams() {
  sortExam();
  let prevWeek = "";
  let maxLength = 0;
  let textArray = [];
  let textToCopy = "";
  Variables.sectionsExam.forEach((sec, i) => {
    if (sec.exam.day == null) {
      return;
    }

    let text = "";
    date = getExamText(sec.exam);

    if (sec.exam.week !== prevWeek) {
      prevWeek = sec.exam.week;
      textArray.push({
        text: date.week,
      });
    }
    let textEdited;

    console.log(sec.exam);
    if (sec.exam.week == 4) {
      textEdited = `\u202B ${sec.name} - ${
        sec.id
      } \u202B [${"أسبوع قبل الاختبارات"} , ${
        " يوم " + date.day
      } , ${date.time.EntoAr()}] \u202A`;
    } else {
      textEdited = `\u202B ${sec.name} - ${sec.id} \u202B [${
        " الاسبوع " + date.week
      } , ${" يوم " + date.day} , ${date.time.EntoAr()}] \u202A`;
    }

    if (maxLength < textEdited.length) {
      maxLength = textEdited.length;
    }

    text += textEdited;
    textArray.push(text);
  });

  textArray.forEach((element) => {
    if (typeof element == "object") {
      textToCopy +=
        "=".repeat(maxLength / 3) +
        `[ الأسبوع ${element.text} ]` +
        "=".repeat(maxLength / 3);
      textToCopy += "\n";
      return;
    }
    let diff = maxLength + 4 - element.length;
    textToCopy += " ".repeat(diff / 2) + element + " ".repeat(diff / 2);
    textToCopy += "\n";
  });

  console.log(textArray);
  console.log(textToCopy);

  copyToClipboard(textToCopy);
}