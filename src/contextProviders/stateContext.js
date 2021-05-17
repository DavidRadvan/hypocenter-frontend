import React, { createContext, useState } from 'react';

const initialPins = {
  earthquake: {
    latitude: 0,
    longitude: 0,
  },
  mode: "main",
  earthquakes: [],
  startSite: false,
  globeLoaded: false,
  user: false,
  countryNotifications: "",
  magnitudeNotifications: "",
  dark: false,
};

const initPopup = {
  new: false,
  earthquakes: []
}


export const stateContext = createContext(null);

export function StateProvider(props) {
  const [state, setState] = useState(initialPins);
  const [liveList, setLiveList] = useState([]);
  const [eqPopup, setEqPopup] = useState(initPopup)
  const [listOfComments, setListOfComments] = useState([]);


  const earthquakePins = (data) => {
    setState(prev => {
      return {
        ...prev,
        earthquakes: data,
      }
    });
  }

  const addNewEarthquakePin = (data) => {
    setState(prev => {
      const earthquakeList = [...prev.earthquakes];

      for (let quake of data) {
        earthquakeList.push(quake)
      }
      return {
        ...prev,
        earthquakes: earthquakeList
      };
    })
  };

  const liveListUpdate = (data) => {
    const recentEQs = [];
    for (let i = 0; i < 5; i++) {
      recentEQs.push(data[i])
    }
    return setLiveList(recentEQs);
  };

  //takes in new pushed quake, and adds it to the front of the most recent quakes arr
  const addNewLiveListItem = (data) => {

    setLiveList(prev => {
      const recentEQs = [...prev];
      const currentEQs = [];
      const seenEqs = {};
      recentEQs.forEach(quake => seenEqs[quake.id] = true);
      for (let quake of data) {
        if ((!seenEqs[quake.id]) && (Number(quake.time_stamp) >= Number(recentEQs[0].time_stamp))) {
          currentEQs.push(quake);
          recentEQs.pop();
          seenEqs[quake.id] = true;
        }
      };
      // sets eqPopup state with brand new eq's to set notifications
      //dont love my implementation here, function doing a lot
      setEqPopup(prev => {
        return {
          ...prev,
          new: true,
          earthquakes: [...currentEQs]
        };
      })
      return [...currentEQs, ...recentEQs];
    })
  };

  const exports = { state, setState, liveList, setLiveList, liveListUpdate, addNewLiveListItem, addNewEarthquakePin, earthquakePins, eqPopup, setEqPopup, listOfComments, setListOfComments }

  return (
    <stateContext.Provider value={exports}>
      {props.children}
    </stateContext.Provider>
  );
};
