
const globby = require('globby')
const resemble = require('node-resemble-js')
const fs = require('fs')
const PNG = require('pngjs').PNG
const pargs = process.argv
const diffDir = './test/__screenshots-diff__/'

const srcImgs = pargs[2]
const compareImgs = pargs[3]

function removePattern(str) {
  return str.split('*.png').join('')
}

globby(srcImgs).then((files) => {
  files.forEach((file) => {
    // Read source
    fs.readFile(file, (err, data) => {
      // Read new
      const srcPng = PNG.sync.read(data)
      const file2 = file.replace(removePattern(srcImgs), removePattern(compareImgs))
      const diffFile = file.replace(removePattern(srcImgs), diffDir)
      console.log(diffFile);
      fs.readFile(file2, (err2, data2) => {

        resemble(file).compareTo(file2).onComplete(function(data) {
          console.log(data);
          const diffImg = data.getDiffImage().pack().pipe(fs.createWriteStream(diffFile));
        });
        // var diff = new PNG({width: srcPng.width, height: srcPng.height});
        // pixelmatch(data, data2, diff.data, srcPng.width, srcPng.height)
        // console.log(diff.data);
        // diff.pack().pipe(fs.createWriteStream(diffFile));
      })
    })
  })

}).catch((e) => {
  console.log(e);
})

// pixelmatch(img1, img2, diff, 800, 600, {threshold: 0.1})
