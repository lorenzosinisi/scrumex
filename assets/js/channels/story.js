import { Socket } from "phoenix"

// import ChannelStory from '../channels/story'
// use it adding this `const channel = new ChannelStory(userToken, Poll/List/Issue id)``
// to your components

class ChannelStory {
  
  constructor(userToken, issueId) {
    if (userToken && issueId) {
      this.socket  = this._createSocket(userToken)
      this.channel = this._setupIssueChannel(issueId)
    }
    return this.channel
  }

  _createSocket(userToken) {
    let socket = new Socket("/socket", {params: { token: userToken }})
    // And then connect to it
    socket.connect()
    // When we successfully open the connection, log out to the console that
    // we succeeded.
    socket.onOpen(() => console.warn("Connected to user Socket!"))
    // And return out the socket
    return socket
  }

  _setupIssueChannel(issueId) {
    // Call our createSocket() function above and store the created socket
    let socket = this.socket
    // And grab the id of the poll we're subscribing to
    // Next, specify that we want to join a polls channel of the polls: with the poll id.
    // Remember our code in PollChannel.ex that looked like: "polls:" <> poll_id
    let pollChannel = socket.channel("polls:" + issueId)
    // Finally, join the channel we created. On success, let the console know that we joined.
    // On failure, tell us why it errored out.
    pollChannel
      .join()
      .receive("ok", resp => { console.log("Joined") })
      .receive("error", reason => { console.log("Error: ", reason) })

    pollChannel.on("new_vote", vote => {
      // Update the voted item’s display
      console.log("WEBSOCKET vote =>", vote)
    })

    pollChannel.on("consensus", consensus => {
      console.log("WEBSOCKET consensus =>", consensus)
    })

    pollChannel.on("close_poll", poll => {
      console.log("WEBSOCKET close_poll =>", poll)
    })
    // Finally, return the whole channel we've created; we'll need that to push
    // messages out later.

    return pollChannel
  }
}

export default ChannelStory