// npm init
// <follow instructions>
// npm install cli-progress
// npm install yargs
// mkdir metadata

'use strict'
const ProgressBar = require('cli-progress')
const fs = require('fs')

const argv = require('yargs/yargs')(process.argv.slice(2))
    .usage('$0 <imgURI> <total> <images>', 'generate metadata using the given baseURI', (yargs) => {
        yargs.positional('imgURI', {
            describe: 'the imgURI for the image IPFS location',
            type: 'string'
        })
        yargs.positional('total', {
            describe: 'total NFT count',
            type: 'number'
        })
        yargs.positional('images', {
            describe: 'number of unique images ',
            type: 'number'
        })
    })
    .demandCommand(3)
    .argv

const progress = new ProgressBar.SingleBar({}, ProgressBar.Presets.legacy)

const createMetadata = (id, img, imgURI) => {
    return {
        "name": `Apes Aiding Apes #${id}`,
        "description": "Donation for the victims of war in Ukraine",
        "image": `ipfs://${imgURI}/${img}.png`,
        "edition": `${id}`
    }
}

const saveJsonFile = (path, content) => {
    fs.writeFileSync(path, JSON.stringify(content, null, 4))
}

progress.start(argv.total, 0)

for (let i=0; i<argv.total; i++) {
    let img = (i % argv.images) + 1
    let id = i + 1
    let metadata = createMetadata(id, img, argv.imgURI)
    saveJsonFile(`./metadata/${id}.json`, metadata)
    progress.increment()
}

progress.stop()