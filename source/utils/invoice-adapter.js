function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function pickFirstArray(obj, keys) {
  if (!isObject(obj)) {
    return null;
  }
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (Array.isArray(obj[key])) {
      return obj[key];
    }
  }
  return null;
}

function extractList(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  const direct = pickFirstArray(payload, ['items', 'data', 'results', 'facturas', 'invoices']);
  if (direct) {
    return direct;
  }

  if (isObject(payload) && isObject(payload.data)) {
    const nested = pickFirstArray(payload.data, ['items', 'results', 'facturas', 'invoices', 'data']);
    if (nested) {
      return nested;
    }
  }

  return [];
}

function extractNumber(payload, keys) {
  if (!payload) {
    return null;
  }
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const value = payload[key];
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string' && value && !isNaN(Number(value))) {
      return Number(value);
    }
  }
  return null;
}

function normalizeDate(value) {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
      return trimmed;
    }
    const m = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      return `${m[3]}/${m[2]}/${m[1]}`;
    }
    return trimmed;
  }

  if (typeof value === 'number') {
    const d = new Date(value);
    if (isNaN(d.getTime())) {
      return '';
    }
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = String(d.getFullYear());
    return `${dd}/${mm}/${yyyy}`;
  }

  return '';
}

function normalizeStatus(value) {
  if (!value) {
    return 'unpaid';
  }
  if (value === 'paid' || value === 'unpaid') {
    return value;
  }
  if (typeof value === 'boolean') {
    return value ? 'paid' : 'unpaid';
  }
  if (typeof value === 'number') {
    return value === 1 ? 'paid' : 'unpaid';
  }
  const s = String(value).toLowerCase();
  if (s.includes('paid') || s.includes('pag')) {
    return 'paid';
  }
  if (s.includes('unpaid') || s.includes('pend')) {
    return 'unpaid';
  }
  return 'unpaid';
}

function normalizeInvoiceItem(item) {
  if (!isObject(item)) {
    return null;
  }

  
  
  
  
  
  
  
  
  

  const id = item.id || item.numDoc || '';
  const date = normalizeDate(item.fechaEmision || item.date || item.created_at);
  const periodStart = normalizeDate(item.fechaInicio || item.period_start);
  const periodEnd = normalizeDate(item.fechaFin || item.period_end);
  const status = normalizeStatus(item.pagado !== undefined ? item.pagado : item.status);

  
  let amount = item.importe || item.amount || 0;

  return {
    id: String(id),
    title: String(id),
    date: date,
    period_start: periodStart,
    period_end: periodEnd,
    amount: amount,
    currency: '€',
    status: status,
    download_url: item.facturaUrl || item.download_url || '',
    original: item
  };
}

function normalizeInvoicesResponse(payload, params) {
  const list = extractList(payload);
  const invoices = list.map(normalizeInvoiceItem).filter(x => x && x.id);

  const root = isObject(payload) ? payload : {};
  const dataObj = isObject(root.data) ? root.data : {};

  const total = extractNumber(root, ['total', 'totalCount', 'count']) ?? extractNumber(dataObj, ['total', 'totalCount', 'count']);
  const pageSize = extractNumber(root, ['pageSize', 'perPage', 'limit']) ?? extractNumber(dataObj, ['pageSize', 'perPage', 'limit']);
  const page = (params && params.page) || extractNumber(root, ['page']) || extractNumber(dataObj, ['page']) || 1;
  const pages = extractNumber(root, ['pages', 'totalPages']) ?? extractNumber(dataObj, ['pages', 'totalPages']);

  let hasMore = null;
  if (typeof root.hasMore === 'boolean') {
    hasMore = root.hasMore;
  } else if (typeof dataObj.hasMore === 'boolean') {
    hasMore = dataObj.hasMore;
  } else if (typeof pages === 'number') {
    hasMore = page < pages;
  } else if (typeof total === 'number' && typeof pageSize === 'number') {
    hasMore = page * pageSize < total;
  } else if (typeof pageSize === 'number') {
    hasMore = invoices.length >= pageSize;
  }

  return {
    invoices,
    total,
    hasMore
  };
}

module.exports = {
  normalizeInvoicesResponse,
  normalizeInvoiceItem
};