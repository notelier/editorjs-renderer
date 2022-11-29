/*
 * editor.js-parser
 * Made by David (aboutdavid.me)
 * licenced under the Apache 2.0 License
 */
function xss(html) {
  var options = [
    { regex: /\"/gm, replace: "&quot;" },
    { regex: /\&/gm, replace: "&amp;" },
    { regex: /\</gm, replace: "&lt;" },
    { regex: /\>/gm, replace: "&lt;" }
  ];
  var i = 0;
  while (i < options.length) {
    html = html.replace(options[i].regex, options[i].replace);
    i++;
  }
  return html;
}

var render = function(data) {
  if (typeof data != "object" || !Array.isArray(data.blocks)) {
    throw new Error("Please provide a valid editor.js object!");
  }
  var blocks;
  if (Array.isArray(data)){
    blocks = data
  } else {
    blocks = data.blocks
  }
  var i = 0;
  var html = "";
  var blocks = data.blocks;
  while (i < blocks.length) {
    var block = blocks[i];
    var type = block.type;
    var bdata = block.data;
    if (type == "header") {
      html += `<h${bdata.level}>${bdata.text}</h${bdata.level}>`;
    } else if (type == "paragraph") {
      html += `<p>${bdata.text}</p>`;
    } else if (type == "list") {
      var tag = bdata.style == "ordered" ? "ol" : "ul";
      var b = 0;
      var list = "";
      while (b < bdata.items.length) {
        list += `<li>${bdata.items[b]}</li>`;
        b++;
      }
      html += `<${tag}>${list}</${tag}>`;
    } else if (type == "delimiter") {
      html += `<div class="ce-delimiter"></div>`;
    } else if (type == "image") {
      html += `<img src="${bdata.file.url}" alt="${bdata.caption || ""}">`;
    } else if (type == "raw") {
      html += `<pre><code>${window.filterXSS(bdata.html, {
        whiteList: []
      })}</code></pre>`;
    } else if (type == "code" || type == "rawTool") {
      html += `<pre><code>${xss(bdata.code || bdata.html)}</code></pre>`;
    } else if(type == "quote"){
      html += `<blockquote>${bdata.text}</blockquote> - ${bdata.caption}`
    }
    i++;
  }
  return html;
};
var obj = { render: render };
if (typeof window === "undefined") {
  module.exports = obj;
} else {
  window.EditorJSParser = obj;
}
