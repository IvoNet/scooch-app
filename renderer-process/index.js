/*
 * Copyright 2016 Ivo Woltring <WebMaster@ivonet.nl>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function () {
   angular
        .module('scooch', [])
        .controller('mainController', MainController);

   MainController.$inject = [
      '$window',
      '$filter'
   ];

   function MainController($window, $filter) {
      const fs = require('fs')
      const path = require('path')
      const model = require(`${__dirname}/renderer-process/model.js`)

      let that = this;

      that.message = '';
      that.slide = undefined;

      function setDefaults() {
         that.presenterNotes = false;
         that.center = false;
         that.mouseWheel = false;
         that.controls = true;
         that.slideNumber = false;
         that.print = false;
         that.progress = true;
         that.history = true;
         that.theme = that.model.themes[0].file;
         that.template = that.model.templates[0].file;
         that.transition = 'none';
         that.disableChalkboard = false;
         that.replayChalkboard = true;
         that.autoSlide = 0;
         that.loop = false;
      }

      that.savePresets =  () => {
         if (that.slide === undefined) {
            return;
         }
         const presets = {
            controls: that.controls,
            mouseWheel: that.mouseWheel,
            slideNumber: that.slideNumber,
            presenterNotes: that.presenterNotes,
            center: that.center,
            progress: that.progress,
            history: that.history,
            theme: $filter('filter')(that.model.themes, {file: that.theme}, true)[0].title,
            template: $filter('filter')(that.model.templates, {file: that.template}, true)[0].title,
            transition: that.transition,
            disableChalkboard: that.disableChalkboard,
            replayChalkboard: that.replayChalkboard,
            autoSlide: that.autoSlide,
            loop: that.loop
         };
         fs.writeFileSync(path.join(path.dirname(that.slide.file), "preset.json"), JSON.stringify(presets))
         that.buildModel()
      };

      that.model = model.buildModel()
      setDefaults()

      that.goPreset = (slide) => {
         var myWindow = $window.open('', '_blank');
         that.onSelect(slide).then(function () {
            that.slide = slide;
            that.go(myWindow);
         });
      };

      that.go = (newWindow) => {
         that.message = "";
         if (that.slide === undefined) {
            that.message = "You must select a slide.";
            return;
         }
         if (newWindow === undefined) {
            newWindow = $window.open('', '_blank');
         }
         var url = "file://" + __dirname +"/";
         url += that.template;
         url += "?theme=" + that.theme;
         url += "&transition=" + that.transition;
         if (that.presenterNotes) {
            url += "&showNotes=true"; //false is default
         }
         if (that.center) {
            url += "&center=true"; //false is default
         }
         if (that.mouseWheel) {
            url += "&mouseWheel=true"; // false is default
         }
         if (that.slideNumber) {
            url += "&slideNumber=true"; // false is default
         }
         if (!that.controls) {
            url += "&controls=false"; // true is default
         }
         if (!that.history) {
            url += "&history=false"; // true is default
         }
         if (!that.progress) {
            url += "&progress=false"; // true is default
         }
         if (that.slide.chalkboard !== undefined && that.replayChalkboard) {
            url += "&chalk=" + that.slide.chalkboard;
         }
         if (that.disableChalkboard) {
            url += "&disableChalkboard=true"; //false is default
         }
         if (that.autoSlide) {
            url += "&autoSlide=" + that.autoSlide; //no slide is 0
         }
         if (that.loop) {
            url += "&loop=true"; //false is false
         }
         url += '&title=' + that.slide.title;
         if (that.print) {
            url += "&print-pdf=true";
         }
         url += "&slideshow=" + that.slide.file;
         newWindow.location = url;
      };

      that.onSelect = (slide) => {
         setDefaults();
         that.slide = slide;
         // retrieve preset if available
         if (slide.preset !== undefined) {
            const data = JSON.parse(fs.readFileSync(slide.preset, "utf8"))

            if (data.controls !== undefined) {
               that.controls = data.controls;
            }
            if (data.mouseWheel !== undefined) {
               that.mouseWheel = data.mouseWheel;
            }
            if (data.slideNumber !== undefined) {
               that.slideNumber = data.slideNumber;
            }
            if (data.transition !== undefined) {
               that.transition = data.transition;
            }
            if (data.presenterNotes !== undefined) {
               that.presenterNotes = data.presenterNotes;
            }
            if (data.center !== undefined) {
               that.center = data.center;
            }
            if (data.progress !== undefined) {
               that.progress = data.progress;
            }
            if (data.history !== undefined) {
               that.history = data.history;
            }
            if (data.disableChalkboard !== undefined) {
               that.disableChalkboard = data.disableChalkboard;
            }
            if (data.replayChalkboard !== undefined) {
               that.replayChalkboard = data.replayChalkboard;
            }
            if (data.loop !== undefined) {
               that.loop = data.loop;
            }
            if (data.autoSlide !== undefined) {
               that.autoSlide = data.autoSlide;
            }
            if (data.theme !== undefined) {
               var theme = $filter('filter')(that.model.themes, {title: data.theme}, true)[0].file;
               if (theme !== undefined) {
                  that.theme = theme;
               }
            }
            if (data.template !== undefined) {
               var template = $filter('filter')(that.model.templates, {title: data.template}, true)[0].file;
               if (template !== undefined) {
                  that.template = template;
               }
            }

         }
      };
   }
})();