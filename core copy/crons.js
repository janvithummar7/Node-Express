const path = require('path');
const fs = require('fs');


    const crons = {}
    const cronsPath = path.join(__dirname,"../crons");
    if (fs.existsSync(cronsPath)) {
        const cronsFiles = fs.readdirSync(cronsPath);
        cronsFiles.forEach(file => {
            if (file.endsWith('.js')) {
                const cronName = path.basename(file, '.js');
                const cronModule = require(path.join(cronsPath, file));
                crons[cronName] = cronModule;
            }
        });
    }


module.exports = crons;
