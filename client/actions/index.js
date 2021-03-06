import {login} from '../api'

export const BOOKINGPOSTED = 'BOOKINGPOSTED'
export const RECEIVE_BOOKINGS = 'RECEIVE_BOOKINGS'
export const UNCONFIRMED = 'UNCONFIRMED'
export const WAITING = 'WAITING'
export const NOT_WAITING = 'NOT_WAITING'
export const ADMINSUCCESS = 'ADMINSUCCESS'
export const ERROR = 'ERROR'
export const EMAIL_CHANGED = 'EMAIL_CHANGED'
export const VALIDATION_ERROR = 'VALIDATION_ERROR'
export const CLEAR_ERROR = 'CLEAR_ERROR'

export function newBooking (data) {
  return dispatch => {
    dispatch(gettingData())
    login('post', '/user/addbooking', data)
      .then(res => {
        if (res.body.error) return dispatch(errorHandler(res.body.error))
        dispatch(bookingPosted(res.body.booking))
        dispatch(receiveBookings(res.body.bookings))
        dispatch(receivedData())
        // sendEmail(res.body.booking)
      })
  }
}

// function sendEmail (data) {
//   login('post', '/sendemail', data)
//     .then(f => f)
// }

// function sendConfirm (data) {
//   login('post', '/sendconfirm/', data)
//     .then(f => f)
// }

// function deleteEmail (data) {
//   login('post', '/deleteemail', data)
//     .then(f => f)
// }

function bookingPosted (booking) {
  booking.startDate = new Date(booking.startDate)
  booking.endDate = new Date(booking.endDate)
  return {
    type: BOOKINGPOSTED,
    booking
  }
}

export const receiveBookings = bookings => {
  bookings = bookings.map(booking => {
    booking.startDate = new Date(booking.startDate)
    booking.endDate = new Date(booking.endDate)
    return booking
  })
  bookings.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
  return {
    type: RECEIVE_BOOKINGS,
    bookings
  }
}

export function errorHandler (error) {
  return {
    type: ERROR,
    error
  }
}

export const gettingData = () => {
  return {
    type: WAITING
  }
}

export const receivedData = () => {
  return {
    type: NOT_WAITING
  }
}

export function confirm (id) {
  return dispatch => {
    dispatch(gettingData())
    login('put', `/admin/confirm/${id}`)
      .then(res => {
        dispatch(receivedData())
        if (res.body.result) {
          res.body.bookings.find(item => {
            // if (item._id === id) {
            //   dispatch(sendConfirm(item))
            // }
            dispatch(receiveBookings(res.body.bookings))
          })
        }
      })
  }
}

export function deleteBooking (booking) {
  return dispatch => {
    dispatch(gettingData())
    login('delete', '/admin/delete/', booking)
      .then(res => {
        dispatch(receivedData())
        if (res.body.result) {
          return dispatch(receiveBookings(res.body.bookings))
        }
      })
  }
}

export function makeAdmin (email) {
  return dispatch => {
    dispatch(gettingData())
    login('put', `/admin/makeadmin/${email}`)
      .then(res => {
        dispatch(receivedData())
        dispatch(adminSuccess(res))
      })
  }
}

function adminSuccess (res) {
  return {
    type: ADMINSUCCESS,
    res
  }
}

export function selectBooking (booking) {
  return {
    type: BOOKINGPOSTED,
    booking
  }
}

export function requestDelete (booking) {
  return dispatch => {
    dispatch(gettingData())
    login('put', '/user/requestdelete/', booking)
      .then(res => {
        dispatch(receivedData())
        // if (res.body.sendEmail) {
        //   deleteEmail(booking)
        // }
        if (res.body.bookings) {
          return dispatch(receiveBookings(res.body.bookings))
        }
      })
  }
}

export function emailAlertChange (email) {
  return dispatch => {
    dispatch(gettingData())
    login('put', '/admin/notificationemail', email)
      .then(res => {
        dispatch(receivedData())
        return dispatch(emailChanged(res))
      })
  }
}

function emailChanged (data) {
  return {
    type: EMAIL_CHANGED,
    data
  }
}

export function validationError (message) {
  return {
    type: VALIDATION_ERROR,
    message
  }
}

export function clearError () {
  return {
    type: CLEAR_ERROR
  }
}
