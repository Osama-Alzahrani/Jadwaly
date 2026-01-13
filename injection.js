// Create a button element
const button = document.createElement('button');
button.innerText = 'التعديل بإستخدام جدولي';
button.type = 'button';
button.style.padding = '15px';
button.style.backgroundColor = 'rgb(255 199 0)';
button.style.color = '#111';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.cursor = 'pointer';
button.style.marginTop = '20px';
button.style.width = '-webkit-fill-available';

// Append the button to the body

// chrome.tabs.onUpdated.addListener((tabId, tab) =>{
//     if(tab.url && tab.url.includes("stu-gate.qu.edu.sa")){

//     }
// });
if($(".uq-title").text().trim() === "المقررات المطروحة")     // TODO: CHEKCED
{
    const tr = document.createElement('div');  // Create a new <tr> element
    table = $("#j_id_1o\\:table .ui-datatable-header")[0];
    console.log(table);
    button.style.marginTop = '';
    button.style.marginBottom = '10px';
    button.style.width = '';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.gap = '10px';
    
    tr.appendChild(button);  // Append the button to the <tr>
   $(tr).insertAfter(table);
}
if($(".fontTextTitle").text().trim() === "المقررات المطروحة وفق الخطة")     // TODO: CHEKCED
{
    const tr = document.createElement('tr');  // Create a new <tr> element

    table = $("#menuForm\\:menuTable tbody")[0];
    console.log(table);
    tr.appendChild(button);  // Append the button to the <tr>
    table.appendChild(tr);
}

function checkUrlType(url) {
    if (url.includes("uqu.edu.sa")) {
        return "uqu";
    } else if (url.includes("qu.edu.sa")) {
        return "qu";
    } else {
        return "other";
    }
}

// Add click event listener to the button
button.addEventListener('click', () => {

  const url = window.location.href
  const urlType = checkUrlType(url);
  console.log("URL Type:", urlType);
  if (urlType === "uqu"){
    $(button).text("جاري جمع المقررات");
    $(button).append("<div class='loader' dir='ltr'></div>");
    getUquTable();
  } else if (urlType === "qu"){
    getQuTable();
  } else{
    return;
  }
});

function getQuTable() {
  const TableContent = $("#myForm\\:offeredCoursesTable tbody");

  let sections = [];

  let row = TableContent.children("tr");
  row.each(function (index) {
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

  // Send the content to the background script
  chrome.runtime.sendMessage({ action: 'getContent', content: [sections, "qu"] });
}

function getUquTable() {

  const collected = [];
  (async () => {
    const tableId = "j_id_1o:table";
    const tbodySel = `#${tableId.replace(/:/g, "\\:")}_data`;
    const nextBtn  = document.querySelector(`#${tableId.replace(/:/g, "\\:")}_paginator_bottom .ui-paginator-next`);
    if (!nextBtn) { console.warn("Paginator next button not found"); return; }

    
    const parsePage = () => {
      const trs = document.querySelectorAll(`${tbodySel} tr[data-ri]`);
      trs.forEach(tr => {
        const cell = tr.querySelector("td:nth-child(4)");
        if (!cell) { 
          console.warn("Cell not found"); 
        }

                
        // collect all day/room blocks
        const blocks = Array.from(cell.querySelectorAll(".uq-justify-between"));

        const entries = blocks.map((blk) => {
          const day  = blk.querySelector(".uq-w-11")?.textContent?.trim() ?? "";
          const num  = blk.querySelector(".uq-w-fit")?.textContent?.trim() ?? "";
          const room = blk.querySelector(".uq-badge-divide-num .uq-text-nowrap")?.textContent?.trim() ?? "";

          // (optional) urls if you need them
          const roomUrl = blk.querySelector('.uq-badge-divide-num a[href*="BuildingsRoom"]')?.href ?? "";
          const mapUrl  = blk.querySelector('.uq-badge-divide-num a[href*="maps.app.goo.gl"]')?.href ?? "";

          return { day, num, room, roomUrl, mapUrl };
        });

        const detailsAll = entries.map(e => `${e.day} | ${e.num} | ${e.room}`).join(" # ");

        
        collected.push({
          courseName: tr.querySelector("td:nth-child(1) .uq-font-semibold")?.textContent?.trim() || "",
          courseCode:  tr.querySelector("td:nth-child(1) .uq-text-xs")?.textContent?.trim() || "",
          location: "null",
          id: tr.querySelector("td:nth-child(1) .uq-badge-num")?.textContent?.trim() || "",
          type: tr.querySelector("td:nth-child(1) .uq-badge")?.textContent?.trim() || "",
          courseCredit: tr.querySelector("td:nth-child(2)")?.textContent?.trim() || "",
          status: tr.querySelector('td:nth-child(3) [aria-haspopup="true"]')?.textContent?.trim() || "",
          instructor: tr.querySelector("td:nth-child(5)")?.textContent?.trim() || "",
          details: detailsAll,
          examDay: "null",
        });

      });
    };

    // Get first page
    parsePage();

    // Observe tbody for Ajax updates (PrimeFaces replaces tbody on page change)
    const tbody = document.querySelector(tbodySel);
    const mo = new MutationObserver(() => {
      // new page is rendered -> parse and continue or stop
      parsePage();
      if (nextBtn.classList.contains("ui-state-disabled")) {
        mo.disconnect();
        console.log("Collected rows:", collected.length, collected);
        chrome.runtime.sendMessage({ action: 'getContent', content: [collected, "uqu"] });
        $(button).find(".loader").remove();
        $(button).text("تم جمع المقررات");

      } else {
        nextBtn.click();
      }
    });
    mo.observe(tbody, { childList: true, subtree: false });

    // Kick off pagination
    if (!nextBtn.classList.contains("ui-state-disabled")){ 
      nextBtn.click(); 
    }
  })();


  // let sections = [];

  // let row = TableContent.children("tr");
  // row.each(function (index) {
  //   sections.push({
  //     courseCode: $(this).children().eq(0).text(),
  //     courseName: $(this).children().eq(1).text(),
  //     location: $(this).children().eq(2).text(),
  //     id: $(this).children().eq(3).text(),
  //     type: $(this).children().eq(4).text(),
  //     courseCredit: $(this).children().eq(5).text(),
  //     status: $(this).children().eq(6).text(),
  //     // instructor: $(this).find("td:last-child a > input")[0].value,
  //     // details: $(this).find("td:last-child a > input")[1].value,
  //     // examDay: $(this).find("td:last-child a > input")[2].value,
  //   })
  // });

  // console.log(sections);
  
  //Send the content to the background script
  // chrome.runtime.sendMessage({ action: 'getContent', content: sections });
}


