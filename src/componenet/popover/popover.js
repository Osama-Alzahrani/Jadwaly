import { Variables } from "../../shared/config/config.js";

export function showPopover(id, msg) {
  const style = `
  <style>
    #${id}::before {
      content: "${msg}";
      padding: 0.6vw;
      position: absolute;
      top: -150%;
      left: 20%;
      background-color: rgb(0 0 0 / 70%);
      color: white;border-radius: 0.3vw;
      animation: slideIn 0.3s ease-out forwards;
    }
  </style>`;
  $(style).appendTo("head");
  // Hide the tooltip after 2 seconds
  Variables.timeoutsPopover.forEach((elm) => {
    if (elm.id == id) {
      clearTimeout(elm.timeoutID);
      Variables.timeoutsPopover = Variables.timeoutsPopover.filter((item) => item.id !== id);
    }
  });

  Variables.timeoutsPopover.push({
    timeoutID: setTimeout(function () {
      // Add new style for slideOut animation
      $("<style>")
        .prop("type", "text/css")
        .html(
          `
        #${id}::before {
          animation: slideOut 0.5s ease-in forwards;
        }
      `
        )
        .appendTo("head");

      // Remove the style after animation completes
      setTimeout(function () {
        $("style")
          .filter(function () {
            return $(this).text().includes(`#${id}::before`);
          })
          .remove();
      }, 500);
    }, 1000),
    id: id,
  });
}
