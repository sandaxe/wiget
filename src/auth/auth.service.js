import DataService from '../shared/service';

export const AuthService = {
  verify: (credential) => DataService.post(`v1/accounts/auth/accounts/verify`, { data: credential }),

  cancelotp: (credential) => DataService.post(`v1/accounts/auth/accounts/cancelotp`, { data: credential }),

  setPassword: (credential) => DataService.post(`v1/accounts/auth/accounts/setpassword`, { data: credential }),

  signUp: (data) => DataService.post(`v1/accounts/auth/accounts`, { data: data }),

  resendOTP: (data) => DataService.patch(`v1/accounts/auth/accounts/resendotp`, { data: data })
};
