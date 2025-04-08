const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 5000;
//fetching
app.use(cors({
    origin: "https://rajfreakinraushan.github.io"
  }));
  

// Define the /api/crypto endpoint
app.get('/api/crypto', async (req, res) => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,ripple,binancecoin,solana&vs_currencies=inr');
        const data = response.data;
        res.json({
            bitcoin: {
                inr: data.bitcoin.inr,
            },
            ethereum: {
                inr: data.ethereum.inr,
            },
            tether: {
                inr: data.tether.inr,
            },
            ripple: {
                inr: data.ripple.inr,
            },
            binancecoin: {
                inr: data.binancecoin.inr,
            },
            solana: {
                inr: data.solana.inr,
            },
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching crypto data');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
