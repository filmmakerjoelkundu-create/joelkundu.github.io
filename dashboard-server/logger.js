/**
 * Universal Logger - Works in Browser and Node.js
 * 
 * Features:
 * - Configurable log levels (debug, info, warn, error)
 * - Environment-aware (silent in production)
 * - Structured logging with timestamps
 * - No external dependencies
 * 
 * Usage:
 *   const logger = createLogger('ComponentName', { level: 'info' });
 *   logger.debug('Debug message');  // Only shown if level is 'debug'
 *   logger.info('Info message');    // Shown if level is 'info' or lower
 *   logger.warn('Warning message'); // Always shown
 *   logger.error('Error message');  // Always shown
 */

// Log levels (lower number = higher priority)
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4
};

// Default configuration
const DEFAULT_CONFIG = {
  level: typeof window !== 'undefined' && window.location?.hostname !== 'localhost' 
    ? 'error'  // Production: only errors
    : 'debug', // Development: all logs
  prefix: 'APP',
  useColors: true,
  timestamp: true
};

// Color codes for terminal (Node.js) and browser
const COLORS = {
  reset: '\x1b[0m',
  debug: '\x1b[36m',  // Cyan
  info: '\x1b[32m',   // Green
  warn: '\x1b[33m',   // Yellow
  error: '\x1b[31m',  // Red
};

/**
 * Format timestamp
 */
function formatTimestamp() {
  return new Date().toISOString();
}

/**
 * Format log message with level, component, and timestamp
 */
function formatMessage(level, component, message, args) {
  const timestamp = DEFAULT_CONFIG.timestamp ? `[${formatTimestamp()}] ` : '';
  const levelStr = level.toUpperCase();
  const componentStr = component ? `[${component}]` : '';
  
  return {
    formatted: `${timestamp}[${levelStr}]${componentStr} ${message}`,
    args: args || []
  };
}

/**
 * Browser console with styles
 */
function logToBrowser(level, formatted, args) {
  const style = DEFAULT_CONFIG.useColors ? `color: ${getColorForLevel(level)}` : '';
  const styledMessage = `%c${formatted}`;
  
  switch (level) {
    case 'debug':
      console.debug(styledMessage, style, ...args);
      break;
    case 'info':
      console.info(styledMessage, style, ...args);
      break;
    case 'warn':
      console.warn(styledMessage, style, ...args);
      break;
    case 'error':
      console.error(styledMessage, style, ...args);
      break;
  }
}

/**
 * Node.js console (for server-side)
 */
function logToNode(level, formatted, args) {
  const color = COLORS[level] || COLORS.reset;
  const message = DEFAULT_CONFIG.useColors ? `${color}${formatted}${COLORS.reset}` : formatted;
  
  switch (level) {
    case 'debug':
      console.debug(message, ...args);
      break;
    case 'info':
      console.info(message, ...args);
      break;
    case 'warn':
      console.warn(message, ...args);
      break;
    case 'error':
      console.error(message, ...args);
      break;
  }
}

/**
 * Get color for log level
 */
function getColorForLevel(level) {
  const colors = {
    debug: '#00bcd4',  // Cyan
    info: '#4caf50',   // Green
    warn: '#ff9800',   // Orange
    error: '#f44336'   // Red
  };
  return colors[level] || '#000000';
}

/**
 * Check if message should be logged based on level
 */
function shouldLog(level, configLevel) {
  const logLevelValue = LOG_LEVELS[level] ?? LOG_LEVELS.silent;
  const configLevelValue = LOG_LEVELS[configLevel] ?? LOG_LEVELS.silent;
  return logLevelValue >= configLevelValue;
}

/**
 * Create a logger instance
 */
function createLogger(component = 'APP', config = {}) {
  const loggerConfig = { ...DEFAULT_CONFIG, ...config };
  const isBrowser = typeof window !== 'undefined';
  const logFunction = isBrowser ? logToBrowser : logToNode;
  
  return {
    debug: (message, ...args) => {
      if (shouldLog('debug', loggerConfig.level)) {
        const { formatted, args: extraArgs } = formatMessage('debug', component, message, args);
        logFunction('debug', formatted, [...extraArgs, ...args]);
      }
    },
    info: (message, ...args) => {
      if (shouldLog('info', loggerConfig.level)) {
        const { formatted, args: extraArgs } = formatMessage('info', component, message, args);
        logFunction('info', formatted, [...extraArgs, ...args]);
      }
    },
    warn: (message, ...args) => {
      if (shouldLog('warn', loggerConfig.level)) {
        const { formatted, args: extraArgs } = formatMessage('warn', component, message, args);
        logFunction('warn', formatted, [...extraArgs, ...args]);
      }
    },
    error: (message, ...args) => {
      if (shouldLog('error', loggerConfig.level)) {
        const { formatted, args: extraArgs } = formatMessage('error', component, message, args);
        logFunction('error', formatted, [...extraArgs, ...args]);
      }
    },
    // Set log level dynamically
    setLevel: (newLevel) => {
      loggerConfig.level = newLevel;
    },
    // Get current log level
    getLevel: () => loggerConfig.level
  };
}

// Export for both browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createLogger, LOG_LEVELS };
}

// Auto-expose to window for browser usage
if (typeof window !== 'undefined') {
  window.createLogger = createLogger;
  window.LOG_LEVELS = LOG_LEVELS;
}
