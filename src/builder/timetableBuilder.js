import { Variables } from "../shared/config/config.js";

export function buildTimetable() {
  let table = $("#timetable").find("table");
  let tbody = table.find("tbody");
  console.log("Build Timetable");

  for (let i = 8; i <= Variables.maxTimeCode / 60; i++) {
    let row = `
      <tr class="h-16">
        <td class="border px-8 whitespace-nowrap py-4"></td>
        <td class="border px-8 whitespace-nowrap py-4"></td>
        <td class="border px-8 whitespace-nowrap py-4"></td>
        <td class="border px-8 whitespace-nowrap py-4"></td>
        <td class="border px-8 whitespace-nowrap py-4"></td>
        <td class="border px-8 whitespace-nowrap py-4 bg-neutral-50 ${
          Variables.darkModeON ? "dark:second" : ""
        }">${
          i < 12 ? `${i}:00 ص` : i == 12 ? `${i}:00 م` : `${i - 12}:00 م`
        }</td>
      </tr>
    `;

    tbody.append(row);
  }
}
