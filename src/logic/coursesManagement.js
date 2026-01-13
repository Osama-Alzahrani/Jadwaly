import Course from "../Models/Course.js";
import Section from "../Models/Section.js";
import { Constant } from "../shared/config/constant.js";
import { Variables } from "../shared/config/config.js";
import { colors, TimeToMinutes } from "../utils/utils.js";
import { dangerAlert,warningAlert } from "../../assets/js/modal.js";
import t from "../utils/myi18.js";

export function updateCreditHours() {
  let totalCreditHours = 0;
  Variables.selectedCourses.forEach((course) => {
    totalCreditHours += Number(Variables.courses[course].creditHours);
  });
  $("#total-credit-hours").text(totalCreditHours);

  if (totalCreditHours >= 21 && !Variables.hoursExceeded) {
    dangerAlert(
      "تجاوزت الساعات المسموحة",
      "لا يمكنك إضافة أكثر من 21 ساعة إذا لم تكن طالب خريج وإذا كنت كذلك يمكنك إضافة 24 ساعة",
      "حسناً"
    );
    Variables.hoursExceeded = true;
  } else if (totalCreditHours < 21) {
    Variables.hoursExceeded = false;
  }
}

export function showAllCourses() {
  $("#available-courses").empty(); // Clear existing courses

  Variables.courses.forEach((course, index) => {
    // console.log(course,index);
    const list = `
      <div class="pt-2 mt-2 px-4 py-2 available-course rounded select-none" index="${index}">
          <p>${course["courseName"]}</p>
          <p>${course["courseCode"]}</p>
      </div>
    `;
    $("#available-courses").append(list);
  });
}

export function clearTimetable() {
  // Clear the timetable

  let ConflictStyles = [];

  $(".conflict-section").each(function () {
    // console.log($(this).attr("id"));
    $(this).removeClass("conflict-section");
    $(this).removeAttr("title");
  });

  // console.log('Conflict Sections:',Variables.intersectSections);
  

  Object.entries(Variables.intersectSections).forEach(([day, sets]) => {
    sets.forEach((period) => {
      period.forEach((sec) => {
        // console.log($("#section-" + sec).attr("style"));
        // console.error("#"+sec);
        $("#"+sec).addClass("conflict-section");
        $("#"+sec).attr("title", "يوجد شعبة أخرى تتعارض مع هذه الشعبة تم اختيارها");

        
        ConflictStyles.push({ id: sec, day: day, style: $(`[id='section-${sec}'][day='${day}']`).attr("style") });
        // console.log(ConflictStyles[ConflictStyles.length - 1]);
        
      });
    });
  });

  $("[id^=day-]").each(function () {
    // console.log($(this).attr("id"));

    $(this).html("");
    $(this).removeAttr("style");
  });

  return ConflictStyles;
}


export function addSelectedCourse(index) {
  const selected = Variables.courses[index];

  const sections = selected["sections"]
    .map((section, secIndex) => {
      return `
        <div id="${secIndex}" index="${index}" class="pt-2 available-section max-w-28 min-h-20 mt-2 rounded-md ${
        section["status"] === "مغلقة" ? "closed-section" : "opened-section"
      }" style="background-color: rgb(${
        colors[Math.floor(Math.random() * colors.length)]
      });">
          <p>${section["type"]}</p>
          <p>${section["id"]}</p>
          <p>${section["instructor"]}</p>
        </div>
      `;
    })
    .join(""); // Join the array elements into a single string

  const list = `
    <li class="pb-5">
      <div>
        <div class="course select-none text-center p-2 ${Variables.toggleHiddenSections ? 'dynamicTitles' : ''}" index="${index}">
          <bdi style="font-size: 1.1rem; font-weight: 600">${selected["courseCode"]} - ${selected["courseName"]}</bdi>
        </div>
        <div class="flex min-w-0 gap-x-1 flex-wrap justify-center">
          ${sections}
        </div>
      </div>
    </li>
    `;

  $("#available-list").prepend(list);

  filterSelectedCourses();
  // check if filter is on to filter the selected course
  // let filterIsON = false;
  // $('input[name="day"]:checked').each(function() {
  //   filterIsON = true;
  //   return false;
  // });

  // if(filterIsON){
  //   filterSelectedCourses();
  // }
}


function getTime(text) {
  // console.log(text);
  if (text.length === 0) {
    return [];
  }
  let newText = [];
  //` 1 3 @t 12:25 م - 01:40 م @r COC-308COE `
  //` 5 @t 10:00 ص - 11:40 ص @r 203 أ(A) @n  3 @t 12:00 م - 12:50 م @r 203 أ(A)`
  //day = text.substring(text.indexOf("@t")-2, text.indexOf("@t")).trim();

  let classRoom;
  if (text.indexOf("@n") === -1) {
    let dayv2 = text.substring(0, text.indexOf("@t")).trim();
    // console.log(dayv2);
    classRoom = text.slice(text.indexOf("@r") + 2).trim();

    if (dayv2.length !== 1) {
      const splitDay = dayv2.split(" ");
      // console.log("splitDays: "+splitDay);
      splitDay.forEach((item) => {
        newText.push([
          "@" +
            item +
            "@" +
            text.slice(text.indexOf("@t") + 2, text.indexOf("@r")).trim(),
          classRoom,
        ]);
      });
    } else {
      newText.push([
        "@" +
          dayv2 +
          "@" +
          text.slice(text.indexOf("@t") + 2, text.indexOf("@r")).trim(),
        classRoom,
      ]);
    }
  } else {
    let spliter = text.split("@n").map((item) => item.trim());
    // console.log(spliter);
    // console.log("================================================================");
    spliter.forEach((item) => {
      const dayv2 = item.substring(0, text.indexOf("@t") - 1).trim();
      classRoom = item.slice(text.indexOf("@r") + 2).trim();
      const time = item.slice(item.indexOf("@t") + 2, item.indexOf("@r")).trim();
      // console.log("Day: "+dayv2+" | ClassRoom: "+classRoom + " | Time: "+time);
      newText.push(["@" + dayv2 + "@" + time, classRoom]);
    });
    // console.log("----------------------------------------------------------");
    // console.log("Using second:");
  }

  return newText;
}

export function filterSelectedCourses() {
  $(".available-section").removeClass("hidden");

  const theLocation = $("#locations").val();

  // console.log("Filtering");
  // const selectedDays = [];
  // $('input[name="day"]:checked').each(function() {
  //   selectedDays.push($(this).val());
  // });

  // console.log(selectedDays);

  
  Variables.selectedCourses.forEach((course) => {
    Variables.courses[course].sections.forEach((section, index) => {




      $("#" + index).removeClass("skipped");
      $("#" + index).removeClass("hidden");
      $("#" + index).removeClass("hidden-section");
      $("#" + index).removeClass("same-activity-section");
      $("#" + index).removeAttr("title");

      if (section["dayOfWeek"].some((day) => Variables.selectedDays.includes(day))) {
        
        if (!Variables.selectedSections.some((sec) => sec.section == index)) {
          if (Variables.toggleHiddenSections === false) {
            $("#" + index).addClass("hidden");
          }else{
            $("#" + index).addClass("hidden-section");
            $("#" + index).attr("title", "هذة الشعبة مخفية لأنها لا تتوافق مع الفلتر المختار");
          }
          $("#" + index).removeClass("skipped");
        }else{
          // console.log("Skipped in: "+index);
          $("#" + index).addClass("skipped");
          $("#" + index).attr("title", "هذة الشعبة لا تتوافق مع الفلتر المختار");

        }
      }
      if (theLocation !== "all" && theLocation !== section.location) {
        // console.log("Done in: "+index);
        // $("#" + index).toggleClass("hidden");

        if (!Variables.selectedSections.some((sec) => sec.section == index)) {
          if (Variables.toggleHiddenSections === false) {

            $("#" + index).toggleClass("hidden");
          }else{
            $("#" + index).addClass("hidden-section");
            $("#" + index).attr("title", "هذة الشعبة مخفية لأنها لا تتوافق مع الفلتر المختار");
          }
          $("#" + index).removeClass("skipped");
        }else{
          // console.log("Skipped in: "+index);
          $("#" + index).addClass("skipped");
          
        }
      }
    });
  });
  if (!Variables.allowSameActivity) {
    Variables.selectedSections.forEach((section) => {
      console.log(section);
      
        if (Variables.selectedSections.some((sec) => sec.section !== section.section && Variables.courses[sec.course] === Variables.courses[section.course] && Variables.courses[sec.course].sections[sec.section].type === Variables.courses[section.course].sections[section.section].type)) {
          if(!$("#" + section.section).hasClass("skipped")){
            $("#" + section.section).addClass("same-activity-section");
            $("#" + section.section).attr("title", "يوجد شعبة أخرى من نفس النوع تم اختيارها");
          }
          
        }
    });
  }
}

function getPeriod(text) {
  let newText = [];
  text.forEach((elemnt) => {
    const day = elemnt[0].slice(1, 2);
    const texts = elemnt[0]
      .substring(3)
      .split("- ")
      .map((item) => item.trim());
    const comb = {
      period: texts,
      day: day,
      room: elemnt[1],
    };
    newText.push(comb);
  });

  return newText;
}

function getEachCourse(courses) {
  // newCourse = [];
  // courses.forEach((course) => {
  //   //console.log(getPeriod(getTime(course)));
  //   newCourse.push();
  // })
  const newCourse = getPeriod(getTime(courses));
  //console.log(newCourse);

  return newCourse;
}


export function courseOrganizer(data) {

  
  if (data.length === 0) {
    console.error("No data available to organize courses.");
    warningAlert(t('modal.warning.title'), t('modal.warning.description'), t('modal.warning.button_ok'));
    return;
  }
  let preName = "";
  Variables.universityName = data[1];
  data = data[0];

  if (Variables.universityName === "uqu") {
    $("#show-exams").hide();
  }

  if (Variables.universityName === "uqu") {
    $("#settings-exams").hide();
    $("#settings-exams-title").hide();
  }


  data.forEach((content, index) => {
    let name = content["courseName"];

    if (name === preName) {
      return;
    }
    preName = name;
    let code = content["courseCode"];
    let credit = content["courseCredit"];
    // console.log(content["courseCredit"]);
    

    let sections = [];
    data.forEach((elm, i) => {
      if (elm["courseName"] === name) {

        if (credit === "" && elm["courseCredit"] !== "") {
          credit = elm["courseCredit"];
        }

        let codeTimes = [];
        let days = [];
        let periods = [];
        let rooms = [];

        let mycourse = "";
        // TimeToMinutes(mycourse);
        if (Variables.universityName !== "uqu") {
          mycourse =getEachCourse(elm["details"]);
          TimeToMinutes(mycourse);
          mycourse.forEach((element) => {
            element["room"] = element["room"].length === 0 ? Constant.L_NotDefined : element["room"];
            codeTimes.push(element["codeTime"]);
            days.push(element["day"]);
            periods.push(element["period"]);
            rooms.push(element["room"]);
          });
        }else{
          // console.log("UQU",elm["details"]);
          elm["location"] = getSectionsTimeUqu(elm["details"],codeTimes, days,periods,elm["location"],rooms);
          // console.log("Out Location",elm["location"]);
          
          // TimeToMinutes(mycourse);
          // codeTimes.push(mycourse);
          // days.push("null");
          // periods.push("null");
          // rooms.push("null");
        }

        //console.log(mycourse);

        if (!Variables.Locations.includes(elm["location"])) {
          Variables.Locations.push(elm["location"]);
        }
        sections[i] = new Section(
          elm["id"],
          elm["location"],
          elm["type"],
          rooms,
          periods,
          codeTimes,
          days,
          elm["instructor"],
          elm["examDay"],
          elm["status"]
        );
      }
    });
    Variables.courses[index] = new Course(name, code, credit, sections);
  });

  // console.log(Variables.Locations);
  Variables.Locations.forEach((location) => {
    $("#locations").append(`<option value="${location}">${location}</option>`);
  });
  // deleteArray();

  //console.log("Save!!");

  //saveArray(courses);
}

export function removeSections(corIndex) {
  for (let i = 0; i < Variables.selectedSections.length; i++) {
    if (Variables.selectedSections[i].course == corIndex) {
      removeFromCodeTimes(
        Variables.selectedSections[i].course,
        Variables.selectedSections[i].section
      );
      removeSection(Variables.selectedSections[i].section);
      // selectedSections.splice(i, 1);

      i--;
    }
  }
}

export function removeFromCodeTimes(course, section) {
  let localMaxTime = -1;
  let codeTime = Variables.courses[course].sections[section].codeTime;
  codeTime.forEach((elm) => {
    if (localMaxTime < parseInt(elm["end"], 10)) {
      localMaxTime = parseInt(elm["end"], 10);
    }
  });

  
  let remove_index = Variables.timeCodes.indexOf(localMaxTime);
  // console.log("This is just a removed",remove_index);
  // console.log("This is just a localMaxTime",localMaxTime);
  
  if (remove_index !== -1) {
    Variables.timeCodes.splice(remove_index, 1);
    // Variables.timeCodes = Variables.timeCodes.filter((_,index) => index === remove_index);
  }

  // console.log(Variables.timeCodes);
  
  // console.log("Remove after",Variables.timeCodes);

  let hours = 0;
  if (Variables.maxTimeCode == Variables.timeCodes[0]) return;
  if (Variables.timeCodes.length == 0) {
    let diff = Variables.maxTimeCode - 900;
    Variables.maxTimeCode = 900;
    hours = Math.ceil(diff / 60);
  } else {
    if (Variables.maxTimeCode - Variables.timeCodes[0] >= 60) {
      // console.log("inside the code",(maxTimeCode+60)-Variables.timeCodes[0]);
      if (Variables.timeCodes[0] > 900) {
        let diff = Variables.maxTimeCode - Variables.timeCodes[0];
        hours = Math.ceil(diff / 60);
        // maxTimeCode = Variables.timeCodes[0];
        Variables.maxTimeCode = Math.ceil((Variables.timeCodes[0] - 60) / 60) * 60;
        // console.log("Ok");
      } else {
        let diff = Variables.maxTimeCode - 900;
        Variables.maxTimeCode = 900;
        hours = Math.ceil(diff / 60);

      }
    }
  }

  let table = $("#timetable").find("table");
  let tbody = table.find("tbody");
  if (hours == 0) return;
  tbody.children().slice(-hours).remove();
}

export function removeSection(id) {
  const index = Variables.selectedSections.findIndex((item) => item.section === id);
  //removeFromCodeTimes(selectedSections[index].course,id);

  // Object.keys(Variables.intersectSections).forEach(key => {
  //   if(Variables.intersectSections[key].section === id || Variables.intersectSections[key].intersectWith === id) {
  //     if(Variables.intersectSections[key].section === id) {
  //       card = $("#section-"+Variables.intersectSections[key].intersectWith);
  //       card.width('80%');
  //       card.css("transform","translate(0, 0)");
  //       console.log(card);
  //     } else if(Variables.intersectSections[key].intersectWith === id) {
  //       thisCard = $("#section-"+Variables.intersectSections[key].section);
  //       thisCard.width('80%');
  //       console.log(thisCard);
  //     }
  //     delete Variables.intersectSections[key]; // Remove the element from the dictionary
  //   }
  // });
  const courseI = Variables.selectedSections[index].course;
  const sectionI = Variables.selectedSections[index].section;
  const section = Variables.courses[courseI].sections[sectionI];

  section["dayOfWeek"].forEach((day) => {
    Variables.intersectSections[day].forEach((intersect) => {
      

      if (intersect.has(sectionI)) {
        // card = $("#section-"+sectionI);
        // card.width('80%');
        // console.log(card);
        if (intersect.size <= 2) {
          Variables.intersectSections[day] = Variables.intersectSections[day].filter(
            (intersect) => !(intersect.has(sectionI) && intersect.size <= 2)
          );
        }
        // console.log('Intersecting Section:', intersect);
        

        intersect.delete(sectionI);
        let innerI = 0;
        intersect.forEach((secIndex) => {
          const thisCard = $(
            `[id='section-${secIndex}'][day='${day}']`
          ).first();
          const width = `${80 - innerI * 6}%`;
          thisCard.css("width", width);
          thisCard.css("z-index", innerI);
          // console.log(width, thisCard);
          innerI++;
        });
      }
    });
  });

  if (index !== -1) {
    Variables.selectedSections.splice(index, 1);
  } else {
    alert("Error removing section");
  }

  $("[id=section-" + id + "]").remove();

  if ($("#onlineCourses").children().length == 0) {
    const table = $("#timetable").find("tbody");
    $("#onlineTitle").hide();
    $("#onlineCourses").removeClass("mb-10");
    $(table).css("border-bottom-width", "");
  }
}

function isIntersecting(period1, period2) {
  // const [start1, end1] = period1.map(convertToMinutes);
  // const [start2, end2] = period2.map(convertToMinutes);
  const [start1, end1] = period1.map(Number);
  const [start2, end2] = period2.map(Number);
  return start1 <= end2 && start2 <= end1;
}

//TODO: WHY 2 loop since you add 1 section and check everytime -> after analyze it's seems it's need two loops but change the length of the first loop to length length of codetime
function CheckIntersect(periods, section) {
  // console.log(section);
  // console.log(periods);
  // console.log(section.length);
  // console.log(periods.length);

  for (let i = 0; i < section.length; i++) {
    for (let j = 0; j < periods.length; j++) {
      // if (isIntersecting(periods[i], periods[j])) {
      //   console.log(periods[i].slice(0,2) + "|||||| "+ periods[j].slice(0,2));
      //   console.log("done");
      //   return true;
      // }
      //console.log(`i = ${i}: ${periods[i][2]}, j = ${j}: ${periods[j][2]}`);
      //Check For days is it equal ?
      if (section[i][2] === periods[j][2]) {
        //console.log(periods[i][2],periods[j][2]);

        if (isIntersecting(section[i], periods[j])) {
          // console.log(i + "|||||| "+ j);
          // console.log("done");
          if (Variables.allowConflict) {
            // console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
            // console.log("periods",periods[j][3],"section",section[i][3]);
            // console.log("periods",periods[j],"section",section[i]);
            // console.log("periods",j,"section",i);
            // console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");

            // if (!Object.values(Variables.intersectSections).some(list => list.includes(section[i][3]))) {
            //     Variables.intersectSections[section[i][2]].push([periods[j][3]]);
            // }else{
            //     Variables.intersectSections[section[i][2]].push(periods[j][3]);
            // }
            // console.log("Section:", section[i], "Periods:", periods[j]);

            // Check for the day in the list:
            // Variables.intersectSections[section[i][2]].push(new Set([section[i][3],periods[j][3]]));

            let isItAdded = false;
            // let indexAdded = false;
            // if(Variables.conflictInfo["dayOfConflict"].has(section[i][2])){
            //   indexAdded = true;
            //   console.log("IT'S THERE");

            // }
            Variables.conflictInfo["dayOfConflict"].add(section[i][2]);
            // console.log("intersected:",Variables.intersectSections[section[i][2]]);
            // console.log("Day intersected:",Variables.conflictInfo["dayOfConflict"]);
            
            Variables.intersectSections[section[i][2]].forEach((intersect, index) => {
              console.log(intersect);
              //Check if this section is added as it's intersected
              if (intersect.has(periods[j][3])) {
                //Add the intersected section to the Set -> Avoic duplicate
                intersect.add(section[i][3]);
                isItAdded = true;
                Variables.conflictInfo["index"].push(index);
              }
            });

            //If not added to the list add it
            if (!isItAdded) {
              Variables.intersectSections[section[i][2]].push(
                new Set([section[i][3], periods[j][3]])
              );
              if (Variables.intersectSections[section[i][2]].length == 0) {
                Variables.conflictInfo["index"].push(
                  Variables.intersectSections[section[i][2]].length
                );
              } else {
                Variables.conflictInfo["index"].push(
                  Variables.intersectSections[section[i][2]].length - 1
                );
              }
            }

            // let added = false;
            // Object.values(Variables.intersectSections).forEach((elm)=>{
            //   elm.forEach((newElm,index)=>{
            //     // console.log(newElm);

            //     if (newElm.has(periods[j][3])) {
            //       // console.log("Periods list already has", periods[j][3],newElm);
            //       newElm.add(section[i][3]);
            //       added = true;
            //       Variables.conflictInfo['index'].add(index);
            //     }
            //   })
            // })

            // if(!added){
            //   // console.error("Cant handle this",periods[j][3]);
            //   Variables.intersectSections[section[i][2]].push(new Set([periods[j][3],section[j][3]]));
            //   // Variables.conflictInfo['dayOfConflict'] =
            //   if(Variables.intersectSections[section[i][2]].length == 0){
            //     Variables.conflictInfo['index'].add(Variables.intersectSections[section[i][2]].length);
            //   }else{
            //     Variables.conflictInfo['index'].add(Variables.intersectSections[section[i][2]].length-1);
            //   }

            // }

            // }else{

            // }

            Variables.hasIntersected = true;
            Variables.conflictInfo["dayOfConflict"].add(section[i][2]);
          } else {
            return true;
          }
        }
      }
    }
  }

  // Flatten the nested array to compare all periods
  // const flattenedPeriods = periods.flat();
  // console.log(flattenedPeriods);

  // for (let i = 0; i < flattenedPeriods.length - 1; i++) {
  //   for (let j = i + 1; j < flattenedPeriods.length; j++) {
  //     if(flattenedPeriods[2] == flattenedPeriods[j][5]){
  //       if (isIntersecting(flattenedPeriods[i].slice(0,2), flattenedPeriods[j].slice(0,2))) {
  //         console.log(flattenedPeriods[i].slice(0,2) + "|||||| "+ flattenedPeriods[j].slice(0,2));

  //         console.log("done");
  //         return true;
  //       }
  //     }
  //   }
  // }
  return false;
}

export function isItCollide() {
  Variables.hasIntersected = false;
  Variables.conflictInfo = { dayOfConflict: new Set(), index: [] };
  const S_corIndex = Variables.selectedSections[0]["course"];
  const S_secIndex = Variables.selectedSections[0]["section"];
  const S_section = Variables.courses[S_corIndex]["sections"][S_secIndex];
  let intersect = false;

  Variables.selectedSections.forEach((selected) => {
    const corIndex = selected["course"];
    const secIndex = selected["section"];

    if (secIndex === S_secIndex) return false;

    const section = Variables.courses[corIndex]["sections"][secIndex];

    let combination = [];
    let theSectionCom = [];
    section["codeTime"].forEach((time, index) => {
      combination.push([
        time["start"],
        time["end"],
        section["dayOfWeek"][index],
        secIndex,
      ]);
    });
    S_section["codeTime"].forEach((time, index) => {
      theSectionCom.push([
        time["start"],
        time["end"],
        S_section["dayOfWeek"][index],
        S_secIndex,
      ]);
    });

    //console.log(combination);
    //console.log(CheckIntersect(combination));

    if (CheckIntersect(combination, theSectionCom) == true) {
      dangerAlert("تعارض", ".يوجد تعارض في أوقات المادة</br> يمكنك السماح بالتعارضات من الاعدادات", "حسناً");
      // console.log("Intersect");
      // console.log(S_section);
      // console.log("================================================");
      if (!Variables.allowConflict) {
        intersect = true;
      }

      return true;
    }
  });

  return intersect;
}