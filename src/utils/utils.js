import { Variables } from "../shared/config/config.js";

export const colors = [
  "34, 98, 62", // Dark Sea Green
  "36, 104, 102", // Dark Turquoise
  "50, 74, 118", // Dark Cornflower Blue
  "53, 45, 103", // Dark Slate Blue
  "61, 52, 119", // Dark Medium Slate Blue
  "16, 89, 85", // Dark Light Sea Green
  "0, 64, 64", // Dark Teal
  "51, 102, 85", // Dark Aquamarine
  "32, 112, 104", // Dark Turquoise
  "67, 103, 118", // Dark Sky Blue
  "47, 79, 80", // Dark Cadet Blue
  "73, 56, 109", // Dark Medium Purple
  "35, 65, 90", // Dark Steel Blue
  "88, 112, 115", // Dark Powder Blue
  "25, 102, 25", // Dark Lime Green
  "128, 128, 128", // Gray
  "84, 84, 84", // Darker Gray
  "105, 105, 105", // Dim Gray
  "0, 95, 127", // Dark Deep Sky Blue
  "69, 21, 113", // Dark Blue Violet
];


function convertToMinutes(time) {
  const [hours, minutesPart] = time.split(":");
  const minutes = parseInt(minutesPart.slice(0, 2), 10);
  const isPM = minutesPart.includes("م"); // Check if the time is in PM ("م")
  let hoursIn24Format = parseInt(hours, 10);

  if (isPM && hoursIn24Format !== 12) {
    hoursIn24Format += 12;
  } else if (!isPM && hoursIn24Format === 12) {
    hoursIn24Format = 0;
  }

  return hoursIn24Format * 60 + minutes;
}

export function TimeToMinutes(sections) {
  sections.forEach((section) => {
    start = convertToMinutes(section["period"][0]);
    end = convertToMinutes(section["period"][1]);
    section["codeTime"] = { start: start, end: end };
  });
}

export function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      //console.log('Text copied to clipboard',text);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
}

export function isOverflowed($element) {
  return (
    $element[0].scrollHeight > $element[0].clientHeight ||
    $element[0].scrollWidth > $element[0].clientWidth
  );
}

export function captureModalContent(file_Name) {
  html2canvas(document.querySelector("#modal_upper"), {
    scale: 2, // Increase resolution (try 2 or 3 for crisper images)
    useCORS: true, // important if there are external images/fonts
  }).then((canvas) => {
    // Convert the canvas to a high-quality data URL
    const dataURL = canvas.toDataURL("image/png", 1.0);

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = file_Name + ".png"; // PNG keeps text sharp
    link.id = "image-link";

    // Append the link to the body, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

}
export function validateAndApplyFontSize(min,max,variable,elementId,chengedIds=[],{correctMessage, errorMessage}={correctMessage: "تم تغيير حجم الخط",errorMessage: "قيمة غير صحيحة"}) {
  
  if($(elementId).val() < min || $(elementId).val() > max){
    message.error(errorMessage);
    $(elementId).val(Variables.AppearanceSettings[variable]);
    return;
  }else{

    let fontSize = $(elementId).val();
    chengedIds.forEach((id)=>{
      $(`#${id}`)[0].style.setProperty("font-size", fontSize + "px","important");
    });
    // $("#sections-details")[0].style.setProperty("font-size", fontSize + "px","important");
    // chrome.storage.local.set({ fontSize: fontSize });
    message.success(correctMessage);
    Variables.AppearanceSettings[variable] = fontSize;
  }
  console.log(Variables.AppearanceSettings);
  
}