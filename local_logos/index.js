const { readFileSync } = require("fs")
const { join } = require("path")

const logos = ["hop"]

module.exports = {
    logos,
    get: (logoName, color) => {
        let logo = "";
    
        if (logos.includes(logoName)) {
            logo += readFileSync(join(__dirname, "logos", logoName + ".svg"))
        }
    
        logo = logo.replace(`fill="#000000"`, `fill="${decodeURIComponent(color)}"`)

        return logo
    }
}