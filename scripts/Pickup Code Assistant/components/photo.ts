import { Intent } from "scripting"

export async function getLatestPhoto() {
  const photos = await Photos.getLatestPhotos(1)
  if (photos == null || photos.length === 0) {
    throw new Error("getLatestPhotos returns empty photo")
  }
  return photos[0]
}

export async function pickPhoto() {
  const photos = await Photos.pickPhotos(1)
  if (photos == null || photos.length === 0) {
    throw new Error("pickPhotos returns empty photo")
  }
  return photos[0]
}

export async function intentPhoto() {
  const photos = Intent.imagesParameter
  if (photos == null || photos.length === 0) {
    throw new Error("intentPhoto returns empty photo")
  }
  return photos[0]
}