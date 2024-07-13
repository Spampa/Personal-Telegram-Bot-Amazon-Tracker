const cron = require('node-cron');
const { getUserProducts } = require('../services/userProductService');
const { getProduct, addProduct } = require('../services/productService');
const { addDataProduct, getLastDataProduct } = require('../services/productDataService');

const scraping = require('../utils/scraping/scraping');
const imageComposer = require('../utils/imageComposer');

async function checkProducts(socket) {
    const trackProducts = await getUserProducts();
    
    for(const trackProduct of trackProducts) {
        const data = await scraping(trackProduct.link);
        const product = await getProduct(data.id);

        if(!product) {
            await addProduct(data);
            await addDataProduct(data);
            const image = await imageComposer(data);
            socket.emit('product', {
                chat: trackProduct.chat_id,
                product: data,
                image: image
            });
        }
        else{
            const last = await getLastDataProduct(data.id);
            if(last.price !== data.price) {
                await addDataProduct(data);
                const image = await imageComposer(data);
                socket.emit('product', {
                    chat: trackProduct.chat_id,
                    product: data,
                    old: {
                        price: last.price,
                        standardPrice: last.standard_price,
                        discount: last.discount,
                        currency: last.currency
                    },
                    image: image
                });
            }
        }
    }
}

module.exports = async (socket) => {
    console.log(new Date().toISOString().slice(0, 19).replace('T', ' ') + ' - Started Tracking');
    //await checkProducts(socket);
    console.log(new Date().toISOString().slice(0, 19).replace('T', ' ') + ' - End Tracking');
    cron.schedule('*/10 * * * *', async () => {
        console.log(new Date().toISOString().slice(0, 19).replace('T', ' ') + ' - Started Tracking');
        //await checkProducts(socket);
        console.log(new Date().toISOString().slice(0, 19).replace('T', ' ') + ' - End Tracking');
    });
}