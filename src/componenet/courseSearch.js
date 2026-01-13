
export function filterCourses(searchTerm) {
  $("#available-courses").empty();
  Variables.courses.forEach((course, index) => {
    if (
      course["courseName"].toLowerCase().includes(searchTerm.toLowerCase()) ||
      course["courseCode"].toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      const list = `
        <div class="pt-2 mt-2 px-4 py-2 available-course rounded select-none" index="${index}">
            <p>${course["courseName"]}</p>
            <p>${course["courseCode"]}</p>
        </div>
      `;
      console.log(index);
      
      if(Variables.selectedCourses.includes(index.toString())){
        console.log("GOOD JOB");
        
      }else{
        $("#available-courses").append(list);
      }
      
    }
  });
}
