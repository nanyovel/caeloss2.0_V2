import { reviewSchema } from "./reviewSchema";

export const commentSchema = {
  ...reviewSchema,
  // 0-visible
  // 1-Eliminado
  estadoDoc: 0,
  id: "",
};
