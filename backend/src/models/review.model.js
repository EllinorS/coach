import { db } from "../config/db.js";

//create review
export const createReview = async (
  clientName,
  clientCountry,
  content,
  rating,
  productType,
  isVisible,
  position,
  reviewDate,
) => {
  const [result] = await db.query(
    `INSERT INTO reviews (client_name, client_country, content, rating, product_type, is_visible, position, review_date ) VALUES (?,?,?,?,?,?,?,?)`,
    [
      clientName,
      clientCountry,
      content,
      rating,
      productType,
      isVisible,
      position,
      reviewDate,
    ],
  );
  return result.insertId
};

// find all reviews

export const findAllReviews = async () => {
  const [rows] = await db.query(`SELECT * FROM reviews`);
  return rows;
};

//find review by id

export const findReviewById = async (reviewId) => {
  const [rows] = await db.query(`SELECT * FROM reviews WHERE id = ?`, [
    reviewId,
  ]);
  return rows[0];
};

// find visible reviews 
export const findVisibleReviews = async () => {
  const [rows] = await db.query(`SELECT * FROM reviews WHERE is_visible = 1 ORDER BY position ASC`)
  return rows
}

//update review

export const updateReview = async (
reviewId, data
) => {
  const [result] = await db.query(
    `UPDATE reviews SET client_name = ?, client_country = ?, content = ?, rating = ?, product_type = ?, is_visible = ?, position = ?, review_date = ? WHERE id= ?`,
    [
      data.clientName,
      data.clientCountry,
      data.content,
      data.rating,
      data.productType,
      data.isVisible,
      data.position,
      data.reviewDate,
      reviewId
    ],
  );
  return result.affectedRows
};

// delete review

export const deleteReviewById = async (reviewId) => {
  const [result] = await db.query(`DELETE FROM reviews WHERE id=?`, [
    reviewId,
  ]);
  return result.affectedRows;
};