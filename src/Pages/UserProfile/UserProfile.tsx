import axios from 'axios';
import React, { useState, useEffect } from "react";

import { withRouter, RouteComponentProps } from "react-router";

import { Publisher, Manga, getColorFromPublisher, Genre, getColorFromGenre } from "../../Types/Manga";
import { Stats } from "../../Types/Stats";
import { UserManga } from "../../Types/UserManga";
import { User } from "../../Types/User";

import Styles from './UserProfile.module.css';

interface IUserProfile extends RouteComponentProps {
    user: User | null;
}

const UserProfile: React.FunctionComponent<IUserProfile> = (props) => {
    const [mangas, setMangas] = useState<Manga[]>([]);
    const [userMangas, setUserMangas] = useState<UserManga[]>([]);
    const [flippedPublisher, setFlippedPublisher] = useState(false);
    const [flippedGenre, setFlippedGenre] = useState(false);

    useEffect(() => {
        // Check if User exists or route back
        if(!props.user) {
            //props.history.push("/");
            return;
        }

        axios
            .get(process.env.REACT_APP_ENDPOINT + "/api/manga")
            .then(({ data }) => { setMangas(data); })
            .catch(function (error) { });

        axios
            .get(process.env.REACT_APP_ENDPOINT + "/api/usermanga/", {
                params: { userId: props.user.id, token: props.user.token, }
            })
            .then(({ data }) => {
                if(data)
                    setUserMangas(data);
            })
            .catch(function (error) { });

    }, [props.history, props.user]);

    // Get total amount of different mangas
    function getTotalMangaSeries(): JSX.Element {
        return <div>{userMangas.length}</div>;
    }

    // Get total amout of volumes of all mangas 
    function getTotalMangaVolumes(): JSX.Element {
        var totalVolumes = 0;
        var userMangasIndex = 0;

        while(userMangasIndex < userMangas.length) {
            var userManga = userMangas[userMangasIndex];
            if(userManga.owned) {
                totalVolumes += userManga.owned;
            }

            userMangasIndex++;
        }

        return <div>{totalVolumes}</div>;
    }

    function getPublisherOrGenreData(perGenre: boolean, perVolume: boolean): Stats[] {
        const statsArray: Stats[] = Object.values(perGenre ? Genre : Publisher).map(x => ({name: x, count: 0, percent: 0}));
        
        for(let i = 0; i < userMangas.length; i++) {
            const userManga = userMangas[i];
            const manga = mangas.find(manga => manga.mangaid === userManga.mangaid);
            if(!manga || !userManga.owned)
                continue;

            const stats = statsArray.find(entry => entry.name === (perGenre ? manga.genre : manga.publisher)) as Stats;
            if(!stats)
                continue;

            stats.count += perVolume ? userManga.owned : 1;
        }

        const totalAssigned = statsArray.reduce((acc, curr) => acc + curr.count, 0);
        for(let i = 0; i < statsArray.length; i++)
            statsArray[i].percent = statsArray[i].count / totalAssigned;

        statsArray.sort((x,y) => y.count - x.count)

        console.log(statsArray);

        return statsArray;
    }

    function getPublisherOrGenreNames(perGenre: boolean, perVolume: boolean): JSX.Element {
        const statsArray = getPublisherOrGenreData(perGenre, perVolume);
        const cutArray = [];

        for(let i = 0; i < 5; i++) {
            const element = statsArray[i];
            cutArray.push(element);
        }

        return (
            <div className={Styles.NamesContainer}>
                {cutArray.map(stats => {
                    const backGroundColor = perGenre ? getColorFromGenre(stats.name as Genre) : getColorFromPublisher(stats.name as Publisher);
                    return (
                        <div style={{ backgroundColor: backGroundColor }} key={stats.name} className={Styles.NamePlate}>
                            {stats.count + " in " + stats.name}
                        </div>
                    );
                })}
            </div>
        )
    }

    function getPublisherOrGenreChart(perGenre: boolean, perVolume: boolean): JSX.Element {
        const statsArray = getPublisherOrGenreData(perGenre, perVolume);

        return (
            <div className={Styles.ChartContainer}>
                {statsArray.map((stats, i) => {
                    const percent = stats.percent * 100;
                    const backGroundColor = perGenre ? getColorFromGenre(stats.name as Genre) : getColorFromPublisher(stats.name as Publisher);

                    let extraStyle = undefined;
                    if(i === 0) {
                        extraStyle = Styles.LeftChart;
                    }

                    if(i === statsArray.length - 1) {
                        extraStyle = Styles.RightChart;
                    }

                    return (
                        <div style={{ width: percent + "%", backgroundColor: backGroundColor }} key={stats.name} className={extraStyle + " tooltip"}>
                            <span className={"tooltiptext"}>{stats.name}</span>
                        </div>
                    );
                })}
            </div>
        )
    }

    const getButtonStyles = (active: boolean) => active ? Styles.activeButton : Styles.inactiveButton;

    console.log("---------------------------------");
    console.log(props.user);
    console.log(userMangas);
    console.log(mangas);

    return (
        <div className={Styles.Container}>
            <div className={Styles.MainContent}>
                <div className={Styles.TitleContainer}>
                    <div className={Styles.Title}>
                        User Statistics
                    </div>
                </div>
                <table>
                    <tbody>
                        <tr>
                            <td>Total manga series:</td>
                            <td>{getTotalMangaSeries()}</td>
                        </tr>
                        <tr>
                            <td>Total manga volumes:</td>
                            <td>{getTotalMangaVolumes()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className={Styles.Chips}>
                <div className={Styles.Chip}>
                    <div className={Styles.toggleBar}>
                        Publisher Overview per
                        <div className={Styles.toggles}>
                            <button className={getButtonStyles(!flippedPublisher)} onClick={() => setFlippedPublisher(false)}>Series</button>
                            <button className={getButtonStyles(flippedPublisher)} onClick={() => setFlippedPublisher(true)}>Volumes</button>
                        </div>
                    </div>
                    {getPublisherOrGenreNames(false, flippedPublisher)}
                    {getPublisherOrGenreChart(false, flippedPublisher)}
                </div>
                <div className={Styles.Chip}>
                    <div className={Styles.toggleBar}>
                        Genre Overview per
                        <div className={Styles.toggles}>
                            <button className={getButtonStyles(!flippedGenre)} onClick={() => setFlippedGenre(false)}>Series</button>
                            <button className={getButtonStyles(flippedGenre)} onClick={() => setFlippedGenre(true)}>Volumes</button>
                        </div>
                    </div>
                    {getPublisherOrGenreNames(true, flippedGenre)}
                    {getPublisherOrGenreChart(true, flippedGenre)}
                </div>
            </div>
        </div>
    );
}

export default withRouter(UserProfile);