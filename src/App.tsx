/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Products from './components/Products';
import SpecialCombo from './components/SpecialCombo';
import Menu from './components/Menu';
import Celebration from './components/Celebration';
import BestSellers from './components/BestSellers';
import Testimonials from './components/Testimonials';
import Gallery from './components/Gallery';
import Blog from './components/Blog';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

export default function App() {
  return (
    <div className="min-h-screen font-sans text-gray-900">
      <Header />
      <main>
        <Hero />
        <About />
        <Products />
        <SpecialCombo />
        <Menu />
        <Celebration />
        <BestSellers />
        <Testimonials />
        <Gallery />
        <Blog />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
