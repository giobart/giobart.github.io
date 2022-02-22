var currentEventsDescription = []
var firstexec = true;

function getRootElementFontSize() {
  // Returns a number
  return parseFloat(
    // of the computed font-size, so in px
    getComputedStyle(
      // for the root <html> element
      document.body
    ).fontSize
  );
}

function convertEm(value) {
  return value * getRootElementFontSize();
}

function preparePage() {

  if(window.mobilecheck()){
    $("body").css("font-size", "28px");
  }

  $("#name").text(configuration.name)
  $("#brief").text(configuration.brief)
  var birthdate = configuration.birth
  var line = document.createElement('span');
  var line2 = document.createElement('span');
  var line3 = document.createElement('span');
  var date = document.createElement('span');
  var yearsize = 50;
  var monthsize = yearsize / 13;
  var currpos = 18;
  var firstyear = 0;
  var center = $("#line1").offset().top;
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var pagesize = 0
  var storylineStart = 0

  $('body').height(pagesize);
  var breakpoints = [{
    "from": center,
    "date": months[((configuration.month) - 1)] + " " + birthdate,
    "to": center + convertEm(monthsize),
    "month": 8
  },
  {
    "from": center + convertEm(monthsize),
    "date": " ... " + birthdate,
    "to": center + convertEm(yearsize),
    "month": 8
  }];

  //creating firs lines
  var lastyear = birthdate;
  $(line)
    .addClass("line")
    .css({ top: "0px", height: "10em" })
    .appendTo($("#line3"));

  $(line2)
    .addClass("line")
    .css({ top: "12em", height: "2em" })
    .appendTo($("#line3"));

  $(line3)
    .addClass("line")
    .css({ top: "16em", height: "2em" })
    .appendTo($("#line3"));

  $("#date").text("Aug " + birthdate);

  //creating events lines and breakpoints
  configuration.events.forEach(function (event) {
    if (firstyear == 0) {
      firstyear = event.year
    }

    if (lastyear != event.year) {
      //creating breakpoints
      var startpos = convertEm(yearsize + (event.year - firstyear) * yearsize);
      for (i = 0; i < 12; i++) {
        var eventsToAdd = configuration.events.filter(function (val) {
          return val.year == event.year && val.monthfrom <= (i + 1) && (i + 1) <= val.monthto
        })
        breakpoints.push({
          "from": center + startpos,
          "date": eventsToAdd.length > 0 ? months[i] + " " + event.year : "",
          "to": center + startpos + convertEm(monthsize),
          "month": i,
          "events": eventsToAdd
        })
        //updating page size
        if ((center + startpos + convertEm(monthsize) - 1) > pagesize) {
          if (eventsToAdd.length > 0) {
            pagesize = (center + startpos + convertEm(monthsize) - 1)
          }
        }
        startpos += convertEm(monthsize);
      }
    }
    var position = yearsize + (event.year - firstyear) * yearsize + (event.monthfrom - 1) * monthsize;
    var line = document.createElement('span');
    var size = event.monthto - event.monthfrom + 1

    if(firstexec){
      $(line).css("background-color", event.color)
      firstexec=false
    }
    $(line)
      .attr("id", event.year + "-" + event.monthfrom + "-" + event.monthto + "-" + event.position)
      .addClass("line")
      .addClass("aniview")
      .attr("data-av-animation", "slideInRight")
      .css({ top: position + "em", height: (size * monthsize) + "em" })
      .appendTo($("#line" + event.position));

  });

  var firstevent = configuration.events[0];
  storylineStart = $("#" + firstevent.year + "-" + firstevent.monthfrom + "-" + firstevent.monthto + "-" + firstevent.position).offset().top

  $('body').height(pagesize + center * 3);

  //adding scroll events
  document.addEventListener('scroll', function (event) {
    var eventsDescriptionsToAdd = []
    var eventsDescriptionsToRemove = []
    var dotpos = $("#dot3").offset().top

    breakpoints.forEach(function (elem) {
      if (dotpos > elem.from && dotpos < elem.to) {
        //update dates and events lines
        $("#date").text(elem.date)
        if (elem.year != birthdate) {
          var pos = [false, false, false];

          if (elem.events != undefined)
            elem.events.forEach(function (val) {

              if (!(arrayContainsEventsName(eventsDescriptionsToAdd, val) >= 0)) {
                eventsDescriptionsToAdd.push(val)
              }

              //update line color
              $("#" + val.year + "-" + val.monthfrom + "-" + val.monthto + "-" + val.position).css("background-color", val.colorhover);
              for (j = 1; j <= 3; j++) {
                if (j == val.position) {
                  pos[j - 1] = true;
                }
              }
            });

          //change dot positions
          for (j = 1; j <= 3; j++) {
            var dot = $("#dot" + j);
            dot.removeClass().addClass("dot")
            if (pos[j - 1]) {
              dot.addClass("position" + j)
            } else {
              dot.addClass("position3")
            }
          }
        }
      }
    });
    //reset dot positions if there are no events to visaulize
    if (dotpos < storylineStart) {
      $("#dot1").removeClass().addClass("dot").addClass("position3")
      $("#dot2").removeClass().addClass("dot").addClass("position3")
    }
    //hide dots and description when page is finished
    if (dotpos > pagesize) {
      $("#dot1").addClass("hidden")
      $("#dot2").addClass("hidden")
      $("#dot3").addClass("hidden")
      $("#description").addClass("hidden").removeClass("visible")
      $("#date").addClass("hidden").removeClass("visible")
    } else {
      $("#dot1").removeClass("hidden")
      $("#dot3").removeClass("hidden")
      $("#dot3").removeClass("hidden")
      $("#description").addClass("visible").removeClass("hidden")
      $("#date").addClass("visible").removeClass("hidden")
    }
    //select old elements to remove and newer ones to add

    //update of list of events descrptions to be removed and to be added
    currentEventsDescription.forEach(function (event, index) {
      if (!(arrayContainsEventsName(eventsDescriptionsToAdd, event) >= 0))
        eventsDescriptionsToRemove.push(event)
    })
    eventsDescriptionsToAdd = eventsDescriptionsToAdd.filter(function (elem, index) {
      return !(arrayContainsEventsName(currentEventsDescription, elem) >= 0)
    })

    //remove old descriptions and add newer ones
    eventsDescriptionsToRemove.forEach(function (e) { console.log("REMOVE:" + e.name) })
    addDescriptionToStoryline(eventsDescriptionsToAdd)
    removeDescriptionFromStoryline(eventsDescriptionsToRemove)
    //update current
    eventsDescriptionsToAdd.forEach(function (toadd) { currentEventsDescription.push(toadd) })
    currentEventsDescription = currentEventsDescription.filter(function (elem, index) {
      return !(arrayContainsEventsName(eventsDescriptionsToRemove, elem) >= 0)
    })



  }, true /*Capture event*/);
}

function resetPage() {
  $("#line1").empty()
  $("#line2").empty()
  $("#line3").empty()
  for (j = 1; j <= 3; j++) {
    var dot = $("#dot" + j);
    dot.removeClass().addClass("dot").addClass("position3")
  }
}

function addDescriptionToStoryline(eventsArray) {
  eventsArray.forEach(function (event) {
    //update description
    var descrTitle = document.createElement('span');
    var descrContent = document.createElement('div');
    $("#description").addClass("visible").removeClass("hidden")
    $(descrTitle).addClass("description-title").attr("id", event.name.replace(/[!@#$%^&*,;.\s]/g, '') + "title")
    $(descrTitle).text(event.name).css("border-block-start-color", event.colorhover).appendTo($("#description"));
    $(descrContent).addClass("description-content").attr("id", event.name.replace(/[!@#$%^&*,;.\s]/g, '') + "content")
    $(descrContent).html(event.description).css("border-block-start-color", event.colorhover).appendTo($("#description"));
  })
}

function removeDescriptionFromStoryline(eventsArray) {
  eventsArray.forEach(function (event) {
    //update description
    console.log("REMOVING: " + "#" + event.name + "title")
    var title = $("#" + event.name.replace(/[!@#$%^&*,;.\s]/g, '') + "title")
    var content = $("#" + event.name.replace(/[!@#$%^&*,;.\s]/g, '') + "content")
    title.remove()
    content.remove()
  })
}

function arrayContainsEventsName(array, elem) {
  var lastindex = -1
  var nameval
  array.forEach(function (val, index) {
    if (val.name == elem.name) {
      lastindex = index
      nameval = val.name
    }
  })
  return lastindex
}

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

