const {
  request
} = require('../utils/request.js');

const STORAGE_KEYS = {
  token: 'auth.token',
  prefix: 'auth.prefix',
  codcli: 'auth.codcli',
  contratos: 'auth.contratos'
};

function setAuthFromLoginResponse(payload) {
  if (!payload || typeof payload !== 'object') {
    return;
  }

  if (payload.token) {
    wx.setStorageSync(STORAGE_KEYS.token, payload.token);
  } else if (payload.id_token) {
    
    wx.setStorageSync(STORAGE_KEYS.token, payload.id_token);
  }

  if (payload.authorization_prefix) {
    wx.setStorageSync(STORAGE_KEYS.prefix, payload.authorization_prefix);
  }

  if (Array.isArray(payload.contratos)) {
    wx.setStorageSync(STORAGE_KEYS.contratos, payload.contratos);
    if (!getCodcli() && payload.contratos.length > 0) {
      wx.setStorageSync(STORAGE_KEYS.codcli, payload.contratos[0]);
    }
  }
}

function clearAuth() {
  Object.keys(STORAGE_KEYS).forEach(k => {
    try {
      wx.removeStorageSync(STORAGE_KEYS[k]);
    } catch (e) {}
  });
}

function getRawToken() {
  return wx.getStorageSync(STORAGE_KEYS.token) || '';
}

function getPrefix() {
  return wx.getStorageSync(STORAGE_KEYS.prefix) || '';
}

function getCodcli() {
  return wx.getStorageSync(STORAGE_KEYS.codcli) || '';
}

function setCodcli(codcli) {
  if (!codcli) {
    return;
  }
  wx.setStorageSync(STORAGE_KEYS.codcli, codcli);
}

function buildFullToken() {
  const rawToken = getRawToken();
  

  if (!rawToken) {
    return '';
  }

  

  return rawToken;
}

function getAuthorizationHeader() {
  const token = buildFullToken();
  if (!token) {
    return {};
  }
  return {
    Authorization: `Bearer ${token}`
  };
}

async function login(email, password) {
  const payload = await request({
    path: '/api/login',
    method: 'POST',
    data: {
      email,
      password
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });

  setAuthFromLoginResponse(payload);
  return payload;
}

function authCheck() {
  return request({
    path: '/api/auth/check',
    method: 'GET',
    headers: getAuthorizationHeader()
  });
}

function isRoleAdmin() {
  return request({
    path: '/api/auth/isroleadmin',
    method: 'GET',
    headers: getAuthorizationHeader()
  });
}

module.exports = {
  STORAGE_KEYS,
  login,
  authCheck,
  isRoleAdmin,
  clearAuth,
  getAuthorizationHeader,
  getCodcli,
  setCodcli
};