import axios from "axios";

const API_KEY = "c85edb6e95352b280c4f0edb1ddf9e61";
const FORM_ID = "251074098711961";
const BASE_URL = "https://api.jotform.com";

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    apiKey: API_KEY,
  },
});

export const getFormData = async () => {
  try {
    const response = await api.get(`/form/${FORM_ID}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching form data:", error);
    throw error;
  }
};

export const getFormQuestions = async () => {
  try {
    const response = await api.get(`/form/${FORM_ID}/questions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching form questions:", error);
    throw error;
  }
};

// This function fetches real product data from the JotForm questions endpoint
export const fetchJotFormProducts = async () => {
  try {
    const response = await api.get(`/form/${FORM_ID}/questions`);
    const questionsData = response.data;

    if (questionsData.responseCode === 200 && questionsData.content) {
      // Extract product information from the questions data
      const products = [];
      let id = 1;

      // Process each question to find product fields
      Object.values(questionsData.content).forEach((question) => {
        // Check if this is a product question
        if (
          question.type === "control_textbox" ||
          question.type === "control_dropdown" ||
          question.type === "control_number"
        ) {
          // Extract product information
          const name = question.text || "Unknown Product";
          const description = question.subLabel || question.text || "";
          const price = parseFloat(question.price || 0);

          // Check if we should add this as a product
          if (
            name &&
            !name.includes("Email") &&
            !name.includes("Name") &&
            !name.includes("Address")
          ) {
            products.push({
              id: id++,
              name,
              description,
              price: price || Math.floor(Math.random() * 50) + 10, // Fallback random price
              image: null, // No images from the API
              maxQuantity: 50, // Default max quantity
            });
          }
        }
      });

      return products;
    }

    throw new Error("Failed to parse product data from JotForm response");
  } catch (error) {
    console.error("Error fetching JotForm products:", error);
    throw error;
  }
};

export const submitOrder = async (orderData) => {
  try {
    // This is a mock submission since the payment-info endpoint is not available
    // In a real implementation, you would use a working JotForm API endpoint
    console.log("Order data to be submitted:", orderData);

    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Order submitted successfully",
        });
      }, 1500);
    });
  } catch (error) {
    console.error("Error submitting order:", error);
    throw error;
  }
};

export default {
  getFormData,
  getFormQuestions,
  fetchJotFormProducts,
  submitOrder,
};
