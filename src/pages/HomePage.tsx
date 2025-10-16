import HeroSection from '../components/HeroSection';
import DemoSection from '../components/DemoSection';
import FeatureCards from '../components/FeatureCards';
import PricingSection from '../components/PricingSection';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';

function HomeNavbar() {
  return (
    <nav className="sticky top-0 z-sticky glass border-b border-white/30 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">ObservAI</span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <a href="#features" className="hidden sm:inline text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus:text-blue-600">Features</a>
          <a href="#demos" className="hidden sm:inline text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus:text-blue-600">Demos</a>
          <a href="#pricing" className="hidden sm:inline text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus:text-blue-600">Pricing</a>
          <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus:text-blue-600">Login</Link>
          <Link
            to="/register"
            className="px-4 sm:px-6 py-2 text-sm bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span className="hidden sm:inline">Start Free Trial</span>
            <span className="sm:hidden">Sign Up</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar />
      <HeroSection />
      <div id="features">
        <FeatureCards />
      </div>
      <div id="demos">
        <DemoSection />
      </div>
      <div id="pricing">
        <PricingSection />
      </div>
      <Footer />
    </div>
  );
}
