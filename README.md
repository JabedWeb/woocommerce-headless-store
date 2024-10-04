# WooCommerce Headless Store
A React-based application for displaying WooCommerce product details, leveraging a headless CMS architecture. This project supports variable products, allowing users to select attributes such as size and color, dynamically updating the displayed image and price based on their selections. The application currently focuses on displaying single product pages, with plans to add features for coupons, orders, and more.

## Features

- Fetches product data from a WooCommerce store using REST API.
- Supports variable products with attribute selection (e.g., size, color).
- Dynamically updates product image and price based on selected variations.
- User-friendly interface built with React.
- Easy integration with existing WooCommerce setups.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/jabedweb/woocommerce-headless-store.git
    ```

2. Navigate to the project directory:

    ```bash
    cd woocommerce-headless-store
    ```

3. Install dependencies:

    ```bash
    npm install 
    ```

4. Create a `.env.local` file in the root of the project and add the following environment variables, replacing the placeholders with your actual WooCommerce store details:

    ```plaintext
    VITE_domain=https://yourstore.com
    VITE_consumerKey=your_consumer_key
    VITE_consumerSecret=your_consumer_secret
    ```

5. Start the development server:

    ```bash
    npm run dev
    ```

### Adding REST API from Your Own Website

To fetch product data from your own WooCommerce website, follow these steps:

1. **Enable WooCommerce REST API**:
    - Go to your WordPress admin dashboard.
    - Navigate to **WooCommerce > Settings > Advanced > REST API**.
    - Click on **Add Key** and fill in the required details.
    - Generate the API keys (Consumer Key and Consumer Secret).

2. **Update Environment Variables**:
    - Open the `.env.local` file.
    - Add your store's URL and the generated API keys:

    ```plaintext
    VITE_domain=https://yourstore.com
    VITE_consumerKey=your_consumer_key
    VITE_consumerSecret=your_consumer_secret
    ```

## Future Plans

- Implement coupon management.
- Add order processing features.
- Enhance the single product page with additional details and functionalities.
- Improve user interface and experience.
- And More ...................




