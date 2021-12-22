export function getStrapiURL(path: string) {
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}${path}`;
}

export function getStrapiMedia(url: string) {
  if (url.startsWith('http') || url.startsWith('//')) {
    return url;
  }
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}${url}`;
}
