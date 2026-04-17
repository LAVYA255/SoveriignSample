export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-6 py-24 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-gray-300 leading-relaxed font-light">
         <p>As this is a prototype, CelestialE does not actively collect, store, or process any real user data, financial information, or wallet private keys.</p>
         <p>Any state maintained within the application (e.g., mock balances, token amounts) exists entirely locally on your browser context and is not transmitted to external servers.</p>
      </div>
    </div>
  );
}
