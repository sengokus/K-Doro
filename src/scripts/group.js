const groupData = {
    hybe: {
        bands: ["bts", "txt", "svt"],
        labels: ["BTS", "TXT", "SEVENTEEN"]
    },
    jyp: {
        bands: ["twice", "skz", "itzy"],
        labels: ["TWICE", "STRAY KIDS", "ITZY"]
    },
    sm: {
        bands: ["exo", "rv", "nct2021"],
        labels: ["EXO", "RED VELVET", "NCT 2021"]
    },
    yg: {
        bands: ["bp", "treasure", "bigbang"],
        labels: ["BLACKPINK", "TREASURE", "BIGBANG"]
    }
};

    // Get the group parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const group = urlParams.get('group');

    // Show the corresponding group container
    if (group) {
    const selectedGroup = document.getElementById(`group-${group}`);
    if (selectedGroup) {
        selectedGroup.style.display = "flex";

        // Get the table and image elements
        const groupTable = selectedGroup.querySelector("table#label-grid");
        const bandImages = groupTable.querySelectorAll("th");
        const bandLabels = groupTable.querySelectorAll("td label");

        // Get the group data based on the selected group
        const currentGroupData = groupData[group];
        if (currentGroupData) {
            // Loop through the bands and create the <a> tags
            for (let i = 0; i < currentGroupData.bands.length; i++) {
                const band = currentGroupData.bands[i];
                const label = currentGroupData.labels[i];

                // Create the <a> tag
                const anchorTag = document.createElement("a");
                anchorTag.href = `choose-call.html?band=${band}`;

                // Create the <img> tag
                const imgTag = document.createElement("img");
                imgTag.src = `../resources/img/${band}.jpg`;
                imgTag.alt = label;

                // Append the <img> tag to the <a> tag
                anchorTag.appendChild(imgTag);

                // Append the <a> tag to the <th> element
                bandImages[i].appendChild(anchorTag);

                // Set label text
                bandLabels[i].textContent = label;
            }
        }
    }
}