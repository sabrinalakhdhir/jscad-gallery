
// Inspired by Battle ship example on Stack Overflow
// https://stackoverflow.com/questions/18034637/how-to-make-html5-draggable-objects-over-canvas

// Set up the main canvas on which notes will be added
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.strokeStyle = "lightgray";

// Set up the progress bar canvas
var progress = document.getElementById("progressCanvas");
var progressctx = progress.getContext("2d");
progressctx.strokeStyle = "lightgray";

// Determine the offsets of the canvas to support with tracking mouse movement (for dragging of individual notes within the canvas space)
var canvasOffset = document.getElementById("canvas").getBoundingClientRect();
//var canvasOffset = $("#canvas").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;

// Offsets for progress bar canvas to support mouse movements (for hovering and getting tool tip details regarding project progress)
var progressOffset = document.getElementById("progressCanvas").getBoundingClientRect();
var progressOffsetX = progressOffset.left;
var progressOffsetY = progressOffset.top;

// Initialize variables to track mouse movement
var mouseIsDown = false;
var lastX = 0;
var lastY = 0;

// Create a list for tracking all created notes
var noteslist = [];

// Initialize variables for tracking note content and color (based on user type)
var noteContent = "";
var noteColor = "";
var userType = "";

// Function to draw the progress bar
function initializeProgressBar() { 
    // The progress bar will be a rectangle with a border
    progressctx.strokeStyle = "black";
    progressctx.beginPath();
    progressctx.moveTo(50, 30);
    progressctx.lineTo(50, 80);
    progressctx.lineTo(750, 80);
    progressctx.lineTo(750, 30);
    progressctx.closePath();
    progressctx.stroke();

    // The progress bar will have a tooltip that will display the project's progress
    // For now, the tooltip will be static
    progressctx.font = "14px Arial";
    progressctx.strokeStyle = "black";
    progressctx.fillStyle = "black";
    progressctx.fillText("Project Progress", 50, 20);
    progressctx.font = "12px Arial";
    progressctx.fillText("Information Gathering", 50, 110);
    progressctx.fillText("Concept Development", 200, 110);
    progressctx.fillText("Design Development", 370, 110);
    progressctx.fillText("Prototyping", 550, 110);
    progressctx.fillText("Evaluation", 690, 110);

}

function updateProgressBar(completedPhase) {


    // Setting up and storing details about each of the phases of the design process
    // This includes: 
    // - what each phase is about
    // - x & y coordinates for each phase respective to the progress bar
    // - width & height for each phase
    // - color for each phase
    // - name of each phase
    // - status of each phase (complete, in progress, not started)

    // Initialize and store tool tip information for each phase of the project
    var info = [
        "Information Gathering: This phase of the project will involve gathering information about the problem space and the users. This will include conducting interviews, surveys, and observations.",
        "Concept Development: This phase of the project will involve developing concepts for the product. This will include brainstorming, sketching, and creating storyboards.",
        "Design Development: This phase of the project will involve developing the design for the product. This will include creating wireframes, mockups, and prototypes.",
        "Prototyping: This phase of the project will involve creating a prototype of the product. This will include creating a physical prototype and testing it with users.",
        "Evaluation: This phase of the project will involve evaluating the product. This will include conducting usability tests and interviews with users."
    ];

    // Initialize and store the x and y coordinates for each phase of the project
    var x = [50, 200, 360, 520, 670];
    var y = [30, 30, 30, 30, 30];

    // Initialize and store the width and height for each phase of the project
    var width = [150, 160, 160, 150, 80];
    var height = [50, 50, 50, 50, 50];

    // Initialize and store the color for each phase of the project
    var color = ["#663300", "#855c14", "#ab8f2e", "#d9cc4c", "#ffff66"];

    // Initialize and store the phase name for each phase of the project
    var phase = ["Information Gathering", "Concept Development", "Design Development", "Prototyping", "Evaluation"];

    // Initialize and store the phase status for each phase of the project
    var phaseStatus = ["Complete", "In Progress", "Not Started", "Not Started", "Not Started"];

    // Initialize and store current worker for each phase of the project
    var worker = ["Currently with End-user", "Currently with End-user", "", "", ""]//"Product Designer", "End-user"];
    // Colour the progress bar accordingly when a phase is completed
    if (completedPhase == 1) {
        progressctx.fillStyle = color[0];
        progressctx.fillRect(x[0], y[0], width[0], height[0]);
    }
    else if (completedPhase == 2) {
        progressctx.fillStyle = color[0];
        progressctx.fillRect(x[0], y[0], width[0], height[0]);
        progressctx.fillStyle = color[1];
        progressctx.fillRect(x[1], y[1], width[1], height[1]);
    }
    else if (completedPhase == 3) {
        progressctx.fillStyle = color[0];
        progressctx.fillRect(x[0], y[0], width[0], height[0]);
        progressctx.fillStyle = color[1];
        progressctx.fillRect(x[1], y[1], width[1], height[1]);
        progressctx.fillStyle = color[2];
        progressctx.fillRect(x[2], y[2], width[2], height[2]);
    }
    else if (completedPhase == 4) {
        progressctx.fillStyle = color[0];
        progressctx.fillRect(x[0], y[0], width[0], height[0]);
        progressctx.fillStyle = color[1];
        progressctx.fillRect(x[1], y[1], width[1], height[1]);
        progressctx.fillStyle = color[2];
        progressctx.fillRect(x[2], y[2], width[2], height[2]);
        progressctx.fillStyle = color[3];
        progressctx.fillRect(x[3], y[3], width[3], height[3]);
    }
    else if (completedPhase == 5) {
        progressctx.fillStyle = color[0];
        progressctx.fillRect(x[0], y[0], width[0], height[0]);
        progressctx.fillStyle = color[1];
        progressctx.fillRect(x[1], y[1], width[1], height[1]);
        progressctx.fillStyle = color[2];
        progressctx.fillRect(x[2], y[2], width[2], height[2]);
        progressctx.fillStyle = color[3];
        progressctx.fillRect(x[3], y[3], width[3], height[3]);
        progressctx.fillStyle = color[4];
        progressctx.fillRect(x[4], y[4], width[4], height[4]);
    }

    var tooltips = [];
    var progressMousex;
    var progressMousey;

    // Set up tool tips for each phase of the project
    // When a user hovers over a phase, a tool tip will appear with information about that phase
    for (var i = 0; i < phase.length; i++) {
        tooltips.push({
            x: x[i],
            y: y[i],
            tip: info[i],
            width: width[i],
            height: height[i],
            phase: phase[i],
            status: phaseStatus[i],
            worker: worker[i]
        });
    }

    document.getElementById("progressCanvas").addEventListener("mousemove", handleMouseMoveProgress);
    //$("#progressCanvas").mousemove(function (e) {handleMouseMoveProgress(e);});

    // Help from https://stackoverflow.com/questions/17064913/display-tooltip-in-canvas-graph for tool tip
    function handleMouseMoveProgress(e) {
        progressMousex = parseInt(e.clientX - progressOffsetX);
        progressMousey = parseInt(e.clientY - progressOffsetY);

        //console.log("x = " + progressMousex + " y = " + progressMousey);

        // Show details about the phase when the user hovers over it
        // Only showing phase status and worker for now
        // Content is currently hard-coded 
        // - change the worker note above where worker array is initialized
        // - change the length of colour fill on the progress bar above where updateProgressBar() is called

        var hit = false;
        for (var i = 0; i < tooltips.length; i++) {
            var tip = tooltips[i];
            var tx = progressMousex - tip.x;
            var ty = progressMousey - tip.y;
            if (tx > 0 && tx < tip.width && ty > 0 && ty < tip.height) {
                progressctx.clearRect(45, 115, 1000, 50);
                progressctx.font = "12px Arial";
                progressctx.fillStyle = "gray";
                progressctx.strokeStyle = "gray";
                progressctx.fillText("Phase " + tip.status, tip.x + 17, tip.y + 100);
                progressctx.fillText(tip.worker, tip.x + 17, tip.y + 115);
                hit = true;
            }
        }
        if (!hit) {
            progressctx.clearRect(45, 115, 1000, 50);
        }
    }

}

// Call the function to initialize the progress bar before anything else begins happening
initializeProgressBar();
updateProgressBar(2);

// Set up the form for adding notes
// Already created in HTML but hidden, this function is simply making it visible to the user
function addnote() {
    //notes = document.getElementById("notes");
    //notes.style.display = "inline";
}

var defaultReply = "";
var defaultuser = "";

// Function for saving all the attributes of a note
// Saving the input from the form
// Accessing the input
// Determining the color of the note based on the user type
function save() {
    // Hide the form after a note has been submitted
    var notesForm = document.getElementById('notes');

    // Set the content for the note to be the text entered by the user into the form
    noteContent = document.getElementById('noteText').value;

    //console.log(noteContent);

    // Set the color for the note to be the color selected by the user from the form
    var users = document.getElementsByName('usertype');
    for (var i = 0, length = users.length; i < length; i++) {
        if (users[i].checked) {
            userType = users[i].value;
            break;      
        }
    }
    if (userType == 'pd') {
        noteColor = "#c9edf5";
    } else if (userType == 'hcp') {
        noteColor = "#f5cfce";
    } else {
        noteColor = "#f0e0ff";
    }

    // Create a new note object and redraw all notes
    makeNote(100, 100, 150, 100, noteColor, noteContent, userType, defaultReply, defaultuser)
    drawAllNotes();
}

// Function to actually make the new note object
// Assigning all attributes of the note
// Adding the note to the list of notes
function makeNote(x, y, width, height, fill, body, user, reply, replyuser) {
    var note = {
        x: x,
        y: y,
        width: width,
        height: height,
        right: x + width,
        bottom: y + height,
        fill: fill,
        body: noteContent,
        user: userType,
        reply: defaultReply,
        replyuser: defaultuser
    }

    noteslist.push(note);
    return (note);
}

// Function to draw all notes
// Will redraw all notes each time a new note is added
// Will keep accurate track of the content for each note
function drawAllNotes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < noteslist.length; i++) {
        var note = noteslist[i]
        drawNote(note);
        ctx.fillStyle = note.fill;
        ctx.fill();
        ctx.stroke();

        // Add note content to the note
        ctx.font = "10px Arial";
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        ctx.fillText(note.body, note.x + 5, note.y + 25);
        ctx.fillStyle = note.replyuser;
        ctx.fillText(note.reply, note.x + 5, note.y + 40);

        ctx.fillStyle = "gray";
        ctx.font = "8px Arial";

        // Determine user type and label note accordingly
        if (note.user == 'pd') { 
        ctx.fillText("Product Designer", note.x + 5, note.y + 10)
        } else if (note.user == 'hcp') {
        ctx.fillText("Health Care Professional", note.x + 5, note.y + 10)
        } else {
        ctx.fillText("End User", note.x + 5, note.y + 10)
        }

        // Draw an x to allow the user to delete the note
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(note.right - 5, note.y + 5);
        ctx.lineTo(note.right - 25, note.y + 5);
        ctx.lineTo(note.right - 25, note.y + 20);
        ctx.lineTo(note.right - 5, note.y + 20);
        ctx.fillText("x", note.right - 17, note.y + 14);
        ctx.closePath();
        ctx.stroke();

        // Draw a square to allow the user to reply to the note
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(note.right - 140, note.y + 80);
        ctx.lineTo(note.right - 100, note.y + 80);
        ctx.lineTo(note.right - 100, note.y + 95);
        ctx.lineTo(note.right - 140, note.y + 95);
        ctx.fillText("Reply", note.right - 130, note.y + 90);
        ctx.closePath();
        ctx.stroke();

    }
}

// Draw the note's shape
function drawNote(note) {
    ctx.beginPath();
    ctx.moveTo(note.x, note.y);
    ctx.lineTo(note.right, note.y);
    ctx.lineTo(note.right, note.bottom);
    ctx.lineTo(note.x, note.bottom);
    ctx.closePath();
}

// Function to show user-selected preferences from the previous screen
function showPrefs() {
    ctx.clearRect(0, 0, 300, 120);
    var selectedPlacements = sessionStorage.getItem('placements');
    var selectedDevices = sessionStorage.getItem('devices');
    var selectedMechanisms = sessionStorage.getItem('mechanisms');
    ctx.font = "14px Arial";
	ctx.fillText("Preferred Placements: " + selectedPlacements, 10, 70);
    ctx.fillText("Preferred Devices: " + selectedDevices, 10, 90);
    ctx.fillText("Preferred Alerting Mechanisms: " + selectedMechanisms, 10, 110);

}

// Functions to handle mouse movement, thereby allowing the user to drag notes around the canvas
function handleMouseDown(e) {
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    // mousedown stuff here
    lastX = mouseX;
    lastY = mouseY;
    mouseIsDown = true;

    // If a user clicks on the x, the note will be deleted
    for (var i=0; i<noteslist.length; i++) {
        if (mouseX > noteslist[i].right - 30 && mouseX < noteslist[i].right - 2 && mouseY > noteslist[i].y + 2 && mouseY < noteslist[i].y + 25) {
            noteslist.splice(i, 1);
        }
    }

    // If a user clicks on reply, add a textbox to the note and a button through which the user can save their reply
    // Re-render the canvas to show the reply on the appropriate sticky note
    let replybuffer = 0;
    for (var i=0; i<noteslist.length; i++) {
        if (mouseX > noteslist[i].right - 140 && mouseX < noteslist[i].right - 100 && mouseY > noteslist[i].y + 80 && mouseY < noteslist[i].y + 95 && mouseIsDown) {
            let currentNote = noteslist[i];
            // If there is already a reply on the current note, add an extra buffer to the y coordinate of the note
            if (currentNote.reply != "") {
                replybuffer = replybuffer + 15;
            }

            // Adding a text box to the bottom of the sticky note
            let repliesDiv = document.getElementById("replies");
            var input = repliesDiv.appendChild(document.createElement("input"));
            input.type = "text";
            input.style.position = "absolute";
            input.style.zIndex = "1";
            input.style.left = noteslist[i].right - 140 + "px";
            input.style.top = noteslist[i].y + 177 + "px";
            input.style.width = "90px";
            input.style.height = "15px";
            input.style.border = "1px solid black";

            // Adding a reply button to the bottom of the sticky note
            var button = repliesDiv.appendChild(document.createElement("button"));
            button.innerHTML = "Reply";
            button.style.position = "absolute";
            button.style.zIndex = "1";
            button.style.left = noteslist[i].right - 40 + "px";
            button.style.top = noteslist[i].y + 177 + "px";
            button.style.width = "45px";
            button.style.height = "20px";
            button.style.border = "1px solid black";

            // Saving the reply value and hiding the text box and button from view
            button.onclick = function() {
                var replyText = input.value;
                currentNote.reply = currentNote.reply + "\n" + replyText;

                // Set text colour based on the user type that was logged earlier in creating the note
                if (userType == "pd")
                    currentNote.replyuser = "#007c9c";
                else if (userType == "hcp")
                    currentNote.replyuser = "#871400";
                else
                    currentNote.replyuser = "#58009c";
                
                console.log(currentNote.reply)
                input.style.display = "none";
                button.style.display = "none";
            }

            mouseIsDown = false;
        }
    }
    // Redrawing all the notes to reflect reply changes
    drawAllNotes();
}

function handleMouseUp(e) {
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    // mouseup stuff here
    mouseIsDown = false;
}

function handleMouseMove(e) {
    if (!mouseIsDown) {
        return;
    }

    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    // mousemove stuff here
    for (var i = 0; i < noteslist.length; i++) {
        var note = noteslist[i];
        drawNote(note);
        if (ctx.isPointInPath(lastX, lastY)) {
            note.x += (mouseX - lastX);
            note.y += (mouseY - lastY);
            note.right = note.x + note.width;
            note.bottom = note.y + note.height;
        }
    }

    lastX = mouseX;
    lastY = mouseY;

    drawAllNotes();
}

function hidenotes() {
    notes = document.getElementById("canvas");
    notes.style.display = "none";

    document.getElementById("hide").style.display = "none";
    let showButton = document.getElementById("show");
    showButton.style.display = "inline";
}

function shownotes() {
    notes = document.getElementById("canvas");
    notes.style.display = "inline";

    document.getElementById("show").style.display = "none";
    let hideButton = document.getElementById("hide");
    hideButton.style.display = "inline";

}

document.getElementById("canvas").addEventListener("mousedown", handleMouseDown);
document.getElementById("canvas").addEventListener("mousemove", handleMouseMove);
document.getElementById("canvas").addEventListener("mouseup", handleMouseUp);