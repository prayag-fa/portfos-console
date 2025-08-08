// Error types
export const ERROR_TYPES = {
  NETWORK: "NETWORK_ERROR",
  VALIDATION: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  SERVER: "SERVER_ERROR"
};

// Error messages
export const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: "Network connection failed. Please check your internet connection.",
  [ERROR_TYPES.VALIDATION]: "Invalid data provided. Please check your input.",
  [ERROR_TYPES.NOT_FOUND]: "The requested resource was not found.",
  [ERROR_TYPES.UNAUTHORIZED]: "You are not authorized to access this resource.",
  [ERROR_TYPES.SERVER]: "Server error occurred. Please try again later."
};

// Error handler class
export class AppError extends Error {
  constructor(type, message, details = null) {
    super(message || ERROR_MESSAGES[type]);
    this.type = type;
    this.details = details;
    this.timestamp = new Date();
  }
}

// Error handling utilities
export const handleError = (error, context = "") => {
  console.error(`Error in ${context}:`, error);
  
  if (error instanceof AppError) {
    return {
      type: error.type,
      message: error.message,
      details: error.details
    };
  }
  
  // Handle different error types
  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return new AppError(ERROR_TYPES.NETWORK);
  }
  
  if (error.status === 404) {
    return new AppError(ERROR_TYPES.NOT_FOUND);
  }
  
  if (error.status === 401 || error.status === 403) {
    return new AppError(ERROR_TYPES.UNAUTHORIZED);
  }
  
  if (error.status >= 500) {
    return new AppError(ERROR_TYPES.SERVER);
  }
  
  return new AppError(ERROR_TYPES.SERVER, error.message);
};

// Validation utilities
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    throw new AppError(ERROR_TYPES.VALIDATION, `${fieldName} is required`);
  }
  return true;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError(ERROR_TYPES.VALIDATION, "Invalid email format");
  }
  return true;
}; 