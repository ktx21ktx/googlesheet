require('dotenv').config();

const config = {
  SHEET_ID: process.env.SHEET_ID || '',
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  validate() {
    if (!this.SHEET_ID) {
      throw new Error('SHEET_ID_MISSING');
    }
    if (typeof this.SHEET_ID !== 'string' || this.SHEET_ID.trim().length === 0) {
      throw new Error('SHEET_ID_INVALID');
    }
  },

  maskSheetId() {
    if (this.SHEET_ID.length <= 10) return '***';
    return this.SHEET_ID.substring(0, 6) + '...' + this.SHEET_ID.substring(this.SHEET_ID.length - 4);
  },

  isDevelopment() {
    return this.NODE_ENV === 'development';
  },

  isProduction() {
    return this.NODE_ENV === 'production';
  },
};

module.exports = config;
