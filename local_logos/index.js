const { readFileSync } = require("fs")
const { join } = require("path")

const logos = ["hop-type-black", "hop-icon", "hop-type-white",]

const logoPaths = {
    "hop-type-black": "Hop_black_typography_transparent.svg",
    "hop-icon": "Hop_icon_transparent",
    "hop-type-white": "Hop_white_typography_transparent.svg"
}

module.exports = {
    logos,
    get: (logoName, color) => {
        let logo = "";
    
        if (logos.includes(logoName)) {
            logo += readFileSync(join(__dirname, "logos", logoPaths[logoName] + ".svg"))
        }
    
        logo = logo.replace(`fill="#000000"`, `fill="${decodeURIComponent(color)}"`)

        return logo
    }
}