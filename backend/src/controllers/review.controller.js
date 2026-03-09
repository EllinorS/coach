import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import * as reviewModel from "../models/review.model.js";

export const createReview = asyncHandler(async (req, res) => {
  const {
    clientName,
    clientCountry,
    content,
    rating,
    productType,
    isVisible,
    position,
    reviewDate,
  } = req.body;

  const createdReview = await reviewModel.createReview(
    clientName,
    clientCountry ?? null,
    content,
    rating,
    productType,
    isVisible ?? 1,
    position ?? 0,
    reviewDate ?? null,
  );
  res.status(201).json({ message: "Review created", createdReview });
});

// get all reviews
export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewModel.findAllReviews();
  res.json(reviews);
});
// get review by id
export const getReviewById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const review = await reviewModel.findReviewById(id);
  if (!review) return res.status(404).json({ message: "Review not found." });

  res.status(200).json(review);
});

// get visible reviews

export const getVisibleReviews = asyncHandler(async (req, res) => {
    const reviews = await reviewModel.findVisibleReviews()
    res.json(reviews)
})


// update review

export const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existingReview = await reviewModel.findReviewById(id);
  if (!existingReview)
    return res.status(404).json({ message: "Review not found." });
  const updatedData = {
    clientName: req.body.clientName ?? existingReview.client_name,
    clientCountry: req.body.clientCountry ?? existingReview.client_country,
    content: req.body.content ?? existingReview.content,
    rating: req.body.rating ?? existingReview.rating,
    productType: req.body.productType ?? existingReview.product_type,
    isVisible: req.body.isVisible ?? existingReview.is_visible,
    position: req.body.position ?? existingReview.position,
    reviewDate: req.body.reviewDate ?? existingReview.review_date,
  };

  await reviewModel.updateReview(id, updatedData);

  res.status(200).json({ message: "Review updated" });
});

// delete review

export const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existingReview = await reviewModel.findReviewById(id);

  if (!existingReview)
    return res.status(404).json({ message: "Review not found." });

  await reviewModel.deleteReviewById(id);
  res.status(200).json({ message: "Review deleted" });
});
