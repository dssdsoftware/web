/* ========================================================
   E-commerce Headless — Interactive JS Application
   DSSD © 2026 — stripe & Webhooks Automatizados
   ======================================================== */

(function () {
  'use strict';

  // ==================== STATE ====================
  const state = {
    products: [
      { id: 1, name: 'Malbec Reserva 2018', price: 15400, desc: 'Aroma intenso con notas a frutos rojos y roble francés.', category: 'Vinos', emoji: '🍷', img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&auto=format&fit=crop&q=80', origin: 'Mendoza, Argentina', abv: '14.5%', volume: '750ml', rating: 4.7, reviews: 128, stock: 24, badge: 'Bestseller' },
      { id: 2, name: 'Whisky Single Malt 12Y', price: 68000, desc: 'Añejamiento de 12 años en selectas barricas de jerez.', category: 'Spirits', emoji: '🥃', img: 'https://images.unsplash.com/photo-1508253730651-e5ace80a7025?w=500&auto=format&fit=crop&q=80', origin: 'Speyside, Escocia', abv: '43%', volume: '700ml', rating: 4.9, reviews: 87, stock: 8, badge: 'Premium' },
      { id: 3, name: 'Pack Cervezas IPA x6', price: 9200, desc: 'Pack artesanal con lúpulos cítricos y amargor equilibrado.', category: 'Cervezas', emoji: '🍺', img: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&auto=format&fit=crop&q=80', origin: 'Patagonia, Argentina', abv: '6.2%', volume: '355ml x6', rating: 4.4, reviews: 203, stock: 42, badge: 'Popular' },
      { id: 4, name: 'Champagne Brut Nature', price: 25000, desc: 'Burbujas finas, fresco, elegante y de bodega boutique.', category: 'Vinos', emoji: '🍾', img: 'img/champagne.png', origin: 'Mendoza, Argentina', abv: '12.5%', volume: '750ml', rating: 4.6, reviews: 64, stock: 15, badge: 'Nuevo' }
    ],
    cart: [],
    isCartOpen: false
  };

  // ==================== HELPERS ====================
  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.3 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  }

  function getStockClass(stock) {
    if (stock <= 10) return 'stock-low';
    if (stock <= 20) return 'stock-medium';
    return 'stock-high';
  }

  function getBadgeClass(badge) {
    const map = { 'Bestseller': 'badge-bestseller', 'Premium': 'badge-premium', 'Popular': 'badge-popular', 'Nuevo': 'badge-new' };
    return map[badge] || '';
  }

  // ==================== TOAST HELPER ====================
  function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const iconMap = { success: '✅', info: 'ℹ️', warning: '⚠️', error: '❌' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${iconMap[type]}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ==================== MAIN RENDER ====================
  function render() {
    const app = document.getElementById('app');
    if (!app) return;

    const cartTotal = getCartTotal();
    const cartCount = getCartCount();

    app.innerHTML = `
      <div class="background">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>

      <!-- Navigation -->
      <nav class="navbar">
        <div class="logo">DRINKS<span>.CO</span></div>
        <ul class="nav-links">
          <li>Vinos</li>
          <li>Cervezas</li>
          <li>Spirits</li>
        </ul>
        <div class="cart-icon-container" id="cartToggle">
          <svg viewBox="0 0 24 24">
            <path d="M9 20a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2zm-9.8-6h8.4a2 2 0 001.9-1.5l1.4-6.5A1 1 0 0020 5H6.2L5.8 3.5A2 2 0 003.9 2H2v2h1.9l2.4 10.5A2 2 0 008.2 16h9.3"></path>
          </svg>
          <span id="cart-count">${cartCount}</span>
        </div>
      </nav>

      <!-- Hero -->
      <header class="hero">
        <div class="hero-content">
          <span class="hero-tag">Headless Experience</span>
          <h1>El arte de beber <span class="highlight">excepcionalmente</span></h1>
          <p>Descubre nuestra curaduría exclusiva de bebidas premium importadas y nacionales. Envíos prioritarios en 24 horas y transacciones encriptadas.</p>
          <button class="shop-btn" id="btnExplore">Explorar Catálogo</button>
        </div>
        <div class="hero-image" style="background-image: url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80'); background-size: cover; background-position: center; width: 360px; height: 460px; border-radius: var(--radius-xl); border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 25px 50px rgba(0,0,0,0.65);"></div>
      </header>

      <!-- Catalog -->
      <main class="products-section" id="catalogSection">
        <div class="section-title">
          <h2>Tendencias Semanales</h2>
        </div>
        <div class="products-grid">
          ${state.products.map(p => `
            <div class="product-card">
              <div class="product-img-wrapper" style="background-image: url('${p.img}'); background-size: cover; background-position: center;">
                <span class="product-badge ${getBadgeClass(p.badge)}">${p.badge}</span>
              </div>
              <div class="product-info">
                <span class="product-category">${p.category}</span>
                <h3 class="product-title">${p.name}</h3>
                <div class="product-rating">
                  <span class="stars">${renderStars(p.rating)}</span>
                  <span class="rating-text">${p.rating} (${p.reviews})</span>
                </div>
                <p class="product-desc">${p.desc}</p>
                <div class="product-details">
                  <span class="detail-pill">📍 ${p.origin}</span>
                  <span class="detail-pill">🍷 ${p.abv} ABV</span>
                  <span class="detail-pill">📦 ${p.volume}</span>
                </div>
                <div class="product-stock ${getStockClass(p.stock)}">
                  <span class="stock-dot"></span> ${p.stock > 20 ? 'En stock' : p.stock > 10 ? 'Últimas ' + p.stock + ' unidades' : '¡Solo quedan ' + p.stock + '!'}
                </div>
                <div class="price-row">
                  <span class="product-price">$ ${p.price.toLocaleString('es-AR')}</span>
                  <button class="add-btn btn-add-cart" data-id="${p.id}">+</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Webhook flow visualizer banner -->
        <div class="webhook-banner" id="webhookBanner">
          <h3><span>⚡</span> Ecosistema DSSD — Automatizaciones Webhook</h3>
          <p>¡El pago fue procesado con éxito! El Webhook de Stripe acaba de notificar a la pasarela central de DSSD, disparando las siguientes acciones integradas en tiempo real:</p>
          <div class="flow-nodes">
            <div class="flow-node" id="node-stripe">
              <strong>Stripe Event</strong>
              <span>Webhook Disparado</span>
            </div>
            <div class="flow-line" id="line-1"></div>
            <div class="flow-node" id="node-crm">
              <strong>CRM Central</strong>
              <span>Cliente Sincronizado</span>
            </div>
            <div class="flow-line" id="line-2"></div>
            <div class="flow-node" id="node-invoice">
              <strong>PDF Invoice</strong>
              <span>Factura Enviada</span>
            </div>
            <div class="flow-line" id="line-3"></div>
            <div class="flow-node" id="node-erp">
              <strong>ERP Despacho</strong>
              <span>Orden Generada</span>
            </div>
          </div>
        </div>
      </main>

      <!-- Cart Drawer -->
      <div class="cart-sidebar ${state.isCartOpen ? 'open' : ''}" id="cartSidebar">
        <div class="cart-header">
          <h2>Tu Selección</h2>
          <button class="close-cart-btn" id="closeCart">✕</button>
        </div>
        <div class="cart-items-list" id="cartItemsList">
          ${renderCartItems()}
        </div>
        <div class="cart-footer">
          <div class="cart-total-row">
            <label>Total</label>
            <span id="cart-total">$ ${cartTotal.toLocaleString('es-AR')}</span>
          </div>
          <button class="checkout-btn" id="btnCheckout" ${state.cart.length === 0 ? 'disabled' : ''}>Proceder al Pago</button>
        </div>
      </div>

      <div class="overlay ${state.isCartOpen ? 'show' : ''}" id="cartOverlay"></div>

      <!-- Stripe Modal simulator -->
      <div class="modal-overlay" id="stripeModal">
        <div class="stripe-modal">
          <h3>
            Stripe Checkout
            <span class="stripe-logo-badge">Secure</span>
          </h3>
          <button class="close-modal-btn" id="closeModal" style="position:absolute; top:30px; right:30px;">✕</button>

          <!-- Live Card display -->
          <div class="payment-card">
            <div class="card-top-row">
              <div class="card-chip"></div>
              <div class="card-brand-logo" id="cardBrand">VISA</div>
            </div>
            <div class="card-number-display" id="cardNumDisplay">•••• •••• •••• ••••</div>
            <div class="card-bottom-row">
              <div class="card-holder-group">
                <span class="card-label">Titular</span>
                <span class="card-val" id="cardNameDisplay">Nombre Completo</span>
              </div>
              <div class="card-expiry-group">
                <span class="card-label">Expira</span>
                <span class="card-val" id="cardExpiryDisplay">MM/AA</span>
              </div>
            </div>
          </div>

          <!-- Checkout Form -->
          <form class="checkout-form" id="stripeForm">
            <div class="form-group">
              <label for="stripeEmail">Correo Electrónico</label>
              <input type="email" class="form-input" id="stripeEmail" required placeholder="correo@ejemplo.com">
            </div>
            <div class="form-group">
              <label for="stripeCardName">Nombre en la Tarjeta</label>
              <input type="text" class="form-input" id="stripeCardName" required placeholder="JUAN PEREZ">
            </div>
            <div class="form-group">
              <label for="stripeCardNum">Número de Tarjeta</label>
              <input type="text" class="form-input" id="stripeCardNum" required placeholder="4000 1234 5678 9010" maxlength="19">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="stripeExpiry">Vencimiento</label>
                <input type="text" class="form-input" id="stripeExpiry" required placeholder="MM/AA" maxlength="5">
              </div>
              <div class="form-group">
                <label for="stripeCvv">CVC / CVV</label>
                <input type="password" class="form-input" id="stripeCvv" required placeholder="•••" maxlength="4">
              </div>
            </div>
            <button type="submit" class="pay-submit-btn" id="paySubmitBtn">Pagar $ ${cartTotal.toLocaleString('es-AR')}</button>
          </form>
        </div>
      </div>
    `;

    bindEvents();
  }

  // ==================== CART HELPERS ====================
  function getCartTotal() {
    return state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  function getCartCount() {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  }

  function renderCartItems() {
    if (state.cart.length === 0) {
      return `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <p>Tu carrito está vacío</p>
        </div>
      `;
    }

    return state.cart.map(item => `
      <div class="cart-item-row">
        <div class="cart-item-info">
          <h4>${item.product.name}</h4>
          <span>$ ${(item.product.price * item.quantity).toLocaleString('es-AR')}</span>
        </div>
        <div class="cart-item-controls">
          <button class="cart-qty-btn qty-minus" data-id="${item.product.id}">−</button>
          <span class="cart-qty-value">${item.quantity}</span>
          <button class="cart-qty-btn qty-plus" data-id="${item.product.id}">+</button>
        </div>
      </div>
    `).join('');
  }

  // ==================== INTERACTION BINDING ====================
  function bindEvents() {
    // Add to cart buttons
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const product = state.products.find(p => p.id === id);
        if (product) {
          addToCart(product);
        }
      });
    });

    // Cart Qty buttons
    document.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        updateQty(id, 1);
      });
    });

    document.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        updateQty(id, -1);
      });
    });

    // Toggle drawer
    const toggle = document.getElementById('cartToggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        state.isCartOpen = !state.isCartOpen;
        render();
      });
    }

    const closeCart = document.getElementById('closeCart');
    if (closeCart) {
      closeCart.addEventListener('click', () => {
        state.isCartOpen = false;
        render();
      });
    }

    const overlay = document.getElementById('cartOverlay');
    if (overlay) {
      overlay.addEventListener('click', () => {
        state.isCartOpen = false;
        render();
      });
    }

    // Scroll to Catalog
    const btnExplore = document.getElementById('btnExplore');
    if (btnExplore) {
      btnExplore.addEventListener('click', () => {
        const catalog = document.getElementById('catalogSection');
        if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Demo Context Close
    const demoClose = document.querySelector('.demo-close');
    if (demoClose) {
      demoClose.addEventListener('click', () => {
        const box = document.querySelector('.demo-context');
        if (box) box.remove();
      });
    }

    // Checkout modal open
    const btnCheckout = document.getElementById('btnCheckout');
    if (btnCheckout) {
      btnCheckout.addEventListener('click', () => {
        if (state.cart.length === 0) return;
        state.isCartOpen = false;
        const modal = document.getElementById('stripeModal');
        if (modal) {
          modal.classList.add('show');
          animateFormAutofill();
        }
      });
    }

    // Close modal
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
      closeModal.addEventListener('click', () => {
        const modal = document.getElementById('stripeModal');
        if (modal) modal.classList.remove('show');
      });
    }

    // Card Input formatter & mirror
    const cardNumInput = document.getElementById('stripeCardNum');
    if (cardNumInput) {
      cardNumInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formatted = '';
        for (let i = 0; i < val.length; i++) {
          if (i > 0 && i % 4 === 0) formatted += ' ';
          formatted += val[i];
        }
        e.target.value = formatted;

        const display = document.getElementById('cardNumDisplay');
        if (display) display.innerText = formatted || '•••• •••• •••• ••••';

        // Detect Brand
        const brand = document.getElementById('cardBrand');
        if (brand) {
          if (val.startsWith('4')) brand.innerText = 'VISA';
          else if (val.startsWith('5')) brand.innerText = 'MASTERCARD';
          else if (val.startsWith('3')) brand.innerText = 'AMEX';
          else brand.innerText = 'CARD';
        }
      });
    }

    const cardNameInput = document.getElementById('stripeCardName');
    if (cardNameInput) {
      cardNameInput.addEventListener('input', (e) => {
        const display = document.getElementById('cardNameDisplay');
        if (display) display.innerText = e.target.value.toUpperCase() || 'Nombre Completo';
      });
    }

    const cardExpiryInput = document.getElementById('stripeExpiry');
    if (cardExpiryInput) {
      cardExpiryInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\//g, '').replace(/[^0-9]/gi, '');
        let formatted = val;
        if (val.length >= 2) {
          formatted = val.slice(0, 2) + '/' + val.slice(2, 4);
        }
        e.target.value = formatted;

        const display = document.getElementById('cardExpiryDisplay');
        if (display) display.innerText = formatted || 'MM/AA';
      });
    }

    // Form Submit (Stripe Process)
    const stripeForm = document.getElementById('stripeForm');
    if (stripeForm) {
      stripeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        processStripePayment();
      });
    }
  }

  // ==================== ACTIONS ====================
  function addToCart(product) {
    const existing = state.cart.find(item => item.product.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      state.cart.push({ product, quantity: 1 });
    }
    state.isCartOpen = true;
    showToast(`Añadido al carrito: ${product.name}`, 'success');
    render();
  }

  function updateQty(id, delta) {
    const existing = state.cart.find(item => item.product.id === id);
    if (existing) {
      existing.quantity += delta;
      if (existing.quantity <= 0) {
        state.cart = state.cart.filter(item => item.product.id !== id);
      }
      render();
    }
  }

  function processStripePayment() {
    const btn = document.getElementById('paySubmitBtn');
    if (btn) {
      btn.innerText = 'Procesando pago encriptado...';
      btn.disabled = true;
    }

    setTimeout(() => {
      // Close Stripe Modal
      const modal = document.getElementById('stripeModal');
      if (modal) modal.classList.remove('show');

      showToast('Pago procesado con Stripe correctamente', 'success');

      // Empty Cart in State
      state.cart = [];
      render();

      // Trigger Webhook Flow Banner Visualisation
      triggerWebhookAnimation();
    }, 2500);
  }

  // ==================== AUTOFILL ANIMATION ====================
  function animateFormAutofill() {
    const emailField = document.getElementById('stripeEmail');
    const nameField = document.getElementById('stripeCardName');
    const numField = document.getElementById('stripeCardNum');
    const expiryField = document.getElementById('stripeExpiry');
    const cvvField = document.getElementById('stripeCvv');

    if (!emailField || !nameField || !numField || !expiryField || !cvvField) return;

    // Reset values first
    emailField.value = '';
    nameField.value = '';
    numField.value = '';
    expiryField.value = '';
    cvvField.value = '';

    // Trigger inputs to reset visual card preview
    emailField.dispatchEvent(new Event('input'));
    nameField.dispatchEvent(new Event('input'));
    numField.dispatchEvent(new Event('input'));
    expiryField.dispatchEvent(new Event('input'));
    cvvField.dispatchEvent(new Event('input'));

    const fieldsToFill = [
      { element: emailField, text: 'distribuidora.nordeste@gmail.com' },
      { element: nameField, text: 'GASTON PEREYRA' },
      { element: numField, text: '4000123456789010' },
      { element: expiryField, text: '1229' },
      { element: cvvField, text: '327' }
    ];

    let fieldIdx = 0;
    let charIdx = 0;

    function typeNextChar() {
      const modal = document.getElementById('stripeModal');
      if (!modal || !modal.classList.contains('show')) return;

      if (fieldIdx >= fieldsToFill.length) {
        return;
      }

      const current = fieldsToFill[fieldIdx];
      const targetText = current.text;

      if (charIdx < targetText.length) {
        current.element.value += targetText[charIdx];
        charIdx++;
        current.element.dispatchEvent(new Event('input'));
        
        const delay = Math.floor(Math.random() * 30) + 20;
        setTimeout(typeNextChar, delay);
      } else {
        fieldIdx++;
        charIdx = 0;
        setTimeout(typeNextChar, 180);
      }
    }

    setTimeout(typeNextChar, 600);
  }

  // ==================== WEBHOOK ANIMATION ENGINE ====================
  function triggerWebhookAnimation() {
    const banner = document.getElementById('webhookBanner');
    if (!banner) return;

    banner.classList.add('show');
    banner.scrollIntoView({ behavior: 'smooth' });

    const timeline = [
      { id: 'node-stripe', type: 'node', delay: 400 },
      { id: 'line-1', type: 'line', delay: 1400 },
      { id: 'node-crm', type: 'node', delay: 2400 },
      { id: 'line-2', type: 'line', delay: 3200 },
      { id: 'node-invoice', type: 'node', delay: 4200 },
      { id: 'line-3', type: 'line', delay: 5000 },
      { id: 'node-erp', type: 'node', delay: 6000 }
    ];

    timeline.forEach(step => {
      setTimeout(() => {
        const el = document.getElementById(step.id);
        if (el) {
          el.classList.add('active');
          if (step.type === 'node') {
            const labels = {
              'node-stripe': 'Webhook de cobro recibido por DSSD',
              'node-crm': 'Cliente mayorista registrado en CRM',
              'node-invoice': 'Factura generada y enviada a email',
              'node-erp': 'Orden de despacho y entrega programada en ERP'
            };
            if (labels[step.id]) {
              showToast(labels[step.id], 'success');
            }
          }
        }
      }, step.delay);
    });
  }

  // ==================== INITIALIZATION ====================
  render();

})();
