export enum MediaSource {
  // None (or text)
  NONE = 0,
  // Cloudinary
  CLOUDINARY_IMAGE = 10,
  CLOUDINARY_VIDEO = 11,
  // Youtube
  YOUTUBE_VIDEO = 20,
}

// labels for the media sources
export const MediaSourceLabels = {
  [MediaSource.NONE]: "N/A",
  [MediaSource.CLOUDINARY_IMAGE]: "Cloudinary Image",
  [MediaSource.CLOUDINARY_VIDEO]: "Cloudinary Video",
  [MediaSource.YOUTUBE_VIDEO]: "Youtube Video",
};

// get the label for the media source
export const getMediaSourceLabel = (source: MediaSource) => {
  return MediaSourceLabels[source];
};
