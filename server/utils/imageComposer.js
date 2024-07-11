const sharp = require('sharp');
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');

async function imageComposer(product) {
    const width = 1920;
    const height = 1080;

    try {
        const collage = sharp({
            create: {
                width,
                height,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 0 }
            }
        });

        const images = [
            `./assets/images/productTemplate.png`,
            `./assets/images/products/${product.id}.png`
        ];

        const imageBuffers = await Promise.all(
            images.map(image => getImageMetadata(image))
        );

        const positions = [
            { left: 0, top: 0 },
            { left: 250, top: height / 2 - imageBuffers[1].height / 2 }
        ];

        const composite = imageBuffers.map((data, i) => ({
            input: data.buffer,
            left: positions[i].left,
            top: positions[i].top
        }));
        
        const collageBuffer = await collage.composite(composite).png().toBuffer();
        const finalBuffer = await addText(collageBuffer, width, height, product);

        return finalBuffer;
    }
    catch (e) {
        console.log(e);
    }

}

async function addText(collage, width, height, product) {
    //registerFont('./assets/fonts/Roboto-Regular.ttf', { family: 'Roboto' });
    //registerFont('./assets/fonts/Roboto-Bold.ttf', { family: 'Roboto', weight: 'bold' });
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const img = await loadImage(collage);
    ctx.drawImage(img, 0, 0, width, height);

    ctx.font = 'bold 160px Roboto';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(product.price + product.currency, width / 2 + 350, height / 2 + 50);

    if(product.discount !== 0){
        //standard price
        ctx.font = '60px Roboto';
        ctx.fillStyle = 'grey';
        ctx.textAlign = 'center';
        ctx.fillText(product.standardPrice + product.currency, width / 2 + 350, height / 2 - 100);

        //add line over the standard price
        ctx.beginPath();
        ctx.moveTo(width / 2 + 350 - 120, height / 2 - 121);
        ctx.lineTo(width / 2 + 350 + 120, height / 2 - 121);
        ctx.strokeStyle = 'grey';
        ctx.lineWidth = 3;
        ctx.stroke();

        //discount
        ctx.font = 'bold 120px Roboto';
        ctx.rotate((-27 * Math.PI) / 180);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'start';
        ctx.fillText(`-${product.discount}%`,37, 280);
    }

    return canvas.toBuffer('image/png');
}

async function getImageMetadata(path) {
    const image = sharp(path);
    const metadata = await image.metadata();
    return {
        buffer: await image.toBuffer(),
        width: metadata.width,
        height: metadata.height
    }
}

module.exports = imageComposer;