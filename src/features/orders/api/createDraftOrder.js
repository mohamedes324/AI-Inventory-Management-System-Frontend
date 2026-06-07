import api from "@/shared/api/axios";

/**
 * @function createDraftOrder
 * @description Creates a new draft order.
 * POST /api/Orders/draft — no body required.
 * @returns {Promise<{ orderId: number, rowVersion: string }>}
 */
export const createDraftOrder = async () => {
  const res = await api.post("/Orders/draft");
  return res.data;
};
