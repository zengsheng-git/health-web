<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Map Container -->
        <div class="relative h-screen">
            <!-- Search Controls -->
            <div class="absolute top-[70px] left-4 right-4 z-10 flex justify-between gap-4">
                <!-- Attraction Search -->
                <div class="bg-white bg-opacity-60 rounded-lg shadow-lg p-4 w-80">
                    <h3 class="text-lg font-semibold mb-3">Attraction search</h3>
                    <div class="flex gap-2 mb-3">
                        <input 
                            v-model="attractionSearch" 
                            @input="debouncedSearchAttractions"
                            placeholder="Search attraction names..."
                            class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <!-- Attraction Search Results -->
                    <div v-if="attractionSearchResults.length > 0" class="max-h-40 overflow-y-auto">
                        <div 
                            v-for="result in attractionSearchResults" 
                            :key="result.id"
                            @click="selectAttraction(result)"
                            class="p-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-b-0"
                        >
                            <div class="font-medium">{{ result.place_name }}</div>
                            <div class="text-xs text-gray-500">{{ result.properties?.category || 'Target' }}</div>
                        </div>
                    </div>
                </div>

                <!-- Start Location Search -->
                <div class="bg-white bg-opacity-60 rounded-lg shadow-lg p-4 w-80">
                    <h3 class="text-lg font-semibold mb-3">Starting position</h3>
                    <div class="flex gap-2 mb-3">
                        <input 
                            v-model="startLocation" 
                            @input="searchStartLocation"
                            placeholder="Enter starting location..."
                            class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    
                    <!-- Start Location Results -->
                    <div v-if="startSearchResults.length > 0" class="max-h-40 overflow-y-auto">
                        <div 
                            v-for="result in startSearchResults" 
                            :key="result.id"
                            @click="selectStartLocation(result)"
                            class="p-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-b-0"
                        >
                            <div class="font-medium">{{ result.place_name }}</div>
                        </div>
                    </div>
                </div>

                <!-- End Location Search -->
                <div class="bg-white bg-opacity-60 rounded-lg shadow-lg p-4 w-80">
                    <h3 class="text-lg font-semibold mb-3">End position</h3>
                    <div class="flex gap-2 mb-3">
                        <input 
                            v-model="endLocation" 
                            @input="searchEndLocation"
                            placeholder="Enter end location..."
                            class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    
                    <!-- End Location Results -->
                    <div v-if="endSearchResults.length > 0" class="max-h-40 overflow-y-auto">
                        <div 
                            v-for="result in endSearchResults" 
                            :key="result.id"
                            @click="selectEndLocation(result)"
                            class="p-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-b-0"
                        >
                            <div class="font-medium">{{ result.place_name }}</div>
                        </div>
                    </div>
                </div>

                <!-- Navigation Controls -->
                <div class="bg-white bg-opacity-60 rounded-lg shadow-lg p-4">
                    <h3 class="text-lg font-semibold mb-3">Navigation controls</h3>
                    <div class="flex gap-2">
                        <button 
                            @click="calculateRoute"
                            :disabled="!startCoordinates || !endCoordinates"
                            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Start navigation
                        </button>
                        <button 
                            @click="clearRoute"
                            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                        >
                            Clear route
                        </button>
                    </div>
                    
                    <!-- Route Info -->
                    <div v-if="routeInfo" class="mt-3 p-3 bg-green-50 rounded">
                        <div class="text-sm text-green-800">
                            <div>Distance: {{ routeInfo.distance }} km</div>
                            <div>Estimated time: {{ routeInfo.duration }} min</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Map -->
            <div id="map" class="w-full h-full"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Mapbox configuration
const mapboxglAccessToken = (import.meta as any).env.VITE_MapboxglAccessToken;

// Refs
const map = ref<any>(null);
const attractionSearch = ref('');
const startLocation = ref('');
const endLocation = ref('');
const attractionSearchResults = ref<any[]>([]);
const startSearchResults = ref<any[]>([]);
const endSearchResults = ref<any[]>([]);
const startCoordinates = ref<[number, number] | null>(null);
const endCoordinates = ref<[number, number] | null>(null);
const routeInfo = ref<any>(null);

// Load Mapbox from CDN
const loadMapbox = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        if ((window as any).mapboxgl) {
            resolve((window as any).mapboxgl);
            return;
        }

        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.15.0/mapbox-gl.css';
        document.head.appendChild(link);

        // Load JS
        const script = document.createElement('script');
        script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.15.0/mapbox-gl.js';
        script.onload = () => {
            resolve((window as any).mapboxgl);
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

// Search attractions using Mapbox Geocoding API with tourism categories
const searchAttractions = async () => {
    if (!attractionSearch.value.trim()) {
        attractionSearchResults.value = [];
        return;
    }

    try {
        console.log('Searching attractions for:', attractionSearch.value);
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(attractionSearch.value)}.json?access_token=${mapboxglAccessToken}&limit=10`;
        console.log('API Request URL:', url);
        
        const response = await fetch(url);
        console.log('API Response Status:', response.status);
        
        const data = await response.json();
        console.log('API response data complete:', data);
        
        // Log features count
        console.log('Total features returned:', data.features ? data.features.length : 0);
        
        // Simplify the filter to get more results
        const attractions = (data.features || []).filter((feature: any) => {
            // Less restrictive filter to ensure results are shown
            return true;
        });
        
        console.log('Filtered attractions count:', attractions.length);
        attractionSearchResults.value = attractions;
        console.log('Final search results set:', attractionSearchResults.value);
    } catch (error) {
        console.error('Attraction search error:', error);
        alert('Search failed, please try again later');
    }
};

// Debounced attraction search
let attractionSearchTimeout: NodeJS.Timeout;
const debouncedSearchAttractions = () => {
    console.log('Debounced search triggered');
    clearTimeout(attractionSearchTimeout);
    attractionSearchTimeout = setTimeout(() => {
        searchAttractions();
    }, 300);
};

// Select attraction as start location
const selectAttractionAsStart = async (result: any) => {
    attractionSearch.value = result.place_name;
    attractionSearchResults.value = [];
    
    // Set as start location
    startLocation.value = result.place_name;
    startCoordinates.value = result.geometry.coordinates;
    startSearchResults.value = [];
    
    // Add start marker to map
    if (map.value) {
        // Remove existing start marker
        const existingMarker = document.getElementById('start-marker');
        if (existingMarker) existingMarker.remove();
        
        const mapboxgl = await loadMapbox();
        
        new mapboxgl.Marker({ color: '#10B981', element: createMarkerElement('Start location', '#10B981') })
            .setLngLat(result.geometry.coordinates)
            .addTo(map.value);
            
        // Speed ​​up the map movement and set the duration to 300 milliseconds
        map.value.flyTo({ center: result.geometry.coordinates, zoom: 10, duration: 300 });
    }
};

// Select attraction as end location
const selectAttractionAsEnd = async (result: any) => {
    attractionSearch.value = result.place_name;
    attractionSearchResults.value = [];
    
    // Set as end location
    endLocation.value = result.place_name;
    endCoordinates.value = result.geometry.coordinates;
    endSearchResults.value = [];
    
    // Add end marker to map
    if (map.value) {
        // Remove existing end marker
        const existingMarker = document.getElementById('end-marker');
        if (existingMarker) existingMarker.remove();
        
        const mapboxgl = await loadMapbox();
        
        new mapboxgl.Marker({ color: '#EF4444', element: createMarkerElement('End location', '#EF4444') })
            .setLngLat(result.geometry.coordinates)
            .addTo(map.value);
            
        // Speed ​​up the map movement and set the duration to 300 milliseconds
        map.value.flyTo({ center: result.geometry.coordinates, zoom: 10, duration: 300 });
    }
};

// Select attraction from search results
const selectAttraction = async (result: any) => {
    attractionSearch.value = result.place_name;
    attractionSearchResults.value = [];
    
    // Add marker to map
    if (map.value) {
        // Remove existing markers
        const existingStartMarker = document.getElementById('start-marker');
        const existingEndMarker = document.getElementById('end-marker');
        if (existingStartMarker) existingStartMarker.remove();
        if (existingEndMarker) existingEndMarker.remove();
        
        const mapboxgl = await loadMapbox();
        
        // Create a special marker for searched attraction
        new mapboxgl.Marker({ color: '#8B5CF6', element: createMarkerElement('Target', '#8B5CF6') })
            .setLngLat(result.geometry.coordinates)
            .addTo(map.value);
            
        // Speed ​​up the map movement and set the duration to 300 milliseconds
        map.value.flyTo({ center: result.geometry.coordinates, zoom: 10, duration: 300 });
        
        // Set as start location by default
    }
};

// Initialize map
const initializeMap = async () => {
    try {
        const mapboxgl = await loadMapbox();
        mapboxgl.accessToken = mapboxglAccessToken;
        
        map.value = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [144.9631, -37.8136], // Melbourne coordinates
            zoom: 10
        });

        map.value.on('load', () => {
            console.log('Map loaded successfully');
        });
    } catch (error) {
        console.error('Failed to load Mapbox:', error);
    }
};

// Search locations using Mapbox Geocoding API
const searchLocation = async (query: string, type: 'start' | 'end') => {
    if (!query.trim()) {
        if (type === 'start') startSearchResults.value = [];
        else endSearchResults.value = [];
        return;
    }

    try {
        // console.log(`Searching ${type} location for:`, query);
        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxglAccessToken}&limit=5`
        );
        const data = await response.json();
        
        if (type === 'start') {
            startSearchResults.value = data.features || [];
        } else {
            endSearchResults.value = data.features || [];
        }
    } catch (error) {
        console.error('Search error:', error);
    }
};

// Debounced search functions
let searchTimeout: NodeJS.Timeout;
const searchStartLocation = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        searchLocation(startLocation.value, 'start');
    }, 300);
};

const searchEndLocation = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        searchLocation(endLocation.value, 'end');
    }, 300);
};

// Select location from search results
const selectStartLocation = async (result: any) => {
    startLocation.value = result.place_name;
    startCoordinates.value = result.geometry.coordinates;
    startSearchResults.value = [];
    
    // Add marker to map
    if (map.value) {
        // Remove existing start marker
        const existingMarker = document.getElementById('start-marker');
        if (existingMarker) existingMarker.remove();
        
        const mapboxgl = await loadMapbox();
        
        new mapboxgl.Marker({ color: '#10B981', element: createMarkerElement('Start location', '#10B981') })
            .setLngLat(result.geometry.coordinates)
            .addTo(map.value);
            
        // Speed ​​up the map movement and set the duration to 300 milliseconds
        map.value.flyTo({ center: result.geometry.coordinates, zoom: 10, duration: 300 });
    }
};

const selectEndLocation = async (result: any) => {
    endLocation.value = result.place_name;
    endCoordinates.value = result.geometry.coordinates;
    endSearchResults.value = [];
    
    // Add marker to map
    if (map.value) {
        // Remove existing end marker
        const existingMarker = document.getElementById('end-marker');
        if (existingMarker) existingMarker.remove();
        
        const mapboxgl = await loadMapbox();
        
        new mapboxgl.Marker({ color: '#EF4444', element: createMarkerElement('End location', '#EF4444') })
            .setLngLat(result.geometry.coordinates)
            .addTo(map.value);
            
        // Speed ​​up the map movement and set the duration to 300 milliseconds
        map.value.flyTo({ center: result.geometry.coordinates, zoom: 10, duration: 300 });
    }
};

// Create custom marker element
const createMarkerElement = (text: string, color: string) => {
    const element = document.createElement('div');
    element.id = text === 'Start location' ? 'start-marker' : 'end-marker';
    element.innerHTML = `
        <div style="background-color: ${color}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; white-space: nowrap;">
            ${text}
        </div>
    `;
    return element;
};





// Reverse geocoding to get address from coordinates
const reverseGeocode = async (coords: [number, number], type: 'start' | 'end') => {
    try {
        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords[0]},${coords[1]}.json?access_token=${mapboxglAccessToken}`
        );
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
            const address = data.features[0].place_name;
            if (type === 'start') {
                startLocation.value = address;
            } else {
                endLocation.value = address;
            }
        }
    } catch (error) {
        console.error('Reverse geocoding error:', error);
    }
};

// Calculate route using Mapbox Directions API with fallback to other modes
const calculateRoute = async () => {
    if (!startCoordinates.value || !endCoordinates.value || !map.value) {
        alert('Please select the start location and end location');
        return;
    }

    try {
        // Try multiple modes: driving-traffic, driving, walking, cycling
        const modes = ['driving-traffic', 'driving', 'walking', 'cycling'];
        let routeFound = false;
        let lastError = null;
        
        // Calculate straight-line distance between start and end points
        const straightLineDistance = calculateStraightLineDistance(startCoordinates.value, endCoordinates.value);
        console.log(`Straight-line distance from start to end:${straightLineDistance.toFixed(2)} kilometer`);
        
        // Create a copy of modes to modify based on distance
        let modesToTry = [...modes];
        
        // Adjust modes based on distance
        if (straightLineDistance > 500) {
            // More than 500 km, try driving mode only
            modesToTry = modes.filter(mode => mode.startsWith('driving'));
            console.log(`For distances over 500 km, try driving mode only: ${modesToTry.join(', ')}`);
        } else if (straightLineDistance > 100) {
            // More than 100 km, skip walking and cycling
            modesToTry = modes.filter(mode => mode !== 'walking' && mode !== 'cycling');
            console.log(`For distances over 100 km, skip walking and cycling modes: ${modesToTry.join(', ')}`);
        }
        
        console.log(`Start trying route calculation for multiple modes of transportation: Starting point
=${startCoordinates.value}, End=${endCoordinates.value}`);
        
        for (const mode of modesToTry) {
            try {
                const requestUrl = `https://api.mapbox.com/directions/v5/mapbox/${mode}/${startCoordinates.value[0]},${startCoordinates.value[1]};${endCoordinates.value[0]},${endCoordinates.value[1]}?access_token=${mapboxglAccessToken}&geometries=geojson&overview=full`;
                console.log(`Try mode ${mode}, request URL:`, requestUrl);
                
                const response = await fetch(requestUrl);
                console.log(`Mode ${mode} Response status:`, response.status);
                
                const data = await response.json();
                console.log(`Mode ${mode} Response data:`, data);
                
                // Log full response for debugging
                if (data.error) {
                    console.error(`Mode ${mode} API error:`, data.error);
                    lastError = data.error;
                    
                    // Special handling for distance limit errors
                    if (data.error.code === 'InvalidInput' && 
                        data.error.message.includes('Route exceeds maximum distance limitation')) {
                        console.log(`Mode ${mode} Unable to calculate route due to distance limit, continue to try other modes`);
                        continue;
                    }
                    
                    continue; // Try next mode
                }
                
                if (data.routes && data.routes.length > 0) {
                    const route = data.routes[0];
                    routeInfo.value = {
                        distance: (route.distance / 1000).toFixed(1),
                        duration: Math.round(route.duration / 60),
                        mode: mode // Record the mode of transportation used
                    };
                    
                    console.log(`Find route (${mode}):`, routeInfo.value);
                    
                    // Add route to map
                    if (map.value.getSource('route')) {
                        (map.value.getSource('route') as any).setData({
                            type: 'Feature',
                            properties: {},
                            geometry: route.geometry
                        });
                    } else {
                        map.value.addSource('route', {
                            type: 'geojson',
                            data: {
                                type: 'Feature',
                                properties: {},
                                geometry: route.geometry
                            }
                        });
                        
                        map.value.addLayer({
                            id: 'route',
                            type: 'line',
                            source: 'route',
                            layout: {
                                'line-join': 'round',
                                'line-cap': 'round'
                            },
                            paint: {
                                'line-color': '#3B82F6',
                                'line-width': 5,
                                'line-opacity': 0.7
                            }
                        });
                    }
                    
                    // Zoom map to fit the entire route
                    const coordinates = route.geometry.coordinates;
                    if (coordinates && coordinates.length > 0) {
                        // Create a bounding box to fit the route
                        let bounds = new (window as any).mapboxgl.LngLatBounds();
                        
                        // Extend bounds with all route coordinates
                        coordinates.forEach((coord: [number, number]) => {
                            bounds.extend(coord);
                        });
                        
                        // Also extend bounds with start and end points to ensure they are included
                        bounds.extend(startCoordinates.value);
                        bounds.extend(endCoordinates.value);
                        
        
                        // Fit the map to the bounds with padding and animation
                        map.value.fitBounds(bounds, {
                            padding: 50,
                            animate: true,
                            duration: 300
                        });
                        
                        console.log('Map zoomed to fit entire route');
                    }
                    
                    routeFound = true;
                    break; // Route found, exit loop
                } else {
                    console.log(`No route found for mode ${mode}`);
                }
            } catch (modeError) {
                console.error(`Mode ${mode} was evaluated incorrectly:`, modeError);
                lastError = modeError;
            }
        }
        
        if (!routeFound) {
            console.log('No route found for all modes of transportation');
            
            // Construct user-friendly error message
            let errorMessage = '';
            
            if (lastError && lastError.code === 'InvalidInput' && 
                lastError.message && lastError.message.includes('Route exceeds maximum distance limitation')) {
                // Distance limit error
                errorMessage = `The distance between the two locations is too far (approximately ${straightLineDistance.toFixed(0)} kilometers in a straight line), exceeding the route calculation limit of the map service. \nSuggestions:\n1. Try adding waypoints to split the route\n2. Choose driving mode instead of walking or cycling mode\n3. Shorten the planned route distance`;
            } else if (lastError) {
                errorMessage = `Route not found, error message: ${lastError.message || lastError}`;
            } else {
                errorMessage = 'Route not found, please try another starting point and end point';
            }
            
            alert(errorMessage);
            
            // If no route is found, show straight line connection if distance is reasonable
            if (straightLineDistance <= 5000) { // Only show if within 5000 km
                showStraightLineConnection();
            }
        }
    } catch (error) {
        console.error('Total route calculation error:', error);
        alert(`Route calculation failed: ${error.message || 'Please try again later'}`);
    }
};

// Calculate straight-line distance between two coordinates using Haversine formula
const calculateStraightLineDistance = (coords1: [number, number], coords2: [number, number]): number => {
    const R = 6371; // Earth radius in kilometers
    const dLat = (coords2[1] - coords1[1]) * Math.PI / 180;
    const dLon = (coords2[0] - coords1[0]) * Math.PI / 180;
    
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(coords1[1] * Math.PI / 180) * Math.cos(coords2[1] * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    
    return distance;
};

// Show straight line connection between start and end points
const showStraightLineConnection = () => {
    if (!startCoordinates.value || !endCoordinates.value || !map.value) return;
    
    console.log('Shows a straight line connecting the start and end points');
    
    // Create GeoJSON line data
    const lineData = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: [startCoordinates.value, endCoordinates.value]
        }
    };
    
    // Add or update the straight line layer
    if (map.value.getSource('straight-line')) {
        (map.value.getSource('straight-line') as any).setData(lineData);
    } else {
        map.value.addSource('straight-line', {
            type: 'geojson',
            data: lineData
        });
        
        map.value.addLayer({
            id: 'straight-line',
            type: 'line',
            source: 'straight-line',
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#6B7280',
                'line-width': 3,
                'line-opacity': 0.5,
                'line-dasharray': [5, 5] // Dashed line
            }
        });
    }
    
    // Zoom map to fit the straight line
    const bounds = new (window as any).mapboxgl.LngLatBounds();
    bounds.extend(startCoordinates.value);
    bounds.extend(endCoordinates.value);
    
    map.value.fitBounds(bounds, {
        padding: 100,
        animate: true,
        duration: 300
    });
};

// Clear route
const clearRoute = () => {
    routeInfo.value = null;
    if (map.value && map.value.getLayer('route')) {
        map.value.removeLayer('route');
        map.value.removeSource('route');
    }
    
    // Clear markers
    const startMarker = document.getElementById('start-marker');
    const endMarker = document.getElementById('end-marker');
    if (startMarker) startMarker.remove();
    if (endMarker) endMarker.remove();
    
    startLocation.value = '';
    endLocation.value = '';
    startCoordinates.value = null;
    endCoordinates.value = null;
    startSearchResults.value = [];
    endSearchResults.value = [];
};

// Lifecycle
onMounted(() => {
    initializeMap();
});

onUnmounted(() => {
    if (map.value) {
        map.value.remove();
    }
});
</script>

<style scoped>
#map {
    position: absolute;
    top: 60px;
    bottom: 0;
    width: 100%;
    height: calc(100% - 60px)
}
</style>