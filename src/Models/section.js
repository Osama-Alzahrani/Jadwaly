export default class Section {
  //TODO: Done! You must check for null or undefined !!!!!!!!
  constructor(
    id,
    location,
    type,
    room = "null",
    time = "null",
    codeTime = "null",
    dayOfWeek = "null",
    instructor = "null",
    examDay = "null",
    status
  ) {
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
}