const {
  request
} = require('../utils/request.js');
const authService = require('./auth-service.js');

function getMyContratos() {
  return request({
    path: '/api/me/contratos',
    method: 'GET',
    headers: authService.getAuthorizationHeader()
  });
}

function getFacturas(codcli, page) {
  return request({
    path: `/api/facturas/${encodeURIComponent(String(codcli || ''))}`,
    method: 'GET',
    query: {
      page
    },
    headers: authService.getAuthorizationHeader()
  });
}

function getContrato(codcli) {
  return request({
    path: `/api/contratos/${encodeURIComponent(String(codcli || ''))}`,
    method: 'GET',
    headers: authService.getAuthorizationHeader()
  });
}

module.exports = {
  getMyContratos,
  getFacturas,
  getContrato
};

