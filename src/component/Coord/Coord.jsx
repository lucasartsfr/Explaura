import { useExplauraStore } from "../../store";
import { useState, useEffect } from "react";
import NumberFlow from '@number-flow/react'

export default function Coord() {
    const { SELECTED_INFO } = useExplauraStore();
    const [coordValues, setCoordValues] = useState({
        latDegrees: 0,
        latMinutes: 0,
        latSeconds: 0,
        lngDegrees: 0,
        lngMinutes: 0,
        lngSeconds: 0,
        latDirection: "N",
        lngDirection: "E"
    });

    useEffect(() => {
        if (!SELECTED_INFO?.COORD || !Array.isArray(SELECTED_INFO?.COORD) || SELECTED_INFO?.COORD.length !== 2) {
            return;
        }

        const latitude = SELECTED_INFO.COORD[0];
        const longitude = SELECTED_INFO.COORD[1];

        // Conversion de la latitude
        const latDirection = latitude >= 0 ? "N" : "S";
        const latAbs = Math.abs(latitude);
        const latDegrees = Math.floor(latAbs);
        const latMinutes = Math.floor((latAbs - latDegrees) * 60);
        const latSeconds = ((latAbs - latDegrees) * 60 - latMinutes) * 60;

        // Conversion de la longitude
        const lngDirection = longitude >= 0 ? "E" : "W";
        const lngAbs = Math.abs(longitude);
        const lngDegrees = Math.floor(lngAbs);
        const lngMinutes = Math.floor((lngAbs - lngDegrees) * 60);
        const lngSeconds = ((lngAbs - lngDegrees) * 60 - lngMinutes) * 60;

        setCoordValues({
            latDegrees,
            latMinutes,
            latSeconds,
            lngDegrees,
            lngMinutes,
            lngSeconds,
            latDirection,
            lngDirection
        });
    }, [SELECTED_INFO?.COORD]);

    // Si aucune coordonnée n'est disponible
    if (!SELECTED_INFO?.COORD || !Array.isArray(SELECTED_INFO?.COORD) || SELECTED_INFO?.COORD.length !== 2) {
        return <div>Coordonnées non disponibles</div>;
    }

    return (
        <div className="Info_Coord">
            {coordValues.latDirection} 
            <NumberFlow value={coordValues.latDegrees} />°
            <NumberFlow value={coordValues.latMinutes} />'
            <NumberFlow value={coordValues.latSeconds.toFixed(3)} />" . {coordValues.lngDirection} <NumberFlow value={coordValues.lngDegrees} />°
            <NumberFlow value={coordValues.lngMinutes} />'
            <NumberFlow value={coordValues.lngSeconds.toFixed(3)} />"
        </div>
    );
}
