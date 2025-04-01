import { defineStore } from "pinia";
import { isProxy, toRaw } from "vue";
import { dataBindValue } from "@/composables/functions";

export const useJbStateStore = defineStore("state", {
  state: () => {
    return {
      configModal: {
        licenseNumber: "",
        notificationType: "",
        notificationTitle: "",
        notificationDesc: "",
        url: "",
        freeTextLink: "",
        pushMessageForDisplay: "",
        image: "",
        appIdentifier: "",
        appIdentifierDisplay: "", // remove this value from store on reload
        note: "",
        sendId: "",
        orderId: "",
      },
      jbActivity: {},
      jbEndpoints: {},
      jbTokens: {},
      jbCulture: {},
      jbInteractionDefaults: {},
      jbInteraction: {},
      jbTriggerEventDefinition: {},
      jbSchema: {},
      isFormValid: false,
      submitFormSignal: false,
    };
  },
  actions: {
    updateConfigModal(object) {
      this.configModal = object;
    },
    updateState(object) {
      this[object.key] = object.value;
    },
    triggerFormSubmission() {
      this.submitFormSignal = true;
    },
    resetFormSubmissionSignal() {
      this.submitFormSignal = false;
    },
    getSchemaItemByName(value) {
      const schema = this.jbSchema.schema;
      return schema ? schema.find((item) => item.name === value) : false;
    },
    storeOrderIdForWarrantyLink() {
      this.configModal.orderId = "";
      if (this.configModal.url === "warrantyLink") {
        const orderIdProxy = this.getSchemaItemByName("orderID");
        let orderIdObj = orderIdProxy;
        if (orderIdProxy && isProxy(orderIdProxy)) {
          orderIdObj = toRaw(orderIdProxy);
        }
        this.configModal.orderId = dataBindValue(orderIdObj.key);
      }
    },
    dataBindingForMessageValues() {
      const tableIdArr = this.configModal.licenseNumber.split(".");
      const tableId = tableIdArr[0].replace("{{", "") + "." + tableIdArr[1];

      const regex = /%%(.*?)%%/g;
      const matches = this.configModal.notificationDesc.match(regex);
      const extractedValues = matches
        ? matches.map((match) => match.slice(2, -2))
        : [];
      extractedValues.forEach((value) => {
        const regex = new RegExp(`%%${value}%%`, "g");
        this.configModal.notificationDesc =
          this.configModal.notificationDesc.replace(
            regex,
            `{{${tableId}."${value}"}}`
          );
      });
    },
  },
});

export default useJbStateStore;
