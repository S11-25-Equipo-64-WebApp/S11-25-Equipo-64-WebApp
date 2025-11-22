export enum MediaProviders {
  NONE = 0,
  YOUTUBE = 10,
  CLOUDINARY = 20,
}

// labels for the media providers
export const MediaProvidersLabels = {
  [MediaProviders.NONE]: "N/A",
  [MediaProviders.YOUTUBE]: "Youtube",
  [MediaProviders.CLOUDINARY]: "Cloudinary",
};

// get the label for the media provider
export const getMediaProviderLabel = (provider: MediaProviders) => {
  return MediaProvidersLabels[provider];
};
