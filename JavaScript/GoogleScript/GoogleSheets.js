/**
 * appsscript script to run in a google spreadsheet that synchronizes its contents with a fusion table by replacing all rows.
 * based on instructions here: 
 * https://htmlpreview.github.io/?https://github.com/fusiontable-gallery/fusion-tables-api-samples/blob/master/FusionTablesSheetSync/docs/reference.html#enabling_advanced_services
 *
 *IMP: Modified for special need to remove all formatting 
 *
 */

//Requirnment : Enabled fusion table scope in your google app script
// replace with your fusion table's id (from File > About this table)


var TABLE_ID = 'YOUR TABLEID';


// first row that has data, as opposed to header information
var FIRST_DATA_ROW = 2;

// true means the spreadsheet and table must have the same column count
var REQUIRE_SAME_COLUMNS = false;

/**
 * replaces all rows in the fusion table identified by TABLE_ID with the
 * current sheet's data, starting at FIRST_DATA_ROW.
 */
function sync() {
    var tasks = FusionTables.Task.list(TABLE_ID);  
    // Only run if there are no outstanding deletions or schema changes.
    if (tasks.totalItems === 0) {
        var sheet = SpreadsheetApp.getActiveSheet();
      sheet.clearFormats();
        var wholeSheet = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn());
      wholeSheet.setNumberFormat('@STRING@'); //Required to get plain text and remove all formating 
        var values = wholeSheet.getValues();
   
        if (values.length > 1) {
            var csvBlob = Utilities.newBlob(convertToCsv_(values), 'application/octet-stream');
            FusionTables.Table.replaceRows(TABLE_ID, csvBlob, { isStrict: REQUIRE_SAME_COLUMNS, startLine: FIRST_DATA_ROW - 1 });
            Browser.msgBox('Replaced ' + values.length + ' rows in your Fusion Table', Browser.Buttons.OK);
        }
      deleteDocByName();
      
      
    } else {
        Logger.log('Skipping row replacement because of ' + tasks.totalItems + ' active background task(s)');
    }
};

/**
 * converts the spreadsheet values to a csv string.
 * @param {array} data the spreadsheet values.
 * @return {string} the csv string.
 */
function convertToCsv_(data) {
    // See https://developers.google.com/apps-script/articles/docslist_tutorial#section3
   // Loop through the data in the range and build a string with the CSV data
  try {
    if (data.length > 1) {
      var csv = "";
      for (var row = 0; row < data.length; row++) {
        for (var col = 0; col < data[row].length; col++) {
          if (data[row][col].toString().indexOf(",") != -1) {
            data[row][col] = "\"" + data[row][col].toString() + "\"";
          }
        }

        // Join each row's columns
        // Add a carriage return to end of each row, except for the last one
        if (row < data.length-1) {
          csv += data[row].join(",") + "\r\n";
        }
        else {
          csv += data[row];
        }
      }
      csvFile = csv;
    }
    return csvFile;
  }
  catch(err) {
    Logger.log(err);
    Browser.msgBox(err);
  }
}
