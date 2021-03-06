import React, { useContext } from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";
import pagerConversion from "../../helpers/pagerConversion";
import { stateContext } from "../../contextProviders/stateContext";
import Tippy from "@tippyjs/react";
import Typography from "@material-ui/core/Typography";
import TsunamiBanner from "./TsunamiBanner";

function QuakeInfo(props) {
  const { state } = useContext(stateContext);
  const quake = state.earthquake;
  const energy = Math.round(10 ** (quake.magnitude * 1.44 + 5.24) * 10 ** -3);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const pagerColor = function () {
    if (quake.pager === "green") {
      return "#03fc17";
    } else if (quake.pager === "yellow") {
      return "#f8fc03";
    } else if (quake.pager === "orange") {
      return "#ff9900";
    } else if (quake.pager === "red") {
      return "#ff1c1c";
    }
  };

  return (
    <div class="eqInfoPanel">
      {quake.tsunami === 1 && <TsunamiBanner />}
      <List className="noPaddingTop">
        <Tippy
          content={`A measure of how powerful an earthquake is. The scale increases in power exponentially - compared to a M5 earthquake, a M6 earthquake has 10 times the seismic wave amplitude and 32 times the energy released.`}
        >
          <ListItem className="noPaddingTop">
            <ListItemText
              primary="Magnitude"
              secondary={
                <Typography style={{ color: "lightgrey", fontSize: "2rem;" }}>
                  {quake.magnitude}
                </Typography>
              }
              className={"quakeInfo"}
            />
          </ListItem>
        </Tippy>
        <Tippy
          content={`The PAGER system provided by USGS allows quick assessment of an earthquake's risk to life and property. PAGER takes into account bedrock conditions, population density, levels of economic development, earthquake depth, and more. There are four possible PAGER levels, from least to most severe: Green, Yellow, Orange, and Red.`}
        >
          <ListItem>
            <ListItemText
              primary="Pager Status"
              secondary={
                <Typography style={{ color: pagerColor(), fontSize: "2rem;" }}>
                  {quake.pager}
                </Typography>
              }
              className={"quakeInfo"}
            />
          </ListItem>
        </Tippy>
        <Tippy
          content={`The depth of the earthquake in kilometers from the surface. A shallow earthquake can be much more dangerous than its magnitude may imply.`}
        >
          <ListItem>
            <ListItemText
              primary="Depth"
              secondary={
                <Typography style={{ color: "lightgrey", fontSize: "2rem;" }}>
                  {quake.depth + " km"}
                </Typography>
              }
              className={"quakeInfo"}
            />
          </ListItem>
        </Tippy>
        <Tippy
          content={`Energy generated by the earthquake, calculated from log E = 5.24 + 1.44M, where E is energy and M is magnitude. Energy is represented in kilojoules.`}
        >
          <ListItem>
            <ListItemText
              primary="Energy Generated"
              secondary={
                <Typography style={{ color: "lightgrey", fontSize: "2rem;" }}>
                  {`${numberWithCommas(
                    energy
                  )} kJ - equivalent to ${numberWithCommas(
                    Math.round(energy * 0.00000024)
                  )} tons of TNT.`}
                </Typography>
              }
              className={"quakeInfo"}
            />
          </ListItem>
        </Tippy>
        <Tippy
          content={`Estimated economic damaged based on the PAGER response. Major earthquakes can severely disrupt a region's economy and damage crucial infrastructure.`}
        >
          <ListItem>
            <ListItemText
              primary="Estimated Economic Damage"
              secondary={
                <Typography style={{ color: "lightgrey", fontSize: "2rem;" }}>
                  {quake.pager ? pagerConversion[quake.pager].damage : null}
                </Typography>
              }
              className={"quakeInfo"}
            />
          </ListItem>
        </Tippy>
        <Tippy
          content={`Potential fatalities based on the PAGER response. Less developed countries with weaker infrastructure are likely to have higher fatality rates, as are countries near a tsunami-generating earthquake.`}
        >
          <ListItem>
            <ListItemText
              primary="Potential Fatalities"
              secondary={
                <Typography style={{ color: "lightgrey", fontSize: "2rem;" }}>
                  {quake.pager ? pagerConversion[quake.pager].fatalities : null}
                </Typography>
              }
              className={"quakeInfo"}
            />
          </ListItem>
        </Tippy>
        <Tippy
          content={`Time of earthquake rupture. This is calculated by triangulating the earthquake's location via three seismometer stations, and measure the difference in arrival time of the initial seismic waves.`}
        >
          <ListItem>
            <ListItemText
              primary="Time of Occurence"
              secondary={
                <Typography style={{ color: "lightgrey", fontSize: "2rem;" }}>
                  {new Date(Number(quake.time_stamp)).toString()}
                </Typography>
              }
              className={"quakeInfo"}
            />
          </ListItem>
        </Tippy>
        <Tippy
          content={`Large earthquakes that occur underwater are likely to trigger a tsunami - a signifigant threat for coastal regions.`}
        >
          <ListItem>
            <ListItemText
              primary="Danger of Tsunami"
              secondary={
                <Typography style={{ color: "lightgrey", fontSize: "2rem;" }}>
                  {quake.tsunami ? "Yes" : "No"}
                </Typography>
              }
              className={"quakeInfo"}
            />
          </ListItem>
        </Tippy>
      </List>
    </div>
  );
}

export default QuakeInfo;
