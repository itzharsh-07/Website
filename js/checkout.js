/**
 * checkout.js — multi-step checkout flow (Shipping -> Billing -> Delivery -> Payment -> Confirmation).
 * Demo only: no real payment is processed.
 */
(function () {
  'use strict';

  const root = document.getElementById('checkoutRoot');
  if (!root) return;

  const steps = ['shipping', 'billing', 'delivery', 'payment'];
  let current = 0;
  const state = { delivery: 'standard', payment: 'card', sameAsShipping: true, promo: '' };

  const stepEls = document.querySelectorAll('.checkout-step');
  const stepDots = document.querySelectorAll('.checkout-steps .step');

  function showStep(index) {
    stepEls.forEach((el, i) => el.classList.toggle('active', i === index));
    stepDots.forEach((el, i) => {
      el.classList.toggle('active', i === index);
      el.classList.toggle('done', i < index);
    });
    window.scrollTo({ top: root.offsetTop - 100, behavior: 'smooth' });
  }

  function validateStep(index) {
    const el = stepEls[index];
    let valid = true;
    el.querySelectorAll('input[required], select[required]').forEach((input) => {
      const field = input.closest('.field');
      if (!input.value.trim()) {
        field?.classList.add('has-error');
        valid = false;
      } else {
        field?.classList.remove('has-error');
      }
    });
    return valid;
  }

  document.querySelectorAll('.js-next-step').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!validateStep(current)) {
        window.showToast?.('Please complete the required fields.');
        return;
      }
      if (current < steps.length - 1) {
        current += 1;
        showStep(current);
        if (steps[current] === 'billing') syncBillingWithShipping();
        if (steps[current] === 'payment') renderOrderReview();
      }
    });
  });
  document.querySelectorAll('.js-prev-step').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (current > 0) { current -= 1; showStep(current); }
    });
  });

  const sameAsShippingBox = document.getElementById('sameAsShipping');
  const billingFields = document.getElementById('billingFields');
  sameAsShippingBox?.addEventListener('change', (e) => {
    state.sameAsShipping = e.target.checked;
    billingFields.style.display = e.target.checked ? 'none' : 'grid';
  });
  function syncBillingWithShipping() {
    if (!state.sameAsShipping) return;
    billingFields.style.display = 'none';
  }

  document.querySelectorAll('input[name="delivery"]').forEach((input) => {
    input.addEventListener('change', (e) => { state.delivery = e.target.value; renderOrderReview(); });
  });
  document.querySelectorAll('input[name="payment"]').forEach((input) => {
    input.addEventListener('change', (e) => {
      state.payment = e.target.value;
      document.querySelectorAll('.payment-detail').forEach((p) => p.style.display = 'none');
      const panel = document.getElementById(`payment-${e.target.value}`);
      if (panel) panel.style.display = 'block';
    });
  });

  const deliveryPrices = { standard: 0, express: 89 };

  function renderOrderReview() {
    const cart = window.Cart.getCart();
    const summaryEl = document.getElementById('orderReviewItems');
    if (summaryEl) {
      summaryEl.innerHTML = cart.map((i) => `
        <div style="display:flex;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid var(--color-border);">
          <img src="${i.image}" alt="${i.name}" style="width:52px;height:52px;object-fit:cover;border-radius:8px;" />
          <div style="flex:1;"><div style="font-weight:500;">${i.name}</div><div class="text-secondary" style="font-size:12px;">Qty ${i.qty}</div></div>
          <div>${Lumiere.formatPrice(i.price * i.qty)}</div>
        </div>`).join('');
    }
    const totals = window.Cart.getTotals(state.promo);
    const deliveryFee = deliveryPrices[state.delivery];
    const grandTotal = totals.total + deliveryFee;
    setText('reviewSubtotal', Lumiere.formatPrice(totals.subtotal));
    setText('reviewShipping', totals.shipping === 0 ? 'Free' : Lumiere.formatPrice(totals.shipping));
    setText('reviewDelivery', deliveryFee === 0 ? 'Included' : Lumiere.formatPrice(deliveryFee));
    setText('reviewTax', Lumiere.formatPrice(totals.tax));
    setText('reviewTotal', Lumiere.formatPrice(grandTotal));
    const discountRow = document.getElementById('reviewDiscountRow');
    if (discountRow) {
      discountRow.style.display = totals.discount ? 'flex' : 'none';
      setText('reviewDiscount', `-${Lumiere.formatPrice(totals.discount)}`);
    }
  }
  function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }

  document.getElementById('applyPromo')?.addEventListener('click', () => {
    const input = document.getElementById('promoInput');
    state.promo = input.value.trim();
    renderOrderReview();
    window.showToast?.(state.promo.toUpperCase() === 'LUMIERE10' ? '10% discount applied' : 'Promo code not recognized', state.promo.toUpperCase() === 'LUMIERE10' ? 'success' : 'default');
  });

  document.getElementById('placeOrderBtn')?.addEventListener('click', async () => {
    if (!validateStep(current)) { window.showToast?.('Please complete the required fields.'); return; }
    const btn = document.getElementById('placeOrderBtn');
    btn.disabled = true;
    btn.textContent = 'Processing…';
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: window.Cart.getCart(), delivery: state.delivery, payment: state.payment }),
      });
      const data = await res.json();
      showConfirmation(data);
      window.Cart.clearCart();
    } catch (err) {
      window.showToast?.('Something went wrong placing your order.');
      btn.disabled = false;
      btn.textContent = 'Place Order';
    }
  });

  function showConfirmation(data) {
    root.querySelectorAll('.checkout-step, .checkout-steps, .checkout-sidebar').forEach((el) => (el.style.display = 'none'));
    const confirm = document.getElementById('checkoutConfirmation');
    confirm.style.display = 'block';
    document.getElementById('confirmOrderNumber').textContent = data.orderNumber;
    document.getElementById('confirmDelivery').textContent = data.estimatedDelivery;
    if (window.gsap) {
      gsap.from('.confirm-check-circle', { scale: 0, duration: 0.6, ease: 'back.out(2)' });
      gsap.from('.confirm-check-circle svg polyline', { strokeDashoffset: 48, duration: 0.5, delay: 0.35, ease: 'power2.out' });
    }
  }

  // Initial render
  showStep(0);
  renderOrderReview();
  document.querySelectorAll('input[name="delivery"]')[0] && (document.querySelectorAll('input[name="delivery"]')[0].checked = true);
})();
