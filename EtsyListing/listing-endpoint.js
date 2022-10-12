const fetch = require('node-fetch')
const fs = require('fs');
const apiKey = require('../config/etsy-Keys').KEYSTRING;
const jsoncsv = require('json-csv');
const jsonexport = require('jsonexport');
const { Parser, transforms: { unwind, flatten } } = require('json2csv');
const { type } = require('os');

const headers = new fetch.Headers();
headers.append("Content-Type", "application/x-www-form-urlencoded");
headers.append("x-api-key", "531205z65h5aea1r2om4hkez");
headers.append("Authorization", "Bearer 26645336.hQ-SSWkSSI0WsxVSywRS7F4MRYmQmVrM-PzrT7w7NF0Uf-sMooadiPt_069mtbaKejon0Lcze_GPuFH5WQp_wIvkjE4");


const urlencoded = new URLSearchParams();
urlencoded.append("quantity", "5");
urlencoded.append("title", "Vintage Duncan Toys Butterfly Yo-Yo, Red");
urlencoded.append("description", "Vintage Duncan Yo-Yo from 1976 with string, steel axle, and plastic body.");
urlencoded.append("price", "1000");
urlencoded.append("who_made", "someone_else");
urlencoded.append("when_made", "1970s");
urlencoded.append("taxonomy_id", "1");
urlencoded.append("image_ids", "378848,238298,030076");
urlencoded.append("shipping_profile_id", "114006737830");

const requestOptions = {
    method: 'GET',
    headers: headers,
    // body: urlencoded,
    redirect: 'follow',
};
const pathEtsy = [];

fetch(`https://openapi.etsy.com/v2/taxonomy/seller/get?api_key=${apiKey}`, requestOptions)
    .then(response => response.json())
    .then(result => {
        const categories = result.results;

        categories.forEach(item => {
            item.children.forEach(child => {
                // console.log(child.path.split('.').join('>'))
                // console.log(child.children)
                child.children.forEach(childChildren => {
                    // console.log(childChildren.path.split('_').join(' ').split('.').join(' > '))
                    pathEtsy.push(childChildren.path)
                })
            })
        })
        // console.log(pathEtsy)

        // Flatten categories with recursion
        let flatResult = {};
        Object.flatten = function(data) {
            for(let i = 0; i < data.length; i++) {
                if(Array.isArray(data[i])) {
                    function recurse (cur, prop) {
                        if (Object(cur) !== cur) {
                            flatResult[prop] = cur;
                        } else if (Array.isArray(cur)) {
                             for(var i=0, l=cur.length; i<l; i++)
                                 recurse(cur[i], prop + "[" + i + "]");
                            if (l == 0)
                                flatResult[prop] = [];
                        } else {
                            var isEmpty = true;
                            for (var p in cur) {
                                isEmpty = false;
                                recurse(cur[p], prop ? prop+"."+p : p);
                            }
                            if (isEmpty && prop)
                                flatResult[prop] = {};
                        }
                    }
                    recurse(data, "");
                } else {

                }
            }
            // fs.writeFileSync("flat.csv", JSON.stringify(flatResult), { encoding: "utf8" });
            return flatResult;
        }
        Object.flatten(categories)
        const fields = [

            { value: "[0].id", label: "CATEGORY ID" },
            { value: "[0].name", label: "CATEGORY Name" },
            // { value: "[0].children[0].children[0].path", label: "Path" },
            // { value: "[0].children[0].children[0].attributeValueSets[0].displayName", label: "Name" },
            // { value: "[0].children[5].children[3].children[0].attributeValueSets[0].possibleValues[7]", label: "Name ID" },
            // { value: "aspects.aspectConstraint.aspectEnabledForVariations", label: "Enabled For Variations" },
            // { value: "aspects.aspectConstraint.aspectMode", label: "Mode" },
            // { value: "aspects.aspectConstraint.aspectRequired", label: "Required" },
            // { value: "aspects.aspectConstraint.aspectUsage", label: "Usage" },
            // { value: "aspects.aspectConstraint.itemToAspectCardinality", label: "Cardinality" },
        ];
        
        const transforms = [
            unwind({ paths: ["aspects", "aspects.aspectValues"] }),
        ];
        const json2csvParser = new Parser({ fields, transforms });
        const csv = json2csvParser.parse(flatResult);
        // fs.writeFileSync("EtsyCategoryValues.csv", csv, { encoding: "utf8" });
        // console.log("Done");
    })
    .catch(error => console.log('error', error));


    
module.exports = fetch
