const whatsappNumber = "917498576956";

const products = [
  {
    id: "smartphone-01",
    name: "Galaxy S24",
    category: "phones",
    categoryName: "Smartphones",
    price: 74999,
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=760&q=85",
    imageAlt: "Modern Galaxy smartphone"
  },
  {
    id: "smartphone-02",
    name: "iPhone 15",
    category: "phones",
    categoryName: "Smartphones",
    price: 69999,
    badge: "Great pick",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=760&q=85",
    imageAlt: "iPhone in a deep purple finish"
  },
  {
    id: "earbuds-01",
    name: "Everyday Wireless Buds",
    category: "audio",
    categoryName: "Audio",
    price: 2499,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=760&q=85",
    imageAlt: "Wireless earbuds and charging case"
  },
  {
    id: "watch-01",
    name: "Active Smart Watch",
    category: "accessories",
    categoryName: "Accessories",
    price: 3999,
    badge: "New",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=760&q=85",
    imageAlt: "Minimal smartwatch with a dark watch face"
  },
  {
    id: "speaker-01",
    name: "Pocket Bluetooth Speaker",
    category: "audio",
    categoryName: "Audio",
    price: 1899,
    badge: "",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=760&q=85",
    imageAlt: "Compact portable Bluetooth speaker"
  },
  {
    id: "charger-01",
    name: "Fast Charge Power Bank",
    category: "accessories",
    categoryName: "Accessories",
    price: 1599,
    badge: "Everyday essential",
    image: "https://images.unsplash.com/photo-1609592806596-b43bada2f4b9?auto=format&fit=crop&w=760&q=85",
    imageAlt: "Portable power bank for charging a phone"
  },
  {
    id: "smartphone-03",
    name: "Pixel 8",
    category: "phones",
    categoryName: "Smartphones",
    price: 54999,
    badge: "",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=760&q=85",
    imageAlt: "Smartphone with a clean modern design"
  },
  {
    id: "headphones-01",
    name: "Studio Wireless Headphones",
    category: "audio",
    categoryName: "Audio",
    price: 5999,
    badge: "Fan favourite",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=760&q=85",
    imageAlt: "Over-ear wireless headphones"
  }
];

const cart = new Map();
const productGrid = document.getElementById("productGrid");
const productSearch = document.getElementById("productSearch");
const noProducts = document.getElementById("noProducts");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartSummary = document.getElementById("cartSummary");
const cartCount = document.getElementById("cartCount");
const drawerCount = document.getElementById("drawerCount");
const cartSubtotal = document.getElementById("cartSubtotal");
let selectedCategory = "all";

function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function renderProducts() {
  const query = productSearch.value.trim().toLowerCase();
  const matchingProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = `${product.name} ${product.categoryName}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = matchingProducts.map(product => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.imageAlt}" loading="lazy">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
      </div>
      <div class="product-card-content">
        <p class="product-category">${product.categoryName}</p>
        <h3>${product.name}</h3>
        <div class="product-bottom">
          <span class="product-price">${formatPrice(product.price)}</span>
          <button class="add-button" type="button" data-add-product="${product.id}" aria-label="Add ${product.name} to cart">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14m-7-7h14"/></svg>
            Add
          </button>
        </div>
      </div>
    </article>
  `).join("");
  noProducts.hidden = matchingProducts.length !== 0;
}

function updateCart() {
  const items = [...cart.values()];
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  cartCount.textContent = totalQuantity;
  drawerCount.textContent = `(${totalQuantity})`;
  cartEmpty.hidden = items.length > 0;
  cartSummary.hidden = items.length === 0;
  cartItems.innerHTML = items.map(({ product, quantity }) => `
    <article class="cart-item">
      <img src="${product.image}" alt="">
      <div class="cart-item-info">
        <strong>${product.name}</strong>
        <small>${formatPrice(product.price)}</small>
        <div class="quantity-control" aria-label="${product.name} quantity">
          <button type="button" data-cart-action="decrease" data-product-id="${product.id}" aria-label="Remove one ${product.name}">−</button>
          <span>${quantity}</span>
          <button type="button" data-cart-action="increase" data-product-id="${product.id}" aria-label="Add one ${product.name}">+</button>
        </div>
      </div>
      <button class="remove-item" type="button" data-cart-action="remove" data-product-id="${product.id}" aria-label="Remove ${product.name} from cart">×</button>
    </article>
  `).join("");
  cartSubtotal.textContent = formatPrice(subtotal);
}

function openCart() {
  cartOverlay.hidden = false;
  document.body.classList.add("cart-open");
  cartOverlay.querySelector(".close-cart").focus();
}

function closeCart() {
  cartOverlay.hidden = true;
  document.body.classList.remove("cart-open");
  document.getElementById("cartButton").focus();
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add-product]");
  if (!button) return;
  const product = products.find(item => item.id === button.dataset.addProduct);
  if (!product) return;

  const item = cart.get(product.id);
  if (item) item.quantity += 1;
  else cart.set(product.id, { product, quantity: 1 });
  updateCart();
  button.innerHTML = "✓ Added";
  window.setTimeout(() => {
    if (button.isConnected) {
      button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14m-7-7h14"/></svg> Add';
    }
  }, 1000);
});

document.querySelector(".category-tabs").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  selectedCategory = button.dataset.category;
  document.querySelectorAll(".category-tab").forEach(tab => {
    const isSelected = tab === button;
    tab.classList.toggle("selected", isSelected);
    tab.setAttribute("aria-pressed", String(isSelected));
  });
  renderProducts();
});

productSearch.addEventListener("input", renderProducts);
document.getElementById("cartButton").addEventListener("click", openCart);
cartOverlay.addEventListener("click", event => {
  if (event.target.closest("[data-close-cart]")) closeCart();
});

cartItems.addEventListener("click", event => {
  const button = event.target.closest("[data-cart-action]");
  if (!button) return;
  const item = cart.get(button.dataset.productId);
  if (!item) return;

  if (button.dataset.cartAction === "increase") item.quantity += 1;
  if (button.dataset.cartAction === "decrease") item.quantity -= 1;
  if (button.dataset.cartAction === "remove" || item.quantity <= 0) cart.delete(button.dataset.productId);
  updateCart();
});

document.getElementById("checkoutButton").addEventListener("click", () => {
  const items = [...cart.values()];
  if (items.length === 0) return;

  const orderLines = items.map(({ product, quantity }) =>
    `• ${product.name} × ${quantity} — ${formatPrice(product.price * quantity)}`
  );
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const message = [
    "Hi Rayyan! I'd like to place an order from RK Shop:",
    "",
    ...orderLines,
    "",
    `Subtotal: ${formatPrice(total)}`,
    "",
    "Please confirm availability and delivery details."
  ].join("\n");
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});

document.getElementById("mobileMenuButton").addEventListener("click", event => {
  const button = event.currentTarget;
  const menu = document.getElementById("mobileNav");
  const isOpen = menu.classList.toggle("is-open");
  button.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".mobile-nav a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("mobileNav").classList.remove("is-open");
    document.getElementById("mobileMenuButton").setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (!cartOverlay.hidden) closeCart();
    const menu = document.getElementById("mobileNav");
    menu.classList.remove("is-open");
    document.getElementById("mobileMenuButton").setAttribute("aria-expanded", "false");
  }
});

document.getElementById("currentYear").textContent = new Date().getFullYear();
renderProducts();
updateCart();
