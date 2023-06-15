import React, { useState, useEffect } from 'react';
import './HomePage.css';

function HomePage() {


    return (
        <div>
            <h1>Time Clock</h1>
            <Clock />
            <ClockIn />
        </div>
    );
}
export default HomePage;

function Clock() {
    const [time, setTime] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = new Date();
            const hours = currentTime.getHours();
            const minutes = currentTime.getMinutes();
            const amPm = hours >= 12 ? 'PM' : 'AM';

            // Convert hours to 12-hour format
            const formattedHours = hours % 12 || 12;

            // Pad minutes with leading zero if less than 10
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

            // Build the formatted time string
            const formattedTime = `${formattedHours}:${formattedMinutes} ${amPm}`;

            setTime(formattedTime);
        }, 1000);

        // Clean up the interval on component unmount
        return () => clearInterval(interval);
    }, []);

    return <h2>{time}</h2>;
}

function ClockIn() {
    const [clockedIn, setClockedIn] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [paused, setPaused] = useState(false);
    const [timeEntries, setTimeEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedTimeEntries = localStorage.getItem('timeEntries');
        if (storedTimeEntries) {
            setTimeEntries(JSON.parse(storedTimeEntries));
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!loading) {
            localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
        }
    }, [timeEntries, loading]);

    useEffect(() => {
        let interval;
        if (clockedIn && !paused) {
            interval = setInterval(() => {
                setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [clockedIn, paused]);

    const handleClockIn = () => {
        setClockedIn(true);
        setStartTime(new Date());
    };

    const handlePause = () => {
        setPaused(true);
    };

    const handleResume = () => {
        setPaused(false);
    };

    const handleClockOut = () => {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear().toString().slice(-2)}`;

        const timeEntry = {
            date: formattedDate,
            elapsedTime: formatTime(elapsedTime),
        };

        setTimeEntries((prevTimeEntries) => [...prevTimeEntries, timeEntry]);

        setClockedIn(false);
        setPaused(false);
        setStartTime(null);
        setElapsedTime(0);
    };

    const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;

        return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    const handleClearLocalStorage = () => {
        localStorage.clear();
        setTimeEntries([]);
        alert('Time log storage cleared!');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {!clockedIn && !paused &&(
                <div>
                    <h1>00:00:00</h1>
                    <button className="button clock-in" onClick={handleClockIn}>Clock in</button>
                </div>
            )}

            {clockedIn && !paused && (
                <div>
                    <h1>{formatTime(elapsedTime)}</h1>
                    <button className="button pause" onClick={handlePause}>Pause</button>
                    <button className="button clock-out" onClick={handleClockOut}>Clock out</button>
                </div>
            )}

            {paused && (
                <div>
                    <h1>{formatTime(elapsedTime)}</h1>
                    <button className="button resume" onClick={handleResume}>Resume</button>
                    <button className="button clock-out" onClick={handleClockOut}>Clock out</button>
                </div>
            )}
            {timeEntries.length > 0 && (
                <div>
                    <button className="button clear-logs" onClick={handleClearLocalStorage}>Clear Logs</button>
                    {timeEntries.map((entry, index) => (
                        <p key={index}>
                            {`${entry.date} - ${entry.elapsedTime}`}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}



