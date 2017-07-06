var util = util || {};
util.toArray = function(list) {
  return Array.prototype.slice.call(list || [], 0);
};

var Terminal = Terminal || function(cmdLineContainer, outputContainer) {
  window.URL = window.URL || window.webkitURL;
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

  var cmdLine_ = document.querySelector(cmdLineContainer);
  var output_ = document.querySelector(outputContainer);

  const CMDS_ = [
     'clear', 'clock', 'date', 'echo', 'help', 'uname', 'connect', 'faq', 'daniel'
  ];
  
  var fs_ = null;
  var cwd_ = null;
  var history_ = [];
  var histpos_ = 0;
  var histtemp_ = 0;

  window.addEventListener('click', function(e) {
    cmdLine_.focus();
  }, false);

  cmdLine_.addEventListener('click', inputTextClick_, false);
  cmdLine_.addEventListener('keydown', historyHandler_, false);
  cmdLine_.addEventListener('keydown', processNewCommand_, false);

  //
  function inputTextClick_(e) {
    this.value = this.value;
  }

  //
  function historyHandler_(e) {
    if (history_.length) {
      if (e.keyCode == 38 || e.keyCode == 40) {
        if (history_[histpos_]) {
          history_[histpos_] = this.value;
        } else {
          histtemp_ = this.value;
        }
      }

      if (e.keyCode == 38) { // up
        histpos_--;
        if (histpos_ < 0) {
          histpos_ = 0;
        }
      } else if (e.keyCode == 40) { // down
        histpos_++;
        if (histpos_ > history_.length) {
          histpos_ = history_.length;
        }
      }

      if (e.keyCode == 38 || e.keyCode == 40) {
        this.value = history_[histpos_] ? history_[histpos_] : histtemp_;
        this.value = this.value; // Sets cursor to end of input.
      }
    }
  }

  //
  function processNewCommand_(e) {

    if (e.keyCode == 9) { // tab
      e.preventDefault();
      // Implement tab suggest.
    } else if (e.keyCode == 13) { // enter
      // Save shell history.
      if (this.value) {
        history_[history_.length] = this.value;
        histpos_ = history_.length;
      }

      // Duplicate current input and append to output section.
      var line = this.parentNode.parentNode.cloneNode(true);
      line.removeAttribute('id')
      line.classList.add('line');
      var input = line.querySelector('input.cmdline');
      input.autofocus = false;
      input.readOnly = true;
      output_.appendChild(line);

      if (this.value && this.value.trim()) {
        var args = this.value.split(' ').filter(function(val, i) {
          return val;
        });
        var cmd = args[0].toLowerCase();
        args = args.splice(1); // Remove cmd from arg list.
      }

      switch (cmd) {
        case 'clear':
          output_.innerHTML = '';
          this.value = '';
          return;
        case 'clock':
          var appendDiv = jQuery($('.clock-container')[0].outerHTML);
          appendDiv.attr('style', 'display:inline-block');
          output_.appendChild(appendDiv[0]);
          break;
        case 'date':
          output( new Date() );
          break;
        case 'echo':
          output( args.join(' ') );
          break;
        case 'help':
          output('<div class="ls-files">' + CMDS_.join('<br>') + '</div>');
          break;
        case 'uname':
          output(navigator.appVersion);
          break;
        case 'connect':
          output('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse semper ullamcorper elit, id viverra nisi porttitor vel. Aliquam eu cursus felis, non accumsan lacus. Aenean quis hendrerit ante. Quisque dapibus dui eu risus condimentum imperdiet. Suspendisse non lacus a tortor lobortis tristique. Donec ac velit nisi. Aliquam mattis tempor ex, sed efficitur arcu ultricies a. Fusce nulla odio, scelerisque eget ornare et, tristique sit amet nibh. Quisque auctor velit arcu, id luctus ligula egestas et. Mauris congue, dui posuere tristique mattis, mauris dolor ultricies mi, sit amet porttitor mi massa sed mi. Etiam dapibus vehicula nisi sit amet fringilla. Pellentesque placerat velit sed scelerisque luctus. Pellentesque posuere tellus vel lacus sollicitudin, sed lobortis velit tristique. Praesent eu justo rutrum, rutrum mi sed, lobortis dolor. Sed id efficitur lacus.' + ('<br><br>') + 'Donec ut arcu quis elit molestie tempor. Fusce pellentesque scelerisque elit, non elementum dui. Donec convallis erat sit amet convallis mollis. Donec quis augue scelerisque, congue quam id, tristique nulla. Sed ullamcorper ultricies dictum. Phasellus ornare ut augue et malesuada. Morbi et nisi eleifend, fermentum leo in, finibus velit. Vivamus interdum dui quis tellus tempus tincidunt. Mauris at molestie massa. Curabitur egestas elit nec egestas tempor. Vestibulum in nisi ut ex interdum.');
          break;
	case 'faq':
          output('<h2>What is abjects</h2>Abjects is an IRC Network<h2>What is irc?</h2>internet relay chat<h2>WHo runs the network</h2>Spiders');
          break;
	case 'daniel':
          output('hail hitler');
          break;
    
      };

      window.scrollTo(0, getDocHeight_());
      this.value = ''; // Clear/setup line for next input.
    }
  }

  //
  function formatColumns_(entries) {
    var maxName = entries[0].name;
    util.toArray(entries).forEach(function(entry, i) {
      if (entry.name.length > maxName.length) {
        maxName = entry.name;
      }
    });

    var height = entries.length <= 3 ?
        'height: ' + (entries.length * 15) + 'px;' : '';

    // 12px monospace font yields ~7px screen width.
    var colWidth = maxName.length * 7;

    return ['<div class="ls-files" style="-webkit-column-width:',
            colWidth, 'px;', height, '">'];
  }

  //
  function output(html) {
    output_.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>');
  }

  // Cross-browser impl to get document's height.
  function getDocHeight_() {
    var d = document;
    return Math.max(
        Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
        Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
        Math.max(d.body.clientHeight, d.documentElement.clientHeight)
    );
  }

  //
  return {
    init: function() {
      output('<img align="left" src="https://i.imgur.com/jSlgtv9.png" width="202" height="82" style="padding: 0px 10px 20px 0px"><h2 style="letter-spacing: 4px">Welcome to Abjects.net</h2><p>' + new Date() + '</p><p>Enter "help" for more information.</p>');
    },
    output: output
  }
};
