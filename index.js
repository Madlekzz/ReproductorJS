var jsMusic = [
    {
        "titulo":"Blue bird",
        "artista":"Ikimono-gakari",
        "path":"http://127.0.0.1:5500/Reproductor/bucket/Blue_bird.mp4",
        "fecha_estreno":"18 nov 2018",
        "comentarios":[]
    },
    {
        "titulo":"La Camisa Negra",
        "artista":"Juanes",
        "path":"http://127.0.0.1:5500/Reproductor/bucket/La_camisa_negra.mp4",
        "fecha_estreno":"5 oct 2009",
        "comentarios": []
    },
    {
        "titulo":"Humanos a Marte",
        "artista":"Chayanne",
        "path":"http://127.0.0.1:5500/Reproductor/bucket/Humanos_a_marte.mp4",
        "fecha_estreno":"23 jun 2014",
        "comentarios": []
    }
]

var repeat = false;

function getList(){
    var output = "";
    var arrayYeison = jsMusic;

    for (var i in arrayYeison){
        output += "<tr>"+
            "<td>"+
            arrayYeison[i].titulo+
            "<button id='btnPlay' onclick='playVideo("+ JSON.stringify(arrayYeison[i]) +");clearComment();loadComment();'>"+
            "<img id='btnPlay_Img' src='http://127.0.0.1:5500/Reproductor/play_icon_134504.png'></img>"+
            "</button>"+
            "</td>"+
            "<tr>" + arrayYeison[i].artista + "</tr>"+
            "</tr>";
    }

    document.getElementById("tbody").innerHTML = output;
}

function playVideo(video){
    var player = document.getElementById("player");
    play_icon.style.display = "none";
    pause_icon.style.display = "block";

    document.querySelector("#ti").innerHTML = video.titulo;
    document.querySelector("#ar").innerHTML = video.artista;
    document.querySelector("#fe").innerHTML = video.fecha_estreno;

    player.src = video.path;
    player.play();
}

function printComment(){
    arrayYeison = jsMusic;
    var username = document.getElementById("inputUsuario").value;
    var comentario = document.getElementById("inputComentarios").value;
    for (var i in arrayYeison){
        if (arrayYeison[i].path == player.src){
            arrayYeison[i].comentarios.push(username + "<br>" + comentario + "<br>" + "<br>") ;
            var output_comentarios = arrayYeison[i].comentarios.join("");
            console.log(arrayYeison[i].comentarios);
        }
    }

    document.querySelector("#comment_section").innerHTML = output_comentarios;
}
function clearComment(){
    document.querySelector("#comment_section").innerHTML = "";
}
function loadComment(){
    for (var i in jsMusic){
        if (jsMusic[i].path == player.src){
            document.querySelector("#comment_section").innerHTML = jsMusic[i].comentarios.join("");
        }
    }
}
function nextVideo(){
    var currentVideo = jsMusic.findIndex(video => video.path === player.src);
    if (currentVideo < jsMusic.length - 1){
        playVideo(jsMusic[currentVideo + 1]);
    } else {
        playVideo(jsMusic[0]);
    }
}
function previousVideo(){
    var currentVideo = jsMusic.findIndex(video => video.path === player.src);
    if (currentVideo > 0){
        playVideo(jsMusic[currentVideo - 1]);
    } else {
        playVideo(jsMusic[jsMusic.length - 1])
    }
}
function repeatVideo(){
    var currentVideo = jsMusic.findIndex(video => video.path === player.src)
    playVideo(jsMusic[currentVideo]);
}
function repeatVideoCheck(){
    if (repeat == false){
        repeat = true;
    } else {
        repeat = false;
    }
}
player.addEventListener("ended", function() {
    if (repeat){
        repeatVideo();
    } else {
        nextVideo();
    }
});
var play_icon = document.getElementById("play-icon");
var pause_icon = document.getElementById("pause-icon");
play_icon.addEventListener("click", () => {
    play_icon.style.display = "none";
    pause_icon.style.display = "block";
    player.play();
})
var pause_icon = document.getElementById("pause-icon");
pause_icon.addEventListener("click", () => {
    pause_icon.style.display = "none";
    play_icon.style.display = "block";
    player.pause();
})
var next_video_icon = document.getElementById("next-video-icon");
next_video_icon.addEventListener("click", () => {
    nextVideo();
    clearComment();
    loadComment();
})
var prev_video_icon = document.getElementById("prev-video-icon");
prev_video_icon.addEventListener("click", () => {
    previousVideo();
    clearComment();
    loadComment();
})
var repeat_video_icon = document.getElementById("repeat-video-icon");
var cont = 2;
repeat_video_icon.addEventListener("click", () => {
    repeatVideoCheck();
    if (cont % 2 == 0){
        repeat_video_icon.style.opacity = 1;
    } else {
        repeat_video_icon.style.opacity = .50;
    }
    cont++;
})
var fullscreen = document.getElementById("player");
function openFullscreen(){
    if (fullscreen.requestFullscreen){
        fullscreen.requestFullscreen();
    }
}
var slider = document.getElementById("volume-slider");
slider.addEventListener("change", function (ev){
    player.volume = ev.currentTarget.value;
}, true);

var muted_icon = document.getElementById("volume-muted-icon");
var volume_icon = document.getElementById("volume-icon");

function mute(){
    if (player.volume != 0){
        player.volume = 0;
        slider.value = 0;
        muted_icon.style.display = "block";
        volume_icon.style.display = "none";
    } else {
        player.volume = 1;
        slider.value = 1;
        muted_icon.style.display = "none";
        volume_icon.style.display = "block";
    }
}

var current_time = document.getElementById("current-time");
var total_time = document.getElementById("total-time");
player.addEventListener("loadeddata", () => {
    total_time.textContent = formatDuration(player.duration);
})

var zeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
})

function formatDuration(duration){
    var seconds = Math.floor(duration % 60);
    var minutes = Math.floor(duration / 60) % 60;
    var hours = Math.floor(duration / 3600);
    if (hours === 0){
        return `${minutes}:${zeroFormatter.format(seconds)}`
    } else {
        return `${hours}:${minutes}:${zeroFormatter.format(seconds)}`
    }
}

var timeline = document.getElementById("timeline");
timeline.addEventListener("click", handleTimelineUpdate)

function handleTimelineUpdate(e) {
    var rect = timeline.getBoundingClientRect();
    var percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    timeline.style.setProperty("--progress-position", percent);
    player.currentTime = percent * player.duration;
}

player.addEventListener("timeupdate", () => {
    current_time.textContent = formatDuration(player.currentTime);
    var percent = player.currentTime / player.duration;
    timeline.style.setProperty("--progress-position", percent);
})