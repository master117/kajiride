import React, { useState, useEffect } from "react";
import axios from 'axios';

import { withRouter, RouteComponentProps } from "react-router";

import { UserManga } from "../../Types/UserManga";
import { User } from "../../Types/User";

import Styles from './UserProfile.module.css';

interface IUserProfile extends RouteComponentProps {
    user: User | null;
}

const UserProfile: React.FunctionComponent<IUserProfile> = (props) => {
    const [userMangas, setUserMangas] = useState<UserManga[]>([]);

    useEffect(() => {
        // Check if User exists or route back
        if (!props.user) {
            props.history.push("/");
            return;
        }

        axios
            .get(process.env.REACT_APP_ENDPOINT + "/api/usermanga/", {
                params: { userId: props.user.id, token: props.user.token, }
            })
            .then(({ data }) => {
                if (data)
                    setUserMangas(data);
            })
            .catch(function (error) {
            });
    }, [props.history, props.user]);

    console.log(userMangas);
    return (
        <div className={Styles.container}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In quam lorem, convallis sit amet eleifend quis, fermentum vitae mi. Ut porttitor tristique volutpat. Morbi nec ligula eu felis interdum scelerisque. Nullam non semper velit. Vestibulum consequat, arcu ut porttitor rutrum, ligula magna commodo sapien, a placerat dolor ante eget dolor. Nulla tempor eros eu sem ultricies, ut cursus velit imperdiet. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

            Sed lobortis magna quis mauris rutrum, vitae venenatis elit fringilla. Vivamus dictum odio bibendum ex finibus luctus. Aliquam pretium risus non metus mattis, et finibus dui aliquam. Donec fringilla quam sit amet efficitur convallis. Suspendisse potenti. Aliquam risus dui, varius rhoncus nisi nec, dapibus venenatis velit. Duis non nisi sapien.

            Morbi eu sem a metus ullamcorper bibendum non a ex. Mauris pulvinar, quam ac rutrum auctor, sapien erat dictum ipsum, nec sollicitudin arcu dui sit amet nisl. Maecenas dignissim dolor libero. Nam ut varius nisi. Phasellus interdum iaculis ex, eget pharetra nisi pulvinar vel. Nunc eleifend et magna sit amet facilisis. Phasellus dignissim arcu sit amet sem rutrum, nec varius nisl ultricies. Donec ac nisl eget elit rhoncus euismod.

            Nam faucibus semper ante eu cursus. Fusce viverra sollicitudin sem, et vestibulum orci interdum in. Maecenas eget ex sed augue eleifend vulputate a quis leo. Nullam commodo feugiat lectus laoreet mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam rutrum magna velit, at vulputate lectus sollicitudin et. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam fermentum diam ac augue laoreet, mollis cursus dui iaculis. Quisque faucibus quis metus vel condimentum. Pellentesque mattis purus non lorem pharetra ultricies. Nulla id facilisis diam, eget tincidunt ligula. Aenean eleifend risus mi, vel volutpat ante tincidunt et. Maecenas est diam, faucibus blandit risus pulvinar, aliquet fermentum ligula. Nulla facilisi. Nam nec metus imperdiet, luctus ligula quis, rutrum erat.

            Mauris feugiat velit sit amet urna aliquet consequat.
        </div>
    );
}

export default withRouter(UserProfile);