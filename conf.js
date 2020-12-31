module.exports.documentRoot = '/home/zp/public_html/about';
module.exports.defaultIndex = 'index.html';
module.exports.port = 8145;
module.exports.headers = {
    txt: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
    },
    html: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
    },
    css: {
        'Content-Type': 'text/css',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
    },
    js: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
    },
    png: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache',
        'Access-Control-AllowOrigin': '*'
    },
    jpeg: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
    },
    json: {
        'Content-Type': 'image/sjon',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
    },
    sse: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive',
        "Transfer-Encoding": "chunked"
    }
};