import React from 'react';
import Button from '@material-ui/core/Button'

// Component for the profile page
// Displays profile information for a user
// Profile Name
// Completed Games
// Follow/Unfollow user button
// (follow button only appears if the viewer is not the user)
const Profile = (props) => {
    // viwer is who is viewing the profile
    // user is whose profile is being displayed
    //const {viewer, user} = props;

    let user = "User"

    // if the viewer is in the user's followers
    let follow_text = "Follow";
    follow_text = "Unfollow";

    // implement a list of cards of completed games

    return (
        <div>
            <h1>{user}'s Profile</h1>
            <h2>Completed Games</h2>
        </div>
    );
}

export default Profile