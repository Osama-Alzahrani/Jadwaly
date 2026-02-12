
export function toggleSideMenu() {
  if ($("#side-menu").hasClass("slideLeft")) {
    $("#side-menu").removeClass("slideLeft");
    $("#side-menu").addClass("slideRight");
  } else {
    $("#side-menu").removeClass("hidden");
    $("#side-menu").removeClass("slideRight");
    $("#side-menu").addClass("slideLeft");
  }
  if ($("#side-menu").hasClass("slideRight")) {
    // $(".timetable-section").removeClass("sideOpened");
    // $(".timetable-section").addClass("sideClosed");
    $(".course-title").addClass("sm:px-8");
    // $("[id=sec-time]").removeClass("text-xs");
  } else {
    // $(".timetable-section").removeClass("sideClosed");
    // $(".timetable-section").addClass("sideOpened");
    $(".course-title").removeClass("sm:px-8");
    // $("[id=sec-time]").addClass("text-xs");
  }
}
