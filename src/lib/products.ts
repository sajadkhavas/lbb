export type Product = {
  id: string;
  name: string;
  price: string;
  category: string;
};

export const products: Product[] = [
  { id: "1", name: "LBB Classic Hoodie",   price: "1,850,000 تومان", category: "Hoodies"  },
  { id: "2", name: "Cargo Street Pants",   price: "1,250,000 تومان", category: "Pants"    },
  { id: "3", name: "LBB Signature Tee",    price: "780,000 تومان",   category: "T-Shirts" },
  { id: "4", name: "Urban Runner Sneaker", price: "2,400,000 تومان", category: "Sneakers" },
];

export const categories = [
  { n: "01", name: "Hoodies",     count: "24 pieces" },
  { n: "02", name: "Pants",       count: "18 pieces" },
  { n: "03", name: "T-Shirts",    count: "32 pieces" },
  { n: "04", name: "Sneakers",    count: "12 pieces" },
  { n: "05", name: "Accessories", count: "20 pieces" },
];
