import React, { useContext, useEffect, useState } from 'react';
import { stateContext } from '../contextProviders/stateContext'
import ReactGlobe from 'react-globe';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import './Globe.css'
import magnitudeColor from '../helpers/magnitudeColor'

import LiveList from './LiveList'


import Fade from './Fade.js'
import { globeLoaderContext } from '../contextProviders/globeLoaderContext'


export default function Globe(props) {
  const { state, setState } = useContext(stateContext);
  const { globeLoaded, setGlobeLoaded, startSite, setStartSite } = useContext(globeLoaderContext)

  const [
    hasGlobeBackgroundTextureLoaded,
    setHasGlobeBackgroundTextureLoaded,
  ] = useState(false);

  const [
    hasGlobeCloudsTextureLoaded,
    setHasGlobeCloudsTextureLoaded,
  ] = useState(false);

  const [hasGlobeTextureLoaded, setHasGlobeTextureLoaded] = useState(false);

  useEffect(() => {
    if (
      hasGlobeBackgroundTextureLoaded &&
      hasGlobeCloudsTextureLoaded &&
      hasGlobeTextureLoaded
    ) {
      setGlobeLoaded(true)
    }
  }, [
    hasGlobeBackgroundTextureLoaded,
    hasGlobeCloudsTextureLoaded,
    hasGlobeTextureLoaded,
  ]);

  const toQuakePage = (marker) => {
    setTimeout(() => {
      setState(prev => {
        return {
          ...prev,
          earthquake: {
            id: marker.id,
            title: marker.title,
            latitude: marker.latitude,
            longitude: marker.longitude,
            depth: marker.depth,
            magnitude: marker.magnitude,
            pager: marker.pager,
            time_stamp: marker.time_stamp,
            tsunami: marker.tsunami,
          },
          mode: 'earthquake'
        }
      })
    }, 1000);
  };

  const eqArr = state.earthquakes.map(earthquake => (

    {
      ...earthquake,
      coordinates: [earthquake.latitude, earthquake.longitude],
      color: magnitudeColor(earthquake.magnitude, earthquake.pager),
      value: earthquake.magnitude,
      date: new Date(Number(earthquake.time_stamp)).toDateString().split(' ').slice(1).join(' ')
    }
  ));

  const options = {
    focusAnimationDuration: 1000,
    focusEasingFunction: ['Linear', 'None'],
    globeGlowColor: 'lightblue',
    ambientLightColor: '#b6bbc2',
    ambientLightIntensity: 1,
    markerTooltipRenderer: marker => `${marker.title} \n${marker.date} \nMagnitude ${marker.magnitude}`,
    markerRadiusScaleRange: [0.005, 0.009],
    markerGlowRadiusScale: 0,
    enableCameraRotate: startSite,
    globeGlowPower: 4.5,
  };

  // http://www.planetaryvisions.com/libsamples/4104_1.jpg
  // https://media.istockphoto.com/photos/tectonic-plates-move-constantly-making-new-areas-of-ocean-floor-picture-id1146522618?k=6&amp;m=1146522618&amp;s=612x612&amp;w=0&amp;h=5xKyOD-rqC1URJiG71YE4lrqrTAE3YA_Hu0Q9ooxNrU=

  return (
    <>
      <div className={globeLoaded ? 'globe' : 'hidden'}>
        {state.dark && <ReactGlobe
          onClickMarker={toQuakePage}
          markers={eqArr}
          options={{...options, pointLightIntensity: 0.5, globeGlowColor: 'lightblue', ambientLightIntensity: 1, ambientLightColor: '#474643', globeGlowPower: 4,}}
          onGlobeTextureLoaded={() => setHasGlobeTextureLoaded(true)}
          onGlobeBackgroundTextureLoaded={() => setHasGlobeBackgroundTextureLoaded(true)}
          onGlobeCloudsTextureLoaded={() => setHasGlobeCloudsTextureLoaded(true)}
        />}
        {!state.dark && <ReactGlobe
          onClickMarker={toQuakePage}
          markers={eqArr}
          options={options}
          onGlobeTextureLoaded={() => setHasGlobeTextureLoaded(true)}
          onGlobeBackgroundTextureLoaded={() => setHasGlobeBackgroundTextureLoaded(true)}
          onGlobeCloudsTextureLoaded={() => setHasGlobeCloudsTextureLoaded(true)}
        />}
        <Fade show={startSite}>
        </ Fade>
      </div>
      <Fade animationDuration={3000} className="cover" show={!globeLoaded} />
    </>
  )
}

//<Fade animationDuration={3000} className="cover" show={!state.globeLoaded} />
