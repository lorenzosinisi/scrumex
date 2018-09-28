export class Team {
  constructor () {
    if (document.getElementById('app')) { return }
    // Set up the "Add Entry" button on the page
    this._setupAddMember()
    // And set up the "Remove Entry" buttons on the page
    this._setupRemoveMember()
  }
  _setupAddMember () {
    // When add entry is clicked, clone the top entry
    $('#add-member').on('click', this._cloneMember)
  }
  _setupRemoveMember () {
    // When remove entry is clicked, remove the appropriate row
    $('#members').on('click', 'a.remove-member', this._removeMember)
  }
  _removeMember (event) {
    if ($('.member').length > 1) { // there should always be one member
       // Find the target, find its parent row, and remove the whole thing
      $(event.currentTarget).parents('.member').remove()
    }
  }
  _cloneMember () {
    // Clone the top entry
    var newMember = $('#members .member:first').clone()
    // Reset its value to blank
    newMember.find('input[type=text]').val('')
    // And then throw it into the entry list
    newMember.appendTo('#members')
    // And then focus that text entry
    newMember.find('input[type=text]').focus()
  }
}
