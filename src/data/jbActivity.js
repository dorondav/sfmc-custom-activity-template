const jbActivity = {
  name: "",
  id: "b2a7f81d-6e35-4f9c-bd40-8c13a25f6d7b",
  key: "REST-1",
  type: "REST",
  arguments: {
    execute: {
      timeout: 10000,
      retryCount: 1,
      retryDelay: 1000,
      concurrentRequests: 5,
      url: "https://79b0-46-117-205-77.ngrok-free.app/execute",
      inArguments: [],
    },
    startActivityKey: "{{Context.StartActivityKey}}",
    definitionInstanceId: "{{Context.DefinitionInstanceId}}",
    requestObjectId: "{{Context.RequestObjectId}}",
  },
  configurationArguments: {
    save: "",
    testSave: "",
    publish: {
      url: "https://79b0-46-117-205-77.ngrok-free.app/publish?stackKey=s10&eid=500000000&mid=500000000&uid=951827403",
    },
    testPublish: "",
    unpublish: "",
    stop: "",
    testStop: "",
    testUnpublish: "",
    partnerActivityId: "",
    validate: {
      url: "https://79b0-46-117-205-77.ngrok-free.app/validate?stackKey=s10&eid=500000000&mid=500000000&uid=951827403",
    },
    testValidate: "",
    outArgumentSchema: "",
    executeSchema: "",
  },
  metaData: {
    category: "custom",
    icon: "images/fallback-icon-custom-activity.png",
    original_icon: "jb://images/fallback-icon-custom-activity.png",
    iconSmall: "",
    statsContactIcon: "",
    configModal: {
      sample_input: "Sample input",
      dynamic_select: '{{Event.DEAudience-ee51a166-8c63-2436-fcf8-91c30358bee1."Field Name"}}',
      optional_text: "Optional input",
    },
    isConfigured: true,
  },
  schema: {
    arguments: {
      execute: {
        inArguments: [],
        outArguments: [],
      },
    },
  },
  editable: true,
  outcomes: [
    {
      key: "b313ca1a-91c0-43a1-b46f-6ae9e6ba9aab",
      next: "WAITBYDURATION-1",
      arguments: {},
      metaData: {
        invalid: false,
      },
    },
  ],
  errors: null,
};

module.exports = jbActivity;
