const rules = {
  RETAILER: {
    static: [
      "dashboard:marketplace",
      "dashboard:myorders",
      "dashboard:tryon",
      "dashboard:virtualmirror",
      "dashboard:customers",
      "dashboard:settings",
      "dashboard:logout"
    ]
  },
  WHOLESALER: {
    static: [
      "dashboard:marketplace",
      "dashboard:myorders",
      "dashboard:tryon",
      "dashboard:virtualmirror",
      "dashboard:customers",
      "dashboard:settings",
      "dashboard:logout",
      "dashboard:incomingorders",
      "dashboard:inventories"
    ]
  },
  BRANDS: {
    static: [
      "dashboard:marketplace",
      "dashboard:myorders",
      "dashboard:tryon",
      "dashboard:virtualmirror",
      "dashboard:customers",
      "dashboard:settings",
      "dashboard:logout",
      "dashboard:incomingorders",
      "dashboard:inventories"
    ]
  },
  EXECUTIVE_BRAND: {
    static: [
      "dashboard:dashboard",
      "dashboard:settings",
      "dashboard:logout",
      "dashboard:virtualmirror",
      "dashboard:inventories",
      "dashboard:integration"
    ]
  }
};
export { rules };
