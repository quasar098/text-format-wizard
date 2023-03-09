export function caesarCipher(word, next) {
    next = next % 26; let res = ""; for (const letter of word) {
        let letterCode = letter.charCodeAt(0);
        if (letterCode >= 65 && letterCode <= 90) {
          letterCode = letterCode + next;
          if (letterCode > 90) {
            letterCode = letterCode - 26;
          } else if (letterCode < 65) {
            letterCode = letterCode + 26;
          }
        } else if (letterCode >= 97 && letterCode <= 122) {
          letterCode = letterCode + next;

          if (letterCode > 122) {
            letterCode = letterCode - 26;
          } else if (letterCode < 97) {
            letterCode = letterCode + 26;
          }
        }
        res = res + String.fromCharCode(letterCode);
    }
    return res;
}
