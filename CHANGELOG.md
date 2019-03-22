
## 1.9.4 - Thu Mar 14 2019

Added backers and sponsors on the README - 8bb98847f59b3c37ed479adbab7cac2c6800e56f

Added call to donate after npm install (optional) - 6d6b4805f5fb14e9055a06087d63fa1579f6b220

Manual scroll should cancel/override scrollIntoView. Fixes #58. - d9a86baca2c4bc87c3e6e430495c99b150802b31


## 1.9.3 - Fri Mar 23 2018

Fixes #10 - 712cd28432dd634e2899719e929ec3fbcd0fb350


## 1.9.2 - Fri Mar 23 2018

Update package.json license to be consistent with license in project. Add note within readme about IE11 compatability with method used - b027edfafa183117a8a2ef8bbbf566a0b70440e9

update readme - a710fc2ab8c6253b579018ade3b9625c4677c3e6

Change to ms prefixed method - 369a510abade9059b3027222e1b84b541a3e98f3

Added tests for 0 time (instant) scroll. - 34c32a40df77e8f50989e1b3f4cef423327746d2

Added passive: true to handlers - 772d67b4f31bb2d1d2c5d94548bc64b03afa3633


## 1.9.1 - Mon Sep 18 2017

Added logo - dd6b970852c321ed5bc39c6caa28ccd55827f64b

Correct logo - 2db2f10ec83186e54a658f3b7fcf7d50d151fbef

feat: Add iframe support - f667da5456f8c1f58335a15aa13f700fd87bbbe5

Change to .self check instead of pageXOffset - 307f257e23cd93541e1e2011278dfa51202b0a89

Fixed iframe usage - 29f4f9c5d41a5e33a921259cf7862b9bc7780e55


## 1.9.0 - Wed Jul 19 2017

settings.validScrollable - 8519abbdbacd5e2297ef66cb0b79180b073dccdc

add test for validScrollable - 0bf72315c349b5a7592a2bd0e5adaa6d1230a20b

move check for firefox outside of queue fn - 5ab285688752389d90799090d1fa6e8bf352af40

Pulled in vbarbarosh's changes, added isScrollable api - 2cd148fce31020c00a6216010c0e7bbb366bdade


## 1.8.3 - Wed Jul 12 2017

Fixed absolute positioning bug - 4ab91e7b5c4ec4469fad4a53d2f4f75304f3ff67


## 1.8.2 - Thu Jun 22 2017

Added built version - 4c78837d2d1b2031fd602bbc765b4250738616c8


## 1.8.1 - Thu Jun 22 2017

Fixed wrong variable name issue - db153b509cefbcd95d587e18287ead84f71c15ec


## 1.8.0 - Mon Apr 3 2017

Set fixed header height - 5ac918bb2b11b15da9614d5059202f6ba80be38f

align.leftOffset & align.topOffset can by used - 94d53223ca3b02bf62a92c19f310c5010a84ad80

Normalize offsets like align.top and friends - 998bb172330df69eb20d6192c0988586b2e3df53

Document topOffset and leftOffset - 2b134148f6ae28463dc39b9d47616a5672da0012

made pixel offset - 628a4b822749a5b23813def58e77e9aec2ef2e74


## 1.7.6 - Thu Mar 23 2017

Remove erroneous apostrophe from README - 096ec4b47df4706383fd0c3d4714cc68defd67d1

Fixed logical check for validTarget - 956ee6f7eb227184eb1c2dea11677e01a00fdab5

Cleanup - b25c2ca8133c957d869751d34f1da4a1358dc041


## 1.7.5 - Mon Feb 20 2017

Use window.pageYOffset over window.scrollY has it is cross browser - 32d17d590ef5357bfe8da85ed0db87eebd9d6d9e

Updated built files - db06d859fafe48339e2a45d32acb88a7b7337ea3


## 1.7.4 - Wed Feb 8 2017

generified the readme even more - b496e308cecb04d141eb9bdafe3151152e77bd82


## 1.7.3 - Mon Feb 6 2017

Removed log - 1ceac5fd183105ffdbc4e03e4db24cb0a43b4343


## 1.7.2 - Mon Feb 6 2017

Readability - 7360f656ae6ed38f618a89002893aeff83b5c59b

Updated readme, fixed easing kinda, resolves #12 - 6c6ac24ba3169bc55307da72e6f597913bb345fc

fixed example - bd044d80f0766ac3a96026920ece3c73d10dc946

Updated example link - 05f4373095d643bab4b5908c8de27f30d5d0aba7

Fixed leaking touchstart handler - 5095dffd8aeda2073714faa48b27c844c8418750


## 1.7.1 - Fri Aug 5 2016

included built files - f9e795884cd8fc85ebb9261fe3564d69a68d7eb0

allowed 0 animation time. Resolves #1 - 613b4f81f68a19b13a9ed4f6e700128f4177fcfd


## 1.7.0 - Tue Jul 19 2016

timing improvements, example, readme updates - 55909c9188472a4377d065b7f724a95bf506b22d


## 1.6.0 - Fri Oct 9 2015

Added callback complete type - 69e83afafadddec6c66c22dbc213a51e47116d92


## 1.5.0 - Mon Aug 31 2015

Improved linarity of tween, also set to the final position on complete - 9e1603288bcf2e20c451856c5b7db25da4038878


## 1.4.0 - Mon Aug 31 2015

Updated test command and readme - 7bea8dd2f237d08e34885657995f99ef7aecea13

Added align setting - 61145e7cb6e0f2a2c104e62abc09a0d5b2de6566


## 1.3.1 - Thu Aug 13 2015

Failing test for body clientHeight < scrollHeight - 3624e49e36f890bfdbfef1859e0e285a5fb0aba8

Fix for body clientHeight < scrollHeight - df551e8d14d7f36ca589a1ae8ae6591067c05cbe


## 1.3.0 - Tue Aug 11 2015

Revert "scroll into view should break out of parent scroll when it matches a scrollable element" - 59217a2fcc6bd771f2d936770a6559eaa2956f12

Use raf polyfill - de3c568754faef9161bcabf6c8b08c0d252a13d7


## 1.2.0 - Tue Jun 30 2015

Added ability to skip scrolling certain elements based on a function. Resolves #6 - 744b1d8eb8ed54b3827cab4752401b05972cb220


## 1.1.1 - Tue Jun 30 2015

Added cancel on touchstart - 5c6405f12c93e35094436f18c14fcc74886771de


## 1.1.0 - Tue Jun 30 2015

scroll into view should break out of parent scroll when it matches a scrollable element - d0bee1632d923e973902e5f578e6f059e3d5caa7

Improved animation, cancel handling - 89710ddbead2e184c8de7119cf34ba67654fd1b6


## 1.0.7 - Wed Jul 23 2014

Fixed offset issue - 6d0ee655756b2da14fa46e3d0a3211723780a52f


## 1.0.6 - Wed Jul 23 2014

Fixed window alignment issue - 2ccf5b702553c5e0d50ac1f24e20e12763e369e0


## 1.0.5 - Wed Jul 23 2014

Add LICENSE file via addalicense.com - 184d142bf3a6629b68bce1ece391bcef90c68ea5

Updated package.json & removed "bad" file. - 49752e0c5cf0f7b965dda0338e65598f1a7d8434


## 1.0.4 - Fri Mar 28 2014

Removed debug, improved scrolling finctionality - 78d8c39f926b02bb0603d302bd3dce0c75efc131


## 1.0.3 - Fri Mar 28 2014

Fixed issue where all parents would be scrolled - 901dd1639ccf4a227e53078313cd830da80273cc


## 1.0.2 - Fri Mar 28 2014

Transitions to loction - 3b056a5eafb1b3d8ea339e24483df87a0ae9d217


## 1.0.1 - Fri Mar 28 2014

trying to fix implementation - fab21e106b84f54a9f5eb8e7258883d4e8cd31f0

Working - 6f60b2819c6ee207785b136b35ec0a08830917aa


## 1.0.0 - Thu Mar 27 2014

removed log, added readmed - 97f3d9daea390f933f2f5ca678f2831ecb33d681


## 0.0.1 - Sun Nov 3 2013

initial commit - 2a5cbfc9f41fad86d3bd97c58af652a3894f7d25


