// store each group's band name and labels
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

// get the group parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const group = urlParams.get('group');

// show the corresponding group container
if (group) {
    const selectedGroup = document.getElementById(`group-${group}`);
    if (selectedGroup) {
        selectedGroup.style.display = "flex";

        const groupTable = selectedGroup.querySelector("table#label-grid");
        const bandImages = groupTable.querySelectorAll("th");
        const bandLabels = groupTable.querySelectorAll("td label");

        const currentGroupData = groupData[group];
        if (currentGroupData) {
            for (let i = 0; i < currentGroupData.bands.length; i++) {
                const band = currentGroupData.bands[i];
                const label = currentGroupData.labels[i];

                const anchorTag = document.createElement("a");
                anchorTag.href = `choose-call.html?band=${band}`;

                const imgTag = document.createElement("img");
                imgTag.src = `../resources/img/${band}.jpg`;
                imgTag.alt = label;

                anchorTag.appendChild(imgTag);
                bandImages[i].appendChild(anchorTag);
                bandLabels[i].textContent = label;
            }
        }
    }
}