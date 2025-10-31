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

// Recuperar carrito de localStorage o iniciar vacío
let cart: (Product & { quantity: number })[] = JSON.parse(localStorage.getItem("cart") || "[]");

// Elementos del DOM
const cartCountEl = document.querySelector<HTMLSpanElement>(".cart-count");
const cartSidebarItems = document.getElementById("cartSidebarItems");
const cartSidebarTotal = document.getElementById("cartSidebarTotal");

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
  // Actualizar número del carrito
  if (cartCountEl) cartCountEl.textContent = String(cart.reduce((sum, i) => sum + i.quantity, 0));

  // Actualizar contenido del sidebar
  if (!cartSidebarItems || !cartSidebarTotal) return;

  cartSidebarItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const itemEl = document.createElement("div");
    itemEl.classList.add("cart-item");
    itemEl.innerHTML = `
      <div class="cart-item-info">
        <img src="${item.image}" alt="${item.name}" width="50" />
        <div>
          <h4>${item.name}</h4>
          <p>$${item.price.toLocaleString("es-CO")} x ${item.quantity}</p>
        </div>
      </div>
      <button class="remove-item" data-id="${item.id}">✕</button>
    `;
    cartSidebarItems.appendChild(itemEl);
  });

  cartSidebarTotal.textContent = `$${total.toLocaleString("es-CO")}`;
  saveCart();
}

// Agregar al carrito
function addToCart(productId: number): void {
  const product = productsData.products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  alert(`${product.name} agregado al carrito 🛒`);
}

// Escuchar clicks en botones “Agregar al carrito”
const addToCartButtons = productsGrid?.querySelectorAll<HTMLButtonElement>(".add-to-cart") || [];
addToCartButtons.forEach(btn => {
  btn.addEventListener("click", e => {
    e.stopPropagation();
    const productId = Number(btn.getAttribute("data-product-id"));
    addToCart(productId);
  });
});

// Escuchar clicks para eliminar items del carrito
if (cartSidebarItems) {
  cartSidebarItems.addEventListener("click", e => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("remove-item")) {
      const id = Number(target.getAttribute("data-id"));
      cart = cart.filter(item => item.id !== id);
      updateCartUI();
    }
  });
}

// Inicializar interfaz del carrito
updateCartUI();

// ============================================================
// CHECKOUT
// ============================================================

const checkoutModal = document.getElementById("checkoutModal");
const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");
const proceedToCheckoutBtn = document.getElementById("proceedToCheckout");
const closeCheckoutBtn = document.getElementById("closeCheckout");

function updateCheckoutSummary() {
  if (!checkoutItems || !checkoutTotal) return;

  checkoutItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const itemEl = document.createElement("div");
    itemEl.classList.add("checkout-item");
    itemEl.innerHTML = `
      <div class="checkout-item-info">
        <img src="${item.image}" alt="${item.name}" width="50" />
        <div>
          <h4>${item.name}</h4>
          <p>$${item.price.toLocaleString("es-CO")} x ${item.quantity}</p>
        </div>
      </div>
    `;
    checkoutItems.appendChild(itemEl);
    total += item.price * item.quantity;
  });

  checkoutTotal.textContent = `$${total.toLocaleString("es-CO")}`;
}

// Abrir modal al hacer clic en “Proceder al Pago”
proceedToCheckoutBtn?.addEventListener("click", () => {
  updateCheckoutSummary();
  if (checkoutModal) checkoutModal.style.display = "block";
});

// Cerrar modal
closeCheckoutBtn?.addEventListener("click", () => {
  if (checkoutModal) checkoutModal.style.display = "none";
});

