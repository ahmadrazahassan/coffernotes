"use client";

import { CldImage as BaseCldImage, CldImageProps } from "next-cloudinary";

export function CloudinaryImage(props: CldImageProps) {
  return <BaseCldImage {...props} />;
}
