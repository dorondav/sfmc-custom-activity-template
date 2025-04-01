import { helpers } from "@vuelidate/validators";

import axios from "axios";
const VITE_APP_URL = import.meta.env.VITE_APP_URL.replace(/\/+$/, "");
const { withAsync, withMessage } = helpers;

// Validator to check if the URL starts with "https://"
export const startsWithHttps = withMessage('URL must start with "https://"', (value) => !value || value.startsWith("https://"));

// Validator to check if the URL ends with .png, .bmp, .jpeg, .webp  or .jpg
export const isValidImageType = withMessage("Image must be a BMP, JPG, JPEG, PNG, or WebP", (value) => !value || /\.(png|jpg|bmp|jpeg|webp)$/i.test(value));

// check if the item is found in the schema object
export const validateItemInSchema = (store) =>
  withMessage("orderID is not in the schema", (value) => {
    let itemToValidate;
    if (value === "warrantyLink") {
      itemToValidate = "orderID";
      const IsOrderId = store.getSchemaItemByName(itemToValidate);
      return IsOrderId ? true : false;
    }
    return true;
  });

export const isValidImageSize = withAsync(async (value) => {
  if (value) {
    try {
      const response = await axios.get(`${VITE_APP_URL}/check-image-size`, {
        params: { url: value },
      });

      const { data } = response;

      if (data.status != 200) return;
      return true;
    } catch (error) {
      console.error("Could not verify image size", error);
      return;
    }
  }
  return true;
});
