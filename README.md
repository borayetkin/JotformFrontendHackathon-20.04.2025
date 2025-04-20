# JotForm E-commerce Frontend

A React-based e-commerce frontend for Del Mono Fresh, fetching product data from JotForm and providing shopping cart functionality.

## Features

- Modern, responsive UI using Tailwind CSS
- Product listing with images and details
- Shopping cart functionality
- Quantity selector for products
- Order form with customer details
- Simulated checkout process

## Project Structure

```
jotform-ecommerce/
├── node_modules/        # Dependencies (generated after npm install)
├── public/              # Static assets
│   └── index.html       # Main HTML file
├── src/                 # Source code
│   ├── components/      # React components
│   │   ├── Header.js    # Navigation and branding
│   │   ├── ProductList.js  # List of all products
│   │   ├── ProductCard.js  # Individual product display
│   │   ├── Cart.js      # Shopping cart functionality
│   │   └── Footer.js    # Site footer with JotForm links
│   ├── services/        # API and service functions
│   │   └── api.js       # JotForm API integration
│   ├── data/            # Data files
│   │   └── products.js  # Product information
│   ├── App.js           # Main application component
│   ├── index.js         # Entry point
│   └── index.css        # Global styles with Tailwind
├── package.json         # Project dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
└── README.md            # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/jotform-ecommerce.git
cd jotform-ecommerce
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm start
# or
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## JotForm Integration

This project uses the JotForm API to fetch product data. The API details are:

- Form ID: 251074098711961
- API Key: c85edb6e95352b280c4f0edb1ddf9e61
- Endpoint: https://api.jotform.com/form/:formID/questions?apiKey={apiKey}

## Technologies Used

- React.js - Frontend framework
- React Router - Navigation
- Tailwind CSS - Styling
- Axios - API requests

## Future Improvements

- Add product search and filtering
- Implement user authentication
- Add payment processing integration
- Implement product categories
- Add product detail pages
- Persist cart data in localStorage or a database

## License

This project is licensed under the MIT License.

# 🚀 Hackathon Duyurusu

## 📅 Tarih ve Saat

Pazar günü saat 11:00'da başlayacak.

## 🎯 Hackathon Konsepti

Bu hackathon'da, size özel hazırlanmış bir senaryo üzerine web uygulaması geliştirmeniz istenecektir. Hackathon başlangıcında senaryo detayları paylaşılacaktır.Katılımcılar, verilen GitHub reposunu fork ederek kendi geliştirme ortamlarını oluşturacaklardır.

## 📦 GitHub Reposu

Hackathon için kullanılacak repo: [JotformFrontendHackathon-20.04.2025](https://github.com/erayaydinJF/JotformFrontendHackathon-20.04.2025)

## 🛠️ Hazırlık Süreci

1. GitHub reposunu fork edin
2. Tercih ettiğiniz framework ile geliştirme ortamınızı hazırlayın
3. Hazırladığınız setup'ı fork ettiğiniz repoya gönderin

## 💡 Önemli Notlar

- Katılımcılar kendi tercih ettikleri framework'leri kullanabilirler
- Geliştirme ortamınızı önceden hazırlayıp reponuza göndermeniz önerilir
