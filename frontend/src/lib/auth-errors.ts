function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error) {
    return error;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message
  ) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string" &&
    error.data.message
  ) {
    return error.data.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "cause" in error &&
    typeof error.cause === "object" &&
    error.cause !== null &&
    "message" in error.cause &&
    typeof error.cause.message === "string" &&
    error.cause.message
  ) {
    return error.cause.message;
  }

  const serialized = String(error);
  if (serialized && serialized !== "[object Object]") {
    return serialized;
  }

  return "";
}

export function normalizeAuthErrorMessage(error: unknown, flow: "signIn" | "signUp") {
  const message = getErrorMessage(error);
  const normalized = message.toLowerCase();

  if (
    flow === "signUp" &&
    (
      normalized.includes("name and role number do not match an approved member") ||
      normalized.includes("approved member")
    )
  ) {
    return "You are not an existing member. Check that your name and role number match the approved member list.";
  }

  if (
    normalized.includes("invalidaccountid") ||
    normalized.includes("invalid account id") ||
    normalized.includes("incorrect password") ||
    normalized.includes("invalid password") ||
    normalized.includes("invalid credentials") ||
    normalized.includes("invalid login") ||
    normalized.includes("called by client") ||
    normalized.includes("unauthorized")
  ) {
    return "Incorrect email or password.";
  }

  if (normalized.includes("password must be at least 8 characters")) {
    return "Password must be at least 8 characters.";
  }

  if (normalized.includes("member account already exists") || normalized.includes("already exists")) {
    return "An account already exists for this member.";
  }

  if (normalized.includes("name and role number do not match an approved member") || normalized.includes("approved member")) {
    return "You are not an existing member. Check that your name and role number match the approved member list.";
  }

  if (normalized.includes("email is required")) {
    return "Enter your email address.";
  }

  if (normalized.includes("first name is required") || normalized.includes("last name is required")) {
    return "Enter your first and last name.";
  }

  if (normalized.includes("role number is required")) {
    return "Enter your role number.";
  }

  if (message) {
    return message;
  }

  return flow === "signIn"
    ? "Unable to sign in. Check your credentials and try again."
    : "Unable to create your account. Verify your information and try again.";
}

export function normalizeAuthError(error: unknown, flow: "signIn" | "signUp") {
  return new Error(normalizeAuthErrorMessage(error, flow));
}
