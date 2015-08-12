# chronopic.js
Date/Time/Datetime JavaScript Widget ([demo](http://npolar.github.io/chronopic.js/demo/)).

### Usage:
Chronopic is added to HTML elements by creating a new instance of *Chronopic* using a CSS selector string as the first parameter, and optionally a map of options as the second parameter:

```javascript
var chronopic = new Chronopic('input[type="date"]', {
  locale: 'nb_NO',                        // Use nb_NO as the default locale
  format: '{D}. {MMMM} {YYYY}',           // Use D. MMMM YYYY as output format
  min: { year: 2000, month: 2 },          // Set lower boundary to February 2000
  max: { year: 2020, month: 5, day: 12 }, // Set upper boundary to May 12. 2020
  onChange: function(elem, date) {        // Function called when date is changed
    console.log(elem, date);
  }
});

// Invoke Chronopic with locale settings if lang attribute is set
new Chronopic('input[type="date"][lang="jp"]', { locale: 'ja_JP' });
new Chronopic('input[type="date"][lang="no"]', { locale: 'nb_NO' });
```

### Constructor options:
Key           | Value                                       | Default
--------------|---------------------------------------------|--------------
**className** | CSS Class Name added to container           | *chronopic*
**date**      | Pre-selected date object (or *null*)        | *null*
**format**    | Output format                               | *{YYYY}-{MM}-{DD}*
**locale**    | Name of locale being used                   | *en_GB*
**max**       | Date or object describing the maximum date	| *{ year: 2100 }*
**min**       | Date or object describing the minimum date	| *{ year: 1900 }*
**onChange**  | Callback function when value changes        | *null*

### Format values:
Code          | Replaced with
--------------|--------------
**{YYYY}**    | Year (four digits)
**{YY}**      | Year (two digits)
**{MMMM}**    | Month (full name)
**{MMM}**     | Month (short name)
**{MM}**      | Month (two digits)
**{M}**       | Month (one or two digits)
**{DDDD}**    | Day of week (full name)
**{DDD}**     | Day of week (short name)
**{DD}**      | Day of month (two digits)
**{D}**       | Day of month (one or two digits)
**{HH}**      | Hour (two digits, 24-hour format)
**{H}**       | Hour (one or two digits, 24-hour format)
**{hh}**      | Hour (two digits, 12-hour format)
**{h}**       | Hour (one or two digits, 12-hour format)
**{mm}**      | Minute (two digits)
**{m}**       | Minute (one or two digits)
**{ss}**      | Second (two digits)
**{s}**       | Second (one or two digits)
**{ap}**      | Day meridian (a.m. or p.m.)
**{ww}**      | Week number (two digits)
**{w}**       | Week number (one or two digits)
