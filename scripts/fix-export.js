const globby = require('globby')
const spawn = require('child_process').spawnSync
const config = require('../next.config.js')

const fs = require('fs-extra')

const prefix = config.assetPrefix

globby(`out/**/page`).then((files) => {
  const folder = files[0]
  const newFolder = folder.split('/page').join(prefix)
  console.log('Copying: ', folder, newFolder);
  fs.copySync(folder, newFolder)
  fs.moveSync(newFolder, folder + prefix)
  return files
}).catch((e) => {
  console.log(e)
})
