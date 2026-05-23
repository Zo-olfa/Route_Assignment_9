/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
  let prefix = "";
  for (let c = 0; c < strs[0].length; c++) {
    for (let j = 1; j < strs.length; j++) {
      if (strs[0][c] !== strs[j][c]) {
        return prefix;
      }
    }
    prefix += strs[0][c] ?? "";
  }
  return prefix;
};

// console.log(longestCommonPrefix(["flower", "flow", "flight"])); // "fl"
// console.log(longestCommonPrefix(["dog", "racecar", "car"])); // ""
// console.log(longestCommonPrefix(["flower", "fkow"])); // "f"
// console.log(longestCommonPrefix(["dog", "dodg", "doc"])); // "do"
// console.log(longestCommonPrefix(["ab", "a"])); // "a"
// console.log(longestCommonPrefix(["a"])); // "a"
// console.log(longestCommonPrefix(["", ""])); // ""
// console.log(longestCommonPrefix(["aa", "aa"])); // "aa"
