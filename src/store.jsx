import { create } from 'zustand';
import { databases, storage} from './appwrite';
import * as L from "leaflet";

// Constantes pour votre base de données et collection

export const useExplauraStore = create((set, get) => ({    
    isLoading: false,
    error: null,    

    SPOT: {}, // List all Spots
    WEATHER_SPOT : null,
    MEDIA : {},
    SELECTED_SPOT : null,
    WEATHER : null,
    
    SELECTED_INDEX : null,
    setSELECTED_INDEX: (index) => set({ SELECTED_INDEX: index }),

    SELECTED_INFO : null,
    SELECTED_INFO_DEFAULT : {
        NAME : "Explaura",
        TYPE : "user",
        COORD : [45.77246462548193, 2.9625362995532574], 
        PARKING : [45.76422760935789, 2.956646164618501],   
        DESCRIPTION : "Explaura a été Développé avec ♥ par un passionné de Randonnée et de Photographie. Cliquez sur un point d'intérêt pour en apprendre plus sur un lieu ou une randonnée ! Les filtres vous permettent de voir la pollution lumineuse, mais aussi les lieux ou le vol en drone est autorisé.",   
        PHOTOS : ["1.jpg"],
    },
    setSELECTED_INFO: (data) => set({ SELECTED_INFO: data }),

    FILTRES : null,
    setFILTRES: (filtre) => set({ FILTRES: filtre }),

    RATE_EMOJI : ["😭","😞","😟","😐","🙂","😊","😃","😁","🤩","😍"],

    fetchSPOTs: async () => {
        set({ isLoading: true, error: null });
    
        try {
            const response = await databases.listDocuments("6817b727000c74bbdb93", "6817b9c0003343f9a85f");
    
            // Transformer le tableau en objet indexé par $id
            const spotObject = response.documents.reduce((acc, doc) => {
                acc[doc.$id] = doc;
                return acc;
            }, {});
    
            set({ 
                SPOT: spotObject,
                isLoading: false 
            });
    
            return spotObject;
        } catch (error) {
            console.error('Erreur lors de la récupération des SPOTs:', error);
            set({ 
                error: error.message,
                isLoading: false 
            });
        }
    },
    fetchFiles: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await storage.listFiles('6817b7e90005e3cde7b1'); // Remplace par ton bucket ID
          set({ MEDIA: response.files, isLoading: false });
        } catch (error) {
          console.error('Erreur lors du chargement des fichiers :', error);
          set({ error: error.message, isLoading: false });
        }
    },
    getFilePreview: (fileId) => {
        return storage.getFileView('6817b7e90005e3cde7b1', fileId);
    },


}))



export const useMapStore = create((set, get) => ({
    BOUNDS : [[46.785829, 0.796244],[44.049197, 6.198830]],
    MOBILE : false,
    setMOBILE: (state) => set({ MOBILE: state }),
    USER_POSITION : {},
    MAP_SETTINGS : {
        URL : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        MAXZOOM : 18,
        MINZOOM : 6,
        VISCOSITY : 0.8,
        CENTER : {lat:45.592104,lng:2.844146},
        ZOOM : 10,
        SCREENSHOT : {
            MAPS : {s:"a",g:"mt0",x:4163,y:2921,z:13},
            WEATHER : {s:"a",g:"mt0",x:32,y:22,z:6}
        }
    },

    MAP_OVERLAY : {
        DRONE : L.tileLayer.wms("https://www.drone-spot.tech/cache/{z}/{x}/{y}.png", { 
            minZoom : 6,
            maxZoom: 18,   
            tileSize: 256,
            zoomOffset: 0, //-1
            opacity: 0.5,
            Name: "DRONE", 
            maxNativeZoom : 15
        }),
        LIGHT : L.tileLayer.wms("https://darksitefinder.com/maps/tiles/2022/tile_{z}_{x}_{y}.png", {
            minZoom : 6,
            maxZoom: 18,   
            tileSize: 256,
            zoomOffset: 0, //-1
            opacity: 0.5, 
            Name: "LIGHT", 
            maxNativeZoom : 6
        }),
        
        
    },
    CUSTOM_OVERLAY : null,
    setCUSTOM_OVERLAY: (overlay) => set({ CUSTOM_OVERLAY: overlay }),

    MAP_LAYER :{
        TERRAIN : L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { updateWhenIdle: false, minZoom : 6, maxZoom: 18, maxNativeZoom : 16, format: 'jpg', time: '', noWrap : true, tilematrixset: 'GoogleMapsCompatible_Level', tileSize: 256, zoomOffset: 0, accessToken: 'pk.eyJ1Ijoic3dlZWZ0aCIsImEiOiJja3ptZ2IzN2g0M2hrMnVvMWttdWt6cnptIn0.ExNhsIX2PX-DXGjmQVVgsw', keepBuffer: 10}), //https://explaura.app/assets/maps/terrain/{z}/{x}/{y}.png
        GREY : L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", { minZoom : 6, maxZoom: 18, format: 'jpg', time: '', noWrap : true, tilematrixset: 'GoogleMapsCompatible_Level', tileSize: 256, zoomOffset: 0, accessToken: 'pk.eyJ1Ijoic3dlZWZ0aCIsImEiOiJja3ptZ2IzN2g0M2hrMnVvMWttdWt6cnptIn0.ExNhsIX2PX-DXGjmQVVgsw', keepBuffer: 10, maxNativeZoom : 20}),
        SATELITE : L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { minZoom : 6, maxZoom: 18, maxNativeZoom : 20, format: 'jpg', time: '', noWrap : true, tilematrixset: 'GoogleMapsCompatible_Level', tileSize: 256, zoomOffset: 0, accessToken: 'pk.eyJ1Ijoic3dlZWZ0aCIsImEiOiJja3ptZ2IzN2g0M2hrMnVvMWttdWt6cnptIn0.ExNhsIX2PX-DXGjmQVVgsw', keepBuffer: 10}),
        GOOGLE : L.tileLayer("https://mt0.google.com/vt/lyrs=p&x={x}&y={y}&z={z}", { minZoom : 6, maxZoom: 18, maxNativeZoom : 20, format: 'jpg', time: '', noWrap : true, tilematrixset: 'GoogleMapsCompatible_Level', tileSize: 256, zoomOffset: 0, accessToken: 'pk.eyJ1Ijoic3dlZWZ0aCIsImEiOiJja3ptZ2IzN2g0M2hrMnVvMWttdWt6cnptIn0.ExNhsIX2PX-DXGjmQVVgsw', keepBuffer: 10}),
        TRAILS : L.tileLayer("https://topo.wanderreitkarte.de/topo/{z}/{x}/{y}.png", { minZoom : 6, maxZoom: 18, maxNativeZoom : 20, format: 'jpg', time: '', noWrap : true, tilematrixset: 'GoogleMapsCompatible_Level', tileSize: 256, zoomOffset: 0, accessToken: 'pk.eyJ1Ijoic3dlZWZ0aCIsImEiOiJja3ptZ2IzN2g0M2hrMnVvMWttdWt6cnptIn0.ExNhsIX2PX-DXGjmQVVgsw', keepBuffer: 10}),
        DARK : L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png", {minZoom: 0,maxZoom: 20, format: 'png', accessToken: 'pk.eyJ1Ijoic3dlZWZ0aCIsImEiOiJja3ptZ2IzN2g0M2hrMnVvMWttdWt6cnptIn0.ExNhsIX2PX-DXGjmQVVgsw'})
    },
    CUSTOM_LAYER : L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {  updateWhenIdle: false, minZoom : 6, maxZoom: 18, maxNativeZoom : 16, format: 'jpg', time: '', noWrap : true, tilematrixset: 'GoogleMapsCompatible_Level', tileSize: 256, zoomOffset: 0, accessToken: 'pk.eyJ1Ijoic3dlZWZ0aCIsImEiOiJja3ptZ2IzN2g0M2hrMnVvMWttdWt6cnptIn0.ExNhsIX2PX-DXGjmQVVgsw', keepBuffer: 10}),
    setCUSTOM_LAYER: (layer) => set({ CUSTOM_LAYER: layer }),

    ICON_SETTINGS : {
        SIZE : [50, 50],
        ANCHOR : [50/2, 50],
        SHADOW : {
            URL : "https://fra.cloud.appwrite.io/v1/storage/buckets/6817b7e90005e3cde7b1/files/marker-shadow/view?project=6817b682003b9ec591eb&mode=admin",
            ANCHOR : [50/2, 50],
            SIZE : [50, 50],
        },
        POPUP_ANCHOR:[0, -50]
    },
    ICON_DEFAULT : {
        iconSize: [50, 50],
        iconAnchor: [50/2, 50],    
        shadowUrl : "https://fra.cloud.appwrite.io/v1/storage/buckets/6817b7e90005e3cde7b1/files/marker-shadow/view?project=6817b682003b9ec591eb&mode=admin",
        shadowAnchor: [50/2, 50], 
        shadowSize:   [50, 50],
        popupAnchor: [0, -50],
    },
    initListIcons: () => {
        set({
            LIST_ICON: {
                PARKING: L.icon({...get().ICON_DEFAULT, iconUrl: "https://fra.cloud.appwrite.io/v1/storage/buckets/6817b7e90005e3cde7b1/files/marker-parking/view?project=6817b682003b9ec591eb&mode=admin"}),
                INTEREST: L.icon({...get().ICON_DEFAULT, iconUrl: "https://fra.cloud.appwrite.io/v1/storage/buckets/6817b7e90005e3cde7b1/files/marker-interest/view?project=6817b682003b9ec591eb&mode=admin"}),
                START: L.icon({...get().ICON_DEFAULT, iconUrl: "https://fra.cloud.appwrite.io/v1/storage/buckets/6817b7e90005e3cde7b1/files/marker-start/view?project=6817b682003b9ec591eb&mode=admin"}),
                END: L.icon({...get().ICON_DEFAULT, iconUrl: "https://fra.cloud.appwrite.io/v1/storage/buckets/6817b7e90005e3cde7b1/files/marker-stop/view?project=6817b682003b9ec591eb&mode=admin"}),
                MOVE: L.icon({...get().ICON_DEFAULT, className: "MoveIcon", shadowUrl: null, iconUrl: "https://fra.cloud.appwrite.io/v1/storage/buckets/6817b7e90005e3cde7b1/files/marker-move/view?project=6817b682003b9ec591eb&mode=admin"}),
                INTEREST_DIV : L.divIcon({...get().ICON_DEFAULT, html: `<div class="Marker-v3-dot" style="background-color : var(--interest);"></div>`,className: 'Marker-v3 ripple'})
            }
        });
    },
    DISTANCE_CALC: (lat1, lon1, lat2, lon2) => {
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p)/2 + 
                c(lat1 * p) * c(lat2 * p) * 
                (1 - c((lon2 - lon1) * p))/2;      
        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    }
}))
useMapStore.getState().initListIcons();

export const useGpxStore = create((set) => ({
    GPX : null,    
    resetGPX: (data) => set({ GPX: null }), 
    getGPXContent: async (fileId) => {
        try {
          const url = storage.getFileDownload('6817b7e90005e3cde7b1', fileId);
          const res = await fetch(url);
          const gpxText = await res.text(); // Le contenu GPX brut
          set({ GPX: gpxText }); // ⬅️ Stocke dans le state Zustand
          return url
        } catch (err) {
          console.error('Erreur lecture GPX :', err);
          set({ GPX: null });
        }
    },     
    PREVIOUS_GPX : {},
    setPREVIOUS_GPX: (id, gpxData) => set((state) => ({
        PREVIOUS_GPX: {
          ...state.PREVIOUS_GPX,
          [id]: gpxData
        }
    })),

    MOVE : {lat : 0, lng : 0},
    setMOVE: (data) => set({ MOVE: data }),
    
    GPX_DATA : null,
    setGPX_DATA: (data) => set({ GPX_DATA: data }),
    PARSE_GPX_DATA: (e) => {
        
        let coordinates = [];  
        // Vérifier que les layers existent
        if (e.target.getLayers && e.target.getLayers().length > 0 && e.target.getLayers()[0]._layers) {
          // Parcourir tous les layers pour trouver les coordonnées
          const layers = e.target.getLayers()[0]._layers;          
          // Itérer sur les layers
          Object.values(layers).forEach(layer => {
            // Si la couche a des coordonnées (comme une polyline)
            if (layer.getLatLngs) {
              const points = layer.getLatLngs();
              coordinates = coordinates.concat(points);
            }
          });
        }

        // Mobile GPX Temp
        let GpxData = {
            TotalTime : (e.target.get_duration_string_iso(e.target.get_moving_time())),
            MinElevation : e.target.get_elevation_min(),
            MaxElevation : e.target.get_elevation_max(),
            Denivele : (e.target.get_elevation_max() - e.target.get_elevation_min()),
            GainElevation : (e.target.get_elevation_gain()).toFixed(0),
            LossElevation : e.target.get_elevation_loss(),
            ElevationData : e.target.get_elevation_data(),
            Distance : ((e.target.get_distance()/1000).toFixed(2)),
            SpeedAverage : (e.target.get_total_speed().toFixed(2)),
            SpeedData : e.target.get_speed_data(),
            SpeedMax : e.target.get_speed_max(),
            MovingSpeed : e.target.get_moving_speed(),
            MovingTime : (e.target.get_moving_time()/1),
            MovingPace : (e.target.get_duration_string_iso(e.target.get_moving_pace())),
            Start : e.target.get_start_time(),
            End : e.target.get_end_time(),
            MinutePerKm : (e.target.get_duration_string_iso( (e.target.get_moving_time() / (e.target.get_distance()/1000).toFixed()) ).split(".")[0]),
            Heart : e.target.get_average_hr(),
            Cadence : e.target.get_average_cadence(),
            CadenceData : e.target.get_cadence_data(),
            LatLngSvg : coordinates
        }        

        // Elevation
        let ElevationArray = [];
        let ElevationLabel = [];
        for(let i = 0; i < GpxData.ElevationData.length; i++){
                ElevationArray.push(GpxData.ElevationData[i][1].toFixed(2)); 
                ElevationLabel.push(GpxData.ElevationData[i][0].toFixed(2)+" km"); 
        }

        // Vitesse moyenne corrigée en mouvement (Supprime les petits mouvements)
        let UpdSpd = 0;
        let CountUpdSpd = 0;
        let Precision = 1;
        let MinSpeed = 3;
        for(let i = 0; i < GpxData.SpeedData.length; i++){
            if(i > 0 && GpxData.SpeedData[i][1] < MinSpeed && (GpxData.SpeedData[i][0].toFixed(Precision)) === (GpxData.SpeedData[(i-1)][0].toFixed(Precision))){}        
            else{
                UpdSpd = UpdSpd + parseFloat(GpxData.SpeedData[i][1])
                CountUpdSpd++;
            }
        }
        GpxData.MovingSpeedUpdated = parseFloat((UpdSpd/CountUpdSpd).toFixed(2)) 

        return {ElevationArray, ElevationLabel, GpxData}
    }
}))