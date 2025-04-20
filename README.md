# JotForm E-commerce Shop

A simple online shopping website that gets products from JotForm and lets you add them to your cart and submit orders.

![JotForm E-commerce Shop](https://placehold.co/600x400?text=JotForm+E-commerce+Shop)

## 📱 What This Website Does

- **Show Products**: See all products with pictures and prices
- **Shopping Cart**: Add items to your cart and change quantities
- **Save Favorites**: Click the heart icon to save products you like
- **Easy Checkout**: Enter shipping info and choose payment method
- **Submit Orders**: Orders are sent to JotForm automatically

## 🚀 How to Start the Project

### What You Need

- [Node.js](https://nodejs.org/) (version 14 or newer)
- npm (comes with Node.js)
- A web browser (Chrome, Firefox, Safari, etc.)

### Step-by-Step Setup

1. **Get the code**

   ```bash
   git clone https://github.com/borayetkin/JotformFrontendHackathon-20.04.2025.git
   cd JotformFrontendHackathon-20.04.2025
   ```

2. **Install everything needed**

   ```bash
   npm install
   ```

3. **Start the website**

   ```bash
   npm start
   ```

4. **Use the website**

   Open your browser and go to: http://localhost:3000

### Solving Common Problems

- If you see "Error: cannot find module", run `npm install` again
- If the website doesn't load, make sure you typed the address correctly
- If you see JotForm API errors, the API key might be expired

## 💻 How to Use the Website

1. Browse products on the home page
2. Click "Add to Cart" on products you want to buy
3. Click the cart icon in the top-right corner to see your cart
4. Fill in your name and address
5. Choose a payment method (credit card or PayPal)
6. Click "Complete Order" to submit your order to JotForm

## 🔧 Project Files and Structure

```
JotformFrontendHackathon-20.04.2025/
├── public/              # Static files
│   └── index.html       # Main HTML page
├── src/                 # Source code
│   ├── components/      # Website parts
│   │   ├── Cart.js      # Shopping cart
│   │   ├── Footer.js    # Page footer
│   │   ├── Header.js    # Navigation
│   │   ├── ProductCard.js # Single product display
│   │   ├── ProductDetail.js # Product details page
│   │   └── ProductList.js # Grid of all products
│   ├── data/            # Local data
│   │   └── products.js  # Backup product data
│   ├── services/        # External connections
│   │   └── api.js       # JotForm API integration
│   ├── App.js           # Main application
│   ├── index.js         # Entry point
│   └── index.css        # Styles with Tailwind
├── package.json         # Dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS settings
└── README.md            # This documentation
```

## 🔄 How JotForm Integration Works

This website connects with JotForm in two ways:

1. **Getting Products**: Products are loaded from JotForm forms through the API
2. **Submitting Orders**: When you checkout, your order information is sent to JotForm

All JotForm communication happens in the `src/services/api.js` file using the following:

- **Form IDs**: 251074098711961, 251074116166956, 251073669442965
- **API Key**: c85edb6e95352b280c4f0edb1ddf9e61
- **Base URL**: https://api.jotform.com

## 📝 How to Change Things

### Adding New Products

Edit the `getDummyProducts` function in `src/services/api.js`:

```javascript
const products = [
  {
    name: "New Product Name",
    description: "Product description",
    price: 25.0,
    category: "Category",
    maxQuantity: 10,
  },
  // Add more products here
];
```

### Changing Colors and Design

The website uses Tailwind CSS. To change colors:

1. Edit classes in component files (like `bg-gray-700` to `bg-blue-700`)
2. Or update the theme in `tailwind.config.js`

### Fixing Cart or Checkout Issues

The checkout process is in `src/components/Cart.js`. This file handles:

- Showing cart items
- Collecting customer information
- Processing payment selection
- Submitting orders to JotForm

## 🤝 Getting Help

If you need help:

1. Check the comments in the code
2. Look at error messages in the browser console (Press F12)
3. Read the JotForm API docs: https://api.jotform.com/docs/

## 📄 Repository

This project is available at: [https://github.com/borayetkin/JotformFrontendHackathon-20.04.2025](https://github.com/borayetkin/JotformFrontendHackathon-20.04.2025)

---

Project created for the JotForm Frontend Hackathon, 2025
