"use strict";

require("core-js/modules/es.promise.js");
let getItem = async () => {
  return await fetch("http://google.com");
};