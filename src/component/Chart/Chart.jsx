import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Dot } from 'recharts';
import { useExplauraStore, useGpxStore } from '../../store';
import "./Chart.css"

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#222', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}>
        <div className='Tooltip-Wrapper'><div className='Chart-Bar Bar-Alt'></div><p className="label">{`${payload[0].value}m`}</p></div>
        {/* <div className='Tooltip-Wrapper'><div className='Chart-Bar Bar-km'></div><p className="intro">{`${label}km`}</p></div> */}
      </div>
    );
  }
  return null;
};

const CustomizedDot = (props) => {
    const { cx, cy, payload } = props;
      return <Dot cx={cx} cy={cy} r={6} fill="var(--card-bg)" stroke="var(--chart)" strokeWidth={2} />;
  };
  

  // Component
const Chart = () => {
    const {GPX_DATA, setMOVE} = useGpxStore(); 
    const Data = (GPX_DATA) && GPX_DATA?.ElevationArray?.map((item, index) => {
        const Data = {
                Distance : parseFloat(GPX_DATA.ElevationLabel[index]),
                Altitude : parseInt(item)
            }        
        return Data
    })
    
    const BlockScroll = (e) =>{ document.querySelector('.App ').classList.add('BlockScroll') }
    const AllowScroll = (e) =>{ document.querySelector('.App ').classList.remove('BlockScroll') }    
    const ShowChart = (Data) ? "ShowChart" : "HideChart";
    var NoSpam;
    const HoverChart = (e) =>{
        clearTimeout(NoSpam);
        NoSpam = setTimeout(()=>{
            (e.activeTooltipIndex) && setMOVE(GPX_DATA?.GpxData?.LatLngSvg[e.activeTooltipIndex]);
        },10);        
    }


  return (
    <div  onTouchStart={BlockScroll} onTouchEnd={AllowScroll}  className={`Chart ${ShowChart}`}>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={Data}
          margin={{ top: 20, right: 20, left: 20, bottom: 0 }}
          onMouseMove={HoverChart}
        >
          <defs>
            <linearGradient id="colorAltitude" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart)" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="var(--card-bg)" stopOpacity={0.4}/>
            </linearGradient>
          </defs>
          <XAxis
            dataKey="Distance"
            type="number"
            axisLine={false}
            tickLine={false}
            unit="km"
            domain={[0, 'auto']}
            
            tickCount={4}
            //hide
          />
          <YAxis
            dataKey="Altitude"
            type="number"
            axisLine={false}
            tickLine={false}
            unit="m"
            domain={['dataMin', 'auto']}
            tickCount={4}
            //hide
          />
          <Tooltip cursor={false} content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="Altitude"
            stroke="var(--chart)"
            fill="url(#colorAltitude)"
            activeDot={<CustomizedDot />}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
