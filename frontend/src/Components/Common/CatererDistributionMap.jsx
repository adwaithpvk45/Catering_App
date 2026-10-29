import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Search, 
  MapPin, 
  Compass, 
  Users, 
  Phone, 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  Filter, 
  Navigation, 
  Layers, 
  Flame, 
  TrendingUp, 
  AlertCircle,
  Eye,
  Sliders,
  Maximize2
} from 'lucide-react';

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

// Custom SVG Pin Icon for Caterers
const createVendorPinIcon = (status = 'active') => {
  const isActive = status === 'active';
  const pinColor = isActive ? '#10B981' : '#EF4444';
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
  demandPoints = [],
  marketSummary = null,
  height = "560px",
  onSelectVendor,
  title = "Caterers & Demand Heatmap (OMS)",
  subtitle = "Live geographic tracking of caterer supply vs customer event demand across regions"
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const heatLayerRef = useRef(null);
  const demandLayerRef = useRef(null);
  const tileLayerRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("combined"); // 'combined', 'demand', 'supply'
  const [mapTheme, setMapTheme] = useState("osm");
  const [heatLoaded, setHeatLoaded] = useState(false);
  const [selectedVendorForCard, setSelectedVendorForCard] = useState(null);

  // Initialize global L and dynamically import leaflet.heat
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.L = L;
      import('leaflet.heat')
        .then(() => {
          setHeatLoaded(true);
        })
        .catch((err) => {
          console.warn("Could not load leaflet.heat:", err);
        });
    }
  }, []);

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

  // Valid vendors with coordinates
  const vendorsWithCoords = useMemo(() => {
    return filteredVendors.filter(
      (v) => v.coordinates && (v.coordinates.lat !== 0 || v.coordinates.lng !== 0)
    );
  }, [filteredVendors]);

  // Valid demand points with coordinates
  const validDemandPoints = useMemo(() => {
    return demandPoints.filter(
      (dp) => dp.coordinates && (dp.coordinates.lat !== 0 || dp.coordinates.lng !== 0)
    );
  }, [demandPoints]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id;
    }

    const initialCenter = [10.15, 76.25];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 8,
      scrollWheelZoom: true,
      zoomControl: false
    });

    // Add Zoom control to bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial base tile layer
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
      heatLayerRef.current = null;
      demandLayerRef.current = null;
    };
  }, []);

  // Update Tile Layer when mapTheme changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current && map.hasLayer(tileLayerRef.current)) {
      map.removeLayer(tileLayerRef.current);
    }

    const theme = MAP_THEMES[mapTheme] || MAP_THEMES.osm;
    const newLayer = createThemeLayer(theme).addTo(map);
    tileLayerRef.current = newLayer;

    map.invalidateSize();
  }, [mapTheme]);

  // Update Supply (Caterers) Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // In 'demand' only mode, hide caterer pins
    if (viewMode === 'demand') return;

    if (vendorsWithCoords.length === 0) return;

    vendorsWithCoords.forEach((vendor) => {
      const { lat, lng } = vendor.coordinates;
      const latLng = [lat, lng];

      const marker = L.marker(latLng, {
        icon: createVendorPinIcon(vendor.status)
      });

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
                ${vendor.status === 'active' ? '● Active Caterer' : '● Blocked'}
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
  }, [vendorsWithCoords, viewMode, onSelectVendor]);

  // Update Demand Heatmap & Event Pins Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clean up old heat layer
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    // Clean up old demand event layer
    if (demandLayerRef.current) {
      map.removeLayer(demandLayerRef.current);
      demandLayerRef.current = null;
    }

    // In 'supply' only mode, do not render demand heat
    if (viewMode === 'supply') return;

    if (validDemandPoints.length === 0) return;

    // 1. Draw Heatmap Layer
    if (window.L && window.L.heatLayer) {
      const heatData = validDemandPoints.map((dp) => [
        dp.coordinates.lat,
        dp.coordinates.lng,
        dp.intensity || 0.6
      ]);

      const heat = window.L.heatLayer(heatData, {
        radius: 36,
        blur: 24,
        maxZoom: 14,
        max: 1.0,
        gradient: {
          0.2: '#38BDF8', // Sky Blue
          0.4: '#10B981', // Emerald
          0.6: '#FBBF24', // Amber
          0.8: '#F97316', // Orange
          1.0: '#EF4444'  // Fiery Crimson (Hotspot)
        }
      }).addTo(map);

      heatLayerRef.current = heat;
    }

    // 2. Draw Interactive Demand Dots with Event Popups
    const demandGroup = L.layerGroup().addTo(map);
    validDemandPoints.forEach((dp) => {
      const markerRadius = Math.min(13, Math.max(7, Math.round((dp.guestCount || 50) / 25)));

      const circle = L.circleMarker([dp.coordinates.lat, dp.coordinates.lng], {
        radius: markerRadius,
        fillColor: '#FF6B00',
        color: '#FFFFFF',
        weight: 2,
        opacity: 0.95,
        fillOpacity: 0.75
      });

      const dateFormatted = dp.eventDate ? new Date(dp.eventDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) : 'Upcoming';

      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; min-width: 190px; padding: 3px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-size: 11px; font-weight: 700; color: #C2410C; background: #FFEDD5; padding: 2px 7px; border-radius: 6px; display: inline-flex; align-items: center; gap: 3px;">
              🔥 Event Demand
            </span>
            <span style="font-size: 10px; font-weight: 700; color: #4B5563; background: #F3F4F6; padding: 2px 6px; border-radius: 6px;">
              ${dp.status || 'Pending'}
            </span>
          </div>
          <h4 style="margin: 4px 0 2px 0; font-size: 14px; font-weight: 700; color: #111827;">${dp.category || 'Event'} Catering</h4>
          <p style="margin: 3px 0; font-size: 12px; color: #374151;">📍 <strong>${dp.venueLocation || 'Kerala'}</strong></p>
          <div style="margin: 6px 0; padding: 6px; background: #F9FAFB; border-radius: 8px; font-size: 11px; display: flex; justify-content: space-between;">
            <div>👥 <strong>${dp.guestCount || 0}</strong> Guests</div>
            <div>🗓️ ${dateFormatted}</div>
          </div>
          ${dp.price ? `<p style="margin: 2px 0 0 0; font-size: 11px; color: #059669; font-weight: 700;">💰 Value: ${dp.price}</p>` : ''}
        </div>
      `;

      circle.bindPopup(popupHtml);
      demandGroup.addLayer(circle);
    });

    demandLayerRef.current = demandGroup;
  }, [validDemandPoints, viewMode, heatLoaded]);

  // Auto-fit bounds on initial mount or mode switch
  const handleFitBounds = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const bounds = L.latLngBounds();

    if (viewMode !== 'demand') {
      vendorsWithCoords.forEach((v) => bounds.extend([v.coordinates.lat, v.coordinates.lng]));
    }
    if (viewMode !== 'supply') {
      validDemandPoints.forEach((dp) => bounds.extend([dp.coordinates.lat, dp.coordinates.lng]));
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  };

  // Initial bounds fit once data arrives
  useEffect(() => {
    handleFitBounds();
  }, [vendorsWithCoords.length, validDemandPoints.length, viewMode]);

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

  // Fly to specific opportunity hub
  const handleFocusHub = (hubName) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const matched = validDemandPoints.find((dp) =>
      dp.venueLocation?.toLowerCase().includes(hubName.toLowerCase())
    ) || vendorsWithCoords.find((v) =>
      v.location?.toLowerCase().includes(hubName.toLowerCase())
    );

    if (matched) {
      map.flyTo([matched.coordinates.lat, matched.coordinates.lng], 12);
    }
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
            <h2 className="text-base sm:text-xl font-bold tracking-tight text-base-content leading-tight">
              {title}
            </h2>
            <span className="badge badge-primary badge-outline text-[10px] sm:text-xs font-semibold px-2 py-0.5 whitespace-nowrap">
              OSM Heatmap Live
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-base-content/70 mt-0.5 sm:mt-1">
            {subtitle}
          </p>
        </div>

        {/* Filter & View Mode Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2.5 w-full xl:w-auto">
          {/* View Mode Segment Switcher */}
          <div className="join border border-base-300 rounded-xl overflow-hidden bg-base-200/40 shrink-0 shadow-sm">
            <button
              onClick={() => setViewMode("combined")}
              title="Overlay both demand heatmap and caterer supply pins"
              className={`btn btn-xs sm:btn-sm join-item rounded-none px-2.5 sm:px-3 text-xs font-bold gap-1 transition-all ${
                viewMode === "combined" ? "btn-primary text-white" : "btn-ghost text-base-content/80"
              }`}
            >
              <span>⚖️</span>
              <span className="hidden xs:inline">Supply vs Demand</span>
            </button>
            <button
              onClick={() => setViewMode("demand")}
              title="View customer booking density heatmap"
              className={`btn btn-xs sm:btn-sm join-item rounded-none px-2.5 sm:px-3 text-xs font-bold gap-1 transition-all ${
                viewMode === "demand" ? "bg-orange-500 hover:bg-orange-600 text-white" : "btn-ghost text-base-content/80"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xs:inline">Demand Heat</span>
            </button>
            <button
              onClick={() => setViewMode("supply")}
              title="View registered caterer pins"
              className={`btn btn-xs sm:btn-sm join-item rounded-none px-2.5 sm:px-3 text-xs font-bold gap-1 transition-all ${
                viewMode === "supply" ? "btn-success text-white" : "btn-ghost"
              }`}
            >
              <span>📌</span>
              <span className="hidden xs:inline">Caterers</span>
            </button>
          </div>

          {/* Search input */}
          <div className="relative w-full sm:w-44 md:w-52">
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
            {/* Status Segment (Only relevant when supply is visible) */}
            {viewMode !== 'demand' && (
              <div className="join border border-base-300 rounded-xl overflow-hidden bg-base-200/40 shrink-0">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`btn btn-xs join-item rounded-none px-2 sm:px-2.5 font-medium text-[11px] sm:text-xs ${
                    statusFilter === "all" ? "btn-primary text-white" : "btn-ghost"
                  }`}
                >
                  All ({vendors.length})
                </button>
                <button
                  onClick={() => setStatusFilter("active")}
                  className={`btn btn-xs join-item rounded-none px-2 sm:px-2.5 font-medium text-[11px] sm:text-xs ${
                    statusFilter === "active" ? "btn-success text-white" : "btn-ghost"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatusFilter("blocked")}
                  className={`btn btn-xs join-item rounded-none px-2 sm:px-2.5 font-medium text-[11px] sm:text-xs ${
                    statusFilter === "blocked" ? "btn-error text-white" : "btn-ghost"
                  }`}
                >
                  Blocked
                </button>
              </div>
            )}

            {/* Map Viewport Navigation Group (Fit All + Locate Me) */}
            <div className="join border border-base-300 rounded-xl overflow-hidden shrink-0 bg-base-100 shadow-sm">
              <button
                onClick={handleFitBounds}
                title="Fit all mapped points in view"
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

      {/* Market Opportunity Intelligence Ticker */}
      {marketSummary?.opportunityZones?.length > 0 && (
        <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-primary/10 border-b border-orange-500/20 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 font-black text-orange-500 uppercase tracking-wider text-[10px]">
              <TrendingUp className="w-3.5 h-3.5 animate-bounce" />
              OMS Market Opportunity:
            </span>
            <span className="text-base-content/80 font-medium">
              High event booking density detected in underserved hubs!
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {marketSummary.opportunityZones.slice(0, 3).map((zone) => (
              <button
                key={zone.hub}
                onClick={() => handleFocusHub(zone.hub)}
                className="badge badge-warning badge-outline hover:badge-warning text-[10px] font-bold gap-1 cursor-pointer transition-transform hover:scale-105"
                title={`Click to focus ${zone.hub} on map`}
              >
                <span>📍 {zone.hub}</span>
                <span className="font-extrabold text-orange-600">({zone.demand} Events vs {zone.supply} Caterers)</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Map Surface */}
      <div className="relative w-full" style={{ height }}>
        <div 
          ref={mapContainerRef} 
          className="w-full h-full z-10" 
        />

        {/* Floating Quick Summary Badge */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 pointer-events-none flex flex-col gap-1.5">
          <div className="bg-base-100/95 backdrop-blur-md shadow-lg border border-base-300 rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs flex items-center gap-2">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-base-content">
              {vendorsWithCoords.length} Caterers
            </span>
            <span className="text-base-content/40">•</span>
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-orange-500"></span>
            <span className="font-semibold text-base-content">
              {validDemandPoints.length} Event Demand Points
            </span>
          </div>
        </div>

        {/* Floating Map Theme Switcher */}
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

        {/* Dynamic Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-20 bg-base-100/90 backdrop-blur-md shadow-md border border-base-300 rounded-xl px-3 py-2 text-xs flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 max-w-[calc(100%-80px)]">
          {/* Caterers legend */}
          {viewMode !== 'demand' && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-base-content/80 font-medium">Active Caterer</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-base-content/80 font-medium">Blocked</span>
              </div>
            </div>
          )}

          {/* Demand Heatmap gradient legend */}
          {viewMode !== 'supply' && (
            <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-base-300 pt-1.5 sm:pt-0 sm:pl-3">
              <span className="text-[10px] text-base-content/60 font-semibold uppercase">Demand Heat:</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-base-content/70">Low</span>
                <div 
                  className="w-20 sm:w-28 h-2.5 rounded-full border border-black/10 shadow-inner"
                  style={{
                    background: 'linear-gradient(to right, #38BDF8, #10B981, #FBBF24, #F97316, #EF4444)'
                  }}
                  title="Heat gradient: Low -> Moderate -> High Hotspot"
                />
                <span className="text-[10px] text-rose-600 font-bold">Hotspot 🔥</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
