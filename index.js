const { makeBadge } = require('./modded_deps/badge-maker')
const feather = require("feather-icons")
const simple = require("simple-icons")
const oct = require("@primer/octicons")
const localIcon = require("./local_logos")
const app = require("express")()

let featherSlugs = Object.keys(feather.icons)
let simpleSlugs = Object.keys(simple)
let octSlugs = Object.keys(oct)

app.use((req, res, next) => {
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    next()
})

app.get("/", (req, res) => {
    res.send(`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Badge Generator API Documentation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
            }
    
            h1 {
                color: #333;
            }
    
            .endpoint {
                margin-top: 20px;
            }
    
            .param {
                margin-bottom: 10px;
            }
        </style>
    </head>
    
    <body>
        <h1>Badge Generator API Documentation</h1>
    
        <div class="endpoint">
            <h2>Endpoint: <code>/badge</code></h2>
            <p>
                This endpoint generates a dynamic badge image in SVG format based on the query parameters provided.
                The generated badge includes a customizable label, message, colors, style, logo, and optional left and right links.
            </p>
    
            <div class="param">
                <h3>Request Parameters:</h3>
                <ul>
                    <li><strong><code>label</code></strong> (optional, default: empty string): The text to be displayed as the label on the badge.</li>
                    <li><strong><code>message</code></strong> (optional, default: empty string): The main message displayed on the badge.</li>
                    <li><strong><code>labelColor</code></strong> (optional, default: <code>'grey'</code>): The color of the label text.</li>
                    <li><strong><code>color</code></strong> (optional, default: <code>'lightgrey'</code>): The background color of the badge.</li>
                    <li><strong><code>style</code></strong> (optional, default: <code>'flat'</code>): The style of the badge. Possible values: <code>'flat'</code>, <code>'plastic'</code>, <code>'flat-square'</code>.</li>
                    <li><strong><code>logo</code></strong> (optional): The name of the logo to be displayed on the badge.</li>
                    <li><strong><code>logoColor</code></strong> (optional): The color of the logo image.</li>
                    <li><strong><code>linkLeft</code></strong> (optional, default: <code>'https://katze.click'</code>): The URL linked to the left side of the badge.</li>
                    <li><strong><code>linkRight</code></strong> (optional, default: <code>'https://github.com/de-katze/badger'</code>): The URL linked to the right side of the badge.</li>
                </ul>
            </div>
    
            <div class="param">
                <h3>Example Usage:</h3>
                <p>GET /badge?label=Example&message=Badge&labelColor=blue&color=green&style=flat&logo=oct-logo-github&logoColor=red&linkLeft=https://example.com/left&linkRight=https://example.com/right</p>
                <img src="/badge?label=Example&message=Badge&labelColor=blue&color=green&style=flat&logo=oct-logo-github&logoColor=red&linkLeft=https://example.com/left&linkRight=https://example.com/right" />
            </div>
    
            <div class="param">
                <h3>Response:</h3>
                <p>The response is an SVG image representing the badge based on the provided parameters.</p>
            </div>
    
            <div class="param">
                <h3>Example Response:</h3>
                <pre>
                    &lt;svg xmlns="http://www.w3.org/2000/svg" width="110" height="20" viewBox="0 0 110 20"&gt;
                        &lt;!-- SVG content representing the generated badge --&gt;
                    &lt;/svg&gt;
                </pre> 
            </div>
        </div>
    </body>
    
    </html>
    `)
})

app.get("/badge", (req, res) => {
    const {
        label,
        message,
        labelColor,
        color,
        style,
        logo,
        logoColor,
        linkLeft,
        linkRight
    } = req.query
    res.setHeader("content-type", "image/svg+xml")
    res.send(makeBadge(getLogo({
        label: label || '',
        message: message || '',
        labelColor: labelColor || 'grey',
        color: color || 'lightgrey',
        style: style || 'flat',
        links: [linkLeft || "https://katze.click", linkRight || "https://github.com/de-katze/badger"]
    }, logo || "", logoColor)))
})

app.get("/slugs", (req, res) => {
    res.send({
        ["feather-icons"]: featherSlugs,
        ["simple-icons"]: simpleSlugs,
        ["octicons"]: octSlugs,
        ["local-icons"]: localIcon.logos
    })
})

app.listen(3000)

function getLogo(data, name, color) {
    if (name.length == 0) {
        return data
    }

    if (name.startsWith("ft-") && feather.icons[name.replace("ft-", "")]) {
        data.logo = encode(feather.icons[name.replace("ft-", "")].toSvg({ color: color || "#FFFFFF" }))
        return data
    } else if (name.startsWith("oct-") && oct[name.replace("oct-", "")]) {
        data.logo = encode(oct[name.replace("oct-", "")].toSVG({ "fill": color || "#FFFFFF", "xmlns": "http://www.w3.org/2000/svg" }))
        return data
    } else if (name.startsWith("si-") && simple[name.replace("-", "")]) {
        data.logo = encode(simple[name].svg.replace(`<svg role="img"`, `<svg role="img" fill="${color || `#${simple[name].hex}`}"`))
        return data
    } else if (name.startsWith("local-")) {
        data.logo = encode(localIcon.get(name.replace("local-", ""), color))
        return data
    }

    return data
}

function encode(svg) {
    return `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`;
}