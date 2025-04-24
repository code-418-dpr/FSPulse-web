"use client";

import { YMap, YMapDefaultFeaturesLayer, YMapDefaultSchemeLayer, YMapMarker } from "ymap3-components";

interface Props {
    lng: number;
    lat: number;
}

export default function Map({ lng, lat }: Props) {
    return (
        <div style={{ height: "400px", width: "100%" }}>
            {/* <YMapComponentsProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY ?? "none"}> */}
            <YMap
                location={{
                    center: [lng, lat],
                    zoom: 14,
                }}
            >
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />
                <YMapMarker coordinates={[lng, lat]} />
            </YMap>
            {/* </YMapComponentsProvider */}
        </div>
    );
}
