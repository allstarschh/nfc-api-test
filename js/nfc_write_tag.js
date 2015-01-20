var NfcDemo = {
  tagContainer: null,

  init: function nd_init() {
    dump('NfcDemo init');
    var content = document.getElementById('content');
    var globalMsg = document.getElementById('global-message');
    this.tagContainer = content.querySelector('[data-type="tag-container"]')

    var nfc = window.navigator.mozNfc;
    if (!nfc) {
      globalMsg.textContent = 'NFC API not available.';
      return;
    }

    if (!nfc.enabled) {
      globalMsg.textContent = 'NFC is not enabled.';
      return;
    }

    document.getElementById('global-message').textContent = '';

    nfc.ontagfound = this.handleTagFound.bind(this);
  },

  handleTagFound: function nd_handleTagFound(event) {
    var tag = event.tag;
    var result = this.tagContainer.querySelector('[data-type="write-result"]');
    var type = new Uint8Array(this.fromUTF8("U"));
    var content = String.fromCharCode(1) + "mozilla.org";
    var payload = this.fromUTF8(content)

    var nfcUtils = new NfcUtils();
    var record = nfcUtils.parseURIString('http://www.mozilla.org');
//    [new MozNDEFRecord({tnf: "well-known", type: type, payload: payload})];

    tag.writeNDEF(record).then(() => {
      result.style.color = "Green";
      result.textContent = "Pass";
    }).catch((err) => {
      result.style.color = "Red";
      result.textContent = err;
    });
    return false;
  },

  fromUTF8: function(str) {
    var buf = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
      buf[i] = str.charCodeAt(i);
    }
    return buf;
  }
};

window.addEventListener('load', () => NfcDemo.init());
