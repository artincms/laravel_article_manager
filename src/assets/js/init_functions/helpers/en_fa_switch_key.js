function init_toPersianSwitchKey(selector) {
    $(document).on('keyup', selector, function () {
        var $this = $(this);
        var fa = _toPersianSwitchKey($this.val());
        $this.val(fa);
    });
}
function init_toEnglishSwitchKey(selector) {
    $(document).on('keyup', selector, function () {
        var $this = $(this);
        var en = _toEnglishSwitchKey($this.val());
        $this.val(en);
    });
}
function _toPersianSwitchKey(value) {
    if (!value) {
        return;
    }
    var persianChar = ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "چ", "ش", "س", "ی", "ب", "ل", "ا", "ت", "ن", "م", "ک", "گ", "ظ", "ط", "ز", "ر", "ذ", "د", "ئ", "پ", "پ", "و", "؟", "ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ش", "س", "ی", "ب", "ل", "ا", "ت", "ن", "م", "ظ", "ط", "ژ", "ر", "ذ", "د", "ء"],
        englishChar = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "z", "x", "c", "v", "b", "n", "m", "~", "`", ",", "?", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"];

    for (var i = 0, charsLen = englishChar.length; i < charsLen; i++) {
        value = value.replaceAll(englishChar[i], persianChar[i]);
    }
    return value;
}
function _toEnglishSwitchKey(value) {
    if (!value) {
        return;
    }
    var persianChar = ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "چ", "ش", "س", "ی", "ب", "ل", "ا", "ت", "ن", "م", "ک", "گ", "ظ", "ط", "ز", "ر", "ذ", "د", "ئ", "پ", "پ", "و", "؟", "ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ش", "س", "ی", "ب", "ل", "ا", "ت", "ن", "م", "ظ", "ط", "ژ", "ر", "ذ", "د", "ء"],
        englishChar = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "z", "x", "c", "v", "b", "n", "m", "~", "`", ",", "?", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"];

    for (var i = 0, charsLen = persianChar.length; i < charsLen; i++) {
        value = value.replaceAll(persianChar[i], englishChar[i]);
    }
    return value;
}