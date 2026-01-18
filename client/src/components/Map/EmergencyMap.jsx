import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaf icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const EmergencyMap = ({ userLocation, hospitals = [] }) => {
    const [heatmapData, setHeatmapData] = useState([]);
    const [showHeatmap, setShowHeatmap] = useState(false);

    useEffect(() => {
        const fetchHeatmap = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/analytics/heatmap`);
                setHeatmapData(data);
            } catch (err) {
                console.error("Failed to load heatmap", err);
            }
        };
        fetchHeatmap();
    }, []);

    // Default center if no user location
    const center = userLocation || [20.5937, 78.9629];

    // Component to auto-zoom to data
    const RecenterMap = ({ data }) => {
        const map = useMap();
        useEffect(() => {
            if (data.length > 0 && showHeatmap) {
                const bounds = L.latLngBounds(data.map(p => [p.lat, p.lng]));
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }, [data, showHeatmap, map]);
        return null;
    };

    return (
        <div className="h-full w-full relative">
            <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className="absolute top-4 right-4 z-[1000] bg-white px-4 py-2 rounded-lg shadow-xl font-bold text-slate-700 hover:bg-slate-50 border-2 border-slate-200"
            >
                {showHeatmap ? 'Hide Risk Zones' : 'Show Emergency Heatmap'}
            </button>

            {showHeatmap && heatmapData.length === 0 && (
                <div className="absolute top-16 right-4 z-[1000] bg-white/90 backdrop-blur text-slate-600 px-4 py-2 rounded-lg shadow-lg text-sm font-semibold border-l-4 border-blue-500">
                    No active risk zones detected nearby.
                </div>
            )}

            <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-full w-full rounded-2xl z-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <RecenterMap data={heatmapData} />

                {/* User Location */}
                {userLocation && (
                    <Marker position={userLocation}>
                        <Popup>You are here</Popup>
                    </Marker>
                )}

                {/* Hospitals */}
                {hospitals.map(hospital => (
                    <Marker key={hospital._id} position={[hospital.location.coordinates[1], hospital.location.coordinates[0]]}>
                        <Popup>
                            <strong>{hospital.name}</strong><br />
                            {hospital.phone}
                        </Popup>
                    </Marker>
                ))}

                {/* Heatmap Layer (Visualized as Red Circles) */}
                {/* Heatmap Layer (Visualized as Pulsing Radar Beacons) */}
                {showHeatmap && heatmapData.map((point, idx) => {
                    const customIcon = L.divIcon({
                        className: 'custom-div-icon',
                        html: `
                            <div class="relative w-6 h-6 -ml-3 -mt-3">
                                <div class="absolute w-full h-full bg-red-500 rounded-full animate-ping opacity-75"></div>
                                <div class="absolute top-1.5 left-1.5 w-3 h-3 bg-red-600 border-2 border-white rounded-full shadow-md"></div>
                            </div>
                        `,
                        iconSize: [24, 24],
                        iconAnchor: [12, 12]
                    });

                    return (
                        <Marker
                            key={idx}
                            position={[point.lat, point.lng]}
                            icon={customIcon}
                        >
                            <Tooltip sticky>
                                <span className="font-bold text-red-600">Priority Score: {Math.round(point.weight * 10)}</span>
                            </Tooltip>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default EmergencyMap;
