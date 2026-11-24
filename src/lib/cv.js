export const CV_FILE_NAME = 'CV_Anthony_Gouvrillon.pdf';
export const CV_DEFAULT_PATH = `/cv/${CV_FILE_NAME}`;

// Le lien saisi dans le Studio (cv_url) prend le pas sur le PDF livré avec le site.
export function cvHref(profile) {
  const url = profile?.cv_url?.trim();
  return url || CV_DEFAULT_PATH;
}
