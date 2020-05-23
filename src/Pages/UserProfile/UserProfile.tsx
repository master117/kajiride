import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Growl } from "primereact/growl";

import { withRouter, RouteComponentProps } from "react-router";

import { UserManga } from "../../Types/UserManga";
import { User } from "../../Types/User";

import Styles from './UserProfile.module.css';


interface IUserProfile extends RouteComponentProps {
    user: User;
}

const UserProfile: React.FunctionComponent<IUserProfile> = (props) => {
    const growl = useRef<Growl>(null);
    const [userMangas, setUserMangas] = useState<UserManga[]>([]);

    useEffect(() => {
        // Check if User exists or route back
        if (!props.user) {
            props.history.push("/");
        }
        else {
            axios
                .get(
                    process.env.REACT_APP_ENDPOINT + "/api/usermanga/",
                    {
                        params: {
                            userId: props.user.id,
                            token: props.user.token,
                        }
                    }
                )
                .then(({ data }) => {
                    if (data)
                        setUserMangas(data);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                    console.log(error.message);
                    console.log(error.config);
                    if (growl && growl.current)
                        growl.current.show({ severity: 'error', summary: 'Error', detail: error.message });
                });
        }
    }, [props.history, props.user]);

    console.log(userMangas);
    return (
        <div>
            <Growl ref={growl} />
        </div>
    );
}

export default withRouter(UserProfile);