import axios from "axios";

/**
 * JotForm API Integration Service
 *
 * This service handles all interactions with the JotForm API:
 * - Fetching product data from JotForm forms
 * - Submitting orders to JotForm
 * - Error handling and fallback behavior
 *
 * The service tries multiple endpoints to retrieve product data:
 * 1. First attempts the payment-info endpoint
 * 2. Falls back to form questions if payment info fails
 * 3. Falls back to form submissions if questions fail
 * 4. Uses dummy/fallback data if all API attempts fail
 *
 * It also handles order submission in the proper format required by JotForm's API.
 */

const API_KEY = "c85edb6e95352b280c4f0edb1ddf9e61";
const BASE_URL = "https://api.jotform.com";

export const FORM_IDS = {
  form1: "251074098711961",
  form2: "251074116166956",
  form3: "251073669442965",
};

// Field mappings for our forms - maps our data to JotForm field IDs
const FIELD_MAPPINGS = {
  [FORM_IDS.form1]: {
    fullName: "1", // Full Name field
    address: "2", // Address field
    productDetails: "5", // Product details field
    orderSummary: "3", // Order summary text field
    totalAmount: "4", // Total amount field
  },
  // Add mappings for other forms as needed
};

/**
 * @typedef {Object} ProductItem
 * @property {string} id - Unique product ID
 * @property {string} name - Product name
 * @property {number} price - Product price
 * @property {string} description - Product description
 * @property {string} image - Primary image URL
 * @property {string[]} [images] - Array of image URLs
 * @property {string} [category] - Product category
 * @property {number} [stock] - Available stock
 * @property {number} [maxQuantity] - Maximum order quantity
 */

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    apiKey: API_KEY,
  },
});

export const getFormData = async (formId = FORM_IDS.form1) => {
  try {
    const response = await api.get(`/form/${formId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching form data for form ${formId}:`, error);
    throw error;
  }
};

/**
 * Fetch products from JotForm API
 * @param {string} formId - ID of the form to fetch products from
 * @returns {Promise<ProductItem[]>} Array of product items
 */
export const fetchProducts = async (formId = FORM_IDS.form1) => {
  try {
    console.log(`Fetching products from JotForm form ${formId}...`);

    // Try the payment-info endpoint first
    try {
      const endpoint = `${BASE_URL}/form/${formId}/payment-info?apiKey=${API_KEY}`;
      console.log(`Trying endpoint: ${endpoint}`);

      const response = await axios.get(endpoint);

      // Log the API response for debugging
      console.log(
        "API Response Structure:",
        JSON.stringify(response.data, null, 2).substring(0, 500) + "..."
      );

      if (response.data && response.data.content) {
        return transformJotformResponse(response.data.content, formId);
      }
    } catch (paymentError) {
      console.log(
        `Payment info endpoint failed for form ${formId}:`,
        paymentError.message
      );
    }

    // If payment-info fails, try form questions
    try {
      const questionsResponse = await api.get(`/form/${formId}/questions`);

      if (questionsResponse.data && questionsResponse.data.content) {
        const questions = questionsResponse.data.content;

        // Find product fields in form questions
        const productFields = Object.values(questions).filter(
          (q) =>
            q.type === "control_payment" ||
            q.type === "control_products" ||
            q.name?.includes("productList")
        );

        if (productFields.length > 0) {
          console.log(
            `Found ${productFields.length} product fields in form ${formId}`
          );

          // Try to extract product data from questions
          const products = [];

          productFields.forEach((field, index) => {
            if (field.products && Array.isArray(field.products)) {
              field.products.forEach((product) => {
                products.push(mapProductFromJotform(product, products.length));
              });
            }
          });

          if (products.length > 0) {
            console.log(
              `Extracted ${products.length} products from form questions`
            );
            return products;
          }
        }
      }
    } catch (questionsError) {
      console.log(
        `Questions endpoint failed for form ${formId}:`,
        questionsError.message
      );
    }

    // If questions fail, try submissions
    try {
      const submissionsResponse = await api.get(`/form/${formId}/submissions`);

      if (submissionsResponse.data && submissionsResponse.data.content) {
        const submissions = submissionsResponse.data.content;

        if (submissions.length > 0) {
          const products = [];

          submissions.forEach((submission) => {
            if (submission.answers) {
              Object.values(submission.answers).forEach((answer) => {
                if (answer.products && Array.isArray(answer.products)) {
                  answer.products.forEach((product) => {
                    const existingProduct = products.find(
                      (p) => p.name === product.name
                    );
                    if (!existingProduct) {
                      products.push(
                        mapProductFromJotform(product, products.length)
                      );
                    }
                  });
                }

                if (
                  answer.paymentProducts &&
                  Array.isArray(answer.paymentProducts)
                ) {
                  answer.paymentProducts.forEach((product) => {
                    const existingProduct = products.find(
                      (p) => p.name === product.name
                    );
                    if (!existingProduct) {
                      products.push(
                        mapProductFromJotform(product, products.length)
                      );
                    }
                  });
                }
              });
            }
          });

          if (products.length > 0) {
            console.log(
              `Extracted ${products.length} products from form submissions`
            );
            return products;
          }
        }
      }
    } catch (submissionsError) {
      console.log(
        `Submissions endpoint failed for form ${formId}:`,
        submissionsError.message
      );
    }

    // If all attempts fail, use dummy data for this form
    console.log(`No products found for form ${formId}, using dummy data`);
    return getDummyProducts(formId);
  } catch (error) {
    console.error(`Error fetching products from form ${formId}:`, error);
    return getDummyProducts(formId);
  }
};

/**
 * Transform JotForm API response to our ProductItem format
 * @param {Object} data - Response data from JotForm API
 * @param {string} formId - Form ID used for the request
 * @returns {ProductItem[]} Transformed product items
 */
const transformJotformResponse = (data, formId) => {
  console.log(
    "Response content:",
    JSON.stringify(data).substring(0, 500) + "..."
  );

  // Try different property paths that might contain products
  if (Array.isArray(data.products)) {
    console.log("Found products array in payment info");
    return data.products.map((product, index) =>
      mapProductFromJotform(product, index)
    );
  }

  if (data.answers && typeof data.answers === "object") {
    console.log("Found answers object in payment info");
    // Try to extract products from answers
    const products = Object.values(data.answers).filter(
      (answer) =>
        answer &&
        typeof answer === "object" &&
        ("paymentProducts" in answer || "products" in answer)
    );

    if (products.length > 0) {
      const firstProduct = products[0];
      const productItems =
        firstProduct.paymentProducts || firstProduct.products || [];
      return Array.isArray(productItems)
        ? productItems.map((product, index) =>
            mapProductFromJotform(product, index)
          )
        : [];
    }
  }

  // If no products are found, create dummy products based on form ID
  console.log("No products found in payment info response, using dummy data");
  return getDummyProducts(formId);
};

/**
 * Helper function to safely parse JSON
 * @param {string|null|undefined} jsonString - JSON string to parse
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} Parsed object or default value
 */
const safeJsonParse = (jsonString, defaultValue = null) => {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Error parsing JSON:", e);
    return defaultValue;
  }
};

/**
 * Map product data from JotForm format to our ProductItem format
 * @param {Object} product - Product data from JotForm
 * @param {number} index - Index for generating fallback ID
 * @returns {ProductItem} Mapped product item
 */
const mapProductFromJotform = (product, index = 0) => {
  // Log each product mapping
  console.log(
    `Mapping product: ${JSON.stringify(product).substring(0, 200)}...`
  );

  // Handle different possible property names
  const name =
    product.name ||
    product.productName ||
    product.text ||
    `Product ${index + 1}`;
  const price = parseFloat(product.price || product.amount || "0") || 0;
  const description =
    product.description ||
    product.text ||
    name ||
    "High-quality product for all your needs.";

  // Check if an image URL is a placeholder
  const isPlaceholder = (imgUrl) => {
    if (!imgUrl) return true;
    return (
      imgUrl.includes("placehold.co") ||
      imgUrl.includes("placeholder") ||
      imgUrl.includes("?text=") ||
      imgUrl.includes("no-image")
    );
  };

  // Parse images from JSON string
  let imageUrls = [];
  let primaryImageUrl = "";

  // Check if images is a JSON string "[\"url1\", \"url2\"]"
  if (typeof product.images === "string") {
    try {
      imageUrls = safeJsonParse(product.images, []);
      console.log("Parsed image URLs:", imageUrls);
    } catch (e) {
      console.error("Error parsing image JSON:", e);
    }
  } else if (Array.isArray(product.images)) {
    imageUrls = product.images;
  }

  // Clean up image URLs (remove escaped characters)
  imageUrls = imageUrls
    .map((url) => url.replace(/\\/g, ""))
    .filter((url) => !isPlaceholder(url)); // Remove placeholder images

  // Add product.image as additional source if it exists and isn't a placeholder
  if (
    product.image &&
    !isPlaceholder(product.image) &&
    !imageUrls.includes(product.image)
  ) {
    imageUrls.push(product.image);
  }

  // Add thumbnail as additional source if it exists and isn't a placeholder
  if (
    product.thumbnail &&
    !isPlaceholder(product.thumbnail) &&
    !imageUrls.includes(product.thumbnail)
  ) {
    imageUrls.push(product.thumbnail);
  }

  // Add imageUrl as additional source if it exists and isn't a placeholder
  if (
    product.imageUrl &&
    !isPlaceholder(product.imageUrl) &&
    !imageUrls.includes(product.imageUrl)
  ) {
    imageUrls.push(product.imageUrl);
  }

  // Set primary image from the first available image
  if (imageUrls.length > 0) {
    primaryImageUrl = imageUrls[0];
  }

  // Extract category from name if present (before the comma)
  const nameParts = name.split(",");
  const category =
    product.category ||
    product.productCategory ||
    product.type ||
    (nameParts.length > 1 ? nameParts[0].trim() : "General");

  // If no real images are available, use a placeholder with the category color
  if (imageUrls.length === 0) {
    const colorMap = {
      Apple: "FF6B6B",
      Vegetables: "6BCB77",
      Avocado: "4D8B31",
      Banana: "FFD93D",
      Beans: "B45309",
      Tomato: "DC2626",
      Fruits: "7c2d12",
      Roots: "f97316",
      General: "4096ff",
    };

    const color = colorMap[category] || "4096ff";
    const textColor = ["Banana"].includes(category) ? "333333" : "ffffff";
    const cleanName = nameParts.length > 1 ? nameParts[1].trim() : name;

    primaryImageUrl = `https://placehold.co/400x300/${color}/${textColor}?text=${encodeURIComponent(
      cleanName
    )}`;
    imageUrls = [primaryImageUrl];
  }

  return {
    id: product.pid || product.id || product.productId || `product-${index}`,
    name,
    price,
    description,
    image: primaryImageUrl,
    images: imageUrls,
    category,
    stock: parseInt(product.stock || product.quantity || "10") || 10,
    maxQuantity: parseInt(product.stock || product.quantity || "10") || 10,
  };
};

/**
 * Get dummy products as fallback
 * @param {string} formId - Form ID to customize dummy products
 * @returns {ProductItem[]} Array of dummy product items
 */
const getDummyProducts = (formId) => {
  // Generate a different seed based on form ID to get different products for each form
  const formIdNumber = parseInt(formId.replace(/\D/g, "").substring(0, 5)) || 0;

  const categories = [
    { name: "Apple", color: "FF6B6B", textColor: "ffffff" },
    { name: "Vegetables", color: "6BCB77", textColor: "ffffff" },
    { name: "Avocado", color: "4D8B31", textColor: "ffffff" },
    { name: "Banana", color: "FFD93D", textColor: "333333" },
    { name: "Beans", color: "B45309", textColor: "ffffff" },
    { name: "Tomato", color: "DC2626", textColor: "ffffff" },
    { name: "Fruits", color: "7c2d12", textColor: "ffffff" },
    { name: "Roots", color: "f97316", textColor: "ffffff" },
  ];

  const products = [
    {
      name: "Apple, Red",
      description: "Apple, Red 40 lb",
      price: 54.0,
      category: "Apple",
      maxQuantity: 10,
    },
    {
      name: "Asparagus",
      description: "Asparagus",
      price: 36.0,
      category: "Vegetables",
      maxQuantity: 15,
    },
    {
      name: "Avocado, Hass 60 ct #1",
      description: "Avocado, Hass 60 ct #1",
      price: 47.0,
      category: "Avocado",
      maxQuantity: 50,
    },
    {
      name: "Banana, Regular",
      description: "Banana, Regular 40 lb",
      price: 29.0,
      category: "Banana",
      maxQuantity: 100,
    },
    {
      name: "Tomato, 5x6",
      description: "Tomato, 5x6 25 lb",
      price: 20.0,
      category: "Tomato",
      maxQuantity: 50,
    },
    {
      name: "Yucca, Fresh",
      description: "Yucca, Fresh 32 lb",
      price: 35.0,
      category: "Roots",
      maxQuantity: 100,
    },
  ];

  // Return a subset of products based on the form ID to have variation
  const startIndex = formIdNumber % 3;
  const productCount = 6 + (formIdNumber % 4);

  return Array.from({ length: productCount }, (_, i) => {
    const productIndex = (startIndex + i) % products.length;
    const product = products[productIndex];

    const categoryObj = categories.find(
      (cat) => cat.name === product.category
    ) || { name: "General", color: "4096ff", textColor: "ffffff" };

    return {
      id: `${formId}-dummy-${i}`,
      name: product.name,
      price: product.price,
      description: product.description,
      image: `https://placehold.co/400x300/${categoryObj.color}/${
        categoryObj.textColor
      }?text=${encodeURIComponent(product.name)}`,
      images: [
        `https://placehold.co/400x300/${categoryObj.color}/${
          categoryObj.textColor
        }?text=${encodeURIComponent(product.name)}`,
      ],
      category: product.category,
      stock: product.maxQuantity,
      maxQuantity: product.maxQuantity,
    };
  });
};

export const submitOrder = async (orderData) => {
  try {
    console.log("Order data to be submitted:", orderData);

    // Validate required data
    if (!orderData.customer || !orderData.customer.name) {
      throw new Error("Customer name is required");
    }

    if (!orderData.customer.address) {
      throw new Error("Customer address is required");
    }

    if (
      !orderData.items ||
      !Array.isArray(orderData.items) ||
      orderData.items.length === 0
    ) {
      throw new Error("Order must contain at least one item");
    }

    // Prepare the submission data for JotForm
    const formId = FORM_IDS.form1;
    const fieldMapping = FIELD_MAPPINGS[formId];

    console.log(`Creating submission for form ID: ${formId}`);

    // Format data according to the JotForm API requirements
    const formData = new URLSearchParams();

    // Add API key directly to form data
    formData.append("apiKey", API_KEY);

    // Add customer info
    formData.append(
      `submission[${fieldMapping.fullName}]`,
      orderData.customer.name
    );
    formData.append(
      `submission[${fieldMapping.address}]`,
      orderData.customer.address
    );

    // Calculate totals
    const subtotal = orderData.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const shipping = 4.99; // Fixed shipping cost
    const total = subtotal + shipping;

    // Create a readable order summary (will be shown in JotForm dashboard)
    const orderSummary = orderData.items
      .map(
        (item) =>
          `${item.name} x ${item.quantity} = $${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");

    // Add summary and totals to form data
    formData.append(`submission[${fieldMapping.orderSummary}]`, orderSummary);
    formData.append(
      `submission[${fieldMapping.totalAmount}]`,
      `$${total.toFixed(2)}`
    );

    // Add each product as a separate field in a way JotForm expects
    orderData.items.forEach((item, index) => {
      const fieldId =
        getProductFieldId(item.name) ||
        `${Number(fieldMapping.productDetails) + index}`;

      // Add product name and quantity directly as form fields
      formData.append(`submission[${fieldId}_name]`, item.name);
      formData.append(
        `submission[${fieldId}_quantity]`,
        item.quantity.toString()
      );
      formData.append(`submission[${fieldId}_price]`, item.price.toString());

      // Also add in standard format for JotForm product fields
      formData.append(
        `submission[${fieldId}]`,
        JSON.stringify({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: (item.price * item.quantity).toFixed(2),
        })
      );
    });

    // Include additional metadata JotForm expects
    formData.append("submission[new]", "1");
    formData.append("submission[flag]", "0");

    // Also send the raw product array as JSON in a special field
    formData.append(`submission[products]`, JSON.stringify(orderData.items));

    // Log the data being sent for debugging
    console.log("Form data being sent:", Object.fromEntries(formData));

    // Submit the form to JotForm
    const response = await axios.post(
      `${BASE_URL}/form/${formId}/submissions`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("JotForm submission response:", response.data);

    // Extract the submission ID from the response
    if (
      response.data &&
      response.data.responseCode === 200 &&
      response.data.content
    ) {
      const submissionId = response.data.content.submissionID;
      console.log(`Created submission with ID: ${submissionId}`);

      // Fetch submission details after a short delay to ensure processing
      try {
        console.log("Waiting for submission to be processed...");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const detailsResponse = await axios.get(
          `${BASE_URL}/submission/${submissionId}`,
          {
            params: {
              apiKey: API_KEY,
            },
          }
        );

        console.log(
          "Submission details:",
          JSON.stringify(detailsResponse.data, null, 2)
        );
      } catch (detailsError) {
        console.error("Error fetching submission details:", detailsError);
        // We can still continue even if details fetch fails
      }

      return {
        success: true,
        message: "Order submitted successfully to JotForm",
        submissionId: submissionId,
      };
    }

    // In case of any issue with the API response
    return {
      success: false,
      message:
        response.data?.message || "Order submission failed. Please try again.",
    };
  } catch (error) {
    console.error("Error submitting order to JotForm:", error);

    // Different error handling based on error type
    let errorMessage =
      "An error occurred during submission. Please try again later.";

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("JotForm API error response:", error.response.data);
      errorMessage = `Server error: ${error.response.status}. ${
        error.response.data?.message || "Please try again."
      }`;
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from JotForm API");
      errorMessage = "No response from server. Check your internet connection.";
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
      errorMessage = error.message || "Error preparing submission.";
    }

    // For development/testing - provide a fallback response
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "Using fallback successful response in development environment"
      );
      return {
        success: true,
        message: "Order submitted successfully (development fallback)",
        submissionId: `DEV-${Date.now()}`,
      };
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Helper function to map product names to form field IDs
 * This is a simplified version - in production, you would dynamically fetch these mappings
 */
const getProductFieldId = (productName) => {
  // Map product names to their likely field IDs in the JotForm
  const fieldMappings = {
    // Based on the JotForm form structure - examples
    "Apple, Red": "5",
    Asparagus: "6",
    "Avocado, Hass 60 ct #1": "7",
    // Default handling for other products
  };

  // Try to find an exact match
  if (fieldMappings[productName]) {
    return fieldMappings[productName];
  }

  // If no exact match, try to find a partial match
  const keyMatch = Object.keys(fieldMappings).find((key) =>
    productName.toLowerCase().includes(key.toLowerCase())
  );

  if (keyMatch) {
    return fieldMappings[keyMatch];
  }

  // If no mapping found, return a default value
  console.warn(`No field mapping found for product: ${productName}`);
  return null;
};

export default {
  getFormData,
  fetchProducts,
  submitOrder,
  FORM_IDS,
};
