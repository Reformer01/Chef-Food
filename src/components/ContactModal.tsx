import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, Phone, Mail, MapPin, Clock, Send, Loader2, CheckCircle, HelpCircle, FileText, PhoneCall } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const faqs = [
  {
    question: 'How long does delivery take?',
    answer: 'We typically deliver within 30-45 minutes in Lagos. Delivery times may vary based on your location and traffic conditions. You can track your order in real-time through our app.'
  },
  {
    question: 'What are your delivery charges?',
    answer: 'Delivery is ₦3,500 for orders under ₦15,000. Free delivery on orders above ₦15,000. We also offer free delivery during special promotions.'
  },
  {
    question: 'Can I customize my order?',
    answer: 'Yes! You can add special instructions during checkout such as "less spicy," "no onions," or "extra sauce." Our chefs will accommodate your preferences whenever possible.'
  },
  {
    question: 'Do you cater for events?',
    answer: 'Absolutely! We offer catering services for corporate events, weddings, birthdays, and other special occasions. Contact us via WhatsApp or call for bulk orders and custom packages.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept Paystack (Card, Bank Transfer, USSD), cash on delivery (in select areas), and bank transfers. All online payments are secured with 256-bit SSL encryption.'
  },
  {
    question: 'How do I track my order?',
    answer: 'Once your order is confirmed, you can track its status in real-time through the Orders section in your profile. Status updates include: Pending, Confirmed, Preparing, Out for Delivery, and Delivered.'
  }
];

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'faq' | 'contact'>('faq');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addDoc(collection(db, 'support_tickets'), {
        ...formData,
        userId: user?.uid || null,
        status: 'open',
        createdAt: serverTimestamp()
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    } catch (err) {
      console.error('Error submitting ticket:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-transparent">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-primary" />
                Help & Support
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Contact Cards */}
            <div className="grid grid-cols-2 gap-3 p-4">
              <a
                href="tel:+2348031234567"
                className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100 text-green-700 hover:bg-green-100 transition-colors"
              >
                <PhoneCall className="w-5 h-5" />
                <div>
                  <p className="font-semibold text-sm">Call Us</p>
                  <p className="text-xs">+234 803 123 4567</p>
                </div>
              </a>
              <a
                href="https://wa.me/2348031234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100 text-green-700 hover:bg-green-100 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <div>
                  <p className="font-semibold text-sm">WhatsApp</p>
                  <p className="text-xs">Chat with us</p>
                </div>
              </a>
            </div>

            {/* Operating Hours */}
            <div className="px-4 pb-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm text-gray-900">Opening Hours</p>
                  <p className="text-xs text-gray-500">Mon - Sat: 8:00 AM - 10:00 PM | Sun: 12:00 PM - 9:00 PM</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-4">
              {[
                { id: 'faq', label: 'FAQs', icon: FileText },
                { id: 'contact', label: 'Contact Us', icon: Send }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'faq' ? (
                <div className="space-y-2">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <span className="text-2xl text-gray-400">
                          {expandedFaq === index ? '−' : '+'}
                        </span>
                      </button>
                      <AnimatePresence>
                        {expandedFaq === index && (
                          <motion.div
                            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 pt-0 text-sm text-gray-600 leading-relaxed">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Message Sent!</h3>
                      <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        >
                          <option value="">Select a topic</option>
                          <option value="order-issue">Order Issue</option>
                          <option value="delivery">Delivery Problem</option>
                          <option value="payment">Payment Question</option>
                          <option value="catering">Catering Inquiry</option>
                          <option value="feedback">Feedback</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                          placeholder="How can we help you?"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-primary hover:bg-primary-hover disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                        ) : (
                          <><Send className="w-5 h-5" /> Send Message</>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
