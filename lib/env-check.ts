/**
 * Checks if required environment variables are set
 * @returns Object with status and missing variables
 */
export function checkRequiredEnvVars() {
  const requiredVars = ["OPENAI_API_KEY"]
  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  return {
    allSet: missingVars.length === 0,
    missingVars,
  }
}
