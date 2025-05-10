import { useExplauraStore } from "../../store";
import "./Info.css"
import Meteo from "../Meteo";
import Weather from "../Weather";
import { FaStar, FaRegStar, FaStarHalf } from "react-icons/fa";

export default function Info2() {
    const {SELECTED_INFO} = useExplauraStore();

    // Star Generator
    const RateGenerator = Array.from({ length: 5 }, (_, i) => {
        const rate = SELECTED_INFO?.RATE / 2;
        if (i < Math.floor(rate)) {
            return <FaStar className="Rate-on" key={i} />;
        } else if (i === Math.floor(rate) && !Number.isInteger(rate)) {
            return <FaStarHalf className="Rate-on" key={i} />;
        } else {
            return <FaStar className="Rate-off" key={i} />;
        }
    });

    //Info Generator
    const InfoGenerator = SELECTED_INFO?.INFOS.map((info, index) => {
        return (
            <div className="Info-Item" key={index}>
                <h2>{info.split('-')[0]}</h2>
                <p>{info.split('-')[0]}</p>
            </div>
        )
    })

    return (
        <div className="Info-scroller Info-Background" style={{backgroundImage: `url(${SELECTED_INFO?.PHOTOS[0]})`}}>
            <Weather />
           <div className="Info-Scroll">
            <div className="Info-Weather">
            </div>
            <div className="Info-Text">
                    <h1 className="Info-Name">{SELECTED_INFO?.NAME}</h1>
                    <div className="Info-Rate">
                        {RateGenerator}
                    </div>
                    <div className="Info-Info">
                        {InfoGenerator}
                    </div>
                    <p>{SELECTED_INFO?.DESCRIPTION}</p>
            </div>
           </div>
        </div> 
    )
}