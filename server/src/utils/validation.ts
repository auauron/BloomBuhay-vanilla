import { UserSignupRequest, UserLoginRequest } from "../types/User";

export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationResult {
  errors: ValidationError[] = [];

  addError(field: string, message: string): void {
    this.errors.push({ field, message });
  }

  isValid(): boolean {
    return this.errors.length === 0;
  }

  getErrors(): ValidationError[] {
    return this.errors;
  }
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): ValidationResult => {
  const result = new ValidationResult();

  if (password.length < 8) {
    result.addError("password", "Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    result.addError("password", "Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    result.addError("password", "Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    result.addError("password", "Password must contain at least one number");
  }

  return result;
};

export const validateSignupRequest = (data: UserSignupRequest): ValidationResult => {
  const result = new ValidationResult();

  // Validate fullName
  if (!data.fullName || data.fullName.trim().length === 0) {
    result.addError("fullName", "Full name is required");
  } else if (data.fullName.trim().length < 2) {
    result.addError("fullName", "Full name must be at least 2 characters long");
  }

  // Validate email
  if (!data.email || data.email.trim().length === 0) {
    result.addError("email", "Email is required");
  } else if (!validateEmail(data.email)) {
    result.addError("email", "Invalid email format");
  }

  // Validate password
  if (!data.password) {
    result.addError("password", "Password is required");
  } else {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid()) {
      passwordValidation.getErrors().forEach(error => result.addError(error.field, error.message));
    }
  }

  // Validate confirmPassword
  if (!data.confirmPassword) {
    result.addError("confirmPassword", "Password confirmation is required");
  } else if (data.password !== data.confirmPassword) {
    result.addError("confirmPassword", "Passwords do not match");
  }

  return result;
};

export const validateLoginRequest = (data: UserLoginRequest): ValidationResult => {
  const result = new ValidationResult();

  // Validate email
  if (!data.email || data.email.trim().length === 0) {
    result.addError("email", "Email is required");
  } else if (!validateEmail(data.email)) {
    result.addError("email", "Invalid email format");
  }

  // Validate password
  if (!data.password || data.password.trim().length === 0) {
    result.addError("password", "Password is required");
  }

  return result;
};
