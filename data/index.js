const fs = require('fs');

async function main() {
    const config = await JSON.parse(fs.readFileSync('./les-arbres-plantes.json'));

    console.log(config[0])

    const newConfig = config.slice().map(arbre => {
        return {
            lat: arbre.geometry.coordinates[1],
            lon: arbre.geometry.coordinates[0],
            date: arbre.fields.dateplantation,
            category: arbre.fields.libellefrancais,
            address: arbre.fields.adresse,
            arrondissement: arbre.fields.arrondissement
        }
    });

    console.log(newConfig[0])
    fs.writeFileSync('./arbres.json', JSON.stringify(newConfig));
}

main();