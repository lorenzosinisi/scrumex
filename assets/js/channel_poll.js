// Import the Socket calls from phoenix.js
import { Socket } from 'phoenix'

export class ChannelPoll {
  constructor () {
    if (document.getElementById('app')) { return }
    let user_token = null

    if (document.querySelector('meta[name=user_token]')) {
      user_token = document.querySelector('meta[name=user_token]').content
    }

    if (user_token) {
      // If the element we're expecting doesn't exist on the page,
      // just exit out of the whole thing
      if (!$('#poll-id').length) { return }

      $('#poll-id').data().closed ? $('.vote-data').show() : $('.vote-data').hide()

      // Set up our channel for Polls
      let pollChannel = this._setupPollChannel(user_token)

      this._setupVoteButtons(pollChannel)

      this._setupClosePoll(pollChannel)
    }
  }

  _createSocket (user_token) {
    let socket = new Socket('/socket', {params: { token: user_token }})
    // And then connect to it
    socket.connect()
    // When we successfully open the connection, log out to the console that
    // we succeeded.
    socket.onOpen(() => console.log('Connected'))
    // And return out the socket
    return socket
  }

  _updateDisplay (entryId, count, voters) {
     // Iterate over each entry
    $.each($('div.entry'), (index, item) => {
      // Store the current item
      let li = $(item)
      // If the entry ids match, update the number of votes for that element
      if (entryId === li.data('entry-id')) {
        // Get the number of current votes, parse it as an integer, and add one
        // And update the display for that entry
        this._updateEntry(li, count, voters)
      }
    })
  }

  _setupPollChannel (user_token) {
    // Call our createSocket() function above and store the created socket
    let socket = this._createSocket(user_token)
    // And grab the id of the poll we're subscribing to
    let pollId = $('#poll-id').val()
    // Next, specify that we want to join a polls channel of the polls: with the poll id.
    // Remember our code in PollChannel.ex that looked like: "polls:" <> poll_id
    let pollChannel = socket.channel('polls:' + pollId)
    // Finally, join the channel we created. On success, let the console know that we joined.
    // On failure, tell us why it errored out.
    pollChannel
      .join()
      .receive('ok', resp => { console.log('Joined') })
      .receive('error', reason => { console.log('Error: ', reason) })

    pollChannel.on('new_vote', vote => {
      // Update the voted item’s display
      this._updateDisplay(vote.entry_id, vote.count, vote.voters)
    })

    pollChannel.on('consensus', consensus => {
      this._updateConsensus(consensus.poll_id, consensus.status)
    })

    pollChannel.on('close_poll', poll => {
      poll.closed ? this._closePoll(poll.id) : this._opnePoll(poll.id)
    })
    // Finally, return the whole channel we've created; we'll need that to push
    // messages out later.

    return pollChannel
  }
  _updateEntry (li, newVotes, voters) {
    // Find the .votes span and update it to whatever the new votes value is
    li.find('.votes').text(newVotes)
    li.find('.voters').text(voters)
  }

  _updateConsensus (poll_id, status) {
    var consensus_id = '#consensus_' + poll_id
    var translation = {true: 'Reached', false: 'Not reached'}
    var consensus_text = translation[status]
    consensus_text && $(consensus_id).text(consensus_text)
  }
  _setupVoteButtons (pollChannel) {
    // Set up our default click handler for votes
    $('.vote').on('click', event => {
      event.preventDefault()

      $.each($('.vote'), (index, item) => {
        item.style.background = $(item).data().background_color
      })

      // Find the containing list item
      let li = $(event.currentTarget).parents('div')
      // Grab the entry id for what the user voted on
      let entryId = li.data('entry-id')
      // And then push a new_vote message with the entry id onto the channel
      pollChannel.push('new_vote', { entry_id: entryId })
      event.currentTarget.style.background = $(event.currentTarget).data().background_active
    })
  }

  _setupClosePoll (pollChannel) {
    $('.close_poll').on('click', event => {
      event.preventDefault()
      // And the current poll
      let pollId = $('#poll-id').val()
      // And then push a new_vote message with the entry id onto the channel
      pollChannel.push('close_poll', { poll_id: pollId })
    })
  }

  _closePoll (poll_id) {
    $('.close_poll').text('Open')
    $('.vote').prop('disabled', true)
    $('#poll-id').data('closed', true)
    $('.vote-data').show()
  }

  _opnePoll (poll_id) {
    $('.close_poll').text('Close')
    $('.vote').prop('disabled', false)
    $('#poll-id').data('closed', false)
    $('.vote-data').hide()
  }
}
