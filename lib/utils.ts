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

type DateFormatOptions = {
  year: "numeric" | "2-digit"
  month: "numeric" | "2-digit" | "long" | "short" | "narrow"
  day: "numeric" | "2-digit"
}

export function formatDateWithoutTime(dateString: string): string {
  try {
    const date = new Date(dateString)

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date")
    }

    const options: DateFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    }

    return date.toLocaleDateString("en-US", options)
  } catch (error) {
    return "Invalid date format"
  }
}
