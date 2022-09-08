import Image from "react-image-enlarger";
import { useState } from 'react';

function ImageContainer(props) {
    const [zoomed, setZoomed] = useState(false);

    return (
        <Image
            style={{ width: "140px", height: "140px" }}
            zoomed={zoomed}
            src= {props.image || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'}
            onClick={() => setZoomed(true)}
            onRequestClose={() => setZoomed(false)}
        />
    );
  }

export default ImageContainer;