const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000

app.get('/', (_, res) => res.send('hello express!'));

app.listen(PORT, () => {
    console.log('launching the express server!');
});