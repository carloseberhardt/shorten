import { GraphQLClient, gql } from 'graphql-request'

const { STEPZEN_URL, STEPZEN_KEY, API_KEY } = process.env
const REFERERS=["https://shorten.c3b.dev/", "http://localhost:3000/"]

const graphQLClient = new GraphQLClient(STEPZEN_URL, {
    headers: {
        authorization: `Apikey ${STEPZEN_KEY}`
    }
})

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

    let u = req.query.u
    let q = encodeURIComponent(req.query.q)
    let v = encodeURIComponent(req.query.v)
    let link = `${u}&query=${q}&variables=${v}`

    let query = gql`
    {
        createShortLink(
            apiKey: "${API_KEY}"
            domainUriPrefix: "https://sztry.page.link"
            link: "${link}"
            suffixOption: "SHORT"
        ) {
            shortLink
        }
    }
    `
    
    try {
        const data = await graphQLClient.rawRequest(query)
        console.log(JSON.stringify(data))
        res.statusCode = 200
        res.json(data.data)
    } catch (error) {
        console.error("error:", error)
        res.statusCode = 500
        res.send("Server Error")
    }
}