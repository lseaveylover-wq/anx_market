import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiStar } from 'react-icons/fi';

export interface ProductCardProps {
  product: {
    id: number;
    title: string;
    price: number | string;
    image_url?: string;
    stock?: number;
    delivery_time?: string;
    rating?: number;
    sold_count?: number;
    seller?: {
      name?: string;
      avatar?: string;
      level?: number;
      is_verified?: boolean;
    };
  };
  onView?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onView }) => {
  const navigate = useNavigate();

  const handleAction = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onView) onView(product.id);
    else navigate(`/products/${product.id}`);
  };

  const productPrice = Number(product.price || 0).toFixed(0);
  const ratingCount = product.sold_count
    ? product.sold_count >= 1000
      ? `${(product.sold_count / 1000).toFixed(1)}k`
      : String(product.sold_count)
    : '1.3k';
  const productImage = (product as any).image_url || (product as any).image || null;

  return (
    <motion.div
      className="anx-shoe-card"
      onClick={() => handleAction()}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18 }}
    >
      {/* ── Square Image Area ── */}
      <div className="anx-shoe-card-img-box">
        {productImage ? (
          <img
            src={productImage}
            alt={product.title}
            className="anx-shoe-card-img"
          />
        ) : (
          <div className="anx-shoe-card-placeholder">
            {(product.title || 'P').charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* ── Card Body ── */}
      <div className="anx-shoe-card-body">
        {/* Title */}
        <h3 className="anx-shoe-card-title" title={product.title}>
          {product.title}
        </h3>

        {/* Stars */}
        <div className="anx-shoe-card-rating">
          {[1, 2, 3, 4, 5].map((i) => (
            <FiStar key={i} className="anx-shoe-card-star" />
          ))}
          <span className="anx-shoe-card-rating-text">({ratingCount})</span>
        </div>

        {/* Footer with Price and Eye Button */}
        <div className="anx-shoe-card-footer">
          <div className="anx-shoe-card-price-box">
            <span className="anx-shoe-card-price">{productPrice}</span>
            <span className="anx-shoe-card-currency">USD</span>
          </div>

          <button
            type="button"
            className="anx-shoe-card-eye-btn"
            onClick={(e) => handleAction(e)}
            title="View product"
          >
            <FiEye />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
