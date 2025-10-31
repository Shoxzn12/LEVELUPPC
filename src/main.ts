import "./style.css";
import rawProductsData from "./data/products.json" assert { type: "json" };

// ============================================================
// TIPOS (Interfaces)
// ============================================================

interface Category {
  id: string;
  name: string;
  image: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string; // <-- es un string, no un ID numérico
  brand: string;
  image: string;
}

interface ProductsData {
  products: Product[];
  categories: Category[];
  brands: string[];
}

const productsData: ProductsData = rawProductsData as unknown as ProductsData;

// ============================================================
// SLIDER
// ============================================================

const slides = document.querySelectorAll<HTMLDivElement>(".slide");
let currentSlide = 0;

function showSlide(index: number): void {
  slides.forEach((slide) => slide.classList.remove("active"));
  slides[index].classList.add("active");
}

setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 3000);

// ============================================================
// PRODUCTOS
// ============================================================

const productsGrid = document.querySelector<HTMLDivElement>(".products-grid");

if (productsGrid) {
  productsData.products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    const category = productsData.categories.find(
      (c) => c.id === product.category
    );
    const categoryName = category ? category.name : "Sin categoría";

    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>Categoría: ${categoryName}</p>
      <p>Marca: ${product.brand}</p>
      <p>Precio: $${product.price.toLocaleString("es-CO")}</p>
      <button class="add-to-cart" data-product-id="${product.id}">
        Agregar al carrito
      </button>
    `;

    productsGrid.appendChild(productCard);
  });
}

// ============================================================
// CARRITO
// ============================================================

const cart: Product[] = [];

function addToCart(productId: number): void {
  const product = productsData.products.find((p) => p.id === productId);
  if (product) {
    cart.push(product);
    console.log("Carrito:", cart);
  }
}

const addToCartButtons =
  productsGrid?.querySelectorAll<HTMLButtonElement>(".add-to-cart") || [];

addToCartButtons.forEach((btn) => {
  btn.addEventListener("click", (e: MouseEvent) => {
    e.stopPropagation();
    const productId = Number.parseInt(btn.getAttribute("data-product-id") || "0");
    addToCart(productId);
  });
});
