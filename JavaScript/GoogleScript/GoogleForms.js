//Google form responses will be stored in google sheet. deleteOldLogs() will clear all submissions submitted before time of script execution.
//This assumes forms generate timestamps and which is in first column
function deleteOldLogs() {
  //Get active spreadsheet. Add this function into sheet script editor
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();  //Get all data
  var today = new Date(); //Get current date 
  var now = today.getTime(); //Get time in milliseconds
// Leaves row 0 as it is header
  for(n=data.length-1;n>0;--n){
    var newDate = new Date(data[n][0]) //Create new date with timestamp. Change '0' if timestamp is not in first column
    var dataTime = newDate.getTime();  
    if ( dataTime < now) { //check if it is less than current time
      data.splice(n,1); //Clear cells
    }
  }
  sheet.clearContents(); // Get rid of old contents, then write new
  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
}
