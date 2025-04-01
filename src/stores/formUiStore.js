import { defineStore } from "pinia";

export const useFormUiStore = defineStore("uiState", {
  state: () => {
    return {
      openCard: null,
      informationTexts: [
        {
          id: "licenseNumber",
          title: "רישיון רכב",
          content:
            "אנא בחר מטבלת השליחה את השם השדה המכיל את מספר הרכב שלבעליו תשלח ההודעה",
        },
        {
          id: "notificationTitle",
          title: "כותרת ההודעה",
          content: "הכנס כותרת להודעה שתוצג בהתראה. ניתן להכניס עד 50 תווים",
        },
        {
          id: "notificationType",
          title: "סוג שליחה",
          content: "בחר את סוג ההודעה שתשלח ללקוח על פי הסיווג באפליקציה",
        },
        {
          id: "notificationDesc",
          title: "גוף ההודעה",
          content:
            "הכנס את גוף ההודעה שתוצג בהתראה. ניתן להוסיף משתנים פרסונליים מהטבלה",
        },
        {
          id: "personalization",
          title: "משתנים פרסונליים",
          content:
            "ערכים פרסונליים שיופיעו בגוף הטבלה. הערכים נמשכים מטבלת השליחה",
        },
        {
          id: "url",
          title: "לינק בטקסט חופשי",
          content:
            "בחירת לינק שיפתח בעת לחיצה על ההתראה. ניתן לבחור מהרשימה או להכניס לינק ישיר",
        },
        {
          id: "freeTextLink",
          title: "לינק בטקסט חופשי",
          content: "לינק בטקסט חופשי יש להתחיל את הכתובת ב-https",
        },
        {
          id: "image",
          title: "לינק תמונה",
          content:
            "<p>הכנס לינק לתמונה שתופיע בהודעה לפי התנאים הבאים:</p><ul><li>על הלינק להתחיל ב https</li><li>להיות בפורמט JPG, JPEG, PNG, GIF בלבד</li><li>להיות בגודל של עד 1MB</li><li>רזולוציה מומלצת היא 2/1</li>   </ul>",
        },
      ],

      notificationTypeInput: [
        { type: "marketing", value: "111", label: "מבצעים והמלצות" },
        { type: "promotion", value: "112", label: "המלצות לטיפולים" },
        { type: "operational", value: "114", label: "תזכורת לטיפולים שנקבעו" },
        { type: "insurance", value: "113", label: "ביטוח" },
      ],
      deepLinks: [
        { name: "עמוד בית", link: "freesbe://" },
        { name: "עמוד פעולות", link: "freesbe://actions" },
        { name: "עמוד התראות", link: "freesbe://alerts" },
        { name: "איפה חניתי", link: "freesbe://real-time-location" },
        { name: "עמוד הזמנת טיפול", link: "freesbe://treatment" },
        { name: "עמוד רכב", link: "freesbe://my-cars" },
        { name: "עמוד עמדות תדלוק", link: "freesbe://gas-stations" },
        { name: "עמוד עמדות טעינה", link: "freesbe://charging-stations" },
        { name: "עמוד נגישות", link: "freesbe://accessibility" },
        { name: "עמוד תנאי שימוש", link: "freesbe://terms-of-use" },
        { name: "עמוד פרטיות", link: "freesbe://privacy-policy" },
        { name: "עמוד בגדרות התראות", link: "freesbe://notifications" },
        { name: "עמוד מרכזי שירות", link: "freesbe://service-centers" },
      ],
      brand: [
        {
          mid: 100014072,
          name: "freesbe",
          url: "https://image.info.freesbe.co.il/lib/fe40157075640579751372/m/1/1c0c191d-09e1-4a34-a738-68fc35cecfc7.png",
          color: "#00D6D1",
        },
        {
          mid: 100014072,
          name: "dacia",
          url: "https://image.info.freesbe.co.il/lib/fe40157075640579751372/m/1/1c0c191d-09e1-4a34-a738-68fc35cecfc7.png",
          color: "#00D6D1",
        },
      ],
    };
  },
  actions: {
    updateState(object) {
      this[object.key] = object.value;
    },

    toggleCard(infoItem) {
      this.openCard = this.openCard === infoItem ? null : infoItem;
    },
    closeCard() {
      this.openCard = null;
    },
  },
});

export default useFormUiStore;
