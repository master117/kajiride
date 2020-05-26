import React, { useState, useEffect } from "react";
import axios from 'axios';

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

    useEffect(() => {
        // Check if User exists or route back
        if (!props.user) {
            props.history.push("/");
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
                if (data)
                    setUserMangas(data);
            })
            .catch(function (error) { });

    }, [props.history, props.user]);

    // Get total amount of different mangas
    function getTotalManga(): JSX.Element {
        return <div>{userMangas.length}</div>;
    }

    // Get total amout of volumes of all mangas 
    function getTotalMangaVolumes(): JSX.Element {
        var totalVolumes = 0;
        var userMangasIndex = 0;

        while (userMangasIndex < userMangas.length) {
            var userManga = userMangas[userMangasIndex];
            if (userManga.owned) {
                totalVolumes += userManga.owned;
            }

            userMangasIndex++;
        }

        return <div>{totalVolumes}</div>;
    }

    function getPublisherData(): Stats[] {
        let statsArray: Stats[] = [];

        statsArray.push({ name: Publisher.altraverse, count: 0, percent: 0 });
        statsArray.push({ name: Publisher.Carlsen, count: 0, percent: 0 });
        statsArray.push({ name: Publisher.Egmont, count: 0, percent: 0 });
        statsArray.push({ name: Publisher.Kaze, count: 0, percent: 0 });
        statsArray.push({ name: Publisher.MangaCult, count: 0, percent: 0 });
        statsArray.push({ name: Publisher.SevenSeas, count: 0, percent: 0 });
        statsArray.push({ name: Publisher.Tokyopop, count: 0, percent: 0 });
        statsArray.push({ name: Publisher.VizMedia, count: 0, percent: 0 });
        statsArray.push({ name: Publisher.YenPress, count: 0, percent: 0 });
        statsArray.push({ name: Publisher.Other, count: 0, percent: 0 });

        var totalAssigned = 0;

        for (let i = 0; i < userMangas.length; i++) {
            const userManga = userMangas[i];
            const manga = mangas.find(manga => manga.mangaid === userManga.mangaid);

            if (manga) {
                const stats = statsArray.find(entry => entry.name === manga.publisher);

                if (stats) {
                    totalAssigned++;
                    stats.count++;
                }
            }
        }

        for (let i = 0; i < statsArray.length; i++) {
            const stats = statsArray[i];
            stats.percent = stats.count / totalAssigned;
        }

        console.log(statsArray);

        for (let i = 0; i < statsArray.length; i++) {
            var maxIndex = i;
            var max = 0;

            for (let j = i; j < statsArray.length; j++) {
                var stats = statsArray[j];
                if (stats.count > max) {
                    max = stats.count;
                    maxIndex = j;
                }
            }

            var temp = statsArray[i];
            statsArray[i] = statsArray[maxIndex];
            statsArray[maxIndex] = temp;
        }

        console.log(statsArray);

        return statsArray;
    }

    function getGenreData(): Stats[] {
        let statsArray: Stats[] = [];

        statsArray.push({ name: Genre.Action, count: 0, percent: 0 });
        statsArray.push({ name: Genre.Adventure, count: 0, percent: 0 });
        statsArray.push({ name: Genre.Comedy, count: 0, percent: 0 });
        statsArray.push({ name: Genre.Drama, count: 0, percent: 0 });
        statsArray.push({ name: Genre.Fantasy, count: 0, percent: 0 });
        statsArray.push({ name: Genre.Horror, count: 0, percent: 0 });
        statsArray.push({ name: Genre.Isekai, count: 0, percent: 0 });
        statsArray.push({ name: Genre.Mystery, count: 0, percent: 0 });
        statsArray.push({ name: Genre.Shojo, count: 0, percent: 0 });
        statsArray.push({ name: Genre.SliceOfLife, count: 0, percent: 0 });
        statsArray.push({ name: Genre.Yuri, count: 0, percent: 0 });

        var totalAssigned = 0;

        for (let i = 0; i < userMangas.length; i++) {
            const userManga = userMangas[i];
            const manga = mangas.find(manga => manga.mangaid === userManga.mangaid);

            if (manga) {
                const stats = statsArray.find(entry => entry.name === manga.genre);

                if (stats) {
                    totalAssigned++;
                    stats.count++;
                }
            }
        }

        for (let i = 0; i < statsArray.length; i++) {
            const stats = statsArray[i];
            stats.percent = stats.count / totalAssigned;
        }

        console.log(statsArray);

        for (let i = 0; i < statsArray.length; i++) {
            var maxIndex = i;
            var max = 0;

            for (let j = i; j < statsArray.length; j++) {
                var stats = statsArray[j];
                if (stats.count > max) {
                    max = stats.count;
                    maxIndex = j;
                }
            }

            var temp = statsArray[i];
            statsArray[i] = statsArray[maxIndex];
            statsArray[maxIndex] = temp;
        }

        console.log(statsArray);

        return statsArray;
    }

    function getPublisherNames(): JSX.Element {
        const statsArray = getPublisherData();
        const cutArray = [];

        for (let i = 0; i < 5; i++) {
            const element = statsArray[i];
            cutArray.push(element);
        }

        return (
            <div className={Styles.NamesContainer}>
                {cutArray.map(stats => {
                    const backGroundColor = getColorFromPublisher(stats.name as Publisher);
                    return (
                        <div style={{ backgroundColor: backGroundColor }} key={stats.name} className={Styles.NamePlate}>
                            {stats.count + " in " + stats.name}
                        </div>
                    );
                })}
            </div>
        )
    }

    function getPublisherChart(): JSX.Element {
        const statsArray = getPublisherData();

        return (
            <div className={Styles.ChartContainer}>
                {statsArray.map((stats, i) => {
                    const percent = stats.percent * 100;
                    const backGroundColor = getColorFromPublisher(stats.name as Publisher);

                    let extraStyle = undefined;
                    if (i === 0) {
                        extraStyle = Styles.LeftChart;
                    }

                    if (i === statsArray.length - 1) {
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

    function getGenreNames(): JSX.Element {
        const statsArray = getGenreData();
        const cutArray = [];

        for (let i = 0; i < 5; i++) {
            const element = statsArray[i];
            cutArray.push(element);
        }

        return (
            <div className={Styles.NamesContainer}>
                {cutArray.map(stats => {
                    const backGroundColor = getColorFromGenre(stats.name as Genre);
                    return (
                        <div style={{ backgroundColor: backGroundColor }} key={stats.name} className={Styles.NamePlate}>
                            {stats.count + " in " + stats.name}
                        </div>
                    );
                })}
            </div>
        )
    }

    function getGenreChart(): JSX.Element {
        const statsArray = getGenreData();

        return (
            <div className={Styles.ChartContainer}>
                {statsArray.map((stats, i) => {
                    const percent = stats.percent * 100;
                    const backGroundColor = getColorFromGenre(stats.name as Genre);

                    let extraStyle = undefined;
                    if (i === 0) {
                        extraStyle = Styles.LeftChart;
                    }

                    if (i === statsArray.length - 1) {
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
                <div className={Styles.FormContainer}>
                    <div className={Styles.Row}>
                        <div className={Styles.Left}>
                            Total manga:
                        </div>
                        <div className={Styles.Right}>
                            {getTotalManga()}
                        </div>
                    </div>
                    <div className={Styles.Row}>
                        <div className={Styles.Left}>
                            Total manga volumes:
                        </div>
                        <div className={Styles.Right}>
                            {getTotalMangaVolumes()}
                        </div>
                    </div>
                </div>
            </div>
            <div className={Styles.Chips}>

                <div className={Styles.Chip}>
                    {getPublisherNames()}
                    {getPublisherChart()}
                </div>
                <div className={Styles.Chip}>
                    {getGenreNames()}
                    {getGenreChart()}
                </div>
            </div>
        </div>
    );
}

export default withRouter(UserProfile);