function getSectionsTimeUqu(details,codeTimes,days, periods,location,rooms) {
    let spliter = details.split(" # ");


    spliter.forEach((element , index) => {
        let split = element.split(" | ");
        split[0] = split[0].slice(0,-1);
        sectionsTime = split[1].split(",");
        console.log(split);
        StartTime = getTimes(sectionsTime.at(-1));
        EndTime = getTimes(sectionsTime.at(0));
        start = StartTime.codeTime;
        end = (parseInt(EndTime.codeTime,10) + 50)+"";
        periods[index] = [StartTime.start, EndTime.end];
        codeTimes[index] = { start: start, end: end };
        days[index] = getDay(split[0]);

        if (split[2].includes("عن بعد")) {
            location = "عن بعد"
            rooms[index] = "عن بعد";
        }else{
            const locationData = split[2].split("-");
            location = "مبنى " + locationData[0];
            rooms[index] = locationData[1];
        }
    });






    // console.log(codeTimes);
    return location;
}

function getDay(day){
    listOfDays = {
        "السبت": "7",
        "الاحد": "1",
        "الاثنين": "2",
        "الثلاثاء": "3",
        "الاربعاء": "4",
        "الخميس": "5",
        "الجمعة": "6"
    }
    return listOfDays[day];
}

function getTimes(time) {
    listOfPeriods = {
        "1": { start: "08:00", end: "08:50" , codeTime: "480"},
        "2": { start: "09:00", end: "09:50" , codeTime: "540"},
        "3": { start: "10:00", end: "10:50" , codeTime: "600"},
        "4": { start: "11:00", end: "11:50" , codeTime: "660"},
        "5": { start: "01:00", end: "01:50" , codeTime: "780"},
        "6": { start: "02:00", end: "02:50" , codeTime: "840"},
        "7": { start: "04:00", end: "04:50" , codeTime: "960"},
        "8": { start: "05:00", end: "05:50" , codeTime: "1020"},
        "9": { start: "06:00", end: "06:50" , codeTime: "1080"},
        "10": { start: "07:00", end: "07:50" , codeTime: "1140"},
        "11": { start: "08:00", end: "08:50" , codeTime: "1200"},
        "12": { start: "09:00", end: "09:50" , codeTime: "1260"},
    }

    return listOfPeriods[time];
}