// Create a button element
const button = document.createElement('button');
button.innerText = 'Get Page Content';
button.style.position = 'fixed';
button.style.top = '10px';
button.style.right = '10px';
button.style.zIndex = '1000';
button.style.padding = '10px';
button.style.backgroundColor = '#008CBA';
button.style.color = '#fff';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.cursor = 'pointer';

// Append the button to the body

// chrome.tabs.onUpdated.addListener((tabId, tab) =>{
//     if(tab.url && tab.url.includes("stu-gate.qu.edu.sa")){

//     }
// });
if($(".fontTextTitle").text().trim() === "المقررات المطروحة وفق الخطة")     // TODO: CHEKCED
{
    document.body.appendChild(button);
}


// Add click event listener to the button
button.addEventListener('click', () => {
  const TableContent = $("#myForm\\:offeredCoursesTable tbody");

  let sections = [];

  let row = TableContent.children("tr");
  row.each(function (index) {
    // console.log($(this).children().eq(0).text());
    // console.log($(this).children().eq(1).text());
    // console.log($(this).children().eq(2).text());
    // console.log($(this).children().eq(3).text());
    // console.log($(this).children().eq(4).text());
    // console.log($(this).children().eq(5).text());
    // console.log($(this).children().eq(6).text());
    // console.log($(this).find("td:last-child a > input")[0].value);
    // console.log($(this).find("td:last-child a > input")[1].value);
    // console.log($(this).find("td:last-child a > input")[2].value);

    // console.log(index);

    sections.push({
      courseCode: $(this).children().eq(0).text(),
      courseName: $(this).children().eq(1).text(),
      location: $(this).children().eq(2).text(),
      id: $(this).children().eq(3).text(),
      type: $(this).children().eq(4).text(),
      courseCredit: $(this).children().eq(5).text(),
      status: $(this).children().eq(6).text(),
      instructor: $(this).find("td:last-child a > input")[0].value,
      details: $(this).find("td:last-child a > input")[1].value,
      examDay: $(this).find("td:last-child a > input")[2].value,
    })
    
  });
  
  // let details = row.find("td:last-child a > input");
  // console.log(details);
  
  

  // Send the content to the background script
  chrome.runtime.sendMessage({ action: 'getContent', content: sections });
});