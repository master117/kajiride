import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';
import { EventApi } from "@fullcalendar/core";

import { Growl } from 'primereact/growl';

import AddReleaseDialog from "./AddReleaseDialog/AddReleaseDialog";
import ReleaseGroupDialog from "./ReleaseGroupDialog/ReleaseGroupDialog";

import { Manga, getColorFromPublisher, Publisher } from "../../Types/Manga";
import { Release } from "../../Types/Release";
import { User, Role } from "../../Types/User";

import './ReleaseOverView.scss';
import Styles from './ReleaseOverView.module.css';
import MonthSwitcher from "./MonthSwitcher/MonthSwitcher";

interface IReleaseOverviewProps {
    user: User | null;
    logOut: () => void;
}

const Releases: React.FunctionComponent<IReleaseOverviewProps> = (props) => {
    const growl = useRef<Growl>(null);

    const [releases, setReleases] = useState<Release[]>([]);
    const [manga, setManga] = useState<Manga[]>([]);
    const [showAddReleaseDialog, setShowAddReleaseDialog] = useState<Date | null>(null);
    const [editReleaseDialogData, setEditReleaseDialogData] = useState<EventApi | null>();

    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [openPub, setOpenPub] = useState<{ indexDay: number, indexPub: number }[]>([]);

    useEffect(() => {
        updateData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //////////////////
    /// AXIOS EVENTS
    //////////////////

    /**
     * Get Release Data
     */
    const updateData = () => {
        axios
            .get(process.env.REACT_APP_ENDPOINT + "/api/release")
            .then((response: { data: Release[] }) => {
                setReleases(response.data.map(x => {
                    const date = getUTCDate(new Date(x.releasedate));
                    return {
                        ...x, releasedate: date
                    }
                }));
            });

        axios
            .get(process.env.REACT_APP_ENDPOINT + "/api/manga")
            .then((response: { data: any }) => { setManga(response.data); });
    }

    /**
     * Update Release Data
     * @param release 
     */
    const updateRelease = (release: Release) => {
        if(!props.user)
            return;

        axios
            .put(
                (process.env.REACT_APP_ENDPOINT + "/api/release"), {
                release: release,
                token: props.user.token
            })
            .then(() => {
                updateData();
            })
            .catch(function (error) {
                // handle error
                if(growl && growl.current)
                    growl.current.show({ severity: 'error', summary: 'Error', detail: 'Couldn\'t update Release' });
            });
    }

    /**
     * Add new release
     * @param release 
     */
    const addRelease = (release: Release) => {
        if(!props.user)
            return;

        axios
            .post(
                (process.env.REACT_APP_ENDPOINT + "/api/release"), {
                release: release,
                token: props.user.token
            })
            .then(() => {
                if(growl && growl.current)
                    growl.current.show({ severity: 'success', summary: 'Success', detail: 'Release updated' });
                updateData();
            })
            .catch(function (error) {
                // handle error
                if(growl && growl.current)
                    growl.current.show({ severity: 'error', summary: 'Error', detail: 'Couldn\'t add Release' });
            });
    }

    /**
     * Delete Release
     * @param release 
     */
    const deleteRelease = (release: Release) => {
        if(!props.user)
            return;

        axios
            .delete(
                (process.env.REACT_APP_ENDPOINT + "/api/release"), {
                data: { releaseid: release.releaseid, token: props.user.token },
            })
            .then(() => {
                if(growl && growl.current)
                    growl.current.show({ severity: 'success', summary: 'Success', detail: 'Release deleted' });
                updateData();
            })
            .catch(function (error) {
                // handle error
                if(growl && growl.current)
                    growl.current.show({ severity: 'error', summary: 'Error', detail: 'Couldn\'t delete Release' });
            });
    }

    //////////////////
    /// UI EVENTS
    //////////////////

    const onAddDialogClose = () => {
        setShowAddReleaseDialog(null);
    }

    const onSaveFromDialog = (date: Date, mangaId: number, volume: number) => {
        const release: Release = {
            releaseid: null,
            active: true,
            mangaid: mangaId,
            releasedate: date,
            volume: volume
        }
        addRelease(release);
        setShowAddReleaseDialog(null);
    }

    const onEventClick = (event: EventApi) => {
        setEditReleaseDialogData(event);
        console.log(event);
    }

    const getEvents = () => {
        let events: EventApi[] = [];

        for(let i = 0; i < releases.length; i++) {
            const currManga = manga.find(x => x.mangaid === releases[i].mangaid);

            if(currManga && !events.some(x => equalDates(x.start as Date, releases[i].releasedate) && (x as any).publisher === currManga.publisher)) {
                let event = {
                    allDay: true,
                    start: releases[i].releasedate,
                    title: currManga.publisher,
                    backgroundColor: getColorFromPublisher(currManga.publisher),
                    borderColor: "transparent",
                    textColor: "black",
                    publisher: currManga.publisher,
                }

                events.push(event as any);
            }
        }

        return events;
    }

    const getReleaseEntry = (): JSX.Element => {
        if(!props.user || !editReleaseDialogData)
            return <div></div>;

        const currReleases = releases.filter(x => {
            const currManga = manga.find(y => y.mangaid === x.mangaid);
            return currManga
                // Check Date matches
                && editReleaseDialogData.start
                && equalDates(editReleaseDialogData.start, x.releasedate)
                // Check Publisher matches
                && editReleaseDialogData.extendedProps.publisher === currManga.publisher;
        })

        return <ReleaseGroupDialog
            releases={currReleases}
            manga={manga}
            user={props.user}
            editable={props.user && props.user.role === 1}
            visible={Boolean(editReleaseDialogData)}
            onHide={() => setEditReleaseDialogData(null)}
            onUpdate={updateRelease}
            onDelete={deleteRelease}
        />;
    }

    const equalDates = (date1: Date, date2: Date): boolean => {
        return date1.getFullYear() === date2.getFullYear()
            && date1.getMonth() === date2.getMonth()
            && date1.getDate() === date2.getDate();
    }

    const getUTCDate = (date: Date) => {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    }

    const getReleasesByDay = (releases: Release[]): { date: Date, releases: Release[] }[] => {
        const releasesByDay: { date: Date, releases: Release[] }[] = [];
        releases.forEach(release => {
            const index = releasesByDay.findIndex(x => x.date.getDate() === release.releasedate.getDate());
            if(index !== -1)
                releasesByDay[index].releases.push(release);
            else
                releasesByDay.push({ date: release.releasedate, releases: [release] });
        })

        return releasesByDay;
    }

    const getReleasesByPublisher = (releases: Release[]): { publisher: Publisher, releases: Release[] }[] => {
        const releasesByPub: { publisher: Publisher, releases: Release[] }[] = [];

        releases.forEach(release => {
            const currentManga = manga.find(x => x.mangaid === release.mangaid) as Manga;
            const index = releasesByPub.findIndex(x => x.publisher === currentManga.publisher);
            if(index !== -1)
                releasesByPub[index].releases.push(release);
            else
                releasesByPub.push({ publisher: currentManga.publisher, releases: [release] });
        })

        return releasesByPub;
    }

    const currentReleases = releases.filter(release =>
        release.releasedate.getFullYear() === currentMonth.getFullYear()
        && release.releasedate.getMonth() === currentMonth.getMonth());
    currentReleases.sort((x, y) => x.releasedate.getTime() - y.releasedate.getTime());

    if(manga.length === 0)
        return <div></div>;

    return (
        <div className={Styles.main}>
            <div className={Styles.inner}>
                <Growl ref={growl} />
                {showAddReleaseDialog !== null ?
                    <AddReleaseDialog
                        visible={true}
                        manga={manga}
                        initialDate={showAddReleaseDialog as Date}
                        onHide={onAddDialogClose}
                        onSave={onSaveFromDialog} />
                    : ""}
                <div className={Styles.calendarDesktopDiv}>
                    <FullCalendar
                        defaultView="dayGridMonth"
                        plugins={[dayGridPlugin, interactionPlugin]}
                        //Look
                        weekends={true}
                        firstDay={1}
                        locale={"de"}
                        weekNumbers={true}
                        weekLabel={"KW"}
                        fixedWeekCount={false}
                        showNonCurrentDates={false}
                        eventRender={info => {
                            //if(info.el && info.el.firstChild)
                            //(info.el.firstChild as any).innerText = "Text Overwrite";
                            return info.el
                        }}
                        //Style
                        height={"parent"}
                        //Data
                        events={getEvents()}
                        timeZone={"UTC"}
                        //Input
                        eventClick={e => { onEventClick(e.event) }}
                        dateClick={e => {
                            if(props.user && props.user.role === Role.admin)
                                setShowAddReleaseDialog(e.date);
                            else
                                alert("Only Admins can add new releases");
                        }} />
                </div>
                <div className={Styles.calendarMobileDiv}>
                    <MonthSwitcher currentMonth={currentMonth} onChangeMonth={setCurrentMonth} />
                    {/* First sort Manga By Day, then add a day matching div as title, then sort by publisher with ith's own section each below */}
                    <div className={Styles.mobileContainer}>
                        {getReleasesByDay(currentReleases).map((releasesByDay, i) => {
                            return (
                                <div key={"day-" + i} className={Styles.mobileDaysContainer}>
                                    <div className={Styles.mobileDaysHead}>
                                        {releasesByDay.date.toLocaleString('default', { day: '2-digit' })
                                            + "."
                                            + releasesByDay.date.toLocaleString('default', { month: '2-digit' })
                                            + "."}
                                    </div>
                                    {getReleasesByPublisher(releasesByDay.releases).map((releasesByPub, j) => {
                                        return (
                                            <div key={"pub-" + j} className={Styles.mobilePubContainer}>
                                                <div 
                                                className={Styles.mobilePubHead}
                                                onClick={() => {
                                                    if(!openPub.some(x => x.indexDay === i && x.indexPub === j))
                                                        setOpenPub([...openPub, { indexDay: i, indexPub: j }]);
                                                    else
                                                        setOpenPub([...openPub].filter(x => x.indexDay !== i || x.indexPub !== j));
                                                }} 
                                                style={{backgroundColor: getColorFromPublisher(releasesByPub.publisher)}}
                                                >{releasesByPub.publisher}</div>
                                                <div style={{ display: openPub.some(x => x.indexDay === i && x.indexPub === j) ? "block" : "none" }}>
                                                    {releasesByPub.releases.map((release, k) => {
                                                        const currentManga = manga.find(x => x.mangaid === release.mangaid) as Manga;
                                                        return (
                                                            <div key={"release-" + k} className={Styles.mobileRelease}>
                                                                <div className={Styles.checkBox} onClick={() => updateRelease({ ...release, active: !release.active })}>
                                                                    {!release.active && <i className="fas fa-check"></i>}
                                                                </div>
                                                                <div className={Styles.mobileMangaTitle}>{currentManga.name + " - " + release.volume}</div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
                {releases && manga && editReleaseDialogData && getReleaseEntry()}
            </div>
        </div>
    );
}

export default Releases;