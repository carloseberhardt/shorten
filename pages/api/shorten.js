const fetch = require('node-fetch')
const { STEPZEN_URL, STEPZEN_KEY, API_KEY } = process.env
const REFERERS=["https://shorten.c3b.dev/", "http://localhost:3000/"]

async function shortenit(link) {
    const data = JSON.stringify({
        query: `mutation MyMutation {
            createShortLink(
              apiKey: "${API_KEY}"
              domainUriPrefix: "https://sztry.page.link"
              link: "${link}"
              suffixOption: "SHORT"
          ) {
              shortLink
          }
        }`
    }) 
    
    const response = await fetch(STEPZEN_URL, {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
            Authorization: `Apikey ${STEPZEN_KEY}`,
            'User-Agent': 'foolish-carlos'
        },
    })

    const json = await response.json()
    return json
}

export default async (req, res) => {
    // check sec-fetch-site header for same-origin
    if (req.headers["sec-fetch-site"] && req.headers["sec-fetch-site"] != "same-origin") {
        console.log("Not same-origin: ", req.headers["sec-fetch-site"])
        res.statusCode = 403
        res.send("FORBIDDEN")
        return
    } else if (! req.headers["sec-fetch-site"]) {
        // requiring sec-fetch-site header would current break on several popular browsers.
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Site
    }

    // check referer header for known referrers
    if (req.headers["referer"] && ! REFERERS.includes(req.headers["referer"])) {
        console.log("Bad referer: ", req.headers["referer"])
        res.statusCode = 403
        res.send("FORBIDDEN")
        return
    }

    // not very sophisticated
    var link
    let u = req.query.u
    let q = encodeURIComponent(req.query.q)
    if (req.query.v.trim().length > 0) {
        let v = encodeURIComponent(req.query.v)
        link = `${u}&query=${q}&variables=${v}`    
    } else {
        link = `${u}&query=${q}`
    }
    try {
        const data = await shortenit(link)
        console.log(JSON.stringify(data))
        res.statusCode = 200
        res.json(data.data)
    } catch (error) {
        console.error("error:", error)
        res.statusCode = 500
        res.send("Server Error:", error)
    }    
}