const DEFAULT_BASE_URL = "https://lumisa.es";
const DEFAULT_BASIC_AUTH_USERNAME = "seocom";
const DEFAULT_BASIC_AUTH_PASSWORD = "pre12$$!";

const BASE64_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function normalizePath(path) {
  if (!path) {
    return "/";
  }
  return path.startsWith("/") ? path : `/${path}`;
}

function toQueryString(query) {
  if (!query) {
    return "";
  }
  const parts = [];
  Object.keys(query).forEach((key) => {
    const value = query[key];
    if (value === undefined || value === null || value === "") {
      return;
    }
    parts.push(
      `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    );
  });
  if (parts.length === 0) {
    return "";
  }
  return `?${parts.join("&")}`;
}

function getBaseUrl() {
  const stored = wx.getStorageSync("api.baseUrl");
  if (typeof stored === "string" && stored) {
    return stored;
  }
  return DEFAULT_BASE_URL;
}

function base64EncodeAscii(input) {
  const str = String(input || "");
  let output = "";
  let i = 0;
  while (i < str.length) {
    const chr1 = str.charCodeAt(i++);
    const chr2 = str.charCodeAt(i++);
    const chr3 = str.charCodeAt(i++);

    const enc1 = chr1 >> 2;
    const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    let enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    let enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = 64;
      enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }

    output += BASE64_CHARS.charAt(enc1);
    output += BASE64_CHARS.charAt(enc2);
    output += BASE64_CHARS.charAt(enc3);
    output += BASE64_CHARS.charAt(enc4);
  }
  return output;
}

function getBasicAuthHeaderValue() {
  const storedUsername = wx.getStorageSync("api.basic.username");
  const storedPassword = wx.getStorageSync("api.basic.password");

  const username =
    typeof storedUsername === "string" && storedUsername
      ? storedUsername
      : DEFAULT_BASIC_AUTH_USERNAME;
  const password =
    typeof storedPassword === "string" && storedPassword
      ? storedPassword
      : DEFAULT_BASIC_AUTH_PASSWORD;

  const token = base64EncodeAscii(`${username}:${password}`);
  return `Basic ${token}`;
}

function mergeHeadersWithEdgeAuth(headers) {
  const merged = {
    ...(headers || {}),
  };

  const hasBearerInAuthorization =
    typeof merged.Authorization === "string" &&
    merged.Authorization.startsWith("Bearer ");

  const hasAuthorizationLower = typeof merged.authorization === "string";
  if (hasBearerInAuthorization || hasAuthorizationLower) {
    return merged;
  }
  if (
    typeof merged.Authorization !== "string" &&
    typeof merged.authorization !== "string"
  ) {
    merged.Authorization = getBasicAuthHeaderValue();
  }

  return merged;
}

function request(options) {
  const {
    path,
    method = "GET",
    data,
    headers = {},
    query,
    timeout = 15000,
    baseUrl,
  } = options || {};

  const url = `${baseUrl || getBaseUrl()}${normalizePath(path)}${toQueryString(query)}`;
  const finalHeaders = mergeHeadersWithEdgeAuth(headers);

  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      data,
      header: finalHeaders,
      timeout,
      success: (res) => {
        if (res && res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
          return;
        }
        reject({
          statusCode: res ? res.statusCode : 0,
          data: res ? res.data : undefined,
          errMsg: (res && res.errMsg) || "Request failed",
        });
      },
      fail: (err) => {
        reject({
          statusCode: 0,
          data: undefined,
          errMsg: (err && err.errMsg) || "Network error",
        });
      },
    });
  });
}

module.exports = {
  request,
  getBaseUrl,
};
