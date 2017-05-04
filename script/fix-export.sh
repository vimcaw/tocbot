#!/bin/bash

grep --regexp=/*html$/ -rnl './site' -e "/app.js" | xargs -i@ sed -i 's/\/app\.js/\/tocbot\/app\.js/g' @
