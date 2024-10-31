
//TODO: allow to make new modal so you can use more than one modal at time
// `            <div class="sm:flex sm:items-start">
//               <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
//                 <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
//                   <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
//                 </svg>
//               </div>
//               <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
//                 <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Deactivate account</h3>
//                 <div class="mt-2">
//                   <p class="text-sm text-gray-500">Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.</p>
//                 </div>
//               </div>
//             </div>


//             <button type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Deactivate</button>
//             <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
//     `


const modal_correct_icon = `
            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-200 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-green-600"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="oi sl aye">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                </svg>
            </div>
            `;
const modal_info_icon = `
            <div class="mx-auto flex flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
                <?xml version="1.0" encoding="utf-8"?>
                <svg class="h-12 w-12 text-blue-600" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="122.88px" height="122.88px" viewBox="0 0 122.88 122.88" enable-background="new 0 0 122.88 122.88" xml:space="preserve">
                <g><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M61.44,0c33.926,0,61.44,27.514,61.44,61.44c0,33.926-27.514,61.439-61.44,61.439 C27.513,122.88,0,95.366,0,61.44C0,27.514,27.513,0,61.44,0L61.44,0z M79.42,98.215H43.46v-6.053h6.757v-36.96H43.46v-4.816h16.808 c4.245,0,8.422-0.51,12.549-1.551v43.328h6.604V98.215L79.42,98.215z M63.859,21.078c2.785,0,4.975,0.805,6.571,2.396 c1.579,1.59,2.377,3.771,2.377,6.581c0,2.848-1.358,5.381-4.093,7.601c-2.751,2.22-5.941,3.338-9.577,3.338 c-2.733,0-4.905-0.765-6.569-2.297c-1.665-1.551-2.497-3.556-2.497-6.05c0-3.143,1.358-5.853,4.059-8.152 C56.83,22.219,60.072,21.078,63.859,21.078L63.859,21.078z"/></g>
                </svg>
            </div>
            `;
const modal_danger_icon = `
            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            `;

const Custom_Colors = Object.freeze({
    BLUE: "blue",
    GREEN: "green",
    RED: "red",
    YELLOW: "[#FFC700] ",
});

const Custom_btn_ID = Object.freeze({
    CANCEL: "modal-button-cancel",
});
function showModal() {
    if(darkModeON){
        $('#modal_upper').addClass("dark");
        $('#modal_lower').addClass("dark");
        $('#modal-body').addClass("text-white");
        $("#modal-title").addClass("text-white");
        $("#modal-title").next().find('p').addClass("text-white");
    }else{
        $('#modal_upper').removeClass("dark");
        $('#modal_lower').removeClass("dark");
        $('#modal-body').removeClass("text-white");
        $("#modal-title").removeClass("text-white");
        $("#modal-title").next().find('p').removeClass("text-white");
    }

    $("#modal").removeClass('hidden');
    $('body').addClass('overflow-hidden');
}

function infoAlert(title,message,button_text="OK") {

    $("#modal_upper").html(upperText(modal_info_icon,title,message));
    $("#modal_lower").html(lowerText(button_text,"blue"));

    showModal();
}

function correctAlert(title,message,button_text="OK") {

    
    $("#modal_upper").html(upperText(modal_correct_icon,title,message));
    $("#modal_lower").html(lowerText(button_text,"green"));

    showModal();
}

function dangerAlert(title,message,button_text="OK") {

    $("#modal_upper").html(upperText(modal_danger_icon,title,message));
    $("#modal_lower").html(lowerText(button_text,"red"));

    showModal();
}

function CustomAlert(title,body,custom_buttons=[{text:"OK",id:Custom_btn_ID.CANCEL,color:Custom_Colors.BLUE}]) {

    $("#modal-content").removeClass("sm:max-w-lg").addClass("sm:max-w-5xl");
    $("#modal_upper").html(customUpperText(title,body));
    $("#modal_lower").html(customLowerText(custom_buttons));


    showModal();
}

function customUpperText(title,body) {
    return `
        <div class="sm:flex sm:items-center">
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-right">
                <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">${title}</h3>
                <div id="modal-body" class="mt-2">
                    ${body}
                </div>
            </div>
        </div>
    `;
}

function customLowerText(custom_buttons) {
    let body = ""
    custom_buttons.forEach(btn => {
        body += `
            <button id="${btn.id}" type="button" class="mt-3 rounded-md bg-${btn.color}-600 px-8 py-2 font-semibold ${btn.color.includes("[#FFC700]")?"text-gray-700":"text-white"} shadow-sm hover:bg-${btn.color}-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${btn.color}-500 sm:mt-0 sm:w-auto">
                ${btn.text}
            </button>
        `;
    });
    return body;
}


function upperText(icon,title,message) {
    // Check if sm:max-w-lg exists, if not add it
    if (!$("#modal-content").hasClass("sm:max-w-lg")) {
        $("#modal-content").addClass("sm:max-w-lg");
    }
    
    // Remove sm:max-w-5xl if it exists
    $("#modal-content").removeClass("sm:max-w-5xl");
    return `
        <div class="sm:flex sm:items-center">
            ${icon}
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">${title}</h3>
            <div class="mt-2">
                <p class="text-sm text-gray-500">${message}</p>
            </div>
            </div>
        </div>
    `;
}

function lowerText(button_text,button_color,id="modal-button-cancel") {
    return `
        <button id="${id}" type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-${button_color}-600 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-${button_color}-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${button_color}-500 sm:mt-0 sm:w-auto">
            ${button_text}
        </button>
    `;
}


function newModal(title,body,custom_buttons=[{text:"OK",id:Custom_btn_ID.CANCEL,color:Custom_Colors.BLUE}]){
    let modal_template = `
        <div id="temp-modal" class="relative" aria-labelledby="modal-title" role="dialog" aria-modal="true" style="z-index: 40;">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="false"></div>
        
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div id="coverBG-temp" class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

            <div id="modal-content-temp" class="relative ${darkModeON? "dark text-white":""} transform overflow-hidden rounded-lg bg-white text-left shadow-xl  transition-all sm:my-8 sm:w-fit sm:max-w-5xl">
                <div id="modal_upper-temp" class="bg-white ${darkModeON? "dark":""}  px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                </div>
                <div id="modal_lower-temp" class="bg-gray-50 ${darkModeON? "dark":""} px-4 py-3 gap-x-4 sm:flex sm:flex-row-reverse sm:px-6">
                </div>
            </div>

            </div>
        </div>
        </div>
    `
    $(modal_template).insertBefore("#modal");
    custom_buttons = custom_buttons.map(btn => ({...btn, id: btn.id + "-temp"}));
    //CustomAlert(title, body, custom_buttons);
    $("#modal-content-temp").removeClass("sm:max-w-lg").addClass("sm:max-w-5xl");
    $("#modal_upper-temp").html(customUpperText(title,body));
    $('#modal_upper-temp').find('table').each(function() {
        $( this ).find("thead").children().each(function(){
          $( this ).find("th").toggleClass("dark:second");
          $( this ).find("th").toggleClass("text-white");
          $( this ).find("th").toggleClass("dark:border");
          $( this ).find("td").toggleClass("dark:border");
        });
      });
    $("#modal_lower-temp").html(customLowerText(custom_buttons));
}