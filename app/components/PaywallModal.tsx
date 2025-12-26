import { Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PaywallProps {
  isOpen: boolean;
  onClose: () => void;
  variant: "limit-reached" | "premium-content";
}

export function PaywallModal({ isOpen, onClose, variant }: PaywallProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const premiumFeatures = [
    'Unlimited articles across all sections',
    'Ad-free reading on all devices',
    'Full access to investigative journalism',
    'Subscriber-only newsletters and briefings',
    'Complete archive dating back 10+ years',
    'Enhanced mobile and tablet app experience',
    'Offline reading with save-for-later',
    'Commenting privileges on articles'
  ];

  const eliteFeatures = [
    'Everything in Premium, plus:',
    'Full access to iTruth Business & Markets',
    'Real-time market data and analysis',
    'Exclusive Business section reporting',
    'Company profiles and earnings coverage',
    'Interactive business news tools',
    'Virtual events with journalists and experts',
    'Gift up to 10 articles per month to non-subscribers',
    'Discounted tickets to iTruth Live events',
    'Early access to major investigations',
    'Priority customer service'
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-5xl w-full relative transform transition-all max-h-[90vh] overflow-y-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors duration-200 z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8 max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            {variant === "limit-reached" ? "You've Hit Your Limit" : "Premium Content"}
          </h2>

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            {variant === "limit-reached"
              ? "You've read all 5 free articles today. Upgrade to continue reading unlimited premium content."
              : "Subscribe to unlock this article and access our entire library of premium content."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Premium Tier */}
          <div className="group border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Premium</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-bold text-gray-900">$12</span>
                <span className="text-lg text-gray-600">/month</span>
              </div>
              <p className="text-sm text-gray-500">Billed monthly • Cancel anytime</p>
            </div>

            <ul className="space-y-3 mb-8">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                  <div className="shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3.5 h-3.5 text-blue-600" strokeWidth={3} />
                  </div>
                  <span className="leading-tight">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/membership?plan=premium"
              className="block w-full bg-gray-900 text-white text-center py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-[1.02]"
            >
              Choose Premium
            </Link>
          </div>

          {/* Elite Tier */}
          <div className="group relative border-2 border-blue-600 rounded-2xl p-6 bg-gradient-to-br from-blue-50 via-white to-blue-50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                ⭐ Most Popular
              </div>
            </div>

            <div className="mb-6 mt-2">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Elite</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">$25</span>
                <span className="text-lg text-gray-600">/month</span>
              </div>
              <p className="text-sm text-gray-500">Billed monthly • Cancel anytime</p>
            </div>

            <ul className="space-y-3 mb-8">
              {eliteFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <div className="shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                  <span className={`leading-tight ${index === 0 ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/membership?plan=elite"
              className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-[1.02]"
            >
              Choose Elite
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="text-gray-500 text-sm hover:text-gray-700 transition-colors font-medium cursor-pointer"
          >
            Continue browsing headlines
          </button>
        </div>
      </div>
    </div>
  );
}
interface PaywallProps {
  isOpen: boolean;
  onClose: () => void;
  variant: "limit-reached" | "premium-content";
}