import React from 'react';
import defaultPicture from '../assets/profile.png'

const ProfileImageWithDefault = (props: any) => {
    let imageSource = defaultPicture;
    if (props.image) {
        imageSource = `images/profile/${props.image}`;
    }

    return (
        <img {...props}
             src={props.src || imageSource}
             onError={(event) => {
                 const element = event.target as HTMLImageElement
                 element.src = defaultPicture;
             }}
        />
    );
};

export default ProfileImageWithDefault;