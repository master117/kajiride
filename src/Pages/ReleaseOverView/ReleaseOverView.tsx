import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';
import { EventApi } from "@fullcalendar/core";

import { Growl } from 'primereact/growl';

import AddReleaseDialog from "./AddReleaseDialog/AddReleaseDialog";
import ReleaseGroupDialog from "./ReleaseGroupDialog/ReleaseGroupDialog";

import { Manga, getColorFromPublisher } from "../../Types/Manga";
import { Release } from "../../Types/Release";
import { User, Role } from "../../Types/User";

import './ReleaseOverView.scss';
import Styles from './ReleaseOverView.module.css';

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

    useEffect(() => {
        updateData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //////////////////
    /// AXIOS EVENTS
    //////////////////

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

    const updateRelease = (release: Release) => {
        if (!props.user)
            return;

        axios
            .put(
                (process.env.REACT_APP_ENDPOINT + "/api/release"), {
                release: release,
                token: props.user.token
            })
            .then(() => {
                if (growl && growl.current)
                    growl.current.show({ severity: 'success', summary: 'Success', detail: 'Release updated' });
                updateData();
            })
            .catch(function (error) {
                // handle error
                if (growl && growl.current)
                    growl.current.show({ severity: 'error', summary: 'Error', detail: 'Couldn\'t update Release' });
            });
    }

    const addRelease = (release: Release) => {
        if (!props.user)
            return;

        axios
            .post(
                (process.env.REACT_APP_ENDPOINT + "/api/release"), {
                release: release,
                token: props.user.token
            })
            .then(() => {
                if (growl && growl.current)
                    growl.current.show({ severity: 'success', summary: 'Success', detail: 'Release updated' });
                updateData();
            })
            .catch(function (error) {
                // handle error
                if (growl && growl.current)
                    growl.current.show({ severity: 'error', summary: 'Error', detail: 'Couldn\'t add Release' });
            });
    }

    const deleteRelease = (release: Release) => {
        if (!props.user)
            return;

        axios
            .delete(
                (process.env.REACT_APP_ENDPOINT + "/api/release"), {
                data: { releaseid: release.releaseid, token: props.user.token },
            })
            .then(() => {
                if (growl && growl.current)
                    growl.current.show({ severity: 'success', summary: 'Success', detail: 'Release deleted' });
                updateData();
            })
            .catch(function (error) {
                // handle error
                if (growl && growl.current)
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

        for (let i = 0; i < releases.length; i++) {
            const currManga = manga.find(x => x.mangaid === releases[i].mangaid);

            if (currManga && !events.some(x => equalDates(x.start as Date, releases[i].releasedate) && (x as any).publisher === currManga.publisher)) {
                console.log(events)
                console.log((events[0] as any)?.publisher)
                console.log(currManga.publisher)
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
        if (!props.user || !editReleaseDialogData)
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

    return (
        <div className={Styles.Main}>
            <div className={Styles.Inner}>
                <Growl ref={growl} />
                {showAddReleaseDialog !== null ?
                    <AddReleaseDialog
                        visible={true}
                        manga={manga}
                        initialDate={showAddReleaseDialog as Date}
                        onHide={onAddDialogClose}
                        onSave={onSaveFromDialog} />
                    : ""}
                <div className={Styles.calendarDiv}>
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
                            if (props.user && props.user.role === Role.admin)
                                setShowAddReleaseDialog(e.date);
                            else
                                alert("Only Admins can add new releases");
                        }} />
                </div>
                {releases && manga && editReleaseDialogData ? getReleaseEntry() : ""}
            </div>
        </div>
    );
}

export default Releases;