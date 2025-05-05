import { create } from 'zustand';
import { databases, storage} from './appwrite';

// Constantes pour votre base de données et collection
const DATABASE_ID = 'votre_database_id';
const COLLECTION_ID = 'votre_collection_id';

export const useExplauraStore = create((set) => ({    
    isLoading: false,
    error: null,    

    SPOT: {}, // List all Spots
    MEDIA : {},
    SELECTED_SPOT : null,
    SELECTED_INDEX : null,
    setSELECTED_INDEX: (index) => set({ SELECTED_INDEX: index }),
    SELECTED_INFO : null,
    setSELECTED_INFO: (data) => set({ SELECTED_INFO: data }),
    GPX : null,
    PREV_GPX : null,
    MOVE : {lat : 0, lng :0},
    FILTRES : null,
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



export const useMapStore = create((set) => ({
    BOUNDS : [[46.785829, 0.796244],[44.049197, 6.198830]],
    MOBILE : false,
    USER_POSITION : {},
    MAP_SETTINGS : {
        URL : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        MAXZOOM : 18,
        MINZOOM : 7,
        VISCOSITY : 0.8,
        CENTER : {lat:45.592104,lng:2.844146},
        ZOOM : 10
    },
    ICON_SETTINGS : {
        SIZE : [50, 50],
        ANCHOR : [50/2, 50],
        SHADOW : {
            URL : "image/markers/marker-shadow.png",
            ANCHOR : [50/2, 50],
            SIZE : [50, 50],
        },
        POPUP_ANCHOR:[0, -50]
    }
}))

export const useGpxStore = create((set) => ({
    GPX : null,
    PREVIOUS_GPX : {},
    setPREVIOUS_GPX: (id, gpxData) => set((state) => ({
        PREVIOUS_GPX: {
          ...state.PREVIOUS_GPX,
          [id]: gpxData
        }
    })),
    MOVE : {lat : 0, lng : 0},
}))