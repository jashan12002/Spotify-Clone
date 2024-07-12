console.log("LETS write java script");
let songs;
let currentFolder;
function secondsToMinutesAndSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00/00"
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`
}
let currentsong = new Audio();

async function getSongs(folder) {
    currentFolder = folder;
    let a = await fetch(`/${folder}`);
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        console.log(element);
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    let songsUL = document.querySelector(".songslist").getElementsByTagName("ul")[0];
    songsUL.innerHTML = "";
    for (const song of songs) {

        songsUL.innerHTML = songsUL.innerHTML +
            `<li>
        <img class="logoinvert" src="images/music.svg" alt="">
        <div class="songinfo">
            <div class="songname">
            ${song.replaceAll("%20", " ").replaceAll(".mp3", "")} 
            </div>
            <div class="artistname">
            </div>
        </div>
        <div class="playbtn2">
           <img class="logoinvert libraryplaypausebtn" src="images/songplaybtn.svg" alt="">
        </div>
       </li>`;
    }

    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".songinfo").firstElementChild.innerHTML.trim())
            document.getElementById("footersongbar").style.display = "flex"
        })



    })

    return songs;
}

const playMusic = (track) => {
    // let audio = new Audio("/songs/"+track+".mp3");
    currentsong.src = `/${currentFolder}/` + track + ".mp3"
    currentsong.play()
    play.src = "images/songpausebtn.svg"
    document.querySelector(".songinfo1").innerHTML = track
    document.querySelector(".song_time").innerHTML
    document.getElementById("footersongbar").style.display = "flex"
}

async function DisplayAlbums(){
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let songscards = document.querySelector(".songscards") // named cardContainer??
    
    let array = Array.from(anchors)
    
        for (let index = 3; index < array.length; index++) {
            const e = array[index];
        if (e.href.includes("/songs/")) {
            let folder2 = e.href.split("/songs").slice(-2)[1].replaceAll("/","");
            let a = await fetch(`/songs/${folder2}/info.json`);
            let response = await a.json();
            songscards.innerHTML = songscards.innerHTML + `<div data-folder="${folder2}" class="cardd">
            <div class="songposter">
                <img src="/songs/${folder2}/cover.jpg" alt="">
                <div class="playbtn">
                    <button><img src="images/playbtn.svg" alt=""></button>
                </div>
            </div>
            <div class="cardtext">

                <h5>${response.title}</h2>
                    <p>${response.description}</p>
            </div>
        </div>`
        }

        
    }

    Array.from(document.getElementsByClassName("cardd")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0].replaceAll("%20", " ").replaceAll(".mp3", ""))
        })
    })
}


async function main() {


    await getSongs("songs/honey3.0")

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "images/songpausebtn.svg"
        }
        else {
            currentsong.pause()
            play.src = "images/songplaybtn.svg"
        }
    })

    // Display albums to the page
    DisplayAlbums()


    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".song_time").innerHTML = `${secondsToMinutesAndSeconds(currentsong.currentTime)}/${secondsToMinutesAndSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
        document.querySelector(".songplayed").style.width = (currentsong.currentTime / currentsong.duration) * 100 + "%";
        if (((currentsong.currentTime / currentsong.duration) * 100) == "100") {
            play.src = "images/songplaybtn.svg"
        }



    })

    document.querySelector(".songtime").addEventListener("click", e => {
        document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
        document.querySelector(".songplayed").style.width = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
        currentsong.currentTime = ((currentsong.duration) * (e.offsetX / e.target.getBoundingClientRect().width) * 100) / 100;
    })

    // Hamburger Menu

    document.querySelector(".menuphone").addEventListener("click", () => {
        document.getElementById("left").style.transform = "translateX(0px)"

    })

    document.querySelector(".crossphonemenu").addEventListener("click", () => {
        document.getElementById("left").style.transform = "translateX(-5000px)"

    })

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split('/').slice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1].replaceAll(".mp3", "").replaceAll("%20", " "))

        }
    })


    next.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1].replaceAll(".mp3", "").replaceAll("%20", " "))
        }

    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100;
        if (e.target.value == 0) {
            volumerange.src = "images/mute.svg"
        }
        else {
            volumerange.src = "images/volumeup.svg"
        }
    })


    document.querySelector(".volumeimg").getElementsByTagName("img")[0].addEventListener("click", () => {

        if (currentsong.volume > 0) {
            currentsong.volume = 0
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
            volumerange.src = "images/mute.svg"

        }
        else if (currentsong.volume == 0) {
            currentsong.volume = 0.9;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 90;
            volumerange.src = "images/volumeup.svg"
        }

    })




}


main()
