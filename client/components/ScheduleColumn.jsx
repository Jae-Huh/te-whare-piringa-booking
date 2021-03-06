import React from 'react'
import {connect} from 'react-redux'
import moment from 'moment'
// import {ModalContainer, ModalDialog} from 'react-modal-dialog'
import {clicked, setNewBooking} from '../actions/calendar'

class ScheduleColumn extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showDetails: false,
      booking: {},
      mouseDown: false,
      selectedTime: null
    }
    this.clicked = this.clicked.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.mousePressed = this.mousePressed.bind(this)
    this.mouseReleased = this.mouseReleased.bind(this)
    this.mouseEnter = this.mouseEnter.bind(this)
  }

  clicked (e, item) {
    if (item) {
      if (!item.fullName) return
      this.setState({
        showDetails: true,
        booking: item
      })
    } else {
      const dateString = e.target.id.substr(4)
      const date = new Date(moment(dateString, 'YYYY-MM-DD-HH-mm'))
      if (!this.props.mouse.clicked) {
        const date2 = new Date(moment(date).add(30, 'minutes'))
        this.props.setNewBooking(date, date2)
      } else {
        if (this.props.startTime > date) {
          this.props.setNewBooking(date, new Date(moment(this.props.startTime).add(30, 'minutes')))
        } else {
          this.props.setNewBooking(this.props.startTime, new Date(moment(date).add(30, 'minutes')))
        }
      }
      this.props.clicked()
    }
  }

  mousePressed (e) {
    if (!this.props.mouse.clicked) {
      const dateString = e.target.id.substr(4)
      const startTime = new Date(moment(dateString, 'YYYY-MM-DD-HH-mm'))
      this.setState({
        selectedTime: startTime,
        mouseDown: true})
      this.props.setNewBooking(startTime, new Date(moment(startTime).add(30, 'minutes')))
    }
  }

  mouseEnter (e) {
    if (this.state.mouseDown) {
      const dateString = e.target.id.substr(4)
      const endTime = new Date(moment(dateString, 'YYYY-MM-DD-HH-mm'))
      if (endTime > this.state.selectedTime) {
        this.props.setNewBooking(this.props.startTime, new Date(moment(endTime).add(30, 'minutes')))
      }
      if (endTime < this.state.selectedTime) {
        this.props.setNewBooking(endTime, new Date(moment(this.state.selectedTime).add(30, 'minutes')))
      }
    }
  }

  mouseReleased (e) {
    this.setState({
      mouseDown: false
    })
  }

  handleClose () {
    this.setState({
      showDetails: false
    })
  }

  render () {
    return (
    <div className={`schedule-column-container ${this.props.dayClass}`} >
      {this.getTimeSlots(new Date(moment(this.props.date)))}
      {this.state.showDetails &&
        <div>
          <table className='detailsTable'>
            <tr>
              <td><b>Name</b></td>
              <td>{this.state.booking.fullName}</td>
            </tr>
            <tr>
              <td><b>Email</b></td>
              <td>{this.state.booking.emailAddress}</td>
            </tr>
            <tr>
              <td><b>Phone</b></td>
              <td>{this.state.booking.phoneNumber}</td>
            </tr>
            <tr>
              <td><b>Purpose</b></td>
              <td>{this.state.booking.purpose}</td>
            </tr>
            <tr>
              <td><b>Requested on</b></td>
              <td>{moment(this.state.booking.dateAdded).format('YYYY-MM-DD HH:mm')}</td>
            </tr>
            <tr>
              <td><b>Start</b></td>
              <td>{moment(this.state.booking.startDate).format('YYYY-MM-DD HH:mm')}</td>
            </tr>
            <tr>
              <td><b>End</b></td>
              <td>{moment(this.state.booking.endDate).format('YYYY-MM-DD HH:mm')}</td>
            </tr>
            <tr>
              <td><b>Booking Confirmed</b></td>
              <td>{this.state.booking.confirmed ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <td><b>Delete Requested</b></td>
              <td>{this.state.booking.deleteRequested ? 'Yes' : 'No'}</td>
            </tr>
          </table>
        </div>
      }
    </div>
    )
  }

  getTimeSlots (d) {
    const dayArray = []
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 2; j++) {
        const selectedDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), i + 6, j * 30)
        let classNames = 'slot'
        let ptag = ''
        let toDisplay = null
        if (j === 1) {
          classNames += ' half-hour'
        } else {
          classNames += ' full-hour'
        }
        const dateFormatted = moment(selectedDate).format('YYYY-MM-DD-HH-mm')
        if (selectedDate >= this.props.startTime && selectedDate < this.props.endTime) {
          classNames += ' selected'
        }
        const booking = this.props.bookings.find(booking => {
          return booking.startDate <= selectedDate && booking.endDate > selectedDate
        })
        if (booking) {
          if (booking.confirmed) {
            classNames += ' confirmed'
          } else {
            classNames += ' reserved'
          }
        }
        toDisplay = this.props.bookings.find(booking => {
          return booking.startDate.getTime() === selectedDate.getTime()
        })
        if (toDisplay && toDisplay.fullName && !toDisplay.deleteRequested) {
          ptag = toDisplay.fullName
        }
        dayArray.push(<div key={dateFormatted} id={'slot' + dateFormatted} className={classNames} onClick={ e => this.clicked(e, booking)} onMouseDown={this.mousePressed} onMouseUp={this.mouseReleased} onMouseOver={this.mouseEnter}>{<div className='titleofevent'>{ptag}</div>}</div>)
      }
    }
    return dayArray
  }
}

function mapStateToProps (state) {
  return {
    startTime: state.newBooking.startTime,
    endTime: state.newBooking.endTime,
    mouse: state.mouse,
    bookings: state.bookings.filter(booking => !booking.deleteRequested)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    clicked: () => dispatch(clicked()),
    setNewBooking: (startTime, endTime) => dispatch(setNewBooking(startTime, endTime))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleColumn)
