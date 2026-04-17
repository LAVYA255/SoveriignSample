export default function RiskPage() {
  return (
    <div className="container mx-auto px-6 py-24 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">Risk Disclosures</h1>
      <div className="space-y-6 text-gray-300 leading-relaxed font-light">
         <p className="bg-red-500/10 text-red-400 p-4 rounded-lg border border-red-500/20 text-sm font-semibold">
           Prototype Warning: This platform is a simulation. Any mentioned risks below apply to theoretical RWA investments.
         </p>
         <h2 className="text-xl font-bold text-white mt-8">Market Risk</h2>
         <p>Real-world assets, including gold and real estate, are subject to market volatility. The value of tokenized assets may decrease based on macroeconomic factors, local markets, and supply/demand dynamics.</p>
         <h2 className="text-xl font-bold text-white mt-8">Liquidity Risk</h2>
         <p>While tokenization improves liquidity compared to traditional asset classes, there is no guarantee of an active secondary market. You may not be able to exit your position immediately at the exact market price.</p>
      </div>
    </div>
  );
}
