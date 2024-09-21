// TODO: Add the exam day to the section
// TODO: Show Only half of the table after that show each hour needed

class Course {
  constructor(courseName,courseCode,creditHours,sections){
    this.courseName = courseName;
    this.courseCode = courseCode;
    this.creditHours = creditHours;
    this.sections = sections;
  }
}

class Section {
  //TODO: Done! You must check for null or undefined !!!!!!!!
  constructor(id, location, type, room="null", time="null",codeTime="null", dayOfWeek="null", instructor="null", examDay="null", status) {
    this.id = id;
    this.location = location;
    this.type = type;
    this.room = room;
    this.time = time;
    this.codeTime = codeTime;
    this.dayOfWeek = dayOfWeek;
    this.instructor = instructor;
    this.examDay = examDay;
    this.status = status;
  }

  display(){
    console.log(`${this.section} - ${this.location} - ${this.type} - ${this.room} - ${this.time} - ${this.dayOfWeek} - ${this.instructor} - ${this.examDay} - ${this.status}`);
  }
}


const courses = [];
const selectedCourses = [];
const selectedSections = [];
const Locations = [];
let selectedDays = [];
const DAYS_OF_EXAM = 15;

const L_NotDefined = "لم يحدد من الكلية";
let hoursExceeded = false;
let hasMessageListener = false;


const colors = [
  "34, 98, 62",   // Dark Sea Green
  "36, 104, 102", // Dark Turquoise
  "50, 74, 118",  // Dark Cornflower Blue
  "53, 45, 103",  // Dark Slate Blue
  "61, 52, 119",  // Dark Medium Slate Blue
  "16, 89, 85",   // Dark Light Sea Green
  "0, 64, 64",    // Dark Teal
  "51, 102, 85",  // Dark Aquamarine
  "32, 112, 104", // Dark Turquoise
  "67, 103, 118", // Dark Sky Blue
  "47, 79, 80",   // Dark Cadet Blue
  "73, 56, 109",  // Dark Medium Purple
  "35, 65, 90",   // Dark Steel Blue
  "88, 112, 115", // Dark Powder Blue
  "25, 102, 25",  // Dark Lime Green
  "128, 128, 128",// Gray
  "84, 84, 84",   // Darker Gray
  "105, 105, 105",// Dim Gray
  "0, 95, 127",   // Dark Deep Sky Blue
  "69, 21, 113"   // Dark Blue Violet

];



//TODO: Done! check if courses are empty then load the saved one. before that always save the courses 
//TODO: Fix Indexes after check if courses are empty then load the saved one. before that always save the courses 

document.addEventListener('DOMContentLoaded', () => {
  // Request the content from the background page
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    hasMessageListener = true;
    if (request.action === 'insertContent') {
        let data = request.content;
        let preName = "";
        data.forEach((content,index) =>{
          let name = content["courseName"];
          
          if(name === preName){
            return;
          }
          preName = name;
          let code = content["courseCode"];
          let credit = content["courseCredit"];



          let sections = [];
          data.forEach((elm,i) => {
            if ( elm["courseName"] === name)
            {
              let mycourse = getEachCourse(elm["details"]);
              // TimeToMinutes(mycourse);
              TimeToMinutes(mycourse);

              //console.log(mycourse);
              let codeTimes = [];
              let days = [];
              let periods = [];
              let rooms = [];
              mycourse.forEach((element) => {
                element["room"] = (element["room"].length === 0)? L_NotDefined : element["room"];
                codeTimes.push(element["codeTime"]);
                days.push(element["day"]);
                periods.push(element["period"]);
                rooms.push(element["room"]);
              });
              if (!Locations.includes(elm["location"])) {
                Locations.push(elm["location"]);
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
          courses[index] = new Course(
            name,
            code,
            credit,
            sections
          );
        });


        console.log("Save!!");
        localStorage.setItem("courses", JSON.stringify(courses));
        console.log(courses);

        // After receiving the data from the background
        showAllCourses();
        //testing();
        console.log(Locations);
        Locations.forEach((location)=>{
          $("#locations").append(`<option value="${location}">${location}</option>`);
        });
        
    }
  });
  if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
      console.log("Page is reloaded.");
      if(courses.length == 0){
        console.log("Load!!");
        const storedCourses = JSON.parse(localStorage.getItem('courses')) || [];
    
    
        const filteredCourses = storedCourses
        .filter(course => course !== null) // Remove null courses
        .map(course => {
            // Create a copy of the course to modify
            const updatedCourse = { ...course };
            
            // Loop backwards to remove null sections using splice
            for (let i = updatedCourse.sections.length - 1; i >= 0; i--) {
                if (updatedCourse.sections[i] === null) {
                    updatedCourse.sections.splice(i, 1); // Remove the null section
                }
            }
            
            return updatedCourse; // Return the updated course
        });
        courses.push(...filteredCourses)
        console.log(filteredCourses);
        showAllCourses();
      }
  } else {
      console.log("Page is loaded for the first time.");
  }


  
});

function showAllCourses(){
  $("#available-courses").empty(); // Clear existing courses

  courses.forEach((course,index) => {
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

function filterCourses(searchTerm) {
  $("#available-courses").empty();
  courses.forEach((course, index) => {
    if (course["courseName"].toLowerCase().includes(searchTerm.toLowerCase()) ||
        course["courseCode"].toLowerCase().includes(searchTerm.toLowerCase())) {
      const list = `
        <div class="pt-2 mt-2 px-4 py-2 available-course rounded select-none" index="${index}">
            <p>${course["courseName"]}</p>
            <p>${course["courseCode"]}</p>
        </div>
      `;
      $("#available-courses").append(list);
    }
  });
}

function testing(){
  console.log(courses);

  courses.forEach((course,index) => {
    // console.log(course,index);

  const sections = course["sections"].map((section, secIndex) => {
      return `
        <div id="${secIndex}" class="pt-2 available-section max-w-28 min-h-20 mt-2 rounded-md ${(section["status"] === "مغلقة"? "closed-section": "opened-section")}" style="background-color: rgb(${colors[Math.floor(Math.random() * colors.length)]});">
          <p>${section["type"]}</p>
          <p>${section["id"]}</p>
          <p>${section["instructor"]}</p>
        </div>
      `;
    }).join(''); // Join the array elements into a single string

    const list = `
    <li class="py-5">
      <div>
        <div class="course">
          <p> ${course["courseName"]} </p>
        </div>
        <div class="flex min-w-0 gap-x-1 flex-wrap">
          ${sections}
        </div>
      </div>
    </li>
    `;


    $("#available-list").append(list);
    
    
  });

  // for (let i = 0; i < courses.length; i++) {
    // console.log(courses[i]);
    
    // let mysec = courses[i]["sections"].forEach((section,secIndex) => {
    //   `
    //   <div id="${secIndex}" class="pt-2 available-section" style="border-right: 11px solid #e91e63;">
    //     <p>${section["type"] + section["id"]}</p>
    //     <p>${section["instructor"]}</p>
    //   </div>
    //  `
    // });
    // console.log(mysec);
    
    // let list = `
    // <li class="flex justify-between gap-x-6 py-5">
    //   <div class="flex min-w-0 gap-x-4">

    //   </div>
    // </li>
    // `;
    
  // }
  
}

function buildTable(){
  table = $('#timetable').find('table');
  tbody = table.find('tbody');
  
  for (let i = 8; i < 24; i++) {
    row = `
      <tr class="h-16">
        <td class="border px-8 whitespace-nowrap  px-6 py-4"></td>
        <td class="border px-8 whitespace-nowrap  px-6 py-4"></td>
        <td class="border px-8 whitespace-nowrap  px-6 py-4"></td>
        <td class="border px-8 whitespace-nowrap  px-6 py-4"></td>
        <td class="border px-8 whitespace-nowrap  px-6 py-4"></td>
        <td class="border px-8 whitespace-nowrap  px-6 py-4">${(i < 12)? `${i}:00 ص`: i == 12? `${i}:00 م`: `${i-12}:00 م`}</td>
      </tr>
    `;
    
    tbody.append(row);
  }
}



// TODO: Need to Fix or Remove it because now availableCourses are using just indexes

function RefreshSelectedCourses(){
  $("#available-list").html("");
  selectedCourses.forEach((course,index) => {

    const sections = course["sections"].map((section, secIndex) => {
      return `
        <div id="${secIndex}" class="pt-2 available-section max-w-28 min-h-20 mt-2 rounded-md ${(section["status"] === "مغلقة"? "closed-section": "opened-section")}" style="background-color: rgb(${colors[Math.floor(Math.random() * colors.length)]});">
          <p>${section["type"]}</p>
          <p>${section["id"]}</p>
          <p>${section["instructor"]}</p>
        </div>
      `;
    }).join(''); // Join the array elements into a single string

    const list = `
    <li class="py-5 selected-course" index="${index}">
      <div>
        <div class="course">
          <p> ${course["courseName"]} </p>
        </div>
        <div class="flex min-w-0 gap-x-1 flex-wrap">
          ${sections}
        </div>
      </div>
    </li>
    `;


    $("#available-list").append(list);
    
  });
}

function addSelectedCourse(index){
  const selected = courses[index];

    const sections = selected["sections"].map((section, secIndex) => {
      return `
        <div id="${secIndex}" index="${index}" class="pt-2 available-section max-w-28 min-h-20 mt-2 rounded-md ${(section["status"] === "مغلقة"? "closed-section": "opened-section")}" style="background-color: rgb(${colors[Math.floor(Math.random() * colors.length)]});">
          <p>${section["type"]}</p>
          <p>${section["id"]}</p>
          <p>${section["instructor"]}</p>
        </div>
      `;
    }).join(''); // Join the array elements into a single string

    const list = `
    <li class="pb-5">
      <div>
        <div class="course select-none" index="${index}">
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

function addToTimetable(style) {
  const WeekDays = {0:"الأحد",1:"الأثنين",2:"الثلاثاء",3:"الأربعاء",4:"الخميس"};
  const Periods = {0:"8:00 - 10:00",1:"10:30 - 12:30",2:"1:00 - 3:00"};
  //Todo: make sure it all the time for example chemistry has 2 section atr
  const table = $('#timetable').find('tbody');
  const tableHeight = table.innerHeight();
  const corIndex = selectedSections[0]["course"];
  const secIndex = selectedSections[0]["section"];
  const section = courses[corIndex]["sections"][secIndex];
  if(section["dayOfWeek"].length === 0){
    alert(L_NotDefined);
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
  console.log(tableHeight);
  section["codeTime"].forEach((period,indx) => {
    console.log(period);

    pixelPerMin = tableHeight/(1440-480); // -480 is the start time of the day 8:00 am
    startPixel = pixelPerMin * (period["start"] - 480);
    endPixel = pixelPerMin * (period["end"] - 480);
  
    console.log(`Time start: ${startPixel} => Time end: ${endPixel} => Test: ${period["end"] - 480}`);

    const OrgColor = tinycolor(style.substring(style.indexOf(":")+1).trim());
    const DarkerColor = OrgColor.darken(6).toString();
    const BorderColor = OrgColor.darken(8).toString();
    $("#day"+section["dayOfWeek"][indx]).append(`
      <div id="section-${secIndex}" course="${corIndex}" timeIndex="${indx}" class="overflow-hidden rounded-lg flex flex-col text-start timetable-section ${$("#side-menu").hasClass("slideLeft")? "SOpend":""}" style="height: ${pixelsToVH(endPixel-startPixel)}vh; margin-top: ${pixelsToVH(startPixel)}vh; ${style} border: ${pixelsToVW(5)}vw solid ${BorderColor};">
        
        <!-- Top section -->
        <div class="w-full">
          <div class="flex justify-between text-white border-b border-black" style="background-color: ${DarkerColor};">
            <span class="text-black px-1 border-black border-r rounded-br-lg" style="padding: 0.1vw; background-color: ${section.type === "عملي" || section.type === "تدريب" ? "#FFC700": "#FFFFFF"}">${section.type}</span>
            <span class="w-full text-center">${section.id}</span>
            <span class="px-1 border-black border-l rounded-bl-lg" style="background-color: ${section.status === "مغلقة"? "#f03d3d":"#4E6F43"}">${section.status}</span>
          </div>
        </div>
    
        <!-- Centered content -->
        <div id="course-overflow-${secIndex}" class="flex flex-col flex-grow justify-center items-center overflow-auto h-full">
          
          <div class="flex justify-center text-center">
            <span class="${$("#side-menu").hasClass("slideLeft")? "":"sm:px-8"} rounded mt-1 course-title" style="background-color: ${DarkerColor}; font-weight: 700;">${courses[corIndex].courseName}</span>
          </div>
          
          <div class="flex justify-center" dir="rtl">
            <bdi id="sec-time" class="rounded mt-1 ${$("#side-menu").hasClass("slideLeft")? "text-xs":""}" style="background-color: ${DarkerColor}; line-height: 0.75rem;">
              <svg class="text-black inline-block h-5 w-5 mb-0 bg-slate-300 rounded-br rounded-tr" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6 -3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ${section.time[indx][0]} - ${section.time[indx][1]}
            </bdi>
          </div>
        </div>
      </div>
    `);
    
    
    
  });

  
}

function isItCollide(){
  
  const S_corIndex = selectedSections[0]["course"];
  const S_secIndex = selectedSections[0]["section"];
  const S_section = courses[S_corIndex]["sections"][S_secIndex];
  let intersect = false;
  selectedSections.forEach((selected)=>{
    const corIndex = selected["course"];
    const secIndex = selected["section"];
    
    if (secIndex === S_secIndex) return false;

    const section = courses[corIndex]["sections"][secIndex];

    let combination = [];
    section["codeTime"].forEach((time,index)=>{
      combination.push([time["start"],time["end"],section["dayOfWeek"][index]]);
    });
    S_section["codeTime"].forEach((time,index)=>{
      combination.push([time["start"],time["end"],S_section["dayOfWeek"][index]]);
    });

    console.log(combination);
    console.log(CheckIntersect(combination));

    if(CheckIntersect(combination) == true){
      dangerAlert("Intersect","There is intersect")
      console.log("Intersect");
      console.log("================================================");
      console.log(S_section["id"]);
      intersect = true;
      return true;
    }
    
  });

  return intersect;
}

function IsBeforeExamWeek(examDay){
  const examWeek = 45;
  return examDay > examWeek;
}

//TODO: Remove it. it is useless
function checkSectionExists(secIndex) {
  let exist = false;

  for (let i = 0; i < selectedSections.length; i++) {
    
    if (selectedSections[i].section === secIndex){
      alert("find it")
      exist = true;
      break;
    }
  }
  return exist;
}

function removeSections(corIndex) {
  for (let i = 0; i < selectedSections.length; i++) {
    if(selectedSections[i].course == corIndex){
      removeSection(selectedSections[i].section)
      // selectedSections.splice(i, 1);
      i--;
    }
  }
}

function removeSection(id) {
  const index = selectedSections.findIndex(item => item.section === id);
  console.log(id);
  
  if (index !== -1) {
    selectedSections.splice(index, 1);
  }else{
    alert("Error removing section");
  }
  $("[id=section-"+id+"]").remove();

}

function previewSection(courseIndex,sectionIndex,style) {
  const table = $('#timetable').find('tbody');
  const tableHeight = table.innerHeight();
  const section = courses[courseIndex].sections[sectionIndex];
  section["codeTime"].forEach((period,indx) => {
    console.log(period);

    pixelPerMin = tableHeight/(1440-480);
    startPixel = pixelPerMin * (period["start"] - 480);
    endPixel = pixelPerMin * (period["end"] - 480);
  
    console.log(`Time start: ${startPixel} => Time end: ${endPixel} => Test: ${period["end"] - 480}`);
    
  
    $("#day"+section["dayOfWeek"][indx]).append(`
      <div id="preview-section-${sectionIndex}" course="${courseIndex}" class="timetable-section flex flex-col justify-center items-center ${$("#side-menu").hasClass("slideLeft")? "SOpend":""}"" style="direction: rtl; height: ${endPixel-startPixel}px; margin-top: ${startPixel}px; ${style}">
        ${courses[courseIndex].courseName}<br>
        ${courses[courseIndex].courseCode} - ${section.type}<br>
        ${section.time[indx][0]} - ${section.time[indx][1]}<br>
        ${section.room[indx]}<br>
        ${section.instructor}
      </div>
    `);
  });
}

function removePreview(id) {
  $("[id=preview-section-"+id+"]").remove();
}

// TODO: Done! remove selected sections from the timetable
function filterSelectedCourses(){

  $(".available-section").removeClass("hidden");

  const theLocation = $('#locations').val();

  



  // console.log("Filtering");
  // const selectedDays = [];
  // $('input[name="day"]:checked').each(function() {
  //   selectedDays.push($(this).val());
  // });


  console.log(selectedDays);

  selectedCourses.forEach((course)=>{
    courses[course].sections.forEach((section,index)=>{
      if(section["dayOfWeek"].some(day => selectedDays.includes(day))){
        console.log("Found"+index);
        $("#"+index).toggleClass("hidden");
      }else if(theLocation !== "all" && theLocation !== section.location){
        console.log("Done in: "+index);
        $("#"+index).toggleClass("hidden");
      }
    });
  });
}

function updateCreditHours(){
  let totalCreditHours = 0;
  selectedCourses.forEach((course)=>{
    totalCreditHours += Number(courses[course].creditHours);
  });
  $("#total-credit-hours").text(totalCreditHours);

  if(totalCreditHours >= 21 && !hoursExceeded){
    dangerAlert("Credit Hours","You can't add more than 21 credit hours if you are not a graduate student if you are you can add 24 hours","OK");
    hoursExceeded = true;
  }else if(totalCreditHours < 21){
    hoursExceeded = false;
  }
}

function captureTimetable(){
  // Capture the timetable as an image
  width = $("#timetable").width();
  $("#timetable").css("width",width+"px")
  html2canvas(document.querySelector("#timetable")).then(canvas => {
    // Convert the canvas to a data URL
    const dataURL = canvas.toDataURL("image/png");
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'timetable.jpg';
    link.id="image-link";

    // Create a preview image
    const previewImg = document.createElement('img');
    previewImg.src = dataURL;
    previewImg.style.maxWidth = '100%';
    previewImg.style.height = 'auto';
    previewImg.style.marginBottom = '10px';

    // Create a container for the preview
    const previewContainer = document.createElement('div');
    previewContainer.appendChild(previewImg);

    // Show the preview in a modal
    CustomAlert(
        "<p class='text-lg font-semibold text-center text-white bg-[#1F294F] p-3' dir='ltr'> الجدول </p>",
        previewContainer.outerHTML,
        "download-timetable",
        "حفظ"
    );
    
    // Append the link to the body, click it, and remove it
    document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // $("#save-timetable").prop('disabled', false);
    // $("#save-timetable").removeClass('opacity-50 cursor-not-allowed');
  });
}

  // Function to show the modal
  function showModal() {
      $("#modal").removeClass('hidden');
      $('body').addClass('overflow-hidden');
  }

  // Function to hide the modal
  function hideModal() {
      $("#timetable").removeAttr("style")
      $("#modal").addClass('hidden');
      $('body').removeClass('overflow-hidden');
      $("#image-link").remove();
  }

  function getExamText(ExamNum){
    const Weeks = {1:"الأول",2:"الثاني",3:"الثالث",4:"الرابع"}
    const WeekDays = {0:"الأحد",1:"الأثنين",2:"الثلاثاء",3:"الأربعاء",4:"الخميس"};
    const Periods = {0:"8:00 - 10:00",1:"10:30 - 12:30",2:"1:00 - 3:00"};

    if (ExamNum.day === null) {
      return {
        day: null,
        time: null,
        week: null
      }
    }


    return {
      day: WeekDays[ExamNum.day],
      time: Periods[ExamNum.time],
      week: Weeks[ExamNum.week]
    }
  }

  function getExamDay(ExamDay){
    if (ExamDay.trim().length === 0) {
      return {
        day: null,
        time: null,
        week: null
      }
    }

    const exam_WeekNumber = Math.ceil(Number(ExamDay)/15); // Out of 15 days. 3 weeks
    const exam_dayNum = Math.ceil(Number(ExamDay)/3); // Out of 1 days there is 3 periods.
    const exam_dayWeek = (exam_dayNum-1)%5;           // Out of 5 days a week.
    const exam_dayTime = (Number(ExamDay)-1)%3;      // Out of 3 times a day.
    return {
      day: exam_dayWeek,
      time: exam_dayTime,
      week: exam_WeekNumber
    }
  }

  function isTextWrapped(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
  }

function fixOverflow(elm_width,parent_width){
  if(elm_width >= parent_width){
    
  }
}

function isOverflowed($element) {
  return $element[0].scrollHeight > $element[0].clientHeight || $element[0].scrollWidth > $element[0].clientWidth;
}

function DisplaySections(){
  
}


//TODO: Done! change background color for exam day and make it same as the section color !!
//TODO: if there is section selected but not have a exam date show it in the end of table !!
function getSectionInfo(){
  const sectionsInfo = [];
  const noExamDay = [];
  selectedSections.forEach((selected)=>{
      const corIndex = selected["course"];
      const secIndex = selected["section"];

      const section = courses[corIndex]["sections"][secIndex];
      const exam = getExamDay(section.examDay);

      if(section.examDay.trim().length === 0){
        if (!noExamDay.some(day => day.id === corIndex)) {
          noExamDay.push({"id":corIndex,"type":section.type});
        }
      }

      sectionsInfo.push({
        "section":secIndex,
        "id":courses[corIndex].courseCode,
        "name": courses[corIndex].courseName,
        "exam": exam
      })
      
  });

  console.log(sectionsInfo);

  table = `
    <div class="w-full text-center font-bold text-white py-2 font-xl bg-stone-500">جدول الاختبارات</div>
    <table class="text-center text-sm font-light text-surface ">
                          <thead
                            class="border-b border-neutral-200 bg-slate-500 dark:border-white/10 text-white">
                            <tr style="z-index: 2;">
                              <th scope="col" class="px-4 py-4 w-40 font-bold">1:00</th>
                              <th scope="col" class="px-4 py-4 w-40 font-bold">10:30</th>
                              <th scope="col" class="px-4 py-4 w-40 font-bold">8:00</th>
                              <th scope="col" class="px-4 py-4 w-40 font-bold">اليوم</th>
                            </tr>
                          </thead>

  `
  const WeekDays = {0:"الأحد",1:"الأثنين",2:"الثلاثاء",3:"الأربعاء",4:"الخميس"};
  const Weeks = {1:"الأول",2:"الثاني",3:"الثالث",4:"الرابع"}

  let tbody = []
  tbody.push("<tbody>");
  for (let i = 0; i < DAYS_OF_EXAM; i++) {
    let weekNum = Math.ceil((i+1)/5);
    if (i%5 == 0 && i != 0){
        row = `
        <tr class="h-2">
          <td colspan="4" class="border bg-slate-400 px-4 whitespace-nowrap py-4"><bdi class="font-bold text-white">الأسبوع ${Weeks[weekNum]}</bdi></td>
        </tr>
      `
      tbody.push(row);
    }
    row = `
    <tr class="h-2 even:bg-gray-300 bg-gray-100">
      <td id="exam-${weekNum}-${i%5}-2" week="${weekNum}" day="${i%5}" period="2" class="border px-4 text-white whitespace-nowrap py-2 exam-table"></td>
      <td id="exam-${weekNum}-${i%5}-1" week="${weekNum}" day="${i%5}" period="1" class="border px-4 text-white whitespace-nowrap py-2 exam-table"></td>
      <td id="exam-${weekNum}-${i%5}-0" week="${weekNum}" day="${i%5}" period="0" class="border px-4 text-white whitespace-nowrap py-2 exam-table"></td>
      <td class="border px-4 whitespace-nowrap py-2">${WeekDays[i%5]}</td>
    </tr>
    `;
    tbody.push(row);
  }

  let noExamCourses = "";
  noExamDay.forEach((elm)=>{
    noExamCourses += `<bdi class="m-1 p-2 bg-slate-400 rounded text-white">${courses[elm.id].courseName} - ${courses[elm.id].courseCode} - ${elm.type} </bdi>` 
  });


  tbody.push(`
    </tbody>
    </table>
    <p class="m-2">:مواد لم يتم تحديد موعد اختبارها</p>
    <div class="flex min-w-0 flex-wrap flex-row-reverse" style="max-width: 30vw">
      ${noExamCourses}
    </div>
    `)

  
  const body = table + tbody.join("")

  CustomAlert("",body);
  sectionsInfo.forEach((elm)=>{
    text = "exam-"+elm.exam.week+"-"+elm.exam.day+"-"+elm.exam.time;
    $("#"+text).html(`
      <p>${elm.id} </br>
      ${elm.name}</p>
    `);
    $("#"+text).attr("style",$("#"+elm.section).attr("style"))
  })
}

$(document).ready(function(){


  $(document).on("click", "#show-sections", function() {
    getSectionInfo();
  });


  $(document).on("click", ".timetable-section", function() {
    const courseIndex = $(this).attr("course");
    const sectionIndex = ($(this).attr('id')).replace("section-","");
    const timeIndex = $(this).attr("timeIndex");

    const ExamDay = courses[courseIndex].sections[sectionIndex]["examDay"];
    const exam = getExamText(getExamDay(ExamDay));


    CustomAlert("",
      `
      <div class="flex w-[40rem] flex-row-reverse">
      <div class="w-full border-2 border-black">
          <h3 class="p-2 border-b-2 border-black text-base font-semibold leading-6 text-white" style="background-color: #263365;" id="modal-title">:معلومات المقرر</h3>
          <table class="w-full text-center text-sm" dir="rtl">
          <thead>
            <tr>
              <th class="border-2 border-gray-300 bg-gray-100 ">رمز المقرر</th>
              <td class="border">
                ${courses[courseIndex].courseCode}
              </td>
            </tr>
            <tr>
              <th class="border-2 border-gray-300 bg-gray-100 ">اسم المقرر</th>
              <td class="border">
                ${courses[courseIndex].courseName}
              </td>
            </tr>
            <tr>
              <th class="border-2 border-gray-300 bg-gray-100 ">الساعات</th>
                            <td class="border">
                ${courses[courseIndex].creditHours}
              </td>
            </tr>
            <tr>
              <th class="border-2 border-gray-300 bg-gray-100 ">الإختبار</th>
              <td class="border">
                ${exam.day === null? "لم يحدد من الكلية":` الفترة [${ExamDay}] </br> الاسبوع ${exam.week} / يوم ${exam.day} </br> :الوقت ${exam.time}`}
              </td>
            </tr>

          </thead>
        </table>
      </div>
      <div class="w-full border-2 border-r-0 border-black">
        <h3 class="p-2 border-b-2 border-black w-full text-base font-semibold leading-6 text-white" style="background-color: #263365;" id="modal-title">:معلومات الشعبه</h3>
        <table class="w-full text-center text-sm" dir="rtl">
          <thead>
            <tr>
              <th class="border-2 border-gray-300 bg-gray-100 ">الشعبة</th>
              <td class="border">
              ${courses[courseIndex].sections[sectionIndex].id}
              </td>
            </tr>
            <tr>
              <th class="border-2 border-gray-300 bg-gray-100 ">الحالة</th>
              <td class="border">
                ${courses[courseIndex].sections[sectionIndex].status}
              </td>
            </tr>
            <tr>
              <th class="border-2 border-gray-300 bg-gray-100 ">النشاط</th>
                            <td class="border">
                ${courses[courseIndex].sections[sectionIndex].type}
              </td>
            </tr>
            <tr>
              <th class="border-2 border-gray-300 bg-gray-100 ">المقر</th>
                            <td class="border">
                ${courses[courseIndex].sections[sectionIndex].location}
              </td>
            </tr>
            <tr>
              <th class="border-2 border-gray-300 bg-gray-100 ">القاعة</th>
                            <td class="border">
                ${courses[courseIndex].sections[sectionIndex].room[timeIndex]}
              </td>
            </tr>
            <tr>
              <th class="border-2 border-gray-300 bg-gray-100 ">المحاضر</th>
                            <td class="border">
                ${courses[courseIndex].sections[sectionIndex].instructor}
              </td>
            </tr>
            <tr>
              <th class="border-2 border-gray-300 bg-gray-100 ">الوقت</th>
                            <td class="border">
                ${courses[courseIndex].sections[sectionIndex].time[timeIndex][0] +"-"+ courses[courseIndex].sections[sectionIndex].time[timeIndex][1]}
              </td>
            </tr>
            
          </thead>
        </table>
      </div>
      </div>
      `,
    )
  });

  // Hide modal when clicking the Cancel button
  $('.bg-gray-50 button:contains("Cancel")').on('click', hideModal);

  // Handle Deactivate button click
  $('.bg-gray-50 button:contains("Deactivate")').on('click', function() {
      // Add your deactivation logic here
      console.log('Account deactivated');
      hideModal();
  });
  



  $(document).on("click", "#days-filter", function(event) {
    if($(this).hasClass("selectedDay")){
      selectedDays.splice(selectedDays.indexOf($(this).attr("value")), 1);
    }else{
      selectedDays.push($(this).attr("value"));
    }
    console.log($(this).text());
    $(this).toggleClass("selectedDay");
    filterSelectedCourses();
  });


  $(document).on("click", "#coverBG", function(event) {
    if(event.target.id === "coverBG")
      hideModal();
  });

  $(document).on("click", "#side-menu-btn", function(event) {
    if($("#side-menu").hasClass("slideLeft")){
      
      $("#side-menu").removeClass("slideLeft");
      $("#side-menu").addClass("slideRight");
    }else{
      
      $("#side-menu").removeClass("hidden");
      $("#side-menu").removeClass("slideRight");
      $("#side-menu").addClass("slideLeft");
    }
    if($("#side-menu").hasClass("slideRight")) {
      $(".timetable-section").removeClass("sideOpened");
      $(".timetable-section").addClass("sideClosed");
      $(".course-title").addClass("sm:px-8");
      // $("[id=sec-time]").removeClass("text-xs");
    }else{
      $(".timetable-section").removeClass("sideClosed");
      $(".timetable-section").addClass("sideOpened");
      $(".course-title").removeClass("sm:px-8");
      // $("[id=sec-time]").addClass("text-xs");
    }
  });


  $(document).on("click", "#download-timetable", function() {
    document.getElementById("image-link").click();
    
    // Wait for the download window to open
    setTimeout(() => {
        // Check if the download has started
        if (document.getElementById("image-link").download) {
          $("#timetable").removeAttr("style")
          hideModal();
        } else {
            // If download hasn't started, wait a bit longer
            setTimeout(hideModal, 1000);
        }
    }, 100);
    
  });

  $(document).on("click", "#modal-button-ok", function() {
    hideModal();
  });
  
  $(document).on("click", "#modal-button-cancel", function() {
    console.log('Account deactivated');
    hideModal();
  });

  $(document).on("click", "#check-timetable", function() {
    correctAlert("saved","Your timetable has been saved","Done");
  });


  $(document).on("click", "#save-timetable", function() {
    captureTimetable();
    
  });
  
  // Search Bar
  $("#course-search").on("input", function() {
    const searchTerm = $(this).val();
    filterCourses(searchTerm);
  });

  // Event listener for day filter checkboxes
  $('input[name="day"]').on('change', function() {
    filterSelectedCourses();
  });

  $('#locations').on('change', function() {
    filterSelectedCourses();
  });
  
  //"mouseenter mouseleave"
  $(document).on("mouseenter mouseleave", ".available-section", function() {

    // IF selected no need to preview it again :|
    if($(this).hasClass("selected-section")){
      return false;
    }
    //alert($(this).children("p").eq(0).text());
    if($(this).hasClass("preview-section")){
      // alert("Selected");
      $(this).toggleClass("preview-section");
      removePreview($(this).attr("id"));
      return false;
    }
    $(this).toggleClass("preview-section");
    previewSection(
      $(this).attr("index"),
      $(this).attr("id"),
      $(this).attr("style")
    );
  });

  $(document).on("click", ".available-section", function() {
    //alert($(this).children("p").eq(0).text());

    //TODO: Done! Check if there is a section with the same data
    
    if($(this).hasClass("selected-section")){
      // alert("Selected");
      if($(this).hasClass("preview-section")){
        removePreview($(this).attr("id"));
      }
      $(this).toggleClass("selected-section");
      removeSection($(this).attr("id"));
      return false;
    }


    
    // if(checkSectionExists($(this).attr("id"))){
    //   return false;
    // }
    selectedSections.unshift({
      course: $(this).attr("index"),
      section: $(this).attr("id")
    });
    
    
    if(!isItCollide()){
      // To avoid duplication after selecting a section
      if($(this).hasClass("preview-section")){
        removePreview($(this).attr("id"));
      }
      $(this).toggleClass("selected-section");
      addToTimetable($(this).attr("style"));
      const sec = $(this).attr("id");

      $("[id=course-overflow-"+sec+"]").each(function() {
        if(isOverflowed($(this))) {
          $(this).children().eq(0).children().eq(0).removeClass("sm:px-8");
          console.log("Flowed");
          console.log(this);
        }else{
          console.log("not Flowed");
        }
      });
      
      // if (isOverflowed($("[id=course-title-"+sec+"]").parent().parent())) {
      //   $("[id=course-title-"+sec+"]").removeClass("sm:px-8")
      //   alert('The element is overflowed.');
      // } else {
      //   console.log($("#course-title-"+sec).parent().parent());
      // }

    }else{
      selectedSections.splice(0, 1);
    }
    console.log(selectedSections);
  });
  
  $(document).on("click", ".toggle-btn", function() {

    $("#coruse-section").toggleClass("animation-slideUp");
    $("#coruse-section").toggleClass("animation-slideDown");

    $(".toggle-btn svg").toggleClass("rotate-180").css({
      'transition': 'transform 0.5s',
      'transform': function() {
        return $(this).hasClass('rotate-180') ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    });


    
  });
  
  $(document).on("click", ".available-course", function() {
    const index = $(this).attr("index");
    selectedCourses.unshift(index)
    $(this).toggleClass("selected");
    console.log(selectedCourses);
    addSelectedCourse(index);
    updateCreditHours();
  });

  $(document).on("click", ".course", function() {
    // selectedCourses.unshift(courses[$(this).attr("index")])
    
    $(".available-course[index|='"+$(this).attr("index")+"']").toggleClass("selected");
    const index = selectedCourses.findIndex(ind => ind === $(this).attr("index"));

    if (index !== -1) {
        // Remove the element at the found index
        selectedCourses.splice(index, 1);
    }
    $(this).closest("li").remove();
    removeSections($(this).attr("index"));
    updateCreditHours();
    console.log(selectedCourses);
  });
  
  // $(document).on("click", ".course", function() {
  //   // selectedCourses.unshift(courses[$(this).attr("index")])
    
  //   $(".available-course[index|='"+$(this).attr("index")+"']").toggleClass("selected");
  //   const index = selectedCourses.findIndex(ind => ind === $(this).attr("index"));

  //   if (index !== -1) {
  //       // Remove the element at the found index
  //       selectedCourses.splice(index, 1);
  //   }
  //   $(this).closest("li").remove();
  //   removeSections($(this).attr("index"));
  //   console.log(selectedCourses);
  // });
  
  buildTable();


  // let courses = [" 1 @t 09:45 ص - 11:25 ص @r COC-107CS"," 2 @t 09:45 ص - 11:25 ص @r COC-107CS"," 2 @t 08:00 ص - 09:40 ص @r 102 م"," 3 @t 10:00 ص - 11:40 ص @r 202 ب ( B) @n  5 @t 12:00 م - 12:50 م @r 202 ب ( B)"];
  // let mycourse = getEachCourse(courses);
  // TimeToMinutes(mycourse);
  // console.log(CheckIntersect(mycourse));
  
});


let courseMinutes = [];


function convertToMinutes(time) {
  const [hours, minutesPart] = time.split(':');
  const minutes = parseInt(minutesPart.slice(0, 2), 10);
  const isPM = minutesPart.includes('م'); // Check if the time is in PM ("م")
  let hoursIn24Format = parseInt(hours, 10);

  if (isPM && hoursIn24Format !== 12) {
    hoursIn24Format += 12;
  } else if (!isPM && hoursIn24Format === 12) {
    hoursIn24Format = 0;
  }

  return hoursIn24Format * 60 + minutes;
}

function TimeToMinutes(sections) {
  sections.forEach((section) => {
    start = convertToMinutes(section["period"][0]);
    end = convertToMinutes(section["period"][1]);
    section["codeTime"] = { start: start, end: end };
  });
}

function isIntersecting(period1, period2) {
  // const [start1, end1] = period1.map(convertToMinutes);
  // const [start2, end2] = period2.map(convertToMinutes);
  const [start1, end1] = period1;
  const [start2, end2] = period2;
  console.log(start1,end1,start2,end2);
  return start1 <= end2 && start2 <= end1;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//~~~~~~~~~~~~~~~~~~~~~~~~~~| Don't delete Old Version with bug |~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

// function getTime(text){
//   newText = [];
//   while (text.indexOf("@t")+1 && text.length > 0){
    
//       day = text.substring(text.indexOf("@t")-2, text.indexOf("@t")).trim();
//       let classRoom;
//       if(text.indexOf("@n") === -1){
//         classRoom = text.slice(text.indexOf("@r") + 2).trim();
//       }else{
//         classRoom = text.slice(text.indexOf("@r") + 2,text.indexOf("@n")).trim();
//       }
      
      
//       text = text.substring(text.indexOf("@t")+2);
//       //console.log(text.slice(0, text.indexOf("@r")).trim());
//       newText.push(["@"+day +"@"+ text.slice(0, text.indexOf("@r")).trim(),classRoom]);
//   }
      
//   return newText;
// }


function getTime(text){
        // console.log(text);
        if(text.length === 0){
          return [];
        }
        newText = [];
        //` 1 3 @t 12:25 م - 01:40 م @r COC-308COE `
        //` 5 @t 10:00 ص - 11:40 ص @r 203 أ(A) @n  3 @t 12:00 م - 12:50 م @r 203 أ(A)`
        //day = text.substring(text.indexOf("@t")-2, text.indexOf("@t")).trim();
        
        let classRoom;
        if(text.indexOf("@n") === -1){
          dayv2 = text.substring(0, text.indexOf("@t")).trim();
          // console.log(dayv2);
          classRoom = text.slice(text.indexOf("@r") + 2).trim();
          
          if(dayv2.length !== 1){
            
            splitDay = dayv2.split(" ");
            // console.log("splitDays: "+splitDay);
            splitDay.forEach((item)=>{
              newText.push(["@"+item +"@"+ text.slice(text.indexOf("@t")+2, text.indexOf("@r")).trim(),classRoom]);
            });
          }else{
            newText.push(["@"+dayv2 +"@"+ text.slice(text.indexOf("@t")+2, text.indexOf("@r")).trim(),classRoom]);
          }

        }else{
          spliter = text.split("@n").map(item => item.trim());
          // console.log(spliter);
          // console.log("================================================================");
          spliter.forEach((item)=>{
            dayv2 = item.substring(0, text.indexOf("@t")-1).trim();
            classRoom = item.slice(text.indexOf("@r") + 2).trim();
            time = item.slice(item.indexOf("@t")+2, item.indexOf("@r")).trim();
            // console.log("Day: "+dayv2+" | ClassRoom: "+classRoom + " | Time: "+time);
            newText.push(["@"+dayv2 +"@"+ time,classRoom]);
          });
          // console.log("----------------------------------------------------------");
          // console.log("Using second:");
        }

    
        
    return newText;
}

function getPeriod(text){

  newText = [];
  text.forEach((elemnt) => {
    day = elemnt[0].slice(1,2);
    texts = elemnt[0].substring(3).split("- ").map(item => item.trim())
    comb = {
      period:texts,
      day:day,
      room: elemnt[1]
    }
    newText.push(comb);
  });
   
   return newText
}

function getEachCourse (courses){
  // newCourse = [];
  // courses.forEach((course) => {
  //   //console.log(getPeriod(getTime(course)));
  //   newCourse.push();
  // })
  newCourse = getPeriod(getTime(courses))
  //console.log(newCourse);
  
  return newCourse;
}

function CheckIntersect(periods) {

  for (let i = 0; i < periods.length-1; i++) {
    for (let j = i+1; j < periods.length; j++) {
      // if (isIntersecting(periods[i], periods[j])) {
      //   console.log(periods[i].slice(0,2) + "|||||| "+ periods[j].slice(0,2));
      //   console.log("done");
      //   return true;
      // }
      console.log(`i = ${i}: ${periods[i][2]}, j = ${j}: ${periods[j][2]}`);
      if(periods[i][2] === periods[j][2]){
        console.log(periods[i][2],periods[j][2]);
        
        if (isIntersecting(periods[i], periods[j])) {
          console.log(periods[i].slice(0,2) + "|||||| "+ periods[j].slice(0,2));
          console.log("done");
          return true;
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

