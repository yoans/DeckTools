console.log("start")
const axios = require('axios');
const fs = require('fs');
const {parse, unparse} = require('papaparse');
jsonDecks = {
    data:[],
    errors:[]
}
const decks = [

        'e6e6e24a-0cc1-4222-a7dc-d942e3ce78fe',
        '32af5825-8477-4915-ab58-892575b5c711',
        'c894513e-7826-4494-9776-08cf39019708',
        'f07557e9-b925-4163-abff-0d14f000d278',
        '77255518-6a2d-49e4-ad33-860b5841932f',
        '2e3712e3-3215-4300-8515-4ea20a195237',
        '25fa6d1b-af69-4ab0-a351-117ff9fdbfbb',
        '5d417029-dbc6-45d1-9e64-fff2568f5e0e',
        'c45a5c23-8aa6-44c8-8dd1-7b4fce5d7bba',
        '9ef15160-b69f-409b-b5b6-41e556eef089',
        '3166881c-d8bd-44e0-9a15-eaf60fcc0def',
        'b8364a1a-477c-42a0-9064-b5c15ece2ef7',
        '2b3d0fd5-40ed-4822-9edb-55d9d0206029',
        '8b77a0a9-bc8f-483c-8aea-320ad4298624',
].map((deckGuid)=>{

    return axios({
        method: "get",
        url: `https://api.scryfall.com/decks/${deckGuid}/export/csv`,
        responseType: "blob"
    }).then(function (response) {
        console.log("done with " + deckGuid);
        return parse(response.data);
    }).catch(err=>{console.log(err)});
    
})
decks.forEach((deckPromise)=>{
    deckPromise.then((deck)=>{
        jsonDecks.data[0] = deck.data ? deck.data[0] : [];
        jsonDecks.errors = jsonDecks.errors.concat(deck.errors);
        jsonDecks.meta = deck.meta;
        jsonDecks.data = jsonDecks.data.concat(deck.data.slice(1));
    })
});
Promise.all(decks).then(()=>{

    fs.writeFile("my.csv",unparse(jsonDecks),()=>{console.log('done')});
});
