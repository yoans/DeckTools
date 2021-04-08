
const fs = require('fs');
const {parse, unparse} = require('papaparse');

fs.readFile("inventory.csv",(err,inv)=>{
    const invJson = parse(inv.toString());
    console.log(invJson);
    fs.readFile("nfs.csv",(err,nfs)=>{
        const nfsJson = parse(nfs.toString());
        console.log(nfsJson);
        let prevName = "";
        let copiesLeft = 0;
        const newInv = invJson.data.map((invLine)=>{
            const [number, _, name, ...rest] = invLine;
            if(prevName != name){
                copiesLeft = (nfsJson.data.find((line)=>line[1]==name)||[0])[0];
            }
            
            const tradeable = Math.max(number - copiesLeft,0)
            copiesLeft = Math.max(copiesLeft - number,0)
            
            prevName = name;
            return [number, tradeable , name, ...rest]
        })
        invJson.data = newInv
        
        fs.writeFile("invWithTrades.csv",unparse(invJson),()=>{console.log('done')});
    });

});