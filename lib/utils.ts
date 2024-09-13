import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(value: string | number) {
  // Convert the input to a number if it's a string
  const number = typeof value === "string" ? parseFloat(value) : value

  // Check if the input is a valid number
  if (isNaN(number)) {
    return "Invalid Number"
  }

  // Format the number with commas and 2 decimal places
  const price = number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `$${price}`
}
