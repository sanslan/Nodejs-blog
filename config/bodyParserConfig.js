var bodyParser = require('body-parser');
var methodOverride = require('method-override');
module.exports = (app) =>{
    app.use(bodyParser.urlencoded({ extended: false }))


    app.use(bodyParser.json())
    
    app.use(methodOverride('X-HTTP-Method'))          // Microsoft
    app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
    app.use(methodOverride('X-Method-Override'))      // IBM
    app.use(methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
    }))
}
