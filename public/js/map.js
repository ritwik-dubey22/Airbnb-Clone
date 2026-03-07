        //  document.addEventListener("DOMContentLoaded", function() {

        //      const mapElement = document.getElementById("map");
        //      if (!mapElement) return;

        //      // Indore - CAT Square approx
        //      const map = L.map('map').setView([22.6889, 75.8429], 14);

        //      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //          attribution: '&copy; OpenStreetMap contributors'
        //      }).addTo(map);

        //      L.marker([22.6889, 75.8429])
        //          .addTo(map)
        //          .bindPopup("CAT Square, Indore")
        //          .openPopup();

        //  });


        document.addEventListener("DOMContentLoaded", function() {

            const mapElement = document.getElementById("map");
            if (!mapElement) return;

            const coordsData = mapElement.dataset.coords;
            const locationName = mapElement.dataset.location;

            if (!coordsData) return;

            const coords = JSON.parse(coordsData);

            const lat = coords[1];
            const lng = coords[0];

            const map = L.map("map").setView([lat, lng], 8);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors"
            }).addTo(map);

            // ✅ Airbnb style red marker icon (online)
            const airbnbIcon = L.icon({
                iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });

            L.marker([lat, lng], { icon: airbnbIcon })
                .addTo(map)
                .bindPopup(`
            <div style="font-family: sans-serif;">
                <strong style="color:#222;">
                    ${locationName || "Location"}
                </strong>
                <div style="font-size:12px; color:#717171; margin-top:4px;">
                    Exact location provided after booking
                </div>
            </div>
        `)
                .openPopup();
        });

        // document.addEventListener("DOMContentLoaded", function() {

        //     const mapElement = document.getElementById("map");
        //     if (!mapElement) return;

        //     const coordsData = mapElement.dataset.coords;
        //     const locationName = mapElement.dataset.location;

        //     if (!coordsData) return;

        //     const coords = JSON.parse(coordsData);

        //     const lat = coords[1];
        //     const lng = coords[0];

        //     const map = L.map('map').setView([lat, lng], 8);

        //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //         attribution: '&copy; OpenStreetMap contributors'
        //     }).addTo(map);

        //     L.marker([lat, lng])
        //         .addTo(map)
        //         .bindPopup(`<b>${locationName}</b>
        //             <p>Excat location provided after booking</p>`)
        //         .openPopup();
        // });