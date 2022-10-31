import React from 'react';
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import Input from "./Input";
import ButtonWithProgress from "./ButtonWithProgress";

const ProfileCard = (props: any) => {
    const {displayName, username, image} = props.user;

    const showEditButton = props.isEditable && !props.inEditMode;

    return (
        <div className="card">
            <div className="card-header text-center">
                <ProfileImageWithDefault alt="profile"
                                         width="200"
                                         height="200"
                                         image={image}
                                         className="rounded-circle shadow"/>
            </div>
            <div className="card-body text-center">
                {
                    !props.inEditMode && <h4>{`${displayName}@${username}`}</h4>
                }
                {
                    props.inEditMode && (
                        <div className="mb-2">
                            <Input value={displayName}
                                   label={`Change display name for ${username}`}
                                   onChange={props.onChangeDisplayName}/>
                        </div>
                    )
                }
                {
                    showEditButton && (
                        <button className="btn btn-outline-success" onClick={props.onClickEdit}>
                            <i className="fas fa-user-edit"/>Edit
                        </button>
                    )
                }
                {
                    props.inEditMode && (
                        <div>
                            <ButtonWithProgress
                                className="btn btn-primary"
                                onClick={props.onClickSave}
                                text={<span><i className="fas fa-save"/>Save</span>}
                                pendingApiCall={props.pendingUpdateCall}
                                disabled={props.pendingUpdateCall}
                            />
                            <button className="btn btn-secondary"
                                    onClick={props.onClickCancel}
                                    disabled={props.pendingUpdateCall}
                            >
                                <i className="fas fa-window-close"/>Cancel
                            </button>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default ProfileCard;