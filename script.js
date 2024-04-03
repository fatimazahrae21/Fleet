// Get the notification box element and initialize a variable to track its state
var box = document.getElementById('box');
var down = false;

// Function to toggle the visibility of the notification box
function toggleNotifi() {
    if (down) { 
        // If the box is currently down (visible), hide it
        box.style.height = '0px';
        box.style.opacity = 0;
        down = false;
    } else {
        // If the box is currently up (hidden), show it
        box.style.height = '510px';
        box.style.opacity = 1;
        down = true;
    }
}

// Function to display the first set of vehicle information
function afficherInfo() {
    var info = document.getElementById("myinfo");
    info.style.display = "block";
}

// Function to display the second set of vehicle information
function afficherInfo1() {
    var info1 = document.getElementById("myinfo1");
    info1.style.display = "block";
}

// Function to handle clicks outside of the vehicle information popups and close them
window.onclick = function(event) {
    var info = document.getElementById("myinfo");
    var info1 = document.getElementById("myinfo1");
    if (event.target == info) {
        info.style.display = "none";
    } else if (event.target == info1) {
        info1.style.display = "none";
    }
}

// Function to update the clock with current date and time
function updateClock() {
    var now = new Date();
    var dname = now.getDay() - 1;
    if (dname === 7) {
        dname = 0; // Sunday is indexed at 0 in the array
    }

    var mo = now.getMonth(),
        dnum = now.getDate(),
        yr = now.getFullYear(),
        hou = now.getHours(),
        min = now.getMinutes(),
        sec = now.getSeconds(),
        pe = "AM";

    if (hou == 0) {
        hou = 12;
    }
    if (hou > 12) {
        hou = hou - 12;
        pe = "PM";
    }

    // Prototype function to pad single-digit numbers with leading zeros
    Number.prototype.pad = function(digits) {
        for (var n = this.toString(); n.length < digits; n = 0 + n);
        return n;
    };

    var months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var week = [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ];
    var ids = ["dayname", "month", "daynum", "year", "hour", "minutes", "seconds", "period"];

    var values = [
        week[dname], months[mo], dnum.pad(2), yr, hou.pad(2),
        min.pad(2), sec.pad(2), pe
    ];
    for (var i = 0; i < ids.length; i++) {
        document.getElementById(ids[i]).textContent = values[i];
    }
}

// Function to initialize the clock and update it every second
function initClock() {
    updateClock();
    window.setInterval(updateClock, 1000); // Call updateClock every second
}

// Initialize the clock when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function() {
    initClock();
});
