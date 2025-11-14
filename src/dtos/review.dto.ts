export type CreateReviewDto = {
  title: string;
  description: string;
  rating: number;
  productId: number;
};

export type UpdateReviewDto = {
  title?: string;
  description?: string;
  rating?: number;
};

export type GetReviewParamsDto = {
  id: string;
};
