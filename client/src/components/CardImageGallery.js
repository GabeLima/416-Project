import React from 'react'
import SimpleImageSlider from "react-simple-image-slider";

const CardImageGallery = ({images}) => {
    console.log("Inside cardimagegallery: ", images);
  return (
    <div>
        {images && <SimpleImageSlider width={280} height={280} showBullets={true} showNavs={true} images={images} />}
    </div>
  )
}

export default CardImageGallery
