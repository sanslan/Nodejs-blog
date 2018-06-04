var Handlebars = require('handlebars');
var exphbs  = require('express-handlebars');
Handlebars.registerHelper('if_eq', function (a, b, str) {
    if (JSON.stringify(a) == JSON.stringify(b)) // Or === depending on your needs
      return str;
    else
      return "";
});
  
module.exports = (app) =>{
    app.engine('hbs', exphbs({
        defaultLayout: 'main',
        extname: '.hbs',
        helpers: {
        striptScript: context =>  {return new Handlebars.SafeString(context)},
        cutText: context =>{
            return context.substring(0,350)+ "...";
        },
        math: function (lvalue, operator, rvalue) {
            lvalue = parseFloat(lvalue);
            rvalue = parseFloat(rvalue);
            return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
            }[operator];
        }
        }
    }));
    app.set('view engine', 'hbs');
}