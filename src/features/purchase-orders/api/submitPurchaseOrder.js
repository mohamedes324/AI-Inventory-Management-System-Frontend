import api from "@/shared/api/axios";

/**
 * @function submitPurchaseOrder
 * @description Submits a new purchase order.
 * @param {Object} payload
 * @param {number} payload.supplierId
 * @param {Array<{productId:number, quantity:number, unitCost:number, expiryDate:string, discountPercentage:number}>} payload.items
 * @returns {Promise<Object>} Created purchase order
 */
export const submitPurchaseOrder = async (payload) => {
  const res = await api.post("/PurchaseOrders/submit", payload);
  return res.data;
};
