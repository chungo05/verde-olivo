const fs = require('fs');

const file = '/home/mass/verde-olivo/lib/mock-data.ts';
let content = fs.readFileSync(file, 'utf8');

const validUrls = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
];

const newImagesString = 'image_url: ' + JSON.stringify(validUrls) + ',';
const newSingleImageString = 'image_url: [' + JSON.stringify(validUrls[0]) + '],';

// Replace array
content = content.replace(/image_url:\s*\[[\s\S]*?\],/g, (match) => {
    // If it's a single item array, keep it single, otherwise return the array of 5
    if (match.split(',').length < 3) {
        return newSingleImageString;
    }
    return newImagesString;
});

fs.writeFileSync(file, content);
console.log("Updated mock-data.ts");
