/**
 * The settings of the date picker on the board and add task sub page.
 */
const DATE_PICKER_SETTINGS = {
  format: "dd/mm/yyyy",
  autoclose: true,
  calendarWeeks: true,
  clearBtn: true,
  disableTouchKeyboard: true,
};

$(document).ready(() => setDatePickerSettings());

/**
 * Sets the properties from the 'DATE_PICKER_SETTINGS' JSON for the date picker on the board and add task sub page.
 */
function setDatePickerSettings() {
  $(".input-daterange").datepicker(DATE_PICKER_SETTINGS);
}