function parseConfigModal(configModal) {
  let newFormData = configModal;
  if (typeof configModal === "string") {
    newFormData = JSON.parse(configModal);
  }

  if (newFormData.licenseNumber) {
    newFormData.licenseNumber = removeDataBindValue(newFormData.licenseNumber);
  }
  if (newFormData.orderId) {
    newFormData.orderId = removeDataBindValue(newFormData.orderId);
  }
  return newFormData;
}

function removeCurlyBraces(string) {
  return string.replace(/{/g, "").replace(/}/g, "");
}

const removeDataBindValue = (value) => {
  if (!value) return;

  if (value.startsWith("{{") && value.endsWith("}}")) {
    // remove curly braces at the beginning and end of the string
    value = value.slice(2, -2);
  }
  // remove double quotes at the beginning and end of the string
  const valueArray = value.split(".");
  if (valueArray[2].startsWith('"') && valueArray[2].endsWith('"')) {
    valueArray[2] = valueArray[2].slice(1, -1);
  }
  // concatenate the array elements with a dot
  return valueArray.join(".");
};

const dataBindValue = (value) => {
  if (!value) return;
  const valueArr = value.split(".");
  valueArr[valueArr.length - 1] = `"${valueArr[valueArr.length - 1]}"`;
  value = valueArr.join(".");
  return `{{${value}}}`;
};

export { parseConfigModal, dataBindValue, removeDataBindValue };
