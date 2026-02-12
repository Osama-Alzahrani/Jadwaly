import { Variables } from '../shared/config/config.js';
import {captureTimetable} from "../logic/timetableManagement.js";
import { hideModal } from '../../assets/js/modal.js';
import { toggleSideMenu } from '../componenet/sidebar.js';
// import { showSections } from '../componenet/sectionsTable.js';
import { showExams } from '../componenet/examTable.js';
import { showSections } from '../componenet/sectionsTable.js';


export default function showTour() {
    const showSectionsTour = [{ element: '#show-sections', popover: { title: 'زر عرض الشعب المختارة', description: 'يمكنك عرض بعض تفاصيل الشعب', side: "left", align: 'start',onNextClick: () => {

            showSections();
            driverObj.moveNext();
          },onPrevClick: () => {
            captureTimetable();
            driverObj.movePrevious();
          }} }];

    const exams = [{ element: '#show-exams', popover: { title: 'زر عرض الاختبارات', description: 'عرض  الاختبارات للشعب المختارة', side: "left", align: 'start',onNextClick: () => {

            showExams();
            driverObj.moveNext();
          },onPrevClick: () => {
            captureTimetable();
            driverObj.movePrevious();
          }} },
    { element: '#modal-content', popover: { title: 'قائمة الاختبارات', description: 'هنا يمكنك نسخ الاختبارات للشعب المختارة بشكل نصي أيضا يمكنك حفظ جدول الاختبارت كصورة', side: "left", align: 'start',
          onNextClick: () => {
            hideModal();
            driverObj.moveNext();
          },onPrevClick: () => {
            hideModal();
            driverObj.movePrevious();
          }
        } 
      },
      ...showSectionsTour
    ]
    
  const Tour = [
      { element: '#coruse-section', popover: { title: 'قائمة المقررات المطروحة', description: 'هنا يمكنك اختيار اي مقرر تود اضافتة في جدولك الدراسي', side: "bottom", align: 'center' } },
      { element: '#available-courses-tour', popover: { title: 'قائمة المقررات المختارة', description: 'هنا يمكنك رؤية المقررات المختارة ويمكنك اختيار الشعب التي ترغب بها', side: "left", align: 'start' } },
      { element: '#right-section-top', popover: { title: 'القائمة العلوية', description: 'هنا يمكنك رؤية عدد الساعات المختارة أيضا يمكنك اختيار أيام الراحة و اختيار المقر أيضا يمكنك حفظ الجدول وعرض الشعب وغيرها', side: "left", align: 'start' } },
      { element: '#save-timetable', popover: { title: 'زر حفظ الجدول', description: 'بعد الانتهاء من الجدول يمكنك حفظة كصورة', side: "left", align: 'start',onNextClick: () => {

            captureTimetable();
            driverObj.moveNext();
          } } },
      { element: '#modal-content', popover: { title: 'قائمة حفظ الجدول', description: 'هنا يمكنك رؤية صورة توضيحة لشكل الجدول الذي سوف يتم حفظة عند الضغط على حفظ في الاسفل', side: "left", align: 'start',onNextClick: () => {

            hideModal();
            driverObj.moveNext();
          },onPrevClick: () => {
            hideModal();
            driverObj.movePrevious();
          }} },
        ...Variables.universityName !== "uqu" ? exams : showSectionsTour,
      
      { element: '#modal-content', popover: { title: 'قائمة الشعب المختارة', description: 'هنا يمكنك نسخ الشعب المختارة بشكل نصي وعرض بعض تفاصيل الشعب المختارة أيضا يمكنك حفظ الشعب كصورة', side: "left", align: 'start',
          onNextClick: () => {
            hideModal();
            driverObj.moveNext();
          },onPrevClick: () => {
            hideModal();
            driverObj.movePrevious();
          }
        } 
      },
      {
        element: '#timetable', popover: {
          title: 'الجدول', description: 'هنا تظهر لك الشعب عند اختيارها', side: "bottom", align: 'start',
          onNextClick: () => {
            toggleSideMenu();
            driverObj.moveNext();
          }
          ,onPrevClick: () => {
            showSections();
            driverObj.movePrevious();
          }
        }
      },
      {
        element: '#side-menu', popover: {
          title: 'القائمة الجانبية', description: 'يمكنك تعديل بعض الاعدادت الخاصة بالأداة ... لاتنسى الضغط على حفظ بعد الانتهاء 😊', side: "bottom", align: 'start', onPrevClick: () => {

            toggleSideMenu();
            driverObj.movePrevious();
          }
        }
      },
      {
        element: '#side-menu-btn', popover: { title: 'زر اظهار القائمة الجانبية', description: 'من هنا يمكن اظهار واخفاء القائمة الجانبية', side: "bottom", align: 'start', onNextClick: () => {
          // .. remove element
          toggleSideMenu();
          driverObj.moveNext();
            const lastDriverObj = Variables.driver({
                nextBtnText: 'التالي',
                prevBtnText: 'السابق',
                doneBtnText: 'إنتهاء',
                progressText: '<bdi style="font-size:14px;">{{current}} من  {{total}}</bdi>',
                showProgress: true,
                steps: Tour,
            });
  
          lastDriverObj.highlight({
            popover: {
              title: 'شكرًا لك',
              description: 'شكرًا لك لاستخدامك هذه الأداة 😊. يمكنك المساهمة في تطويرها عبر صفحة المشروع على Github، فهي أداة مفتوحة المصدر. الدعم منكم وإليكم 🤍.',
            }
          });
        } }
      },
    ];

    
  const driverObj = Variables.driver({
    onPopoverRender: (popover, { config, state }) => {
        const firstButton = document.createElement("button");
        firstButton.innerText = "الى الاخير";
        popover.footerButtons.appendChild(firstButton);

        firstButton.addEventListener("click", () => {
        driverObj.drive(Tour.length - 1);
        });
    },
    allowClose: false,
    nextBtnText: 'التالي',
    prevBtnText: 'السابق',
    doneBtnText: 'إنتهاء',
    progressText: '<bdi style="font-size:14px;">{{current}} من  {{total}}</bdi>',
    showProgress: true,
    steps: Tour,
  });
  
  setTimeout(() => {
    driverObj.drive();
  }, 350);
}
