/* ========================================================
   SysMayorista — Interactive Dashboard Application
   DSSD © 2026 — Demostración de IA y Automatización
   ======================================================== */
(function () {
  'use strict';

  // ==================== DATA STORE ====================
  const state = {
    currentTab: 'dashboard',
    orderFilter: 'todos',
    searchProducts: '',
    searchOrders: '',
    nextOrderId: 1051,
    metrics: {
      sales: 1250000,
      pendingOrders: 34,
      newClients: 12,
      avgTicket: 285000
    },
    products: [
      { id: 1, name: 'Cerveza Premium Lager', sku: 'CPL-001', price: 2500, stock: 450, category: 'Cervezas', minStock: 100 },
      { id: 2, name: 'Agua Mineral 1.5L', sku: 'AM-002', price: 800, stock: 1200, category: 'Aguas', minStock: 200 },
      { id: 3, name: 'Gaseosa Cola 2.25L', sku: 'GC-003', price: 1500, stock: 85, category: 'Gaseosas', minStock: 100 },
      { id: 4, name: 'Vino Malbec Reserva', sku: 'VMR-004', price: 8500, stock: 32, category: 'Vinos', minStock: 50 },
      { id: 5, name: 'Jugo Natural Naranja 1L', sku: 'JN-005', price: 1800, stock: 620, category: 'Jugos', minStock: 150 },
      { id: 6, name: 'Cerveza IPA Artesanal', sku: 'CIA-006', price: 3200, stock: 15, category: 'Cervezas', minStock: 30 },
      { id: 7, name: 'Energizante 473ml', sku: 'EN-007', price: 2200, stock: 340, category: 'Energizantes', minStock: 80 },
      { id: 8, name: 'Fernet 750ml', sku: 'FN-008', price: 12000, stock: 180, category: 'Licores', minStock: 40 }
    ],
    orders: [
      { id: 1045, client: 'Distribuidora Norte', clientId: 1, amount: 450000, status: 'entregado', date: '2026-05-20', items: 'CPL-001 x200, AM-002 x150' },
      { id: 1046, client: 'Kiosco El Sol', clientId: 2, amount: 25000, status: 'pendiente', date: '2026-05-20', items: 'GC-003 x10, JN-005 x5' },
      { id: 1047, client: 'Supermercado Día', clientId: 3, amount: 780000, status: 'en_camino', date: '2026-05-19', items: 'CPL-001 x100, VMR-004 x30, FN-008 x20' },
      { id: 1048, client: 'Almacén Don Pedro', clientId: 4, amount: 120000, status: 'entregado', date: '2026-05-19', items: 'AM-002 x80, GC-003 x40' },
      { id: 1049, client: 'Mayorista Central', clientId: 5, amount: 1250000, status: 'pendiente', date: '2026-05-18', items: 'CPL-001 x300, EN-007 x150, FN-008 x50' },
      { id: 1050, client: 'Minimarket Express', clientId: 6, amount: 67500, status: 'entregado', date: '2026-05-18', items: 'JN-005 x25, AM-002 x30' }
    ],
    clients: [
      { id: 1, name: 'Distribuidora Norte', contact: 'Carlos Méndez', email: 'carlos@distnorte.com', phone: '+54 11 4567-8901', totalPurchases: 4500000, lastPurchase: '2026-05-20', orders: 45, since: 'Mar 2024', aiScore: 94, aiInsight: 'Cliente VIP con alta recurrencia. Probabilidad de recompra este mes: 94%. Recomendar pack premium de temporada para maximizar ticket.' },
      { id: 2, name: 'Kiosco El Sol', contact: 'María López', email: 'maria@kioscosol.com', phone: '+54 11 2345-6789', totalPurchases: 890000, lastPurchase: '2026-05-20', orders: 12, since: 'Ago 2025', aiScore: 72, aiInsight: 'Compras frecuentes pero de bajo volumen. Oportunidad: ofrecer descuento por volumen (+15 unidades) para aumentar ticket promedio un 40%.' },
      { id: 3, name: 'Supermercado Día', contact: 'Roberto Fernández', email: 'roberto@superdia.com', phone: '+54 11 8765-4321', totalPurchases: 12300000, lastPurchase: '2026-05-19', orders: 89, since: 'Nov 2023', aiScore: 98, aiInsight: 'Cuenta estratégica Top 3. Máxima prioridad de atención. Negociar contrato anual con condiciones preferenciales y envío prioritario.' },
      { id: 4, name: 'Almacén Don Pedro', contact: 'Pedro García', email: 'pedro@almacendp.com', phone: '+54 11 3456-7890', totalPurchases: 2100000, lastPurchase: '2026-05-19', orders: 28, since: 'Jun 2024', aiScore: 81, aiInsight: 'Tendencia de crecimiento sostenido (+15% trimestral). Potencial para convertir en distribuidor zonal. Agendar visita comercial.' },
      { id: 5, name: 'Mayorista Central', contact: 'Ana Rodríguez', email: 'ana@maycentral.com', phone: '+54 11 9876-5432', totalPurchases: 18750000, lastPurchase: '2026-05-18', orders: 156, since: 'Jun 2023', aiScore: 96, aiInsight: 'Principal cliente por volumen. ⚠️ Última compra hace 2 días (habitualmente diaria). Contactar proactivamente para retener cuenta.' },
      { id: 6, name: 'Minimarket Express', contact: 'Laura Sánchez', email: 'laura@miniexpress.com', phone: '+54 11 1234-5678', totalPurchases: 540000, lastPurchase: '2026-05-18', orders: 8, since: 'Nov 2025', aiScore: 58, aiInsight: '⚠️ Alerta: actividad decreciente últimas 2 semanas. Enviar oferta personalizada con 10% de descuento para reactivar compras.' }
    ],
    activities: [
      { text: '<strong>Pedido #1045</strong> entregado a Distribuidora Norte', time: 'Hace 12 min', color: 'green' },
      { text: '<strong>Nuevo pedido #1046</strong> recibido de Kiosco El Sol', time: 'Hace 25 min', color: 'blue' },
      { text: '<strong>Stock bajo</strong> detectado: Cerveza IPA Artesanal (15 u.)', time: 'Hace 1h', color: 'amber' },
      { text: '<strong>Bot IA</strong> procesó 8 consultas de clientes por WhatsApp', time: 'Hace 2h', color: 'purple' },
      { text: '<strong>Pedido #1047</strong> en camino — ETA: 14:30hs', time: 'Hace 3h', color: 'blue' },
      { text: '<strong>Reabastecimiento automático</strong> enviado a proveedor BevCo', time: 'Hace 4h', color: 'green' }
    ]
  };

  // ==================== ICONS (SVG) ====================
  const icons = {
    dashboard: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    products: '<svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    orders: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    clients: '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    reports: '<svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    trendUp: '<svg viewBox="0 0 24 24" width="14" height="14"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    trendDown: '<svg viewBox="0 0 24 24" width="14" height="14"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>'
  };

  // ==================== UTILITIES ====================
  function formatCurrency(n) {
    return '$ ' + n.toLocaleString('es-AR');
  }

  function getStockClass(product) {
    if (product.stock <= product.minStock * 0.4) return 'stock-low';
    if (product.stock <= product.minStock) return 'stock-warning';
    return 'stock-ok';
  }

  function getStockBadge(product) {
    if (product.stock <= product.minStock * 0.4) return '<span class="badge danger">Crítico</span>';
    if (product.stock <= product.minStock) return '<span class="badge pending">Bajo</span>';
    return '<span class="badge success">OK</span>';
  }

  function getStatusBadge(status) {
    const map = {
      entregado: '<span class="badge success">✓ Entregado</span>',
      pendiente: '<span class="badge pending">● Pendiente</span>',
      en_camino: '<span class="badge processing">◎ En Camino</span>',
      cancelado: '<span class="badge danger">✕ Cancelado</span>'
    };
    return map[status] || status;
  }

  function getStatusLabel(status) {
    const map = { entregado: 'Entregado', pendiente: 'Pendiente', en_camino: 'En Camino', cancelado: 'Cancelado' };
    return map[status] || status;
  }

  function getClientTier(total) {
    if (total >= 10000000) return 'tier-platinum';
    if (total >= 2000000) return 'tier-gold';
    return 'tier-silver';
  }

  function getAiScoreClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'mid';
    return 'low';
  }

  function getCurrentTime() {
    return new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  }

  function getCurrentDate() {
    return new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  // ==================== TOAST NOTIFICATIONS ====================
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
    toast.innerHTML = `<span class="toast-icon">${iconMap[type]}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ==================== MAIN RENDER ====================
  function render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="background">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
      <div class="dashboard">
        ${renderSidebar()}
        <main class="main-content">
          ${renderHeader()}
          <div class="page-content" id="pageContent">
            ${renderPage()}
          </div>
        </main>
      </div>
    `;
    bindEvents();
    if (state.currentTab === 'reportes') initCharts();
  }

  // ==================== SIDEBAR ====================
  function renderSidebar() {
    const tabs = [
      { id: 'dashboard', label: 'Dashboard', icon: icons.dashboard },
      { id: 'productos', label: 'Productos', icon: icons.products },
      { id: 'pedidos', label: 'Pedidos', icon: icons.orders },
      { id: 'clientes', label: 'Clientes', icon: icons.clients },
      { id: 'reportes', label: 'Reportes', icon: icons.reports }
    ];
    return `
      <aside class="sidebar glass">
        <div class="sidebar-logo">
          <h2>SysMayorista</h2>
          <div class="logo-sub">Panel de Control</div>
        </div>
        <nav>
          <ul>
            ${tabs.map(t => `
              <li class="${state.currentTab === t.id ? 'active' : ''}" data-tab="${t.id}">
                <span class="nav-icon">${t.icon}</span>
                ${t.label}
              </li>
            `).join('')}
          </ul>
        </nav>
        <div class="sidebar-footer">
          <p>Powered by <strong>DSSD</strong><br>Ecosistemas de IA</p>
        </div>
      </aside>
    `;
  }

  // ==================== HEADER ====================
  function renderHeader() {
    const titles = {
      dashboard: 'Panel de Control',
      productos: 'Gestión de Productos',
      pedidos: 'Gestión de Pedidos',
      clientes: 'CRM — Clientes',
      reportes: 'Reportes e Inteligencia'
    };
    return `
      <header class="header-bar glass">
        <h1>${titles[state.currentTab]}</h1>
        <div class="header-right">
          <span class="header-date">${getCurrentDate()}</span>
          <div class="user-info">
            Admin
            <span class="avatar">A</span>
          </div>
        </div>
      </header>
    `;
  }

  // ==================== PAGE ROUTER ====================
  function renderPage() {
    switch (state.currentTab) {
      case 'dashboard': return renderDashboard();
      case 'productos': return renderProducts();
      case 'pedidos': return renderOrders();
      case 'clientes': return renderClients();
      case 'reportes': return renderReports();
      default: return renderDashboard();
    }
  }

  // ==================== DASHBOARD ====================
  function renderDashboard() {
    const lowStockCount = state.products.filter(p => p.stock <= p.minStock).length;
    return `
      <div class="stats-grid">
        <div class="stat-card glass">
          <div class="stat-icon blue">💰</div>
          <div class="stat-info">
            <h3>Ventas del Día</h3>
            <div class="stat-value" id="salesValue">${formatCurrency(state.metrics.sales)}</div>
            <div class="stat-trend up">${icons.trendUp} +12.5% vs. ayer</div>
          </div>
        </div>
        <div class="stat-card glass">
          <div class="stat-icon amber">📋</div>
          <div class="stat-info">
            <h3>Pedidos Pendientes</h3>
            <div class="stat-value" id="pendingValue">${state.metrics.pendingOrders}</div>
            <div class="stat-trend down">${icons.trendDown} 3 nuevos hoy</div>
          </div>
        </div>
        <div class="stat-card glass">
          <div class="stat-icon green">👥</div>
          <div class="stat-info">
            <h3>Nuevos Clientes</h3>
            <div class="stat-value">${state.metrics.newClients}</div>
            <div class="stat-trend up">${icons.trendUp} +8% este mes</div>
          </div>
        </div>
        <div class="stat-card glass">
          <div class="stat-icon purple">📦</div>
          <div class="stat-info">
            <h3>Alertas de Stock</h3>
            <div class="stat-value">${lowStockCount}</div>
            <div class="stat-trend ${lowStockCount > 2 ? 'down' : 'up'}">${lowStockCount > 2 ? '⚠️' : '✓'} productos bajo mínimo</div>
          </div>
        </div>
      </div>

      <div class="sim-panel glass">
        <div class="sim-panel-header">
          <h2>🤖 Simulador de Automatizaciones</h2>
          <span class="ai-badge">IA Activa</span>
        </div>
        <p>Prueba en tiempo real cómo nuestras automatizaciones operan en producción.</p>
        <div class="sim-buttons">
          <button class="sim-btn" id="simWhatsApp">
            <div class="sim-btn-icon wa">💬</div>
            <div class="sim-btn-text">
              <strong>Pedido por WhatsApp</strong>
              <span>Simular Bot IA procesando un pedido real</span>
            </div>
          </button>
          <button class="sim-btn" id="simRestock">
            <div class="sim-btn-icon restock">📦</div>
            <div class="sim-btn-text">
              <strong>Reabastecimiento IA</strong>
              <span>Detección de bajo stock y orden automática</span>
            </div>
          </button>
          <button class="sim-btn" id="simDispatch">
            <div class="sim-btn-icon dispatch">🚚</div>
            <div class="sim-btn-text">
              <strong>Optimización de Despacho</strong>
              <span>Calcular ruta óptima de entrega con IA</span>
            </div>
          </button>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:16px;">
        <div class="orders-section glass">
          <div class="section-header">
            <h2>Últimos Pedidos</h2>
            <button class="view-all" data-tab="pedidos">Ver todos →</button>
          </div>
          <table class="data-table">
            <thead><tr><th>ID</th><th>Cliente</th><th>Monto</th><th>Estado</th></tr></thead>
            <tbody id="dashOrdersBody">
              ${state.orders.slice(0, 5).map(o => `
                <tr>
                  <td class="order-id">#${o.id}</td>
                  <td class="client-name">${o.client}</td>
                  <td class="amount">${formatCurrency(o.amount)}</td>
                  <td>${getStatusBadge(o.status)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="orders-section glass">
          <div class="section-header">
            <h2>Actividad Reciente</h2>
          </div>
          <ul class="activity-list">
            ${state.activities.map(a => `
              <li class="activity-item">
                <span class="activity-dot ${a.color}"></span>
                <div>
                  <div class="activity-text">${a.text}</div>
                  <div class="activity-time">${a.time}</div>
                </div>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  // ==================== PRODUCTS PAGE ====================
  function renderProducts() {
    const filtered = state.products.filter(p =>
      p.name.toLowerCase().includes(state.searchProducts.toLowerCase()) ||
      p.sku.toLowerCase().includes(state.searchProducts.toLowerCase()) ||
      p.category.toLowerCase().includes(state.searchProducts.toLowerCase())
    );
    return `
      <div class="orders-section glass" style="flex:1;">
        <div class="products-toolbar" style="margin-bottom:16px;">
          <div class="search-box">
            ${icons.search}
            <input type="text" placeholder="Buscar producto, SKU o categoría..." value="${state.searchProducts}" id="searchProducts">
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-outline btn-sm" id="btnExportProducts">📋 Exportar</button>
          </div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>SKU</th>
              <th>Categoría</th>
              <th>Precio Unit.</th>
              <th>Stock</th>
              <th>Estado</th>
              <th style="text-align:center;">Ajustar</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(p => `
              <tr>
                <td class="client-name">${p.name}</td>
                <td class="order-id">${p.sku}</td>
                <td><span class="badge neutral">${p.category}</span></td>
                <td class="amount">${formatCurrency(p.price)}</td>
                <td class="${getStockClass(p)}" style="font-weight:700;">${p.stock} u.</td>
                <td>${getStockBadge(p)}</td>
                <td>
                  <div class="stock-controls" style="justify-content:center;">
                    <button class="btn-icon stock-minus" data-id="${p.id}" title="Reducir stock">−</button>
                    <button class="btn-icon stock-plus" data-id="${p.id}" title="Aumentar stock">+</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ${filtered.length === 0 ? '<p style="text-align:center; color:var(--text-muted); padding:40px;">No se encontraron productos.</p>' : ''}
      </div>
    `;
  }

  // ==================== ORDERS PAGE ====================
  function renderOrders() {
    let filtered = state.orders;
    if (state.orderFilter !== 'todos') {
      filtered = filtered.filter(o => o.status === state.orderFilter);
    }
    if (state.searchOrders) {
      const q = state.searchOrders.toLowerCase();
      filtered = filtered.filter(o =>
        o.client.toLowerCase().includes(q) ||
        String(o.id).includes(q) ||
        o.items.toLowerCase().includes(q)
      );
    }
    const filters = [
      { id: 'todos', label: 'Todos' },
      { id: 'pendiente', label: 'Pendientes' },
      { id: 'en_camino', label: 'En Camino' },
      { id: 'entregado', label: 'Entregados' }
    ];
    return `
      <div class="orders-section glass" style="flex:1;">
        <div class="products-toolbar" style="margin-bottom:16px;">
          <div class="search-box">
            ${icons.search}
            <input type="text" placeholder="Buscar por cliente, ID o producto..." value="${state.searchOrders}" id="searchOrders">
          </div>
          <div class="filters-bar">
            ${filters.map(f => `
              <button class="filter-btn ${state.orderFilter === f.id ? 'active' : ''}" data-filter="${f.id}">${f.label}</button>
            `).join('')}
          </div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(o => `
              <tr>
                <td class="order-id">#${o.id}</td>
                <td class="client-name">${o.client}</td>
                <td style="font-size:0.8rem; color:var(--text-secondary); max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${o.items}">${o.items}</td>
                <td class="amount">${formatCurrency(o.amount)}</td>
                <td style="color:var(--text-muted); font-size:0.82rem;">${o.date}</td>
                <td>${getStatusBadge(o.status)}</td>
                <td>
                  <select class="order-status-select" data-order-id="${o.id}">
                    <option value="pendiente" ${o.status === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="en_camino" ${o.status === 'en_camino' ? 'selected' : ''}>En Camino</option>
                    <option value="entregado" ${o.status === 'entregado' ? 'selected' : ''}>Entregado</option>
                    <option value="cancelado" ${o.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                  </select>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ${filtered.length === 0 ? '<p style="text-align:center; color:var(--text-muted); padding:40px;">No se encontraron pedidos con ese filtro.</p>' : ''}
      </div>
    `;
  }

  // ==================== CLIENTS PAGE ====================
  function renderClients() {
    return `
      <div class="clients-grid">
        ${state.clients.map(c => {
          const tier = getClientTier(c.totalPurchases);
          const scoreClass = getAiScoreClass(c.aiScore);
          const initial = c.name.charAt(0);
          return `
            <div class="client-card glass">
              <div class="client-card-header">
                <div style="display:flex; align-items:center;">
                  <div class="client-avatar ${tier}">${initial}</div>
                  <div class="client-info">
                    <h3>${c.name}</h3>
                    <p>${c.contact} · ${c.phone}</p>
                  </div>
                </div>
                <div class="ai-score ${scoreClass}">
                  <span>🧠</span> ${c.aiScore}%
                </div>
              </div>
              <div class="client-stats">
                <div class="client-stat">
                  <label>Total Compras</label>
                  <span>${formatCurrency(c.totalPurchases)}</span>
                </div>
                <div class="client-stat">
                  <label>Pedidos</label>
                  <span>${c.orders}</span>
                </div>
                <div class="client-stat">
                  <label>Cliente Desde</label>
                  <span>${c.since}</span>
                </div>
                <div class="client-stat">
                  <label>Última Compra</label>
                  <span>${c.lastPurchase}</span>
                </div>
              </div>
              <div class="ai-insight">
                <div class="ai-insight-header">
                  <span>🤖</span> AI Insight — Predicción Automatizada
                </div>
                <p>${c.aiInsight}</p>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // ==================== REPORTS PAGE ====================
  function renderReports() {
    return `
      <div class="charts-grid">
        <div class="chart-card glass">
          <h3>📈 Tendencia de Ventas Mensuales</h3>
          <div class="chart-wrapper"><canvas id="salesChart"></canvas></div>
        </div>
        <div class="chart-card glass">
          <h3>🍩 Distribución por Categoría</h3>
          <div class="chart-wrapper"><canvas id="categoryChart"></canvas></div>
        </div>
      </div>
      <div class="charts-grid">
        <div class="chart-card glass">
          <h3>🏆 Top Clientes por Volumen</h3>
          <div class="chart-wrapper"><canvas id="clientsChart"></canvas></div>
        </div>
        <div class="chart-card glass">
          <h3>📊 Pedidos por Estado</h3>
          <div class="chart-wrapper"><canvas id="ordersStatusChart"></canvas></div>
        </div>
      </div>
      <div class="ai-report-section glass">
        <h3><span>🧠</span> Análisis Ejecutivo con IA <span class="ai-badge" style="font-size:0.6rem;">Auto-Generado</span></h3>
        <button class="btn btn-success btn-sm" id="btnGenerateReport" style="margin-bottom:16px;">⚡ Generar Reporte con IA</button>
        <div class="ai-report-content" id="aiReportContent">
          <span style="color:var(--text-muted);">Presiona el botón para que la IA analice tus datos y genere un reporte ejecutivo completo...</span>
        </div>
      </div>
    `;
  }

  // ==================== CHART.JS INITIALIZATION ====================
  function initCharts() {
    if (typeof Chart === 'undefined') return;

    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.05)';
    Chart.defaults.font.family = "'Inter', sans-serif";

    // Sales Trend
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
      new Chart(salesCtx, {
        type: 'line',
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
          datasets: [{
            label: 'Ventas ($)',
            data: [18500000, 22100000, 19800000, 27400000, 32500000],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              titleColor: '#f1f5f9',
              bodyColor: '#94a3b8',
              borderColor: 'rgba(255,255,255,0.1)',
              borderWidth: 1,
              cornerRadius: 8,
              padding: 12,
              callbacks: {
                label: function(ctx) { return '$ ' + ctx.raw.toLocaleString('es-AR'); }
              }
            }
          },
          scales: {
            y: {
              grid: { color: 'rgba(255,255,255,0.03)' },
              ticks: { callback: v => '$ ' + (v / 1000000).toFixed(1) + 'M' }
            },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // Category Distribution
    const catCtx = document.getElementById('categoryChart');
    if (catCtx) {
      new Chart(catCtx, {
        type: 'doughnut',
        data: {
          labels: ['Cervezas', 'Gaseosas', 'Aguas', 'Vinos', 'Jugos', 'Energizantes', 'Licores'],
          datasets: [{
            data: [35, 18, 15, 12, 10, 5, 5],
            backgroundColor: [
              '#3b82f6', '#f59e0b', '#06b6d4', '#8b5cf6', '#10b981', '#ef4444', '#ec4899'
            ],
            borderColor: 'rgba(15, 23, 42, 0.8)',
            borderWidth: 3,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'right',
              labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 12 } }
            },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              titleColor: '#f1f5f9',
              bodyColor: '#94a3b8',
              borderColor: 'rgba(255,255,255,0.1)',
              borderWidth: 1,
              cornerRadius: 8,
              padding: 12,
              callbacks: {
                label: function(ctx) { return ctx.label + ': ' + ctx.raw + '%'; }
              }
            }
          }
        }
      });
    }

    // Top Clients Bar
    const cliCtx = document.getElementById('clientsChart');
    if (cliCtx) {
      const sortedClients = [...state.clients].sort((a, b) => b.totalPurchases - a.totalPurchases).slice(0, 5);
      new Chart(cliCtx, {
        type: 'bar',
        data: {
          labels: sortedClients.map(c => c.name.split(' ').slice(0, 2).join(' ')),
          datasets: [{
            label: 'Total Compras ($)',
            data: sortedClients.map(c => c.totalPurchases),
            backgroundColor: [
              'rgba(59, 130, 246, 0.7)',
              'rgba(139, 92, 246, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(6, 182, 212, 0.7)'
            ],
            borderRadius: 6,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              titleColor: '#f1f5f9',
              bodyColor: '#94a3b8',
              borderColor: 'rgba(255,255,255,0.1)',
              borderWidth: 1,
              cornerRadius: 8,
              padding: 12,
              callbacks: {
                label: function(ctx) { return '$ ' + ctx.raw.toLocaleString('es-AR'); }
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.03)' },
              ticks: { callback: v => '$ ' + (v / 1000000).toFixed(1) + 'M' }
            },
            y: { grid: { display: false } }
          }
        }
      });
    }

    // Orders Status
    const ordCtx = document.getElementById('ordersStatusChart');
    if (ordCtx) {
      const counts = {
        entregado: state.orders.filter(o => o.status === 'entregado').length,
        pendiente: state.orders.filter(o => o.status === 'pendiente').length,
        en_camino: state.orders.filter(o => o.status === 'en_camino').length
      };
      new Chart(ordCtx, {
        type: 'doughnut',
        data: {
          labels: ['Entregados', 'Pendientes', 'En Camino'],
          datasets: [{
            data: [counts.entregado, counts.pendiente, counts.en_camino],
            backgroundColor: ['#10b981', '#f59e0b', '#3b82f6'],
            borderColor: 'rgba(15, 23, 42, 0.8)',
            borderWidth: 3,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'right',
              labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 12 } }
            },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              titleColor: '#f1f5f9',
              bodyColor: '#94a3b8',
              borderColor: 'rgba(255,255,255,0.1)',
              borderWidth: 1,
              cornerRadius: 8,
              padding: 12
            }
          }
        }
      });
    }
  }

  // ==================== WHATSAPP SIMULATION ====================
  function simulateWhatsApp() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="wa-chat">
        <div class="wa-header">
          <div class="wa-header-avatar">🤖</div>
          <div class="wa-header-info">
            <h4>SysMayorista Bot</h4>
            <span>en línea</span>
          </div>
          <button class="wa-close" id="waClose">✕</button>
        </div>
        <div class="wa-messages" id="waMessages"></div>
        <div class="wa-footer">
          <span>Simulación automática en progreso...</span>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('#waClose').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    const msgs = document.getElementById('waMessages');
    const time = getCurrentTime();

    const conversation = [
      { type: 'client', text: 'Hola, necesito hacer un pedido para hoy 🙏', delay: 800 },
      { type: 'typing', delay: 1200 },
      { type: 'bot', text: '¡Hola! 👋 Soy el asistente virtual de SysMayorista. Con gusto te ayudo con tu pedido.\n\n¿Qué productos necesitás y en qué cantidad?', delay: 300 },
      { type: 'client', text: 'Necesito 50 cajas de Cerveza Premium y 30 de Agua Mineral 1.5L', delay: 2000 },
      { type: 'typing', delay: 1800 },
      { type: 'bot', text: '📊 Consultando stock en tiempo real...\n\n✅ Cerveza Premium Lager: 450 u. disponibles\n✅ Agua Mineral 1.5L: 1200 u. disponibles\n\nAmbos productos están disponibles.', delay: 300 },
      { type: 'typing', delay: 1200 },
      { type: 'bot', text: '💰 Cotización automática:\n\n• Cerveza Premium x50 = $125,000\n• Agua Mineral x30 = $24,000\n━━━━━━━━━━━━━━━\n📌 Total: $149,000\n\n¿Confirmo el pedido?', delay: 300 },
      { type: 'client', text: 'Sí, confirmado! 👍', delay: 2200 },
      { type: 'typing', delay: 1500 },
      { type: 'bot', text: '✅ ¡Pedido #' + state.nextOrderId + ' registrado exitosamente!\n\n📦 Entrega estimada: 24-48hs\n📍 Se notificó al equipo de despacho\n\n¿Necesitás algo más?', delay: 300 },
      { type: 'client', text: 'No, eso es todo. Gracias! 😊', delay: 1800 },
      { type: 'typing', delay: 800 },
      { type: 'bot', text: '¡Gracias por tu pedido! 🙌\n\nRecibirás una notificación cuando tu pedido esté en camino. ¡Buen día!', delay: 300 }
    ];

    let totalDelay = 500;
    conversation.forEach((msg) => {
      totalDelay += msg.delay;
      setTimeout(() => {
        if (!document.body.contains(msgs)) return;
        // Remove previous typing indicator
        const oldTyping = msgs.querySelector('.wa-typing');
        if (oldTyping) oldTyping.remove();

        if (msg.type === 'typing') {
          msgs.innerHTML += '<div class="wa-typing"><span></span><span></span><span></span></div>';
        } else {
          const div = document.createElement('div');
          div.className = `wa-message ${msg.type}`;
          div.innerHTML = `${msg.text.replace(/\n/g, '<br>')}<div class="msg-time">${time}</div>`;
          msgs.appendChild(div);
        }
        msgs.scrollTop = msgs.scrollHeight;
      }, totalDelay);
    });

    // After conversation ends, create the order
    setTimeout(() => {
      if (!document.body.contains(overlay)) return;
      const newOrder = {
        id: state.nextOrderId,
        client: 'Distribuidora Norte',
        clientId: 1,
        amount: 149000,
        status: 'pendiente',
        date: new Date().toISOString().split('T')[0],
        items: 'CPL-001 x50, AM-002 x30'
      };
      state.orders.unshift(newOrder);
      state.nextOrderId++;
      state.metrics.sales += 149000;
      state.metrics.pendingOrders += 1;

      // Update stock
      const beer = state.products.find(p => p.sku === 'CPL-001');
      const water = state.products.find(p => p.sku === 'AM-002');
      if (beer) beer.stock -= 50;
      if (water) water.stock -= 30;

      state.activities.unshift({
        text: `<strong>Bot IA</strong> procesó pedido #${newOrder.id} — ${formatCurrency(newOrder.amount)}`,
        time: 'Ahora',
        color: 'green'
      });

      showToast(`Pedido #${newOrder.id} creado por Bot IA — ${formatCurrency(newOrder.amount)}`, 'success');
    }, totalDelay + 1000);
  }

  // ==================== RESTOCK SIMULATION ====================
  function simulateRestock() {
    const lowStock = state.products.filter(p => p.stock <= p.minStock);

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="sim-modal glass-strong">
        <h3>📦 Reabastecimiento Automatizado <button class="sim-close" id="simRestockClose">✕</button></h3>
        <div id="restockSteps"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('#simRestockClose').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    const stepsEl = document.getElementById('restockSteps');

    // Step 1: Scanning
    setTimeout(() => {
      if (!document.body.contains(stepsEl)) return;
      stepsEl.innerHTML = `
        <div class="sim-step">
          <div class="sim-step-icon loading">🔍</div>
          <div class="sim-step-content">
            <h4>Escaneando inventario completo...</h4>
            <p>Analizando ${state.products.length} productos en base de datos</p>
            <div class="progress-bar-container"><div class="progress-bar-fill" style="width:0%"></div></div>
          </div>
        </div>
      `;
      setTimeout(() => {
        const bar = stepsEl.querySelector('.progress-bar-fill');
        if (bar) bar.style.width = '100%';
      }, 100);
    }, 400);

    // Step 2: Detection
    setTimeout(() => {
      if (!document.body.contains(stepsEl)) return;
      stepsEl.innerHTML += `
        <div class="sim-step">
          <div class="sim-step-icon warning">⚠️</div>
          <div class="sim-step-content">
            <h4>${lowStock.length} producto${lowStock.length !== 1 ? 's' : ''} con stock bajo detectado${lowStock.length !== 1 ? 's' : ''}</h4>
            <p>${lowStock.map(p => `<strong>${p.name}</strong>: ${p.stock} u. (mín: ${p.minStock})`).join('<br>')}</p>
          </div>
        </div>
      `;
    }, 2200);

    // Step 3: Generating order
    setTimeout(() => {
      if (!document.body.contains(stepsEl)) return;
      stepsEl.innerHTML += `
        <div class="sim-step">
          <div class="sim-step-icon loading">📝</div>
          <div class="sim-step-content">
            <h4>Generando orden de compra automática...</h4>
            <p>IA calculando cantidades óptimas de reabastecimiento</p>
            <div class="progress-bar-container"><div class="progress-bar-fill" id="restockBar2" style="width:0%"></div></div>
          </div>
        </div>
      `;
      setTimeout(() => {
        const bar = document.getElementById('restockBar2');
        if (bar) bar.style.width = '100%';
      }, 100);
    }, 3800);

    // Step 4: Email preview
    setTimeout(() => {
      if (!document.body.contains(stepsEl)) return;
      const orderLines = lowStock.map(p => {
        const qty = p.minStock * 3;
        return `  • ${p.name} (${p.sku}) — Cantidad: ${qty} u.`;
      }).join('\n');
      const total = lowStock.reduce((s, p) => s + p.price * p.minStock * 3, 0);

      stepsEl.innerHTML += `
        <div class="sim-step">
          <div class="sim-step-icon loading">📧</div>
          <div class="sim-step-content">
            <h4>Borrador de email al proveedor</h4>
            <div class="email-preview">
<strong>Para:</strong> compras@bevco-proveedores.com.ar
<strong>Asunto:</strong> Orden de Compra Automática #OC-${Date.now().toString().slice(-6)}

Estimados,

Por medio del sistema automatizado de SysMayorista, solicitamos el siguiente reabastecimiento:

${orderLines}

<strong>Total estimado: ${formatCurrency(total)}</strong>

Solicitamos entrega en las próximas 48hs hábiles.

Atentamente,
SysMayorista — Sistema Automatizado
            </div>
          </div>
        </div>
      `;
    }, 5500);

    // Step 5: Confirmation
    setTimeout(() => {
      if (!document.body.contains(stepsEl)) return;
      stepsEl.innerHTML += `
        <div class="sim-step">
          <div class="sim-step-icon success">✅</div>
          <div class="sim-step-content">
            <h4>Orden de compra enviada exitosamente</h4>
            <p>El proveedor BevCo ha sido notificado. Entrega estimada: 48hs hábiles. El stock se actualizará automáticamente al recibir la mercadería.</p>
          </div>
        </div>
      `;

      state.activities.unshift({
        text: '<strong>Reabastecimiento automático</strong> enviado a proveedor BevCo',
        time: 'Ahora',
        color: 'green'
      });
      showToast('Orden de reabastecimiento enviada al proveedor', 'success');
    }, 7200);
  }

  // ==================== DISPATCH SIMULATION ====================
  function simulateDispatch() {
    const pendingDeliveries = state.orders.filter(o => o.status === 'en_camino' || o.status === 'pendiente');

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="sim-modal glass-strong">
        <h3>🚚 Optimización de Despacho IA <button class="sim-close" id="simDispatchClose">✕</button></h3>
        <div id="dispatchSteps"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('#simDispatchClose').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    const stepsEl = document.getElementById('dispatchSteps');

    // Step 1: Analyzing
    setTimeout(() => {
      if (!document.body.contains(stepsEl)) return;
      stepsEl.innerHTML = `
        <div class="sim-step">
          <div class="sim-step-icon loading">📡</div>
          <div class="sim-step-content">
            <h4>Analizando ${pendingDeliveries.length} entregas pendientes...</h4>
            <p>Recopilando ubicaciones y ventanas horarias de entrega</p>
            <div class="progress-bar-container"><div class="progress-bar-fill" style="width:0%"></div></div>
          </div>
        </div>
      `;
      setTimeout(() => {
        const bar = stepsEl.querySelector('.progress-bar-fill');
        if (bar) bar.style.width = '100%';
      }, 100);
    }, 400);

    // Step 2: Route calculation
    setTimeout(() => {
      if (!document.body.contains(stepsEl)) return;
      stepsEl.innerHTML += `
        <div class="sim-step">
          <div class="sim-step-icon loading">🧮</div>
          <div class="sim-step-content">
            <h4>Calculando ruta óptima con algoritmo IA...</h4>
            <p>Procesando ${pendingDeliveries.length} puntos de entrega, tráfico en tiempo real y prioridades de cliente</p>
            <div class="progress-bar-container"><div class="progress-bar-fill" id="dispatchBar" style="width:0%"></div></div>
          </div>
        </div>
      `;
      setTimeout(() => {
        const bar = document.getElementById('dispatchBar');
        if (bar) bar.style.width = '100%';
      }, 100);
    }, 2400);

    // Step 3: Optimized route
    setTimeout(() => {
      if (!document.body.contains(stepsEl)) return;
      const stops = [
        { name: 'Depósito Central', addr: 'Av. Industria 1500, CABA', type: 'start' },
        ...pendingDeliveries.map(o => ({ name: o.client, addr: 'Zona ' + (o.clientId <= 3 ? 'Norte' : 'Sur') + ', GBA', type: '' })),
        { name: 'Depósito Central', addr: 'Retorno', type: 'end' }
      ];

      stepsEl.innerHTML += `
        <div class="sim-step">
          <div class="sim-step-icon success">🗺️</div>
          <div class="sim-step-content">
            <h4>Ruta optimizada generada</h4>
            <div class="route-visual">
              ${stops.map((s, i) => `
                <div class="route-stop">
                  <div class="route-dot ${s.type}"></div>
                  <div>
                    <strong>${s.name}</strong>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${s.addr}</div>
                  </div>
                </div>
                ${i < stops.length - 1 ? '<div class="route-line"></div>' : ''}
              `).join('')}
              <div class="route-savings">
                <div class="route-saving-item">
                  <label>Tiempo Original</label>
                  <span style="color:var(--text-muted); text-decoration:line-through;">4.5 hs</span>
                </div>
                <div class="route-saving-item">
                  <label>Tiempo Optimizado</label>
                  <span>2.8 hs</span>
                </div>
                <div class="route-saving-item">
                  <label>Ahorro</label>
                  <span>-38%</span>
                </div>
                <div class="route-saving-item">
                  <label>Combustible</label>
                  <span>-$12,400</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      state.activities.unshift({
        text: '<strong>Ruta optimizada</strong> generada — Ahorro de 38% en tiempo de entrega',
        time: 'Ahora',
        color: 'purple'
      });
      showToast('Ruta de despacho optimizada — Ahorro del 38% en tiempo', 'success');
    }, 4800);
  }

  // ==================== AI REPORT GENERATOR ====================
  function generateAIReport() {
    const content = document.getElementById('aiReportContent');
    if (!content) return;

    const totalSales = state.orders.reduce((s, o) => s + o.amount, 0);
    const avgTicket = Math.round(totalSales / state.orders.length);
    const topClient = [...state.clients].sort((a, b) => b.totalPurchases - a.totalPurchases)[0];
    const lowStock = state.products.filter(p => p.stock <= p.minStock);
    const topCategory = 'Cervezas';

    const report = `📊 ANÁLISIS EJECUTIVO — Mayo 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 RESUMEN FINANCIERO
Ventas acumuladas del mes: ${formatCurrency(totalSales)}
Variación vs. mes anterior: +12.5% ✅
Ticket promedio por pedido: ${formatCurrency(avgTicket)}
Total pedidos procesados: ${state.orders.length}

🏆 TOP CLIENTE
${topClient.name} — ${formatCurrency(topClient.totalPurchases)} acumulados
Score IA: ${topClient.aiScore}% | ${topClient.orders} pedidos realizados

📦 ALERTAS DE INVENTARIO
${lowStock.length} producto${lowStock.length !== 1 ? 's' : ''} por debajo del stock mínimo:
${lowStock.map(p => `  ⚠️ ${p.name}: ${p.stock}u. (mín: ${p.minStock}u.)`).join('\n')}

🍺 SEGMENTO LÍDER
${topCategory} lidera con 35% de las ventas totales.
Tendencia: Crecimiento del 23% en categoría artesanal.

💡 RECOMENDACIONES IA
1. Incrementar stock de Cerveza IPA Artesanal — demanda creciente detectada
2. Contactar a Mayorista Central — patrón de compra irregular detectado
3. Ofrecer descuento por volumen a Kiosco El Sol — potencial de crecimiento
4. Negociar contrato anual con Supermercado Día — cuenta estratégica Top 3

🔮 PREDICCIÓN PRÓXIMOS 30 DÍAS
Ventas estimadas: ${formatCurrency(Math.round(totalSales * 1.15))}
Confianza del modelo: 91%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generado automáticamente por DSSD AI Engine v2.1`;

    // Typewriter effect
    content.innerHTML = '<span class="typing-cursor"></span>';
    let index = 0;
    const speed = 8;

    function typeChar() {
      if (index < report.length) {
        const cursor = content.querySelector('.typing-cursor');
        const textNode = document.createTextNode(report.charAt(index));
        if (cursor) {
          content.insertBefore(textNode, cursor);
        } else {
          content.appendChild(textNode);
        }
        index++;
        content.scrollTop = content.scrollHeight;
        setTimeout(typeChar, report.charAt(index - 1) === '\n' ? speed * 4 : speed);
      } else {
        const cursor = content.querySelector('.typing-cursor');
        if (cursor) cursor.remove();
        showToast('Reporte ejecutivo generado con IA exitosamente', 'success');
      }
    }
    typeChar();
  }

  // ==================== EVENT BINDING ====================
  function bindEvents() {
    // Tab Navigation
    document.querySelectorAll('[data-tab]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = el.getAttribute('data-tab');
        if (tab !== state.currentTab) {
          state.currentTab = tab;
          render();
        }
      });
    });

    // Product Search
    const searchProd = document.getElementById('searchProducts');
    if (searchProd) {
      searchProd.addEventListener('input', (e) => {
        state.searchProducts = e.target.value;
        const content = document.getElementById('pageContent');
        if (content) {
          content.innerHTML = renderProducts();
          bindProductEvents();
        }
      });
    }

    // Order Search
    const searchOrd = document.getElementById('searchOrders');
    if (searchOrd) {
      searchOrd.addEventListener('input', (e) => {
        state.searchOrders = e.target.value;
        const content = document.getElementById('pageContent');
        if (content) {
          content.innerHTML = renderOrders();
          bindOrderEvents();
        }
      });
    }

    // Simulation Buttons
    const simWA = document.getElementById('simWhatsApp');
    if (simWA) simWA.addEventListener('click', simulateWhatsApp);

    const simRestock = document.getElementById('simRestock');
    if (simRestock) simRestock.addEventListener('click', simulateRestock);

    const simDispatch = document.getElementById('simDispatch');
    if (simDispatch) simDispatch.addEventListener('click', simulateDispatch);

    // AI Report
    const btnReport = document.getElementById('btnGenerateReport');
    if (btnReport) btnReport.addEventListener('click', generateAIReport);

    // Export Products
    const btnExport = document.getElementById('btnExportProducts');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        showToast('Exportación de productos iniciada — Archivo CSV generado', 'info');
      });
    }

    bindProductEvents();
    bindOrderEvents();
  }

  function bindProductEvents() {
    // Stock controls
    document.querySelectorAll('.stock-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const product = state.products.find(p => p.id === id);
        if (product) {
          product.stock += 10;
          showToast(`+10 unidades añadidas a ${product.name}`, 'info');
          const content = document.getElementById('pageContent');
          if (content) {
            content.innerHTML = renderProducts();
            bindProductEvents();
          }
        }
      });
    });

    document.querySelectorAll('.stock-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const product = state.products.find(p => p.id === id);
        if (product && product.stock >= 10) {
          product.stock -= 10;
          if (product.stock <= product.minStock) {
            showToast(`⚠️ Stock bajo en ${product.name}: ${product.stock} unidades`, 'warning');
          } else {
            showToast(`-10 unidades de ${product.name}`, 'info');
          }
          const content = document.getElementById('pageContent');
          if (content) {
            content.innerHTML = renderProducts();
            bindProductEvents();
          }
        }
      });
    });
  }

  function bindOrderEvents() {
    // Order filters
    document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.orderFilter = btn.getAttribute('data-filter');
        const content = document.getElementById('pageContent');
        if (content) {
          content.innerHTML = renderOrders();
          bindOrderEvents();
        }
      });
    });

    // Order status change
    document.querySelectorAll('.order-status-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const orderId = parseInt(select.getAttribute('data-order-id'));
        const order = state.orders.find(o => o.id === orderId);
        if (order) {
          const oldStatus = order.status;
          order.status = e.target.value;
          showToast(`Pedido #${orderId}: ${getStatusLabel(oldStatus)} → ${getStatusLabel(order.status)}`, 'success');

          state.activities.unshift({
            text: `<strong>Pedido #${orderId}</strong> actualizado a <strong>${getStatusLabel(order.status)}</strong>`,
            time: 'Ahora',
            color: order.status === 'entregado' ? 'green' : order.status === 'en_camino' ? 'blue' : 'amber'
          });

          const content = document.getElementById('pageContent');
          if (content) {
            content.innerHTML = renderOrders();
            bindOrderEvents();
          }
        }
      });
    });
  }

  // ==================== DEMO CONTEXT BOX ====================
  function initDemoContext() {
    const ctx = document.querySelector('.demo-context');
    if (ctx) {
      const closeBtn = ctx.querySelector('.demo-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          ctx.style.animation = 'slideInRight 0.3s ease reverse forwards';
          setTimeout(() => ctx.remove(), 300);
        });
      }
    }
  }

  // ==================== INITIALIZATION ====================
  render();
  initDemoContext();

})();
