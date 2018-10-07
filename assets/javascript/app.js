// Initialize Firebase
var index = 0;

var config = {
    apiKey: "AIzaSyBly4nZbpxu36eY8KFEipA_nZSIgpu7Oxo",
    authDomain: "train-of-thot.firebaseapp.com",
    databaseURL: "https://train-of-thot.firebaseio.com",
    projectId: "train-of-thot",
    storageBucket: "train-of-thot.appspot.com",
    messagingSenderId: "10907033092"
  };
  firebase.initializeApp(config);

var database = firebase.database();

$("#form-id").on("submit", function (event) {
        event.preventDefault();

        var name = $("#train-name").val().trim();
        var destination = $("#train-destination").val().trim();
        var firstTrainTime = $("#first-train-time").val().trim();
        var frequency = $("#frequency").val().trim();

        database.ref().push({
            name: name,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency
        });

    $("#train-name").val("");
    $("#train-destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");

        return false;
    });

database.ref().orderByChild("dateAdded").on("child_added", function (childSnapshot) {

    var update = $("<button>").html("<i class='fas fa-edit'></i>").addClass("update").attr("data-index", index).attr("data-key", childSnapshot.key);
    var cancel = $("<button>").html("<i class='fas fa-times-circle'></i>").addClass("cancel").attr("data-index", index).attr("data-key", childSnapshot.key);

  var firstTrainTime = childSnapshot.val().firstTrainTime;
  var timeFrequency = parseInt(childSnapshot.val().frequency);
  var firstTrain = moment(firstTrainTime, "HH:mm").subtract(1, "years");
  var currentTimeCalculate = moment().subtract(1, "years");
  var diffTime = moment().diff(moment(firstTrain), "minutes");
  var timeRemainder = diffTime%timeFrequency;
  var minutesLeft = timeFrequency - timeRemainder;
  var nextTrain = moment().add(minutesLeft, "minutes").format ("hh:mm A");
  var beforeCalculate = moment(firstTrain).diff(currentTimeCalculate, "minutes");
  var beforeMinutes = Math.ceil(moment.duration(beforeCalculate).asMinutes());

  if ((currentTimeCalculate - firstTrain) < 0) {
    nextTrain = childSnapshot.val().firstTrainTime;
    minutesLeft = beforeMinutes;
  }
  else {
    nextTrain = moment().add(minutesLeft, "minutes").format("hh:mm A");
    minutesLeft = timeFrequency - timeRemainder;
  }


    var addRow = $("<tr>");
  addRow.addClass("row-" + index);
    var firstCell = $("<td>").append(update);
    var secondCell = $("<td>").text(childSnapshot.val().name);
    var thirdCell = $("<td>").text(childSnapshot.val().destination);
    var fourthCell = $("<td>").text(childSnapshot.val().frequency + " min");
    var fifthCell = $("<td>").text(nextTrain);
    var sixthCell = $("<td>").text(minutesLeft + " min");
    var seventhCell = $("<td>").append(cancel);

    addRow
        .append(firstCell)
        .append(secondCell)
        .append(thirdCell)
        .append(fourthCell)
        .append(fifthCell)
        .append(sixthCell)
        .append(seventhCell);

   $("#table-content").append(addRow);

 index++;
    
}, function (error) {
    alert(error.code);
});

function removeRow () {
  $(".row-" + $(this).attr("data-index")).remove();
  database.ref().child($(this).attr("data-key")).remove();
};

function editRow () {
  $(".row-" + $(this).attr("data-index")).children().eq(1).html("<textarea class='newName'></textarea>");
  $(".row-" + $(this).attr("data-index")).children().eq(2).html("<textarea class='newDestination'></textarea>");
  $(".row-" + $(this).attr("data-index")).children().eq(3).html("<textarea class='newFrequency' type='number'></textarea>");
  $(this).toggleClass("update").toggleClass("submitButton");
};

function submitRow () {
  var newName = $(".newName").val().trim();
  var newDestination = $(".newDestination").val().trim();
  var newFrequency = $(".newFrequency").val().trim();

  database.ref().child($(this).attr("data-key")).child("name").set(newName);
  database.ref().child($(this).attr("data-key")).child("destination").set(newDestination);
  database.ref().child($(this).attr("data-key")).child("frequency").set(newFrequency);

  $(".row-" + $(this).attr("data-index")).children().eq(1).html(newName);
  $(".row-" + $(this).attr("data-index")).children().eq(2).html(newDestination);
  $(".row-" + $(this).attr("data-index")).children().eq(3).html(newFrequency);
  $(this).toggleClass("update").toggleClass("submitButton");
};

$(document).on("click", ".cancel", removeRow);
$(document).on("click", ".update", editRow);
$(document).on("click", ".submitButton", submitRow);