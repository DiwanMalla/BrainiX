const disposableDomains = [
  "mailinator.com",
  "10minutemail.com",
  "tempmail.com",
  "guerrillamail.com",
  "fakeinbox.com",
  "trashmail.com",
  "yopmail.com",
];

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return !!domain && disposableDomains.includes(domain);
}
