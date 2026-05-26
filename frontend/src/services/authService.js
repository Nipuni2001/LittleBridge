const TOKEN_KEYS = ['lb_token', 'token'];  // check new then old
const USER_KEYS  = ['lb_user',  'user'];   // check new then old

/** Primary keys for writing */
const WRITE_TOKEN = 'lb_token';
const WRITE_USER  = 'lb_user';

/**
 * Normalise any user/admin object into a consistent shape with camelCase keys.
 * Handles regular users, admin objects (with 'role'), and old snake_case objects.
 */
function normaliseUser(raw) {
  if (!raw || typeof raw !== 'object') return null;

  // Determine userType — handle all possible field names
  const userType =
    raw.userType    ||  // already normalised
    raw.user_type   ||  // snake_case from DB
    raw.role        ||  // admin objects use 'role'
    null;

  if (!userType) return null;  // useless without a role

  return {
    userId:    raw.userId    || raw.user_id   || raw.adminId || raw.id || null,
    email:     raw.email     || raw.username  || '',
    firstName: raw.firstName || raw.first_name || (raw.fullName?.split(' ')[0]) || raw.username || 'User',
    lastName:  raw.lastName  || raw.last_name  || (raw.fullName?.split(' ').slice(1).join(' ')) || '',
    userType,
    isGuest:   Boolean(raw.isGuest || raw.is_guest),
    phone:     raw.phone  || null,
    city:      raw.city   || null,
    country:   raw.country || 'Sri Lanka',
  };
}

function safeGet(keys) {
  for (const key of keys) {
    try {
      const v = localStorage.getItem(key);
      if (v) return v;
    } catch {}
  }
  return null;
}

function safeSet(key, value) {
  try { localStorage.setItem(key, value); } catch {}
}

function safeDel(key) {
  try { localStorage.removeItem(key); } catch {}
}

const authService = {

  /** Store normalised user + token (always uses new keys) */
  setSession(token, user) {
    const normalised = normaliseUser(user);
    if (!normalised) return;
    safeSet(WRITE_TOKEN, token);
    safeSet(WRITE_USER, JSON.stringify(normalised));
  },

  /**
   * Get current user — checks BOTH old and new localStorage keys.
   * Validates JWT structure and expiry. Never throws. Returns null on any issue.
   */
  getCurrentUser() {
    try {
      // Read token from either key set
      const token = safeGet(TOKEN_KEYS);
      if (!token) return null;

      // Validate JWT structure (3 parts)
      const parts = token.split('.');
      if (parts.length !== 3) {
        this.clearSession();
        return null;
      }

      // Decode payload and check expiry (no library needed)
      try {
        const pad     = s => s + '='.repeat((4 - s.length % 4) % 4);
        const payload = JSON.parse(atob(pad(parts[1])));
        if (payload.exp && Date.now() / 1000 > payload.exp) {
          this.clearSession();
          return null;
        }
      } catch {
        // If decode fails, token is malformed
        this.clearSession();
        return null;
      }

      // Read user from either key set
      const raw = safeGet(USER_KEYS);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      const user   = normaliseUser(parsed);

      if (!user || !user.userType) {
        this.clearSession();
        return null;
      }

      // Migrate to new keys if token was in old key
      if (!localStorage.getItem(WRITE_TOKEN)) {
        safeSet(WRITE_TOKEN, token);
        safeSet(WRITE_USER, JSON.stringify(user));
      }

      return user;

    } catch {
      this.clearSession();
      return null;
    }
  },

  getToken() {
    return safeGet(TOKEN_KEYS);
  },

  /** Clear ALL possible key combinations */
  clearSession() {
    [...TOKEN_KEYS, ...USER_KEYS].forEach(safeDel);
  },

  // ── API calls ──────────────────────────────────────────────────

  async login(email, password) {
    const { default: api } = await import('./api');
    const { data } = await api.post('/auth/login', { email, password });
    if (!data.success) throw new Error(data.message || 'Login failed');
    this.setSession(data.token, data.user);
    return { ...data, user: normaliseUser(data.user) };
  },

  async register(userData) {
    const { default: api } = await import('./api');
    const { data } = await api.post('/auth/register', userData);
    if (!data.success) throw new Error(data.message || 'Registration failed');
    this.setSession(data.token, data.user);
    return { ...data, user: normaliseUser(data.user) };
  },

  async guestLogin() {
    const { default: api } = await import('./api');
    const { data } = await api.post('/auth/guest-login');
    if (!data.success) throw new Error(data.message || 'Guest login failed');
    this.setSession(data.token, data.user);
    return { ...data, user: normaliseUser(data.user) };
  },

  logout() {
    this.clearSession();
  },
};

export default authService;
