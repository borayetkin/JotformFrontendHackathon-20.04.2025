import axios from "axios";

const API_KEY = "c85edb6e95352b280c4f0edb1ddf9e61";
const BASE_URL = "https://api.jotform.com";

export const FORM_IDS = {
  form1: "251074098711961",
  form2: "251074116166956",
  form3: "251073669442965",
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
  fetchProducts,
  submitOrder,
  FORM_IDS,
};
