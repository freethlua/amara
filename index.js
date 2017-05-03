const gid = document.getElementById.bind(document)

var consoleLog = console.log;
var consoleDiv = gid('console');
console.log = function() {
  var args = [].slice.apply(arguments);
  consoleLog.apply(console, args);
  consoleDiv.innerHTML = args.join(' ') + '\n' + consoleDiv.innerHTML.split(/[\n\r]+/g).slice(0, 5).join('\n');
}


var player;
loadYoutubeIframeAPI()



document.addEventListener('keydown', function(e) {
  // console.log(e.keyCode || e.which);
  if ((e.keyCode || e.which) === 9) {
    e.preventDefault();
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }
});

function onUrl(e) {
  e.preventDefault();
  var input = e.target.getElementsByTagName('input')[0];
  player.loadVideoById(input.value)
}


function loadYoutubeIframeAPI() {
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}


function getTextArea() {
  return (gid('textarea').value || '').trim().split(/[\n\r]+/g).filter(Boolean) || [];
}

function onYouTubeIframeAPIReady(videoId) {
  console.log('onYouTubeIframeAPIReady');
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: videoId || 'M7lc1UVf-VE' || 'TgoAgYR4584',
    events: {
      onReady: function() {
        // player.playVideo();
      },
      onStateChange1: function() {
        var currentTime = player.getCurrentTime();
        var totalTime = player.getDuration();

        var text = getTextArea();
        // console.log(`text:`, text);
        for (const line of text) {
          let [, start] = line.match(/(^[0-9]+) \|/) || [];
          if (!start) {
            gid('onSyncEnter.input').value = line;
            break;
          }


          // let [, start] = line.match(/(^[0-9]+) \|/);
          // let [, end] = line.match(/\| ([0-9]+)$/);
          // if (start || end) {
          //   if (!start) start = 0;
          //   if (!end) end = totalTime;
          //   [start, end] = [start, end].map(parseInt);
          //   if (end <= currentTime) {
          //     gid('syncPrev').innerHTML = line;
          //   }
          //   if (start <= currentTime && currentTime <= end) {
          //     gid('onSyncEnter.input').value = line;
          //   }
          //   // if ([, end] = line.match(/^[0-9]+ \|/))
          // } else {
          //   break;
          // }
        }
      },
    }
  });
}

var captions;

function onSyncFocus(e) {
  // gid('textarea').readOnly = true;
  try {
    captions = JSON.parse(gid('textarea').value)
  } catch (error) {
    captions = gid('textarea').value.trim().split(/[\r\n]+/g).filter(Boolean).map(line => ({ line }));
  }
  // gid('textarea').value = captions.join('\n');
  gid('onSyncEnter.input').value = captions[0].line
}

function onSyncKeyDown(e) {
  const input = e.target;
  const inputSpanPrev = gid('onSyncEnter').getElementsByTagName('span')[0];
  const inputSpanNext = gid('onSyncEnter').getElementsByTagName('span')[1];
  if ([38, 40].indexOf(e.keyCode || e.which) > -1) {
    e.preventDefault();
    // var text = getTextArea();
    // console.log(`text:`, text);
    var currentTime = player.getCurrentTime();
    var totalTime = player.getDuration();
    for (let i = 0; i < captions.length; i++) {
      const curr = captions[i];

      if (!input.value && i === 0) {
        input.value = curr.line
      }

      let done = false;
      if (input.value !== curr.line) continue
      else done = true

      const prev = captions[i - 1];
      const next = captions[i + 1];
      // const nextNext = captions[i + 2];
      // const prevPrev = captions[i - 2];

      if ((e.keyCode || e.which) === 40) {
        // down
        curr.end = currentTime;
        if (next) {
          next.start = curr.end;
          input.value = next.line;
        }
        // gid('syncPrev').innerHTML = curr.line;
        // if (nextNext) {
        //   gid('syncNext').innerHTML = nextNext.line;
        // }
      } else {
        // up
        curr.start = currentTime;
        if (prev) {
          prev.end = curr.start;
          input.value = prev.line;
        }
        // gid('syncNext').innerHTML = curr.line;
        // if (prevPrev) {
        //   gid('syncPrev').innerHTML = prevPrev.line;
        // }
      }

      // let line = text[i].match(/(:?^.*\| )(.*)(:? \|.*$)/)[1];
      // let line = text[i].match(/(.*)(:? \|.*$)/)[1];
      // console.log(`line:`, line);
      // if (line === gid('onSyncEnter.input').value) {
      //   line = line + ' | ' + player.getCurrentTime();
      // }
      if (done) break
    }
    console.log(captions)
    gid('textarea').value = JSON.stringify(captions, null, 2)

  }
}

function onSyncEnter() {

}





function onPlayerReady(event) {
  // event.target.playVideo();
}

var done = false;

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}
