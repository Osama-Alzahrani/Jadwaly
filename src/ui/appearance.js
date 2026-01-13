
import { Variables } from "../shared/config/config.js";

export function darkMode() {
  $("#coruse-section").children(":first").toggleClass("dark");
  $("#course-search").toggleClass("dark:second");
  $("body").toggleClass("dark");
  $("#timetable").toggleClass("dark");
  $("#timetable").find("thead").toggleClass("dark:second");
  $(".drop-menu").toggleClass("dark:second");
  $("#timetable")
    .find("tbody")
    .children()
    .each(function () {
      const $children = $(this).children();
      $children.each(function (i) {
          
          $(this).toggleClass("text-white");
          if (i === $children.length - 1) {
            $(this).toggleClass("dark:second");
            $(this).toggleClass("border");
          }else{
            $(this).toggleClass("dark:border");
          }
        });

    });

  $("#modal_upper").removeAttr("style");
  $("#side-menu").children().children().toggleClass("dark");
  $("#side-menu").children().children().toggleClass("text-white");
  $("#side-menu").children().children().toggleClass("dark:border");
  $("#side-menu label").toggleClass("text-white");
  $("#theme-select").toggleClass("dark:second");
  $("#language-select").toggleClass("dark:second");
  $("#onlineTitle").toggleClass("text-white");

  if (!Variables.darkModeON) {
    Variables.darkModeON = true;
  } else {
    Variables.darkModeON = false;
  }
}

