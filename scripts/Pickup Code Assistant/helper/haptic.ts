export function haptic(type: "success" | "failed" | "select") {
  if (type === "failed") {
    HapticFeedback.notificationError()
  }
  if (type === "success") {
    HapticFeedback.notificationSuccess()
  }
  if (type === "select") {
    HapticFeedback.lightImpact()
  }
}