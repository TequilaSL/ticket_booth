<template>
    <div>
        <section>
            <div id="map" style="width: 100%; height: 90vh"></div>
        </section>
        <Footer :key="$store.state.new_notifications" />
    </div>
</template>

<script>
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import vzForm from "../../components/Form";
import vLoading from "../../components/Loading";
import { googleMaps } from "../../config";
import axios from "axios";

export default {
    components: { vzForm, Header, Footer, vLoading },
    data() {
        return {
            key: googleMaps.key,
            coordinates: [
                { lat: 6.8696, lng: 79.8808 },
                { lat: 6.869378, lng: 79.881143 },
                { lat: 6.869245, lng: 79.881917 },
                { lat: 6.868774, lng: 79.882523 },
                { lat: 6.868646, lng: 79.882737 },
                { lat: 6.868356, lng: 79.88326 },
            ],
            map: null,
            marker: null,
            currentIndex: 0,
        };
    },
    mounted() {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.key}&loading=async&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        window.initMap = this.initMap;
    },

    methods: {
        async updateLocation() {
            try {
                const response = await axios.get(
                    "https://ticketbooth.tequilasl.com/proxy-location"
                );
                if (response.data) {
                    const { longitude, latitude } = response.data;
                    const newPosition = {
                        lat: parseFloat(latitude),
                        lng: parseFloat(longitude),
                    };
                    this.marker.position = newPosition;
                    this.map.setCenter(newPosition);
                }
            } catch (error) {
                console.error("Error fetching location:", error);
            }
        },
        createBusIcon() {
            const iconContainer = document.createElement("div");
            iconContainer.style.width = "50px";
            iconContainer.style.height = "50px";
            iconContainer.style.backgroundImage = "url('/images/map-icon.png')";
            iconContainer.style.backgroundSize = "cover";
            iconContainer.style.backgroundPosition = "center";
            return iconContainer;
        },
        async initMap() {
            const { AdvancedMarkerElement } = await google.maps.importLibrary(
                "marker"
            );
            const options = {
                center: { lat: 6.8696, lng: 79.8808 },
                zoom: 16,
                mapId: "DEMO_MAP_ID",
            };
            this.map = new google.maps.Map(
                document.getElementById("map"),
                options
            );

            this.marker = new AdvancedMarkerElement({
                position: this.coordinates[0],
                map: this.map,
                content: this.createBusIcon(),
                title: "Kohuwala",
            });
            this.updateLocation();
            setInterval(this.updateLocation, 2000);
        },

        updateMarkerPosition() {
            this.currentIndex =
                (this.currentIndex + 1) % this.coordinates.length;
            const nextPosition = this.coordinates[this.currentIndex];
            this.marker.position = nextPosition;
            this.map.setCenter(nextPosition);
        },
    },
};
</script>
<style scoped src="../css/Financial.css" />
