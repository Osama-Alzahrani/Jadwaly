import { Variables } from "../shared/config/config.js";

export const DEFAULT_ROW_HEIGHT = 64;

export function getRowHeight() {
  const stored = Number(Variables.AppearanceSettings.rowHeight);
  return Number.isFinite(stored) && stored > 0 ? stored : DEFAULT_ROW_HEIGHT;
}
export function applyRowHeight() {
  $("#timetable")
    .find("tbody")
    .children("tr")
    .not(".days")
    .css("height", getRowHeight() + "px");
}

export function buildTimetable() {
  let table = $("#timetable").find("table");
  let tbody = table.find("tbody");
  console.log("Build Timetable");

  for (let i = 8; i <= Variables.maxTimeCode / 60; i++) {
    let row = `
      <tr style="height: ${getRowHeight()}px;">
        <td class="border px-8 whitespace-nowrap py-4"></td>
        <td class="border px-8 whitespace-nowrap py-4"></td>
        <td class="border px-8 whitespace-nowrap py-4"></td>
        <td class="border px-8 whitespace-nowrap py-4"></td>
        <td class="border px-8 whitespace-nowrap py-4"></td>
        <td class="border px-8 whitespace-nowrap py-4">${
          i < 12 ? `${i}:00 ص` : i == 12 ? `${i}:00 م` : `${i - 12}:00 م`
        }</td>
      </tr>
    `;

    tbody.append(row);
  }
}
