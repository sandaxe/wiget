import DataService from '../shared/service';

export const MainService = {
  getIncomingOrders(page, limit) {
    return DataService.get(`v1/inventory/marketplace/pending_orders`, { q: { page: page, limit: limit } });
  },
  getCheckoutRequestList(page, limit) {
    return DataService.get(`v1/inventory/marketplace/requested_orders`, { q: { page: page, limit: limit } });
  },
  getCartList(page = 1, limit = 200) {
    return DataService.get(`v1/inventory/marketplace/cart`, { query: { page: page, limit: limit } });
  },
  checkOut() {
    return DataService.post(`v1/inventory/marketplace/cart/purchase`);
  },
  reject(requestId) {
    return DataService.post(`v1/inventory/marketplace/pending_orders/${requestId}/reject`);
  },
  approve(requestId) {
    return DataService.post(`v1/inventory/my_inventory/pending_orders/${requestId}/approve`);
  },
  removeFromCart(requestId) {
    return DataService.post(`v1/inventory/marketplace/cart/remove/${requestId}`);
  },
  myAcceptedOrders: () => DataService.get(`v1/inventory/marketplace/my_accepted_orders`),
  acceptedOrders: () => DataService.get(`v1/inventory/marketplace/accepted_orders`),
  myOrdersHistory: () => DataService.get(`v1/inventory/marketplace/my_orders_history`),
  ordersHistory: () => DataService.get(`v1/inventory/marketplace/orders_history`),
  getUserSettings: (userId) => DataService.get(`v1/accounts/users/${userId}`),
  getBuisnessSettings: () => DataService.get(`v1/accounts/account`),
  //All Test Functions
  getIncomingOrdersTest(page, limit) {
    return DataService.get(`v1/inventory/marketplace/pending_orders/test`, { q: { page: page, limit: limit } });
  },
  getCheckoutRequestListTest(page, limit) {
    return DataService.get(`v1/inventory/marketplace/requested_orders/test`, { q: { page: page, limit: limit } });
  },
  checkOutTest() {
    return DataService.post(`v1/inventory/marketplace/cart/test/purchase`);
  },
  rejectTest(requestId) {
    return DataService.post(`v1/inventory/marketplace/pending_orders/${requestId}/reject/test`);
  },
  approveTest(requestId) {
    return DataService.post(`v1/inventory/my_inventory/pending_orders/${requestId}/approve/test`);
  },
  myAcceptedOrdersTest: () => DataService.get(`v1/inventory/marketplace/my_accepted_orders/test`),
  acceptedOrdersTest: () => DataService.get(`v1/inventory/marketplace/accepted_orders/test`),
  myOrdersHistoryTest: () => DataService.get(`v1/inventory/marketplace/my_orders_history/test`),
  ordersHistoryTest: () => DataService.get(`v1/inventory/marketplace/orders_history/test`)
};
