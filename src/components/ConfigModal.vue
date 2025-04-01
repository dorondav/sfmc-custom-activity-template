<script setup>
import { computed, reactive, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useJbStateStore } from "@/stores/jbStore";
import { useFormUiStore } from "@/stores/formUiStore";
import { useCustomActivity } from "@/composables/useCustomActivity";
import useVuelidate from "@vuelidate/core";
import { maxLength, minLength, required } from "@vuelidate/validators";
import { uuid } from "vue-uuid";
import { parseConfigModal, dataBindValue } from "@/composables/functions";
import InformationButton from "@/components/InformationButton.vue";
import InformationCard from "@/components/InformationCard.vue";
import { startsWithHttps, isValidImageType, isValidImageSize, validateItemInSchema } from "@/composables/validators";

// Initialize composables and store
const { initPostmonger } = useCustomActivity();
const store = useJbStateStore();
const uiItemsStore = useFormUiStore();
const sendId = computed(() => uuid.v4());
initPostmonger();

const { deepLinks, notificationTypeInput } = storeToRefs(uiItemsStore);

// Reactive form data
const formData = reactive({
  licenseNumber: "",
  notificationTitle: "",
  notificationDesc: "",
  notificationType: "",
  url: "",
  freeTextLink: "",
  image: "",
  note: "",
  appIdentifierDisplay: "",
  orderId: "",
});

// Watchers
const personalization = ref("");
const personalizationSelect = ref(null);
const tableId = ref(null);
const notificationDescTextarea = ref(null);

watch(personalization, (item) => {
  if (!item) return;
  const splitItem = item.split(".");
  const lastValue = splitItem.pop();
  tableId.value = splitItem;
  formData.notificationDesc += ` %%${lastValue}%%`;
  personalization.value = "";
  if (personalizationSelect.value) {
    personalizationSelect.value.selectedIndex = 0;
    notificationDescTextarea.value?.focus();
  }
});

// Validation rules
const rules = computed(() => ({
  licenseNumber: { required },
  notificationTitle: {
    required,
    minLength: minLength(3),
    maxLength: maxLength(50),
  },
  notificationDesc: {
    required,
    minLength: minLength(3),
    maxLength: maxLength(500),
  },
  notificationType: { required },
  url: {
    required,
    validateItemInSchema: validateItemInSchema(store), //is the warranty orderID exists in the source DE,
  },
  freeTextLink: formData.url === "freeTextLink" ? { required, startsWithHttps } : {},
  image: {
    startsWithHttps,
    isValidImageType,
    isValidImageSize: isValidImageSize,
  },
}));

const v$ = useVuelidate(rules, formData);

// Error message handler
const getErrorMessage = (error) => {
  const errorMessage = { maxLength: 50, minLength: 3 };

  switch (error.$validator) {
    case "required":
      return "שדה חובה";
    case "minLength":
      return `מינימום ${errorMessage.minLength} תווים`;
    case "maxLength":
      return `מקסימום ${errorMessage.maxLength} תווים`;
    case "isValidImageType":
      return `יש להכניס לינק לתמונה בפורמטים PNG,JPEG, JPG, BMP, PNG, או WebP`;
    case "isValidImageSize":
      return `יש להכניס לינק לתמונה יש להכניס תמונה בגודל עד 1MB`;
    case "startsWithHttps":
      return `עם הכנס כתובת המתחילה https`;
    case "validateItemInSchema":
      return `בטבלת המקור לא ניתן להציעה הרחבת אחריות ללא הוספת ערך orderID `;
    default:
      return "שגיאה ערך לא תקין.";
  }
};

// Computed properties
const typeTextSelectOptions = computed(() => {
  return store.jbSchema.schema?.filter((item) => item.type.toLowerCase() === "text").map((item) => ({ key: item.key, value: item.name })) || [];
});

const selectOptions = computed(
  () =>
    store.jbSchema.schema?.map((item) => ({
      key: item.key,
      value: item.name,
    })) || []
);

// Form submission handler
const formSaved = () => {
  v$.value.$touch();
  if (v$.value.$invalid) {
    console.warn("[WARN] Form is invalid", v$.value);
    store.isFormValid = false;
    return;
  }

  const updatedFormData = {
    ...formData,
    appIdentifierDisplay: formData.licenseNumber ? formData.licenseNumber : formData.appIdentifierDisplay,
    licenseNumber: formData.licenseNumber ? dataBindValue(formData.licenseNumber) : formData.licenseNumber,
  };

  store.isFormValid = true;
  store.updateConfigModal(updatedFormData);
  store.configModal.sendId = sendId.value;
  store.configModal.pushMessageForDisplay = updatedFormData.notificationDesc;
  store.dataBindingForMessageValues();
  store.storeOrderIdForWarrantyLink();

  console.info(`[INFO] formData submitted ${JSON.stringify(updatedFormData)}`);
};

// Watchers for store changes
watch(
  () => store.submitFormSignal,
  (newVal) => {
    if (newVal) {
      formSaved();
      store.resetFormSubmissionSignal();
    }
  }
);
let isFirstChange = true;
watch(
  () => store.configModal,
  (newVal) => {
    if (!isFirstChange) return;
    const updatedJBFormValues = parseConfigModal(newVal);
    Object.assign(formData, {
      ...updatedJBFormValues,
      notificationDesc: updatedJBFormValues.pushMessageForDisplay,
      licenseNumber: updatedJBFormValues.appIdentifierDisplay,
    });
    isFirstChange = false;
  },
  { deep: true }
);
</script>

<template>
  <header>
    <img src="https://image.info.freesbe.co.il/lib/fe40157075640579751372/m/1/1c0c191d-09e1-4a34-a738-68fc35cecfc7.png" alt="Freesbe Logo" />
  </header>
  <main>
    <section class="card">
      <div class="cardHeader">
        <h1>שליחת הודעת פוש</h1>
      </div>
      <form @submit.prevent="formSaved">
        <div :class="['formItem', { error: v$.licenseNumber.$errors.length }]">
          <InformationCard infoItem="licenseNumber" />
          <div class="field">
            <label for="licenseNumber" class="label">
              <span>מספר רכב*</span>
              <InformationButton infoItem="licenseNumber" />
            </label>
            <select id="licenseNumber" v-model="formData.licenseNumber">
              <option disabled value="">אנא בחר עמודה עם מספר רכב</option>
              <option v-for="option in typeTextSelectOptions" :key="option.key" :value="option.key">
                {{ option.value }}
              </option>
            </select>
          </div>
          <small :class="{ error: v$.licenseNumber.$errors.length }" v-for="error of v$.licenseNumber.$errors" :key="error.$uid">
            {{ getErrorMessage(error) }}
          </small>
        </div>

        <div :class="['formItem', { error: v$.notificationTitle.$errors.length }]">
          <InformationCard infoItem="notificationTitle" />
          <div class="field">
            <label for="notificationTitle" class="label">
              <span>כותרת*</span>
              <InformationButton infoItem="notificationTitle" />
            </label>
            <input type="text" name="notificationTitle" id="notificationTitle" v-model="formData.notificationTitle" />
          </div>
          <small :class="{ error: v$.notificationTitle.$errors.length }" v-for="error of v$.notificationTitle.$errors" :key="error.$uid">
            {{ getErrorMessage(error) }}
          </small>
        </div>

        <div :class="['formItem', { error: v$.notificationType.$errors.length }]">
          <InformationCard infoItem="notificationType" />
          <legend>
            <span>סוג שליחה*</span>
            <InformationButton infoItem="notificationType" />
          </legend>
          <div class="field radioFields">
            <div v-for="type in notificationTypeInput" :key="type.value">
              <label :for="type.type" class="label">{{ type.label }}</label>
              <input type="radio" :id="type.type" :value="type.value" v-model="formData.notificationType" />
            </div>
          </div>
        </div>

        <div :class="['formItem', { error: v$.notificationDesc.$errors.length }]">
          <InformationCard infoItem="notificationDesc" />
          <div class="field">
            <label for="notificationDesc" class="label">
              <span>גוף ההודעה*</span>
              <InformationButton infoItem="notificationDesc" />
            </label>
            <textarea name="notificationDesc" id="notificationDesc" v-model="formData.notificationDesc" ref="notificationDescTextarea"></textarea>
          </div>
          <small :class="{ error: v$.notificationDesc.$errors.length }" v-for="error of v$.notificationDesc.$errors" :key="error.$uid">
            {{ getErrorMessage(error) }}
          </small>
        </div>

        <div class="formItem">
          <InformationCard infoItem="personalization" />
          <div class="field">
            <label for="personalization" class="label">
              <span> שדות פרסונליים</span>
              <InformationButton infoItem="personalization" />
            </label>
            <select id="personalization" v-model.lazy="personalization" ref="personalizationSelect">
              <option disabled value="">בחר ערך פרסונלי</option>
              <option v-for="option in selectOptions" :key="option.key" :value="option.key">
                {{ option.value }}
              </option>
            </select>
          </div>
        </div>

        <div :class="['formItem', { error: v$.url.$errors.length }]">
          <InformationCard infoItem="url" />
          <div class="field">
            <label for="url" class="label">
              <span> הוספת לינק*</span>
              <InformationButton infoItem="url" />
            </label>
            <select id="url" v-model="formData.url">
              <option disabled value="">בחר לינק</option>
              <option value="freeTextLink">שדה חופשי</option>
              <option value="warrantyLink">הרחבת אחריות</option>
              <option disabled value="">----------------</option>
              <option v-for="link in deepLinks" :key="link.link" :value="link.link">
                {{ link.name }}
              </option>
            </select>
          </div>
          <small :class="{ error: v$.url.$errors.length }" v-for="error of v$.url.$errors" :key="error.$uid">
            {{ getErrorMessage(error) }}
          </small>
        </div>

        <div v-if="formData.url === 'freeTextLink'" :class="['formItem freeTextLinkItem', { error: v$.freeTextLink.$errors.length }]">
          <div class="field">
            <InformationCard infoItem="freeTextLink" />
            <label for="freeTextLink" class="label">
              <span> לינק בטקסט חופשי*</span>
              <InformationButton infoItem="freeTextLink" />
            </label>
            <input type="text" id="freeTextLink" v-model="formData.freeTextLink" />
          </div>
          <small :class="{ error: v$.freeTextLink.$errors.length }" v-for="error of v$.freeTextLink.$errors" :key="error.$uid">
            {{ getErrorMessage(error) }}
          </small>
        </div>
        <!--
        <div :class="['formItem', { error: v$.image.$errors.length }]">
          <InformationCard infoItem="image" />
          <div class="field">
            <label for="image" class="label">
              <span> לינק תמונה</span>
              <InformationButton infoItem="image" />
            </label>
            <input type="text" id="image" v-model="formData.image" />
          </div>
          <small :class="{ error: v$.image.$errors.length }" v-for="error of v$.image.$errors" :key="error.$uid">
            {{ getErrorMessage(error) }}
          </small>
        </div>

        <div v-if="formData.image" class="imagePreview">
          <p>תצוגה מקדימה לתמונה</p>
          <img :src="formData.image" alt="הצגה מקדימה לתמונת הפוש" />
        </div> -->
      </form>
    </section>
  </main>
</template>

<style scoped>
header {
  max-width: 50rem;
  margin-inline: auto;
  background-color: #00d6d1;
  padding: 1rem 2rem;
  text-align: center;
  margin-bottom: 2rem;
}
main {
  margin-inline: auto;
  max-width: 50rem;
  border: 1px solid var(--secondary-color);
  border-radius: 0.625rem;
}
.cardHeader {
  background-color: var(--secondary-color);
  padding: 1em;
  border-radius: 0.625rem 0.625rem 0 0;
}
form {
  width: 100%;
  padding: 1em 1.2em;
}
legend,
label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  direction: rtl;
  margin-bottom: 0.2rem;
  font-weight: bold;
  padding: 0 0.5rem;
}

.radioFields label {
  display: inline;
  font-weight: normal;
  margin: 0;
  cursor: pointer;
}

.radioFields label:hover {
  text-decoration: underline;
  text-decoration-color: var(--main-color);
  text-decoration-style: dashed;
}
.radioFields div {
  margin-right: 0.5em;
}
.formItem {
  padding-bottom: 0.5rem;
  position: relative;
}

#url {
  text-align: left;
}
.field input[type="radio"] {
  margin-left: 0.3125rem;
  margin-right: 0.5rem;
}
.field input[type="radio"]:last-of-type {
  margin-right: 0;
}
select,
textarea,
input[type="text"] {
  width: 100%;
  padding: 0.3em 0.5em;
  text-align: right;
}
textarea {
  resize: none;
  direction: rtl;
  unicode-bidi: embed;
  height: 300px;
}
.formItem.error textarea,
.formItem.error select,
.formItem.error input {
  border: 0.125em solid #e74c3c;
  outline: none;
  color: #e74c3c;
}
.formItem.error,
.formItem.error select {
  color: #e74c3c;
}

.buttonGroup {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding: 1rem;
}
.btn {
  padding: 0.5em 1em;
  border-radius: 0.25em;
  cursor: pointer;
  font-size: 1.1em;
}
.messageBox {
  margin-top: 1rem;
}
small {
  color: #e74c3c;
  display: none;
}
small.error {
  display: block;
  direction: rtl;
}
/* .imagePreview {
  margin-top: 1rem;
  max-width: 100%;
}
.imagePreview img {
  max-width: 100%;
  height: auto;
  border-radius: 0.625rem;
  border: 1px solid var(--secondary-color);
  background-color: #f1f1f1;
} */
</style>
