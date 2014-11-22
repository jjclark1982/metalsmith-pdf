metalsmith-pdf
==============

PDF generator for metalsmith

## Installation

[Install wkhtmltopdf](http://wkhtmltopdf.org/downloads.html) on your system.

And install this plugin:

    $ npm install metalsmith-pdf

## Usage

All options other than `pattern` are passed directly to the [wkhtmltopdf options parser](http://wkhtmltopdf.org/usage/wkhtmltopdf.txt)

```JavaScript
var pdf = require('metalsmith-pdf');

metalsmith.use(pdf({
  pattern: "**/*.html",
  printMediaType: true,
  pageSize: "letter"
}));
```

## CLI Usage

All of the same options apply, just add them to the `"plugins"` key in your `metalsmith.json` configuration:

```JSON
{
  "plugins": {
    "metalsmith-pdf": {
      "pattern": "**/*.html",
      "printMediaType": true,
      "pageSize": "letter"
    }
  }
}
```

## License

  MIT
