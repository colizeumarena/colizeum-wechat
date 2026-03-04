const {
  request
} = require('../utils/request.js');
const authService = require('./auth-service.js');

function getFixedRateData() {
  return request({
    path: '/api/get_fixed_rate_data',
    method: 'GET',
    headers: authService.getAuthorizationHeader()
  });
}

module.exports = {
  getFixedRateData
};
