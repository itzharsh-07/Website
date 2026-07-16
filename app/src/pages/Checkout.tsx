import { useState, type ChangeEvent } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { api } from '../lib/api';
import Stepper from '../components/checkout/Stepper';
import OrderReview from '../components/checkout/OrderReview';
import OrderConfirmation from '../components/checkout/OrderConfirmation';
import styles from './Checkout.module.css';

interface ShippingForm {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

const emptyShipping: ShippingForm = { firstName: '', lastName: '', address: '', city: '', state: '', zip: '', phone: '' };

export default function Checkout() {
  const { items, clearCart } = useCart();
  const { showToast } = useToast();

  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState<ShippingForm>(emptyShipping);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billing, setBilling] = useState<ShippingForm>(emptyShipping);
  const [delivery, setDelivery] = useState('standard');
  const [payment, setPayment] = useState('card');
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [placing, setPlacing] = useState(false);
  const [confirmation, setConfirmation] = useState<{ orderNumber: string; estimatedDelivery: string } | null>(null);

  const shippingField = (key: keyof ShippingForm) => (e: ChangeEvent<HTMLInputElement>) =>
    setShipping((f) => ({ ...f, [key]: e.target.value }));
  const billingField = (key: keyof ShippingForm) => (e: ChangeEvent<HTMLInputElement>) =>
    setBilling((f) => ({ ...f, [key]: e.target.value }));

  const validateShipping = (): boolean => {
    const required: (keyof ShippingForm)[] = ['firstName', 'lastName', 'address', 'city', 'state', 'zip', 'phone'];
    const missing = required.filter((k) => !shipping[k].trim());
    setErrors(new Set(missing));
    return missing.length === 0;
  };

  const next = () => {
    if (step === 0 && !validateShipping()) {
      showToast('Please complete the required fields.');
      return;
    }
    setErrors(new Set());
    setStep((s) => Math.min(3, s + 1));
  };
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const res = await api.placeOrder({ cart: items, delivery, payment });
      setConfirmation({ orderNumber: res.orderNumber, estimatedDelivery: res.estimatedDelivery });
      clearCart();
    } catch {
      showToast('Something went wrong placing your order.');
    } finally {
      setPlacing(false);
    }
  };

  if (confirmation) {
    return (
      <div className="container">
        <OrderConfirmation orderNumber={confirmation.orderNumber} estimatedDelivery={confirmation.estimatedDelivery} />
      </div>
    );
  }

  return (
    <div>
      <div className="pageBanner" style={{ paddingBottom: 0 }}>
        <div className="container">
          <h1>Checkout</h1>
        </div>
      </div>

      <div className="container">
        <Stepper current={step} />

        <div className={styles.layout}>
          <div>
            {step === 0 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-body)', marginBottom: 'var(--space-4)' }}>Shipping Address</h3>
                <div className="fieldRow">
                  <div className={`field ${errors.has('firstName') ? 'hasError' : ''}`}>
                    <label>First Name</label>
                    <input type="text" value={shipping.firstName} onChange={shippingField('firstName')} />
                  </div>
                  <div className={`field ${errors.has('lastName') ? 'hasError' : ''}`}>
                    <label>Last Name</label>
                    <input type="text" value={shipping.lastName} onChange={shippingField('lastName')} />
                  </div>
                </div>
                <div className={`field ${errors.has('address') ? 'hasError' : ''}`}>
                  <label>Address</label>
                  <input type="text" value={shipping.address} onChange={shippingField('address')} />
                </div>
                <div className="fieldRow">
                  <div className={`field ${errors.has('city') ? 'hasError' : ''}`}>
                    <label>City</label>
                    <input type="text" value={shipping.city} onChange={shippingField('city')} />
                  </div>
                  <div className={`field ${errors.has('state') ? 'hasError' : ''}`}>
                    <label>State</label>
                    <input type="text" value={shipping.state} onChange={shippingField('state')} />
                  </div>
                </div>
                <div className="fieldRow">
                  <div className={`field ${errors.has('zip') ? 'hasError' : ''}`}>
                    <label>ZIP Code</label>
                    <input type="text" value={shipping.zip} onChange={shippingField('zip')} />
                  </div>
                  <div className={`field ${errors.has('phone') ? 'hasError' : ''}`}>
                    <label>Phone</label>
                    <input type="tel" value={shipping.phone} onChange={shippingField('phone')} />
                  </div>
                </div>
                <div className={styles.stepActions}>
                  <span />
                  <button className="btn btnPrimary" onClick={next}>
                    Continue to Billing
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-body)', marginBottom: 'var(--space-4)' }}>Billing Address</h3>
                <label className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <input type="checkbox" checked={sameAsShipping} onChange={(e) => setSameAsShipping(e.target.checked)} />
                  Same as shipping address
                </label>
                {!sameAsShipping && (
                  <div>
                    <div className="fieldRow">
                      <div className="field">
                        <label>First Name</label>
                        <input type="text" value={billing.firstName} onChange={billingField('firstName')} />
                      </div>
                      <div className="field">
                        <label>Last Name</label>
                        <input type="text" value={billing.lastName} onChange={billingField('lastName')} />
                      </div>
                    </div>
                    <div className="field">
                      <label>Address</label>
                      <input type="text" value={billing.address} onChange={billingField('address')} />
                    </div>
                    <div className="fieldRow">
                      <div className="field">
                        <label>City</label>
                        <input type="text" value={billing.city} onChange={billingField('city')} />
                      </div>
                      <div className="field">
                        <label>ZIP Code</label>
                        <input type="text" value={billing.zip} onChange={billingField('zip')} />
                      </div>
                    </div>
                  </div>
                )}
                <div className={styles.stepActions}>
                  <button className="btn btnOutline" onClick={prev}>
                    Back
                  </button>
                  <button className="btn btnPrimary" onClick={next}>
                    Continue to Delivery
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-body)', marginBottom: 'var(--space-4)' }}>Delivery Options</h3>
                <label className={`${styles.deliveryOption} ${delivery === 'standard' ? styles.selected : ''}`}>
                  <input type="radio" name="delivery" checked={delivery === 'standard'} onChange={() => setDelivery('standard')} />
                  <div>
                    <strong>Standard Delivery</strong>
                    <div className="textSecondary" style={{ fontSize: 13 }}>2–4 weeks · Free</div>
                  </div>
                </label>
                <label className={`${styles.deliveryOption} ${delivery === 'express' ? styles.selected : ''}`}>
                  <input type="radio" name="delivery" checked={delivery === 'express'} onChange={() => setDelivery('express')} />
                  <div>
                    <strong>Express Delivery</strong>
                    <div className="textSecondary" style={{ fontSize: 13 }}>5–7 days · $89</div>
                  </div>
                </label>
                <div className={styles.stepActions}>
                  <button className="btn btnOutline" onClick={prev}>
                    Back
                  </button>
                  <button className="btn btnPrimary" onClick={next}>
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-body)', marginBottom: 'var(--space-4)' }}>Payment</h3>
                {(
                  [
                    ['card', 'Credit / Debit Card'],
                    ['upi', 'UPI'],
                    ['paypal', 'PayPal'],
                    ['cod', 'Cash on Delivery'],
                  ] as const
                ).map(([value, label]) => (
                  <div key={value}>
                    <label className={`${styles.paymentOption} ${payment === value ? styles.selected : ''}`}>
                      <input type="radio" name="payment" checked={payment === value} onChange={() => setPayment(value)} />
                      <strong>{label}</strong>
                    </label>
                    {payment === value && (
                      <div className={styles.paymentDetail}>
                        {value === 'card' && (
                          <>
                            <div className="field">
                              <label>Card Number</label>
                              <input type="text" placeholder="4242 4242 4242 4242" />
                            </div>
                            <div className="fieldRow">
                              <div className="field">
                                <label>Expiry</label>
                                <input type="text" placeholder="MM/YY" />
                              </div>
                              <div className="field">
                                <label>CVC</label>
                                <input type="text" placeholder="123" />
                              </div>
                            </div>
                          </>
                        )}
                        {value === 'upi' && (
                          <div className="field">
                            <label>UPI ID</label>
                            <input type="text" placeholder="you@upi" />
                          </div>
                        )}
                        {value === 'paypal' && (
                          <p className="textSecondary">You&rsquo;ll be redirected to PayPal to complete payment securely (demo).</p>
                        )}
                        {value === 'cod' && <p className="textSecondary">Pay in cash when your order arrives.</p>}
                      </div>
                    )}
                  </div>
                ))}

                <div className={styles.stepActions}>
                  <button className="btn btnOutline" onClick={prev}>
                    Back
                  </button>
                  <button className="btn btnPrimary" onClick={placeOrder} disabled={placing || items.length === 0}>
                    {placing ? 'Processing…' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <OrderReview delivery={delivery} showItems />
        </div>
      </div>
    </div>
  );
}
