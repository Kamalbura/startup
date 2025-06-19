import React, { useState } from 'react';
import { 
  LoadingSpinner, 
  LoadingOverlay, 
  LoadingSkeleton, 
  LoadingButton,
  SkillsLoadingAnimation,
  HelpRequestLoadingAnimation,
  CollaborationLoadingAnimation,
  AnonymousLoadingAnimation,
  CampusLoadingAnimation,
  DataFlowLoadingAnimation,
  NeuralNetworkLoadingAnimation,
  QuantumLoadingAnimation,
  EcosystemLoadingAnimation,
  CampusNetworkLoadingAnimation,
  SkillBuildingLoadingAnimation,
  CollaborationSyncLoadingAnimation,
  AnonymousModeLoadingAnimation
} from '../components/ui/LoadingSpinner';
import { Layout } from '../components/layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

/**
 * Component Test Page - Showcase for Loading Spinner System
 * 
 * Features:
 * - Anime.js powered loading animations
 * - Multiple spinner variants
 * - Interactive controls
 * - Real-time preview
 */

const ComponentTest = () => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState('dots');
  const [selectedSize, setSelectedSize] = useState('md');
  const [selectedColor, setSelectedColor] = useState('primary');
  const [selectedSpeed, setSelectedSpeed] = useState('normal');

  const variants = ['dots', 'pulse', 'wave', 'orbit', 'magnetic', 'spin'];
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
  const colors = ['primary', 'secondary', 'success', 'warning', 'error', 'white', 'purple'];
  const speeds = ['slow', 'normal', 'fast'];

  const handleButtonClick = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 3000);
  };

  const showOverlay = () => {
    setOverlayVisible(true);
    setTimeout(() => setOverlayVisible(false), 3000);
  };

  return (
    <Layout showHeader={true} showFooter={false}>
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎭 Loading Spinner Showcase
          </h1>
          <p className="text-gray-600">
            Advanced anime.js powered loading animations for SkillLance
          </p>
        </div>

        {/* Interactive Demo */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">🎮 Interactive Demo</h2>
          
          {/* Controls */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">            <div>
              <label htmlFor="variant-select" className="block text-sm font-medium text-gray-700 mb-2">
                Variant
              </label>
              <select
                id="variant-select"
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {variants.map(variant => (
                  <option key={variant} value={variant}>
                    {variant.charAt(0).toUpperCase() + variant.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="size-select" className="block text-sm font-medium text-gray-700 mb-2">
                Size
              </label>
              <select
                id="size-select"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {sizes.map(size => (
                  <option key={size} value={size}>
                    {size.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="color-select" className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <select
                id="color-select"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {colors.map(color => (
                  <option key={color} value={color}>
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="speed-select" className="block text-sm font-medium text-gray-700 mb-2">
                Speed
              </label>
              <select
                id="speed-select"
                value={selectedSpeed}
                onChange={(e) => setSelectedSpeed(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {speeds.map(speed => (
                  <option key={speed} value={speed}>
                    {speed.charAt(0).toUpperCase() + speed.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Live Preview */}
          <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
            <LoadingSpinner
              variant={selectedVariant}
              size={selectedSize}
              color={selectedColor}
              speed={selectedSpeed}
            />
          </div>
        </Card>

        {/* Advanced Anime.js Animations */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">🚀 Advanced Anime.js Animations</h2>
          <p className="text-gray-600 mb-6">
            Next-generation loading animations using advanced anime.js techniques: timelines, stagger effects, morphing, and organic movement
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Data Flow Animation */}
            <div className="text-center">
              <div className="flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 rounded-lg mb-4">
                <DataFlowLoadingAnimation size="lg" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Data Flow</h3>
              <p className="text-sm text-gray-600">
                Advanced timeline with morphing shapes and stagger effects for data processing
              </p>
            </div>

            {/* Neural Network Animation */}
            <div className="text-center">
              <div className="flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-lg mb-4">
                <NeuralNetworkLoadingAnimation size="lg" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Neural Network</h3>
              <p className="text-sm text-gray-600">
                AI/ML inspired with interconnected nodes and pulsing signals
              </p>
            </div>

            {/* Quantum Computing Animation */}
            <div className="text-center">
              <div className="flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 rounded-lg mb-4">
                <QuantumLoadingAnimation size="lg" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Quantum Computing</h3>
              <p className="text-sm text-gray-600">
                Quantum states and superposition with advanced morphing
              </p>
            </div>

            {/* Ecosystem Growth Animation */}
            <div className="text-center">
              <div className="flex items-center justify-center p-6 bg-gradient-to-br from-green-50 via-yellow-50 to-amber-50 rounded-lg mb-4">
                <EcosystemLoadingAnimation size="lg" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Ecosystem Growth</h3>
              <p className="text-sm text-gray-600">
                Organic, interconnected growth with realistic easing
              </p>
            </div>
          </div>

          {/* Technical Features */}
          <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">🔧 Advanced Features Used:</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <ul className="space-y-1">
                <li>✨ Timeline sequences with precise timing</li>
                <li>🎯 Stagger effects (center, random, first)</li>
                <li>🌊 Morphing shapes and path animations</li>
                <li>⚡ Spring and elastic easing functions</li>
              </ul>
              <ul className="space-y-1">
                <li>🎨 SVG path morphing and stroke animations</li>
                <li>🔄 Complex rotation and scale combinations</li>
                <li>💫 Particle systems with organic movement</li>
                <li>🎭 Multiple animation layers and compositing</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* SkillLance-Themed Animations */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">🎯 SkillLance-Themed Animations</h2>
          <p className="text-gray-600 mb-6">
            Context-aware loading animations designed specifically for our platform features
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Skills Animation */}
            <div className="text-center">
              <div className="flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg mb-4">
                <SkillsLoadingAnimation size="md" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Skills Building</h3>
              <p className="text-sm text-gray-600">
                Represents skill development and growth progress
              </p>
            </div>

            {/* Help Request Animation */}
            <div className="text-center">
              <div className="flex items-center justify-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg mb-4">
                <HelpRequestLoadingAnimation size="md" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Help Requests</h3>
              <p className="text-sm text-gray-600">
                Shows anonymous help requests flowing through the platform
              </p>
            </div>

            {/* Collaboration Animation */}
            <div className="text-center">
              <div className="flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg mb-4">
                <CollaborationLoadingAnimation size="md" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Collaboration</h3>
              <p className="text-sm text-gray-600">
                Represents real-time collaboration between students
              </p>
            </div>

            {/* Anonymous Animation */}
            <div className="text-center">
              <div className="flex items-center justify-center p-6 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg mb-4">
                <AnonymousLoadingAnimation size="md" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Privacy Shield</h3>
              <p className="text-sm text-gray-600">
                Shows the anonymous and privacy-protected nature
              </p>
            </div>

            {/* Campus Animation */}
            <div className="text-center">
              <div className="flex items-center justify-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg mb-4">
                <CampusLoadingAnimation size="md" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Campus Network</h3>
              <p className="text-sm text-gray-600">
                Represents campus-wide community connections
              </p>
            </div>

            {/* Size Variations */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 p-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg mb-4">
                <SkillsLoadingAnimation size="sm" />
                <SkillsLoadingAnimation size="md" />
                <SkillsLoadingAnimation size="lg" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Size Options</h3>
              <p className="text-sm text-gray-600">
                Small, medium, and large variations available
              </p>
            </div>
          </div>
        </Card>

        {/* All Variants Grid */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">🎨 All Variants</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {variants.map(variant => (
              <div key={variant} className="text-center">
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg mb-2">
                  <LoadingSpinner variant={variant} size="lg" color="primary" />
                </div>
                <p className="text-sm font-medium text-gray-700 capitalize">
                  {variant}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Size Variations */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">📏 Size Variations</h2>
          <div className="flex items-center justify-center gap-8">
            {sizes.map(size => (
              <div key={size} className="text-center">
                <div className="flex items-center justify-center p-2">
                  <LoadingSpinner variant="dots" size={size} color="primary" />
                </div>
                <p className="text-sm font-medium text-gray-700 mt-2">
                  {size.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Color Variations */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">🎨 Color Variations</h2>
          <div className="grid md:grid-cols-4 lg:grid-cols-7 gap-4">
            {colors.map(color => (
              <div key={color} className="text-center">
                <div className={`flex items-center justify-center p-4 rounded-lg mb-2 ${
                  color === 'white' ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <LoadingSpinner variant="pulse" size="md" color={color} />
                </div>
                <p className="text-sm font-medium text-gray-700 capitalize">
                  {color}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Loading Components Demo */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Loading Button */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">🔘 Loading Button</h3>
            <div className="space-y-4">
              <LoadingButton
                isLoading={buttonLoading}
                loadingText="Processing..."
                variant="dots"
                onClick={handleButtonClick}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Click to Test Loading
              </LoadingButton>
              
              <p className="text-sm text-gray-600">
                Click the button to see the loading state for 3 seconds
              </p>
            </div>
          </Card>

          {/* Loading Overlay */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">🌐 Loading Overlay</h3>
            <div className="space-y-4">
              <Button
                onClick={showOverlay}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                Show Loading Overlay
              </Button>
              
              <p className="text-sm text-gray-600">
                Click to show a full-screen loading overlay for 3 seconds              </p>
            </div>
          </Card>
        </div>

        {/* SkillLance-Themed Animations */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">🎓 SkillLance-Themed Animations</h2>
          <p className="text-gray-600 mb-6">
            Context-specific loading animations designed for SkillLance platform features
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Campus Network Animation */}
            <div className="text-center">
              <div className="flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 rounded-lg mb-4">
                <CampusNetworkLoadingAnimation size="lg" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Campus Network</h3>
              <p className="text-sm text-gray-600">
                Students from different departments connecting and collaborating
              </p>
            </div>

            {/* Help Requests Animation */}
            <div className="text-center">
              <div className="flex items-center justify-center p-6 bg-gradient-to-br from-red-50 via-orange-50 to-blue-50 rounded-lg mb-4">
                <HelpRequestLoadingAnimation size="lg" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Help Requests</h3>
              <p className="text-sm text-gray-600">
                Help requests being matched with qualified student helpers
              </p>
            </div>

            {/* Skill Building Animation */}
            <div className="text-center">
              <div className="flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 rounded-lg mb-4">
                <SkillBuildingLoadingAnimation size="lg" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Skill Building</h3>
              <p className="text-sm text-gray-600">
                Progressive skill development with floating knowledge particles
              </p>
            </div>

            {/* Collaboration Sync Animation */}
            <div className="text-center">
              <div className="flex items-center justify-center p-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-lg mb-4">
                <CollaborationSyncLoadingAnimation size="lg" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Live Collaboration</h3>
              <p className="text-sm text-gray-600">
                Real-time synchronization between collaborating students
              </p>
            </div>

            {/* Anonymous Mode Animation */}
            <div className="text-center">
              <div className="flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 rounded-lg mb-4">
                <AnonymousModeLoadingAnimation size="lg" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Anonymous Mode</h3>
              <p className="text-sm text-gray-600">
                Privacy-protected interactions with secure identity masking
              </p>
            </div>

            {/* Campus Activities (using existing) */}
            <div className="text-center">
              <div className="flex items-center justify-center p-6 bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 rounded-lg mb-4">
                <CampusLoadingAnimation size="lg" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Campus Activities</h3>
              <p className="text-sm text-gray-600">
                Dynamic campus life with various academic activities
              </p>
            </div>
          </div>
        </Card>

        {/* Loading Skeleton Demo */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">💀 Loading Skeletons</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Text Skeleton</h4>
              <LoadingSkeleton variant="text" lines={4} />
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Card Skeleton</h4>
              <LoadingSkeleton variant="card" />
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Avatar Skeleton</h4>
              <div className="flex items-center gap-3">
                <LoadingSkeleton variant="avatar" />
                <LoadingSkeleton variant="text" lines={2} />
              </div>
            </div>
          </div>
        </Card>

        {/* Performance Info */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="text-lg font-semibold mb-2">⚡ Performance Features</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✅ Anime.js powered smooth animations</li>
            <li>✅ Automatic cleanup on component unmount</li>
            <li>✅ Optimized stagger animations</li>
            <li>✅ Accessibility compliant (ARIA labels)</li>
            <li>✅ Lightweight bundle size impact</li>
            <li>✅ 60fps smooth animations</li>
          </ul>
        </Card>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={overlayVisible}
        variant="magnetic"
        message="Processing your request..."
        backdrop="blur"
      />
    </Layout>
  );
};

export default ComponentTest;