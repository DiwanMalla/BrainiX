import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const interactiveStyles = {
  button: "cursor-pointer transition-opacity duration-200 hover:opacity-80",
  link: "cursor-pointer transition-opacity duration-200 hover:opacity-80",
  input: "cursor-text",
  loading: "cursor-wait",
  help: "cursor-help",
  disabled: "cursor-not-allowed opacity-60",
  image: "transition-opacity duration-300",
};

export function getImageLoadingClass(isLoading: boolean) {
  return cn(interactiveStyles.image, isLoading ? "opacity-0" : "opacity-100");
}
