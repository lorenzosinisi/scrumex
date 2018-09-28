import React, { Component } from "react"
import Button from "material-ui/Button"
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "material-ui/Dialog"

class AlertDialog extends Component {
  render() {
    const { question, dangerousAction, open, handleRequestClose } = this.props;

    return (
      <div>
        <Dialog open={open} onRequestClose={handleRequestClose}>
          <DialogTitle>{"Are you sure?"}</DialogTitle>
          <DialogContent>
            <DialogContentText>{question}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRequestClose} color="primary" autoFocus>
              No
            </Button>
            <Button onClick={dangerousAction} color="primary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default AlertDialog;
