const bandData = {
    bts: {
        videos: ["JmqOJ9XxF8A", "4GwQLbGhhAA", "CRxXTqp5tTM"],
        thumbnail: ["bts-t1", "bts-t2", "bts-t3"],
        labels: ["Study with Taehyung", "Study with Jungkook", "RM & Jungkook Study Room"]
    },
    txt: {
        videos: ["WysRH-dTXrc", "0w4Im5EmB0o", "i18yRDRqbpo"],
        thumbnail: ["txt-t1", "txt-t2", "txt-t3"],
        labels: ["Study with Beomgyu", "Yeonjun Live", "Soobin Live"]
    },
    svt: {
        videos: ["reyxG4c_7X4", "L1AGK4zU8KY", "NUr6Jx_g174"],
        thumbnail: ["svt-t1", "svt-t2", "svt-t3"],
        labels: ["Weonwoo Live", "SEVENTEEN WeVerse", "JeongKyeom's Morning Meal"]
    },
    twice: {
        videos: ["rwXGW2UHD14", "_sbzXeg2lKU", "-Rx6E9fjY1s"],
        thumbnail: ["twice-t1", "twice-t2", "twice-t3"],
        labels: ["Dinner Recommendations with TWICE", "TWICE VLive", "TWICE Fashion"]
    },
    skz: {
        videos: ["0Y6KoPAh0io", "KS1dROnjsIw", "8F71NOjsnfQ"],
        thumbnail: ["skz-t1", "skz-t2", "skz-t3"],
        labels: ["Felix's Tips", "Live with Minho", "SKZ Live"]
    },
    itzy: {
        videos: ["4nd5VXSpRKI", "6tnZaX7Jomg", "Owenpzj00iM"],
        thumbnail: ["itzy-t1", "itzy-t2", "itzy-t3"],
        labels: ["Ryujin Live", "ITZY VLive", "Yeji Live"]
    },
    exo: {
        videos: ["ilu8rC9ftD0", "oHN1WRc7ApQ", "nRmBtYXUdAE"],
        thumbnail: ["exo-t1", "exo-t2", "exo-t3"],
        labels: ["Baekhyun Live", "Study with Baekhyun", "EXO Q&A"]
    },
    rv: {
        videos: ["Y2mHc1Xi5hU", "RMqPlKC3Pt8", "JioyFxadZJs"],
        thumbnail: ["rv-t1", "rv-t2", "rv-t3"],
        labels: ["Red Velvet VLive", "Red Velvet VLive", "RV Rookie"]
    },
    nct2021: {
        videos: ["JXJPzgCI_sE", "pqVv0DLwFvk", "qWYJhHzwNsQ"],
        thumbnail: ["nct2021-t1", "nct2021-t2", "nct2021-t3"],
        labels: ["NCT Daily", "NCT VLive", "Study with Doyoung"]
    },
    bp: {
        videos: ["oadMhHMubQ4", "BkPhaDAlWPw", "61moAJz2_Cg"],
        thumbnail: ["bp-t1", "bp-t2", "bp-t3"],
        labels: ["Study with Rosé", "BLACKPINK Live", "BLACKPINK"]
    },
    treasure: {
        videos: ["zqsWSjcc_x0", "PpOpFOyehnw", "x_6AA_n8LcU"],
        thumbnail: ["treasure-t1", "treasure-t2", "treasure-t3"],
        labels: ["TREASURE Countdown", "TREASURE VLive", "TREASURE WEVERSE"]
    },
    bigbang: {
        videos: ["F2M1sDV2Wvk", "UYrmQ7g25iM", "xH5tH1TzkgY"],
        thumbnail: ["bigbang-t1", "bigbang-t2", "bigbang-t3"],
        labels: ["Talk with TOP!", "Talk with BIGBANG", "Countdown Live"]
    }
};

const urlParams = new URLSearchParams(window.location.search);
const band = urlParams.get('band');
const videoIndex = parseInt(urlParams.get('video')) || 0;

if (band) {
    console.log(band);
    const selectedBand = document.getElementById(`band-${band}`);
    if (selectedBand) {
        selectedBand.style.display = "flex";

        const videoTable = selectedBand.querySelector("table#label-grid");
        const videoThumbnails = videoTable.querySelectorAll("th");
        const videoLabels = videoTable.querySelectorAll("label");

        const currentBandData = bandData[band];
        if (currentBandData) {
            for (let i = 0; i < currentBandData.videos.length; i++) {
                const video = currentBandData.videos[i];
                const label = currentBandData.labels[i];
                const thumbnail = currentBandData.thumbnail[i];

                const anchorTag = document.createElement("a");
                anchorTag.href = `call.html?band=${band}&video=${i}`;

                const imgTag = document.createElement("img");
                imgTag.src = `../resources/img/${thumbnail}.jpg`;
                imgTag.alt = label;

                anchorTag.appendChild(imgTag);
                videoThumbnails[i].appendChild(anchorTag);
                videoLabels[i].textContent = label;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const band = urlParams.get('band');
    const videoIndex = parseInt(urlParams.get('video')) || 0;
  
    if (band) {
      const selectedBand = document.getElementById(`band-${band}-vid`);
      if (selectedBand) {
        selectedBand.style.display = "flex";
  
        const currentBandData = bandData[band];
        if (currentBandData) {
          const video = currentBandData.videos[videoIndex];
          const iframeContainer = document.getElementById('video-container');
  
          if (video) {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${video}?autoplay=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${video}`;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = '0';
            iframe.allowFullscreen = true;
  
            iframeContainer.appendChild(iframe);
          }
        }
      }
    }
  });
  