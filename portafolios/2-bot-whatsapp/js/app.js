/* ========================================================
   Bot de Reservas por WhatsApp — Interactive JS Application
   DSSD © 2026 — Inteligencia Artificial y Agendamiento
   ======================================================== */

(function () {
  'use strict';

  // ==================== STATE ====================
  const state = {
    metrics: {
      bookings: 18,
      messages: 142,
      conversion: 89.2,
      hoursSaved: 9.5
    },
    days: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
    slots: ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30'],
    calendar: {
      // Lun
      'Lun-09:00': { booked: true, client: 'Carlos M.' },
      'Lun-12:00': { booked: true, client: 'Sofía G.' },
      'Lun-15:30': { booked: true, client: 'Juan P.' },
      // Mar
      'Mar-10:30': { booked: true, client: 'Martín F.' },
      'Mar-14:00': { booked: true, client: 'Laura R.' },
      'Mar-17:00': { booked: true, client: 'Pedro S.' },
      // Mie
      'Mie-09:00': { booked: true, client: 'Marta T.' },
      'Mie-15:30': { booked: true, client: 'Diego L.' },
      // Jue
      'Jue-12:00': { booked: true, client: 'Andrés V.' },
      'Jue-18:30': { booked: true, client: 'Lucía B.' },
      // Vie
      'Vie-10:30': { booked: true, client: 'Julián P.' },
      'Vie-14:00': { booked: true, client: 'Clara M.' },
      'Vie-17:00': { booked: true, client: 'Gabriel D.' }
    },
    chatHistory: [
      { sender: 'bot', text: '¡Hola! 👋 Bienvenido al sistema de turnos de DSSD Salón.\n¿En qué te puedo ayudar hoy? Podés pedir un turno, consultar nuestros precios y servicios o reprogramar una cita.', time: '09:00' }
    ],
    // Flow flags for NLP
    currentFlow: null, // 'booking', 'prices', 'cancellation'
    bookingStep: 0,
    tempBooking: { day: '', slot: '', service: '' },
    isTyping: false
  };

  // ==================== UTILITIES ====================
  function getCurrentTime() {
    return new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  }

  // ==================== TOAST NOTIFICATION ====================
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

    app.innerHTML = `
      <div class="background">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>

      <div class="app-layout">
        <!-- Left Side: Dashboard CRM -->
        <section class="dashboard-panel">
          <div class="dashboard-header">
            <h1>DSSD Control CRM</h1>
            <p>Monitoreo en tiempo real de tu agente de reservas de WhatsApp e Inteligencia Artificial.</p>
          </div>

          <!-- Metrics -->
          <div class="metrics-grid">
            <div class="metric-card green-theme">
              <div class="metric-icon">📅</div>
              <div class="metric-info">
                <label>Turnos Agendados</label>
                <div class="value" id="val-bookings">${state.metrics.bookings}</div>
              </div>
            </div>
            <div class="metric-card blue-theme">
              <div class="metric-icon">💬</div>
              <div class="metric-info">
                <label>Mensajes Procesados</label>
                <div class="value" id="val-messages">${state.metrics.messages}</div>
              </div>
            </div>
            <div class="metric-card purple-theme">
              <div class="metric-icon">📈</div>
              <div class="metric-info">
                <label>Tasa de Conversión</label>
                <div class="value">${state.metrics.conversion}%</div>
              </div>
            </div>
            <div class="metric-card amber-theme">
              <div class="metric-icon">⏳</div>
              <div class="metric-info">
                <label>Horas Ahorradas</label>
                <div class="value" id="val-hours">${state.metrics.hoursSaved} hs</div>
              </div>
            </div>
          </div>

          <!-- Weekly Schedule Calendar -->
          <div class="calendar-card">
            <h3><span>📅</span> Calendario Semanal de Turnos</h3>
            <div class="calendar-grid">
              <!-- Grid Header -->
              <div class="calendar-header">Hora</div>
              ${state.days.map(d => `<div class="calendar-header">${d}</div>`).join('')}

              <!-- Grid Slots -->
              ${state.slots.map(slot => `
                <div class="time-col">${slot}</div>
                ${state.days.map(day => {
                  const key = `${day}-${slot}`;
                  const booking = state.calendar[key];
                  if (booking) {
                    return `<div class="calendar-cell booked" data-key="${key}" title="Reservado por ${booking.client}">
                      <span>Reservado</span>
                      <div class="client-name">${booking.client}</div>
                    </div>`;
                  } else {
                    return `<div class="calendar-cell" data-key="${key}">
                      <span>Disponible</span>
                    </div>`;
                  }
                }).join('')}
              `).join('')}
            </div>
          </div>

          <!-- Scenario Controller -->
          <div class="scenarios-card">
            <h3>🤖 Escenarios Rápidos de Prueba</h3>
            <p>Haz clic en cualquier escenario para simular una interacción del cliente en vivo.</p>
            <div class="scenarios-grid">
              <button class="scenario-btn" id="scenario-full">
                <strong>Reserva de Turno</strong>
                <span>Simula agendamiento de corte de pelo completo</span>
              </button>
              <button class="scenario-btn" id="scenario-prices">
                <strong>Consulta Precios</strong>
                <span>Pide lista de precios de barbería al agente</span>
              </button>
              <button class="scenario-btn" id="scenario-cancel">
                <strong>Reprogramación</strong>
                <span>Solicita reprogramar o cancelar una cita agendada</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Right Side: Phone simulator -->
        <section class="phone-wrapper">
          <div class="phone-card">
            <div class="phone-notch"></div>
            <div class="phone-screen">
              <!-- Chat Header -->
              <div class="wa-header">
                <div class="wa-avatar">🤖</div>
                <div class="wa-status">
                  <h4>DSSD Salón Bot</h4>
                  <span>en línea</span>
                </div>
              </div>

              <!-- Chat Body -->
              <div class="chat-body" id="chatBody">
                ${state.chatHistory.map(msg => `
                  <div class="chat-msg ${msg.sender}">
                    ${msg.text.replace(/\n/g, '<br>')}
                    <div class="chat-msg-time">${msg.time}</div>
                  </div>
                `).join('')}
              </div>

              <!-- Chat Footer -->
              <div class="chat-footer">
                <form class="chat-input-form" id="chatInputForm">
                  <input type="text" class="chat-input-field" id="chatInputField" placeholder="Escribí un mensaje..." autocomplete="off">
                  <button type="submit" class="chat-send-btn">➔</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;

    bindEvents();
    scrollChatBottom();
  }

  // ==================== SCROLL HELPER ====================
  function scrollChatBottom() {
    const chatBody = document.getElementById('chatBody');
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }

  // ==================== TYPING SIMULATION ====================
  function showTypingIndicator() {
    if (state.isTyping) return;
    state.isTyping = true;
    const chatBody = document.getElementById('chatBody');
    if (chatBody) {
      const bubble = document.createElement('div');
      bubble.className = 'typing-bubble';
      bubble.id = 'typingBubble';
      bubble.innerHTML = '<span></span><span></span><span></span>';
      chatBody.appendChild(bubble);
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }

  function hideTypingIndicator() {
    state.isTyping = false;
    const bubble = document.getElementById('typingBubble');
    if (bubble) bubble.remove();
  }

  // ==================== EVENT BINDING ====================
  function bindEvents() {
    // Form Input submit
    const form = document.getElementById('chatInputForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('chatInputField');
        if (!input || !input.value.trim()) return;

        const text = input.value.trim();
        input.value = '';
        handleUserMessage(text);
      });
    }

    // Demo Context Box Close
    const ctxClose = document.querySelector('.demo-close');
    if (ctxClose) {
      ctxClose.addEventListener('click', () => {
        const box = document.querySelector('.demo-context');
        if (box) box.remove();
      });
    }

    // Scenario clicks
    const btnFull = document.getElementById('scenario-full');
    if (btnFull) btnFull.addEventListener('click', () => runScenario('full'));

    const btnPrices = document.getElementById('scenario-prices');
    if (btnPrices) btnPrices.addEventListener('click', () => runScenario('prices'));

    const btnCancel = document.getElementById('scenario-cancel');
    if (btnCancel) btnCancel.addEventListener('click', () => runScenario('cancel'));

    // Manual click on slots to interact
    document.querySelectorAll('.calendar-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const key = cell.getAttribute('data-key');
        const booking = state.calendar[key];
        if (booking) {
          showToast(`Turno de ${booking.client} a las ${key.split('-')[1]} el día ${key.split('-')[0]}`, 'info');
        } else {
          showToast(`Espacio disponible para agendar. ¡Escribile al bot para reservar!`, 'success');
        }
      });
    });
  }

  // ==================== SCENARIO RUNNER ====================
  function runScenario(type) {
    if (state.isTyping) {
      showToast('Por favor, esperá a que termine el flujo actual.', 'warning');
      return;
    }

    // Reset flow
    state.currentFlow = null;
    state.bookingStep = 0;

    let steps = [];

    if (type === 'full') {
      steps = [
        { text: 'Hola, me gustaría reservar un turno para cortar mi cabello.', sender: 'client', delay: 1000 },
        { text: '¡Hola! Con gusto te agendo. Hacemos cortes clásicos, modernos y peinados.\n\n¿Para qué día te gustaría reservar? (Lunes a Viernes)', sender: 'bot', delay: 2500 },
        { text: 'Me queda bien el día Jueves', sender: 'client', delay: 1500 },
        { text: 'Perfecto, el Jueves. Tenemos disponibles los horarios de las 12:00, 14:00 y 15:30.\n\n¿Cuál preferís?', sender: 'bot', delay: 2800 },
        { text: 'El de las 14:00 está genial. Mi nombre es Gastón.', sender: 'client', delay: 1800 },
        { text: '¡Excelente Gastón! Reservado con éxito. Tu turno para Corte de Cabello quedó agendado el día Jueves a las 14:00.\n\n¡Te esperamos! 💈✂️', sender: 'bot', delay: 2200, action: () => bookSlot('Jueves', '14:00', 'Gastón P.') }
      ];
    } else if (type === 'prices') {
      steps = [
        { text: 'Buenas, ¿me podrías decir los precios de los servicios?', sender: 'client', delay: 800 },
        { text: '¡Hola! 💈 Claro que sí. Aquí tenés nuestra lista de precios vigentes:\n\n• Corte de Pelo: $3.000\n• Perfilado de Barba: $2.000\n• Combo Premium (Corte + Barba): $4.500\n\n¿Te interesaría agendar un turno para hoy?', sender: 'bot', delay: 2400 }
      ];
    } else if (type === 'cancel') {
      steps = [
        { text: 'Hola, necesito cancelar el turno de Lucía del Jueves a las 18:30.', sender: 'client', delay: 1200 },
        { text: '¡Hola! Entendido. Buscando en la agenda...\n\n¿Confirmas la cancelación del turno de Lucía B. del día Jueves a las 18:30?', sender: 'bot', delay: 2400 },
        { text: 'Sí, por favor.', sender: 'client', delay: 1000 },
        { text: 'Entendido. Cita cancelada con éxito. El horario de las 18:30 del Jueves queda liberado.\n\nSi necesitas agendar una nueva fecha, no dudes en avisarme.', sender: 'bot', delay: 2000, action: () => cancelSlot('Jueves', '18:30') }
      ];
    }

    runSteps(steps);
  }

  function runSteps(steps) {
    if (steps.length === 0) return;
    const current = steps.shift();

    setTimeout(() => {
      if (current.sender === 'client') {
        appendMessage('client', current.text);
        state.metrics.messages++;
        document.getElementById('val-messages').innerText = state.metrics.messages;
        runSteps(steps);
      } else {
        showTypingIndicator();
        setTimeout(() => {
          hideTypingIndicator();
          appendMessage('bot', current.text);
          if (current.action) current.action();
          runSteps(steps);
        }, current.delay);
      }
    }, current.delay ? 200 : 0);
  }

  // ==================== NLP CHATBOT LOGIC ====================
  function handleUserMessage(text) {
    appendMessage('client', text);
    state.metrics.messages++;
    document.getElementById('val-messages').innerText = state.metrics.messages;

    showTypingIndicator();

    // Natural Language processing mock
    const t = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    setTimeout(() => {
      hideTypingIndicator();
      let reply = '';

      // --- FLOW: BOOKING ---
      if (state.currentFlow === 'booking') {
        if (state.bookingStep === 1) {
          // Expecting a day
          let matchedDay = null;
          if (t.includes('lun')) matchedDay = 'Lun';
          else if (t.includes('mar')) matchedDay = 'Mar';
          else if (t.includes('mie')) matchedDay = 'Mie';
          else if (t.includes('jue')) matchedDay = 'Jue';
          else if (t.includes('vie')) matchedDay = 'Vie';

          if (matchedDay) {
            state.tempBooking.day = matchedDay;
            state.bookingStep = 2;
            reply = `Perfecto, el día ${matchedDay}.\nTenemos disponibles los siguientes horarios:\n• 12:00hs\n• 14:00hs\n• 15:30hs\n\n¿Cuál elegís?`;
          } else {
            reply = 'No entendí el día. Por favor, decime si preferís Lunes, Martes, Miércoles, Jueves o Viernes.';
          }
        } else if (state.bookingStep === 2) {
          // Expecting time slot
          let matchedTime = null;
          if (t.includes('12')) matchedTime = '12:00';
          else if (t.includes('14')) matchedTime = '14:00';
          else if (t.includes('15') || t.includes('30')) matchedTime = '15:30';

          if (matchedTime) {
            state.tempBooking.slot = matchedTime;
            state.bookingStep = 3;
            reply = `¡Bárbaro! Reservado provisoriamente para el ${state.tempBooking.day} a las ${matchedTime}.\n\n¿A nombre de quién hacemos la reserva?`;
          } else {
            reply = 'Por favor, selecciona una de las horas disponibles: 12:00, 14:00 o 15:30.';
          }
        } else if (state.bookingStep === 3) {
          // Expecting client name
          const name = text;
          const key = `${state.tempBooking.day}-${state.tempBooking.slot}`;
          bookSlot(state.tempBooking.day, state.tempBooking.slot, name);

          reply = `¡Todo listo, ${name}! ✅ Cita agendada con éxito.\n\n📅 ${state.tempBooking.day} a las ${state.tempBooking.slot}hs.\n💈 Corte de Cabello.\n\n¡Te esperamos!`;
          state.currentFlow = null;
          state.bookingStep = 0;
        }
        appendMessage('bot', reply);
        return;
      }

      // --- FLOW: CANCELLATION ---
      if (state.currentFlow === 'cancellation') {
        if (t.includes('si') || t.includes('afirmativo') || t.includes('ok')) {
          cancelSlot('Mie', '15:30');
          reply = 'Entendido. Cancelé tu turno de las 15:30hs. El espacio ha quedado libre.';
        } else {
          reply = 'Operación cancelada. Mantenemos tu reserva vigente.';
        }
        state.currentFlow = null;
        appendMessage('bot', reply);
        return;
      }

      // --- GENERAL INTENT DETECTION ---
      if (t.includes('hola') || t.includes('buenas') || t.includes('buen dia') || t.includes('hola!')) {
        reply = '¡Hola! 👋 Bienvenido a DSSD Salón.\n¿Querés reservar un turno, consultar nuestros servicios o cambiar una cita?';
      } else if (t.includes('precio') || t.includes('servicio') || t.includes('tarifa') || t.includes('corta') || t.includes('barba')) {
        reply = '💈 Precios y servicios:\n\n• Corte de Pelo: $3.000\n• Perfilado de Barba: $2.000\n• Combo Premium (Corte + Barba): $4.500\n\n¿Querés agendar un turno? Decime "reservar".';
      } else if (t.includes('reservar') || t.includes('agendar') || t.includes('turno') || t.includes('cita')) {
        state.currentFlow = 'booking';
        state.bookingStep = 1;
        reply = '¡Dale! Vamos a agendar tu turno.\n¿Qué día preferís? (Lunes a Viernes)';
      } else if (t.includes('cancelar') || t.includes('reprogramar') || t.includes('eliminar')) {
        state.currentFlow = 'cancellation';
        reply = '¿Deseas cancelar tu próximo turno agendado para el Miércoles a las 15:30hs? (Sí/No)';
      } else {
        reply = 'No estoy seguro de haber entendido tu mensaje. Podés escribirme:\n- "reservar" para agendar una cita.\n- "precios" para ver el catálogo.\n- "cancelar" para dar de baja tu turno.';
      }

      appendMessage('bot', reply);
    }, 1200);
  }

  function appendMessage(sender, text) {
    state.chatHistory.push({ sender, text, time: getCurrentTime() });
    const chatBody = document.getElementById('chatBody');
    if (chatBody) {
      const div = document.createElement('div');
      div.className = `chat-msg ${sender}`;
      div.innerHTML = `${text.replace(/\n/g, '<br>')}<div class="chat-msg-time">${getCurrentTime()}</div>`;
      chatBody.appendChild(div);
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }

  // ==================== CRM BOOKING ACTIONS ====================
  function bookSlot(day, slot, clientName) {
    const key = `${day}-${slot}`;
    state.calendar[key] = { booked: true, client: clientName };

    // Update metrics
    state.metrics.bookings++;
    state.metrics.hoursSaved += 0.5;
    state.metrics.conversion = parseFloat((state.metrics.bookings / (state.metrics.messages / 6)).toFixed(1));

    // Update UI elements synchronously if possible
    const valBookings = document.getElementById('val-bookings');
    if (valBookings) valBookings.innerText = state.metrics.bookings;

    const valHours = document.getElementById('val-hours');
    if (valHours) valHours.innerText = `${state.metrics.hoursSaved} hs`;

    // Redraw calendar grid slot
    const cell = document.querySelector(`[data-key="${key}"]`);
    if (cell) {
      cell.className = 'calendar-cell booked just-booked';
      cell.innerHTML = `<span>Reservado</span><div class="client-name">${clientName}</div>`;
      showToast(`Turno agendado: ${clientName} (${day} ${slot}hs)`, 'success');
    }
  }

  function cancelSlot(day, slot) {
    const key = `${day}-${slot}`;
    const booking = state.calendar[key];
    if (!booking) return;

    delete state.calendar[key];

    // Update metrics
    state.metrics.bookings = Math.max(0, state.metrics.bookings - 1);
    const valBookings = document.getElementById('val-bookings');
    if (valBookings) valBookings.innerText = state.metrics.bookings;

    // Redraw slot
    const cell = document.querySelector(`[data-key="${key}"]`);
    if (cell) {
      cell.className = 'calendar-cell';
      cell.innerHTML = `<span>Disponible</span>`;
      showToast(`Turno de ${booking.client} cancelado con éxito`, 'warning');
    }
  }

  // ==================== INITIALIZATION ====================
  render();

})();
