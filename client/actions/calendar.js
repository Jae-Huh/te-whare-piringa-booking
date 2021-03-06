export function switchDate (date) {
  return {
    type: 'SWITCH_DATE',
    date
  }
}

export function makeNewBooking (dateStart, dateEnd) {
  return {
    type: 'NEW_BOOKING',
    dateStart,
    dateEnd
  }
}

export function setNewBooking (startTime, endTime) {
  return {
    type: 'SET_BOOKING',
    startTime,
    endTime
  }
}

export function clicked () {
  return {
    type: 'CLICKED'
  }
}
