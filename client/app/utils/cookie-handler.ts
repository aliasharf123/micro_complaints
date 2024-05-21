export interface CookieAttributes {
  [key: string]: string | boolean | undefined;
  httponly?: boolean;
  path?: string;
  "max-age"?: string;
}

type cookie = CookieAttributes & { name: string; value: string };

export const cookieBuilder = (encodedCookieString: string): cookie => {
  // Parse the cookie string
  const cookieString = decodeURIComponent(encodedCookieString);

  const cookieParts = cookieString.split("; ");
  const [nameValue, ...attributes] = cookieParts;
  const [name, value] = nameValue.split("=");
  // Set the cookie attributes
  const cookieAttributes = attributes.reduce(
    (acc: CookieAttributes, attribute) => {
      const [key, val] = attribute.split("=");
      acc[key.toLowerCase()] = val || true; // Handle boolean attributes like HttpOnly
      return acc;
    },
    {}
  );
  return { ...cookieAttributes, name, value };
};
