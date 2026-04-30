import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Send, Loader2, User as UserIcon, ThumbsUp, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface ProductReviewProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  createdAt: string;
  likes: number;
}

export default function ProductReview({ isOpen, onClose, productId, productName }: ProductReviewProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && productId) {
      fetchReviews();
    }
  }, [isOpen, productId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'reviews'), where('productId', '==', productId));
      const querySnapshot = await getDocs(q);
      const fetchedReviews: Review[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedReviews.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() 
            ? data.createdAt.toDate().toISOString() 
            : data.createdAt
        } as Review);
        
        if (data.userId === user?.uid) {
          setHasReviewed(true);
        }
      });
      
      fetchedReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setReviews(fetchedReviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      setError('Please login to submit a review');
      return;
    }
    
    if (comment.trim().length < 5) {
      setError('Please write at least 5 characters');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      await addDoc(collection(db, 'reviews'), {
        productId,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL || null,
        rating,
        comment: comment.trim(),
        createdAt: serverTimestamp(),
        likes: 0
      });
      
      setHasReviewed(true);
      setComment('');
      setRating(5);
      setSuccess('Review submitted successfully!');
      fetchReviews();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeReview = async (reviewId: string) => {
    if (!user) return;
    
    try {
      const reviewRef = doc(db, 'reviews', reviewId);
      const review = reviews.find(r => r.id === reviewId);
      if (review) {
        await updateDoc(reviewRef, {
          likes: review.likes + 1
        });
        fetchReviews();
      }
    } catch (err) {
      console.error('Error liking review:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

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
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
                <p className="text-sm text-gray-500">{productName}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Rating Summary */}
            <div className="px-6 py-4 bg-gradient-to-r from-primary/5 to-transparent border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-gray-900">{averageRating}</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${star <= Math.round(parseFloat(averageRating)) ? 'fill-primary text-primary' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                  <div className="mt-2 space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter(r => r.rating === star).length;
                      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2 text-xs">
                          <span className="w-3">{star}</span>
                          <Star className="w-3 h-3 text-primary" />
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="w-6 text-right text-gray-500">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm"
              >
                {success}
              </motion.div>
            )}

            {/* Write Review */}
            {user && !hasReviewed && (
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star 
                            className={`w-8 h-8 ${star <= rating ? 'fill-primary text-primary' : 'text-gray-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience with this dish..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSubmitReview}
                    disabled={submitting || comment.trim().length < 5}
                    className="w-full bg-primary hover:bg-primary-hover disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                    ) : (
                      <><Send className="w-5 h-5" /> Submit Review</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {user && hasReviewed && (
              <div className="mx-6 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 text-sm text-center">
                You have already reviewed this product
              </div>
            )}

            {!user && (
              <div className="mx-6 mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-600 text-sm text-center">
                Please login to write a review
              </div>
            )}

            {/* Reviews List */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-500">Be the first to review this product!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center overflow-hidden shrink-0">
                          {review.userPhoto ? (
                            <img src={review.userPhoto} alt={review.userName} className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                            <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`w-4 h-4 ${star <= review.rating ? 'fill-primary text-primary' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                      <div className="flex items-center justify-between mt-3">
                        <button
                          onClick={() => handleLikeReview(review.id)}
                          className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          {review.likes > 0 && <span>{review.likes}</span>}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
