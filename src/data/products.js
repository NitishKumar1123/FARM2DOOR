// Centralized product list — import images from src so Vite bundles them
import gift1 from '../assets/Gift/gift1.jpg';
import gift2 from '../assets/Gift/gift2.jpg';
import gift3 from '../assets/Gift/gift3.jpg';
import gift4 from '../assets/Gift/gift4.jpg';
import gift5 from '../assets/Gift/gift5.jpg';

import beauty1 from '../assets/Beauty/beauty1.jpg';
import beauty2 from '../assets/Beauty/beauty2.jpg';
import beauty3 from '../assets/Beauty/beauty3.jpg';
import beauty4 from '../assets/Beauty/beauty4.jpg';
import beauty5 from '../assets/Beauty/beauty5.jpg';

import electronics1 from '../assets/Electronics/electronics1.jpg';
import electronics2 from '../assets/Electronics/electronics2.jpg';
import electronics3 from '../assets/Electronics/electronics3.jpg';
import electronics4 from '../assets/Electronics/electronics4.jpg';
import electronics5 from '../assets/Electronics/electronics5.jpg';

import fruits1 from '../assets/Fruits/fruits1.jpg';
import fruits2 from '../assets/Fruits/fruits2.jpg';
import fruits3 from '../assets/Fruits/fruits3.jpg';
import fruits4 from '../assets/Fruits/fruits4.jpg';
import fruits5 from '../assets/Fruits/fruits5.jpg';
import fruits6 from '../assets/Fruits/Pineapple.jpg';

const products = [
  // 🎁 Gift Category (5 items shown)
  { id: 'g1', title: 'Handmade Gift Box', price: 29.99, category: 'Gift', image: gift1, description: 'Curated handmade items from local farms and artisans.', stock: 10 },
  { id: 'g2', title: 'Gourmet Chocolate Pack', price: 12.5, category: 'Gift', image: gift2, description: 'Small-batch chocolate selection.', stock: 10 },
  { id: 'g3', title: 'Scented Candle Set', price: 19.99, category: 'Gift', image: gift3, description: 'Farm-inspired fragrances for cozy evenings.', stock: 10 },
  { id: 'g4', title: 'Personalized Mug', price: 8.99, category: 'Gift', image: gift4, description: 'Custom printed ceramic mug.', stock: 10 },
  { id: 'g5', title: 'Flower Bouquet', price: 24.99, category: 'Gift', image: gift5, description: 'Freshly picked seasonal flowers.', stock: 10 },

  // 💄 Beauty Category (5 items shown)
  { id: 'b1', title: 'Organic Face Oil', price: 15.5, category: 'Beauty', image: beauty1, description: 'Natural oil blend for glowing skin.', stock: 10 },
  { id: 'b2', title: 'Herbal Body Lotion', price: 9.99, category: 'Beauty', image: beauty2, description: 'Light, non-greasy lotion made from farm-grown herbs.', stock: 10 },
  { id: 'b3', title: 'Aloe Vera Gel', price: 7.5, category: 'Beauty', image: beauty3, description: 'Soothing gel for skin hydration.', stock: 10 },
  { id: 'b4', title: 'Natural Lip Balm', price: 3.99, category: 'Beauty', image: beauty4, description: 'Moisturizing balm with beeswax.', stock: 10 },
  { id: 'b5', title: 'Herbal Shampoo', price: 11.99, category: 'Beauty', image: beauty5, description: 'Gentle shampoo with farm herbs.', stock: 10 },

  // ⚡ Electronics Category (5 items shown)
  { id: 'e1', title: 'Bluetooth Speaker', price: 29.99, category: 'Electronics', image: electronics1, description: 'Portable speaker with deep bass.', stock: 10 },
  { id: 'e2', title: 'Wireless Earbuds', price: 69.99, category: 'Electronics', image: electronics2, description: 'Compact earbuds with great battery life.', stock: 10 },
  { id: 'e3', title: 'Power Bank 10000mAh', price: 19.99, category: 'Electronics', image: electronics3, description: 'Charge devices on the go.', stock: 10 },
  { id: 'e4', title: 'Smart LED Bulb', price: 14.99, category: 'Electronics', image: electronics4, description: 'Control lighting with your phone.', stock: 10 },
  { id: 'e5', title: 'Digital Thermometer', price: 9.99, category: 'Electronics', image: electronics5, description: 'Accurate temperature readings.', stock: 10 },

  // 🍎 Fruits Category (5 items shown)
  { id: 'f1', title: 'Premium Apples (1kg)', price: 4.99, category: 'Fruits', image: fruits1, description: 'Fresh crisp apples sourced locally.', stock: 10 },
  { id: 'f2', title: 'Banana Bunch', price: 2.99, category: 'Fruits', image: fruits2, description: 'Ripe bananas, great for smoothies.', stock: 10 },
  { id: 'f3', title: 'Oranges (1kg)', price: 3.99, category: 'Fruits', image: fruits3, description: 'Juicy and sweet oranges.', stock: 10 },
  { id: 'f4', title: 'Mangoes (1kg)', price: 6.99, category: 'Fruits', image: fruits4, description: 'Seasonal ripe mangoes.', stock: 10 },
  { id: 'f5', title: 'Grapes (500g)', price: 3.5, category: 'Fruits', image: fruits5, description: 'Seedless green grapes.', stock: 10 }
];

export default products;