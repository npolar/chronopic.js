# chronopic.js
Date/Time/Datetime JavaScript Widget

### Usage:
Chronopic is added to HTML elements by creating a new instance of *Chronopic* using a CSS selector string as the first parameter, and optionally a map of options as the second parameter:

```javascript
var chronopic = new Chronopic('input[type="date"]', {
  locale: 'nb_NO',                        // Use nb_NO as the default locale
  format: '{YYYY}-{MM}-{DD}',             // Use YYYY-MM-DD as output format
  min: { year: 2000, month: 2 },          // Set lower boundary to February 2000
  max: { year: 2020, month: 5, day: 12 }, // Set upper boundary to May 12. 2020
  onChange: function(elem, date) {        // Function called when date is changed
    console.log(elem, date);
  }
});

chronopic.locale = 'ja_JP';               // Change locale to ja_JP
```

### Constructor options:
Key           | Value                                       | Default
--------------|---------------------------------------------|--------------
**className** | CSS Class Name added to container           | *chronepic*
**format**    | Output format (or *null* for native format) | *null*
**locale**    | Name of locale being used                   | *en_GB*
**min**       | Object describing the minimum date          | *{ year: 0 }*
**max**       | Object describing the maximum date          | *{ year: 9999 }*
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
