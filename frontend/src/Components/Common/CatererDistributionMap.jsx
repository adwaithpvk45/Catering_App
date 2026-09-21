import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Compass, Users, Phone, ShieldCheck, ShieldAlert, Sparkles, Filter, Navigation, Layers } from 'lucide-react';

export const MAP_THEMES = {
  osm: {
    name: "Standard OSM",
    icon: "🗺️",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abc",
    maxZoom: 19
  },
  dark: {
    name: "Dark Mode",
    icon: "🌙",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    overlayUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; Esri &mdash; Dark Canvas',
    subdomains: "",
    maxNativeZoom: 16,
    maxZoom: 19
  },
  satellite: {
    name: "Satellite",
    icon: "🛰️",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; Esri &mdash; Aerial Imagery',
    subdomains: "",
    maxZoom: 18
  },
  hot: {
    name: "Vibrant OSM",
    icon: "🎨",
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abc",
    maxZoom: 19
  },
  topo: {
    name: "Topographic",
    icon: "⛰️",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: 'Map data: &copy; OpenStreetMap contributors | SRTM',
    subdomains: "abc",
    maxZoom: 17
  }
};

const createThemeLayer = (theme) => {
  const options = {
    attribution: theme.attribution,
    subdomains: theme.subdomains || "abc",
    maxZoom: theme.maxZoom || 19
  };
  if (theme.maxNativeZoom) {
    options.maxNativeZoom = theme.maxNativeZoom;
  }
  const base = L.tileLayer(theme.url, options);
  if (!theme.overlayUrl) {
    return base;
  }
  const overlay = L.tileLayer(theme.overlayUrl, {
    subdomains: theme.subdomains || "abc",
    maxNativeZoom: theme.maxNativeZoom,
    maxZoom: theme.maxZoom || 19
  });
  return L.layerGroup([base, overlay]);
};

// Custom SVG Pin Icon generator
const createVendorPinIcon = (status = 'active') => {
  const isActive = status === 'active';
  const pinColor = isActive ? '#10B981' : '#EF4444'; // Emerald green vs Coral red
  const shadowColor = isActive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)';

  const html = `
    <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
      <div style="
        position: absolute;
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        background: ${pinColor};
        transform: rotate(-45deg);
        box-shadow: 0 4px 12px ${shadowColor};
        border: 2.5px solid #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
      "></div>
      <div style="
        position: relative;
        z-index: 2;
        color: white;
        font-size: 14px;
        margin-top: -4px;
      ">
        🍽️
      </div>
      <div style="
        position: absolute;
        bottom: -2px;
        width: 10px;
        height: 4px;
        background: rgba(0,0,0,0.25);
        border-radius: 50%;
        filter: blur(1px);
      "></div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-vendor-marker',
    html: html,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -36]
  });
};

export default function CatererDistributionMap({
  vendors = [],
  height = "560px",
  onSelectVendor,
  title = "Caterers Geographic Distribution",
  subtitle = "Live OpenStreetMap (OSM) monitoring for caterer distribution and coverage"
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const tileLayerRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mapTheme, setMapTheme] = useState("osm"); // Default to standard reliable OSM
  const [selectedVendorForCard, setSelectedVendorForCard] = useState(null);

  // Filter vendors based on search and status
  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesSearch =
        !searchQuery ||
        vendor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && vendor.status === "active") ||
        (statusFilter === "blocked" && vendor.status === "blocked");

      return matchesSearch && matchesStatus;
    });
  }, [vendors, searchQuery, statusFilter]);

  // Count vendors with valid coordinates
  const vendorsWithCoords = useMemo(() => {
    return filteredVendors.filter(
      (v) => v.coordinates && (v.coordinates.lat !== 0 || v.coordinates.lng !== 0)
    );
  }, [filteredVendors]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id;
    }

    const initialCenter = [10.02, 76.32];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 9,
      scrollWheelZoom: true,
      zoomControl: false
    });

    // Add Zoom control to bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Always attach active tile layer directly upon creation
    const currentTheme = MAP_THEMES[mapTheme] || MAP_THEMES.osm;
    const initialLayer = createThemeLayer(currentTheme).addTo(map);
    tileLayerRef.current = initialLayer;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(resizeTimer);
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // Update Tile Layer when mapTheme changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old layer if exists
    if (tileLayerRef.current && map.hasLayer(tileLayerRef.current)) {
      map.removeLayer(tileLayerRef.current);
    }

    const theme = MAP_THEMES[mapTheme] || MAP_THEMES.osm;
    const newLayer = createThemeLayer(theme).addTo(map);
    tileLayerRef.current = newLayer;

    map.invalidateSize();
  }, [mapTheme]);

  // Update Markers when vendors or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    if (vendorsWithCoords.length === 0) return;

    const bounds = L.latLngBounds();

    vendorsWithCoords.forEach((vendor) => {
      const { lat, lng } = vendor.coordinates;
      const latLng = [lat, lng];
      bounds.extend(latLng);

      const marker = L.marker(latLng, {
        icon: createVendorPinIcon(vendor.status)
      });

      // Rich Popup content
      const popupContent = document.createElement('div');
      popupContent.className = "p-1 min-w-[220px]";
      popupContent.innerHTML = `
        <div style="font-family: system-ui, sans-serif;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <div style="
              width: 32px;
              height: 32px;
              border-radius: 8px;
              background: #F3F4F6;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              color: #4F46E5;
              font-size: 14px;
              overflow: hidden;
            ">
              ${vendor.profilePic ? `<img src="${vendor.profilePic}" style="width:100%;height:100%;object-fit:cover;"/>` : vendor.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 style="margin: 0; font-size: 15px; font-weight: 700; color: #111827;">${vendor.name || "Caterer"}</h4>
              <span style="
                display: inline-block;
                padding: 1px 6px;
                border-radius: 9999px;
                font-size: 11px;
                font-weight: 600;
                background-color: ${vendor.status === 'active' ? '#ECFDF5' : '#FEF2F2'};
                color: ${vendor.status === 'active' ? '#059669' : '#DC2626'};
              ">
                ${vendor.status === 'active' ? '● Active' : '● Blocked'}
              </span>
            </div>
          </div>
          <p style="margin: 4px 0 2px 0; font-size: 12px; color: #4B5563; display: flex; align-items: center; gap: 4px;">
            📍 <span>${vendor.location || "Location not specified"}</span>
          </p>
          ${vendor.phone ? `
            <p style="margin: 2px 0 6px 0; font-size: 12px; color: #4B5563;">
              📞 <a href="tel:${vendor.phone}" style="color: #4F46E5; text-decoration: none; font-weight: 500;">${vendor.phone}</a>
            </p>
          ` : ''}
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 11px; color: #6B7280;">GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}</span>
            <button id="view-vendor-btn-${vendor._id || vendor.id}" style="
              background: #4F46E5;
              color: white;
              border: none;
              padding: 4px 10px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 600;
              cursor: pointer;
            ">
              View Profile
            </button>
          </div>
        </div>
      `;

      // Attach click event for button inside popup
      const btn = popupContent.querySelector(`#view-vendor-btn-${vendor._id || vendor.id}`);
      if (btn && onSelectVendor) {
        btn.addEventListener('click', () => {
          onSelectVendor(vendor);
        });
      }

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        setSelectedVendorForCard(vendor);
      });

      markersGroup.addLayer(marker);
    });

    // Auto-fit bounds if we have points
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [vendorsWithCoords, onSelectVendor]);

  // Fit all markers button handler
  const handleFitBounds = () => {
    const map = mapInstanceRef.current;
    if (!map || vendorsWithCoords.length === 0) return;
    const bounds = L.latLngBounds(
      vendorsWithCoords.map((v) => [v.coordinates.lat, v.coordinates.lng])
    );
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  };

  // Find User Location button handler
  const handleLocateMe = () => {
    const map = mapInstanceRef.current;
    if (!map || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.flyTo([latitude, longitude], 13);
        L.popup()
          .setLatLng([latitude, longitude])
          .setContent('<div class="font-semibold text-xs p-1">📍 You are here</div>')
          .openOn(map);
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
      }
    );
  };

  return (
    <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden flex flex-col transition-all">
      {/* Header & Controls Bar */}
      <div className="p-3.5 sm:p-5 border-b border-base-200 bg-base-100 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-1.5 sm:p-2 rounded-xl bg-primary/10 text-primary shrink-0">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <h2 className="text-base sm:text-xl font-bold tracking-tight text-base-content">
              {title}
            </h2>
            <span className="badge badge-primary badge-outline text-[10px] sm:text-xs font-semibold px-2 py-0.5 whitespace-nowrap">
              OSM Live
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-base-content/70 mt-0.5 sm:mt-1">
            {subtitle}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2.5 w-full xl:w-auto">
          {/* Search input */}
          <div className="relative w-full sm:w-48 md:w-56">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
            <input
              type="text"
              placeholder="Search city, caterer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-sm input-bordered w-full pl-9 pr-3 rounded-xl bg-base-200/50 focus:bg-base-100 focus:border-primary text-xs"
            />
          </div>

          {/* Buttons Row (Status Pills + Navigation Group) */}
          <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
            {/* Status Segment */}
            <div className="join border border-base-300 rounded-xl overflow-hidden bg-base-200/40 shrink-0">
              <button
                onClick={() => setStatusFilter("all")}
                className={`btn btn-xs join-item rounded-none px-2 sm:px-3 font-medium text-[11px] sm:text-xs ${
                  statusFilter === "all" ? "btn-primary text-white" : "btn-ghost"
                }`}
              >
                All ({vendors.length})
              </button>
              <button
                onClick={() => setStatusFilter("active")}
                className={`btn btn-xs join-item rounded-none px-2 sm:px-3 font-medium text-[11px] sm:text-xs ${
                  statusFilter === "active" ? "btn-success text-white" : "btn-ghost"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter("blocked")}
                className={`btn btn-xs join-item rounded-none px-2 sm:px-3 font-medium text-[11px] sm:text-xs ${
                  statusFilter === "blocked" ? "btn-error text-white" : "btn-ghost"
                }`}
              >
                Blocked
              </button>
            </div>

            {/* Map Viewport Navigation Group (Fit All + Locate Me) */}
            <div className="join border border-base-300 rounded-xl overflow-hidden shrink-0 bg-base-100 shadow-sm">
              <button
                onClick={handleFitBounds}
                title="Fit all caterers in view"
                className="btn btn-sm btn-ghost join-item text-xs gap-1.5 px-2.5 sm:px-3 hover:bg-base-200 hover:text-primary font-semibold"
              >
                <Users className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Fit All</span>
              </button>
              <button
                onClick={handleLocateMe}
                title="My current location"
                className="btn btn-sm btn-ghost join-item border-l border-base-300 px-2.5 hover:bg-base-200 hover:text-primary"
              >
                <Navigation className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Surface */}
      <div className="relative w-full" style={{ height }}>
        <div 
          ref={mapContainerRef} 
          className="w-full h-full z-10" 
        />

        {/* Floating Quick Summary Badge */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 pointer-events-none">
          <div className="bg-base-100/90 backdrop-blur-md shadow-lg border border-base-300 rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs flex items-center gap-1.5 sm:gap-2">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-base-content">
              {vendorsWithCoords.length}/{vendors.length}
            </span>
            <span className="text-base-content/70 hidden sm:inline">Caterers Mapped</span>
          </div>
        </div>

        {/* Floating Map Theme Switcher (Standard Map UI Placement) */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 dropdown dropdown-end">
          <div 
            tabIndex={0} 
            role="button" 
            className="btn btn-xs sm:btn-sm bg-base-100/90 hover:bg-base-100 backdrop-blur-md border border-base-300 shadow-xl rounded-xl text-[11px] sm:text-xs gap-1 sm:gap-1.5 cursor-pointer font-bold text-base-content"
          >
            <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
            <span>{MAP_THEMES[mapTheme]?.icon}</span>
            <span className="hidden sm:inline">{MAP_THEMES[mapTheme]?.name}</span>
          </div>
          <ul tabIndex={0} className="dropdown-content z-30 menu p-2 shadow-2xl bg-base-100/95 backdrop-blur-md rounded-2xl w-52 border border-base-content/10 mt-2 font-semibold">
            <li className="menu-title text-[10px] uppercase font-black tracking-wider text-base-content/40 px-2 py-1">Map Style</li>
            {Object.entries(MAP_THEMES).map(([key, theme]) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => setMapTheme(key)}
                  className={`flex items-center justify-between text-xs py-2 px-3 rounded-xl transition-colors cursor-pointer ${
                    mapTheme === key ? "bg-primary text-white font-bold" : "hover:bg-base-200 text-base-content"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{theme.icon}</span>
                    <span>{theme.name}</span>
                  </span>
                  {mapTheme === key && <span className="text-xs font-black">✓</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-20 bg-base-100/90 backdrop-blur-md shadow-md border border-base-300 rounded-xl px-3 py-2 text-xs flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-base-content/80 font-medium">Active Caterer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-base-content/80 font-medium">Blocked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
