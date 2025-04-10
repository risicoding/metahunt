export const formatUrl = (url:string) => {
  try {
    // Remove any leading/trailing whitespace
    url = url.trim();

    // Add protocol if missing
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    const parsedUrl = new URL(url);

    // Add www if missing and not already a subdomain
    if (!parsedUrl.hostname.startsWith('www.') && parsedUrl.hostname.split('.').length === 2) {
      parsedUrl.hostname = 'www.' + parsedUrl.hostname;
    }

    return parsedUrl.toString();
  } catch (err) {
    console.error(err)
    return null; // invalid URL
  }
};

