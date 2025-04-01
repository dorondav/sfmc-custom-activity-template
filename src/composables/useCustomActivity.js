import Postmonger from "postmonger";
import querystring from "query-string";
import { useJbStateStore } from "@/stores/jbStore";
import { ref, onMounted, onBeforeUnmount } from "vue";

const VITE_APP_URL = import.meta.env.VITE_APP_URL.replace(/\/+$/, "");

export const useCustomActivity = () => {
  const postmonger = new Postmonger.Session();
  const store = useJbStateStore();

  const configModal = ref(null);
  const jbActivity = ref(null);
  const jbEndpoints = ref(null);
  const jbTokens = ref(null);
  const jbCulture = ref(null);
  const jbInteractionDefaults = ref(null);
  const jbInteraction = ref(null);
  const jbTriggerEventDefinition = ref(null);
  const jbSchema = ref(null);

  const initPostmonger = () => {
    console.info(`[INFO][customActivity.js is running]`);
  };

  const initActivity = (payload) => {
    console.info(`[INFO][customActivity.js] initActivity: ${JSON.stringify(payload)}`);

    if (payload.errors !== null) {
      console.log("[ERROR]activity.errors: ", JSON.stringify(payload.errors));
    } else {
      //   console.log(payload);
    }

    jbActivity.value = payload;
    store.jbActivity = payload;

    postmonger.trigger("requestTokens");
    postmonger.trigger("requestSchema");

    if (payload.arguments.execute.inArguments) {
      // store.configModal = payload.arguments.execute.inArguments;

      // store.updateState({
      //   key: "configModal",
      //   value: payload.arguments.execute.inArguments,
      // });
      store.updateConfigModal(payload.arguments.execute.inArguments);
    }
    if (payload.metaData.isConfigured) {
      // configModal.value = payload.metaData.configModal;
      // store.configModal = configModal.value;
      // store.updateState({
      //   key: "configModal",
      //   value: payload.metaData.configModal,
      // });

      store.updateConfigModal(payload.metaData.configModal);
    }
  };

  const requestedSchema = (payload) => {
    console.debug(`[customActivity.js] requestedSchema: ${JSON.stringify(payload)}`);

    store.updateState({ key: "jbSchema", value: payload });
  };

  const requestedTriggerEventDefinition = (payload) => {
    console.debug(`[customActivity.js] requestedTriggerEventDefinition: ${JSON.stringify(payload)}`);
    jbTriggerEventDefinition.value = payload;
    // store.configModal = payload;

    store.updateConfigModal(payload);
  };

  const requestedEndpoints = (payload) => {
    console.info(`[customActivity.js] requestedEndpoints: ${JSON.stringify(payload)}`);
    // jbEndpoints.value = payload;
    // store.jbEndpoints = jbEndpoints.value;
    store.updateState({ key: "jbEndpoints", value: payload });
  };

  const requestedTokens = (payload) => {
    console.info(`[customActivity.js] requestedTokens: ${JSON.stringify(payload)}`);
    jbTokens.value = payload;
    // store.jbTokens = jbTokens.value;
    store.updateState({ key: "jbTokens", value: payload });
  };

  const clickedNext = async () => {
    const tokenParams = querystring.stringify({
      stackKey: jbTokens.value.stackKey,
      eid: jbTokens.value.EID,
      mid: jbTokens.value.MID,
      uid: jbTokens.value.UID,
    });

    console.info(`[customActivity.js] tokenParams: ${tokenParams}`);
    await store.triggerFormSubmission();
    const state = store.$state;

    if (!state.isFormValid) {
      postmonger.trigger("ready");
      console.error(`Error: updateActivity: Invalid form`);
    } else {
      const updateActivityObject = {
        ...state.jbActivity,
        metaData: {
          ...state.jbActivity.metaData,
          configModal: JSON.stringify(state.configModal),
          isConfigured: true,
        },
        arguments: {
          ...state.jbActivity.arguments,
          execute: {
            ...state.jbActivity.arguments.execute,
            url: `${VITE_APP_URL}/execute?${tokenParams}`,
            inArguments: [
              {
                ...state.configModal,
                contactKey: "{{Contact.Key}}",
              },
            ],
          },
        },
        configurationArguments: {
          ...state.jbActivity.configurationArguments,
          validate: {
            url: `${VITE_APP_URL}/validate?${tokenParams}`,
          },
          publish: {
            url: `${VITE_APP_URL}/publish?${tokenParams}`,
          },
        },
      };

      postmonger.trigger("updateActivity", updateActivityObject);
      console.log("updateActivityObject", JSON.stringify(updateActivityObject));
    }
  };

  onMounted(() => {
    postmonger.on("initActivity", initActivity);
    postmonger.on("requestedEndpoints", requestedEndpoints);
    postmonger.on("requestedTokens", requestedTokens);
    postmonger.on("requestedSchema", requestedSchema);
    postmonger.on("requestedTriggerEventDefinition", requestedTriggerEventDefinition);
    postmonger.trigger("ready");
  });

  postmonger.on("clickedNext", clickedNext);

  onBeforeUnmount(() => {
    postmonger.off("initActivity", initActivity);
    postmonger.off("requestedEndpoints", requestedEndpoints);
    postmonger.off("requestedTokens", requestedTokens);
    postmonger.off("requestedSchema", requestedSchema);
    postmonger.off("requestedTriggerEventDefinition", requestedTriggerEventDefinition);
  });

  return {
    configModal,
    jbActivity,
    jbEndpoints,
    jbTokens,
    jbCulture,
    jbInteractionDefaults,
    jbInteraction,
    jbTriggerEventDefinition,
    jbSchema,
    clickedNext,
    initPostmonger,
  };
};
