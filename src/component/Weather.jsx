import { useQuery } from '@tanstack/react-query';
import { useExplauraStore } from '../store';

export default function Weather() {


    const { SELECTED_INFO, getFilePreview  } = useExplauraStore();

    // Utiliser useQueries pour faire plusieurs requêtes simultanément
    const { data, isLoading, error } = useQuery({
        queryKey: ['weather', SELECTED_INFO],
        queryFn: async () => {
            const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${SELECTED_INFO?.COORD[0]}&longitude=${SELECTED_INFO?.COORD[1]}&current=temperature_2m,is_day,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,visibility,cloud_cover,wind_speed_10m,weather_code&daily=sunrise,sunset&timezone=auto`
            );
            
            if (!response.ok) {
            throw new Error(`Erreur pour ${SELECTED_INFO.NAME}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            return {data};
        },
        staleTime: 1000 * 60 * 30, // 30 minutes
    });


  if (isLoading) return <div>Chargement des données météo...</div>;
  if (error) return <div>Erreur lors de la récupération des données météo</div>;
  
  return (
    <div className='Info-weather-small' key="Item">
        <div key="Item" className='Info-Weather-Numbers-small'>
            <span className='Info-Weather-Temp-small'>{parseInt(data.data.current.temperature_2m)}°C</span>
            <img alt="Weather Icon" src={getFilePreview('weather-'+data.data.current.weather_code)} />
        </div>
    </div>
  );
}