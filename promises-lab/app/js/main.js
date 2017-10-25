/*
Copyright 2016 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/*jshint esversion: 6*/

var app = (function() {
  function getImageName(country) {
    country = country.toLowerCase()
    let promiseOfImageName = new Promise((resolve, reject) => {
      setTimeout(function() {
        if (country === 'spain' || country === 'chile' || country === 'peru') {
          resolve(country + '.png')
        } else {
          reject(Error("Didn't receive a valid country name!"))
        }
      }, 1000)
    })
    console.log(promiseOfImageName)
    return promiseOfImageName
  }

  function isSpain(country) {
    // TODO - Optional
  }

  function flagChain(country) {
    // TODO 2.2 - use the promise
    return getImageName(country)
      .catch(fallbackName)
      .then(fetchFlag)
      .then(processFlag)
      .then(appendFlag)
      .catch(logError)
  }

  function spainTest(country) {
    // TODO - Optional
  }

  function allFlags(promiseList) {
    // TODO
    return Promise.all(promiseList)
  }

  // TODO 4.1 - Promise.all
  let promises = [
    getImageName('Spain'),
    getImageName('Chile'),
    getImageName('Peru'),
  ]

  allFlags(promises).then(function(result) {
    console.log(result)
  })
  // TODO 4.2 - Promise.race

  /* Helper functions */

  function logSuccess(result) {
    console.log('Success!:\n' + result)
  }

  function logError(err) {
    console.log('Oh no!:\n' + err)
  }

  function returnTrue() {
    return true
  }

  function returnFalse() {
    return false
  }

  function fetchFlag(imageName) {
    return fetch('flags/' + imageName) // fetch returns a promise
  }

  function processFlag(flagResponse) {
    if (!flagResponse.ok) {
      throw Error('Bad response for flag request!') // This will implicitly reject
    }
    return flagResponse.blob() // blob() returns a promise
  }

  function appendFlag(flagBlob) {
    var flagImage = document.createElement('img')
    var flagDataURL = URL.createObjectURL(flagBlob)
    flagImage.src = flagDataURL
    document.body.appendChild(flagImage)
  }

  function fallbackName() {
    return 'chile.png'
  }

  // Don't worry if you don't understand this, it's not part of Promises.
  // We are using the JavaScript Module Pattern to enable unit testing of
  // our functions.
  return {
    getImageName: getImageName,
    flagChain: flagChain,
    isSpain: isSpain,
    spainTest: spainTest,
    fetchFlag: fetchFlag,
    processFlag: processFlag,
    appendFlag: appendFlag,
    allFlags: allFlags,
  }
})()
