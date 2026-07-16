import LegalLayout from '../components/common/LegalLayout';

export default function Privacy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="Last updated January 1, 2026"
      metaTitle="Privacy Policy | Aura"
      metaDescription="How Aura collects, uses and protects your personal information."
    >
      <p>
        Aura Furniture Co. (&ldquo;Aura&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This
        policy explains what information we collect, how we use it, and the choices you have.
      </p>
      <h2>Information We Collect</h2>
      <p>
        We collect information you provide directly — such as your name, shipping address, email, and payment
        details when you place an order or contact us — along with usage data such as pages visited and products
        viewed, collected via cookies and similar technologies.
      </p>
      <h2>How We Use Information</h2>
      <ul>
        <li>To process and fulfill your orders, including delivery coordination.</li>
        <li>To communicate with you about orders, promotions, and customer support.</li>
        <li>To improve our products, website, and shopping experience.</li>
        <li>To detect and prevent fraud.</li>
      </ul>
      <h2>Cookies</h2>
      <p>
        We use cookies to remember your cart, wishlist, and preferences. You can disable cookies in your browser
        settings, though some features may not function correctly as a result.
      </p>
      <h2>Sharing of Information</h2>
      <p>
        We do not sell your personal information. We share data only with service providers who help us operate our
        business — payment processors, delivery partners, and analytics providers — under strict confidentiality
        agreements.
      </p>
      <h2>Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal data at any time by contacting
        privacy@aura.example.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about this policy can be directed to privacy@aura.example or 140 Meridian Avenue, New York, NY
        10011.
      </p>
    </LegalLayout>
  );
}
